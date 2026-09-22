export type JurisdictionId =
  | 'singapore'
  | 'us'
  | 'uk'
  | 'eu'
  | 'china'
  | 'korea'
  | 'hong_kong';

export type RegulatoryApproach =
  | 'comprehensive_risk'
  | 'targeted_service'
  | 'sectoral_state'
  | 'pro_innovation'
  | 'sandbox_governance'
  | 'balanced_safety';

export type InstrumentType =
  | 'statute'
  | 'executive_order'
  | 'guideline'
  | 'technical_standard'
  | 'strategy';

export type EnforcementStatus =
  | 'in_force'
  | 'staggered'
  | 'proposed'
  | 'guidance_active';

export type TopicCategory =
  | 'generative_ai'
  | 'risk_classification'
  | 'transparency_deepfakes'
  | 'data_privacy'
  | 'financial_fintech'
  | 'algorithmic_bias'
  | 'national_strategy_safety';

export interface Jurisdiction {
  id: JurisdictionId;
  name: string;
  code: string;
  flag: string;
  region: string;
  approach: RegulatoryApproach;
  approachLabel: string;
  approachSummary: string;
  primaryPhilosophy: string;
  leadAgencies: string[];
  keyStats: {
    bindingLaws: number;
    guidelines: number;
    enactedCount: number;
  };
  mapCoords: {
    x: number; // Percentage on SVG 0-1000
    y: number; // Percentage on SVG 0-500
    labelX?: number;
    labelY?: number;
  };
  color: string;
}

export interface Regulation {
  id: string;
  title: string;
  officialTitle: string;
  nativeTitle?: string;
  jurisdictionId: JurisdictionId;
  instrumentType: InstrumentType;
  status: EnforcementStatus;
  statusLabel: string;
  dateAnnounced: string;
  effectiveDate: string;
  nextMilestone?: string;
  leadAgencies: string[];
  topics: TopicCategory[];
  summary: string;
  keyProvisions: string[];
  scopeAndApplicability: string;
  complianceObligations: string[];
  penaltiesAndEnforcement: string;
  officialUrl: string;
  isLandmark?: boolean;
}

export interface FilterState {
  jurisdictions: JurisdictionId[];
  topics: TopicCategory[];
  instrumentTypes: InstrumentType[];
  statuses: EnforcementStatus[];
}

export type ViewMode = 'map' | 'directory' | 'industry_news';

export type IndustrySector =
  | 'energy'
  | 'infrastructure'
  | 'compute_cloud';

export interface IndustryNewsItem {
  id: string;
  title: string;
  sector: IndustrySector;
  sectorLabel: string;
  jurisdictionId: JurisdictionId;
  countryName: string;
  countryFlag: string;
  date: string;
  regulator: string;
  summary: string;
  complianceTakeaways: string[];
  impactLevel: 'Critical' | 'High' | 'Medium';
  focusArea: string;
  officialSourceUrl: string;
  officialSourceLabel: string;
  tags: string[];
}

export interface SectorMetric {
  sector: IndustrySector;
  label: string;
  trackedDevelopments: number;
  activeRegulationsCount: number;
  iconName: string;
  description: string;
}

