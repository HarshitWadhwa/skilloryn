export interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  type: 'Full-time' | 'Internship' | 'Apprenticeship';
  salaryRange?: string;
  matchScore: number;
  matchRationale: {
    matchingEvidence: string[];
    gapToBridge: string;
    actionableStep: string;
  };
  requiredSkills: string[];
  description: string;
  deadline?: string;
  saved?: boolean;
  isLessRelevant?: boolean;
  lessRelevantReason?: string;
  stipend?: string;
  duration?: string;
  ppiPotential?: boolean;
}

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-swiggy-intern',
    title: 'Data & Growth Analytics Intern',
    company: 'Swiggy',
    location: 'Bengaluru, Karnataka',
    workMode: 'Hybrid',
    type: 'Internship',
    salaryRange: '₹45,000 / month',
    stipend: '₹45,000 / month',
    duration: '6 Months (PPO Available)',
    ppiPotential: true,
    matchScore: 96,
    matchRationale: {
      matchingEvidence: [
        'Advanced SQL baseline (92/100 verified on cohort metrics)',
        'Ecommerce Churn Predictor portfolio matches food delivery retention needs',
        'Demonstrated query optimization reducing runtime by 34%',
      ],
      gapToBridge: 'Window functions framing for delivery rider assignment',
      actionableStep: 'Complete Node 02 in your roadmap to raise match to 99%.',
    },
    requiredSkills: ['Advanced SQL', 'Python Data Analysis', 'Tableau', 'Cohort Analytics'],
    description: 'Join Swiggy’s customer insights team in Koramangala. Analyze hyper-local food delivery retention, coupon sensitivity curves, and restaurant partner growth trends.',
    deadline: 'In 4 days (Apply soon)',
    saved: true,
  },
  {
    id: 'opp-cred-intern',
    title: 'Product Analytics & Telemetry Intern',
    company: 'CRED',
    location: 'Bengaluru, Karnataka',
    workMode: 'On-site',
    type: 'Internship',
    salaryRange: '₹60,000 / month',
    stipend: '₹60,000 / month',
    duration: '6 Months',
    ppiPotential: true,
    matchScore: 93,
    matchRationale: {
      matchingEvidence: [
        'Reproducible Python statistical modeling notebooks',
        'Strong telemetry and exploratory data analysis artifacts',
      ],
      gapToBridge: 'High-concurrency time-series window framing',
      actionableStep: 'Attach your query execution benchmark notebook before submitting.',
    },
    requiredSkills: ['SQL', 'Python', 'Product Telemetry', 'A/B Testing'],
    description: 'Work directly with founders and product leads to analyze high-trust credit card payment behaviors, reward claim patterns, and member engagement funnels.',
    deadline: 'In 8 days',
    saved: true,
  },
  {
    id: 'opp-flipkart-intern',
    title: 'Supply Chain Insights Intern',
    company: 'Flipkart',
    location: 'Bengaluru, Karnataka',
    workMode: 'Hybrid',
    type: 'Internship',
    salaryRange: '₹50,000 / month',
    stipend: '₹50,000 / month',
    duration: '3-6 Months',
    ppiPotential: true,
    matchScore: 91,
    matchRationale: {
      matchingEvidence: [
        'Verified query tuning and execution plan analysis',
        'Demonstrated Random Forest / XGBoost classifier modeling',
      ],
      gapToBridge: 'Inventory forecasting statistical baseline',
      actionableStep: 'Review supply chain forecasting module in Prep Zone.',
    },
    requiredSkills: ['Advanced SQL', 'Python', 'Forecasting', 'Dashboarding'],
    description: 'Analyze fulfillment center dispatch times, Big Billion Days inventory flow, and return reduction models across tier 2/3 Indian cities.',
    deadline: 'In 12 days',
    saved: false,
  },
  {
    id: 'opp-zomato-intern',
    title: 'Merchant Analytics Intern',
    company: 'Zomato',
    location: 'Gurgaon, Haryana',
    workMode: 'Hybrid',
    type: 'Internship',
    salaryRange: '₹40,000 / month',
    stipend: '₹40,000 / month',
    duration: '6 Months',
    ppiPotential: true,
    matchScore: 88,
    matchRationale: {
      matchingEvidence: [
        'Cohort retention command center project',
        'Tableau visual storytelling evidence',
      ],
      gapToBridge: 'Live restaurant ad bidding optimization',
      actionableStep: 'Complete mock assessment on merchant attribution.',
    },
    requiredSkills: ['SQL', 'Tableau', 'Excel Modeling', 'Business Communication'],
    description: 'Empower dining-out and cloud kitchen partners with actionable margin insights, dynamic pricing elasticity, and customer rating analytics.',
    deadline: 'In 15 days',
    saved: false,
  },
  {
    id: 'opp-razorpay-intern',
    title: 'Risk & Fraud Analytics Intern',
    company: 'Razorpay',
    location: 'Bengaluru / Remote',
    workMode: 'Remote',
    type: 'Internship',
    salaryRange: '₹55,000 / month',
    stipend: '₹55,000 / month',
    duration: '6 Months',
    ppiPotential: true,
    matchScore: 90,
    matchRationale: {
      matchingEvidence: [
        'Anomaly detection notebooks with confidence intervals',
        'Clean reproducible Python pipelines',
      ],
      gapToBridge: 'UPI transactional routing latency metrics',
      actionableStep: 'Read the payment risk case study in Prep Zone.',
    },
    requiredSkills: ['Python', 'SQL', 'Risk Modeling', 'Statistics'],
    description: 'Protect millions of digital transactions across Indian UPI and payment gateways by building predictive anomaly detection heuristics and risk dashboards.',
    deadline: 'In 10 days',
    saved: false,
  },
  {
    id: 'opp-monzo-analyst',
    title: 'Product Data Analyst (Growth & Retention)',
    company: 'Monzo Bank',
    location: 'Bengaluru Tech Center · Hybrid',
    workMode: 'Hybrid',
    type: 'Full-time',
    salaryRange: '₹18,00,000 - ₹24,00,000 / yr',
    matchScore: 94,
    matchRationale: {
      matchingEvidence: [
        'Verified Advanced SQL (92/100 score on relational CTEs)',
        'Ecommerce Customer Churn model matches retention portfolio requirements',
        'Demonstrated A/B test decision memo writing',
      ],
      gapToBridge: 'Window functions diagnostic completion (PARTITION BY framing)',
      actionableStep: 'Complete Node 02 in your roadmap to elevate match to 98%.',
    },
    requiredSkills: ['Advanced SQL', 'Python Data Analysis', 'A/B Testing', 'Tableau'],
    description: 'We are looking for an evidence-led Data Analyst to uncover user retention drop-offs, design pricing experimentation readouts, and partner with product squads across our global and India engineering center.',
    deadline: 'In 12 days (Sep 12, 2026)',
    saved: true,
  },
  {
    id: 'opp-spotify-analyst',
    title: 'Junior Analytics Engineer / Data Analyst',
    company: 'Spotify',
    location: 'Mumbai · Hybrid (India Hub)',
    workMode: 'Remote',
    type: 'Full-time',
    salaryRange: '₹16,00,000 - ₹22,00,000 / yr',
    matchScore: 89,
    matchRationale: {
      matchingEvidence: [
        'Demonstrated data cleaning and EDA pipeline in Pandas',
        'Reproducible GitHub repository with clean documentation',
      ],
      gapToBridge: 'Query optimization under high-concurrency partitions',
      actionableStep: 'Attach your query execution plan benchmark artifact before submitting.',
    },
    requiredSkills: ['SQL', 'Python Data Analysis', 'Data Modeling', 'Tableau'],
    description: 'Join the Core Experience insights team to build scalable metric pipelines, evaluate feature rollouts, and translate metrics into user growth narratives.',
    deadline: 'In 18 days (Sep 18, 2026)',
    saved: false,
  },
  {
    id: 'opp-revolut-analyst',
    title: 'Quantitative Risk Analyst',
    company: 'Revolut',
    location: 'Mumbai Tech Hub',
    workMode: 'On-site',
    type: 'Full-time',
    salaryRange: '₹18,00,000 - ₹25,00,000 / yr',
    matchScore: 78,
    matchRationale: {
      matchingEvidence: ['Python statistical modeling and XGBoost baseline evaluations'],
      gapToBridge: 'Requires deep financial fraud modeling and SQL window framing under sub-second SLAs',
      actionableStep: 'Consider completing the Risk Modeling capstone before applying.',
    },
    requiredSkills: ['Advanced SQL', 'Python', 'Risk Modeling', 'Statistics'],
    description: 'Analyze real-time payment risk vectors, build anomaly detection algorithms, and monitor transaction confidence intervals.',
    deadline: 'In 25 days (Sep 25, 2026)',
    saved: false,
  },
];
