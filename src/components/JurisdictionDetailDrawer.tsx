import { FC, useEffect } from 'react';
import { JurisdictionId, Regulation } from '../types';
import { JURISDICTIONS, APPROACH_METADATA } from '../data/jurisdictions';
import { REGULATIONS } from '../data/regulations';
import { 
  X, 
  Building2, 
  ExternalLink, 
  Layers, 
  Scale, 
  FileText, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface JurisdictionDetailDrawerProps {
  jurisdictionId: JurisdictionId | null;
  onClose: () => void;
  onSelectRegulation: (reg: Regulation) => void;
  onFilterByJurisdiction: (id: JurisdictionId) => void;
}

export const JurisdictionDetailDrawer: FC<JurisdictionDetailDrawerProps> = ({
  jurisdictionId,
  onClose,
  onSelectRegulation,
  onFilterByJurisdiction,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!jurisdictionId) return null;

  const jurisdiction = JURISDICTIONS[jurisdictionId];
  const approachMeta = APPROACH_METADATA[jurisdiction.approach];
  const jurisdictionRegulations = REGULATIONS.filter((r) => r.jurisdictionId === jurisdiction.id);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 flex justify-end">
      <div 
        className="w-full max-w-xl bg-white border-l border-slate-200 h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-[#041333] bg-[#071d49] text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-1.5 bg-white/10 rounded-xl border border-white/20 shadow-sm">
                {jurisdiction.flag}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {jurisdiction.name}
                  </h2>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-white/15 text-white border border-white/20">
                    {jurisdiction.code}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {jurisdiction.region} · {jurisdictionRegulations.length} Regulations Monitored
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Approach Badge */}
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${approachMeta.badgeClass}`}>
              <span className={`w-2 h-2 rounded-full ${approachMeta.dotClass}`} />
              <span>{jurisdiction.approachLabel}</span>
            </span>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Regulatory Philosophy */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#071d49] flex items-center gap-1.5 mb-2">
              <Scale className="w-4 h-4 text-[#0033ff]" />
              Core Governance Philosophy
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 font-medium">
              {jurisdiction.primaryPhilosophy}
            </p>
          </div>

          {/* Approach Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Structural Overview
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {jurisdiction.approachSummary}
            </p>
          </div>

          {/* Lead Enforcing Authorities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#071d49] flex items-center gap-1.5 mb-2.5">
              <Building2 className="w-4 h-4 text-[#0033ff]" />
              Primary Regulatory & Supervisory Authorities
            </h4>
            <div className="flex flex-wrap gap-2">
              {jurisdiction.leadAgencies.map((agency) => (
                <span
                  key={agency}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 shadow-sm"
                >
                  {agency}
                </span>
              ))}
            </div>
          </div>

          {/* Tracked Regulations in this Market */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#071d49] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#0033ff]" />
                Key Legislation & Frameworks ({jurisdictionRegulations.length})
              </h4>
            </div>

            <div className="space-y-3">
              {jurisdictionRegulations.map((reg) => (
                <div
                  key={reg.id}
                  onClick={() => onSelectRegulation(reg)}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-[#071d49]/30 cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h5 className="text-xs font-bold text-[#071d49] group-hover:text-[#0033ff] transition-colors flex items-center gap-1.5">
                      <span>{reg.title}</span>
                      {reg.isLandmark && (
                        <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                      )}
                    </h5>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700 shrink-0">
                      {reg.effectiveDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {reg.summary}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#0033ff] font-semibold">
                    <span>Inspect details</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
          <button
            onClick={() => {
              onFilterByJurisdiction(jurisdiction.id);
              onClose();
            }}
            className="flex-1 py-2.5 px-4 bg-[#071d49] hover:bg-[#041333] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span>Filter All Results by {jurisdiction.name}</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
