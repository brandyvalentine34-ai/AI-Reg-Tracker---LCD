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
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
      {/* Top Filter Bar Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#071d49]/10 text-[#071d49] rounded-lg">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#071d49] flex items-center gap-2">
              Filter Legislation
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {filteredCount} of {totalCount}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Curated for the last 2 years (Sep 2024 – Sep 2026) • Updated as of Sep 2026
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
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
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#0033ff]" />
                Filter by Country
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
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
                  className="w-full appearance-none pl-3.5 pr-9 py-2 text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 focus:border-[#071d49] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#071d49]/20 transition-colors cursor-pointer"
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
                  className="text-xs text-[#0033ff] hover:text-[#071d49] underline font-medium"
                >
                  Clear country filter
                </button>
              )}
            </div>
          </div>

          {/* 2. TOPIC CATEGORIES */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#0033ff]" />
                Key Regulatory Topics
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
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
                        ? 'bg-[#071d49] text-white border border-[#071d49] font-semibold shadow-sm'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:text-[#071d49] hover:bg-slate-100'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-[#00b1ff]' : 'bg-slate-400'
                      }`}
                    />
                    <span>{meta.label}</span>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. INSTRUMENT & STATUS (Two Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            {/* Legal Instrument Type */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
                <FileText className="w-3.5 h-3.5 text-[#0033ff]" />
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
                          ? 'bg-[#0033ff] text-white font-semibold shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
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
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
                <Activity className="w-3.5 h-3.5 text-[#0033ff]" />
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
                          ? 'bg-[#071d49] text-white font-semibold shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
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
