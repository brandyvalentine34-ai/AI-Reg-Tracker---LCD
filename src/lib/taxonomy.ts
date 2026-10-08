import type {
  ActionStatus,
  Applicability,
  Confidence,
  Impact,
  InstrumentType,
  Owner,
  Status,
  Theme,
} from '../types';

interface Meta {
  label: string;
  /** Tailwind classes for a pill/badge */
  badge: string;
  description?: string;
}

export const THEMES: Record<Theme, Meta & { short: string }> = {
  governance: {
    label: 'Governance & accountability',
    short: 'Governance',
    badge: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    description: 'Board oversight, senior manager accountability, AI policies and inventories.',
  },
  model_risk: {
    label: 'Model risk management',
    short: 'Model risk',
    badge: 'bg-violet-50 text-violet-700 ring-violet-200',
    description: 'Validation, testing, monitoring and lifecycle controls for AI/ML models.',
  },
  investment_process: {
    label: 'Investment process',
    short: 'Investment',
    badge: 'bg-sky-50 text-sky-700 ring-sky-200',
    description: 'AI in research, portfolio construction, advice and suitability.',
  },
  disclosure_marketing: {
    label: 'Disclosure & AI-washing',
    short: 'Disclosure',
    badge: 'bg-rose-50 text-rose-700 ring-rose-200',
    description: 'Accuracy of AI claims in marketing, prospectuses and client communications.',
  },
  third_party: {
    label: 'Third-party & outsourcing',
    short: 'Vendors',
    badge: 'bg-amber-50 text-amber-800 ring-amber-200',
    description: 'Due diligence and oversight of AI vendors, cloud and foundation-model providers.',
  },
  data_privacy: {
    label: 'Data protection & privacy',
    short: 'Privacy',
    badge: 'bg-teal-50 text-teal-700 ring-teal-200',
    description: 'Personal data in training/inference, automated decision-making rights.',
  },
  conduct: {
    label: 'Conduct & client outcomes',
    short: 'Conduct',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    description: 'Fair treatment, conflicts of interest, bias and consumer protection.',
  },
  cyber_resilience: {
    label: 'Cyber & operational resilience',
    short: 'Cyber',
    badge: 'bg-slate-100 text-slate-700 ring-slate-300',
    description: 'AI-enabled threats, ICT risk and resilience of AI-dependent services.',
  },
  genai: {
    label: 'Generative AI',
    short: 'GenAI',
    badge: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200',
    description: 'LLMs, copilots, chatbots, content labelling and GPAI obligations.',
  },
  trading_markets: {
    label: 'Trading & market integrity',
    short: 'Trading',
    badge: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
    description: 'Algorithmic trading, herding, market abuse and financial stability.',
  },
  recordkeeping: {
    label: 'Recordkeeping & audit trail',
    short: 'Records',
    badge: 'bg-stone-100 text-stone-700 ring-stone-300',
    description: 'Logging, documentation and books-and-records for AI use.',
  },
};

export const STATUSES: Record<Status, Meta & { dot: string }> = {
  in_force: { label: 'In force', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500' },
  adopted: { label: 'Adopted – pending', badge: 'bg-sky-50 text-sky-700 ring-sky-200', dot: 'bg-sky-500' },
  guidance: { label: 'Guidance / expectations', badge: 'bg-teal-50 text-teal-700 ring-teal-200', dot: 'bg-teal-500' },
  consultation: { label: 'Consultation', badge: 'bg-violet-50 text-violet-700 ring-violet-200', dot: 'bg-violet-500' },
  proposed: { label: 'Proposed', badge: 'bg-indigo-50 text-indigo-700 ring-indigo-200', dot: 'bg-indigo-500' },
  withdrawn: { label: 'Withdrawn', badge: 'bg-slate-100 text-slate-500 ring-slate-200', dot: 'bg-slate-400' },
};

export const IMPACTS: Record<Impact, Meta & { rank: number; bar: string }> = {
  high: { label: 'High impact', badge: 'bg-rose-600 text-white ring-rose-600', rank: 3, bar: 'bg-rose-500' },
  medium: { label: 'Medium impact', badge: 'bg-amber-400 text-amber-950 ring-amber-400', rank: 2, bar: 'bg-amber-400' },
  low: { label: 'Low impact', badge: 'bg-slate-200 text-slate-700 ring-slate-200', rank: 1, bar: 'bg-slate-300' },
};

export const APPLICABILITY: Record<Applicability, Meta> = {
  direct: {
    label: 'Directly applicable',
    badge: 'bg-white text-slate-800 ring-slate-300',
    description: 'Binding on, or supervisory expectations addressed to, asset managers.',
  },
  indirect: {
    label: 'Indirect',
    badge: 'bg-white text-slate-600 ring-slate-200',
    description: 'Binds vendors, data or general activities that asset managers rely on.',
  },
  monitor: {
    label: 'Monitor',
    badge: 'bg-white text-slate-500 ring-slate-200',
    description: 'Horizon scanning: non-binding or not yet in effect.',
  },
};

export const TYPES: Record<InstrumentType, { label: string }> = {
  legislation: { label: 'Legislation' },
  rule: { label: 'Rule / regulation' },
  supervisory_guidance: { label: 'Supervisory guidance' },
  consultation: { label: 'Consultation' },
  statement: { label: 'Statement / speech' },
  enforcement: { label: 'Enforcement' },
  framework: { label: 'Standard / framework' },
  report: { label: 'Report' },
};

export const CONFIDENCE: Record<Confidence, { label: string; description: string }> = {
  high: { label: 'Verified', description: 'Status and dates verified against the primary source.' },
  medium: { label: 'Partly verified', description: 'Core facts verified; some dates or next steps are indicative.' },
  low: { label: 'Unverified', description: 'Could not be fully verified – confirm with the primary source before relying on it.' },
};

export const OWNERS: Owner[] = [
  'Compliance',
  'Risk',
  'Technology',
  'Legal',
  'Investment',
  'Distribution',
  'Operations',
  'Board',
];

export const ACTION_STATUSES: Record<ActionStatus, { label: string; badge: string }> = {
  not_started: { label: 'Not started', badge: 'bg-slate-100 text-slate-600 ring-slate-200' },
  in_progress: { label: 'In progress', badge: 'bg-amber-50 text-amber-800 ring-amber-200' },
  done: { label: 'Done', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  not_applicable: { label: 'N/A', badge: 'bg-white text-slate-400 ring-slate-200' },
};

export const THEME_ORDER = Object.keys(THEMES) as Theme[];
export const STATUS_ORDER = Object.keys(STATUSES) as Status[];
export const IMPACT_ORDER: Impact[] = ['high', 'medium', 'low'];
export const APPLICABILITY_ORDER = Object.keys(APPLICABILITY) as Applicability[];
export const TYPE_ORDER = Object.keys(TYPES) as InstrumentType[];
