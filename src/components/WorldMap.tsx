import { FC, useState } from 'react';
import { JurisdictionId, Jurisdiction } from '../types';
import { JURISDICTIONS, APPROACH_METADATA } from '../data/jurisdictions';
import { REGULATIONS } from '../data/regulations';
import { 
  ExternalLink, 
  Layers, 
  Building2, 
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';

interface WorldMapProps {
  selectedJurisdictions: JurisdictionId[];
  onSelectJurisdiction: (id: JurisdictionId) => void;
  onOpenJurisdictionProfile: (id: JurisdictionId) => void;
  onSwitchToDirectory: (id?: JurisdictionId) => void;
}

export const WorldMap: FC<WorldMapProps> = ({
  selectedJurisdictions,
  onSelectJurisdiction,
  onOpenJurisdictionProfile,
  onSwitchToDirectory,
}) => {
  const [hoveredMarketId, setHoveredMarketId] = useState<JurisdictionId | null>(null);
  const [activeRegionFilter, setActiveRegionFilter] = useState<'all' | 'americas' | 'europe' | 'apac'>('all');

  const hoveredMarket: Jurisdiction | null = hoveredMarketId ? JURISDICTIONS[hoveredMarketId] : null;
  const hoveredRegulations = hoveredMarket
    ? REGULATIONS.filter((r) => r.jurisdictionId === hoveredMarket.id)
    : [];

  // Regional viewboxes for zoom presets
  const viewBoxes = {
    all: '0 0 1000 500',
    americas: '50 50 450 350',
    europe: '380 70 300 240',
    apac: '650 120 320 280',
  };

  const currentViewBox = viewBoxes[activeRegionFilter];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Map Header and Region Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Global Regulatory Map & Jurisdictional Posture
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Interactive Overview
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any market pin or territory to filter regulations or open its complete regulatory profile.
          </p>
        </div>

        {/* Region View Presets */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <span className="text-[11px] text-slate-400 px-2 font-medium">Zoom:</span>
          {(['all', 'americas', 'europe', 'apac'] as const).map((region) => (
            <button
              key={region}
              onClick={() => setActiveRegionFilter(region)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                activeRegionFilter === region
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              {region === 'all' ? 'World' : region === 'apac' ? 'Asia-Pacific' : region}
            </button>
          ))}
          {activeRegionFilter !== 'all' && (
            <button
              onClick={() => setActiveRegionFilter('all')}
              className="p-1 text-slate-400 hover:text-white"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full aspect-[2/1] min-h-[360px] max-h-[540px] bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-hidden select-none">
        {/* Subtle grid lines background */}
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
            backgroundSize: '40px 40px, 80px 80px, 80px 80px',
          }}
        />

        <svg
          viewBox={currentViewBox}
          className="w-full h-full transition-all duration-700 ease-out"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradients for illuminated markets */}
            <radialGradient id="glow-cyan" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="glow-blue" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="glow-emerald" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="glow-rose" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="glow-violet" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Base Continents Outlines (Simplified Natural World Map Paths) */}
          <g className="fill-slate-800/40 stroke-slate-700/40 stroke-[0.8]">
            {/* North America */}
            <path d="M120 70 L200 65 L260 85 L280 130 L260 170 L240 210 L190 240 L160 210 L120 180 L100 130 Z" />
            <path d="M150 250 L200 240 L210 270 L170 300 Z" /> {/* Central America */}
            <path d="M220 50 L310 40 L340 70 L280 90 Z" /> {/* Canada / Greenland */}

            {/* South America */}
            <path d="M220 300 L280 300 L320 340 L310 420 L270 470 L240 430 L220 350 Z" />

            {/* Europe */}
            <path d="M470 120 L530 110 L560 140 L530 190 L480 200 L450 170 Z" />
            {/* Scandinavia */}
            <path d="M500 80 L540 70 L530 110 L490 115 Z" />

            {/* Africa */}
            <path d="M460 210 L540 210 L570 280 L540 370 L490 400 L460 330 L440 250 Z" />

            {/* Asia Main */}
            <path d="M560 120 L660 100 L780 100 L880 140 L840 200 L760 250 L680 270 L600 240 L560 180 Z" />
            {/* India */}
            <path d="M660 230 L710 230 L690 300 L660 280 Z" />

            {/* Australia / Oceania */}
            <path d="M800 340 L880 340 L890 410 L820 420 L780 370 Z" />
          </g>

          {/* HIGHLIGHTED KEY JURISDICTIONS REGIONAL PATHS */}
          <g className="transition-all duration-300">
            {/* 1. United States Highlighted Boundary */}
            <path
              id="map-path-us"
              d="M130 130 L260 130 L250 180 L235 220 L165 220 L130 180 Z"
              className={`cursor-pointer transition-all duration-300 ${
                selectedJurisdictions.includes('us') || hoveredMarketId === 'us'
                  ? 'fill-blue-500/30 stroke-blue-400 stroke-2'
                  : 'fill-blue-500/15 stroke-blue-500/50 stroke-1 hover:fill-blue-500/25'
              }`}
              onMouseEnter={() => setHoveredMarketId('us')}
              onMouseLeave={() => setHoveredMarketId(null)}
              onClick={() => onSelectJurisdiction('us')}
            />

            {/* 2. European Union Highlighted Boundary */}
            <path
              id="map-path-eu"
              d="M490 145 L540 135 L560 160 L540 190 L500 190 L480 170 Z"
              className={`cursor-pointer transition-all duration-300 ${
                selectedJurisdictions.includes('eu') || hoveredMarketId === 'eu'
                  ? 'fill-emerald-500/35 stroke-emerald-400 stroke-2'
                  : 'fill-emerald-500/15 stroke-emerald-500/50 stroke-1 hover:fill-emerald-500/25'
              }`}
              onMouseEnter={() => setHoveredMarketId('eu')}
              onMouseLeave={() => setHoveredMarketId(null)}
              onClick={() => onSelectJurisdiction('eu')}
            />

            {/* 3. United Kingdom Highlighted Boundary */}
            <path
              id="map-path-uk"
              d="M465 145 L485 140 L485 165 L465 165 Z"
              className={`cursor-pointer transition-all duration-300 ${
                selectedJurisdictions.includes('uk') || hoveredMarketId === 'uk'
                  ? 'fill-violet-500/40 stroke-violet-400 stroke-2'
                  : 'fill-violet-500/20 stroke-violet-400/60 stroke-1 hover:fill-violet-500/30'
              }`}
              onMouseEnter={() => setHoveredMarketId('uk')}
              onMouseLeave={() => setHoveredMarketId(null)}
              onClick={() => onSelectJurisdiction('uk')}
            />

            {/* 4. China Highlighted Boundary */}
            <path
              id="map-path-china"
              d="M710 170 L820 160 L830 220 L780 260 L720 250 L690 210 Z"
              className={`cursor-pointer transition-all duration-300 ${
                selectedJurisdictions.includes('china') || hoveredMarketId === 'china'
                  ? 'fill-rose-500/35 stroke-rose-400 stroke-2'
                  : 'fill-rose-500/15 stroke-rose-500/50 stroke-1 hover:fill-rose-500/25'
              }`}
              onMouseEnter={() => setHoveredMarketId('china')}
              onMouseLeave={() => setHoveredMarketId(null)}
              onClick={() => onSelectJurisdiction('china')}
            />

            {/* 5. South Korea Highlighted Boundary */}
            <path
              id="map-path-korea"
              d="M830 205 L845 205 L845 230 L830 230 Z"
              className={`cursor-pointer transition-all duration-300 ${
                selectedJurisdictions.includes('korea') || hoveredMarketId === 'korea'
                  ? 'fill-amber-500/40 stroke-amber-400 stroke-2'
                  : 'fill-amber-500/20 stroke-amber-400/60 stroke-1 hover:fill-amber-500/30'
              }`}
              onMouseEnter={() => setHoveredMarketId('korea')}
              onMouseLeave={() => setHoveredMarketId(null)}
              onClick={() => onSelectJurisdiction('korea')}
            />
          </g>

          {/* PINS & BEACONS FOR ALL 7 JURISDICTIONS */}
          {Object.values(JURISDICTIONS).map((jurisdiction) => {
            const isSelected = selectedJurisdictions.includes(jurisdiction.id);
            const isHovered = hoveredMarketId === jurisdiction.id;
            const regCount = REGULATIONS.filter((r) => r.jurisdictionId === jurisdiction.id).length;

            return (
              <g
                key={jurisdiction.id}
                id={`pin-group-${jurisdiction.id}`}
                className="cursor-pointer group"
                transform={`translate(${jurisdiction.mapCoords.x}, ${jurisdiction.mapCoords.y})`}
                onMouseEnter={() => setHoveredMarketId(jurisdiction.id)}
                onMouseLeave={() => setHoveredMarketId(null)}
                onClick={() => onSelectJurisdiction(jurisdiction.id)}
              >
                {/* Outer radar pulse ring */}
                <circle
                  r={isSelected || isHovered ? '22' : '15'}
                  fill="none"
                  stroke={jurisdiction.color}
                  strokeWidth="1.5"
                  className="animate-ping opacity-40"
                />

                {/* Steady aura */}
                <circle
                  r={isSelected || isHovered ? '16' : '12'}
                  fill={jurisdiction.color}
                  fillOpacity={isSelected || isHovered ? '0.35' : '0.2'}
                />

                {/* Central pin base */}
                <circle
                  r={isSelected || isHovered ? '9' : '7'}
                  fill="#0f172a"
                  stroke={jurisdiction.color}
                  strokeWidth={isSelected || isHovered ? '3' : '2'}
                  className="transition-all duration-200"
                />

                {/* Inner center dot */}
                <circle
                  r="3.5"
                  fill={jurisdiction.color}
                />

                {/* Label text */}
                <text
                  x={jurisdiction.id === 'singapore' ? 12 : jurisdiction.id === 'hong_kong' ? 12 : 0}
                  y={jurisdiction.id === 'singapore' ? 4 : jurisdiction.id === 'hong_kong' ? 4 : -14}
                  textAnchor={jurisdiction.id === 'singapore' || jurisdiction.id === 'hong_kong' ? 'start' : 'middle'}
                  className={`text-[10px] font-bold tracking-wide pointer-events-none transition-all ${
                    isSelected || isHovered
                      ? 'fill-white font-extrabold'
                      : 'fill-slate-300'
                  }`}
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                >
                  {jurisdiction.flag} {jurisdiction.code} ({regCount})
                </text>
              </g>
            );
          })}
        </svg>

        {/* FLOATING HOVER CARD / QUICK INSPECT PANEL */}
        {hoveredMarket && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{hoveredMarket.flag}</span>
                  <h3 className="text-sm font-bold text-white">
                    {hoveredMarket.name}
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {hoveredMarket.region}
                  </span>
                </div>
                <div className="mt-1">
                  <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium border ${APPROACH_METADATA[hoveredMarket.approach].badgeClass}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${APPROACH_METADATA[hoveredMarket.approach].dotClass}`} />
                    {hoveredMarket.approachLabel}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-extrabold text-indigo-400">
                  {hoveredRegulations.length}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Regulations
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
              {hoveredMarket.primaryPhilosophy}
            </p>

            <div className="mt-2.5 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Lead Agencies:</span>
                <span className="text-slate-200 truncate">{hoveredMarket.leadAgencies.slice(0, 3).join(', ')}</span>
              </div>
            </div>

            {/* Action buttons inside card */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectJurisdiction(hoveredMarket.id);
                  onSwitchToDirectory(hoveredMarket.id);
                }}
                className="flex-1 py-1.5 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>View {hoveredRegulations.length} Laws</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenJurisdictionProfile(hoveredMarket.id);
                }}
                className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
