import { FC } from 'react';
import { ViewMode, JurisdictionId } from '../types';
import { JURISDICTIONS } from '../data/jurisdictions';
import { 
  Globe2, 
  Globe, 
  Map as MapIcon, 
  Layers, 
  Sparkles,
  ChevronDown,
  Info,
  RotateCcw
} from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalRegulationsCount: number;
  filteredCount: number;
  selectedCountry: JurisdictionId | null;
  onSelectCountry: (id: JurisdictionId | null) => void;
  onOpenJurisdictionProfile: (id: JurisdictionId) => void;
}

export const Header: FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  totalRegulationsCount,
  filteredCount,
  selectedCountry,
  onSelectCountry,
  onOpenJurisdictionProfile,
}) => {
  const activeCountry = selectedCountry ? JURISDICTIONS[selectedCountry] : null;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Main Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Global AI Regulatory Tracker
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  7 Monitored Countries
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Authoritative intelligence on AI legislation, standards, and guidelines in Singapore, US, UK, EU, China, Korea & Hong Kong
              </p>
            </div>
          </div>

          {/* Country Dropdown Filter */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <label 
              htmlFor="header-country-filter"
              className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>Filter by Country:</span>
            </label>

            <div className="relative">
              <select
                id="header-country-filter"
                value={selectedCountry || 'all'}
                onChange={(e) => {
                  const val = e.target.value;
                  onSelectCountry(val === 'all' ? null : (val as JurisdictionId));
                }}
                className="appearance-none pl-3.5 pr-9 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700/90 hover:border-slate-600 focus:border-indigo-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-colors cursor-pointer shadow-inner min-w-[190px]"
              >
                <option value="all">🌐 All Countries (7)</option>
                {Object.values(JURISDICTIONS).map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.flag} {j.name} ({j.code})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {selectedCountry && activeCountry && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenJurisdictionProfile(selectedCountry)}
                  className="px-3 py-2 text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                  title={`View regulatory profile for ${activeCountry.name}`}
                >
                  <Info className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Profile</span>
                </button>
                <button
                  onClick={() => onSelectCountry(null)}
                  className="p-2 text-slate-400 hover:text-rose-300 hover:bg-slate-800 rounded-xl transition-colors"
                  title="Clear country filter"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation View Switcher Row */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
          {/* View Mode Switcher */}
          <nav className="flex items-center p-1 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <button
              id="nav-map-view"
              onClick={() => onViewModeChange('map')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'map'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Interactive Map</span>
            </button>
            <button
              id="nav-directory-view"
              onClick={() => onViewModeChange('directory')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'directory'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Regulations Directory ({filteredCount})</span>
            </button>
          </nav>

          {/* Active Status Badge */}
          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-2">
            <span>Showing</span>
            <span className="font-bold text-slate-200">{filteredCount}</span>
            <span>of</span>
            <span className="font-bold text-slate-200">{totalRegulationsCount}</span>
            <span>instruments</span>
            {activeCountry && (
              <span className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                <span>{activeCountry.flag}</span>
                <span>{activeCountry.name}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
