import type { Market, MarketId } from '../types';

export const MARKETS: Record<MarketId, Market> = {
  eu: {
    id: 'eu',
    name: 'European Union',
    shortName: 'EU',
    flag: '🇪🇺',
    region: 'Europe',
    approach: 'Horizontal, risk-based AI legislation layered on existing financial services rules',
    posture:
      'The AI Act applies in phases and reaches non-EU firms whose AI outputs are used in the EU. For most asset managers the binding exposure is as a "deployer" (HR, credit-like uses, GenAI transparency) and via GPAI vendors, while ESMA expects AI use in investment services to meet existing MiFID II, UCITS and AIFMD organisational and conduct rules.',
    keyRegulators: ['European Commission / AI Office', 'ESMA', 'National competent authorities (e.g. AMF, BaFin, CBI, CSSF)', 'EDPB'],
  },
  uk: {
    id: 'uk',
    name: 'United Kingdom',
    shortName: 'UK',
    flag: '🇬🇧',
    region: 'Europe',
    approach: 'Principles-based and regulator-led; no AI-specific statute for financial services',
    posture:
      'The FCA and Bank of England apply existing frameworks (Consumer Duty, SM&CR, SYSC, operational resilience, SS1/23 model risk) to AI rather than writing new AI rules. Expect supervisory engagement through testing initiatives and thematic work rather than prescriptive obligations.',
    keyRegulators: ['FCA', 'Bank of England / PRA', 'ICO', 'DSIT'],
  },
  us: {
    id: 'us',
    name: 'United States',
    shortName: 'US',
    flag: '🇺🇸',
    region: 'Americas',
    approach: 'Enforcement-led at federal level; fragmented state legislation',
    posture:
      'Federal policy has shifted towards deregulation and pre-empting state AI laws, but the SEC continues to police AI-washing and AI-related conflicts through existing antifraud, compliance-programme and marketing rules. State laws (Colorado, California, Texas, Illinois, NYC) mainly bite on HR, consumer-facing and vendor uses.',
    keyRegulators: ['SEC', 'FINRA', 'CFTC', 'State attorneys general', 'NYDFS', 'CPPA (California)'],
  },
  ca: {
    id: 'ca',
    name: 'Canada',
    shortName: 'Canada',
    flag: '🇨🇦',
    region: 'Americas',
    approach: 'Securities-law guidance; federal AI bill lapsed',
    posture:
      'The Canadian Securities Administrators have set out how existing securities law applies to AI systems used by registrants and investment fund managers, with emphasis on governance, explainability and disclosure. A federal horizontal AI statute is not currently in place.',
    keyRegulators: ['Canadian Securities Administrators (CSA)', 'OSC', 'AMF (Québec)', 'OSFI'],
  },
  ch: {
    id: 'ch',
    name: 'Switzerland',
    shortName: 'Switzerland',
    flag: '🇨🇭',
    region: 'Europe',
    approach: 'Supervisory expectations via FINMA; sector-specific legislative amendments planned',
    posture:
      'FINMA expects supervised institutions, including asset managers and fund management companies, to identify, assess and control AI risks within existing governance and risk-management frameworks. The Federal Council favours targeted amendments over an EU-style AI act.',
    keyRegulators: ['FINMA', 'Federal Council / FDJP', 'FDPIC'],
  },
  sg: {
    id: 'sg',
    name: 'Singapore',
    shortName: 'Singapore',
    flag: '🇸🇬',
    region: 'Asia-Pacific',
    approach: 'Supervisory guidelines and industry frameworks; no horizontal AI law',
    posture:
      'MAS is moving from principles (FEAT) and good-practice papers towards formal Guidelines on AI Risk Management that will apply to all financial institutions, including licensed fund management companies, proportionately to size and AI use.',
    keyRegulators: ['MAS', 'IMDA', 'PDPC'],
  },
  hk: {
    id: 'hk',
    name: 'Hong Kong',
    shortName: 'Hong Kong',
    flag: '🇭🇰',
    region: 'Asia-Pacific',
    approach: 'Circulars and supervisory expectations; pro-adoption government policy',
    posture:
      'The SFC expects licensed corporations using generative AI to apply a risk-based approach covering senior management oversight, model risk, cybersecurity and third-party risk, with extra safeguards for high-risk uses such as investment recommendations.',
    keyRegulators: ['SFC', 'HKMA', 'PCPD', 'FSTB'],
  },
  jp: {
    id: 'jp',
    name: 'Japan',
    shortName: 'Japan',
    flag: '🇯🇵',
    region: 'Asia-Pacific',
    approach: 'Promotion-focused soft law; AI Promotion Act with non-binding guidelines',
    posture:
      'Japan relies on voluntary guidelines and an innovation-oriented framework statute. The FSA encourages responsible AI adoption in finance and has published a discussion paper describing supervisory expectations rather than new rules.',
    keyRegulators: ['FSA', 'Cabinet Office AI Strategy HQ', 'METI / MIC', 'PPC'],
  },
  au: {
    id: 'au',
    name: 'Australia',
    shortName: 'Australia',
    flag: '🇦🇺',
    region: 'Asia-Pacific',
    approach: 'Existing technology-neutral laws plus voluntary guidance; no standalone AI act',
    posture:
      'ASIC applies existing licensee obligations (efficiently, honestly and fairly; risk management; outsourcing) to AI and has warned that governance is lagging adoption. Privacy Act reforms add transparency for automated decisions.',
    keyRegulators: ['ASIC', 'APRA', 'OAIC', 'Department of Industry, Science and Resources'],
  },
  cn: {
    id: 'cn',
    name: 'Mainland China',
    shortName: 'China',
    flag: '🇨🇳',
    region: 'Asia-Pacific',
    approach: 'Targeted, binding rules on algorithms, generative AI and content labelling',
    posture:
      'China regulates specific AI services (recommendation algorithms, deep synthesis, generative AI) with filing, security assessment and labelling duties. Asset managers with onshore operations or WFOE/JV entities should check filings for any public-facing AI services and cross-border data constraints on AI vendors.',
    keyRegulators: ['CAC', 'CSRC', 'AMAC', 'MIIT'],
  },
  kr: {
    id: 'kr',
    name: 'South Korea',
    shortName: 'Korea',
    flag: '🇰🇷',
    region: 'Asia-Pacific',
    approach: 'Comprehensive AI framework act plus financial-sector guidelines',
    posture:
      'The AI Basic Act imposes transparency and risk-management duties on providers of high-impact and generative AI, with a grace period on fines. The FSC has issued financial-sector AI guidelines expecting governance, risk assessment and consumer protection.',
    keyRegulators: ['FSC / FSS', 'MSIT', 'PIPC'],
  },
  global: {
    id: 'global',
    name: 'Global standard-setters',
    shortName: 'Global',
    flag: '🌐',
    region: 'International',
    approach: 'International principles and reports that shape national supervision',
    posture:
      'IOSCO, the FSB and others are not binding on firms directly, but their findings (herding, concentration in AI vendors, AI-washing, model risk) are the leading indicator for what national supervisors will expect next.',
    keyRegulators: ['IOSCO', 'FSB', 'BIS', 'OECD', 'Council of Europe', 'ISO/IEC'],
  },
};

export const MARKET_ORDER: MarketId[] = ['eu', 'uk', 'us', 'ca', 'ch', 'sg', 'hk', 'jp', 'au', 'cn', 'kr', 'global'];
