/**
 * Domain model for the Buy-Side AI Regulatory Tracker.
 *
 * A "Development" is a single regulatory instrument or event (law, rule,
 * supervisory guidance, consultation, enforcement action, statement) that a
 * buy-side asset manager's compliance function should be aware of.
 */

export type MarketId =
  | 'eu'
  | 'uk'
  | 'us'
  | 'ca'
  | 'ch'
  | 'sg'
  | 'hk'
  | 'jp'
  | 'au'
  | 'cn'
  | 'kr'
  | 'global';

export type InstrumentType =
  | 'legislation'
  | 'rule'
  | 'supervisory_guidance'
  | 'consultation'
  | 'statement'
  | 'enforcement'
  | 'framework'
  | 'report';

export type Status =
  | 'in_force'
  | 'adopted'
  | 'consultation'
  | 'proposed'
  | 'guidance'
  | 'withdrawn';

export type Impact = 'high' | 'medium' | 'low';

/** direct = binds asset managers; indirect = binds vendors / general law; monitor = horizon scanning */
export type Applicability = 'direct' | 'indirect' | 'monitor';

export type Theme =
  | 'governance'
  | 'model_risk'
  | 'investment_process'
  | 'disclosure_marketing'
  | 'third_party'
  | 'data_privacy'
  | 'conduct'
  | 'cyber_resilience'
  | 'genai'
  | 'trading_markets'
  | 'recordkeeping';

export type Owner =
  | 'Compliance'
  | 'Risk'
  | 'Technology'
  | 'Legal'
  | 'Investment'
  | 'Distribution'
  | 'Operations'
  | 'Board';

export type Confidence = 'high' | 'medium' | 'low';

export interface ActionItem {
  /** Stable id: `${developmentId}-a${n}` */
  id: string;
  text: string;
  owner: Owner;
}

export interface Milestone {
  date: string; // YYYY-MM-DD
  label: string;
  /** false = indicative / expected date not yet fixed */
  confirmed: boolean;
}

export interface Development {
  id: string;
  market: MarketId;
  title: string;
  officialTitle: string;
  regulator: string;
  instrumentType: InstrumentType;
  status: Status;
  datePublished: string;
  effectiveDate: string | null;
  lastUpdated: string;
  latestUpdate: string;
  impact: Impact;
  applicability: Applicability;
  themes: Theme[];
  summary: string;
  buySideImpact: string;
  keyRequirements: string[];
  actions: ActionItem[];
  milestones: Milestone[];
  sourceUrl: string;
  sourceLabel: string;
  confidence: Confidence;
}

export interface Market {
  id: MarketId;
  name: string;
  shortName: string;
  flag: string;
  region: 'Europe' | 'Americas' | 'Asia-Pacific' | 'International';
  /** One-line characterisation of the regulatory model */
  approach: string;
  /** What a buy-side firm should know about the market's posture */
  posture: string;
  /** Regulators most relevant to asset managers */
  keyRegulators: string[];
}

/** ---- User workspace state (persisted locally) ---- */

export type ActionStatus = 'not_started' | 'in_progress' | 'done' | 'not_applicable';

export interface ActionProgress {
  status: ActionStatus;
  owner?: Owner;
  due?: string; // YYYY-MM-DD
  notes?: string;
  updatedAt?: string; // ISO timestamp
}

export interface Filters {
  query: string;
  markets: MarketId[];
  themes: Theme[];
  statuses: Status[];
  impacts: Impact[];
  applicability: Applicability[];
  types: InstrumentType[];
  watchedOnly: boolean;
  unreadOnly: boolean;
}

export type SortKey = 'latest' | 'impact' | 'next_deadline' | 'market';

export type ViewId = 'overview' | 'developments' | 'horizon' | 'markets' | 'actions' | 'briefing';
