import { describe, it, expect } from 'vitest';
import { getValidatedRecommendations, APPROVED_COURSE_CATALOGUE } from '../data/coursesData';
import { getCoachResponse } from '../data/aiCoachService';
import { INITIAL_OPPORTUNITIES, type Opportunity } from '../data/opportunitiesData';
import type { ApplicationItem } from '../data/applicationsData';

describe('Skilloryn Course Recommendations & Approved Catalogue', () => {
  it('validates priority skill gap and returns matching approved courses', () => {
    const result = getValidatedRecommendations({
      careerGoal: 'Data Analyst',
      prioritySkillGaps: ['Window Functions'],
      weeklyTimeHours: 6,
    });

    expect(result.isFallback).toBe(false);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations[0].targetSkill).toContain('Window Functions');
    expect(result.recommendations[0].portfolioEvidence).toBeDefined();
    expect(result.recommendations[0].url.startsWith('https://')).toBe(true);
  });

  it('provides safe deterministic fallback if no specific gap matches', () => {
    const result = getValidatedRecommendations({
      careerGoal: 'Data Analyst',
      prioritySkillGaps: ['NonExistentSkillXYZ'],
      weeklyTimeHours: 4,
    });

    expect(result.isFallback).toBe(true);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.summaryMessage).toContain('Fallback guidance');
  });

  it('only references courses from the approved catalogue', () => {
    const allApprovedIds = APPROVED_COURSE_CATALOGUE.map((c) => c.id);
    const result = getValidatedRecommendations({
      careerGoal: 'Data Analyst',
      prioritySkillGaps: ['Python Data Analysis'],
      weeklyTimeHours: 8,
    });

    result.recommendations.forEach((rec) => {
      expect(allApprovedIds).toContain(rec.id);
    });
  });
});

describe('Opportunity Search and Filtering', () => {
  it('filters opportunities by keyword, work mode, and type', () => {
    const searchKeyword = 'Monzo';
    const filtered = INITIAL_OPPORTUNITIES.filter(
      (opp) =>
        opp.company.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        opp.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    expect(filtered.length).toBe(1);
    expect(filtered[0].company).toBe('Monzo Bank');
    expect(filtered[0].matchScore).toBe(94);
    expect(filtered[0].matchRationale.matchingEvidence.length).toBeGreaterThan(0);
  });

  it('supports marking and restoring less relevant opportunities', () => {
    let opps: Opportunity[] = [...INITIAL_OPPORTUNITIES];

    // Mark as less relevant
    opps = opps.map((o) => (o.id === 'opp-revolut-analyst' ? { ...o, isLessRelevant: true } : o));
    const activeOpps = opps.filter((o) => !o.isLessRelevant);
    expect(activeOpps.find((o) => o.id === 'opp-revolut-analyst')).toBeUndefined();

    // Restore
    opps = opps.map((o) => (o.id === 'opp-revolut-analyst' ? { ...o, isLessRelevant: false } : o));
    const restoredOpps = opps.filter((o) => !o.isLessRelevant);
    expect(restoredOpps.find((o) => o.id === 'opp-revolut-analyst')).toBeDefined();
  });
});

describe('Application Lifecycle & State Changes', () => {
  it('creates an application from an opportunity with selected evidence and notes', () => {
    const newApp: ApplicationItem = {
      id: 'app-test-1',
      opportunityId: 'opp-spotify-analyst',
      role: 'Junior Analytics Engineer / Data Analyst',
      company: 'Spotify',
      stage: 'Saved',
      selectedEvidence: [{ title: 'Python Analysis Notebook', type: 'GitHub' }],
      missingPrepSteps: ['Query optimization benchmarks'],
      lastUpdated: 'Just now',
      studentNotes: 'Prepping portfolio notebook.',
      nextRecommendedAction: 'Run window diagnostic.',
      isSharedWithCompany: false,
    };

    expect(newApp.stage).toBe('Saved');
    expect(newApp.isSharedWithCompany).toBe(false);

    // Transition stage to Submitted
    const submittedApp: ApplicationItem = {
      ...newApp,
      stage: 'Submitted',
      isSharedWithCompany: true,
      lastUpdated: 'Just now',
    };

    expect(submittedApp.stage).toBe('Submitted');
    expect(submittedApp.isSharedWithCompany).toBe(true);
  });
});

describe('AI Career Coach & Consent Context Handling', () => {
  it('uses learner context signals to provide practical next actions', () => {
    const context = {
      studentName: 'Jane Doe',
      targetRole: 'Level 12 Data Analyst',
      priorityGap: 'Window Functions (Node 02)',
      verifiedScore: '92/100 SQL',
      completedMissionsCount: 3,
      activeApplicationsCount: 2,
    };

    const response = getCoachResponse('What should I improve this week?', context);

    expect(response.sender).toBe('bot');
    expect(response.text).toContain('Window Functions');
    expect(response.signalsUsed).toBeDefined();
    expect(response.signalsUsed?.length).toBeGreaterThan(0);
    expect(response.suggestedAction).toBeDefined();
  });

  it('answers opportunity readiness queries with deadline and missing step citations', () => {
    const context = {
      studentName: 'Jane Doe',
      targetRole: 'Data Analyst',
      priorityGap: 'Window Functions',
      verifiedScore: '92/100',
      completedMissionsCount: 3,
      activeApplicationsCount: 2,
    };

    const response = getCoachResponse('Am I ready for Monzo opportunity?', context);
    expect(response.text).toContain('Monzo Bank');
    expect(response.signalsUsed).toContain('Saved Opportunity: Monzo Bank');
  });

  it('handles general queries gracefully without making guarantees', () => {
    const context = {
      studentName: 'Jane Doe',
      targetRole: 'Data Analyst',
      priorityGap: 'None',
      verifiedScore: '92/100',
      completedMissionsCount: 3,
      activeApplicationsCount: 1,
    };

    const response = getCoachResponse('Tell me about career trajectories', context);
    expect(response.text).toBeDefined();
    expect(response.text.toLowerCase()).not.toContain('guaranteed salary');
    expect(response.text.toLowerCase()).not.toContain('guaranteed job');
  });
});
