import { FC } from 'react';
import { ViewMode, JurisdictionId } from '../types';
import { JURISDICTIONS } from '../data/jurisdictions';
import { INDUSTRY_NEWS } from '../data/industryNews';
import { 
  Globe2, 
  Globe, 
  Map as MapIcon, 
  Layers, 
  Sparkles,
  ChevronDown,
  Info,
  RotateCcw,
  Newspaper
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
    <header className="sticky top-0 z-40 bg-[#071d49] text-white border-b border-[#041333] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Main Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 p-0.5 flex items-center justify-center border border-white/20 shrink-0">
              <div className="w-full h-full bg-[#040f25] rounded-[10px] flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-[#00b1ff]" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Global AI Regulatory Tracker
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                  <Sparkles className="w-3 h-3 text-[#00b1ff]" />
                  7 Monitored Jurisdictions
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#00b1ff]/20 text-[#00b1ff] border border-[#00b1ff]/30">
                  Last 2 Years (Sep 2024 – Sep 2026)
                </span>
              </div>
              <p className="text-xs text-slate-300 hidden sm:block mt-0.5">
                Rules enacted, announced, or active in the last 2 years till date (updated as of September 2026) across Singapore, US, UK, EU, China, Korea & Hong Kong
              </p>
            </div>
          </div>

          {/* Country Dropdown Filter */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <label 
              htmlFor="header-country-filter"
              className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Globe className="w-4 h-4 text-[#00b1ff]" />
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
                className="appearance-none pl-3.5 pr-9 py-2 text-xs font-semibold bg-[#040f25] hover:bg-[#030a1a] text-white border border-white/20 hover:border-white/40 focus:border-[#00b1ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b1ff]/30 transition-colors cursor-pointer min-w-[200px]"
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
                  className="px-3 py-2 text-xs font-semibold text-white hover:text-white bg-white/15 hover:bg-white/25 border border-white/25 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                  title={`View regulatory profile for ${activeCountry.name}`}
                >
                  <Info className="w-3.5 h-3.5 text-[#00b1ff]" />
                  <span className="hidden sm:inline">Profile</span>
                </button>
                <button
                  onClick={() => onSelectCountry(null)}
                  className="p-2 text-slate-300 hover:text-rose-300 hover:bg-white/10 rounded-xl transition-colors"
                  title="Clear country filter"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation View Switcher Row */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
          {/* View Mode Switcher */}
          <nav className="flex items-center p-1 bg-[#040f25] rounded-xl border border-white/15">
            <button
              id="nav-map-view"
              onClick={() => onViewModeChange('map')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-[#071d49] shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
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
                  ? 'bg-white text-[#071d49] shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Legislation Directory ({filteredCount})</span>
            </button>
            <button
              id="nav-industry-news-view"
              onClick={() => onViewModeChange('industry_news')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'industry_news'
                  ? 'bg-white text-[#071d49] shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5 text-[#00b1ff]" />
              <span>Industry AI News ({INDUSTRY_NEWS.length})</span>
            </button>
          </nav>

          {/* Active Status Badge */}
          <div className="text-xs text-slate-300 hidden md:flex items-center gap-2">
            {viewMode === 'industry_news' ? (
              <span className="flex items-center gap-1.5">
                <span className="font-bold text-white">{INDUSTRY_NEWS.length}</span>
                <span>Actions Monitored</span>
                <span className="text-[11px] text-[#00b1ff] ml-1 bg-white/10 px-2 py-0.5 rounded font-medium">
                  Energy · Infrastructure · Compute/Cloud
                </span>
              </span>
            ) : (
              <>
                <span>Showing</span>
                <span className="font-bold text-white">{filteredCount}</span>
                <span>of</span>
                <span className="font-bold text-white">{totalRegulationsCount}</span>
                <span>instruments</span>
              </>
            )}
            {activeCountry && (
              <span className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 text-white border border-white/20 font-medium">
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
