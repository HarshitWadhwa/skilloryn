export interface RoadmapNode {
  id: number;
  title: string;
  category: string;
  whyItMatters: string;
  estimatedTime: string;
  learningResource: {
    title: string;
    provider: string;
    url: string;
    format: 'Interactive Lab' | 'Video Course' | 'Documentation Guide' | 'Project Brief';
  };
  practicalTask: string;
  expectedEvidence: string;
  state: 'completed' | 'active' | 'locked';
  dependencies: number[];
  unlockedAction: string;
  score?: string;
}

export const INITIAL_ROADMAP: RoadmapNode[] = [
  {
    id: 1,
    title: 'SQL Fundamentals & Multi-table Joins',
    category: 'Foundations',
    whyItMatters: 'Top-tier analytical roles require querying normalized relational schemas without creating accidental Cartesian products.',
    estimatedTime: '6 hours',
    learningResource: {
      title: 'PostgreSQL Relational Joins & Set Operations',
      provider: 'Official PostgreSQL Documentation & Lab',
      url: 'https://www.postgresql.org/docs/current/tutorial-join.html',
      format: 'Interactive Lab',
    },
    practicalTask: 'Write multi-table joins across orders, order_items, customers, and refund tables with index considerations.',
    expectedEvidence: 'Clean SQL queries with execution plans demonstrating zero sequential full-table scans.',
    state: 'completed',
    dependencies: [],
    unlockedAction: 'Master Window Functions (Unlocked)',
    score: '92/100 Verified',
  },
  {
    id: 2,
    title: 'Master Window Functions (PARTITION BY & Ranking)',
    category: 'Core Analysis',
    whyItMatters: 'Window functions are requested in 88% of mid-to-senior Data Analyst job descriptions. This is your primary priority gap.',
    estimatedTime: '8 hours',
    learningResource: {
      title: 'Advanced Window Functions & Frame Specifications',
      provider: 'Mode Analytics SQL Tutorial',
      url: 'https://mode.com/sql-tutorial/sql-window-functions/',
      format: 'Documentation Guide',
    },
    practicalTask: 'Calculate 7-day rolling active user averages, customer churn intervals, and percentile rankings across customer tiers.',
    expectedEvidence: 'Verifiable cohort retention SQL script with execution time benchmarked under 20ms.',
    state: 'active',
    dependencies: [1],
    unlockedAction: 'Python Pandas Data Manipulation Pipeline',
  },
  {
    id: 3,
    title: 'Python Pandas Data Manipulation & Cleaning',
    category: 'Data Wrangling',
    whyItMatters: 'Allows transforming messy real-world datasets into structured DataFrames ready for modeling and anomaly detection.',
    estimatedTime: '10 hours',
    learningResource: {
      title: 'Pandas 2.0 High-Performance Workflows',
      provider: 'Python Software Foundation',
      url: 'https://pandas.pydata.org/docs/user_guide/index.html',
      format: 'Documentation Guide',
    },
    practicalTask: 'Clean and impute missing values across 100k ecommerce transactions, vectorizing operations instead of using slow Python loops.',
    expectedEvidence: 'Jupyter notebook with automated data validation checks and unit assertions.',
    state: 'active',
    dependencies: [1],
    unlockedAction: 'Exploratory Data Analysis & Statistical Modeling',
  },
  {
    id: 4,
    title: 'Exploratory Data Analysis (EDA) & Anomaly Detection',
    category: 'Exploration',
    whyItMatters: 'Employers want analysts who find hidden signals, identify outlier fraud, and frame measurable hypotheses before modeling.',
    estimatedTime: '6 hours',
    learningResource: {
      title: 'Statistical EDA & Distribution Profiling',
      provider: 'OpenIntro Statistics Lab',
      url: 'https://www.openintro.org/book/os/',
      format: 'Project Brief',
    },
    practicalTask: 'Perform multivariate distribution analysis and detect transaction anomalies using IQR and Z-scores.',
    expectedEvidence: 'EDA memo with annotated distribution plots and hypothesis log.',
    state: 'locked',
    dependencies: [3],
    unlockedAction: 'Statistics & A/B Experimentation Design',
  },
  {
    id: 5,
    title: 'A/B Testing & Statistical Experimentation',
    category: 'Causal Inference',
    whyItMatters: 'Translates raw correlation into causal proof for product managers and commercial executives.',
    estimatedTime: '12 hours',
    learningResource: {
      title: 'Designing Controlled Experiments in Production',
      provider: 'Harvard Data Science Open Courseware',
      url: 'https://pll.harvard.edu/',
      format: 'Interactive Lab',
    },
    practicalTask: 'Pre-register an A/B pricing test, calculate minimum detectable effect (MDE), and evaluate p-values with confidence bounds.',
    expectedEvidence: 'Executive experiment readout memo with statistical significance breakdown and downside risk evaluation.',
    state: 'locked',
    dependencies: [4],
    unlockedAction: 'Tableau Executive Dashboards & Storytelling',
  },
  {
    id: 6,
    title: 'Tableau Executive Storytelling & Decision Dashboards',
    category: 'Visual Analytics',
    whyItMatters: 'Data has zero business value if decision-makers cannot immediately extract actionable conclusions.',
    estimatedTime: '8 hours',
    learningResource: {
      title: 'Visual Information Hierarchy & Progressive Disclosure',
      provider: 'Tableau Public Knowledge Base',
      url: 'https://public.tableau.com/en-us/s/resources',
      format: 'Project Brief',
    },
    practicalTask: 'Build a three-tier retention cockpit: executive KPI card layer, cohort drill-down layer, and individual account risk list.',
    expectedEvidence: 'Published Tableau workbook with interactive parameter controls and documentation.',
    state: 'locked',
    dependencies: [2, 5],
    unlockedAction: 'End-to-End Capstone Portfolio Publication',
  },
  {
    id: 7,
    title: 'End-to-End Evidence Portfolio Capstone',
    category: 'Capstone Evidence',
    whyItMatters: 'Consolidates all verified skills into an employer-facing artifact matching top 10% data analyst requirements.',
    estimatedTime: '16 hours',
    learningResource: {
      title: 'Skilloryn Evidence Ledger Capstone Guidelines',
      provider: 'Skilloryn Academic Board',
      url: 'https://skilloryn.io/guidelines/capstone',
      format: 'Project Brief',
    },
    practicalTask: 'Integrate SQL cohort ETL, Python ML prediction, and executive visualization into a single reproducible package.',
    expectedEvidence: 'Publicly verifiable Skilloryn Passport with verified diagnostic seals and employer-ready project links.',
    state: 'locked',
    dependencies: [6],
    unlockedAction: 'Employer Application Readiness & Direct Match',
  },
];
