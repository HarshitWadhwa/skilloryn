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
}

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-monzo-analyst',
    title: 'Product Data Analyst (Growth & Retention)',
    company: 'Monzo Bank',
    location: 'London, UK',
    workMode: 'Hybrid',
    type: 'Full-time',
    salaryRange: '£55,000 - £68,000',
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
    description: 'We are looking for an evidence-led Data Analyst to uncover user retention drop-offs, design pricing experimentation readouts, and partner with product squads.',
    deadline: 'In 12 days (Sep 12, 2026)',
    saved: true,
  },
  {
    id: 'opp-spotify-analyst',
    title: 'Junior Analytics Engineer / Data Analyst',
    company: 'Spotify',
    location: 'Stockholm · Remote (EU)',
    workMode: 'Remote',
    type: 'Full-time',
    salaryRange: '€50,000 - €62,000',
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
    id: 'opp-deliveroo-intern',
    title: 'Commercial Data Analyst Intern',
    company: 'Deliveroo',
    location: 'London, UK',
    workMode: 'Hybrid',
    type: 'Internship',
    salaryRange: '£32,000 pro-rata',
    matchScore: 96,
    matchRationale: {
      matchingEvidence: [
        'Exceeds all baseline SQL testing benchmarks',
        'Strong visual hierarchy and dashboard storytelling evidence',
      ],
      gapToBridge: 'None — ready to apply directly with current evidence package',
      actionableStep: 'Review application package and submit with verified passport link.',
    },
    requiredSkills: ['SQL', 'Tableau', 'Business Communication'],
    description: 'Support marketplace operational squads in analysing rider logistics, restaurant delivery times, and promotional voucher sensitivity.',
    deadline: 'In 5 days (Sep 05, 2026)',
    saved: true,
  },
  {
    id: 'opp-revolut-analyst',
    title: 'Quantitative Risk Analyst',
    company: 'Revolut',
    location: 'London, UK',
    workMode: 'On-site',
    type: 'Full-time',
    salaryRange: '£60,000 - £75,000',
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
