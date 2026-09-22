import { FC, useState, useMemo } from 'react';
import { 
  IndustryNewsItem, 
  IndustrySector, 
  JurisdictionId 
} from '../types';
import { INDUSTRY_NEWS, SECTOR_METRICS } from '../data/industryNews';
import { JURISDICTIONS } from '../data/jurisdictions';
import { 
  Building2, 
  Cpu, 
  Zap, 
  ExternalLink,
  Search,
  Filter,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Globe,
  ChevronRight,
  ShieldCheck,
  Server
} from 'lucide-react';

interface IndustryNewsSectionProps {
  selectedCountry: JurisdictionId | null;
  onSelectCountry: (id: JurisdictionId | null) => void;
  onOpenJurisdictionProfile: (id: JurisdictionId) => void;
}

export const IndustryNewsSection: FC<IndustryNewsSectionProps> = ({
  selectedCountry,
  onSelectCountry,
  onOpenJurisdictionProfile,
}) => {
  const [selectedSector, setSelectedSector] = useState<IndustrySector | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<IndustryNewsItem | null>(null);

  // Sector Icon Resolver
  const renderSectorIcon = (iconName: string, className: string = 'w-4 h-4') => {
    switch (iconName) {
      case 'Zap': return <Zap className={className} />;
      case 'Building2': return <Building2 className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Server': return <Server className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      default: return <Cpu className={className} />;
    }
  };

  // Filtered industry items
  const filteredNews = useMemo(() => {
    return INDUSTRY_NEWS.filter((item) => {
      // 1. Sector filter
      if (selectedSector !== 'all' && item.sector !== selectedSector) {
        return false;
      }
      // 2. Country filter
      if (selectedCountry && item.jurisdictionId !== selectedCountry) {
        return false;
      }
      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSummary = item.summary.toLowerCase().includes(q);
        const matchesRegulator = item.regulator.toLowerCase().includes(q);
        const matchesSector = item.sectorLabel.toLowerCase().includes(q);
        const matchesFocus = item.focusArea.toLowerCase().includes(q);
        const matchesTags = item.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSummary && !matchesRegulator && !matchesSector && !matchesFocus && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [selectedSector, selectedCountry, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Institutional Banner Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#071d49]/10 text-[#071d49] border border-[#071d49]/20">
                Key Strategic Sectors
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0033ff]/10 text-[#0033ff] border border-[#0033ff]/20">
                Last 2 Years (Sep 2024 – Sep 2026)
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Updated as of September 2026
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#071d49]">
              Industry-Specific AI Regulatory News & Sector Developments
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Specialized regulatory monitoring, agency directives, and compliance frameworks enacted or active within the last 2 years across 3 core sectors: Energy & Power Grids, Critical Infrastructure, and Compute, Cloud & Chips.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Monitored Actions
              </div>
              <div className="text-2xl font-extrabold text-[#071d49]">
                {INDUSTRY_NEWS.length} Developments
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Sector Focus Metrics Cards */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[#0033ff]" />
              Core Industry Sectors
            </h3>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Focusing exclusively on Energy, Infrastructure & Compute/Cloud
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SECTOR_METRICS.map((metric) => {
              const isSelected = selectedSector === metric.sector;
              return (
                <button
                  key={metric.sector}
                  onClick={() => setSelectedSector(isSelected ? 'all' : metric.sector)}
                  className={`text-left p-3.5 rounded-xl border text-xs transition-all duration-150 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#071d49] text-white border-[#071d49] shadow-sm'
                      : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/10 text-[#00b1ff]' : 'bg-[#071d49]/10 text-[#071d49]'}`}>
                          {renderSectorIcon(metric.iconName, 'w-4 h-4')}
                        </span>
                        <span className="font-bold text-sm tracking-tight">{metric.label}</span>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-700'
                      }`}>
                        {metric.trackedDevelopments} items
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed line-clamp-2 ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                      {metric.description}
                    </p>
                  </div>
                  <div className={`mt-3 pt-2 text-[10px] font-semibold border-t flex items-center justify-between ${
                    isSelected ? 'border-white/15 text-[#00b1ff]' : 'border-slate-200 text-[#0033ff]'
                  }`}>
                    <span>{metric.activeRegulationsCount} active regulatory frameworks</span>
                    <span>{isSelected ? 'Selected ✓' : 'Filter by sector →'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords (e.g. 'PUE', 'grid', 'CII', 'SCADA', 'GPU', 'KYC', 'FLOPs')..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#071d49] focus:bg-white transition-all"
            />
          </div>

          {/* Country Selection */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCountry || 'all'}
              onChange={(e) => {
                const val = e.target.value;
                onSelectCountry(val === 'all' ? null : (val as JurisdictionId));
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#071d49]"
            >
              <option value="all">All Monitored Jurisdictions (7)</option>
              {Object.values(JURISDICTIONS).map((j) => (
                <option key={j.id} value={j.id}>
                  {j.flag} {j.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sector Quick Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Sector Filter:
          </span>

          <button
            onClick={() => setSelectedSector('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              selectedSector === 'all'
                ? 'bg-[#071d49] text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            All 3 Sectors ({INDUSTRY_NEWS.length})
          </button>

          {SECTOR_METRICS.map((metric) => {
            const isSelected = selectedSector === metric.sector;
            return (
              <button
                key={metric.sector}
                onClick={() => setSelectedSector(metric.sector)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-[#071d49] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {renderSectorIcon(metric.iconName, 'w-3 h-3')}
                <span>{metric.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-[#071d49]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Card Top Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#071d49]/10 text-[#071d49] border border-[#071d49]/20">
                      {item.countryFlag} {item.countryName}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0033ff] border border-blue-200">
                      {item.sectorLabel}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    item.impactLevel === 'Critical'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : item.impactLevel === 'High'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {item.impactLevel} Impact
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[#071d49] leading-snug tracking-tight mb-2">
                  {item.title}
                </h3>

                {/* Authority & Date */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5 font-medium">
                  <span className="font-semibold text-slate-700">{item.regulator}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                </div>

                {/* Focus Area Pill */}
                <div className="mb-3">
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80">
                    Focus: {item.focusArea}
                  </span>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.summary}
                </p>

                {/* Key Obligations Checklist */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 mb-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Key Compliance Obligations
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {item.complianceTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                        <span className="text-[#0033ff] font-bold mt-0.5">•</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <a
                  href={item.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#0033ff] hover:text-[#071d49] inline-flex items-center gap-1 transition-colors"
                >
                  <span>{item.officialSourceLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setActiveItem(item)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-[#071d49] hover:text-white text-[#071d49] font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>Deep Dive</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredNews.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-[#071d49]">No industry news found for this criteria</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try resetting your sector filter or selecting &quot;All Monitored Jurisdictions&quot;.
          </p>
          <button
            onClick={() => {
              setSelectedSector('all');
              setSearchQuery('');
              onSelectCountry(null);
            }}
            className="mt-4 px-4 py-2 bg-[#071d49] text-white rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Deep Dive Inspection Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#071d49] text-white p-5 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/15 text-white">
                    {activeItem.countryFlag} {activeItem.countryName}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#00b1ff]/20 text-[#00b1ff]">
                    {activeItem.sectorLabel}
                  </span>
                </div>
                <h3 className="text-lg font-bold leading-tight">{activeItem.title}</h3>
                <div className="text-xs text-slate-300 mt-1">
                  {activeItem.regulator} • {activeItem.date}
                </div>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="text-white/70 hover:text-white text-lg p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Regulatory Summary
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeItem.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Actionable Compliance Obligations
                </h4>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <ul className="space-y-2 text-xs text-slate-700">
                    {activeItem.complianceTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0033ff] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Regulatory Focus Area */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="font-semibold text-slate-700 mb-0.5">Regulatory Focus Area:</div>
                <div className="text-slate-600">{activeItem.focusArea}</div>
              </div>

              {/* External source button */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => onOpenJurisdictionProfile(activeItem.jurisdictionId)}
                  className="text-xs font-bold text-[#071d49] hover:underline"
                >
                  View full {activeItem.countryName} Country Profile →
                </button>
                <a
                  href={activeItem.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#071d49] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 hover:bg-[#041333]"
                >
                  <span>Open Official Document</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
