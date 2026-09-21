import { FC, useState } from 'react';
import { 
  JurisdictionId, 
  TopicCategory, 
  InstrumentType, 
  EnforcementStatus, 
  FilterState 
} from '../types';
import { 
  JURISDICTIONS, 
  TOPIC_METADATA, 
  INSTRUMENT_METADATA, 
  STATUS_METADATA 
} from '../data/jurisdictions';
import { REGULATIONS } from '../data/regulations';
import { 
  Filter, 
  RotateCcw, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Tag, 
  FileText, 
  Activity,
  Globe
} from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

export const FilterBar: FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  totalCount,
  filteredCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleJurisdiction = (id: JurisdictionId) => {
    const exists = filters.jurisdictions.includes(id);
    const updated = exists
      ? filters.jurisdictions.filter((j) => j !== id)
      : [...filters.jurisdictions, id];
    onFilterChange({ ...filters, jurisdictions: updated });
  };

  const toggleTopic = (topic: TopicCategory) => {
    const exists = filters.topics.includes(topic);
    const updated = exists
      ? filters.topics.filter((t) => t !== topic)
      : [...filters.topics, topic];
    onFilterChange({ ...filters, topics: updated });
  };

  const toggleInstrument = (inst: InstrumentType) => {
    const exists = filters.instrumentTypes.includes(inst);
    const updated = exists
      ? filters.instrumentTypes.filter((i) => i !== inst)
      : [...filters.instrumentTypes, inst];
    onFilterChange({ ...filters, instrumentTypes: updated });
  };

  const toggleStatus = (status: EnforcementStatus) => {
    const exists = filters.statuses.includes(status);
    const updated = exists
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onFilterChange({ ...filters, statuses: updated });
  };

  const resetAllFilters = () => {
    onFilterChange({
      jurisdictions: [],
      topics: [],
      instrumentTypes: [],
      statuses: [],
    });
  };

  const hasActiveFilters =
    filters.jurisdictions.length > 0 ||
    filters.topics.length > 0 ||
    filters.instrumentTypes.length > 0 ||
    filters.statuses.length > 0;

  // Calculate dynamic counts
  const countByJurisdiction = (id: JurisdictionId) =>
    REGULATIONS.filter((r) => r.jurisdictionId === id).length;

  const countByTopic = (topic: TopicCategory) =>
    REGULATIONS.filter((r) => r.topics.includes(topic)).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
      {/* Top Filter Bar Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Filter Intelligence
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {filteredCount} of {totalCount}
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
            title={isExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Filter Sections */}
      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* 1. COUNTRY DROPDOWN FILTER */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                Filter by Country
              </span>
              <span className="text-[11px] text-slate-400">
                {filters.jurisdictions.length === 0
                  ? 'All Countries'
                  : JURISDICTIONS[filters.jurisdictions[0]]?.name || '1 Selected'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-72">
                <select
                  id="filterbar-country-dropdown"
                  value={filters.jurisdictions.length === 1 ? filters.jurisdictions[0] : 'all'}
                  onChange={(e) => {
                    const val = e.target.value;
                    onFilterChange({
                      ...filters,
                      jurisdictions: val === 'all' ? [] : [val as JurisdictionId],
                    });
                  }}
                  className="w-full appearance-none pl-3.5 pr-9 py-2 text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-colors cursor-pointer"
                >
                  <option value="all">🌐 All Countries (7 Monitored)</option>
                  {Object.values(JURISDICTIONS).map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.flag} {j.name} ({countByJurisdiction(j.id)} regulations)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {filters.jurisdictions.length > 0 && (
                <button
                  onClick={() => onFilterChange({ ...filters, jurisdictions: [] })}
                  className="text-xs text-slate-400 hover:text-slate-200 underline font-medium"
                >
                  Clear country filter
                </button>
              )}
            </div>
          </div>

          {/* 2. TOPIC CATEGORIES */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                Key Regulatory Topics
              </span>
              <span className="text-[11px] text-slate-400">
                {filters.topics.length === 0 ? 'All Topics' : `${filters.topics.length} Selected`}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(TOPIC_METADATA) as TopicCategory[]).map((topic) => {
                const isSelected = filters.topics.includes(topic);
                const count = countByTopic(topic);
                const meta = TOPIC_METADATA[topic];
                return (
                  <button
                    key={topic}
                    id={`filter-topic-${topic}`}
                    onClick={() => toggleTopic(topic)}
                    className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-500/25 text-indigo-200 border border-indigo-500/60 font-semibold ring-1 ring-indigo-500/30'
                        : 'bg-slate-800/50 text-slate-400 border border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-indigo-400' : 'bg-slate-500'
                      }`}
                    />
                    <span>{meta.label}</span>
                    <span className="text-[10px] text-slate-400 font-bold">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. INSTRUMENT & STATUS (Two Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/70">
            {/* Legal Instrument Type */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                Legal Instrument Type
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(INSTRUMENT_METADATA) as InstrumentType[]).map((inst) => {
                  const isSelected = filters.instrumentTypes.includes(inst);
                  const meta = INSTRUMENT_METADATA[inst];
                  return (
                    <button
                      key={inst}
                      id={`filter-inst-${inst}`}
                      onClick={() => toggleInstrument(inst)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                      }`}
                    >
                      {meta.short}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Enforcement Status */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                Enforcement Status
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(STATUS_METADATA) as EnforcementStatus[]).map((status) => {
                  const isSelected = filters.statuses.includes(status);
                  const meta = STATUS_METADATA[status];
                  return (
                    <button
                      key={status}
                      id={`filter-status-${status}`}
                      onClick={() => toggleStatus(status)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-semibold'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
                      <span>{meta.label.split('/')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
