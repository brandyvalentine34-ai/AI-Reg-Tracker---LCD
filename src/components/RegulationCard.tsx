import { FC } from 'react';
import { Regulation, JurisdictionId } from '../types';
import { JURISDICTIONS, TOPIC_METADATA, INSTRUMENT_METADATA, STATUS_METADATA } from '../data/jurisdictions';
import { 
  Building2, 
  Calendar, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Clock
} from 'lucide-react';

interface RegulationCardProps {
  regulation: Regulation;
  onOpenModal: (reg: Regulation) => void;
  onSelectJurisdiction: (id: JurisdictionId) => void;
  onSelectTopic: (topic: string) => void;
}

export const RegulationCard: FC<RegulationCardProps> = ({
  regulation,
  onOpenModal,
  onSelectJurisdiction,
  onSelectTopic,
}) => {
  const jurisdiction = JURISDICTIONS[regulation.jurisdictionId];
  const statusMeta = STATUS_METADATA[regulation.status];
  const instrumentMeta = INSTRUMENT_METADATA[regulation.instrumentType];

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Meta Bar */}
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Jurisdiction Chip */}
          <button
            onClick={() => onSelectJurisdiction(regulation.jurisdictionId)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors"
          >
            <span>{jurisdiction?.flag}</span>
            <span>{jurisdiction?.name}</span>
          </button>

          {/* Status and Instrument Badges */}
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusMeta.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`} />
              <span>{statusMeta.label.split('/')[0]}</span>
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/60">
              {instrumentMeta.short}
            </span>
          </div>
        </div>

        {/* Title and Landmark Badge */}
        <div className="mb-2">
          <div className="flex items-start gap-2">
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors tracking-tight leading-snug">
              {regulation.title}
            </h3>
            {regulation.isLandmark && (
              <span 
                className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30"
                title="Landmark Benchmark Framework"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                Landmark
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 italic line-clamp-1 mt-0.5 font-mono">
            {regulation.officialTitle}
          </p>
        </div>

        {/* Lead Agencies */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-medium text-slate-300 truncate">
            {regulation.leadAgencies.join(' · ')}
          </span>
        </div>

        {/* Summary Description */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
          {regulation.summary}
        </p>

        {/* Key Provisions Preview (2 items) */}
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-4 space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Key Requirements:</span>
          </div>
          {regulation.keyProvisions.slice(0, 2).map((prov, i) => (
            <p key={i} className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed flex items-start gap-1.5">
              <span className="text-indigo-400 font-bold">•</span>
              <span>{prov}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Card Footer: Dates, Topics, and Action Buttons */}
      <div>
        {/* Next Milestone alert if staggered */}
        {regulation.nextMilestone && (
          <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 flex items-start gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1 font-medium">{regulation.nextMilestone}</span>
          </div>
        )}

        {/* Topic Badges */}
        <div className="flex flex-wrap gap-1 mb-4">
          {regulation.topics.map((t) => {
            const meta = TOPIC_METADATA[t];
            return (
              <button
                key={t}
                onClick={() => onSelectTopic(t)}
                className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
              >
                {meta.label.split('&')[0].trim()}
              </button>
            );
          })}
        </div>

        {/* Action Button Strip */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={() => onOpenModal(regulation)}
            className="flex-1 py-2 px-3 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-colors"
          >
            <span>Full Analysis & Scope</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <a
            href={regulation.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
            title="Open official primary legal source"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
