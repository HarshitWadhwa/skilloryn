export interface CoachMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  signalsUsed?: string[];
  suggestedAction?: {
    label: string;
    actionType: 'navigate' | 'diagnostic' | 'resource';
    payload: string;
  };
}

export const PRESET_PROMPTS = [
  'What should I improve this week?',
  'Which course should I start first?',
  'How can I strengthen this project evidence?',
  'Am I ready for this opportunity?',
  'Help me prepare for an interview.',
] as const;

export function getCoachResponse(
  query: string,
  context: {
    studentName: string;
    targetRole: string;
    priorityGap: string;
    verifiedScore: string;
    completedMissionsCount: number;
    activeApplicationsCount: number;
  }
): CoachMessage {
  const normalized = query.toLowerCase();

  if (normalized.includes('improve') || normalized.includes('this week') || normalized.includes('gap')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `Based on your target role (${context.targetRole}) and your current progress, your highest-leverage improvement this week is **${context.priorityGap}**.\n\n` +
        `• You currently have **${context.verifiedScore}** in foundational SQL.\n` +
        `• Top employer openings (like Monzo Bank & Spotify) specifically filter for analytical windowing.\n\n` +
        `**Next immediate action:** Complete the interactive Window Functions diagnostic module (Node 02 in your Roadmap) to unlock a 98% match.`,
      timestamp: 'Just now',
      signalsUsed: ['Target Role: Data Analyst', 'Priority Gap: Window Functions', 'Employer Filtering Signals'],
      suggestedAction: {
        label: 'Open Learning Roadmap (Node 02)',
        actionType: 'navigate',
        payload: 'roadmap',
      },
    };
  }

  if (normalized.includes('course') || normalized.includes('start first') || normalized.includes('learn')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `From the approved Skilloryn catalogue, you should start with **"Advanced SQL: Window Functions & Analytical Framing"** (PostgreSQL Official Practice Sandbox).\n\n` +
        `• **Estimated time:** 6 hours\n` +
        `• **What you will learn:** \`ROW_NUMBER()\`, \`RANK()\`, \`DENSE_RANK()\`, and \`ROWS BETWEEN\` frame specifications.\n` +
        `• **Evidence Output:** A reproducible customer retention cohort query that you can attach directly to your Skill Passport.`,
      timestamp: 'Just now',
      signalsUsed: ['Approved Course Catalogue', 'Diagnostic Gaps', 'Estimated Completion Time'],
      suggestedAction: {
        label: 'View Approved Course Resource',
        actionType: 'resource',
        payload: 'https://www.postgresql.org/docs/current/tutorial-window.html',
      },
    };
  }

  if (normalized.includes('strengthen') || normalized.includes('evidence') || normalized.includes('project')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `To elevate your **Ecommerce Customer Churn Model** from "Reviewed" to "Employer-Validated":\n\n` +
        `1. **Add Execution Benchmarks:** Document query latency before and after index optimization in your repository README.\n` +
        `2. **Include Confidence Bounds:** Show the precision-recall trade-offs and business cost of false negatives (lost customer vs marketing budget).\n` +
        `3. **Attach Unit Tests:** Add 2-3 automated data assertion tests in Python (PyTest).`,
      timestamp: 'Just now',
      signalsUsed: ['Current Evidence: Churn Model Repo', 'Employer Review Rubric', 'Recruiter Feedback History'],
      suggestedAction: {
        label: 'View Skill Passport Evidence',
        actionType: 'navigate',
        payload: 'passport',
      },
    };
  }

  if (normalized.includes('ready') || normalized.includes('opportunity') || normalized.includes('monzo')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `You have a **94% match** for the **Product Data Analyst role at Monzo Bank**.\n\n` +
        `• **What is ready:** Your verified SQL foundation (92/100) and pricing experiment decision memo.\n` +
        `• **What is missing:** Complete Node 02 in your roadmap to verify window functions framing before the Sep 12 deadline.\n\n` +
        `You have 12 days left. Preparing now gives you an advantage in the candidate pipeline.`,
      timestamp: 'Just now',
      signalsUsed: ['Saved Opportunity: Monzo Bank', 'Match Rationale Matrix', 'Deadline: Sep 12'],
      suggestedAction: {
        label: 'Review Monzo Application Package',
        actionType: 'navigate',
        payload: 'applications',
      },
    };
  }

  if (normalized.includes('interview') || normalized.includes('prepare')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `Let's prepare for your upcoming case walkthrough!\n\n` +
        `**Key Interview Theme:** Explaining evidence and trade-offs rather than reciting textbook definitions.\n\n` +
        `**Practice Prompt:** *"Walk me through a time your analysis contradicted stakeholder intuition."*\n` +
        `• Use your **Pricing Experiment Memo** as the anchor.\n` +
        `• Explain why 7% was recommended instead of 12% by citing confidence intervals and customer churn downside risk.`,
      timestamp: 'Just now',
      signalsUsed: ['Submitted Applications', 'Project Evidence: Pricing Memo', 'Interview Rubric'],
    };
  }

  // General query fallback
  return {
    id: `bot-${Date.now()}`,
    sender: 'bot',
    text: `Great question regarding "${query}". For your **${context.targetRole}** journey, focusing on verifiable project evidence and diagnostic check-ins will give you the strongest signal for employer matching.\n\n` +
      `Is there a specific roadmap node, opportunity, or evidence artifact you would like help with?`,
    timestamp: 'Just now',
    signalsUsed: ['General Learner Context', 'Advisory Guidance Disclosure'],
  };
}
