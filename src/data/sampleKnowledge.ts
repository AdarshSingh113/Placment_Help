import { KnowledgeSummary } from '../types';

export const initialKnowledgeSummaries: KnowledgeSummary[] = [
  {
    id: 'k-1',
    title: 'Mixture of Experts (MoE) & Transformer Scaling Laws in Modern AI',
    inputType: 'topic',
    rawInputSnippet: 'Deep dive into Mixture of Experts (MoE) vs Dense models, token routing, and VRAM efficiency in frontier LLMs like Gemini and DeepSeek.',
    primaryCategory: 'Artificial Intelligence & Tech',
    tags: ['AI', 'Machine Learning', 'Transformers', 'DeepTech', 'Tech Architecture'],
    oneLiner: 'MoE architectures activate only a sparse subset of expert feed-forward networks per token, delivering frontier model performance at 3-5x lower inference latency and compute costs.',
    executiveSummary: 'Mixture of Experts (MoE) replaces standard dense Feed-Forward Networks (FFN) with multiple specialized sub-networks ("experts") coordinated by a learned gating router. When an input token enters the layer, top-k routing selects the most pertinent 1 to 2 experts out of 8 to 64, keeping computational FLOPS low while maximizing total parameter capacity.\n\nThis paradigm shift explains how modern frontier models achieve GPT-4 class reasoning while running at inference costs comparable to much smaller 8B-14B models. The primary architectural tradeoff lies in VRAM requirements (all expert weights must reside in GPU memory even if only a fraction fire per forward pass).',
    keyTakeaways: [
      'Sparse Activation: Only 2 out of 8/16 experts activate per token, reducing inference compute (FLOPs) by up to 70%.',
      'Router Load Balancing: Auxiliary loss functions prevent token collapse where a single "popular" expert handles all tokens.',
      'Memory vs Compute Tradeoff: High total parameter memory footprint (VRAM) despite low active inference compute.',
      'Production Viability: Powers next-gen agents, on-device speculative decoding, and low-latency API endpoints.'
    ],
    coreConcepts: [
      {
        concept: 'Top-k Gating Router',
        explanation: 'A softmax probability distribution computed over all expert networks to dynamically route each token to the highest scoring k experts.'
      },
      {
        concept: 'Sparse vs Dense Computation',
        explanation: 'Dense models run 100% of weights for every single token; sparse MoE models selectively execute ~10-25% of weights per token.'
      },
      {
        concept: 'Expert Capacity Factor',
        explanation: 'The maximum allowable tokens an expert can process in a single batch before tokens are dropped or overflowed.'
      }
    ],
    interviewRelevance: 'Critical for Product Management (AI Infra), Tech Consulting, and Strategy interviews when discussing AI unit economics, GPU hardware margins, and LLM inference optimization.',
    potentialQuestions: [
      'How does MoE improve the unit economics of hosting an AI SaaS platform?',
      'What are the memory bandwidth bottlenecks when deploying a 100B parameter MoE model on consumer hardware?'
    ],
    industryMetricsOrFacts: [
      'MoE models reduce active FLOPs by 65-75% relative to equivalent dense parameter models.',
      'Allows sub-100ms first-token latency in high-throughput enterprise API environments.'
    ],
    status: 'Mastered',
    isFavorite: true,
    userNotes: 'Great reference for Tech Consulting & AI product manager rounds.',
    readingTimeMinutes: 4,
    webSources: [
      { title: 'Google Research - Switch Transformers & Sparsely-Gated MoE', uri: 'https://arxiv.org' },
      { title: 'HuggingFace MoE Technical Deep Dive', uri: 'https://huggingface.co/blog/moe' }
    ],
    qaHistory: [
      {
        id: 'qa-1',
        question: 'Why do MoE models require high VRAM despite low compute?',
        answer: 'Because while only top-2 experts are computed for a token, all 8-16 expert weights must remain loaded in GPU VRAM to allow instantaneous routing without disk or PCIe transfer latency.',
        timestamp: '2026-08-28T10:30:00Z'
      }
    ],
    createdAt: '2026-08-25T08:00:00Z',
    updatedAt: '2026-08-28T10:30:00Z'
  },
  {
    id: 'k-2',
    title: 'Customer Acquisition Cost (CAC) Payback & Net Revenue Retention (NRR) in B2B SaaS',
    inputType: 'document',
    rawInputSnippet: 'Executive breakdown of B2B SaaS unit economics, CAC Payback period dynamics, Magic Number, and Net Revenue Retention (NRR) expansion benchmarks.',
    primaryCategory: 'Marketing & Growth',
    tags: ['Marketing', 'B2B SaaS', 'Unit Economics', 'Growth Strategy', 'Finance'],
    oneLiner: 'Healthy SaaS companies maintain CAC Payback under 12 months with NRR exceeding 120%, ensuring revenue compounds organically without unsustainable ad spend.',
    executiveSummary: 'In subscription-based SaaS businesses, top-line growth is meaningless without sustainable unit economics. CAC Payback measures the number of months required for gross margin from a customer to recover the fully burdened sales and marketing acquisition cost.\n\nSimultaneously, Net Revenue Retention (NRR) measures how much recurring revenue grows or shrinks from an existing customer cohort over 12 months (accounting for upgrades, cross-sells, downgrades, and churn). Best-in-class enterprise SaaS companies achieve 125%+ NRR, enabling growth even with zero new outbound customer acquisition.',
    keyTakeaways: [
      'CAC Payback Formula: (Sales & Marketing Expense in Period t-1) / (Net New ARR added in Period t × Gross Margin %).',
      'Benchmark Thresholds: <12 months is top quartile for SMB/Mid-market; <18 months for Enterprise with multi-year commitments.',
      'Magic Number: Net New Annualized ARR / Prior Quarter S&M Spend. A ratio >0.75 indicates an efficient sales engine ready to scale capital.',
      'NRR Expansion Mechanics: Driven by seat expansion, usage-based compute/storage tiers, and product add-on modules.'
    ],
    coreConcepts: [
      {
        concept: 'Net Revenue Retention (NRR)',
        explanation: '[(Beginning ARR + Expansion - Contraction - Churn) / Beginning ARR] × 100%. Demonstrates value expansion within retained accounts.'
      },
      {
        concept: 'Fully Burdened CAC',
        explanation: 'Includes ad spend, sales reps salaries, SDR commissions, onboarding software, and marketing agency fees divided by new customers acquired.'
      },
      {
        concept: 'LTV/CAC Ratio',
        explanation: 'Customer Lifetime Value divided by Acquisition Cost. Standard healthy SaaS target is 3x to 5x.'
      }
    ],
    interviewRelevance: 'Essential for Marketing Strategy, Growth Equity, Venture Capital, and GTM Management rounds. Frequently tested in case studies.',
    potentialQuestions: [
      'If CAC increases by 30% due to rising ad costs, how can a marketing VP compensate using NRR and pricing levers?',
      'How do you evaluate whether a B2B startup should invest in Product-Led Growth (PLG) vs Enterprise Sales?'
    ],
    industryMetricsOrFacts: [
      'Top-quartile public SaaS median NRR is 120-130% (e.g. Snowflake, Datadog).',
      'CAC Payback over 24 months creates severe cash flow burn without continuous equity funding.'
    ],
    status: 'Reviewed',
    isFavorite: true,
    userNotes: 'Used for B2B Growth case interview practice.',
    readingTimeMinutes: 5,
    webSources: [
      { title: 'Bessemer Venture Partners SaaS Benchmarks', uri: 'https://www.bvp.com' },
      { title: 'OpenView Product-Led Growth Metrics Report', uri: 'https://openviewpartners.com' }
    ],
    qaHistory: [],
    createdAt: '2026-08-20T11:00:00Z',
    updatedAt: '2026-08-22T14:15:00Z'
  },
  {
    id: 'k-3',
    title: 'Central Bank Rate Cycles, Yield Curve Inversions & Liquidity Transmission',
    inputType: 'topic',
    rawInputSnippet: 'Macroeconomic analysis of RBI and US Fed interest rate decisions, 10Y-2Y yield curve spreads, bond prices, and corporate debt rollover risks.',
    primaryCategory: 'Finance & Markets',
    tags: ['Finance', 'Macroeconomics', 'Monetary Policy', 'Banking', 'Markets'],
    oneLiner: 'Central bank rate decisions transmit through the banking system to dictate borrowing costs, corporate valuation multiples, and currency exchange stability.',
    executiveSummary: 'When central banks raise policy repo rates to curb inflation, higher yields increase discount rates in DCF models, compressing equity valuation multiples (especially long-duration growth assets). Conversely, rate cuts inject systemic liquidity, spurring capital expenditure and credit growth.\n\nA yield curve inversion (where short-term yields like the 2-Year Treasury exceed 10-Year yields) has historically served as a reliable leading indicator of economic slowdowns and recessions within a 12-18 month window.',
    keyTakeaways: [
      'Discount Rate Impact: High rates increase the weighted average cost of capital (WACC), reducing the present value of future corporate cash flows.',
      'Banking NIM Dynamics: Net Interest Margins (NIM) temporarily widen as floating loan rates reset faster than fixed deposit costs.',
      'Bond Price Mechanics: Bond prices move inversely to market interest rates due to duration risk.',
      'Emerging Market Capital Flight: Widening rate differentials between US Treasuries and RBI Repo rates can trigger FII equity outflows and currency depreciation.'
    ],
    coreConcepts: [
      {
        concept: 'Yield Curve Inversion (2Y/10Y)',
        explanation: 'Occurs when investors anticipate future growth deceleration, bidding up long-term bonds and driving long yields below short-term rates.'
      },
      {
        concept: 'Monetary Policy Transmission Lag',
        explanation: 'The 6-18 month delay between central bank rate adjustments and observable macroeconomic changes in employment and inflation.'
      },
      {
        concept: 'Quantitative Tightening (QT)',
        explanation: 'Central banks allowing maturing balance-sheet bonds to roll off without reinvestment, directly draining liquidity from the financial system.'
      }
    ],
    interviewRelevance: 'Standard question topic for Investment Banking, Corporate Treasury, Commercial Banking, and Private Wealth Management interviews.',
    potentialQuestions: [
      'Explain how a 50 bps surprise rate hike by the RBI affects Indian IT exporters vs Real Estate developers.',
      'Why do growth tech stocks experience higher multiple compression during rate hikes than consumer staples?'
    ],
    industryMetricsOrFacts: [
      'A 100 bps shift in discount rates can alter a high-growth tech valuation by 15-25% in discounted cash flow calculations.',
      'RBI repo rate stance strongly correlates with corporate bond issuance volumes in domestic credit markets.'
    ],
    status: 'Mastered',
    isFavorite: false,
    userNotes: 'Crucial for finance domain prep and macroeconomic awareness.',
    readingTimeMinutes: 4,
    webSources: [
      { title: 'Reserve Bank of India Monetary Policy Report', uri: 'https://rbi.org.in' },
      { title: 'Federal Reserve Economic Data (FRED)', uri: 'https://fred.stlouisfed.org' }
    ],
    qaHistory: [],
    createdAt: '2026-08-22T09:30:00Z',
    updatedAt: '2026-08-24T16:45:00Z'
  },
  {
    id: 'k-4',
    title: 'India Semiconductor Mission (ISM) & Global Chip Supply Chain Geopolitics',
    inputType: 'url',
    sourceUrl: 'https://pib.gov.in/PressReleasePage.aspx?PRID=1886000',
    rawInputSnippet: 'Analysis of India Semiconductor Mission (ISM) $10B incentive scheme, Fab vs ATMP/OSAT packaging units, and the Silicon Shield geopolitics.',
    primaryCategory: 'General Knowledge & Current Affairs',
    tags: ['General Knowledge', 'Current Affairs', 'Semiconductors', 'Geopolitics', 'Industrial Policy', 'India Growth'],
    oneLiner: 'India $10B incentive scheme focuses on establishing advanced ATMP/OSAT packaging and trailing-edge fab units to secure domestic hardware supply chains and reduce reliance on East Asian foundries.',
    executiveSummary: 'Semiconductor manufacturing is the geopolitical fulcrum of the modern digital economy. With over 75% of global advanced node fabrication concentrated in Taiwan (TSMC) and South Korea (Samsung), major economies are offering massive subsidies (US CHIPS Act, EU Chips Act, and India Semiconductor Mission) to domesticate manufacturing.\n\nIndia has structured a $10 Billion capital incentive package covering up to 50% of project costs on a pari-passu basis. The strategic focus prioritizes OSAT (Outsourced Semiconductor Assembly and Test) and trailing-edge node fabs (28nm-65nm for automotive, power, and industrial IoT) which offer faster gestation periods and strong domestic demand.',
    keyTakeaways: [
      'Incentive Structure: 50% central fiscal support on project cost across Silicon Fabs, Display Fabs, Compound Semiconductors, and ATMP/OSAT units.',
      'Trailing vs Leading Edge: Focusing on 28nm+ mature nodes matches domestic automotive/defense demand and avoids $20B+ extreme EUV capex risks.',
      'Geopolitical De-risking: Global "China+1" and "Taiwan+1" supply chain diversification strategies create strong tailwinds for Indian partnerships.',
      'Key Infrastructure Requisites: 24/7 uninterrupted ultra-pure water (UPW), reliable high-voltage clean electricity, and specialized talent clusters.'
    ],
    coreConcepts: [
      {
        concept: 'Fab vs Fabless vs OSAT/ATMP',
        explanation: 'Fabless companies (Nvidia, Qualcomm) design chips; Foundries/Fabs (TSMC) manufacture raw silicon wafers; OSAT/ATMP units package, wire, and test final chips.'
      },
      {
        concept: 'Node Geometry (e.g. 3nm vs 28nm)',
        explanation: 'Smaller nodes offer higher transistor density and power efficiency (smartphones/GPUs), while larger nodes offer extreme reliability and lower cost (automotive/appliances).'
      },
      {
        concept: 'Pari-Passu Fiscal Support',
        explanation: 'Government fund releases disbursed proportionately alongside private equity milestones rather than post-commissioning reimbursements.'
      }
    ],
    interviewRelevance: 'High-frequency topic for MBA Group Discussions (GD), Current Affairs rounds, and Supply Chain / Operations interviews.',
    potentialQuestions: [
      'Is India $10B semiconductor incentive package better spent on wafer fabs or OSAT packaging units?',
      'How does the global concentration of semiconductor fabrication impact supply chain resilience in the automotive sector?'
    ],
    industryMetricsOrFacts: [
      'Global semiconductor market projected to surpass $1 Trillion in revenue by 2030.',
      'A single modern 3nm gigafab requires upwards of $15 Billion - $20 Billion in upfront capital expenditure.'
    ],
    status: 'Reviewed',
    isFavorite: true,
    userNotes: 'Key topic for upcoming GDs on Make in India and electronics manufacturing.',
    readingTimeMinutes: 5,
    webSources: [
      { title: 'India Semiconductor Mission (ISM) - Ministry of Electronics & IT', uri: 'https://ism.gov.in' },
      { title: 'Semiconductor Industry Association (SIA) Global Factbook', uri: 'https://www.semiconductors.org' }
    ],
    qaHistory: [],
    createdAt: '2026-08-26T14:00:00Z',
    updatedAt: '2026-08-27T18:20:00Z'
  }
];
