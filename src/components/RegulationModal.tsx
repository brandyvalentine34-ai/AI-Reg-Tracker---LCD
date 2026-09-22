import { FC, useEffect } from 'react';
import { Regulation, JurisdictionId } from '../types';
import { JURISDICTIONS, TOPIC_METADATA, STATUS_METADATA, INSTRUMENT_METADATA } from '../data/jurisdictions';
import { 
  X, 
  ExternalLink, 
  Building2, 
  Calendar, 
  CheckSquare, 
  AlertTriangle, 
  Users, 
  FileText, 
  ShieldAlert,
  Clock,
  Sparkles
} from 'lucide-react';

interface RegulationModalProps {
  regulation: Regulation | null;
  onClose: () => void;
  onSelectTopic: (topic: string) => void;
  onSelectJurisdiction: (id: JurisdictionId) => void;
}

export const RegulationModal: FC<RegulationModalProps> = ({
  regulation,
  onClose,
  onSelectTopic,
  onSelectJurisdiction,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!regulation) return null;

  const jurisdiction = JURISDICTIONS[regulation.jurisdictionId];
  const statusMeta = STATUS_METADATA[regulation.status];
  const instrumentMeta = INSTRUMENT_METADATA[regulation.instrumentType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-[#071d49] text-white px-6 py-5 border-b border-[#041333] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => {
                  onSelectJurisdiction(regulation.jurisdictionId);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
              >
                <span>{jurisdiction?.flag}</span>
                <span>{jurisdiction?.name}</span>
              </button>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusMeta.badgeClass}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`} />
                <span>{statusMeta.label}</span>
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-white/10 text-slate-200 border border-white/15">
                {instrumentMeta.label}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              {regulation.title}
              {regulation.isLandmark && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Landmark
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-300 font-mono mt-1">
              {regulation.officialTitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Milestone Banner if exists */}
          {regulation.nextMilestone && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Critical Compliance Horizon & Next Milestone
                </div>
                <div className="text-xs mt-0.5 leading-relaxed font-medium">
                  {regulation.nextMilestone}
                </div>
              </div>
            </div>
          )}

          {/* Key Facts Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">Announced Date</span>
              <span className="font-semibold text-slate-800">{regulation.dateAnnounced}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Effective Date</span>
              <span className="font-semibold text-emerald-700">{regulation.effectiveDate}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 block mb-0.5">Enforcing Agencies</span>
              <span className="font-semibold text-slate-800 truncate block">
                {regulation.leadAgencies.join(', ')}
              </span>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#071d49] flex items-center gap-1.5 mb-2">
              <FileText className="w-4 h-4 text-[#0033ff]" />
              Executive Summary & Purpose
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {regulation.summary}
            </p>
          </div>

          {/* Scope and Applicability */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#071d49] flex items-center gap-1.5 mb-2">
              <Users className="w-4 h-4 text-[#0033ff]" />
              Scope of Application & Extraterritoriality
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {regulation.scopeAndApplicability}
            </p>
          </div>

          {/* Key Provisions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#071d49] flex items-center gap-1.5 mb-2">
              <CheckSquare className="w-4 h-4 text-[#0033ff]" />
              Core Legal Provisions & Rules
            </h4>
            <div className="space-y-2">
              {regulation.keyProvisions.map((provision, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700"
                >
                  <span className="w-5 h-5 rounded-full bg-[#071d49]/10 text-[#071d49] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{provision}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Obligations Checklist */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              Corporate Compliance Action Items
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700 bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-xl">
              {regulation.complianceObligations.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Penalties and Enforcement */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Enforcement Penalties & Fines
            </h4>
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 leading-relaxed font-medium">
              {regulation.penaltiesAndEnforcement}
            </div>
          </div>

          {/* Covered Topic Tags */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Related Topic Classifications
            </h4>
            <div className="flex flex-wrap gap-2">
              {regulation.topics.map((topic) => {
                const meta = TOPIC_METADATA[topic];
                return (
                  <button
                    key={topic}
                    onClick={() => {
                      onSelectTopic(topic);
                      onClose();
                    }}
                    className="text-xs font-medium px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                  >
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Source: Official Governmental Gazettes & Regulatory Authorities
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
            >
              Close
            </button>
            <a
              href={regulation.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#071d49] hover:bg-[#041333] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span>View Official Legislation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
