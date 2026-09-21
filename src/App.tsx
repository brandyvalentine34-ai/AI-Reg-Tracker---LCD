import { useState, useMemo } from 'react';
import { 
  ViewMode, 
  FilterState, 
  JurisdictionId, 
  Regulation, 
  TopicCategory 
} from './types';
import { JURISDICTIONS } from './data/jurisdictions';
import { REGULATIONS } from './data/regulations';
import { Header } from './components/Header';
import { WorldMap } from './components/WorldMap';
import { FilterBar } from './components/FilterBar';
import { RegulationCard } from './components/RegulationCard';
import { RegulationModal } from './components/RegulationModal';
import { JurisdictionDetailDrawer } from './components/JurisdictionDetailDrawer';
import { 
  Layers, 
  AlertCircle, 
  RotateCcw, 
  Scale
} from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [filters, setFilters] = useState<FilterState>({
    jurisdictions: [],
    topics: [],
    instrumentTypes: [],
    statuses: [],
  });

  const [activeModalReg, setActiveModalReg] = useState<Regulation | null>(null);
  const [activeDrawerJurisdiction, setActiveDrawerJurisdiction] = useState<JurisdictionId | null>(null);

  // Set or clear selected country
  const handleSelectCountry = (id: JurisdictionId | null) => {
    setFilters((prev) => ({
      ...prev,
      jurisdictions: id ? [id] : [],
    }));
  };

  // Toggle a jurisdiction on the map
  const handleToggleJurisdiction = (id: JurisdictionId) => {
    setFilters((prev) => {
      const isAlreadySingleSelected = prev.jurisdictions.length === 1 && prev.jurisdictions[0] === id;
      return {
        ...prev,
        jurisdictions: isAlreadySingleSelected ? [] : [id],
      };
    });
  };

  // Direct filter by single jurisdiction and switch to directory
  const handleFilterSingleJurisdiction = (id: JurisdictionId) => {
    setFilters((prev) => ({
      ...prev,
      jurisdictions: [id],
    }));
    setViewMode('directory');
  };

  // Direct filter by topic
  const handleSelectTopic = (topic: string) => {
    setFilters((prev) => {
      const t = topic as TopicCategory;
      const exists = prev.topics.includes(t);
      return {
        ...prev,
        topics: exists ? prev.topics : [...prev.topics, t],
      };
    });
    setViewMode('directory');
  };

  // Filtered regulations calculation (topics, instrumentTypes, statuses, and country)
  const filteredRegulations = useMemo(() => {
    return REGULATIONS.filter((reg) => {
      // 1. Jurisdiction / Country filter
      if (filters.jurisdictions.length > 0 && !filters.jurisdictions.includes(reg.jurisdictionId)) {
        return false;
      }

      // 2. Topic filter
      if (filters.topics.length > 0) {
        const hasMatchingTopic = reg.topics.some((t) => filters.topics.includes(t));
        if (!hasMatchingTopic) return false;
      }

      // 3. Instrument Type filter
      if (filters.instrumentTypes.length > 0 && !filters.instrumentTypes.includes(reg.instrumentType)) {
        return false;
      }

      // 4. Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(reg.status)) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      jurisdictions: [],
      topics: [],
      instrumentTypes: [],
      statuses: [],
    });
  };

  const selectedCountry = filters.jurisdictions.length === 1 ? filters.jurisdictions[0] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header & Navigation */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalRegulationsCount={REGULATIONS.length}
        filteredCount={filteredRegulations.length}
        selectedCountry={selectedCountry}
        onSelectCountry={handleSelectCountry}
        onOpenJurisdictionProfile={(id) => setActiveDrawerJurisdiction(id)}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Quick Context Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Scale className="w-4 h-4" />
            </span>
            <div>
              <span className="font-bold text-slate-200">
                Monitoring 7 Jurisdictions
              </span>
              <span className="text-slate-400 ml-1.5 hidden sm:inline">
                · Singapore · United States · United Kingdom · European Union · China · South Korea · Hong Kong
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <div>
              <span className="font-bold text-white">{REGULATIONS.length}</span> Key Instruments
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div>
              <span className="font-bold text-emerald-400">
                {REGULATIONS.filter((r) => r.status === 'in_force').length}
              </span> In Force
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div>
              <span className="font-bold text-amber-400">
                {REGULATIONS.filter((r) => r.status === 'staggered').length}
              </span> Staggered
            </div>
          </div>
        </div>

        {/* VIEW 1: MAP VIEW */}
        {viewMode === 'map' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Interactive World Map */}
            <WorldMap
              selectedJurisdictions={filters.jurisdictions}
              onSelectJurisdiction={handleToggleJurisdiction}
              onOpenJurisdictionProfile={(id) => setActiveDrawerJurisdiction(id)}
              onSwitchToDirectory={(id) => {
                if (id) setFilters((prev) => ({ ...prev, jurisdictions: [id] }));
                setViewMode('directory');
              }}
            />

            {/* Quick Preview of Regulations under the Map */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    Key AI Legislative Instruments ({filteredRegulations.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedCountry
                      ? `Filtered by ${JURISDICTIONS[selectedCountry].name}`
                      : 'Showing flagship legislation across all 7 monitored jurisdictions'}
                  </p>
                </div>

                <button
                  onClick={() => setViewMode('directory')}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <span>Open Full Directory with Faceted Filters →</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRegulations.slice(0, 6).map((reg) => (
                  <RegulationCard
                    key={reg.id}
                    regulation={reg}
                    onOpenModal={setActiveModalReg}
                    onSelectJurisdiction={handleFilterSingleJurisdiction}
                    onSelectTopic={handleSelectTopic}
                  />
                ))}
              </div>

              {filteredRegulations.length > 6 && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => setViewMode('directory')}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-indigo-400 border border-slate-800 rounded-xl text-xs font-bold transition-colors"
                  >
                    View All {filteredRegulations.length} Monitored Regulations in Directory →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: DIRECTORY VIEW */}
        {viewMode === 'directory' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Faceted Filter Toolbar */}
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              totalCount={REGULATIONS.length}
              filteredCount={filteredRegulations.length}
            />

            {/* Empty Filter Results Notice */}
            {filteredRegulations.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-base font-bold text-white">No regulations found matching your filters</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Try clearing some filter criteria, selecting &quot;All Countries&quot;, or resetting all filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              /* Regulations Card Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRegulations.map((reg) => (
                  <RegulationCard
                    key={reg.id}
                    regulation={reg}
                    onOpenModal={setActiveModalReg}
                    onSelectJurisdiction={handleFilterSingleJurisdiction}
                    onSelectTopic={handleSelectTopic}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-slate-300">
              Global AI Regulatory Tracker
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Monitoring key artificial intelligence legislation, guidelines, and technical standards across Singapore, US, UK, EU, China, South Korea, and Hong Kong.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-400">
              Curated by LCD Compliance for internal sharing and information purposes
            </span>
          </div>
        </div>
      </footer>

      {/* Deep-Dive Inspection Modal */}
      <RegulationModal
        regulation={activeModalReg}
        onClose={() => setActiveModalReg(null)}
        onSelectTopic={handleSelectTopic}
        onSelectJurisdiction={handleFilterSingleJurisdiction}
      />

      {/* Jurisdiction Profile Drawer */}
      <JurisdictionDetailDrawer
        jurisdictionId={activeDrawerJurisdiction}
        onClose={() => setActiveDrawerJurisdiction(null)}
        onSelectRegulation={(reg) => {
          setActiveDrawerJurisdiction(null);
          setActiveModalReg(reg);
        }}
        onFilterByJurisdiction={handleFilterSingleJurisdiction}
      />
    </div>
  );
}
