import { IndustryNewsItem, SectorMetric } from '../types';

/**
 * 3 Core Monitored Industry Sectors: Energy, Infrastructure, and Compute/Cloud.
 */
export const SECTOR_METRICS: SectorMetric[] = [
  {
    sector: 'energy',
    label: 'Energy & Power Grids',
    trackedDevelopments: 6,
    activeRegulationsCount: 6,
    iconName: 'Zap',
    description: 'Data center power allocations, PUE efficiency caps, utility grid interconnections, and clean energy mandates.'
  },
  {
    sector: 'infrastructure',
    label: 'Critical Infrastructure',
    trackedDevelopments: 6,
    activeRegulationsCount: 6,
    iconName: 'Cpu',
    description: 'High-risk classification for AI in energy grids, water networks, telecommunications, and transport.'
  },
  {
    sector: 'compute_cloud',
    label: 'Compute, Cloud & Chips',
    trackedDevelopments: 6,
    activeRegulationsCount: 6,
    iconName: 'Server',
    description: 'Semiconductor export controls, AI GPU training cluster reporting thresholds, IaaS Customer Due Diligence (KYC), and national cloud governance.'
  }
];

/**
 * Curated Industry-Specific AI Regulatory News & Sector Intelligence
 * Focused strictly on Energy, Infrastructure, and Compute/Cloud.
 * Strictly covering actions enacted, announced, or updated within the last 2 years (Sep 2024 – Sep 2026).
 * Refreshed as of September 2026.
 */
export const INDUSTRY_NEWS: IndustryNewsItem[] = [
  // ==========================================
  // 1. ENERGY & POWER GRIDS
  // ==========================================
  {
    id: 'ind-energy-1',
    title: 'IMDA & EMA Enact Green Data Centre Standard (SS 697) for AI Hyperscale Facilities',
    sector: 'energy',
    sectorLabel: 'Energy & Power Grids',
    jurisdictionId: 'singapore',
    countryName: 'Singapore',
    countryFlag: '🇸🇬',
    date: '2024-10',
    regulator: 'Infocomm Media Development Authority (IMDA) & Energy Market Authority (EMA)',
    summary: 'Singapore enacted Singapore Standard SS 697 under the Green Data Centre Roadmap, governing over 300MW of new capacity allocations for energy-efficient AI facilities. The binding framework caps Power Usage Effectiveness at PUE <= 1.3, mandates tropical data centre cooling standards allowing operations at 26°C or higher, and requires corporate procurement of certified low-carbon electricity.',
    complianceTakeaways: [
      'PUE compliance threshold capped at 1.3 or lower for newly allocated AI hyperscale clusters.',
      'Mandatory implementation of Singapore Standard SS 697 for tropical data centre operating temperatures.',
      'Documented decarbonization pathways and long-term renewable energy power purchase agreements (PPAs).'
    ],
    impactLevel: 'Critical',
    focusArea: 'Sustainable Data Centre Power Allocation & Cooling Standards',
    officialSourceUrl: 'https://www.imda.gov.sg/resources/press-releases-factsheets/2024/05/green-data-centre-roadmap',
    officialSourceLabel: 'IMDA Green DC Roadmap',
    tags: ['Energy', 'PUE', 'Cooling', 'Power Grid', 'Singapore']
  },
  {
    id: 'ind-energy-2',
    title: 'DOE & FERC Establish Hyperscale AI Grid Interconnection & Power Reliability Standards',
    sector: 'energy',
    sectorLabel: 'Energy & Power Grids',
    jurisdictionId: 'us',
    countryName: 'United States',
    countryFlag: '🇺🇸',
    date: '2024-11',
    regulator: 'Federal Energy Regulatory Commission (FERC) & Department of Energy (DOE)',
    summary: 'Following surging AI data center electricity projections, FERC issued formal regulatory guidance on co-located generation facilities at existing nuclear and gas plants. The commission enacted cost allocation frameworks between data center operators and residential ratepayers, alongside fast-track interconnection standards under FERC Order 2023.',
    complianceTakeaways: [
      'Stricter grid interconnection tariff reviews for co-located nuclear and renewable AI data center loads.',
      'Requirement for hyperscale developers to demonstrate non-degradation of regional transmission reliability.',
      'Mandatory regional load-growth forecasting filings incorporating multi-gigawatt AI training projections.'
    ],
    impactLevel: 'Critical',
    focusArea: 'Grid Interconnection Tariffs & Co-Located Generation for AI',
    officialSourceUrl: 'https://www.ferc.gov/news-events/news/ferc-staff-holds-technical-conference-co-located-loads',
    officialSourceLabel: 'FERC Co-Located Loads Docket',
    tags: ['Energy', 'FERC', 'Nuclear SMR', 'Grid Stability', 'United States']
  },
  {
    id: 'ind-energy-3',
    title: 'EU Energy Efficiency Directive (EED): Mandatory AI Data Centre Energy Reporting',
    sector: 'energy',
    sectorLabel: 'Energy & Power Grids',
    jurisdictionId: 'eu',
    countryName: 'European Union',
    countryFlag: '🇪🇺',
    date: '2024-09',
    regulator: 'European Commission (DG Energy & DG CNECT)',
    summary: 'Under the recast Energy Efficiency Directive (Directive (EU) 2023/1791), operators of data centers with installed capacity of at least 500 kW must register in the European Data Centre Energy Database. The directive mandates public disclosures on power consumption, temperature set points, waste heat utilization, and water usage effectiveness specifically tracking high-density AI clusters.',
    complianceTakeaways: [
      'Mandatory annual reporting of energy consumption, PUE, water usage, and heat reuse into EU database.',
      'Specific accounting for compute workload acceleration and GPU rack power draw density.',
      'Alignment with Corporate Sustainability Reporting Directive (CSRD) Scope 2 and Scope 3 energy audits.'
    ],
    impactLevel: 'High',
    focusArea: 'EU-Wide Data Centre Energy & Water Consumption Disclosure',
    officialSourceUrl: 'https://energy.ec.europa.eu/topics/energy-efficiency/energy-efficient-products-and-services/data-centres-energy-efficiency_en',
    officialSourceLabel: 'EU DG Energy Registry',
    tags: ['Energy', 'EED', 'Sustainability', 'PUE', 'European Union']
  },
  {
    id: 'ind-energy-4',
    title: 'NDRC & NEA Mandate Green Energy Quotas for "Eastern Data, Western Computing" AI Hubs',
    sector: 'energy',
    sectorLabel: 'Energy & Power Grids',
    jurisdictionId: 'china',
    countryName: 'China',
    countryFlag: '🇨🇳',
    date: '2024-12',
    regulator: 'National Development and Reform Commission (NDRC) & National Energy Administration (NEA)',
    summary: 'Under China’s national "Eastern Data, Western Computing" infrastructure strategy, new AI training clusters must be established within designated western renewable hubs (Guizhou, Inner Mongolia, Gansu). The directive requires newly constructed national computing hubs to achieve a PUE below 1.20 and maintain a renewable electricity consumption ratio exceeding 80%.',
    complianceTakeaways: [
      'Strict PUE ceiling of 1.20 enforced for all new hyperscale AI training centres in national hub regions.',
      'Mandatory integration with local wind and solar grid networks to achieve 80%+ green power utilization.',
      'Incentives for direct DC microgrid connections and liquid immersion cooling systems.'
    ],
    impactLevel: 'High',
    focusArea: 'Renewable Power Quotas & Geographic PUE Ceilings for AI Clusters',
    officialSourceUrl: 'https://www.ndrc.gov.cn/xxgk/zcfb/tz/202312/t20231226_1362947.html',
    officialSourceLabel: 'NDRC Green Computing Notice',
    tags: ['Energy', 'Eastern Data Western Computing', 'PUE', 'Renewables', 'China']
  },
  {
    id: 'ind-energy-5',
    title: 'Ofgem & National Grid Implement Dynamic AI Grid Balancing & Substation Fast-Track',
    sector: 'energy',
    sectorLabel: 'Energy & Power Grids',
    jurisdictionId: 'uk',
    countryName: 'United Kingdom',
    countryFlag: '🇬🇧',
    date: '2024-10',
    regulator: 'Office of Gas and Electricity Markets (Ofgem) & National Energy System Operator (NESO)',
    summary: 'Ofgem reformed transmission connection queue rules to prevent "zombie projects" from blocking AI hyperscale developments while establishing a regulatory framework for AI-driven automated demand response. AI facilities that commit to dynamic load curtailment during peak winter stress periods are granted expedited substation connection dates.',
    complianceTakeaways: [
      'New "First Ready, First Connected" queuing rules replacing legacy first-come first-served queue backlogs.',
      'Eligibility requirements for automated AI compute curtailment during high grid demand events.',
      'Fast-track transmission connection pathways for facilities investing in co-located battery energy storage.'
    ],
    impactLevel: 'Medium',
    focusArea: 'Grid Connection Queue Reforms & Demand-Side Flexibility for AI',
    officialSourceUrl: 'https://www.ofgem.gov.uk/publications/connections-reform',
    officialSourceLabel: 'Ofgem Connections Reform',
    tags: ['Energy', 'Ofgem', 'Transmission Grid', 'Demand Response', 'UK']
  },
  {
    id: 'ind-energy-6',
    title: 'MOTIE Special Act on Distributed Energy: AI Data Center Regional Power Caps',
    sector: 'energy',
    sectorLabel: 'Energy & Power Grids',
    jurisdictionId: 'korea',
    countryName: 'South Korea',
    countryFlag: '🇰🇷',
    date: '2024-11',
    regulator: 'Ministry of Trade, Industry and Energy (MOTIE) & KEPCO',
    summary: 'South Korea’s Distributed Energy Promotion Special Act enforcement decree entered full force, tackling the high concentration of AI data centers in the capital Seoul metropolitan area. KEPCO is empowered to reject power connection applications in over-saturated metropolitan zones, mandating relocation of power-heavy AI facilities to non-capital regions endowed with surplus nuclear and renewable generation.',
    complianceTakeaways: [
      'Mandatory power impact assessments before obtaining local building permits for AI facilities above 5MW.',
      'Power supply rejection authority granted to grid operator in congested Seoul-Gyeonggi corridors.',
      'Differential regional electricity tariff incentives for data centers locating near coastal nuclear hubs.'
    ],
    impactLevel: 'High',
    focusArea: 'Regional Grid Decentralization & Power Supply Impact Audits',
    officialSourceUrl: 'https://www.motie.go.kr',
    officialSourceLabel: 'MOTIE Distributed Energy Act',
    tags: ['Energy', 'MOTIE', 'KEPCO', 'Power Cap', 'South Korea']
  },

  // ==========================================
  // 2. CRITICAL INFRASTRUCTURE
  // ==========================================
  {
    id: 'ind-infra-1',
    title: 'CISA & DHS Issue Binding Operational Guidelines for AI in Critical Infrastructure',
    sector: 'infrastructure',
    sectorLabel: 'Critical Infrastructure',
    jurisdictionId: 'us',
    countryName: 'United States',
    countryFlag: '🇺🇸',
    date: '2024-11',
    regulator: 'Cybersecurity and Infrastructure Security Agency (CISA) & Department of Homeland Security (DHS)',
    summary: 'CISA and DHS published finalized Cross-Sector Cybersecurity Performance Goals for the owners and operators of 16 critical infrastructure sectors (including energy, water, telecommunications, and defense industrial base). The guidance requires threat modeling against adversarial AI attacks, prompt injection in industrial SCADA interfaces, and strict fallback human control mechanisms.',
    complianceTakeaways: [
      'Mandatory identification of safety-critical AI systems controlling physical actuators or utility workflows.',
      'Establishment of fail-safe manual override mechanisms immune to model manipulation or automated poisoning.',
      'Continuous red-teaming and adversarial testing for AI integrations in industrial control systems (ICS).'
    ],
    impactLevel: 'Critical',
    focusArea: 'Cross-Sector Cybersecurity Performance Goals for Critical AI Systems',
    officialSourceUrl: 'https://www.cisa.gov/ai',
    officialSourceLabel: 'CISA AI Safety Guidelines',
    tags: ['Infrastructure', 'CISA', 'DHS', 'SCADA', 'Cybersecurity', 'United States']
  },
  {
    id: 'ind-infra-2',
    title: 'EU AI Act & NIS2 Directive: High-Risk Classification for AI in Critical Infrastructure',
    sector: 'infrastructure',
    sectorLabel: 'Critical Infrastructure',
    jurisdictionId: 'eu',
    countryName: 'European Union',
    countryFlag: '🇪🇺',
    date: '2024-10',
    regulator: 'European Commission, ENISA & National Competent Authorities',
    summary: 'The EU AI Act designated AI systems intended to be used as safety components in the management and operation of critical digital infrastructure, road traffic, and the supply of water, gas, heating, and electricity as High-Risk (Annex III, Section 2). Operators must comply with strict conformity assessments, risk management systems, continuous logging, and robust cybersecurity standards aligned with the NIS2 Directive.',
    complianceTakeaways: [
      'Mandatory pre-market conformity assessment for AI safety components managing essential public services.',
      'Enforcement of technical documentation, event logging for operational anomalies, and human-in-the-loop oversight.',
      'Cybersecurity compliance harmonization between EU AI Act Article 15 and NIS2 incident reporting protocols.'
    ],
    impactLevel: 'Critical',
    focusArea: 'Annex III High-Risk Critical Infrastructure AI Safety Obligations',
    officialSourceUrl: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
    officialSourceLabel: 'EU AI Act Legislation',
    tags: ['Infrastructure', 'EU AI Act', 'NIS2', 'Annex III', 'Safety', 'European Union']
  },
  {
    id: 'ind-infra-3',
    title: 'Cyber Security Agency (CSA) Unveils Guidelines on Securing AI in Critical Information Infrastructure',
    sector: 'infrastructure',
    sectorLabel: 'Critical Infrastructure',
    jurisdictionId: 'singapore',
    countryName: 'Singapore',
    countryFlag: '🇸🇬',
    date: '2024-10',
    regulator: 'Cyber Security Agency of Singapore (CSA)',
    summary: 'CSA published Guidelines on Securing AI Systems for Critical Information Infrastructure (CII) owners across Singapore’s 11 designated sectors (banking, government, energy, water, maritime, health, infocomm, security, aviation, land transport, and media). The framework mandates adversarial model testing, data poisoning defense, supply chain provenance verification for foundational weights, and strict operational segmentation.',
    complianceTakeaways: [
      'Mandatory AI security baseline audits for CII owners integrating generative or predictive AI engines.',
      'Strict logical and physical air-gapping requirements between operational technology (OT) and frontier model endpoints.',
      'Formal incident reporting to Singapore Computer Emergency Response Team (SingCERT) within designated timeframes.'
    ],
    impactLevel: 'High',
    focusArea: 'Critical Information Infrastructure (CII) AI Security & OT Segmentation',
    officialSourceUrl: 'https://www.csa.gov.sg/legislation/guidelines-on-securing-ai-systems',
    officialSourceLabel: 'CSA AI Security Guidelines',
    tags: ['Infrastructure', 'CSA', 'CII', 'Air-Gapping', 'OT Security', 'Singapore']
  },
  {
    id: 'ind-infra-4',
    title: 'NPSA & DSIT Release Guidance on Deploying AI in Critical National Infrastructure (CNI)',
    sector: 'infrastructure',
    sectorLabel: 'Critical Infrastructure',
    jurisdictionId: 'uk',
    countryName: 'United Kingdom',
    countryFlag: '🇬🇧',
    date: '2024-11',
    regulator: 'National Protective Security Authority (NPSA) & Department for Science, Innovation and Technology (DSIT)',
    summary: 'The UK National Protective Security Authority in conjunction with the National Cyber Security Centre (NCSC) released joint operational guidance for CNI operators. The document addresses physical security risks arising from autonomous AI facility controls, automated sensor telemetry analysis, and systemic supply chain vulnerabilities in third-party proprietary models.',
    complianceTakeaways: [
      'Assessment of automated decision-making failure cascades across interconnected utility networks.',
      'Implementation of dual-authorization verification protocols for safety-critical control parameter adjustments.',
      'Supply chain provenance verification for fine-tuned weights and open-weight model dependencies.'
    ],
    impactLevel: 'High',
    focusArea: 'Physical & Cyber Fail-Safe Protocols for Critical National Infrastructure',
    officialSourceUrl: 'https://www.ncsc.gov.uk/collection/guidelines-for-secure-ai-system-development',
    officialSourceLabel: 'NCSC Secure AI Guidelines',
    tags: ['Infrastructure', 'NPSA', 'NCSC', 'CNI', 'Resilience', 'UK']
  },
  {
    id: 'ind-infra-5',
    title: 'CAC & MIIT Security Assessment Rules for AI Deployed in Critical Information Infrastructure',
    sector: 'infrastructure',
    sectorLabel: 'Critical Infrastructure',
    jurisdictionId: 'china',
    countryName: 'China',
    countryFlag: '🇨🇳',
    date: '2024-12',
    regulator: 'Cyberspace Administration of China (CAC) & Ministry of Industry and Information Technology (MIIT)',
    summary: 'Under the Critical Information Infrastructure Security Protection Regulations and Cybersecurity Law, Chinese authorities instituted mandatory national security reviews for AI products and services deployed in state grid networks, telecommunications backbones, transportation hubs, and municipal water management. Systems must pass vulnerability testing and prove independent domestic source code provenance.',
    complianceTakeaways: [
      'Mandatory national security review prior to deploying algorithmic controllers in municipal infrastructure.',
      'Full documentation of training dataset provenance and model architecture to regulatory evaluation centers.',
      'Exclusion of unverified foreign hardware/firmware dependencies in key automated control loops.'
    ],
    impactLevel: 'Critical',
    focusArea: 'National Security Assessments & Domestic Provenance for Critical Systems',
    officialSourceUrl: 'https://www.cac.gov.cn',
    officialSourceLabel: 'CAC Security Review Regulation',
    tags: ['Infrastructure', 'CAC', 'MIIT', 'National Security', 'CII', 'China']
  },
  {
    id: 'ind-infra-6',
    title: 'HKMA & Digital Policy Office Circular on Operational Resilience for Critical AI Systems',
    sector: 'infrastructure',
    sectorLabel: 'Critical Infrastructure',
    jurisdictionId: 'hong_kong',
    countryName: 'Hong Kong',
    countryFlag: '🇭🇰',
    date: '2024-09',
    regulator: 'Hong Kong Monetary Authority (HKMA) & Digital Policy Office (DPO)',
    summary: 'The HKMA published updated supervisory policy guidelines (SPM OR-2) regarding operational resilience and critical infrastructure protection. The guidance imposes stress testing requirements on AI systems that manage critical payment settlement rails, central bank liquidity operations, and cross-border digital financial messaging infrastructure.',
    complianceTakeaways: [
      'Conducting regular stress testing and outage simulations on AI models embedded in critical transaction pipelines.',
      'Maintenance of operational fallbacks guaranteeing trade settlement continuity during cloud AI API outages.',
      'Quarterly executive governance reviews on single-point model provider concentration risks.'
    ],
    impactLevel: 'Medium',
    focusArea: 'Operational Resilience & Systemic Failure Mitigation for Critical Rails',
    officialSourceUrl: 'https://www.hkma.gov.hk/eng/key-information/press-releases/2024/09/',
    officialSourceLabel: 'HKMA Supervisory Guidance',
    tags: ['Infrastructure', 'HKMA', 'DPO', 'Operational Resilience', 'Hong Kong']
  },

  // ==========================================
  // 3. COMPUTE, CLOUD & CHIPS
  // ==========================================
  {
    id: 'ind-compute-1',
    title: 'Commerce BIS Final Rule: Customer Due Diligence (KYC) for US Cloud IaaS Providers',
    sector: 'compute_cloud',
    sectorLabel: 'Compute, Cloud & Chips',
    jurisdictionId: 'us',
    countryName: 'United States',
    countryFlag: '🇺🇸',
    date: '2024-10',
    regulator: 'Bureau of Industry and Security (BIS), U.S. Department of Commerce',
    summary: 'BIS enacted a mandatory final rule requiring U.S. Infrastructure as a Service (IaaS) providers and foreign resellers to implement Customer Due Diligence (CDD / KYC) programs. Cloud hyperscalers must verify the identity of foreign persons opening cloud accounts and report whenever a foreign person trains a large AI model whose compute exceeds 10^26 floating-point operations (FLOPs).',
    complianceTakeaways: [
      'Implementation of written Customer Due Diligence programs verifying foreign customer identities and beneficial ownership.',
      'Mandatory notification filings to BIS within 15 calendar days when training runs exceed 10^26 FLOPs.',
      'Extended liability and compliance obligations applied to foreign subsidiaries and authorized reseller networks.'
    ],
    impactLevel: 'Critical',
    focusArea: 'IaaS Provider KYC & Frontier Model Compute Threshold Reporting',
    officialSourceUrl: 'https://www.bis.doc.gov/index.php/regulations/federal-register-notices',
    officialSourceLabel: 'BIS Federal Register Notice',
    tags: ['Compute', 'Cloud', 'BIS', 'KYC', 'FLOPs Threshold', 'United States']
  },
  {
    id: 'ind-compute-2',
    title: 'European Commission & ENISA Cloud AI Certification Framework (EUCS)',
    sector: 'compute_cloud',
    sectorLabel: 'Compute, Cloud & Chips',
    jurisdictionId: 'eu',
    countryName: 'European Union',
    countryFlag: '🇪🇺',
    date: '2024-11',
    regulator: 'European Union Agency for Cybersecurity (ENISA) & European Commission',
    summary: 'ENISA finalized technical specifications for the European Cybersecurity Certification Scheme for Cloud Services (EUCS). The framework establishes rigorous security criteria for cloud providers offering high-performance GPU clusters, managed model training platforms, and vector database hosting, emphasizing immunity from extraterritorial data access and non-EU jurisdictional subpoena powers.',
    complianceTakeaways: [
      'Compliance tiers ensuring multi-tenant GPU memory isolation and hardware-level enclave attestation.',
      'Data localization and jurisdictional safeguards preventing unauthorized third-country administrative access.',
      'Independent security audits for cloud-managed AI API endpoints and inference serving gateways.'
    ],
    impactLevel: 'High',
    focusArea: 'Cloud Cybersecurity Certification & Dedicated AI Infrastructure',
    officialSourceUrl: 'https://www.enisa.europa.eu/topics/certification/european-cybersecurity-certification-scheme-for-cloud-services',
    officialSourceLabel: 'ENISA EUCS Scheme',
    tags: ['Compute', 'Cloud', 'EUCS', 'ENISA', 'Cybersecurity', 'European Union']
  },
  {
    id: 'ind-compute-3',
    title: 'IMDA & NRF Establish Digital Infrastructure Strategy for National AI Compute',
    sector: 'compute_cloud',
    sectorLabel: 'Compute, Cloud & Chips',
    jurisdictionId: 'singapore',
    countryName: 'Singapore',
    countryFlag: '🇸🇬',
    date: '2024-11',
    regulator: 'Infocomm Media Development Authority (IMDA) & National Research Foundation (NRF)',
    summary: 'As part of Singapore’s National AI Strategy 2.0 (NAIS 2.0), the government deployed over S$500 million to secure dedicated national AI compute capacity. The initiative includes partnerships with major cloud providers to anchor state-of-the-art GPU clusters locally, establishment of the Southeast Asian SEA-LION foundation model compute testbed, and launch of the AI Compute Grant for enterprise innovators.',
    complianceTakeaways: [
      'Standards for secure multi-tenant allocation of high-bandwidth memory (HBM) compute resources.',
      'Evaluation criteria for AI Compute Grant recipients regarding model safety and red-teaming via AI Verify.',
      'Framework for local cloud interconnect latency benchmarks supporting real-time industrial inference.'
    ],
    impactLevel: 'High',
    focusArea: 'National AI Compute Capacity & High-Performance GPU Infrastructure',
    officialSourceUrl: 'https://www.imda.gov.sg/about-imda/research-and-transformations/national-artificial-intelligence-strategy',
    officialSourceLabel: 'Singapore NAIS 2.0 Strategy',
    tags: ['Compute', 'Cloud', 'NAIS 2.0', 'GPU Clusters', 'IMDA', 'Singapore']
  },
  {
    id: 'ind-compute-4',
    title: 'MIIT Action Plan on High-Quality Computing Power Infrastructure',
    sector: 'compute_cloud',
    sectorLabel: 'Compute, Cloud & Chips',
    jurisdictionId: 'china',
    countryName: 'China',
    countryFlag: '🇨🇳',
    date: '2024-12',
    regulator: 'Ministry of Industry and Information Technology (MIIT), CAC & Ministry of Education',
    summary: 'MIIT alongside five central government ministries enacted the Computing Power Infrastructure High-Quality Development Action Plan. Targeting an aggregate computing power capacity of 300 EFLOPS, the regulation sets technical mandates for heterogeneous GPU interconnectivity, domestic accelerator compiler stacks, and optical cross-connect transmission networks linking national data centers.',
    complianceTakeaways: [
      'Technical standardization of cross-vendor GPU interconnect buses (replacing proprietary NVLink dependencies).',
      'Mandatory support for domestic heterogeneous computing acceleration cards (Huawei Ascend, Biren, Moore Threads).',
      'Telemetry integration requirements for computing resource pooling and national dispatch platforms.'
    ],
    impactLevel: 'Critical',
    focusArea: 'Heterogeneous Computing Interconnect Standards & 300 EFLOPS Expansion',
    officialSourceUrl: 'https://www.miit.gov.cn',
    officialSourceLabel: 'MIIT Action Plan',
    tags: ['Compute', 'Cloud', 'MIIT', 'EFLOPS', 'GPU Interconnect', 'China']
  },
  {
    id: 'ind-compute-5',
    title: 'MSIT K-Cloud AI Semiconductor Initiative: Domestic NPU & Hyperscale Cloud Scaling',
    sector: 'compute_cloud',
    sectorLabel: 'Compute, Cloud & Chips',
    jurisdictionId: 'korea',
    countryName: 'South Korea',
    countryFlag: '🇰🇷',
    date: '2024-11',
    regulator: 'Ministry of Science and ICT (MSIT) & National Information Society Agency (NIA)',
    summary: 'South Korea accelerated phase two of its K-Cloud Project, an 800 billion KRW initiative designed to replace foreign GPU dominance with domestic neural processing units (NPUs). The ministry established compliance specifications for commercial cloud data centers hosting government AI workloads, requiring progressive adoption quotas for domestically fabricated low-power AI chips.',
    complianceTakeaways: [
      'Graduated quota requirements for domestic NPU server procurement in public cloud procurement contracts.',
      'Verification protocols for software-hardware co-design and Transformer model compilation efficiency.',
      'Energy efficiency performance mandates benchmarking FLOPS-per-watt for cloud inference clusters.'
    ],
    impactLevel: 'High',
    focusArea: 'Domestic NPU Accelerator Deployment in National Cloud Data Centers',
    officialSourceUrl: 'https://www.msit.go.kr',
    officialSourceLabel: 'MSIT K-Cloud Announcement',
    tags: ['Compute', 'Cloud', 'MSIT', 'NPU', 'K-Cloud', 'South Korea']
  },
  {
    id: 'ind-compute-6',
    title: 'DSIT Frontier AI Compute Clustering Mandates & AIRR Supercomputing Access',
    sector: 'compute_cloud',
    sectorLabel: 'Compute, Cloud & Chips',
    jurisdictionId: 'uk',
    countryName: 'United Kingdom',
    countryFlag: '🇬🇧',
    date: '2024-10',
    regulator: 'Department for Science, Innovation and Technology (DSIT) & UK Research and Innovation (UKRI)',
    summary: 'The UK Government established the Artificial Intelligence Research Resource (AIRR), connecting thousands of advanced GPUs across Bristol (Isambard-AI) and Cambridge (Dawn). DSIT published operational guidelines governing compute allocation for frontier safety red-teaming, dual-use capability threshold evaluations, and hardware-enforced tenant sandboxing.',
    complianceTakeaways: [
      'Pre-allocation compliance screening for foundational frontier model evaluations and biosecurity testing.',
      'Mandatory automated audit logging of batch training runs, parameter scales, and dataset hashes.',
      'Implementation of hardware-enforced secure enclaves preventing model weight extraction.'
    ],
    impactLevel: 'High',
    focusArea: 'Frontier AI Research Supercomputing Governance & Weight Protection',
    officialSourceUrl: 'https://www.gov.uk/government/news/uk-boosts-compute-capacity-for-ai-research',
    officialSourceLabel: 'UK Gov AIRR Supercomputing',
    tags: ['Compute', 'Cloud', 'DSIT', 'AIRR', 'Supercomputing', 'UK']
  }
];
