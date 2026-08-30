export interface CandidateReviewItem {
  id: string;
  name: string;
  targetRole: string;
  location: string;
  appliedRole: string;
  stage: 'Screening' | 'Technical Review' | 'Interview' | 'Offer' | 'Archived';
  overallMatch: number;
  matchExplanation: string;
  verifiedSkills: {
    name: string;
    score: string;
    status: 'Verified' | 'Reviewed' | 'Self-Reported' | 'Assessed' | 'Employer-Validated';
    detail: string;
  }[];
  submittedEvidence: {
    title: string;
    type: 'GitHub Repository' | 'Notion Document' | 'Diagnostic Assessment' | 'Memo';
    url: string;
    summary: string;
  }[];
  recruiterNotes: string;
  structuredFeedback: {
    skillId: string;
    skillName: string;
    score: number; // 1-5
    constructiveNote: string;
    suggestedAction: string;
    submittedAt?: string;
  }[];
}

export const INITIAL_CANDIDATES: CandidateReviewItem[] = [
  {
    id: 'cand-jane-doe',
    name: 'Jane Doe',
    targetRole: 'Level 12 Data Analyst Candidate',
    location: 'London, UK (Remote / Hybrid)',
    appliedRole: 'Product Data Analyst (Growth & Retention)',
    stage: 'Technical Review',
    overallMatch: 94,
    matchExplanation: 'Candidate demonstrated verified SQL excellence (92/100) and submitted reproducible customer churn models in Python. Candidate is bridging window function analytical framing.',
    verifiedSkills: [
      { name: 'Advanced SQL & Window Functions', score: '92/100', status: 'Verified', detail: 'Proctored diagnostic on normalized schemas & execution plans' },
      { name: 'Python Data Analysis & Modeling', score: '4 Artifacts', status: 'Reviewed', detail: 'Pandas, NumPy, and XGBoost churn models with cross-validation' },
      { name: 'A/B Testing & Causal Inference', score: '86/100', status: 'Verified', detail: 'Pre-registered pricing experiment readout memo' },
      { name: 'Tableau Visual Storytelling', score: 'Portfolio', status: 'Self-Reported', detail: 'Interactive retention dashboard design' },
    ],
    submittedEvidence: [
      {
        title: 'Ecommerce Customer Retention Cohort Model',
        type: 'GitHub Repository',
        url: 'https://github.com/janedoe/ecommerce-churn-model',
        summary: 'Feature pipeline predicting churn with 82% recall on customer transactions.',
      },
      {
        title: 'Pricing Experiment Decision Memo',
        type: 'Memo',
        url: 'https://github.com/janedoe/pricing-experiment-readout',
        summary: 'Executive memo with confidence intervals recommending 7% pricing tier uplift.',
      },
      {
        title: 'Retention Command Centre Dashboard',
        type: 'Notion Document',
        url: 'https://janedoe.notion.site/retention-command-centre',
        summary: 'Tableau dashboard specification for weekly executive cohort reporting.',
      },
    ],
    recruiterNotes: 'Strongest technical evidence packet in current cohort. Code clean and well-commented.',
    structuredFeedback: [
      {
        skillId: 'advanced-sql',
        skillName: 'Advanced SQL & Window Functions',
        score: 5,
        constructiveNote: 'Excellent execution plan awareness. Query benchmarks were under 15ms.',
        suggestedAction: 'Continue with window function frame clauses (ROWS BETWEEN).',
        submittedAt: '2 days ago',
      },
    ],
  },
  {
    id: 'cand-alex-chen',
    name: 'Alex Chen',
    targetRole: 'Data Analyst / Analytics Engineer',
    location: 'Manchester, UK (Hybrid)',
    appliedRole: 'Product Data Analyst (Growth & Retention)',
    stage: 'Screening',
    overallMatch: 82,
    matchExplanation: 'Strong baseline Python skills. SQL diagnostic pending completion.',
    verifiedSkills: [
      { name: 'Python Data Analysis', score: '3 Artifacts', status: 'Reviewed', detail: 'Pandas & Matplotlib exploratory analysis' },
      { name: 'SQL Querying', score: '78/100', status: 'Assessed', detail: 'Basic diagnostic completed' },
    ],
    submittedEvidence: [
      {
        title: 'Supply Chain Delay Predictor',
        type: 'GitHub Repository',
        url: 'https://github.com/alexchen/supply-chain-analytics',
        summary: 'Python notebook analyzing logistical delivery bottle-necks.',
      },
    ],
    recruiterNotes: 'Promising candidate. Need to verify window functions capability before interview.',
    structuredFeedback: [],
  },
];
