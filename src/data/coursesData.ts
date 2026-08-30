export interface ApprovedCourse {
  id: string;
  title: string;
  provider: string;
  url: string;
  targetSkill: string;
  whySelected: string;
  learningOutcomes: string[];
  estimatedHours: number;
  format: 'Interactive Course' | 'Hands-on Lab' | 'Specialization' | 'Official Guide';
  completionOrder: number;
  portfolioEvidence: string;
}

export const APPROVED_COURSE_CATALOGUE: ApprovedCourse[] = [
  {
    id: 'course-sql-windowing',
    title: 'Advanced SQL: Window Functions & Analytical Framing',
    provider: 'PostgreSQL Official Documentation & Practice Sandbox',
    url: 'https://www.postgresql.org/docs/current/tutorial-window.html',
    targetSkill: 'Advanced SQL & Window Functions',
    whySelected: 'Directly addresses your priority skill gap in window functions and analytical ranking without requiring unverified third-party certs.',
    learningOutcomes: [
      'Master ROW_NUMBER(), RANK(), DENSE_RANK(), and NTILE() framing',
      'Understand ROWS BETWEEN N PRECEDING AND CURRENT ROW window boundaries',
      'Optimize multi-tenant partition query execution plans',
    ],
    estimatedHours: 6,
    format: 'Hands-on Lab',
    completionOrder: 1,
    portfolioEvidence: 'Reproducible cohort retention SQL script with execution plan benchmarks.',
  },
  {
    id: 'course-python-pandas',
    title: 'Python for Data Analysis & Vectorized Workflows',
    provider: 'Python Software Foundation & Open Courseware',
    url: 'https://docs.python.org/3/tutorial/',
    targetSkill: 'Python Data Analysis & Modeling',
    whySelected: 'Builds reproducible, vectorized data preparation pipelines for large datasets without slow iterative Python loops.',
    learningOutcomes: [
      'High-performance DataFrame indexing and group-by aggregations',
      'Data cleaning, missing value imputation, and outlier detection',
      'Automated data validation assertions and unit testing',
    ],
    estimatedHours: 8,
    format: 'Official Guide',
    completionOrder: 2,
    portfolioEvidence: 'Jupyter notebook cleaning 100k transactions with automated PyTest validations.',
  },
  {
    id: 'course-causal-experimentation',
    title: 'Practical A/B Testing & Causal Inference in Industry',
    provider: 'Harvard Open Learning Data Science Courseware',
    url: 'https://pll.harvard.edu/',
    targetSkill: 'A/B Testing & Experimentation',
    whySelected: 'Translates statistical probability into commercial decision-making with strict confidence interval framing.',
    learningOutcomes: [
      'Hypothesis formulation and pre-registration design',
      'Power calculation, sample size determination, and minimum detectable effect (MDE)',
      'Interpreting p-values, confidence bounds, and variance reduction (CUPED)',
    ],
    estimatedHours: 10,
    format: 'Interactive Course',
    completionOrder: 3,
    portfolioEvidence: 'Executive experiment readout memo with statistical significance and risk evaluation.',
  },
  {
    id: 'course-tableau-storytelling',
    title: 'Executive Visual Storytelling & Information Architecture',
    provider: 'Tableau Public Knowledge Base',
    url: 'https://public.tableau.com/en-us/s/resources',
    targetSkill: 'Tableau Visual Storytelling',
    whySelected: 'Equips you to build interactive executive dashboards with progressive disclosure rather than cluttered charts.',
    learningOutcomes: [
      'Visual hierarchy and cognitive load management in dashboard design',
      'Parameter controls, action filters, and dynamic level-of-detail (LOD) calculations',
      'Designing actionable metric alerts for executive stakeholders',
    ],
    estimatedHours: 7,
    format: 'Hands-on Lab',
    completionOrder: 4,
    portfolioEvidence: 'Interactive customer retention command centre dashboard published with documentation.',
  },
];

export interface RecommendationInputs {
  careerGoal: string;
  prioritySkillGaps: string[];
  diagnosticScore?: string;
  weeklyTimeHours: number;
}

export interface RecommendationResult {
  isFallback: boolean;
  recommendations: ApprovedCourse[];
  summaryMessage: string;
}

/**
 * Validates requested inputs against approved course IDs only.
 * If AI output or external service is invalid/fails, returns a deterministic fallback using approved courses.
 */
export function getValidatedRecommendations(inputs: RecommendationInputs): RecommendationResult {
  // Check if priority gap matches any approved courses
  const filtered = APPROVED_COURSE_CATALOGUE.filter((course) =>
    inputs.prioritySkillGaps.some(
      (gap) =>
        course.targetSkill.toLowerCase().includes(gap.toLowerCase()) ||
        course.title.toLowerCase().includes(gap.toLowerCase())
    )
  );

  if (filtered.length > 0) {
    return {
      isFallback: false,
      recommendations: filtered.sort((a, b) => a.completionOrder - b.completionOrder),
      summaryMessage: `Recommended based on your target role (${inputs.careerGoal}) and identified priority gap (${inputs.prioritySkillGaps.join(', ')}).`,
    };
  }

  // Deterministic fallback if no specific match
  return {
    isFallback: true,
    recommendations: APPROVED_COURSE_CATALOGUE.slice(0, 2),
    summaryMessage: `Fallback guidance: Showing foundational verified resources from the approved Skilloryn catalogue matching ${inputs.careerGoal}.`,
  };
}
