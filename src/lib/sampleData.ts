import { 
  Company, 
  Question, 
  Guesstimate, 
  EstimationFramework, 
  GDTopic, 
  NewsItem, 
  DataPoint, 
  Mistake, 
  DailyLog, 
  ReadingItem, 
  CommunicationLog, 
  DailyFocusTask,
  CustomFieldDefinition,
  InterviewRecord,
  UserSettings,
  GymLog,
  FoodItem,
  FoodLogEntry,
  DailyNutritionGoals,
  Medicine,
  MedicineLog
} from '../types';

export const initialCustomFields: CustomFieldDefinition[] = [
  {
    id: 'cf_company_ceo',
    name: 'Current CEO / Global Leader',
    type: 'text',
    entityType: 'company',
    placeholder: 'e.g. Bob Sternfels'
  },
  {
    id: 'cf_company_rev',
    name: 'Annual Global Revenue',
    type: 'text',
    entityType: 'company',
    placeholder: 'e.g. $16 Billion USD'
  },
  {
    id: 'cf_company_hire',
    name: 'Why should they hire me?',
    type: 'long_text',
    entityType: 'company',
    placeholder: 'Core differentiator and unique value proposition'
  },
  {
    id: 'cf_q_framework',
    name: 'Applicable Framework',
    type: 'tags',
    entityType: 'question'
  }
];

export const initialCompanies: Company[] = [
  {
    id: 'comp_mckinsey',
    name: 'McKinsey & Company',
    industry: 'Management Consulting',
    website: 'https://www.mckinsey.com',
    status: 'Interview Scheduled',
    prepProgress: 76,
    interviewDate: '2026-08-28',
    role: 'Associate / Management Consultant',
    vision: 'To help top organizations realize their highest ambitions and drive sustainable, inclusive growth.',
    mission: 'Help leaders in the commercial, public, and social sectors create substantial and lasting improvement in performance.',
    values: ['Adhere to the highest professional standards', 'Improve our clients performance significantly', 'Create an unrivaled environment for exceptional people'],
    businessModel: 'Fee-based strategic advisory, transformation leadership, implementation and digital capability building (McKinsey QuantumBlack).',
    productsServices: 'Strategy, Corporate Finance, Operations, Digital Transformation, Sustainability, Organization Design.',
    targetCustomers: 'Fortune 500 enterprises, sovereign wealth funds, governments, global NGOs.',
    revenueModel: 'Fixed value-at-risk project retainers, premium hourly billing, outcome-based transformation sharing.',
    keyCompetitors: ['Bain & Company', 'Boston Consulting Group (BCG)', 'Strategy&', 'Oliver Wyman'],
    marketPosition: 'Global benchmark for top-tier corporate strategy and board-level executive counsel.',
    recentNews: 'Expanded generative AI deployment alliance with global cloud leaders to transform enterprise workflows.',
    whyThisCompany: 'Unmatched scale of high-stakes transformation work, peerless apprenticeship model, and the rigor of peer problem-solving.',
    whyThisRole: 'Opportunity to bridge strategy with hands-on organizational transformation across diverse sectors.',
    attractions: 'Pace of learning, partner mentorship, global alumni network, breadth of cross-industry exposure.',
    concerns: 'High work cadence requiring rigorous personal boundary management.',
    differentiators: 'Dedicated knowledge network, proprietary industry benchmarks, QuantumBlack AI integration.',
    recentDevelopments: 'Pivoting strongly towards sustainable technology & ESG consulting practices in high-growth Asian markets.',
    importantMetrics: 'Over 45,000 employees globally; 130+ offices; 80% of Fortune Global 500 served over the past decade.',
    myNotes: 'Focus heavily on PEI (Personal Experience Interview) stories. Structure every story using CAR (Context, Action, Result) with strong "I" vs "We" distinction.',
    isFavorite: true,
    customFields: {
      cf_company_ceo: 'Bob Sternfels',
      cf_company_rev: '$16B+ USD',
      cf_company_hire: 'Proven cross-functional program leadership with deep data modeling expertise and structured problem breakdown.'
    },
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-08-24T10:00:00Z'
  },
  {
    id: 'comp_google',
    name: 'Google',
    industry: 'Technology & Cloud',
    website: 'https://www.google.com',
    status: 'Shortlisted',
    prepProgress: 68,
    interviewDate: '2026-09-02',
    role: 'Associate Product Manager (APM) / Strategy & BizOps',
    vision: 'To provide access to the worlds information in one click.',
    mission: 'To organize the worlds information and make it universally accessible and useful.',
    values: ['Focus on the user and all else will follow', 'Fast is better than slow', 'Democracy on the web works', 'Great just isnt good enough'],
    businessModel: 'Ad-supported consumer ecosystem (Search, YouTube), subscription services (Workspace, Gemini Pro), enterprise B2B (Google Cloud).',
    productsServices: 'Google Search, YouTube, Android, Chrome, Google Cloud Platform, Gemini AI Models, Pixel Devices.',
    targetCustomers: 'Global billions of internet consumers, SMBs, Global 2000 enterprises deploying AI workloads.',
    revenueModel: 'Performance advertising auctions, Cloud compute/storage subscription contracts, hardware sales, App Store cuts.',
    keyCompetitors: ['Microsoft', 'Amazon (AWS)', 'Meta', 'Apple', 'OpenAI'],
    marketPosition: 'Dominant search engine and leading hyperscaler investing heavily in full-stack AI research.',
    recentNews: 'Launched Gemini 3 multi-modal platform and expanded enterprise Vertex AI offerings.',
    whyThisCompany: 'Building systems that operate at billions-of-users scale while defining the next era of human-AI collaboration.',
    whyThisRole: 'Product and strategy at Google sits at the apex of technology innovation and commercial execution.',
    attractions: 'Culture of psychological safety, bottom-up innovation, global impact, exceptional engineering caliber.',
    concerns: 'Navigating organizational matrix and complex stakeholder alignment across geographic regions.',
    differentiators: 'Full-stack AI infrastructure (custom TPU chips to foundational models and ubiquitous consumer surfaces).',
    recentDevelopments: 'Consolidating AI research teams under Google DeepMind to accelerate productization cycles.',
    importantMetrics: 'Alphabet 2025 Revenue ~$350B+; Cloud annualized run-rate >$40B; 2+ billion users across 7 core products.',
    myNotes: 'Prepare for Product Design scenarios: prioritize user personas, pain points, 3 creative solutions, trade-offs, and go-to-market metrics.',
    isFavorite: true,
    customFields: {
      cf_company_ceo: 'Sundar Pichai',
      cf_company_rev: '$350B+ USD',
      cf_company_hire: 'Strong product sense combined with commercial acumen and deep user empathy.'
    },
    createdAt: '2026-08-16T11:00:00Z',
    updatedAt: '2026-08-23T14:30:00Z'
  },
  {
    id: 'comp_hul',
    name: 'Hindustan Unilever Limited (HUL)',
    industry: 'Fast Moving Consumer Goods (FMCG)',
    website: 'https://www.hul.co.in',
    status: 'Target',
    prepProgress: 54,
    interviewDate: '2026-09-10',
    role: 'Management Trainee (UFLP - Sales & Marketing)',
    vision: 'To make sustainable living commonplace across every Indian household.',
    mission: 'Add vitality to life. We meet everyday needs for nutrition, hygiene and personal care with brands that help people look good, feel good.',
    values: ['Integrity', 'Responsibility', 'Respect', 'Pioneering'],
    businessModel: 'Direct-to-Kirana distribution, modern trade, quick-commerce fulfillment, and premium brand portfolio curation.',
    productsServices: 'Surf Excel, Dove, Sunsilk, Horlicks, Lifebuoy, Brooke Bond, Kwality Walls, Lakme.',
    targetCustomers: '9 out of 10 Indian households across urban metros, tier-2/3 towns, and rural village general stores.',
    revenueModel: 'High-velocity retail margin arbitrage, brand premium pricing, rural distribution moats.',
    keyCompetitors: ['Procter & Gamble (P&G)', 'ITC Limited', 'Nestle India', 'Marico', 'Dabur'],
    marketPosition: 'Undisputed FMCG market leader in India with unmatched distribution and brand recall.',
    recentNews: 'Accelerating digital B2B Shikhar platform orders connecting over 1.3 million rural kirana merchants directly.',
    whyThisCompany: 'Gold-standard leadership academy for general management in India; peerless commercial grounding.',
    whyThisRole: 'Rural immersion and front-line territory ownership develops instinctive consumer empathy and crisis resilience.',
    attractions: 'Proven CEO factory reputation, brand power, operational rigor in supply chain logistics.',
    concerns: 'Extensive initial field travel and challenging rural territory rotations.',
    differentiators: 'Shikhar digital ordering app, WiMI (Winning in Many Indias) micro-segmentation strategy.',
    recentDevelopments: 'Premiumization of beauty & personal care division and rapid quick-commerce channel expansion.',
    importantMetrics: 'Annual Revenue ~₹60,000+ Crore; 50+ household brands; 9+ million retail touchpoints across India.',
    myNotes: 'Understand FMCG metrics thoroughly: Modern Trade vs General Trade share, Quick Commerce velocity, Market Share (Volume vs Value).',
    isFavorite: false,
    customFields: {
      cf_company_ceo: 'Rohit Jawa',
      cf_company_rev: '₹61,000 Cr',
      cf_company_hire: 'High grit, front-line communication fluency, and data-backed channel strategy thinking.'
    },
    createdAt: '2026-08-17T12:00:00Z',
    updatedAt: '2026-08-22T16:00:00Z'
  },
  {
    id: 'comp_bain',
    name: 'Bain & Company',
    industry: 'Management Consulting & PE Advisory',
    website: 'https://www.bain.com',
    status: 'Shortlisted',
    prepProgress: 72,
    interviewDate: '2026-08-30',
    role: 'Consultant / Senior Associate Consultant',
    vision: 'To achieve extraordinary results, redefine industries, and shape who we are.',
    mission: 'Help our clients create such high levels of value that together we set new standards of excellence in our respective industries.',
    values: ['A Bainie never lets another Bainie fail', 'True North: Uncompromising commitment to what is right', 'Practical, actionable results'],
    businessModel: 'Strategic advisory, private equity commercial due diligence (CDD), digital transformation, customer NPS advisory.',
    productsServices: 'Strategy, Private Equity Due Diligence, M&A, Organization, Agile Innovation, Customer Experience (NPS).',
    targetCustomers: 'Leading global Private Equity funds (managing 75%+ of global buyout equity), Fortune 500 CEOs.',
    revenueModel: 'Premium advisory fees tied to results and equity stakes; high-velocity private equity transaction retainers.',
    keyCompetitors: ['McKinsey & Company', 'Boston Consulting Group (BCG)', 'Kearney'],
    marketPosition: '#1 global advisor to the private equity industry and pioneer of the Net Promoter Score (NPS).',
    recentNews: 'Expanded Global OpenAI partnership to integrate bespoke generative AI solutions directly for private equity portfolios.',
    whyThisCompany: 'Best-in-class collaborative culture ("A Bainie never lets another Bainie fail") and unmatched PE exposure.',
    whyThisRole: 'Fast-paced, high-impact deal due diligence builds sharp commercial instinct in days rather than months.',
    attractions: 'Culture voted #1 Glassdoor Best Place to Work, results-oriented pragmatic focus, fast partner trajectory.',
    concerns: 'Sprint-based PE projects have intense 2-3 week deadlines.',
    differentiators: 'Dominant 3x market share in Private Equity commercial due diligence; Results Delivery framework.',
    recentDevelopments: 'Surging M&A and carve-out advisory practice in healthcare and enterprise SaaS verticals.',
    importantMetrics: '65 offices in 40 countries; advised on more than half of all global private equity deals.',
    myNotes: 'Practice quick sanity checks and mental math. CDD cases require quick market sizing, competitive dynamics, and exit multiples.',
    isFavorite: true,
    customFields: {
      cf_company_ceo: 'Manny Maceda',
      cf_company_rev: '$6B+ USD',
      cf_company_hire: 'Fast commercial synthesis, comfortable with rapid 80/20 decision-making under ambiguity.'
    },
    createdAt: '2026-08-18T10:00:00Z',
    updatedAt: '2026-08-24T08:00:00Z'
  },
  {
    id: 'comp_amazon',
    name: 'Amazon',
    industry: 'E-Commerce, Cloud & Logistics',
    website: 'https://www.amazon.com',
    status: 'Target',
    prepProgress: 60,
    role: 'Senior Product Manager / Operations Pathway Trainee',
    vision: 'To be Earths most customer-centric company and Earths best employer.',
    mission: 'We strive to offer our customers the lowest possible prices, the best available selection, and the utmost convenience.',
    values: ['Customer Obsession', 'Ownership', 'Invent and Simplify', 'Are Right, A Lot', 'Learn and Be Curious', 'Hire and Develop the Best', 'Insist on the Highest Standards', 'Think Big', 'Bias for Action', 'Frugality', 'Earn Trust', 'Dive Deep', 'Have Backbone; Disagree and Commit', 'Deliver Results', 'Strive to be Earths Best Employer', 'Success and Scale Bring Broad Responsibility'],
    businessModel: 'Retail flywheel (Selection, Low Prices, Customer Experience -> Traffic -> Sellers -> Scale -> Lower Cost Structure), AWS Cloud infrastructure, Prime Subscriptions, Ads.',
    productsServices: 'Amazon.com, AWS Cloud, Prime Video, Kindle, Alexa, Fulfillment by Amazon (FBA), Kuiper Satellite.',
    targetCustomers: 'Global retail shoppers, 3rd party merchants, developers, startups, enterprise IT departments.',
    revenueModel: 'Online retail sales, 3P marketplace take-rates, AWS cloud hosting compute/storage, sponsored product advertising.',
    keyCompetitors: ['Walmart', 'Microsoft Azure', 'Alibaba', 'Shein', 'Temu', 'Flipkart'],
    marketPosition: 'Global e-commerce and cloud infrastructure titan with massive logistics automation infrastructure.',
    recentNews: 'Deployed thousands of generative AI robotics picking agents across fulfillment centers to cut order dispatch times by 25%.',
    whyThisCompany: 'Working backwards from the customer is the most disciplined product execution philosophy in modern tech.',
    whyThisRole: 'End-to-end ownership of massive scale systems with explicit data-driven accountability.',
    attractions: 'Culture of writing 6-page narrative memos instead of PowerPoint decks; rapid experimental velocity.',
    concerns: 'High internal competition and uncompromising performance metrics.',
    differentiators: 'Working backwards process (PR/FAQ), two-pizza teams, Day 1 mindset.',
    recentDevelopments: 'Expanding Amazon Q enterprise generative AI assistant and accelerating same-day grocery delivery network.',
    importantMetrics: 'Annual Revenue ~$600B+; 1.5M employees worldwide; AWS operating profit engine driving 60%+ of company operating income.',
    myNotes: 'Map every single interview answer directly to one of the 16 Leadership Principles (LPs). Use STAR format with exact metrics (% lift, $ saved).',
    isFavorite: false,
    customFields: {
      cf_company_ceo: 'Andy Jassy',
      cf_company_rev: '$600B+ USD',
      cf_company_hire: 'Relentless bias for action with proven metric-driven root cause problem solving (Dive Deep).'
    },
    createdAt: '2026-08-19T14:00:00Z',
    updatedAt: '2026-08-23T11:00:00Z'
  }
];

export const initialQuestions: Question[] = [
  {
    id: 'q_hr_1',
    question: 'Tell me about yourself and walk me through your resume.',
    category: 'HR',
    subcategory: 'Introduction',
    difficulty: 'Easy',
    tags: ['Core', 'Opener', 'First Impression', 'Elevator Pitch'],
    status: 'Practiced',
    confidence: 4,
    lastPracticed: '2026-08-23',
    practiceCount: 14,
    timeTakenSeconds: 110,
    keyPoints: [
      'Current MBA student specializing in Strategy & Product',
      'Engineering background with 2.5 years of cross-functional software delivery',
      'Key accomplishment: Led delivery of payment reconciliation engine saving $1.2M annually',
      'Why this transition: Want to bridge technical execution with corporate strategy and commercial P&L ownership',
      'Why here today: Eager to bring structured problem solving and execution energy to this team'
    ],
    myAnswer: `Thank you. I am an MBA candidate with an engineering foundation and 2.5 years of experience leading cross-functional digital initiatives. 

Prior to business school, I worked at a leading fintech provider where I spearheaded the redesign of an enterprise automated reconciliation engine across 6 banking partners. This cut settlement cycle discrepancies by 42% and saved roughly $1.2M annually. 

While I loved solving complex technical puzzles, I realized my greatest passion lay at the intersection of business strategy, commercial viability, and user experience. That motivated me to pursue my MBA, where I have focused on competitive strategy, data analytics, and operational turnaround cases.

Looking forward, I am excited about this role because it offers the exact platform to leverage my analytical rigor and stakeholder alignment skills to drive tangible bottom-line value for your clients.`,
    improvedAnswer: `Structure: Past (Anchor) -> Pivot (Why MBA) -> Present (MBA Highlights) -> Future (Why this specific company & role). Keep strictly under 1 minute 45 seconds. Keep high energy and make eye contact.`,
    interviewerFeedback: `Very crisp delivery. Make sure to end on an enthusiastic note explaining why THIS firm specifically fits your career hypothesis.`,
    whatToImprove: `Ensure vocal variety when mentioning the $1.2M metric so the impact stands out naturally.`,
    myMistake: `Initially spoke too much about undergraduate college projects instead of high-impact corporate achievements.`,
    isFavorite: true,
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-08-23T12:00:00Z'
  },
  {
    id: 'q_hr_2',
    question: 'Why do you want to transition into Management Consulting / Strategy?',
    category: 'HR',
    subcategory: 'Career Motivation',
    difficulty: 'Medium',
    tags: ['Motivation', 'Consulting Fit', 'Career Transition'],
    status: 'Practiced',
    confidence: 4,
    lastPracticed: '2026-08-22',
    practiceCount: 8,
    timeTakenSeconds: 95,
    keyPoints: [
      'Steepest learning curve with high-caliber peer apprenticeship',
      'Breadth of industry exposure before deep specialization',
      'Structured hypothesis-driven problem solving applied to boardroom challenges',
      'Direct focus on shareholder value creation and organizational impact'
    ],
    myAnswer: `There are three core reasons why consulting is the natural next step for me:

First, the Apprenticeship and Peer Group: Consulting brings together intellectually curious, driven teams where feedback is immediate and continuous. That pace of personal development is unmatched.

Second, Breadth and Cross-Pollination of Ideas: Rather than staying in a single silo, consulting exposes you to diverse business models—from FMCG channel distribution to enterprise SaaS pricing. Bringing proven insights from one industry to solve problems in another is deeply energizing to me.

Third, Measurable Strategic Impact: I thrive on breaking down ambiguous, multi-variable challenges into testable hypotheses and working alongside leadership to ensure recommendations are not just theoretical, but operationalized on the ground.`,
    improvedAnswer: `Highlight a concrete instance from your MBA case competition where you loved breaking down an ambiguous problem under time pressure.`,
    interviewerFeedback: `Structured into 3 clear pillars. Avoid generic buzzwords; personalize with an anecdote.`,
    isFavorite: true,
    createdAt: '2026-08-16T11:00:00Z',
    updatedAt: '2026-08-22T14:00:00Z'
  },
  {
    id: 'q_hr_3',
    question: 'Describe a situation where you had to lead a team through significant conflict or disagreement.',
    category: 'Behavioral',
    subcategory: 'Leadership & Conflict',
    difficulty: 'Medium',
    tags: ['STAR', 'Conflict Resolution', 'Leadership', 'Amazon LP'],
    status: 'Needs Practice',
    confidence: 3,
    lastPracticed: '2026-08-20',
    practiceCount: 5,
    timeTakenSeconds: 140,
    keyPoints: [
      'Context: Tight deadline on multi-system integration; engineering wanted a 4-week delay for complete refactor, product wanted to ship immediately',
      'Action: Convened root-cause session; mapped MVP critical path vs non-critical edge cases; agreed on phased deployment with automated rollbacks',
      'Result: Delivered on-schedule with zero P0 incident tickets; team retrospective praised transparent trade-off framework'
    ],
    myAnswer: `During my previous role, we were two weeks away from launch when our lead architect insisted on a 4-week delay to refactor legacy database queries, while our product manager was bound by client contractual penalties to ship immediately.

As the program lead, I knew pushing either side would lead to resentment or system fragility. I scheduled an immediate 90-minute data-backed alignment session. We mapped all 14 proposed architectural changes into a 2x2 Matrix of Customer Risk vs Deployment Complexity.

We discovered that only 3 database queries carried 80% of peak concurrency latency risk. We agreed to hotfix those 3 queries for launch and scheduled the remaining refactor into Sprint 2 with automated circuit breakers.

As a result, we shipped on time, hit our SLA uptime target of 99.98%, and both leads commended the objective risk matrix framework during sprint retrospective.`,
    improvedAnswer: `Emphasize emotional intelligence and active listening during the initial heated moments before jumping into the solution matrix.`,
    whatToImprove: `Ensure the "I" vs "We" distinction is very clear so the interviewer sees your direct leadership intervention.`,
    isFavorite: false,
    createdAt: '2026-08-16T14:00:00Z',
    updatedAt: '2026-08-20T17:00:00Z'
  },
  {
    id: 'q_comp_1',
    question: 'Why McKinsey over BCG or Bain?',
    category: 'Company-Specific',
    subcategory: 'Firm Differentiation',
    companyId: 'comp_mckinsey',
    companyName: 'McKinsey & Company',
    difficulty: 'Hard',
    tags: ['McKinsey', 'Culture', 'Firm Fit'],
    status: 'Practiced',
    confidence: 4,
    lastPracticed: '2026-08-24',
    practiceCount: 6,
    timeTakenSeconds: 90,
    keyPoints: [
      'Scale and global knowledge repository (QuantumBlack AI & McKinsey Academy)',
      'Unrivaled access to C-suite transformations across emerging markets',
      'The "One Firm" global staffing model allowing consultants to tap worldwide experts in hours',
      'Authentic personal interactions with alumni who demonstrated deep commitment to mentoring'
    ],
    myAnswer: `While all MBB firms offer exceptional consulting caliber, three specific factors make McKinsey my absolute top choice:

First, The Scale of Knowledge and Technical Capability: McKinsey's integration of QuantumBlack and specialized practice assets means teams don't start from scratch; they build on proprietary global benchmarks.

Second, The "One Firm" Global Operating Model: In my networking with Senior Partners and Associates like Ananya in the Mumbai office, she shared how she was able to pull in a London EV battery specialist within 12 hours for a client workshop. That boundaryless expertise is unique.

Third, The Obligation to Dissent: I deeply respect a culture where the youngest associate in the room is not only permitted but expected to challenge hypotheses if the data supports it. That intellectual honesty matches my working style perfectly.`,
    improvedAnswer: `Keep mentioning named consultants or recent firm insights to show genuine deep networking.`,
    isFavorite: true,
    createdAt: '2026-08-17T09:00:00Z',
    updatedAt: '2026-08-24T09:00:00Z'
  },
  {
    id: 'q_case_1',
    question: 'A leading European luxury automotive OEM is experiencing a 15% drop in EBIT margin over the past 2 years despite stable vehicle delivery volumes. How would you diagnose the problem?',
    category: 'Case',
    subcategory: 'Profitability Diagnosis',
    difficulty: 'Hard',
    tags: ['Profitability', 'Automotive', 'Margin Squeeze', 'Cost Breakdown'],
    status: 'Needs Practice',
    confidence: 3,
    lastPracticed: '2026-08-21',
    practiceCount: 4,
    timeTakenSeconds: 300,
    keyPoints: [
      'Clarify: Is the drop market-wide or specific to our client? Geography? Vehicle segments (EV vs ICE vs Luxury SUV)?',
      'Decompose Profit = Revenue - Total Costs',
      'Revenue side: Stable volume -> Check Average Selling Price (ASP), product mix shift, discounting / incentives, aftermarket & financing revenue',
      'Cost side: Fixed vs Variable costs. Raw materials (lithium, chips, steel), energy spikes in Europe, labor agreements, warranty claims, software R&D amortization',
      'Synthesize root cause hypotheses and propose structured next steps'
    ],
    myAnswer: `I would structure this problem into 3 diagnostic phases:

1. Clarifying & Macro Context:
- Confirm if competitors are facing similar margin erosion (macro/industry shock) or if it is isolated to our OEM.
- Examine segment mix: Have customers shifted from high-margin luxury sedans to lower-margin hybrid/EV variants?

2. Revenue Decomposition (Price x Volume x Mix):
- Since volume is stable, check Average Selling Price (ASP). Are dealership discounts or financing subventions eating margins?
- Check aftermarket parts, software subscriptions, and extended warranty revenue lines.

3. Cost Structure Breakdown:
- Variable Costs (COGS): Raw material inflation (battery pack minerals, specialized semiconductors), logistics/freight surcharges.
- Fixed / Opex Costs: Factory energy costs post-geopolitical disruptions, union wage escalations, capitalization of EV platform software development.

Hypothesis: Margin compression is driven by adverse product mix shift towards early-generation EVs with high battery input costs and elevated software amortization expenses.`,
    improvedAnswer: `Remember to state clear 80/20 hypotheses early and ask for specific data sheets before drilling into each branch.`,
    whatToImprove: `Don't forget to mention dealership channel incentives and warranty reserve liabilities.`,
    isFavorite: true,
    createdAt: '2026-08-17T15:00:00Z',
    updatedAt: '2026-08-21T18:00:00Z'
  },
  {
    id: 'q_gtm_1',
    question: 'How would you launch a B2B SaaS AI-driven workforce scheduling tool in the Indian Quick-Service Restaurant (QSR) sector?',
    category: 'GTM',
    subcategory: 'Market Entry & Commercialization',
    difficulty: 'Medium',
    tags: ['GTM', 'B2B SaaS', 'QSR', 'India Market'],
    status: 'Practiced',
    confidence: 4,
    lastPracticed: '2026-08-23',
    practiceCount: 7,
    timeTakenSeconds: 240,
    keyPoints: [
      'Customer Segmentation: Tier-1 Organized Chains (Jubilant, Devyani, McDonald\'s) vs Emerging Regional 10-50 outlet chains vs Cloud Kitchen aggregators',
      'Value Proposition: Reduce attrition costs, dynamic shift scheduling based on footfall/swiggy delivery spikes, labor compliance',
      'Pricing Model: Per-outlet per-month subscription vs % of labor cost savings shared',
      'Go-To-Market Channels: Direct enterprise sales with pilot proof-of-concept (POC), POS integration partners (Petpooja, Posist), franchise master distributors',
      'Unit Economics & Land-and-Expand motion'
    ],
    myAnswer: `I will outline a 4-pillar Go-To-Market framework:

1. Target ICP (Ideal Customer Profile) & Segmentation:
- Beachhead: Mid-sized organized chains (15-80 outlets, e.g. Chai Point, regional biryani brands) where store managers struggle with manual excel rosters and 40%+ quarterly staff churn.

2. Compelling Value Proposition & ROI:
- Deliver 8-12% labor cost optimization by forecasting shift demand using historical weather, weekend footfall, and Zomato/Swiggy order heatmaps.
- Cut manager roster creation time from 6 hours/week to 15 minutes.

3. Channel & Distribution Strategy:
- Channel Ecosystem: Partner with leading restaurant POS systems (Petpooja, UrbanPiper, Posist) for 1-click app marketplace install.
- Direct Sales: 3-month paid pilot for 10 marquee brand stores with guaranteed SLA savings.

4. Pricing & Land-and-Expand:
- ₹1,999/month per store base tier. Upsell payroll integration and facial recognition biometric shift check-in module.`,
    improvedAnswer: `Include explicit metrics for Customer Acquisition Cost (CAC) and Payback Period (target < 6 months).`,
    isFavorite: true,
    createdAt: '2026-08-18T16:00:00Z',
    updatedAt: '2026-08-23T19:00:00Z'
  },
  {
    id: 'q_domain_1',
    question: 'What is the difference between Customer Acquisition Cost (CAC), Lifetime Value (LTV), and LTV/CAC ratio, and what constitutes a healthy benchmark across B2B vs B2C?',
    category: 'Domain',
    subcategory: 'Marketing & Business Metrics',
    difficulty: 'Easy',
    tags: ['Unit Economics', 'Metrics', 'Finance', 'Product'],
    status: 'Mastered',
    confidence: 5,
    lastPracticed: '2026-08-24',
    practiceCount: 10,
    timeTakenSeconds: 75,
    keyPoints: [
      'CAC = Total Sales & Marketing Spend / Number of New Customers Acquired',
      'LTV = Average Revenue Per Account (ARPA) x Gross Margin % / Churn Rate',
      'LTV/CAC benchmark: 3x+ is healthy, >5x might indicate under-investment in growth, <1x is unsustainable cash burn',
      'Payback Period = CAC / (Monthly ARPA x Gross Margin %); healthy target is 12 months for B2B SaaS'
    ],
    myAnswer: `Customer Acquisition Cost (CAC) captures all sales and marketing costs required to acquire a single paying customer. Lifetime Value (LTV) estimates the total gross profit contribution expected from that customer relationship over their active tenure.

The LTV/CAC ratio is the gold standard for unit economic sustainability:
- Benchmark: 3x to 4x is considered healthy.
- If LTV/CAC < 1x: The business is losing money on every acquired user (unsustainable unit economics).
- If LTV/CAC > 5x: The business is likely under-investing in marketing and leaving market share on the table.

Additionally, CAC Payback Period is crucial for cash flow: healthy B2B SaaS targets payback in 12-18 months, whereas high-velocity B2C e-commerce demands payback on first purchase or within 90 days.`,
    isFavorite: false,
    createdAt: '2026-08-19T10:00:00Z',
    updatedAt: '2026-08-24T11:00:00Z'
  },
  {
    id: 'q_resume_1',
    question: 'Explain the technical and commercial impact of your project mentioned on line 3 of your resume.',
    category: 'Resume',
    subcategory: 'Work Experience Drill-Down',
    difficulty: 'Medium',
    tags: ['Resume', 'STAR', 'Deep-Dive'],
    status: 'Practiced',
    confidence: 4,
    lastPracticed: '2026-08-22',
    practiceCount: 6,
    timeTakenSeconds: 120,
    keyPoints: [
      'Identify project clearly',
      'Explain business problem in plain non-technical language',
      'Detail personal contribution and team leadership',
      'Quantify bottom-line business outcome and long-term maintainability'
    ],
    myAnswer: `On line 3, I highlighted the Automated Ledger Reconciliation Engine I architected for our enterprise payments suite.

The Business Challenge: Our platform processed over 4 million daily transactions. Discrepancies between our internal ledgers and 6 partner bank settlement files required a 12-person operations team to manually cross-reference Excel sheets every morning, causing 48-hour dispute resolution delays and vendor penalties.

My Intervention: I designed an asynchronous streaming reconciliation pipeline using idempotent hash-matching algorithms. I also led a team of 4 engineers, aligning with bank compliance teams on standardized webhook protocols.

Impact: We eliminated 96% of manual reconciliation effort, cut dispute settlement time from 48 hours to under 4 minutes, and saved $1.2M in annual operational overhead and SLA penalties.`,
    isFavorite: false,
    createdAt: '2026-08-19T14:00:00Z',
    updatedAt: '2026-08-22T15:00:00Z'
  }
];

export const initialGuesstimates: Guesstimate[] = [
  {
    id: 'guesstimate_1',
    question: 'Estimate the number of cups of coffee consumed in Mumbai per day.',
    category: 'Consumption / Market Demand',
    difficulty: 'Medium',
    industry: 'Food & Beverage / Retail',
    frameworkId: 'fw_pop_based',
    frameworkName: 'Population Based (Top-Down)',
    variables: [
      { id: 'v1', name: 'Population of Mumbai', value: 20000000, unit: 'people', notes: 'Greater Mumbai metropolitan area' },
      { id: 'v2', name: 'Coffee Drinking Age (15-65)', value: 0.70, unit: 'ratio', notes: '70% in relevant age cohort' },
      { id: 'v3', name: 'Coffee Drinkers Share', value: 0.35, unit: 'ratio', notes: 'Tea dominates in Mumbai, coffee is ~35%' },
      { id: 'v4', name: 'Average Cups per Day per Consumer', value: 1.4, unit: 'cups/day', notes: 'Light drinkers (1 cup) vs heavy office workers (2-3 cups)' }
    ],
    formula: 'v1 * v2 * v3 * v4',
    calculatedResult: 6860000,
    resultUnit: 'cups per day',
    approachNotes: `Top-Down Demographic Breakdown:
1. Start with total Mumbai population (20 Million).
2. Filter by Age Demographics: Exclude kids <15 and elderly >65 who rarely drink coffee (70% eligible = 14M).
3. Split by Beverage Preference: Mumbai is traditionally tea-heavy (65% tea, 35% coffee drinkers = 4.9M coffee consumers).
4. Segment by Intensity:
   - Daily Regulars (60%): 1.5 cups/day
   - Occasional Drinkers (40%): 0.5 cups/day
   - Weighted average = 1.4 cups/day
5. Total = 20M x 0.70 x 0.35 x 1.4 = ~6.86 Million cups/day (~7 Million cups).`,
    keyAssumptions: [
      'Mumbai metro population taken as 20M',
      'Tea vs Coffee ratio: 65% tea, 35% coffee in western India',
      'Includes home-brewed filter coffee, instant coffee, corporate pantries, and street stalls / cafes'
    ],
    mistakesIdentified: 'Do not confuse total cups consumed with only retail cafe sales (Starbucks/CCD). Over 85% of consumption occurs at home or office pantries.',
    confidence: 4,
    timeTakenSeconds: 115,
    practiceCount: 5,
    status: 'Solved',
    lastPracticed: '2026-08-23',
    isFavorite: true,
    createdAt: '2026-08-16T12:00:00Z',
    updatedAt: '2026-08-23T16:00:00Z'
  },
  {
    id: 'guesstimate_2',
    question: 'Estimate the daily revenue of a bustling Starbucks store located in Bandra West, Mumbai.',
    category: 'Unit Economics / Store Capacity',
    difficulty: 'Medium',
    industry: 'Retail & Hospitality',
    frameworkId: 'fw_capacity',
    frameworkName: 'Capacity / Throughput Based (Bottom-Up)',
    variables: [
      { id: 'v1', name: 'Operating Hours per Day', value: 16, unit: 'hours', notes: '7 AM to 11 PM' },
      { id: 'v2', name: 'Peak Hours per Day', value: 6, unit: 'hours', notes: 'Morning 8-10 AM, Evening 5-9 PM' },
      { id: 'v3', name: 'Peak Transactions per Hour', value: 80, unit: 'orders/hr', notes: '2 billing counters + mobile app orders' },
      { id: 'v4', name: 'Non-Peak Transactions per Hour', value: 30, unit: 'orders/hr', notes: '10 non-peak hours' },
      { id: 'v5', name: 'Average Order Value (AOV)', value: 450, unit: 'INR (₹)', notes: 'Beverage (~₹350) + Food attachment (~₹100)' }
    ],
    formula: '((v2 * v3) + ((v1 - v2) * v4)) * v5',
    calculatedResult: 351000,
    resultUnit: '₹ INR / day',
    approachNotes: `Throughput & Billing Capacity Model:
1. Store Open 16 Hours (7:00 AM - 11:00 PM).
2. Segment Time into Peak vs Non-Peak:
   - Peak (6 hours): 80 transactions/hour = 480 orders.
   - Non-Peak (10 hours): 30 transactions/hour = 300 orders.
   - Total Orders/Day = 780 transactions.
3. Calculate Average Basket Size (AOV):
   - 70% buy only beverage @ ₹350
   - 30% buy beverage + sandwich/croissant @ ₹680
   - Blended AOV = ₹450
4. Daily Revenue = 780 orders x ₹450 = ₹351,000 (~₹3.5 Lakhs/day).
5. Monthly Run-Rate = ₹3.5L x 30 = ~₹1.05 Crore/month.`,
    keyAssumptions: [
      'Bandra location has high footfall and affluent demographic',
      '2 active POS billing machines plus delivery channel (Swiggy/Zomato dispatch counter)',
      'Food attachment rate is ~30%'
    ],
    mistakesIdentified: 'Initially forgot online food delivery orders which account for 20%+ of suburban outlet volume.',
    confidence: 5,
    timeTakenSeconds: 100,
    practiceCount: 8,
    status: 'Mastered',
    lastPracticed: '2026-08-24',
    isFavorite: true,
    createdAt: '2026-08-17T14:00:00Z',
    updatedAt: '2026-08-24T10:00:00Z'
  },
  {
    id: 'guesstimate_3',
    question: 'Estimate the annual market size (in USD) for smartphone screen repairs in India.',
    category: 'Market Sizing',
    difficulty: 'Hard',
    industry: 'Consumer Electronics & Services',
    frameworkId: 'fw_installed_base',
    frameworkName: 'Installed Base & Replacement Rate',
    variables: [
      { id: 'v1', name: 'Smartphone Installed Base in India', value: 650000000, unit: 'smartphones', notes: 'Active smartphone users' },
      { id: 'v2', name: 'Annual Screen Damage Rate', value: 0.12, unit: 'ratio', notes: '12% of phones suffer screen cracking per year' },
      { id: 'v3', name: 'Repaired via Authorized Center %', value: 0.25, unit: 'ratio', notes: '25% premium authorized center' },
      { id: 'v4', name: 'Authorized Center Avg Cost', value: 70, unit: 'USD ($)', notes: '₹5,800 INR' },
      { id: 'v5', name: 'Local Third-Party Center Avg Cost', value: 25, unit: 'USD ($)', notes: '₹2,000 INR' }
    ],
    formula: '(v1 * v2) * ((v3 * v4) + ((1 - v3) * v5))',
    calculatedResult: 2827500000,
    resultUnit: 'USD ($)',
    approachNotes: `Installed Base & Replacement Model:
1. Total Active Smartphones in India = ~650 Million.
2. Annual Screen Damage Incident Rate: ~12% suffer broken screens annually = 78 Million incidents.
3. Repair Channel Segmentation:
   - Authorized Centers (25% = 19.5M units) @ $70 = $1.365 Billion.
   - Local/Unorganized Shops (75% = 58.5M units) @ $25 = $1.462 Billion.
4. Total Annual Market = $1.365B + $1.462B = ~$2.83 Billion USD (~₹23,500 Crore).`,
    keyAssumptions: [
      '75% of Indian consumers prefer local third-party repair due to price sensitivity',
      'Average lifespan of smartphone in India is 2.8 years'
    ],
    confidence: 4,
    timeTakenSeconds: 130,
    practiceCount: 3,
    status: 'Solved',
    lastPracticed: '2026-08-22',
    isFavorite: false,
    createdAt: '2026-08-18T16:00:00Z',
    updatedAt: '2026-08-22T17:00:00Z'
  },
  {
    id: 'guesstimate_4',
    question: 'Estimate the number of commercial passenger airplanes in the air over Indian airspace at 3:00 PM on a weekday.',
    category: 'Real-time Capacity / Fleet',
    difficulty: 'Hard',
    industry: 'Aviation & Transportation',
    frameworkId: 'fw_supply_demand',
    frameworkName: 'Supply & Fleet Utilization',
    variables: [
      { id: 'v1', name: 'Total Commercial Fleet in India', value: 750, unit: 'planes', notes: 'IndiGo, Air India, SpiceJet, Akasa' },
      { id: 'v2', name: 'Active In-Service Fleet %', value: 0.85, unit: 'ratio', notes: '85% active (15% maintenance/grounded)' },
      { id: 'v3', name: 'Time in Air vs On Ground Turnaround %', value: 0.60, unit: 'ratio', notes: 'Average 12-14 hours airborne daily' },
      { id: 'v4', name: 'International Transit Flights Overflying India', value: 70, unit: 'planes', notes: 'Gulf to SE Asia corridor at 3 PM' }
    ],
    formula: '(v1 * v2 * v3) + v4',
    calculatedResult: 452.5,
    resultUnit: 'aircraft in air',
    approachNotes: `Supply-Side Fleet Method:
1. Indian Commercial Fleet Size: ~750 aircraft (IndiGo has ~360, Air India Group ~240, Akasa/SpiceJet ~150).
2. Serviceability Rate: 85% operating = ~638 active aircraft.
3. Daily Utilization & Hourly Probability:
   - Aircraft fly ~13 hours/day (high turnaround efficiency).
   - At 3:00 PM (peak afternoon window), ~60% of active planes are cruising airborne = ~382 planes.
4. Add International Overflights: India sits directly on Europe/Middle East to Southeast Asia / Australia flight corridors (~70 overflights at 3 PM).
5. Total = 382 + 70 = ~450 aircraft in Indian airspace.`,
    keyAssumptions: [
      'IndiGo high turnaround time (30 min ground turn)',
      'Overflight corridor traffic is significant over Gujarat/Maharashtra to Bay of Bengal'
    ],
    confidence: 4,
    timeTakenSeconds: 125,
    practiceCount: 4,
    status: 'Solved',
    lastPracticed: '2026-08-20',
    isFavorite: false,
    createdAt: '2026-08-19T10:00:00Z',
    updatedAt: '2026-08-20T11:00:00Z'
  },
  {
    id: 'guesstimate_5',
    question: 'Estimate the number of electric two-wheelers (EV scooters) sold in Delhi NCR per month.',
    category: 'Market Penetration / Growth',
    difficulty: 'Medium',
    industry: 'Automotive & CleanTech',
    frameworkId: 'fw_pop_based',
    frameworkName: 'Population & Replacement Rate',
    variables: [
      { id: 'v1', name: 'Total Delhi NCR Households', value: 7000000, unit: 'households', notes: '~30M population / 4.2' },
      { id: 'v2', name: 'Households Owning a 2-Wheeler', value: 0.60, unit: 'ratio', notes: '4.2 Million 2-wheeler owning homes' },
      { id: 'v3', name: 'Annual 2-Wheeler Replacement/New Buy %', value: 0.10, unit: 'ratio', notes: '10-year vehicle replacement cycle' },
      { id: 'v4', name: 'EV Penetration in New Purchases', value: 0.18, unit: 'ratio', notes: 'Delhi EV policy subsidy drives 18% adoption' }
    ],
    formula: '((v1 * v2 * v3) * v4) / 12',
    calculatedResult: 6300,
    resultUnit: 'EV scooters / month',
    approachNotes: `Household & Adoption Rate Sizing:
1. Delhi NCR has ~7M households.
2. 60% own at least one two-wheeler = 4.2M installed base.
3. Annual replacement/new additions (10% renewal rate) = 420,000 two-wheelers bought annually in NCR.
4. EV Penetration Rate (driven by Delhi EV subsidies, fuel prices, and Ola/Ather/TVS presence) = 18%.
5. Annual EV Scooters = 420,000 x 18% = 75,600 units.
6. Monthly Sales = 75,600 / 12 = 6,300 EV scooters/month.`,
    keyAssumptions: [
      'Delhi has above-national-average EV adoption due to state subsidies and road tax exemptions',
      'Average ownership cycle of a commuter scooter is 8-10 years'
    ],
    confidence: 4,
    timeTakenSeconds: 110,
    practiceCount: 5,
    status: 'Solved',
    lastPracticed: '2026-08-21',
    isFavorite: true,
    createdAt: '2026-08-19T14:00:00Z',
    updatedAt: '2026-08-21T15:00:00Z'
  }
];

export const initialFrameworks: EstimationFramework[] = [
  {
    id: 'fw_pop_based',
    name: 'Top-Down Population Based',
    description: 'Deconstruct total population into demographic slices (Age, Income, Urban/Rural, Gender), then apply penetration rate and consumption frequency.',
    category: 'Demographic',
    steps: [
      'Define total relevant geography population',
      'Filter for eligible demographic / age cohort',
      'Segment by socio-economic class (SEC A/B/C) or urban vs rural split',
      'Apply target category penetration percentage',
      'Multiply by annual/daily consumption frequency per user'
    ],
    exampleUseCases: ['Cups of coffee in a city', 'Bottles of shampoo sold in India', 'Annual movie tickets booked'],
    formulaTemplate: 'Population × Eligible Age % × Category Penetration % × Frequency per User',
    isFavorite: true,
    createdAt: '2026-08-15T00:00:00Z',
    updatedAt: '2026-08-15T00:00:00Z'
  },
  {
    id: 'fw_household_based',
    name: 'Household Sizing Framework',
    description: 'Convert population to households (Population / Avg Family Size), segment by income tiers, and calculate product density per household.',
    category: 'Demographic',
    steps: [
      'Calculate Total Households = Population / Average Household Size (4-5 in India, 2.5 in US)',
      'Segment into Income Quintiles (Affluent, Middle Class, Aspirers, BPL)',
      'Determine household penetration rate per tier',
      'Apply product replacement cycle (e.g. Refrigerator replaced every 8 years = 1/8 replacement rate/year)',
      'Add annual new household formation growth'
    ],
    exampleUseCases: ['Washing machines sold per year', 'Broadband Wi-Fi connections', 'Smart TVs in a country'],
    formulaTemplate: '(Population / Avg_Family_Size) × Tier_Penetration % × (1 / Replacement_Lifespan_Years)',
    isFavorite: true,
    createdAt: '2026-08-15T00:00:00Z',
    updatedAt: '2026-08-15T00:00:00Z'
  },
  {
    id: 'fw_capacity',
    name: 'Capacity & Bottleneck Throughput (Bottom-Up)',
    description: 'Analyze physical resource limits (counters, tables, servers, seats, runways) multiplied by operating hours and peak vs non-peak utilization.',
    category: 'Supply-Side',
    steps: [
      'Identify critical physical bottleneck constraint (number of tables, POS checkout counters, runways)',
      'Determine operating hours per day (Peak vs Off-Peak hours)',
      'Calculate turnaround time / service time per customer',
      'Calculate max theoretical capacity vs realistic utilization % during peak vs off-peak',
      'Multiply total transactions by Average Order Value (AOV)'
    ],
    exampleUseCases: ['Daily revenue of a restaurant/cafe', 'Toll booth collection', 'Airport runway capacity'],
    formulaTemplate: '((Peak_Hrs × Peak_Throughput) + (OffPeak_Hrs × OffPeak_Throughput)) × AOV',
    isFavorite: true,
    createdAt: '2026-08-15T00:00:00Z',
    updatedAt: '2026-08-15T00:00:00Z'
  },
  {
    id: 'fw_installed_base',
    name: 'Installed Base & Replacement Rate',
    description: 'Estimate the total active existing stock of a device/asset, apply annual churn/damage/upgrade rates, and calculate aftermarket value.',
    category: 'Hardware / Services',
    steps: [
      'Calculate total current installed active units',
      'Apply annual incident / defect / upgrade rate percentage',
      'Split by repair/purchase channel (Authorized vs Third-party)',
      'Multiply by unit pricing per channel'
    ],
    exampleUseCases: ['Smartphone screen repairs', 'Automobile tire replacements', 'Software maintenance contracts'],
    formulaTemplate: 'Installed_Base × Annual_Incident_Rate % × Unit_Price',
    isFavorite: false,
    createdAt: '2026-08-15T00:00:00Z',
    updatedAt: '2026-08-15T00:00:00Z'
  },
  {
    id: 'fw_fermi',
    name: 'Fermi Approximation',
    description: 'Order-of-magnitude estimation using dimensional analysis and bounds testing when precise statistical data is unavailable.',
    category: 'General',
    steps: [
      'Deconstruct the problem into independent scale factors',
      'Estimate geometric means / order of magnitude bounds for each factor',
      'Check units dimensionally at every stage of the equation',
      'Perform quick sanity check against known global anchors'
    ],
    exampleUseCases: ['Weight of all humans on Earth', 'Piano tuners in Chicago', 'Tennis balls fitting in a Boeing 777'],
    isFavorite: false,
    createdAt: '2026-08-15T00:00:00Z',
    updatedAt: '2026-08-15T00:00:00Z'
  }
];

export const initialGDTopics: GDTopic[] = [
  {
    id: 'gd_1',
    topic: 'Will Generative AI Lead to Mass White-Collar Disemployment or Net Economic Expansion?',
    category: 'Technology & AI',
    dateAdded: '2026-08-20',
    source: 'World Economic Forum Future of Jobs & McKinsey Global Institute',
    sourceUrl: 'https://www.weforum.org',
    summary: 'A critical debate on whether frontier AI models will automate high-skilled knowledge tasks faster than new economic roles are created, or whether it mirrors historical technological revolutions with aggregate GDP growth.',
    myPosition: 'Neutral / Balanced',
    argumentsFor: [
      'Rapid productivity augmentation: Goldman Sachs estimates generative AI could raise global GDP by 7% over a 10-year period by accelerating coding, clinical analysis, and content workflows.',
      'Creation of new job categories: Prompt engineers, AI safety auditors, workflow orchestration architects, and synthetic data curators.',
      'Jevons Paradox: As the cost of software development and creative iteration drops, total enterprise demand for digital products expands exponentially.'
    ],
    argumentsAgainst: [
      'Transition velocity mismatch: High-skill coding and legal contract review tasks can be automated in months, while retraining displaced workers takes years.',
      'Wage suppression & Junior role compression: Elimination of entry-level apprenticeship jobs (junior analysts, tier-1 software engineers) stunts career pipelines.',
      'Capital vs Labor divergence: Corporate productivity gains disproportionately accrue to model providers and capital owners rather than workers.'
    ],
    examples: [
      'Klarna AI assistant handling the workload equivalent to 700 full-time customer service agents with higher customer satisfaction ratings.',
      'Historical parallel: ATM machines in the 1980s did not eliminate bank tellers; they lowered branch operating costs, leading to more branch openings and tellers shifting to relationship advisory.'
    ],
    dataPoints: [
      'McKinsey estimates generative AI could add $2.6T to $4.4T annually across 63 analyzed business use cases.',
      '60% of jobs in advanced economies have exposure to AI according to the IMF (2024).'
    ],
    openingStatement: 'Fellow participants, the AI revolution represents the first time automation is climbing the cognitive ladder into high-order knowledge work. The central question before us today is not whether AI replaces tasks, but how society navigates the velocity gap between task automation and human capability redeployment.',
    counterpoints: [
      'If someone argues AI only destroys jobs: Point out the historical Jevons Paradox and the massive surge in new software development demand.',
      'If someone claims there is zero risk: Highlight the severe friction for mid-career knowledge workers who cannot transition overnight.'
    ],
    conclusion: 'To capture the prosperity of AI without destabilizing the workforce, governments and corporations must co-invest in lifelong reskilling credits, dynamic safety nets, and ethical deployment guardrails.',
    potentialQuestions: [
      'How should MBA graduates position their skillset in an AI-assisted management landscape?',
      'Should governments levy an automation tax on frontier AI deployments?'
    ],
    status: 'Prepared',
    confidence: 5,
    isFavorite: true,
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-24T08:00:00Z'
  },
  {
    id: 'gd_2',
    topic: 'Quick Commerce vs Kirana Stores: Is Hyperlocal 10-Minute Delivery Sustainable and Inclusive for India?',
    category: 'Business & Economy',
    dateAdded: '2026-08-21',
    source: 'Redseer Strategy Consultants & Bain Retail Report',
    sourceUrl: 'https://redseer.com',
    summary: 'Debating the meteoric rise of quick commerce (Blinkit, Zepto, Instamart) vs traditional general trade kiranas, examining unit economics, dark store density, and employment quality.',
    myPosition: 'Neutral / Balanced',
    argumentsFor: [
      'Consumer surplus & convenience: 10-minute delivery saves urban dual-income families hours weekly for high-value work.',
      'Formalization & supply chain efficiency: Direct farmer-to-dark-store sourcing reduces post-harvest perishables wastage from 25% down to under 5%.',
      'Dark store density driving profitability: Top dark stores in high-density metro pin codes now achieve positive contribution margins (CM3) of 4-6%.'
    ],
    argumentsAgainst: [
      'Threat to unorganized retail livelihood: 13 million small kirana owners who lack venture capital subsidies face margin erosion on high-velocity FMCG items.',
      'Gig worker precarity: Delivery partners bear physical safety risks in high-traffic corridors under strict algorithmic speed pressures.',
      'High real-estate & logistics capex: Unsustainable cash burn in Tier-2/3 cities where basket sizes remain below break-even thresholds.'
    ],
    examples: [
      'Blinkit achieving positive adjusted EBITDA in core NCR dark store clusters.',
      'HUL reporting quick commerce channel growing at 50%+ YoY while traditional trade grew at mid-single digits.'
    ],
    dataPoints: [
      'Quick commerce Gross Merchandise Value (GMV) in India crossed $6 Billion in 2025, up from $0.5B in 2021.',
      'General trade still accounts for ~80% of total grocery retail volume across India.'
    ],
    openingStatement: 'Quick commerce has transformed consumer expectations from next-day to instant gratification. Today let us examine this through three lenses: unit economic sustainability, the future of India\'s 13 million kirana merchants, and delivery partner welfare.',
    conclusion: 'The winning future is hybrid: kirana stores will survive by leveraging digital credit and hyper-local B2B tech platforms like Shikhar, while quick commerce will capture high-margin impulse and emergency baskets in urban clusters.',
    status: 'Prepared',
    confidence: 4,
    isFavorite: true,
    createdAt: '2026-08-21T11:00:00Z',
    updatedAt: '2026-08-23T15:00:00Z'
  },
  {
    id: 'gd_3',
    topic: 'Manufacturing vs Services: Can India Achieve High-Income Status Without a China-Scale Factory Revolution?',
    category: 'Economy & Policy',
    dateAdded: '2026-08-22',
    source: 'Reserve Bank of India & Raghuram Rajan Policy Insights',
    summary: 'Evaluating whether India can bypass traditional low-end manufacturing by championing high-value services, Global Capability Centers (GCCs), and design-led manufacturing.',
    myPosition: 'For',
    argumentsFor: [
      'Services export powerhouse: India\'s services exports ($340B+) and 1,600+ Global Capability Centers (GCCs) employ 1.9M high-earning professionals with immense domestic multiplier effects.',
      'Global supply chain de-risking: China+1 strategy and PLI (Production Linked Incentive) schemes in electronics assembly (Apple iPhone production in India) prove high-tech manufacturing viability.'
    ],
    argumentsAgainst: [
      'Employment absorption capacity: Services and IT cannot absorb 10-12 million youth entering the labor force annually, especially semi-skilled rural migrants.',
      'Manufacturing share of GDP stagnating: India\'s manufacturing share remains stuck around 15-16% of GDP vs China\'s 28%.'
    ],
    examples: [
      'Apple now manufacturing 1 in 7 iPhones globally in India via Foxconn and Tata Electronics.',
      'GCCs evolving from back-office cost centers into core R&D, product design, and AI centers of excellence.'
    ],
    dataPoints: [
      'India needs ~8% sustained real GDP growth for 20 years to hit $12,000+ per capita high-income threshold by 2047.',
      'India\'s services exports grew at 14% CAGR over the last 5 years.'
    ],
    openingStatement: 'To achieve developed nation status by 2047, India cannot afford an either-or dichotomy. While services provide our foreign exchange engine, labor-intensive manufacturing is indispensable for broad-based demographic inclusion.',
    conclusion: 'India must champion high-tech manufacturing, agro-processing, and renewable energy hardware alongside its world-class IT and GCC services exports.',
    status: 'Prepared',
    confidence: 4,
    isFavorite: false,
    createdAt: '2026-08-22T10:00:00Z',
    updatedAt: '2026-08-24T09:00:00Z'
  },
  {
    id: 'gd_4',
    topic: 'Should ESG (Environmental, Social, Governance) Metrics Be Legally Mandated for Corporate Executive Compensation?',
    category: 'Corporate Governance',
    dateAdded: '2026-08-22',
    source: 'Harvard Business Review & SEBI BRSR Guidelines',
    summary: 'Assessing if linking executive bonuses to ESG targets prevents greenwashing or introduces perverse incentives and subjective performance metrics.',
    myPosition: 'Neutral / Balanced',
    argumentsFor: [
      'Aligns managerial incentives with long-term climate risk and social equity rather than quarterly EPS manipulation.',
      'Mitigates existential systemic risks (carbon border tariffs, water scarcity, employee safety).'
    ],
    argumentsAgainst: [
      'Difficulty of objective measurement leading to rampant greenwashing and self-selected baseline gaming.',
      'Distracts from core fiduciary duty of capital efficiency and shareholder return.'
    ],
    examples: [
      'European energy majors linking 20% of executive bonuses to Scope 1 & 2 carbon reduction milestones.',
      'SEBI BRSR (Business Responsibility and Sustainability Reporting) mandate for top 1,000 listed Indian companies.'
    ],
    dataPoints: [
      'Over 75% of S&P 500 companies now include at least one ESG metric in executive incentive plans.'
    ],
    status: 'In Progress',
    confidence: 3,
    isFavorite: false,
    createdAt: '2026-08-22T14:00:00Z',
    updatedAt: '2026-08-23T11:00:00Z'
  },
  {
    id: 'gd_5',
    topic: 'Central Bank Digital Currencies (CBDC / e-Rupee) vs Decentralized Crypto: The Future of Sovereign Monetary Power',
    category: 'Finance & Geopolitics',
    dateAdded: '2026-08-23',
    source: 'Bank for International Settlements (BIS) & RBI Digital Rupee Pilot',
    summary: 'Evaluating the geopolitical and financial implications of sovereign programmable CBDCs compared to permissionless crypto assets and stablecoins.',
    myPosition: 'For',
    argumentsFor: [
      'Reduces physical cash printing and distribution logistics cost (RBI spends ₹5,000+ Cr annually on cash printing).',
      'Programmable direct benefit transfers (targeted subsidies for fertilizer/education that cannot be diverted).',
      'Cross-border bilateral settlement without reliance on SWIFT or USD clearing rails.'
    ],
    argumentsAgainst: [
      'Surveillance concerns and loss of financial transaction privacy compared to physical cash.',
      'Disintermediation of commercial banking deposits during panic runs.'
    ],
    examples: [
      'RBI pilot integrating e-Rupee with existing UPI QR codes across 5M+ merchants.'
    ],
    dataPoints: [
      'Over 130 countries representing 98% of global GDP are exploring CBDCs (Atlantic Council).'
    ],
    status: 'To Read',
    confidence: 3,
    isFavorite: false,
    createdAt: '2026-08-23T09:00:00Z',
    updatedAt: '2026-08-23T09:00:00Z'
  }
];

export const initialNews: NewsItem[] = [
  {
    id: 'news_1',
    headline: 'India\'s GCC (Global Capability Center) Sector Market Size Projected to Reach $100 Billion by 2030',
    summary: 'A joint Nasscom-Zinnov report highlights that India is now home to over 1,600 GCCs employing nearly 1.9 million professionals, with multinational firms shifting core AI and product innovation to Indian centers.',
    sourceLink: 'https://nasscom.in',
    sourceName: 'Economic Times / Nasscom',
    date: '2026-08-23',
    category: 'Technology & Economy',
    keyTakeaways: [
      'GCCs are no longer low-cost BPO centers; they are strategic innovation hubs leading enterprise software and AI.',
      'Average compensation in GCCs is 30-40% higher than traditional IT service firms, attracting premium talent.',
      'Real estate absorption in Tier-1 cities is heavily anchored by GCC campus expansions.'
    ],
    whyItMatters: 'Demonstrates the structural upward migration of Indian white-collar services into high-margin intellectual property creation.',
    gdRelevance: 'Direct supporting evidence for India\'s services-led economic growth model and high-skill job generation.',
    potentialInterviewQuestion: 'How should IT service companies reinvent their business models as global clients expand their own captive GCCs?',
    isFavorite: true,
    createdAt: '2026-08-23T08:00:00Z',
    updatedAt: '2026-08-23T08:00:00Z'
  },
  {
    id: 'news_2',
    headline: 'RBI Maintains Repo Rate as Core Inflation Moderates, Emphasizes Food Price Volatility Surveillance',
    summary: 'The Monetary Policy Committee voted to keep the policy repo rate steady, balancing growth resilience with unpredictable vegetable and climate-linked food price spikes.',
    sourceLink: 'https://rbi.org.in',
    sourceName: 'RBI Bulletin',
    date: '2026-08-22',
    category: 'Finance & Macroeconomics',
    keyTakeaways: [
      'GDP growth forecast retained at 7.2% for the fiscal year.',
      'Core inflation (excluding food & fuel) remains anchored below 4%, but monsoon variability creates food inflation volatility.',
      'RBI prioritizes liquidity management to support credit growth while preserving financial stability.'
    ],
    whyItMatters: 'Interest rate trajectory directly impacts corporate capex, housing loan demand, and valuation multiples for equity markets.',
    gdRelevance: 'Crucial for monetary policy discussions and debates on central bank inflation targeting vs growth mandates.',
    potentialInterviewQuestion: 'How does food inflation affect FMCG rural volume growth versus urban consumption patterns?',
    isFavorite: false,
    createdAt: '2026-08-22T09:00:00Z',
    updatedAt: '2026-08-22T09:00:00Z'
  },
  {
    id: 'news_3',
    headline: 'Semiconductor Fab Ecosystem in Gujarat and Assam Breaks Ground with $18B Initial Capital Outlay',
    summary: 'Tata Electronics and partners have commenced construction on India\'s first commercial 28nm semiconductor wafer fabrication facility in Dholera, Gujarat.',
    sourceLink: 'https://pib.gov.in',
    sourceName: 'Ministry of Electronics and IT',
    date: '2026-08-21',
    category: 'Manufacturing & Geopolitics',
    keyTakeaways: [
      'Strategic push to reduce India\'s $25B+ annual electronic chip import dependence.',
      'Targeting automotive, power electronics, and IoT chipsets initially.',
      'Requires ultra-pure water, uninterrupted power, and a specialized chemical supply chain.'
    ],
    whyItMatters: 'Semiconductor sovereignty is essential for geopolitical security and advanced manufacturing competitiveness.',
    gdRelevance: 'Evidence of India\'s industrial policy success under the PLI semiconductor mission.',
    potentialInterviewQuestion: 'What are the main supply chain risks and yield ramp challenges for a greenfield semiconductor fab in India?',
    isFavorite: true,
    createdAt: '2026-08-21T10:00:00Z',
    updatedAt: '2026-08-21T10:00:00Z'
  },
  {
    id: 'news_4',
    headline: 'Unified Payments Interface (UPI) Expands Bilateral Linkage to 7 Countries for Real-Time Cross-Border Remittances',
    summary: 'NPCI International has expanded direct P2P and P2M instant payment corridors with Singapore (PayNow), UAE (AANI), and European tourist destinations.',
    sourceLink: 'https://npci.org.in',
    sourceName: 'NPCI Press Release',
    date: '2026-08-20',
    category: 'Fintech & Digital Public Infrastructure',
    keyTakeaways: [
      'Significantly lowers remittance transaction fees from ~6% (traditional wire transfer) to under 1%.',
      'Boosts Indian tourist convenience and strengthens the international footprint of Digital Public Infrastructure (DPI).',
      'Demonstrates India\'s soft power in setting global fintech interoperability standards.'
    ],
    whyItMatters: 'Digital Public Infrastructure (India Stack) serves as a global benchmark for inclusive financial architecture.',
    gdRelevance: 'Powerful proof point for India\'s fintech leadership and de-dollarization / alternative payment rails.',
    potentialInterviewQuestion: 'How can banks monetize digital payments when consumer transactions operate on zero merchant discount rate (MDR)?',
    isFavorite: false,
    createdAt: '2026-08-20T11:00:00Z',
    updatedAt: '2026-08-20T11:00:00Z'
  },
  {
    id: 'news_5',
    headline: 'Global Private Equity Buyouts Rebound with Focus on Healthcare, SaaS, and Energy Transition',
    summary: 'Bain\'s Global Private Equity Mid-Year Update reports a revival in exit activity and secondary buyouts after a 2-year liquidity drought.',
    sourceLink: 'https://bain.com/insights',
    sourceName: 'Bain & Company Insights',
    date: '2026-08-19',
    category: 'Private Equity & M&A',
    keyTakeaways: [
      'Dry powder reserves exceed $3.9 Trillion globally, putting pressure on general partners (GPs) to deploy capital.',
      'Valuation expectations between buyers and sellers have converged.',
      'Emphasis shifted from pure financial engineering to operational EBITDA expansion via AI transformation.'
    ],
    whyItMatters: 'Private equity deal volume directly drives consulting advisory fees, investment banking mandates, and corporate restructuring.',
    gdRelevance: 'Key topic for corporate finance and consulting interview rounds.',
    potentialInterviewQuestion: 'Walk me through how a PE fund creates value in a portfolio company beyond leverage and multiple expansion.',
    isFavorite: false,
    createdAt: '2026-08-19T14:00:00Z',
    updatedAt: '2026-08-19T14:00:00Z'
  }
];

export const initialDataPoints: DataPoint[] = [
  {
    id: 'dp_1',
    statName: 'UPI Monthly Transaction Volume',
    numberValue: '15.4 Billion',
    unit: 'Transactions / month',
    topic: 'Fintech / DPI',
    source: 'NPCI Official Monthly Stats',
    sourceUrl: 'https://npci.org.in',
    date: '2026-08-01',
    context: 'Represents over ₹20 Lakh Crore in monthly processed transaction value across India.',
    howToUse: 'Use in GDs and FinTech/Strategy cases to illustrate digital public infrastructure adoption scale.',
    isFavorite: true,
    createdAt: '2026-08-20T00:00:00Z',
    updatedAt: '2026-08-20T00:00:00Z'
  },
  {
    id: 'dp_2',
    statName: 'India Services Exports',
    numberValue: '$340 Billion',
    unit: 'USD / Year',
    topic: 'Macroeconomics & Trade',
    source: 'Ministry of Commerce & RBI',
    date: '2026-07-15',
    context: 'Services trade surplus ($160B+) effectively cushions India\'s merchandise trade deficit and oil import bill.',
    howToUse: 'Essential anchor for India macroeconomic balance of payments and GCC growth arguments.',
    isFavorite: true,
    createdAt: '2026-08-20T00:00:00Z',
    updatedAt: '2026-08-20T00:00:00Z'
  },
  {
    id: 'dp_3',
    statName: 'Quick Commerce Share of Grocery in Metros',
    numberValue: '35%',
    unit: '% of online grocery GMV',
    topic: 'E-Commerce & Retail',
    source: 'Bain India Retail Report 2025',
    date: '2026-08-10',
    context: 'In Tier-1 metro pin codes, quick commerce has captured 35% of all online FMCG and grocery orders from scheduled delivery players.',
    howToUse: 'FMCG marketing cases and Go-To-Market distribution channel strategy.',
    isFavorite: false,
    createdAt: '2026-08-20T00:00:00Z',
    updatedAt: '2026-08-20T00:00:00Z'
  },
  {
    id: 'dp_4',
    statName: 'Indian Smartphone Installed Base',
    numberValue: '650 Million',
    unit: 'Active Devices',
    topic: 'Tech & Telecom',
    source: 'TRAI & Counterpoint Research',
    date: '2026-06-30',
    context: 'World\'s second-largest smartphone base with an average daily data consumption of 24 GB per subscriber.',
    howToUse: 'Baseline demographic figure for tech guesstimates, digital product sizing, and app market calculations.',
    isFavorite: true,
    createdAt: '2026-08-20T00:00:00Z',
    updatedAt: '2026-08-20T00:00:00Z'
  },
  {
    id: 'dp_5',
    statName: 'India Renewable Energy Installed Capacity',
    numberValue: '200 GW',
    unit: 'Gigawatts (GW)',
    topic: 'Energy & Sustainability',
    source: 'Ministry of New and Renewable Energy',
    date: '2026-08-15',
    context: 'Accounted for ~44% of India\'s total power capacity, on track towards the 500 GW target by 2030.',
    howToUse: 'ESG debates, energy transition discussions, and cleantech consulting cases.',
    isFavorite: false,
    createdAt: '2026-08-20T00:00:00Z',
    updatedAt: '2026-08-20T00:00:00Z'
  }
];

export const initialMistakes: Mistake[] = [
  {
    id: 'mst_1',
    mistakeTitle: 'Answers lack structured MECE framework',
    category: 'Interview',
    relatedQuestionOrCase: 'Profitability diagnosis & Market entry scenarios',
    whatIDid: 'Jumped straight into unstructured brainstorming ideas without laying out high-level categorization branches first.',
    whatIShouldHaveDone: 'Take 30 seconds of quiet time, draw a clear 3-pillar issue tree (Revenue, Variable Costs, Fixed Opex) and state hypotheses explicitly.',
    correctApproach: 'State: "I will analyze this through three MECE pillars: Market Demand, Competitive Dynamics, and Internal Operational Capabilities."',
    whyIMadeIt: 'Anxiety and urge to fill silence immediately instead of asking for structured thinking time.',
    howToAvoid: 'Always ask: "May I take 45 seconds to structure my thoughts before diving into the branches?"',
    frequency: 7,
    status: 'Improving',
    date: '2026-08-23',
    isFavorite: true,
    createdAt: '2026-08-16T00:00:00Z',
    updatedAt: '2026-08-23T00:00:00Z'
  },
  {
    id: 'mst_2',
    mistakeTitle: 'Forgot to quantify business impact with numbers',
    category: 'Interview',
    relatedQuestionOrCase: 'Behavioral STAR stories (HR & Resume)',
    whatIDid: 'Described the process and teamwork well, but ended with vague results like "improved client satisfaction and speed".',
    whatIShouldHaveDone: 'Anchor every story with a verifiable dollar metric, percentage lift, or hours saved (e.g. "Cut reconciliation latency by 42% and saved $1.2M annually").',
    correctApproach: 'Follow the Google X-Y-Z formula: "Accomplished [X], as measured by [Y], by doing [Z]."',
    whyIMadeIt: 'Did not memorize specific operational metrics beforehand from my past resume projects.',
    howToAvoid: 'Review resume flashcards with exact metric numbers before every mock interview session.',
    frequency: 4,
    status: 'Review',
    date: '2026-08-22',
    isFavorite: true,
    createdAt: '2026-08-17T00:00:00Z',
    updatedAt: '2026-08-22T00:00:00Z'
  },
  {
    id: 'mst_3',
    mistakeTitle: 'Answers running too long (> 3 minutes)',
    category: 'Communication',
    relatedQuestionOrCase: '"Tell me about yourself" & situational questions',
    whatIDid: 'Rambled across irrelevant college background details and took 3.5 minutes for an elevator pitch.',
    whatIShouldHaveDone: 'Keep opening self-introduction strictly under 1 minute 45 seconds, leaving hooks for the interviewer to probe deeper.',
    correctApproach: 'Use the 90-Second Rule: Overview -> One highlight -> Career pivot rationale -> Enthusiastic tie-in to target firm.',
    whyIMadeIt: 'Fear of omitting context caused me to over-explain historical background.',
    howToAvoid: 'Use a digital stopwatch during daily practice; stop speaking at 1:45.',
    frequency: 3,
    status: 'Fixed',
    date: '2026-08-24',
    isFavorite: false,
    createdAt: '2026-08-18T00:00:00Z',
    updatedAt: '2026-08-24T00:00:00Z'
  },
  {
    id: 'mst_4',
    mistakeTitle: 'Over-complicating guesstimate arithmetic with awkward numbers',
    category: 'Guesstimate',
    relatedQuestionOrCase: 'Mumbai coffee consumption & Smartphone repair sizing',
    whatIDid: 'Used exact percentages like 37.5% and population 21,340,000, leading to messy multi-digit decimal math and calculation errors.',
    whatIShouldHaveDone: 'Round off numbers to clean base figures (e.g. 20M population, 35% ratio) and sanity-check results using scientific notation.',
    correctApproach: 'State your rounding upfront: "To keep the arithmetic clean, I will approximate Mumbai population as 20 million with a 35% penetration rate."',
    whyIMadeIt: 'Confused real-world statistical precision with consulting problem-solving structure.',
    howToAvoid: 'Stick to clean 80/20 round numbers; the interviewer is grading the logic tree, not decimal division.',
    frequency: 5,
    status: 'Improving',
    date: '2026-08-21',
    isFavorite: true,
    createdAt: '2026-08-19T00:00:00Z',
    updatedAt: '2026-08-21T00:00:00Z'
  },
  {
    id: 'mst_5',
    mistakeTitle: 'Jumping straight into solutions without clarifying questions',
    category: 'Case',
    relatedQuestionOrCase: 'European Luxury OEM Profitability Case',
    whatIDid: 'Immediately started proposing cost cuts without asking whether the margin drop was industry-wide or client-specific.',
    whatIShouldHaveDone: 'Always ask 2-3 targeted clarifying questions (Scope, Geography, Timeframe, Competitor baseline) before formulating the diagnostic framework.',
    correctApproach: 'Say: "Before structuring my framework, I have two quick clarifying questions regarding geographic exposure and whether competitors are seeing similar margin compression."',
    whyIMadeIt: 'Felt an urge to appear decisive immediately upon hearing the prompt.',
    howToAvoid: 'Mandatory rule: Never write the framework until asking at least 2 diagnostic scoping questions.',
    frequency: 3,
    status: 'New',
    date: '2026-08-24',
    isFavorite: false,
    createdAt: '2026-08-24T00:00:00Z',
    updatedAt: '2026-08-24T00:00:00Z'
  }
];

export const initialDailyFocusTasks: DailyFocusTask[] = [
  {
    id: 'task_1',
    title: 'Practice 5 HR & Behavioral questions in Practice Mode',
    category: 'Interview Prep',
    priority: 'High',
    targetMinutes: 25,
    completed: true,
    date: '2026-08-24',
    createdAt: '2026-08-24T07:00:00Z'
  },
  {
    id: 'task_2',
    title: 'Solve 2 Guesstimates with Dynamic Assumption Builder',
    category: 'Guesstimate Lab',
    priority: 'High',
    targetMinutes: 20,
    completed: true,
    date: '2026-08-24',
    createdAt: '2026-08-24T07:00:00Z'
  },
  {
    id: 'task_3',
    title: 'Read McKinsey company research & review PEI stories',
    category: 'Company Research',
    priority: 'High',
    targetMinutes: 30,
    completed: false,
    date: '2026-08-24',
    createdAt: '2026-08-24T07:00:00Z'
  },
  {
    id: 'task_4',
    title: 'Review 1 GD Topic: GenAI Economic Disemployment debate sheet',
    category: 'GD & Current Affairs',
    priority: 'Medium',
    targetMinutes: 15,
    completed: true,
    date: '2026-08-24',
    createdAt: '2026-08-24T07:00:00Z'
  },
  {
    id: 'task_5',
    title: '20 minutes vocal communication & elevator pitch drills',
    category: 'Daily Growth',
    priority: 'Medium',
    targetMinutes: 20,
    completed: false,
    date: '2026-08-24',
    createdAt: '2026-08-24T07:00:00Z'
  },
  {
    id: 'task_6',
    title: 'Review top recurring mistakes and log improvement notes',
    category: 'Mistake Bank',
    priority: 'Low',
    targetMinutes: 10,
    completed: false,
    date: '2026-08-24',
    createdAt: '2026-08-24T07:00:00Z'
  }
];

export const initialDailyLogs: DailyLog[] = [
  {
    id: 'log_1',
    date: '2026-08-24',
    accomplished: 'Completed 6 interview drills in practice mode, solved Bandra Starbucks guesstimate with dynamic formulas, and updated McKinsey firm differentiators.',
    learned: 'QuantumBlack integration and the "One Firm" staffing model are the strongest differentiators for McKinsey.',
    struggledWith: 'Keeping answers strictly under 2 minutes when explaining past software architecture projects.',
    tomorrowImprovement: 'Run a full timed mock interview with a peer partner focusing on high-energy body language.',
    activitiesCompleted: [
      { category: 'Interview Practice', description: 'Practiced 5 HR questions with rich feedback logs', minutes: 35 },
      { category: 'Guesstimates', description: 'Solved Starbucks capacity guesstimate with live math model', minutes: 20 },
      { category: 'Company Research', description: 'Updated McKinsey & Bain deep dive notes', minutes: 25 }
    ],
    scoreOutOf10: 8.5,
    createdAt: '2026-08-24T18:00:00Z',
    updatedAt: '2026-08-24T18:00:00Z'
  },
  {
    id: 'log_2',
    date: '2026-08-23',
    accomplished: 'Prepared GD topic on AI Disemployment, reviewed 3 business news takeaways, and practiced Amazon LP scenarios.',
    learned: 'Jevons paradox is the most effective economic counterargument against technological unemployment arguments.',
    struggledWith: 'Calculating decimal compound growth rates quickly without pen and paper.',
    tomorrowImprovement: 'Memorize rule-of-72 and clean 80/20 arithmetic shortcuts.',
    activitiesCompleted: [
      { category: 'GD Practice', description: 'Debated GenAI workforce impact with peer group', minutes: 45 },
      { category: 'Current Affairs', description: 'Read and summarized 3 articles on GCC expansion and RBI policy', minutes: 30 },
      { category: 'Communication', description: 'Reading aloud Wall Street Journal editorial for pacing', minutes: 20 }
    ],
    scoreOutOf10: 8.0,
    createdAt: '2026-08-23T19:00:00Z',
    updatedAt: '2026-08-23T19:00:00Z'
  },
  {
    id: 'log_3',
    date: '2026-08-22',
    accomplished: 'Drilled 1 profitability case on European Luxury OEM and practiced 3 behavioral conflict questions.',
    learned: 'Always check average selling price (ASP) and segment mix shifts when volume is flat but EBIT drops.',
    struggledWith: 'Structuring product mix trees under time pressure.',
    tomorrowImprovement: 'Practice drawing clean 3-pillar issue trees on whiteboard.',
    activitiesCompleted: [
      { category: 'Case Practice', description: 'Automotive profitability case with mentor feedback', minutes: 60 },
      { category: 'Interview Practice', description: 'Recorded video of behavioral answers', minutes: 30 }
    ],
    scoreOutOf10: 7.5,
    createdAt: '2026-08-22T20:00:00Z',
    updatedAt: '2026-08-22T20:00:00Z'
  }
];

export const initialReadingItems: ReadingItem[] = [
  {
    id: 'read_1',
    title: 'Case in Point: Complete Case Interview Preparation',
    author: 'Marc Cosentino',
    type: 'Book',
    totalPages: 280,
    pagesRead: 230,
    progressPercent: 82,
    timeSpentMinutes: 420,
    keyLearnings: 'Ivy Case System framework, profitability formulas, M&A decision trees, and capacity sizing rules.',
    notes: 'Reread Chapter 7 on Cost Reduction frameworks and Chapter 9 on New Market Entry.',
    status: 'Reading',
    createdAt: '2026-08-10T00:00:00Z',
    updatedAt: '2026-08-23T00:00:00Z'
  },
  {
    id: 'read_2',
    title: 'The McKinsey Mind',
    author: 'Ethan Rasiel & Paul Friga',
    type: 'Book',
    totalPages: 240,
    pagesRead: 190,
    progressPercent: 79,
    timeSpentMinutes: 310,
    keyLearnings: 'Hypothesis-driven problem solving, the MECE rule, elevator tests, and structured syndicate presentations.',
    notes: 'The initial framing of the problem statement dictates 80% of project success.',
    status: 'Reading',
    createdAt: '2026-08-12T00:00:00Z',
    updatedAt: '2026-08-22T00:00:00Z'
  },
  {
    id: 'read_3',
    title: 'Working Backwards: Insights, Stories, and Secrets from Inside Amazon',
    author: 'Colin Bryar & Bill Carr',
    type: 'Book',
    totalPages: 300,
    pagesRead: 300,
    progressPercent: 100,
    timeSpentMinutes: 480,
    keyLearnings: 'PR/FAQ narrative writing process, Single-Threaded Leadership, Bar Raiser hiring mechanisms.',
    notes: 'Crucial reading for Amazon product and operations rounds.',
    status: 'Completed',
    createdAt: '2026-08-05T00:00:00Z',
    updatedAt: '2026-08-18T00:00:00Z'
  }
];

export const initialCommunicationLogs: CommunicationLog[] = [
  {
    id: 'comm_1',
    date: '2026-08-24',
    activityType: 'Speaking Practice',
    durationMinutes: 20,
    confidenceBefore: 3,
    confidenceAfter: 4,
    notes: 'Practiced 2-minute elevator pitch with a metronome and timer. Removed filler words (um, like) significantly.',
    createdAt: '2026-08-24T08:30:00Z'
  },
  {
    id: 'comm_2',
    date: '2026-08-23',
    activityType: 'Mock Interview',
    durationMinutes: 45,
    confidenceBefore: 3,
    confidenceAfter: 4,
    notes: 'Peer mock session on PEI leadership stories. Feedback: Voice projection was confident, but slow down during key metric transitions.',
    createdAt: '2026-08-23T17:00:00Z'
  },
  {
    id: 'comm_3',
    date: '2026-08-22',
    activityType: 'Reading Aloud',
    durationMinutes: 15,
    confidenceBefore: 4,
    confidenceAfter: 5,
    notes: 'Read Financial Times lead editorial aloud to improve vocal resonance and steady cadence.',
    createdAt: '2026-08-22T09:00:00Z'
  }
];

export const initialInterviewRecords: InterviewRecord[] = [
  {
    id: 'rec_1',
    companyId: 'comp_mckinsey',
    companyName: 'McKinsey & Company',
    role: 'Associate / Management Consultant',
    date: '2026-08-20',
    round: 'Mock Round 1 - Problem Solving & PEI',
    performanceRating: 4,
    questionsAsked: ['Tell me about yourself', 'Walk through a time you influenced a skeptical stakeholder', 'European Automotive Profitability Case'],
    whatWentWell: 'Structured the case logically into Revenue and Cost branches; strong quantitative math speed.',
    whatWentWrong: 'Spent too much time on the opener introduction; rushed the final executive synthesis.',
    interviewerFeedback: 'Very sharp candidate. Practice delivering the final 60-second synthesis in a pyramid structure (Recommendation -> 3 Supporting Pillars -> Next Steps).',
    confidence: 4,
    result: 'Cleared',
    createdAt: '2026-08-20T16:00:00Z',
    updatedAt: '2026-08-20T16:00:00Z'
  }
];

export const initialUserSettings: UserSettings = {
  userName: 'Candidate',
  targetBatch: 'MBA Class of 2026 / 2027',
  targetRoles: ['Management Consultant', 'Product Manager', 'General Management Trainee', 'Strategy & BizOps'],
  theme: 'dark',
  accentColor: '#3b82f6',
  dailyTargetMinutes: 90,
  dailyQuestionsTarget: 5,
  dailyGuesstimatesTarget: 2,
  sidebarCollapsed: false,
  readinessWeights: {
    interviews: 25,
    guesstimates: 15,
    cases: 20,
    gd: 15,
    communication: 10,
    domain: 10,
    companyResearch: 5
  }
};

export const initialGymLogs: GymLog[] = [
  {
    id: 'gym_1',
    date: '2026-08-24',
    attended: true,
    weight: 74.2,
    createdAt: '2026-08-24T08:00:00Z'
  },
  {
    id: 'gym_2',
    date: '2026-08-23',
    attended: true,
    weight: 74.5,
    createdAt: '2026-08-23T08:30:00Z'
  },
  {
    id: 'gym_3',
    date: '2026-08-22',
    attended: false,
    weight: 74.8,
    createdAt: '2026-08-22T09:00:00Z'
  },
  {
    id: 'gym_4',
    date: '2026-08-21',
    attended: true,
    weight: 74.6,
    createdAt: '2026-08-21T07:45:00Z'
  },
  {
    id: 'gym_5',
    date: '2026-08-20',
    attended: true,
    weight: 75.0,
    createdAt: '2026-08-20T08:15:00Z'
  },
  {
    id: 'gym_6',
    date: '2026-08-19',
    attended: true,
    weight: 75.1,
    createdAt: '2026-08-19T08:00:00Z'
  },
  {
    id: 'gym_7',
    date: '2026-08-18',
    attended: false,
    weight: 75.4,
    createdAt: '2026-08-18T09:15:00Z'
  }
];

export const initialNutritionGoals: DailyNutritionGoals = {
  targetCalories: 2100,
  targetProtein: 135,
  targetCarbs: 220,
  targetFat: 60,
  targetFiber: 30
};

export const initialFoodLogs: FoodLogEntry[] = [
  {
    id: 'flog_1',
    date: '2026-08-24',
    mealType: 'Breakfast',
    foodItemId: 'food_egg_omelette',
    foodName: '2-Egg Omelette (with onion, tomato, 1 tsp oil)',
    category: 'Proteins & Dairy',
    servingUnit: '1 omelette (2 eggs, 120g)',
    servings: 1,
    calories: 195,
    protein: 13.2,
    carbs: 3.5,
    fat: 14.5,
    fiber: 0.8,
    createdAt: '2026-08-24T08:30:00Z'
  },
  {
    id: 'flog_2',
    date: '2026-08-24',
    mealType: 'Breakfast',
    foodItemId: 'food_roti_plain',
    foodName: 'Whole Wheat Roti / Phulka (No Ghee)',
    category: 'Breads & Grains',
    servingUnit: '1 medium roti (35g raw flour)',
    servings: 2,
    calories: 170,
    protein: 6.2,
    carbs: 34.4,
    fat: 1.0,
    fiber: 5.6,
    createdAt: '2026-08-24T08:32:00Z'
  },
  {
    id: 'flog_3',
    date: '2026-08-24',
    mealType: 'Breakfast',
    foodItemId: 'food_masala_chai',
    foodName: 'Indian Masala Chai (with milk & 1 tsp sugar)',
    category: 'Beverages',
    servingUnit: '1 cup (150ml)',
    servings: 1,
    calories: 85,
    protein: 2.6,
    carbs: 11.5,
    fat: 3.2,
    fiber: 0.0,
    createdAt: '2026-08-24T08:35:00Z'
  },
  {
    id: 'flog_4',
    date: '2026-08-24',
    mealType: 'Lunch',
    foodItemId: 'food_dal_tadka',
    foodName: 'Yellow Dal Tadka (Arhar/Toor Dal)',
    category: 'Dals & Curries',
    servingUnit: '1 katori / bowl (150g)',
    servings: 1.5,
    calories: 231,
    protein: 10.8,
    carbs: 30.6,
    fat: 7.2,
    fiber: 6.75,
    createdAt: '2026-08-24T13:15:00Z'
  },
  {
    id: 'flog_5',
    date: '2026-08-24',
    mealType: 'Lunch',
    foodItemId: 'food_roti_ghee',
    foodName: 'Whole Wheat Roti (with 1/2 tsp Ghee)',
    category: 'Breads & Grains',
    servingUnit: '1 roti with ghee (40g)',
    servings: 3,
    calories: 330,
    protein: 9.3,
    carbs: 51.6,
    fat: 10.5,
    fiber: 8.4,
    createdAt: '2026-08-24T13:16:00Z'
  },
  {
    id: 'flog_6',
    date: '2026-08-24',
    mealType: 'Lunch',
    foodItemId: 'food_curd_dahi',
    foodName: 'Plain Curd / Dahi (Homemade)',
    category: 'Proteins & Dairy',
    servingUnit: '1 katori / cup (150g)',
    servings: 1,
    calories: 98,
    protein: 5.4,
    carbs: 6.8,
    fat: 5.8,
    fiber: 0.0,
    createdAt: '2026-08-24T13:18:00Z'
  },
  {
    id: 'flog_7',
    date: '2026-08-24',
    mealType: 'Snacks',
    foodItemId: 'food_roasted_chana',
    foodName: 'Bhuna Chana / Roasted Bengal Gram',
    category: 'Snacks & Nuts',
    servingUnit: 'Handful (50g)',
    servings: 1,
    calories: 185,
    protein: 11.2,
    carbs: 29.0,
    fat: 3.2,
    fiber: 8.5,
    createdAt: '2026-08-24T17:30:00Z'
  },
  {
    id: 'flog_8',
    date: '2026-08-24',
    mealType: 'Snacks',
    foodItemId: 'food_whey_protein',
    foodName: 'Whey Protein Isolate / Concentrate',
    category: 'Proteins & Dairy',
    servingUnit: '1 scoop (30g powder in water)',
    servings: 1,
    calories: 120,
    protein: 24.5,
    carbs: 2.0,
    fat: 1.5,
    fiber: 0.5,
    createdAt: '2026-08-24T18:00:00Z'
  }
];

export const initialMedicines: Medicine[] = [
  {
    id: 'med_minoxidil',
    name: 'Minoxidil',
    dosage: '1 ml (5% Topical Solution)',
    frequency: 'Daily',
    timing: 'Night',
    type: 'Topical Solution',
    purpose: 'Hair Growth & Scalp Follicle Stimulation',
    instructions: 'Apply 1 ml with dropper directly onto completely dry scalp in target thinning areas. Massage gently with fingertips. Leave overnight and wash hands thoroughly.',
    reminderTime: '22:30',
    isActive: true,
    color: 'emerald',
    startDate: '2026-08-01',
    isFavorite: true,
    notes: 'Do not wash hair for at least 4 hours after application. Consistency is paramount for visible density results.',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-24T10:00:00Z'
  },
  {
    id: 'med_multivitamin',
    name: 'Multivitamin & Zinc',
    dosage: '1 Tablet',
    frequency: 'Daily',
    timing: 'Morning',
    type: 'Tablet / Pill',
    purpose: 'Daily micronutrients, zinc balance & overall immunity',
    instructions: 'Take 1 tablet immediately after breakfast with a full glass of water.',
    reminderTime: '09:00',
    isActive: true,
    color: 'amber',
    startDate: '2026-08-10',
    isFavorite: false,
    notes: 'Best absorbed with dietary fats from breakfast.',
    createdAt: '2026-08-10T00:00:00Z',
    updatedAt: '2026-08-24T10:00:00Z'
  },
  {
    id: 'med_fish_oil',
    name: 'Omega-3 Fish Oil',
    dosage: '1000 mg (1 Capsule)',
    frequency: 'Daily',
    timing: 'Lunch',
    type: 'Capsule',
    purpose: 'Cognitive clarity, heart health & anti-inflammatory recovery',
    instructions: 'Take 1 capsule during or right after lunch.',
    reminderTime: '13:30',
    isActive: true,
    color: 'blue',
    startDate: '2026-08-15',
    isFavorite: false,
    notes: 'EPA + DHA support for intense study sprints and workout recovery.',
    createdAt: '2026-08-15T00:00:00Z',
    updatedAt: '2026-08-24T10:00:00Z'
  }
];

export const initialMedicineLogs: MedicineLog[] = [
  // Minoxidil logs (past consecutive days for streak)
  {
    id: 'mlog_minox_1',
    medicineId: 'med_minoxidil',
    medicineName: 'Minoxidil',
    date: '2026-08-24',
    taken: true,
    takenAt: '22:40',
    timing: 'Night',
    dosageTaken: '1 ml',
    notes: 'Applied after shower on dry scalp.',
    createdAt: '2026-08-24T22:40:00Z',
    updatedAt: '2026-08-24T22:40:00Z'
  },
  {
    id: 'mlog_minox_2',
    medicineId: 'med_minoxidil',
    medicineName: 'Minoxidil',
    date: '2026-08-25',
    taken: true,
    takenAt: '23:05',
    timing: 'Night',
    dosageTaken: '1 ml',
    notes: '',
    createdAt: '2026-08-25T23:05:00Z',
    updatedAt: '2026-08-25T23:05:00Z'
  },
  {
    id: 'mlog_minox_3',
    medicineId: 'med_minoxidil',
    medicineName: 'Minoxidil',
    date: '2026-08-26',
    taken: true,
    takenAt: '22:30',
    timing: 'Night',
    dosageTaken: '1 ml',
    notes: '',
    createdAt: '2026-08-26T22:30:00Z',
    updatedAt: '2026-08-26T22:30:00Z'
  },
  {
    id: 'mlog_minox_4',
    medicineId: 'med_minoxidil',
    medicineName: 'Minoxidil',
    date: '2026-08-27',
    taken: true,
    takenAt: '22:50',
    timing: 'Night',
    dosageTaken: '1 ml',
    notes: '',
    createdAt: '2026-08-27T22:50:00Z',
    updatedAt: '2026-08-27T22:50:00Z'
  },
  {
    id: 'mlog_minox_5',
    medicineId: 'med_minoxidil',
    medicineName: 'Minoxidil',
    date: '2026-08-28',
    taken: true,
    takenAt: '22:35',
    timing: 'Night',
    dosageTaken: '1 ml',
    notes: '',
    createdAt: '2026-08-28T22:35:00Z',
    updatedAt: '2026-08-28T22:35:00Z'
  },
  {
    id: 'mlog_minox_6',
    medicineId: 'med_minoxidil',
    medicineName: 'Minoxidil',
    date: '2026-08-29',
    taken: true,
    takenAt: '22:15',
    timing: 'Night',
    dosageTaken: '1 ml',
    notes: '',
    createdAt: '2026-08-29T22:15:00Z',
    updatedAt: '2026-08-29T22:15:00Z'
  },
  // Multivitamin logs
  {
    id: 'mlog_multi_1',
    medicineId: 'med_multivitamin',
    medicineName: 'Multivitamin & Zinc',
    date: '2026-08-28',
    taken: true,
    takenAt: '09:15',
    timing: 'Morning',
    dosageTaken: '1 Tablet',
    notes: '',
    createdAt: '2026-08-28T09:15:00Z',
    updatedAt: '2026-08-28T09:15:00Z'
  },
  {
    id: 'mlog_multi_2',
    medicineId: 'med_multivitamin',
    medicineName: 'Multivitamin & Zinc',
    date: '2026-08-29',
    taken: true,
    takenAt: '09:20',
    timing: 'Morning',
    dosageTaken: '1 Tablet',
    notes: '',
    createdAt: '2026-08-29T09:20:00Z',
    updatedAt: '2026-08-29T09:20:00Z'
  },
  // Omega-3 logs
  {
    id: 'mlog_omega_1',
    medicineId: 'med_fish_oil',
    medicineName: 'Omega-3 Fish Oil',
    date: '2026-08-28',
    taken: true,
    takenAt: '13:45',
    timing: 'Lunch',
    dosageTaken: '1 Capsule',
    notes: '',
    createdAt: '2026-08-28T13:45:00Z',
    updatedAt: '2026-08-28T13:45:00Z'
  },
  {
    id: 'mlog_omega_2',
    medicineId: 'med_fish_oil',
    medicineName: 'Omega-3 Fish Oil',
    date: '2026-08-29',
    taken: true,
    takenAt: '13:30',
    timing: 'Lunch',
    dosageTaken: '1 Capsule',
    notes: '',
    createdAt: '2026-08-29T13:30:00Z',
    updatedAt: '2026-08-29T13:30:00Z'
  }
];


