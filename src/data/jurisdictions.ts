import { Jurisdiction, TopicCategory, RegulatoryApproach, InstrumentType, EnforcementStatus } from '../types';

export const JURISDICTIONS: Record<string, Jurisdiction> = {
  singapore: {
    id: 'singapore',
    name: 'Singapore',
    code: 'SG',
    flag: '🇸🇬',
    region: 'Southeast Asia',
    approach: 'sandbox_governance',
    approachLabel: 'Collaborative Governance & Sandbox',
    approachSummary: 'Pragmatic, pro-business framework utilizing global pilot testing (AI Verify), model governance guidelines, and sectoral agility rather than prescriptive omnibus legislation.',
    primaryPhilosophy: 'Promoting trusted AI innovation through practical testing toolkits, international interoperability, and iterative guidelines.',
    leadAgencies: ['IMDA', 'AI Verify Foundation', 'PDPC', 'MAS', 'GovTech'],
    keyStats: {
      bindingLaws: 1,
      guidelines: 3,
      enactedCount: 4,
    },
    mapCoords: {
      x: 775,
      y: 335,
      labelX: 790,
      labelY: 345,
    },
    color: '#06b6d4', // Cyan
  },
  us: {
    id: 'us',
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    region: 'North America',
    approach: 'sectoral_state',
    approachLabel: 'Sectoral & State-Driven',
    approachSummary: 'Decentralized approach relying on Presidential Executive Orders, voluntary federal frameworks (NIST), agency enforcement (FTC, SEC), and state-level pioneer statutes (CA, CO).',
    primaryPhilosophy: 'Market-driven competitiveness balanced with critical infrastructure safety evaluations and state consumer protection protections.',
    leadAgencies: ['NIST', 'US AISI', 'White House OSTP', 'FTC', 'California Privacy Protection Agency'],
    keyStats: {
      bindingLaws: 3,
      guidelines: 1,
      enactedCount: 4,
    },
    mapCoords: {
      x: 215,
      y: 195,
      labelX: 200,
      labelY: 175,
    },
    color: '#3b82f6', // Blue
  },
  uk: {
    id: 'uk',
    name: 'United Kingdom',
    code: 'UK',
    flag: '🇬🇧',
    region: 'Europe (Non-EU)',
    approach: 'pro_innovation',
    approachLabel: 'Pro-Innovation & Regulators-Led',
    approachSummary: 'Cross-cutting principles delegated to specialized domain regulators (CMA, FCA, ICO) supported by the UK AI Safety Institute, with targeted frontier model legislation emerging.',
    primaryPhilosophy: 'Avoid blanket pre-emptive regulation; empower established sectoral regulators to apply five core principles proportionately.',
    leadAgencies: ['DSIT', 'UK AISI', 'CMA', 'ICO', 'FCA', 'Ofcom'],
    keyStats: {
      bindingLaws: 1,
      guidelines: 2,
      enactedCount: 3,
    },
    mapCoords: {
      x: 480,
      y: 160,
      labelX: 470,
      labelY: 140,
    },
    color: '#8b5cf6', // Violet
  },
  eu: {
    id: 'eu',
    name: 'European Union',
    code: 'EU',
    flag: '🇪🇺',
    region: 'Europe',
    approach: 'comprehensive_risk',
    approachLabel: 'Comprehensive Horizontal Risk-Based',
    approachSummary: 'The global benchmark for omnibus risk-tier legislation (EU AI Act). Bans unacceptable-risk practices, enforces strict conformity for high-risk systems, and imposes transparency on GPAI.',
    primaryPhilosophy: 'Fundamental rights, safety, and strict accountability with substantial extraterritorial reach and worldwide regulatory gravity.',
    leadAgencies: ['EU AI Office', 'European Commission', 'EDPB', 'National Market Surveillance Authorities'],
    keyStats: {
      bindingLaws: 2,
      guidelines: 1,
      enactedCount: 3,
    },
    mapCoords: {
      x: 520,
      y: 185,
      labelX: 535,
      labelY: 170,
    },
    color: '#10b981', // Emerald
  },
  china: {
    id: 'china',
    name: 'China',
    code: 'CN',
    flag: '🇨🇳',
    region: 'East Asia',
    approach: 'targeted_service',
    approachLabel: 'Targeted Content & Service Mandates',
    approachSummary: 'Iterative, targeted binding regulations focusing on generative services, deep synthesis, algorithmic recommendations, and mandatory algorithm filing with the CAC.',
    primaryPhilosophy: 'Ideological alignment with socialist values, public opinion influence control, national security, and strict technical safety corpus standards.',
    leadAgencies: ['CAC (Cyberspace Administration)', 'MIIT', 'MOST', 'SAMR', 'TC260'],
    keyStats: {
      bindingLaws: 2,
      guidelines: 1,
      enactedCount: 3,
    },
    mapCoords: {
      x: 770,
      y: 225,
      labelX: 790,
      labelY: 215,
    },
    color: '#ef4444', // Red / Coral
  },
  korea: {
    id: 'korea',
    name: 'South Korea',
    code: 'KR',
    flag: '🇰🇷',
    region: 'East Asia',
    approach: 'balanced_safety',
    approachLabel: 'Balanced Promotion & High-Impact Safety',
    approachSummary: 'Dual-track framework through the Framework Act on AI (AI Basic Act), combining aggressive domestic semiconductor/AI industrial promotion with safeguards for high-risk applications.',
    primaryPhilosophy: 'National AI industrial competitiveness and global safety summit diplomacy paired with transparent automated decision privacy rights.',
    leadAgencies: ['MSIT', 'PIPC', 'National AI Committee', 'KISA'],
    keyStats: {
      bindingLaws: 2,
      guidelines: 1,
      enactedCount: 3,
    },
    mapCoords: {
      x: 835,
      y: 220,
      labelX: 850,
      labelY: 205,
    },
    color: '#f59e0b', // Amber
  },
  hong_kong: {
    id: 'hong_kong',
    name: 'Hong Kong',
    code: 'HK',
    flag: '🇭🇰',
    region: 'East Asia',
    approach: 'sandbox_governance',
    approachLabel: 'Principles-Based & Financial Hub Guidance',
    approachSummary: 'Guidance-first model led by the Privacy Commissioner (PCPD) and banking regulator (HKMA), featuring a Generative AI Sandbox and clear ethical AI adoption frameworks.',
    primaryPhilosophy: 'Positioning as an international AI innovation & fintech hub while maintaining stringent privacy and fiduciary risk governance.',
    leadAgencies: ['PCPD', 'HKMA', 'SFC', 'Digital Policy Office (DPO)', 'Cyberport'],
    keyStats: {
      bindingLaws: 1,
      guidelines: 2,
      enactedCount: 3,
    },
    mapCoords: {
      x: 795,
      y: 265,
      labelX: 815,
      labelY: 275,
    },
    color: '#ec4899', // Pink
  },
};

export const JURISDICTION_LIST = Object.values(JURISDICTIONS);

export const TOPIC_METADATA: Record<TopicCategory, { label: string; description: string; color: string }> = {
  generative_ai: {
    label: 'Generative AI & Foundation Models',
    description: 'Rules and testing requirements for LLMs, GPAI, frontier models, and synthetic generation.',
    color: 'indigo',
  },
  risk_classification: {
    label: 'Risk Classification & Prohibited AI',
    description: 'Tiered risk hierarchies, unacceptable/banned AI practices, and conformity assessments.',
    color: 'rose',
  },
  transparency_deepfakes: {
    label: 'Transparency, Watermarking & Synthetic Media',
    description: 'Labelling AI content, metadata embedding, training data summaries, and deepfake disclosure.',
    color: 'amber',
  },
  data_privacy: {
    label: 'Data Privacy & Training Data Governance',
    description: 'Personal data protection, IP/copyright exemptions, web scraping legality, and consent frameworks.',
    color: 'teal',
  },
  financial_fintech: {
    label: 'Financial Services & Banking Regulation',
    description: 'Credit scoring, algorithmic trading, customer profiling, and central bank sandbox guidance.',
    color: 'emerald',
  },
  algorithmic_bias: {
    label: 'Algorithmic Fairness, Bias & Civil Rights',
    description: 'Anti-discrimination mandates, human oversight, impact assessments, and explainability.',
    color: 'purple',
  },
  national_strategy_safety: {
    label: 'National Strategy & AI Safety Institutes',
    description: 'Government roadmaps, AISI red-teaming consortiums, compute infrastructure, and sandboxes.',
    color: 'sky',
  },
};

export const APPROACH_METADATA: Record<RegulatoryApproach, { label: string; badgeClass: string; borderClass: string; dotClass: string }> = {
  comprehensive_risk: {
    label: 'Comprehensive Horizontal Risk-Based',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    borderClass: 'border-emerald-500/40',
    dotClass: 'bg-emerald-400',
  },
  targeted_service: {
    label: 'Targeted Content & Service Mandates',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    borderClass: 'border-rose-500/40',
    dotClass: 'bg-rose-400',
  },
  sectoral_state: {
    label: 'Sectoral & State-Driven',
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    borderClass: 'border-blue-500/40',
    dotClass: 'bg-blue-400',
  },
  pro_innovation: {
    label: 'Pro-Innovation & Regulators-Led',
    badgeClass: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    borderClass: 'border-violet-500/40',
    dotClass: 'bg-violet-400',
  },
  sandbox_governance: {
    label: 'Collaborative Governance & Sandbox',
    badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    borderClass: 'border-cyan-500/40',
    dotClass: 'bg-cyan-400',
  },
  balanced_safety: {
    label: 'Balanced Promotion & High-Impact Safety',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    borderClass: 'border-amber-500/40',
    dotClass: 'bg-amber-400',
  },
};

export const INSTRUMENT_METADATA: Record<InstrumentType, { label: string; short: string }> = {
  statute: { label: 'Binding Legislation / Statute', short: 'Statute' },
  executive_order: { label: 'Executive Order / Presidential Decree', short: 'Executive Order' },
  guideline: { label: 'Regulatory Framework / Guideline', short: 'Guideline' },
  technical_standard: { label: 'Technical Standard & Testing Suite', short: 'Standard' },
  strategy: { label: 'National Strategy & Policy Whitepaper', short: 'Strategy' },
};

export const STATUS_METADATA: Record<EnforcementStatus, { label: string; badgeClass: string; dotClass: string }> = {
  in_force: {
    label: 'In Force / Enacted',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    dotClass: 'bg-emerald-400',
  },
  staggered: {
    label: 'Staggered Compliance / Upcoming Dates',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dotClass: 'bg-amber-400 animate-pulse',
  },
  proposed: {
    label: 'Proposed / In Legislative Review',
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    dotClass: 'bg-blue-400',
  },
  guidance_active: {
    label: 'Active Regulatory Guidance',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    dotClass: 'bg-purple-400',
  },
};
