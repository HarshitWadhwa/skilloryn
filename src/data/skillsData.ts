export type EvidenceStatus = 'Self-Reported' | 'Assessed' | 'Reviewed' | 'Employer-Validated';
export type PrivacySetting = 'private' | 'employers' | 'institution' | 'public';

export interface VerifiableSkill {
  id: string;
  name: string;
  short: string;
  category: string;
  level: string;
  score?: string;
  status: EvidenceStatus;
  source: string;
  lastUpdated: string;
  privacy: PrivacySetting;
  summary: string;
  evidenceItems: {
    title: string;
    type: 'GitHub Repo' | 'Notion Document' | 'Diagnostic Assessment' | 'Employer Memo';
    url: string;
    isCredentialsFreePreview?: boolean;
    detail: string;
  }[];
  strengthenAction: string;
  whatEmployersSee: string;
}

export const INITIAL_SKILLS: VerifiableSkill[] = [
  {
    id: 'advanced-sql',
    name: 'Advanced SQL & Window Functions',
    short: 'SQL',
    category: 'Data Querying & Modeling',
    level: 'Advanced Competency',
    score: '92/100',
    status: 'Employer-Validated',
    source: 'Skilloryn Diagnostic + Fintech Case Review',
    lastUpdated: '2 days ago',
    privacy: 'employers',
    summary: 'Demonstrated mastery in complex multi-table joins, subqueries, analytical window functions (PARTITION BY, ROW_NUMBER, RANK), and execution plan optimization.',
    evidenceItems: [
      {
        title: 'Ecommerce Customer Retention Cohort Model',
        type: 'GitHub Repo',
        url: 'https://github.com/janedoe/ecommerce-churn-model',
        isCredentialsFreePreview: true,
        detail: 'SQL feature pipeline, cohort segmentation CTEs, and index optimization.',
      },
      {
        title: 'Skilloryn Adaptive Diagnostic Ledger Entry',
        type: 'Diagnostic Assessment',
        url: 'https://skilloryn.io/verify/advanced-sql',
        detail: 'Proctored timed diagnostic verifying query optimization under 12ms constraints.',
      },
    ],
    strengthenAction: 'Complete a query tuning lab for distributed Presto / Athena queries.',
    whatEmployersSee: 'Verified 92/100 score, reproducible cohort analysis repository, and verified execution plan benchmarks.',
  },
  {
    id: 'python-analysis',
    name: 'Python Data Analysis & Modeling',
    short: 'PY',
    category: 'Statistical Computing',
    level: 'Intermediate Proficiency',
    score: '4 Verified Artifacts',
    status: 'Reviewed',
    source: 'Project Peer Review & Mentor Checkpoint',
    lastUpdated: '5 days ago',
    privacy: 'employers',
    summary: 'End-to-end data pipeline in Pandas and NumPy, exploratory data analysis, and predictive baseline evaluation using XGBoost and Scikit-Learn.',
    evidenceItems: [
      {
        title: 'Ecommerce Churn Prediction Model',
        type: 'GitHub Repo',
        url: 'https://github.com/janedoe/ecommerce-churn-model',
        isCredentialsFreePreview: true,
        detail: 'Reproducible Jupyter notebook with feature engineering, cross-validation, and confusion matrices.',
      },
      {
        title: 'Pricing Experiment Readout & Confidence Intervals',
        type: 'Notion Document',
        url: 'https://janedoe.notion.site/pricing-experiment-readout',
        detail: 'Statistical evaluation of two-sample t-test results for tier pricing changes.',
      },
    ],
    strengthenAction: 'Add automated unit tests (PyTest) to your data transformation pipeline.',
    whatEmployersSee: 'Documented notebooks, cleaned datasets, and model performance metrics with reproducible code.',
  },
  {
    id: 'ab-testing',
    name: 'A/B Testing & Experimentation',
    short: 'A/B',
    category: 'Causal Inference',
    level: 'Assessed Competency',
    score: '86/100',
    status: 'Assessed',
    source: 'Skilloryn Mission Assessment',
    lastUpdated: '1 week ago',
    privacy: 'employers',
    summary: 'Hypothesis pre-registration, sample size power calculations, statistical significance testing, and stakeholder decision memo authoring.',
    evidenceItems: [
      {
        title: 'Pricing Experiment Decision Memo',
        type: 'Employer Memo',
        url: 'https://github.com/janedoe/pricing-experiment-readout',
        isCredentialsFreePreview: true,
        detail: 'Executive recommendation memo highlighting confidence intervals and downside risk analysis.',
      },
    ],
    strengthenAction: 'Document how you handle variance reduction techniques (CUPED) in ongoing experiments.',
    whatEmployersSee: 'Pre-registration hypothesis design, experiment readouts, and statistical risk trade-offs.',
  },
  {
    id: 'tableau',
    name: 'Tableau Visual Storytelling',
    short: 'VIZ',
    category: 'Business Intelligence',
    level: 'Candidate Claim',
    status: 'Self-Reported',
    source: 'Student Portfolio Entry',
    lastUpdated: '2 weeks ago',
    privacy: 'private',
    summary: 'Executive dashboards, interactive filter hierarchies, and progressive disclosure designs for commercial leadership.',
    evidenceItems: [
      {
        title: 'Retention Command Centre Dashboard',
        type: 'Notion Document',
        url: 'https://janedoe.notion.site/retention-command-centre',
        detail: 'Interactive dashboard mockups with user stories and KPI hierarchy.',
      },
    ],
    strengthenAction: 'Complete the verified Tableau Assessment or submit a peer-reviewed workbook to upgrade to "Reviewed" status.',
    whatEmployersSee: 'Marked as Self-Reported. Only visible to employers once upgraded or explicitly shared.',
  },
];
