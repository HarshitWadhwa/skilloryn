export interface CohortItem {
  id: string;
  name: string;
  department: string;
  totalStudents: number;
  readinessRate: number; // e.g. 84%
  diagnosticCompletionRate: number; // e.g. 91%
  topSkillGap: string;
  priorityIntervention: string;
  averageEvidencePoints: number;
}

export interface SkillGapTrend {
  skillId: string;
  skillName: string;
  studentsAffectedCount: number;
  percentageAffected: number;
  severity: 'High' | 'Medium' | 'Low';
  employerDemandIndex: number; // 1-100
  recommendedAction: string;
}

export interface DeployedIntervention {
  id: string;
  title: string;
  targetCohortId: string;
  targetCohortName: string;
  enrolledStudentsCount: number;
  status: 'In Progress' | 'Scheduled' | 'Completed';
  deadline: string;
  projectedReadinessUplift: number; // e.g. +14%
  completionRate: number; // e.g. 68%
}

export const INITIAL_COHORTS: CohortItem[] = [
  {
    id: 'cohort-2026-a',
    name: 'Cohort 2026-A (BSc Data Science & Analytics)',
    department: 'Department of Computer Science',
    totalStudents: 48,
    readinessRate: 84,
    diagnosticCompletionRate: 92,
    topSkillGap: 'Advanced Window Functions & CTE Framing (42% gap)',
    priorityIntervention: 'SQL Window Functions & Cohort Diagnostic Lab',
    averageEvidencePoints: 1180,
  },
  {
    id: 'cohort-2026-b',
    name: 'Cohort 2026-B (MSc Business Intelligence & Analytics)',
    department: 'School of Management',
    totalStudents: 36,
    readinessRate: 76,
    diagnosticCompletionRate: 85,
    topSkillGap: 'Causal Inference & A/B Pre-registration (38% gap)',
    priorityIntervention: 'A/B Testing Hypothesis Pre-Registration Sprint',
    averageEvidencePoints: 940,
  },
  {
    id: 'cohort-2025-c',
    name: 'Cohort 2025-C (Applied Statistics Diploma)',
    department: 'Department of Mathematical Sciences',
    totalStudents: 62,
    readinessRate: 91,
    diagnosticCompletionRate: 96,
    topSkillGap: 'Executive Dashboard Storytelling (24% gap)',
    priorityIntervention: 'Tableau Visual Information Architecture Masterclass',
    averageEvidencePoints: 1420,
  },
];

export const INITIAL_SKILL_GAPS: SkillGapTrend[] = [
  {
    skillId: 'sql-windowing',
    skillName: 'Advanced SQL: Window Functions & Analytical Framing',
    studentsAffectedCount: 38,
    percentageAffected: 42,
    severity: 'High',
    employerDemandIndex: 94,
    recommendedAction: 'Deploy interactive PostgreSQL Window Framing workshop across Cohort 2026-A.',
  },
  {
    skillId: 'ab-testing-causal',
    skillName: 'Causal Inference & A/B Test Pre-registration',
    studentsAffectedCount: 29,
    percentageAffected: 32,
    severity: 'High',
    employerDemandIndex: 88,
    recommendedAction: 'Schedule practical hypothesis design case study with industry mentor review.',
  },
  {
    skillId: 'data-pipeline-testing',
    skillName: 'Automated Python Pipeline Testing (PyTest & Assertions)',
    studentsAffectedCount: 22,
    percentageAffected: 24,
    severity: 'Medium',
    employerDemandIndex: 78,
    recommendedAction: 'Integrate automated test assertions into midterm lab submissions.',
  },
];

export const INITIAL_INTERVENTIONS: DeployedIntervention[] = [
  {
    id: 'interv-1',
    title: 'SQL Window Functions & CTE Analytical Workshop',
    targetCohortId: 'cohort-2026-a',
    targetCohortName: 'Cohort 2026-A (BSc Data Science)',
    enrolledStudentsCount: 48,
    status: 'In Progress',
    deadline: 'Sep 15, 2026',
    projectedReadinessUplift: 14,
    completionRate: 68,
  },
  {
    id: 'interv-2',
    title: 'A/B Testing Hypothesis Pre-Registration Sprint',
    targetCohortId: 'cohort-2026-b',
    targetCohortName: 'Cohort 2026-B (MSc BI)',
    enrolledStudentsCount: 36,
    status: 'Scheduled',
    deadline: 'Sep 22, 2026',
    projectedReadinessUplift: 12,
    completionRate: 15,
  },
];
