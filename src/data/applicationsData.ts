export type ApplicationStage =
  | 'Saved'
  | 'Ready to apply'
  | 'Submitted'
  | 'Interview or next step'
  | 'Withdrawn';

export interface ApplicationItem {
  id: string;
  opportunityId: string;
  role: string;
  company: string;
  stage: ApplicationStage;
  deadline?: string;
  selectedEvidence: {
    title: string;
    type: string;
    verifiedScore?: string;
  }[];
  missingPrepSteps: string[];
  lastUpdated: string;
  studentNotes: string;
  nextRecommendedAction: string;
  isSharedWithCompany: boolean;
}

export const INITIAL_APPLICATIONS: ApplicationItem[] = [
  {
    id: 'app-1',
    opportunityId: 'opp-monzo-analyst',
    role: 'Product Data Analyst (Growth & Retention)',
    company: 'Monzo Bank',
    stage: 'Ready to apply',
    deadline: 'Sep 12, 2026',
    selectedEvidence: [
      { title: 'Advanced SQL Diagnostic Result', type: 'Verified Assessment', verifiedScore: '92/100' },
      { title: 'Ecommerce Customer Retention Cohort Model', type: 'GitHub Repository', verifiedScore: 'Reviewed' },
      { title: 'Pricing Experiment Decision Memo', type: 'Executive Memo', verifiedScore: '86/100' },
    ],
    missingPrepSteps: [
      'Complete Node 02 Window Functions diagnostic to unlock 98% match',
      'Add a 2-sentence note highlighting how your churn model directly addresses fintech subscriber drop-offs',
    ],
    lastUpdated: 'Yesterday at 16:40',
    studentNotes: 'Monzo product team values clear stakeholder memos over complex black-box neural nets. Emphasize the confidence interval trade-offs from the pricing experiment.',
    nextRecommendedAction: 'Run final diagnostic check on Window Functions and click "Submit Application Package".',
    isSharedWithCompany: true,
  },
  {
    id: 'app-2',
    opportunityId: 'opp-deliveroo-intern',
    role: 'Commercial Data Analyst Intern',
    company: 'Deliveroo',
    stage: 'Submitted',
    deadline: 'Sep 05, 2026',
    selectedEvidence: [
      { title: 'Advanced SQL Diagnostic Result', type: 'Verified Assessment', verifiedScore: '92/100' },
      { title: 'Retention Command Centre Dashboard', type: 'Tableau Portfolio', verifiedScore: 'Self-Reported Claim' },
    ],
    missingPrepSteps: [],
    lastUpdated: '3 days ago',
    studentNotes: 'Submitted verified Skilloryn passport link. Recruiter confirmed receipt of technical evidence packet.',
    nextRecommendedAction: 'Prepare for 30-minute case walkthrough on cohort retention analysis.',
    isSharedWithCompany: true,
  },
];
