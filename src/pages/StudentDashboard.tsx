import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Award, Compass, Briefcase, FileText,
  Bot, MessageSquare, Shield, Flame, Zap,
  ChevronRight, ArrowRight, ArrowLeft, Search,
  Sparkles, ExternalLink, Download, Check, X,
  Edit3, Send, Play, RefreshCw, Bookmark, BookmarkCheck,
  Menu
} from 'lucide-react';
import institutionLogo from '../assets/institution-logo-theme.png';
import { INITIAL_SKILLS, type VerifiableSkill } from '../data/skillsData';
import { INITIAL_ROADMAP, type RoadmapNode } from '../data/roadmapData';
import { getValidatedRecommendations } from '../data/coursesData';
import { INITIAL_OPPORTUNITIES, type Opportunity } from '../data/opportunitiesData';
import { INITIAL_APPLICATIONS, type ApplicationItem, type ApplicationStage } from '../data/applicationsData';
import { type CoachMessage, PRESET_PROMPTS, getCoachResponse } from '../data/aiCoachService';

type StudentTab =
  | 'overview'
  | 'passport'
  | 'roadmap'
  | 'opportunities'
  | 'applications'
  | 'coach'
  | 'messages'
  | 'profile';

export default function StudentDashboard() {
  const navigate = useNavigate();

  // Navigation State
  const [activeTab, setActiveTab] = useState<StudentTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Persistent Gamification & Progress State
  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('skilloryn_student_points');
    return saved ? parseInt(saved, 10) : 1240;
  });
  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('skilloryn_student_streak');
    return saved ? parseInt(saved, 10) : 12;
  });
  const [checkedInToday, setCheckedInToday] = useState<boolean>(() => {
    return localStorage.getItem('skilloryn_checked_in') === 'true';
  });

  // Data States with LocalStorage Sync
  const [skills, setSkills] = useState<VerifiableSkill[]>(() => {
    const saved = localStorage.getItem('skilloryn_student_skills');
    return saved ? JSON.parse(saved) : INITIAL_SKILLS;
  });
  const [roadmap, setRoadmap] = useState<RoadmapNode[]>(() => {
    const saved = localStorage.getItem('skilloryn_student_roadmap');
    return saved ? JSON.parse(saved) : INITIAL_ROADMAP;
  });
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem('skilloryn_student_opps');
    return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
  });
  const [applications, setApplications] = useState<ApplicationItem[]>(() => {
    const saved = localStorage.getItem('skilloryn_student_apps');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  // AI Career Coach State
  const [coachMessages, setCoachMessages] = useState<CoachMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hi Jane! 👋 I am your context-aware **AI Career Coach**.\n\nI have analyzed your **Data Analyst** roadmap. Your highest-leverage next action is **Window Functions (Node 02)**.\n\nHow can I help guide your progress today?',
      timestamp: 'Today at 09:00',
      signalsUsed: ['Target Role: Data Analyst', 'Priority Gap: Window Functions', 'Diagnostic Baseline: 92/100 SQL'],
    },
  ]);
  const [coachInput, setCoachInput] = useState('');
  const [isCoachThinking, setIsCoachThinking] = useState(false);

  // Recruiter Chat State
  const [recruiterChat, setRecruiterChat] = useState<{ id: string; sender: 'recruiter' | 'student'; text: string; time: string }[]>([
    { id: '1', sender: 'recruiter', text: 'Hi Jane, we reviewed your verified SQL diagnostic score and Customer Retention repository for the Product Data Analyst role at Monzo. Impressive execution plans!', time: 'Yesterday at 15:30' },
    { id: '2', sender: 'student', text: 'Thank you! The cohort query optimization reduced sequential table scans by 34%. Happy to walk through the reproducible notebooks.', time: 'Yesterday at 16:15' },
    { id: '3', sender: 'recruiter', text: 'Would you be available for a 30-minute technical discussion next Tuesday?', time: 'Today at 10:20' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Opportunities Search & Filter State
  const [oppSearch, setOppSearch] = useState('');
  const [oppModeFilter, setOppModeFilter] = useState<'All' | 'Remote' | 'Hybrid' | 'On-site'>('All');
  const [oppTypeFilter, setOppTypeFilter] = useState<'All' | 'Full-time' | 'Internship'>('All');
  const [showHiddenOpps, setShowHiddenOpps] = useState(false);

  // Applications Filter State
  const [appStageFilter, setAppStageFilter] = useState<string>('All');
  const [editingNoteAppId, setEditingNoteAppId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  // Diagnostic Quiz Modal State
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    localStorage.setItem('skilloryn_student_points', points.toString());
  }, [points]);
  useEffect(() => {
    localStorage.setItem('skilloryn_student_streak', streak.toString());
  }, [streak]);
  useEffect(() => {
    localStorage.setItem('skilloryn_student_skills', JSON.stringify(skills));
  }, [skills]);
  useEffect(() => {
    localStorage.setItem('skilloryn_student_roadmap', JSON.stringify(roadmap));
  }, [roadmap]);
  useEffect(() => {
    localStorage.setItem('skilloryn_student_opps', JSON.stringify(opportunities));
  }, [opportunities]);
  useEffect(() => {
    localStorage.setItem('skilloryn_student_apps', JSON.stringify(applications));
  }, [applications]);

  const handleDailyCheckIn = () => {
    if (!checkedInToday) {
      setCheckedInToday(true);
      setPoints((prev) => prev + 15);
      setStreak((prev) => prev + 1);
      localStorage.setItem('skilloryn_checked_in', 'true');
    }
  };

  const quizQuestions = [
    {
      question: 'Which SQL window function assigns a unique continuous integer to each row in a partition without duplicate values?',
      options: ['ROW_NUMBER()', 'RANK()', 'DENSE_RANK()', 'NTILE(4)'],
      correct: 0,
      explanation: 'ROW_NUMBER() always assigns a distinct integer sequence (1, 2, 3...) regardless of ties.',
    },
    {
      question: 'When computing a running 7-day average of active users, which frame specification clause is required?',
      options: [
        'ROWS BETWEEN 6 PRECEDING AND CURRENT ROW',
        'RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING',
        'ROWS BETWEEN CURRENT ROW AND 7 FOLLOWING',
        'PARTITION BY date ORDER BY count',
      ],
      correct: 0,
      explanation: 'ROWS BETWEEN 6 PRECEDING AND CURRENT ROW bounds the window to the current day plus the preceding 6 days (7 total days).',
    },
    {
      question: 'In statistical A/B testing, what is the primary purpose of pre-registering sample size and MDE before running treatment?',
      options: [
        'Prevent p-hacking and continuous peeking false positives',
        'Speed up database query execution times',
        'Guarantee a statistically significant outcome',
        'Bypass stakeholder approval requirements',
      ],
      correct: 0,
      explanation: 'Pre-registering MDE and sample size fixes statistical power and prevents stopping early when noise creates temporary false significance.',
    },
  ];

  const handleAnswerQuiz = (selectedOptionIndex: number) => {
    if (selectedOptionIndex === quizQuestions[currentQuestionIndex].correct) {
      setQuizScore((prev) => prev + 1);
    }
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      setPoints((prev) => prev + 100);
      setRoadmap((prev) =>
        prev.map((node) =>
          node.id === 2
            ? { ...node, state: 'completed', score: '96/100 Verified' }
            : node.id === 3
            ? { ...node, state: 'active' }
            : node
        )
      );
      setSkills((prev) =>
        prev.map((skill) =>
          skill.id === 'advanced-sql'
            ? { ...skill, score: '96/100', status: 'Employer-Validated', lastUpdated: 'Just now' }
            : skill
        )
      );
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
    setDiagnosticOpen(false);
  };

  const handleToggleSaveOpp = (id: string) => {
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === id ? { ...opp, saved: !opp.saved } : opp))
    );
  };

  const handleToggleLessRelevant = (id: string) => {
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === id ? { ...opp, isLessRelevant: !opp.isLessRelevant } : opp))
    );
  };

  const handlePrepareApplication = (opp: Opportunity) => {
    const existing = applications.find((a) => a.opportunityId === opp.id);
    if (!existing) {
      const newApp: ApplicationItem = {
        id: `app-${Date.now()}`,
        opportunityId: opp.id,
        role: opp.title,
        company: opp.company,
        stage: 'Saved',
        deadline: opp.deadline,
        selectedEvidence: [
          { title: 'Advanced SQL Diagnostic Result', type: 'Verified Assessment', verifiedScore: '92/100' },
          { title: 'Ecommerce Customer Retention Model', type: 'GitHub Repository', verifiedScore: 'Reviewed' },
        ],
        missingPrepSteps: [opp.matchRationale.gapToBridge],
        lastUpdated: 'Just now',
        studentNotes: `Prepared application for ${opp.company}. Target match score: ${opp.matchScore}%.`,
        nextRecommendedAction: opp.matchRationale.actionableStep,
        isSharedWithCompany: false,
      };
      setApplications([newApp, ...applications]);
    }
    setActiveTab('applications');
  };

  const handleUpdateAppStage = (appId: string, newStage: ApplicationStage) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              stage: newStage,
              lastUpdated: 'Just now',
              isSharedWithCompany: newStage === 'Submitted' || newStage === 'Interview or next step',
            }
          : app
      )
    );
  };

  const handleSaveAppNote = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, studentNotes: tempNote, lastUpdated: 'Just now' } : app))
    );
    setEditingNoteAppId(null);
  };

  const handleAskCoach = (promptText: string) => {
    const userMsg: CoachMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: 'Just now',
    };
    setCoachMessages((prev) => [...prev, userMsg]);
    setIsCoachThinking(true);

    setTimeout(() => {
      const reply = getCoachResponse(promptText, {
        studentName: 'Jane Doe',
        targetRole: 'Level 12 Data Analyst',
        priorityGap: 'Window Functions (Node 02)',
        verifiedScore: '92/100',
        completedMissionsCount: 3,
        activeApplicationsCount: applications.length,
      });
      setCoachMessages((prev) => [...prev, reply]);
      setIsCoachThinking(false);
    }, 600);
  };

  const handleSendCustomCoach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachInput.trim()) return;
    const q = coachInput;
    setCoachInput('');
    handleAskCoach(q);
  };

  const handleSendRecruiterMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = {
      id: `std-${Date.now()}`,
      sender: 'student' as const,
      text: chatInput,
      time: 'Just now',
    };
    setRecruiterChat((prev) => [...prev, msg]);
    setChatInput('');

    setTimeout(() => {
      setRecruiterChat((prev) => [
        ...prev,
        {
          id: `rec-${Date.now()}`,
          sender: 'recruiter',
          text: "Thanks Jane! I have shared your verified Skill Passport with the hiring manager. We'll send the calendar invite shortly.",
          time: 'Just now',
        },
      ]);
    }, 1200);
  };

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      if (!showHiddenOpps && opp.isLessRelevant) return false;
      if (showHiddenOpps && !opp.isLessRelevant) return false;

      const matchesSearch =
        opp.title.toLowerCase().includes(oppSearch.toLowerCase()) ||
        opp.company.toLowerCase().includes(oppSearch.toLowerCase()) ||
        opp.requiredSkills.some((s) => s.toLowerCase().includes(oppSearch.toLowerCase()));

      const matchesMode = oppModeFilter === 'All' || opp.workMode === oppModeFilter;
      const matchesType = oppTypeFilter === 'All' || opp.type === oppTypeFilter;

      return matchesSearch && matchesMode && matchesType;
    });
  }, [opportunities, oppSearch, oppModeFilter, oppTypeFilter, showHiddenOpps]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (appStageFilter === 'All') return true;
      return app.stage === appStageFilter;
    });
  }, [applications, appStageFilter]);

  const courseRecommendations = useMemo(() => {
    return getValidatedRecommendations({
      careerGoal: 'Data Analyst',
      prioritySkillGaps: ['Window Functions', 'Analytical Framing'],
      weeklyTimeHours: 8,
    });
  }, []);

  const navItems = [
    { id: 'overview' as StudentTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'passport' as StudentTab, label: 'Skill Passport', icon: Award },
    { id: 'roadmap' as StudentTab, label: 'Learning Roadmap', icon: Compass },
    { id: 'opportunities' as StudentTab, label: 'Opportunities', icon: Briefcase },
    { id: 'applications' as StudentTab, label: 'Applications', icon: FileText },
    { id: 'coach' as StudentTab, label: 'AI Coach', icon: Bot },
    { id: 'messages' as StudentTab, label: 'Messages', icon: MessageSquare },
    { id: 'profile' as StudentTab, label: 'Profile & Privacy', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex bg-paper text-ink font-sans relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-60" aria-hidden="true">
        <div className="theme-orb theme-orb-one" />
        <div className="theme-orb theme-orb-two" />
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 bg-navy border-r border-navy-line/80 hidden md:flex flex-col z-20 text-white shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-navy-line/60 justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/choose-workspace')}
            title="Switch Workspace"
          >
            <div className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center shadow-sm border border-copper-soft/30 overflow-hidden">
              <img src={institutionLogo} alt="Skilloryn" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <span className="font-bold text-lg text-cream tracking-tight block">Skilloryn</span>
              <span className="text-xs text-copper-soft font-medium block">Student Workspace</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-cream text-navy shadow-sm font-bold border border-copper-soft'
                    : 'text-sidebar-muted hover:bg-navy-soft hover:text-cream'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-copper' : 'text-sidebar-muted'}`} />
                <span>{item.label}</span>
                {item.id === 'applications' && applications.length > 0 && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-xs bg-copper/20 text-copper-soft font-bold">
                    {applications.length}
                  </span>
                )}
                {item.id === 'messages' && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-copper" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-5 border-t border-navy-line/60 space-y-2">
          <button
            onClick={() => navigate('/choose-workspace')}
            className="w-full flex items-center justify-between text-sidebar-muted hover:text-cream text-xs font-semibold p-2 rounded-xl hover:bg-navy-soft transition-colors"
          >
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-copper-soft" /> Switch Workspace
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <Link
            to="/sign-in"
            className="w-full flex items-center justify-between text-sidebar-muted hover:text-rose-300 text-xs font-semibold p-2 rounded-xl hover:bg-navy-soft transition-colors"
          >
            <span>Sign Out</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Top Header Bar */}
        <header className="h-20 bg-surface/90 backdrop-blur-md border-b border-line flex items-center justify-between px-6 sm:px-8 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-surface border border-line text-navy"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-bold text-base text-navy">Skilloryn</span>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <h1 className="text-xl font-bold text-navy capitalize">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cream text-copper-strong border border-copper-soft/60">
              Data Analyst Pathway
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-5 text-sm font-semibold">
              <div className="flex items-center gap-1.5" title="Daily Streak">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="font-bold text-navy">{streak} <span className="text-muted font-normal">Days</span></span>
              </div>
              <div className="flex items-center gap-1.5" title="Evidence Points">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-navy">{points} <span className="text-muted font-normal">EP</span></span>
              </div>
            </div>

            <div className="h-6 w-px bg-line hidden sm:block" />

            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-sm font-bold text-navy">Jane Doe</p>
                <p className="text-xs text-muted">Level 12 Candidate</p>
              </div>
              <div className="w-9 h-9 rounded-2xl bg-navy text-cream flex items-center justify-center font-bold text-xs shadow-xs border border-copper-soft/30">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-navy text-white border-b border-navy-line p-4 space-y-1.5 z-30 shadow-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive ? 'bg-cream text-navy font-bold' : 'text-sidebar-muted hover:bg-navy-soft'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
          <div className="max-w-5xl mx-auto space-y-8">

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* 1. Today's Priority Action Banner */}
                <div className="bg-navy text-cream rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-navy border border-navy-line/60">
                  <div className="relative z-10 space-y-6 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-cream text-xs font-semibold border border-white/15">
                      <Sparkles className="w-3.5 h-3.5 text-copper-soft" /> Priority Focus for Today
                    </div>
                    <div>
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-cream leading-tight">
                        Master Window Functions (Node 02)
                      </h2>
                      <p className="text-base text-ice/90 mt-3 leading-relaxed">
                        Window functions are required in <strong>88% of data analyst openings</strong>. Completing this quick diagnostic verifies your analytical framing and raises your Monzo application match to <strong>98%</strong>.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <button
                        onClick={() => setDiagnosticOpen(true)}
                        className="px-7 py-3.5 rounded-2xl bg-copper hover:bg-copper-strong text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
                      >
                        <Play className="w-4 h-4 fill-current" /> Start 2-Min Diagnostic (+100 EP)
                      </button>
                      <button
                        onClick={handleDailyCheckIn}
                        disabled={checkedInToday}
                        className={`px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all flex items-center gap-2 ${
                          checkedInToday
                            ? 'bg-green-500/20 text-green-300 border-green-500/40 cursor-default'
                            : 'bg-white/10 hover:bg-white/20 text-cream border-white/20'
                        }`}
                      >
                        {checkedInToday ? (
                          <><Check className="w-4 h-4" /> Checked In Today</>
                        ) : (
                          <><Zap className="w-4 h-4 text-amber-400" /> Daily Check-In (+15 EP)</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Key Pillars Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Pathway & Gaps */}
                  <div className="bg-surface rounded-3xl p-7 border border-line shadow-card space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-navy">Priority Skill Gaps</h3>
                      <span className="text-xs font-semibold text-muted">Data Analyst Pathway</span>
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-cream border border-copper-soft/60">
                        <div className="flex items-center justify-between text-sm font-bold text-navy">
                          <span>Window Functions Framing</span>
                          <span className="text-copper">Priority Gap</span>
                        </div>
                        <p className="text-xs text-muted mt-1">Node 02 in Learning Roadmap</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-paper border border-line">
                        <div className="flex items-center justify-between text-sm font-bold text-navy">
                          <span>Python Vectorized Pipelines</span>
                          <span className="text-green-700 font-semibold">Active Node</span>
                        </div>
                        <p className="text-xs text-muted mt-1">Node 03 in Learning Roadmap</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('roadmap')}
                      className="w-full py-2.5 rounded-xl text-sm font-bold text-navy hover:text-copper border border-line transition-colors flex items-center justify-center gap-1.5"
                    >
                      Explore Learning Roadmap <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Verified Evidence Summary */}
                  <div className="bg-surface rounded-3xl p-7 border border-line shadow-card space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-navy">Verified Evidence Signals</h3>
                      <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                        3 Verified
                      </span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-paper border border-line">
                        <span className="font-semibold text-navy">Advanced SQL Diagnostic</span>
                        <span className="font-mono font-bold text-green-700">92/100 · Verified</span>
                      </div>
                      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-paper border border-line">
                        <span className="font-semibold text-navy">Customer Churn Model</span>
                        <span className="font-mono font-bold text-cyan-800">4 Artifacts · Reviewed</span>
                      </div>
                      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-paper border border-line">
                        <span className="font-semibold text-navy">Pricing Experiment Memo</span>
                        <span className="font-mono font-bold text-green-700">86/100 · Assessed</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('passport')}
                      className="w-full py-2.5 rounded-xl text-sm font-bold text-navy hover:text-copper border border-line transition-colors flex items-center justify-center gap-1.5"
                    >
                      Open Skill Passport <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 3. Matched Opportunities Preview */}
                <div className="bg-surface rounded-3xl p-8 border border-line shadow-card space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-navy">Matched Opportunities</h3>
                      <p className="text-sm text-muted mt-0.5">Opportunities calibrated to your verified evidence and diagnostic results.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('opportunities')}
                      className="text-sm font-bold text-copper hover:underline flex items-center gap-1"
                    >
                      View All ({opportunities.length}) <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    {opportunities.slice(0, 2).map((opp) => (
                      <div
                        key={opp.id}
                        className="p-6 rounded-2xl border border-line bg-paper/60 hover:bg-paper transition-all space-y-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-muted">{opp.company}</span>
                            <h4 className="text-base font-bold text-navy mt-1">{opp.title}</h4>
                            <p className="text-xs text-muted mt-0.5">{opp.location} · {opp.workMode}</p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-900 border border-green-300">
                            {opp.matchScore}% Match
                          </span>
                        </div>

                        <p className="text-sm text-body line-clamp-2 leading-relaxed">
                          {opp.matchRationale.matchingEvidence[0]}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-line/60 text-sm">
                          <span className="text-xs text-muted">{opp.deadline}</span>
                          <button
                            onClick={() => handlePrepareApplication(opp)}
                            className="px-4 py-2 rounded-xl bg-navy hover:bg-copper text-cream font-bold text-xs transition-colors flex items-center gap-1.5"
                          >
                            Prepare Application <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SKILL PASSPORT */}
            {activeTab === 'passport' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-7 rounded-3xl border border-line shadow-card">
                  <div>
                    <span className="text-xs font-bold text-copper uppercase tracking-wider">Verifiable Credentials</span>
                    <h2 className="text-2xl font-bold text-navy mt-1">Jane Doe · Skill Passport</h2>
                    <p className="text-sm text-muted mt-1">Passport ID: <strong className="font-mono text-navy">SKY-DA-9482-JANE</strong></p>
                  </div>
                  <Link
                    to="/passport/jane-doe"
                    target="_blank"
                    className="px-5 py-3 rounded-2xl border border-line bg-paper hover:bg-white text-sm font-bold text-navy transition-all flex items-center gap-2 shadow-xs"
                  >
                    <ExternalLink className="w-4 h-4 text-copper" /> View Public Certificate
                  </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="bg-surface rounded-3xl p-7 border border-line shadow-card space-y-5 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-xs font-bold text-muted uppercase tracking-wider">{skill.category}</span>
                            <h3 className="text-xl font-bold text-navy mt-1">{skill.name}</h3>
                          </div>
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full border ${
                              skill.status === 'Employer-Validated' || skill.status === 'Assessed'
                                ? 'bg-green-100 text-green-900 border-green-300'
                                : skill.status === 'Reviewed'
                                ? 'bg-cyan-100 text-cyan-900 border-cyan-300'
                                : 'bg-amber-100 text-amber-900 border-amber-300'
                            }`}
                          >
                            {skill.status}
                          </span>
                        </div>

                        <p className="text-sm text-body leading-relaxed">{skill.summary}</p>

                        {/* Evidence Items */}
                        <div className="space-y-2.5 pt-3 border-t border-line/60">
                          <span className="text-xs font-bold text-navy block">Attached Evidence Artifacts:</span>
                          {skill.evidenceItems.map((item, idx) => (
                            <a
                              key={idx}
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between p-3 rounded-2xl bg-paper hover:bg-white border border-line text-sm transition-colors group"
                            >
                              <div className="truncate mr-2">
                                <p className="font-bold text-navy group-hover:text-copper truncate">{item.title}</p>
                                <p className="text-xs text-muted truncate">{item.detail}</p>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-muted shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-line/60 space-y-2.5 text-sm">
                        <div className="p-3.5 rounded-2xl bg-cream border border-copper-soft/60">
                          <span className="font-bold text-navy block text-xs">How to strengthen evidence:</span>
                          <p className="text-body text-xs mt-1 leading-relaxed">{skill.strengthenAction}</p>
                        </div>
                        <p className="text-xs text-muted pt-1">
                          Privacy: <strong>{skill.privacy === 'employers' ? 'Shared with selected employers' : 'Visible only to you'}</strong>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: LEARNING ROADMAP */}
            {activeTab === 'roadmap' && (
              <div className="space-y-8">
                <div className="bg-surface p-7 rounded-3xl border border-line shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-copper uppercase tracking-wider">Dependency-Based Milestones</span>
                    <h2 className="text-2xl font-bold text-navy mt-1">Data Analyst Progression Path</h2>
                    <p className="text-sm text-muted mt-1">Every node provides practical learning tasks and portfolio evidence outputs.</p>
                  </div>
                  <button
                    onClick={() => setDiagnosticOpen(true)}
                    className="px-5 py-3 rounded-2xl bg-navy hover:bg-copper text-cream font-bold text-sm transition-colors flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" /> Take Priority Diagnostic
                  </button>
                </div>

                <div className="space-y-5">
                  {roadmap.map((node) => (
                    <div
                      key={node.id}
                      className={`p-7 rounded-3xl border transition-all ${
                        node.state === 'completed'
                          ? 'bg-surface border-green-300 shadow-sm'
                          : node.state === 'active'
                          ? 'bg-cream/80 border-copper shadow-md ring-1 ring-copper/30'
                          : 'bg-paper/50 border-line opacity-75'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                              node.state === 'completed'
                                ? 'bg-green-600 text-white'
                                : node.state === 'active'
                                ? 'bg-copper text-white'
                                : 'bg-line text-muted'
                            }`}
                          >
                            0{node.id}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-bold text-muted uppercase">{node.category}</span>
                              <span
                                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                  node.state === 'completed'
                                    ? 'bg-green-100 text-green-900'
                                    : node.state === 'active'
                                    ? 'bg-amber-100 text-amber-900 font-extrabold'
                                    : 'bg-line text-muted'
                                }`}
                              >
                                {node.state === 'completed' ? '✓ Completed' : node.state === 'active' ? 'Active Focus' : 'Locked'}
                              </span>
                              {node.score && (
                                <span className="text-xs font-mono font-bold text-green-700">{node.score}</span>
                              )}
                            </div>
                            <h3 className="text-xl font-bold text-navy">{node.title}</h3>
                            <p className="text-sm text-body leading-relaxed max-w-3xl">
                              <strong>Why it matters:</strong> {node.whyItMatters}
                            </p>
                          </div>
                        </div>

                        {node.state === 'active' && (
                          <button
                            onClick={() => setDiagnosticOpen(true)}
                            className="px-5 py-2.5 rounded-xl bg-copper text-white hover:bg-copper-strong font-bold text-xs shrink-0 transition-colors"
                          >
                            Take Diagnostic Lab
                          </button>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-line/60 text-sm">
                        <div className="p-4 rounded-2xl bg-white border border-line">
                          <span className="text-xs font-bold uppercase text-muted block mb-1">Approved Resource:</span>
                          <a
                            href={node.learningResource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-navy hover:text-copper flex items-center gap-1.5"
                          >
                            {node.learningResource.title} <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          </a>
                          <span className="text-xs text-muted mt-1 block">{node.learningResource.provider} · {node.estimatedTime}</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-line">
                          <span className="text-xs font-bold uppercase text-muted block mb-1">Practical Task:</span>
                          <p className="text-body text-xs leading-relaxed">{node.practicalTask}</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-line">
                          <span className="text-xs font-bold uppercase text-muted block mb-1">Portfolio Output:</span>
                          <p className="text-body text-xs leading-relaxed">{node.expectedEvidence}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Approved Courses */}
                <div className="bg-surface p-8 rounded-3xl border border-line shadow-card space-y-5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-copper" />
                    <h3 className="font-bold text-lg text-navy">Approved Course Recommendations</h3>
                  </div>
                  <p className="text-sm text-muted">{courseRecommendations.summaryMessage}</p>

                  <div className="grid md:grid-cols-2 gap-5 pt-2">
                    {courseRecommendations.recommendations.map((course) => (
                      <div key={course.id} className="p-5 rounded-2xl border border-line bg-paper space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm text-navy">{course.title}</h4>
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cream border border-copper-soft text-copper-strong">
                            {course.estimatedHours}h
                          </span>
                        </div>
                        <p className="text-xs text-muted">{course.provider}</p>
                        <p className="text-sm text-body leading-relaxed">{course.whySelected}</p>
                        <div className="pt-3 border-t border-line/60 flex justify-between items-center text-sm">
                          <span className="font-semibold text-navy">Order #{course.completionOrder}</span>
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-copper hover:underline flex items-center gap-1"
                          >
                            Open Resource <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: OPPORTUNITIES */}
            {activeTab === 'opportunities' && (
              <div className="space-y-6">
                <div className="bg-surface p-7 rounded-3xl border border-line shadow-card space-y-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search by role, company, or skill (e.g., SQL, Monzo, Python)..."
                        value={oppSearch}
                        onChange={(e) => setOppSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-paper border border-line rounded-2xl text-sm text-ink placeholder:text-muted/60 focus:bg-white focus:border-copper outline-none transition-all"
                      />
                    </div>
                    <div className="flex gap-3">
                      <select
                        value={oppModeFilter}
                        onChange={(e: any) => setOppModeFilter(e.target.value)}
                        className="bg-paper border border-line rounded-2xl px-4 py-3 text-sm font-semibold outline-none"
                      >
                        <option value="All">All Work Modes</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="On-site">On-site</option>
                      </select>
                      <select
                        value={oppTypeFilter}
                        onChange={(e: any) => setOppTypeFilter(e.target.value)}
                        className="bg-paper border border-line rounded-2xl px-4 py-3 text-sm font-semibold outline-none"
                      >
                        <option value="All">All Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted pt-2 border-t border-line/60">
                    <span>Showing {filteredOpportunities.length} opportunities</span>
                    <button
                      onClick={() => setShowHiddenOpps(!showHiddenOpps)}
                      className="font-bold text-copper hover:underline"
                    >
                      {showHiddenOpps ? 'Show active recommendations' : 'Show hidden / less relevant'}
                    </button>
                  </div>
                </div>

                <div className="space-y-5">
                  {filteredOpportunities.map((opp) => (
                    <div
                      key={opp.id}
                      className="bg-surface rounded-3xl p-8 border border-line shadow-card space-y-5 hover:border-copper-soft transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-navy">{opp.company}</span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-paper border border-line font-medium text-muted">
                              {opp.workMode}
                            </span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-paper border border-line font-medium text-muted">
                              {opp.type}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-navy mt-1.5">{opp.title}</h3>
                          <p className="text-sm text-muted mt-0.5">{opp.location} · {opp.salaryRange}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-900 border border-green-300">
                            {opp.matchScore}% Match
                          </span>
                          <button
                            onClick={() => handleToggleSaveOpp(opp.id)}
                            className="p-2.5 rounded-2xl border border-line hover:bg-paper text-navy transition-colors"
                            title={opp.saved ? 'Unsave' : 'Save opportunity'}
                          >
                            {opp.saved ? <BookmarkCheck className="w-5 h-5 text-copper" /> : <Bookmark className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-body leading-relaxed">{opp.description}</p>

                      <div className="p-5 rounded-2xl bg-cream border border-copper-soft/60 space-y-2 text-sm">
                        <span className="font-bold text-navy block text-xs">Match Rationale & Action Plan:</span>
                        <div className="space-y-1.5 text-body">
                          {opp.matchRationale.matchingEvidence.map((ev, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                              <span>{ev}</span>
                            </div>
                          ))}
                          <div className="flex items-start gap-2 text-copper-strong font-semibold">
                            <ArrowRight className="w-4 h-4 text-copper shrink-0 mt-0.5" />
                            <span>Actionable Step: {opp.matchRationale.actionableStep}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-line/60 text-sm">
                        <button
                          onClick={() => handleToggleLessRelevant(opp.id)}
                          className="text-muted hover:text-navy text-xs underline"
                        >
                          {opp.isLessRelevant ? 'Restore to recommendations' : 'Mark as less relevant'}
                        </button>

                        <div className="flex items-center gap-4">
                          <span className="text-muted text-xs">{opp.deadline}</span>
                          <button
                            onClick={() => handlePrepareApplication(opp)}
                            className="px-5 py-2.5 rounded-xl bg-navy hover:bg-copper text-cream font-bold text-xs transition-colors flex items-center gap-1.5"
                          >
                            Prepare Application <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: APPLICATIONS */}
            {activeTab === 'applications' && (
              <div className="space-y-6">
                <div className="bg-surface p-7 rounded-3xl border border-line shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-copper uppercase tracking-wider">Private Workflow</span>
                    <h2 className="text-2xl font-bold text-navy mt-1">Application Tracker</h2>
                    <p className="text-sm text-muted mt-1">Applications and personal notes are kept private to you.</p>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 text-sm">
                    {['All', 'Saved', 'Ready to apply', 'Submitted', 'Interview or next step'].map((stage) => (
                      <button
                        key={stage}
                        onClick={() => setAppStageFilter(stage)}
                        className={`px-3.5 py-2 rounded-xl font-bold transition-colors whitespace-nowrap text-xs ${
                          appStageFilter === stage
                            ? 'bg-navy text-cream shadow-xs'
                            : 'bg-paper text-body hover:bg-white border border-line'
                        }`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  {filteredApplications.map((app) => (
                    <div
                      key={app.id}
                      className="bg-surface rounded-3xl p-8 border border-line shadow-card space-y-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-muted">{app.company}</span>
                          <h3 className="text-xl font-bold text-navy mt-1">{app.role}</h3>
                          <p className="text-xs text-muted mt-0.5">Deadline: {app.deadline || 'Rolling'} · Updated: {app.lastUpdated}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-muted">Stage:</span>
                          <select
                            value={app.stage}
                            onChange={(e: any) => handleUpdateAppStage(app.id, e.target.value)}
                            className="bg-paper border border-line rounded-xl px-3 py-1.5 text-xs font-bold text-navy outline-none"
                          >
                            <option value="Saved">Saved</option>
                            <option value="Ready to apply">Ready to apply</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Interview or next step">Interview or next step</option>
                            <option value="Withdrawn">Withdrawn</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div className="p-4 rounded-2xl bg-paper border border-line space-y-2">
                          <span className="font-bold text-navy block text-xs">Selected Evidence for Sharing:</span>
                          {app.selectedEvidence.map((ev, idx) => (
                            <div key={idx} className="flex items-center justify-between text-body text-xs">
                              <span>• {ev.title}</span>
                              <span className="font-mono font-bold text-green-700">{ev.verifiedScore}</span>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 rounded-2xl bg-cream border border-copper-soft/60 space-y-2">
                          <span className="font-bold text-navy block text-xs">Next Recommended Action:</span>
                          <p className="text-body text-xs leading-relaxed">{app.nextRecommendedAction}</p>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-surface-strong border border-line space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-navy text-xs flex items-center gap-2">
                            <Edit3 className="w-3.5 h-3.5 text-copper" /> Private Student Notes (Visible only to you)
                          </span>
                          {editingNoteAppId !== app.id && (
                            <button
                              onClick={() => {
                                setEditingNoteAppId(app.id);
                                setTempNote(app.studentNotes);
                              }}
                              className="text-copper hover:underline text-xs font-bold"
                            >
                              Edit Note
                            </button>
                          )}
                        </div>

                        {editingNoteAppId === app.id ? (
                          <div className="space-y-2.5">
                            <textarea
                              value={tempNote}
                              onChange={(e) => setTempNote(e.target.value)}
                              rows={3}
                              className="w-full p-3 rounded-xl border border-copper bg-paper text-sm outline-none"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingNoteAppId(null)}
                                className="px-4 py-1.5 rounded-lg border text-xs"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveAppNote(app.id)}
                                className="px-4 py-1.5 rounded-lg bg-navy text-white text-xs font-bold"
                              >
                                Save Note
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-body text-sm italic">{app.studentNotes || 'No notes added yet.'}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: AI CAREER COACH */}
            {activeTab === 'coach' && (
              <div className="space-y-6">
                <div className="bg-surface p-7 rounded-3xl border border-line shadow-card">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-navy text-cream flex items-center justify-center">
                      <Bot className="w-5 h-5 text-copper-soft" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-navy">Context-Aware AI Career Coach</h2>
                      <p className="text-sm text-muted">Advisory recommendations citing your verified evidence signals and active application deadlines.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-surface rounded-3xl border border-line shadow-card overflow-hidden flex flex-col h-[560px]">
                  <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-4 bg-paper/40">
                    {coachMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.sender === 'bot' && (
                          <div className="w-9 h-9 rounded-2xl bg-navy text-cream flex items-center justify-center shrink-0 mt-1">
                            <Bot className="w-4 h-4 text-copper-soft" />
                          </div>
                        )}
                        <div
                          className={`p-5 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-navy text-cream rounded-tr-none shadow-xs'
                              : 'bg-white border border-line text-body rounded-tl-none shadow-xs space-y-3'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{msg.text}</div>

                          {msg.signalsUsed && (
                            <div className="pt-3 border-t border-line/60 text-xs text-muted space-y-1.5">
                              <span className="font-bold text-navy block">Signals Used:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {msg.signalsUsed.map((sig, i) => (
                                  <span key={i} className="px-2.5 py-0.5 rounded-full bg-paper border border-line text-xs">
                                    {sig}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {msg.suggestedAction && (
                            <button
                              onClick={() => {
                                if (msg.suggestedAction?.actionType === 'navigate') {
                                  setActiveTab(msg.suggestedAction.payload as StudentTab);
                                } else if (msg.suggestedAction?.actionType === 'resource') {
                                  window.open(msg.suggestedAction.payload, '_blank');
                                }
                              }}
                              className="w-full py-2.5 px-4 rounded-xl bg-cream hover:bg-amber-100 text-copper-strong border border-copper-soft/60 font-bold text-xs flex items-center justify-between transition-colors"
                            >
                              <span>{msg.suggestedAction.label}</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {isCoachThinking && (
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-navy text-cream flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-copper-soft" />
                        </div>
                        <div className="bg-white border border-line p-4 rounded-2xl text-sm text-muted flex items-center gap-2.5">
                          <span className="w-4 h-4 border-2 border-copper border-t-transparent rounded-full animate-spin" />
                          <span>Evaluating verified signals and opportunity deadlines...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5 bg-surface border-t border-line space-y-3.5">
                    <div className="flex gap-2 overflow-x-auto pb-1 text-sm">
                      {PRESET_PROMPTS.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => handleAskCoach(prompt)}
                          className="px-4 py-2 rounded-full bg-cream hover:bg-amber-100 text-copper-strong border border-copper-soft/60 whitespace-nowrap text-xs font-bold transition-colors shrink-0"
                        >
                          ⚡ {prompt}
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handleSendCustomCoach} className="flex gap-3">
                      <input
                        type="text"
                        value={coachInput}
                        onChange={(e) => setCoachInput(e.target.value)}
                        placeholder="Ask your coach anything about skills, courses, or interview prep..."
                        className="flex-1 bg-paper border border-line rounded-2xl px-5 py-3 text-sm text-ink focus:bg-white focus:border-copper outline-none transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!coachInput.trim() || isCoachThinking}
                        className="px-6 py-3 rounded-2xl bg-navy hover:bg-copper text-cream font-bold text-sm transition-colors disabled:opacity-50"
                      >
                        Ask
                      </button>
                    </form>

                    <p className="text-xs text-muted text-center">
                      Advisory AI guidance based on verified learner signals. Never guarantees placement, salary, or automated selection.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: MESSAGES */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="bg-surface p-7 rounded-3xl border border-line shadow-card flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-copper uppercase tracking-wider">Recruiter Dialogue</span>
                    <h2 className="text-2xl font-bold text-navy mt-1">Direct Recruiter Communications</h2>
                    <p className="text-sm text-muted mt-1">Encrypted messaging with verified hiring managers.</p>
                  </div>
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-3.5 py-1.5 rounded-full border border-green-300">
                    Active Recruiter Thread
                  </span>
                </div>

                <div className="bg-surface rounded-3xl border border-line shadow-card overflow-hidden flex flex-col h-[520px]">
                  <div className="p-5 bg-navy text-cream flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-cream text-navy font-bold flex items-center justify-center text-xs">
                        MZ
                      </div>
                      <div>
                        <p className="font-bold text-sm text-cream">Marcus Vance · Talent Lead</p>
                        <p className="text-xs text-ice">Monzo Bank · Product Data Analyst Role</p>
                      </div>
                    </div>
                    <span className="text-xs text-copper-soft font-bold">Verified Recruiter</span>
                  </div>

                  <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-4 bg-paper/40 text-sm">
                    {recruiterChat.map((m) => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${m.sender === 'student' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`p-4 rounded-2xl max-w-[80%] leading-relaxed ${
                            m.sender === 'student'
                              ? 'bg-navy text-cream rounded-tr-none'
                              : 'bg-white border border-line text-navy rounded-tl-none shadow-xs'
                          }`}
                        >
                          {m.text}
                        </div>
                        <span className="text-xs text-muted mt-1 px-1">{m.time}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendRecruiterMsg} className="p-5 bg-surface border-t border-line flex gap-3">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type your response to Marcus..."
                      className="flex-1 bg-paper border border-line rounded-2xl px-5 py-3 text-sm text-ink focus:bg-white focus:border-copper outline-none transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="px-6 py-3 rounded-2xl bg-navy hover:bg-copper text-cream font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" /> Send
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 8: PROFILE & PRIVACY */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-surface p-7 rounded-3xl border border-line shadow-card space-y-2">
                  <span className="text-xs font-bold text-copper uppercase tracking-wider">Consent & Data Ownership</span>
                  <h2 className="text-2xl font-bold text-navy">Student Profile & Privacy Control</h2>
                  <p className="text-sm text-muted leading-relaxed">
                    You have complete ownership of your evidence, diagnostic records, and application history. Skilloryn never exposes private repositories or raw surveillance data without explicit consent.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-surface rounded-3xl p-7 border border-line shadow-card space-y-5">
                    <h3 className="font-bold text-base text-navy">Profile Details</h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <label className="text-xs font-bold uppercase text-muted block mb-1.5">Full Name</label>
                        <input
                          type="text"
                          defaultValue="Jane Doe"
                          className="w-full p-3 bg-paper rounded-2xl border border-line text-navy font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase text-muted block mb-1.5">Primary Email</label>
                        <input
                          type="email"
                          defaultValue="jane.doe@skilloryn.io"
                          disabled
                          className="w-full p-3 bg-paper rounded-2xl border border-line text-muted font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase text-muted block mb-1.5">Target Career Pathway</label>
                        <select className="w-full p-3 bg-paper rounded-2xl border border-line text-navy font-semibold">
                          <option>Data Analyst (Level 12)</option>
                          <option>Analytics Engineer</option>
                          <option>Business Intelligence Specialist</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface rounded-3xl p-7 border border-line shadow-card space-y-5">
                    <h3 className="font-bold text-base text-navy">Evidence Sharing Permissions</h3>
                    <div className="space-y-4 text-sm">
                      <label className="flex items-start gap-3.5 p-4 rounded-2xl bg-paper border border-line cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 mt-1 accent-copper rounded" />
                        <div>
                          <span className="font-bold text-navy block">Share Verified Scores with Employers</span>
                          <span className="text-muted text-xs">Allow recruiters reviewing applications to see validated assessment scores.</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3.5 p-4 rounded-2xl bg-paper border border-line cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 mt-1 accent-copper rounded" />
                        <div>
                          <span className="font-bold text-navy block">Include Anonymized Readiness in Institution Analytics</span>
                          <span className="text-muted text-xs">Helps your university design targeted curriculum workshops without sharing personal records.</span>
                        </div>
                      </label>

                      <div className="pt-2">
                        <button
                          onClick={() => alert('Evidence archive exported successfully to JSON/PDF.')}
                          className="w-full py-3 rounded-2xl border border-line hover:bg-paper font-bold text-sm text-navy transition-colors flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4 text-copper" /> Export Full Evidence Data Archive
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* DIAGNOSTIC MODAL */}
      {diagnosticOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface w-full max-w-xl rounded-3xl shadow-2xl border border-line overflow-hidden animate-slide-up">
            <div className="p-6 bg-navy text-cream flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-copper-soft block">
                  Proctored Diagnostic Assessment
                </span>
                <h3 className="text-lg font-bold text-cream mt-0.5">
                  SQL Window Functions & Analytical Framing
                </h3>
              </div>
              <button
                onClick={handleResetQuiz}
                className="p-1.5 rounded-lg hover:bg-white/10 text-ice hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {!quizFinished ? (
                <>
                  <div className="flex items-center justify-between text-sm font-bold text-muted">
                    <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                    <span className="text-copper">Timed Assessment</span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-paper overflow-hidden border border-line">
                    <div
                      className="h-full bg-copper transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>

                  <div className="p-5 rounded-2xl bg-paper border border-line">
                    <p className="text-base font-bold text-navy leading-relaxed">
                      {quizQuestions[currentQuestionIndex].question}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {quizQuestions[currentQuestionIndex].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswerQuiz(idx)}
                        className="w-full p-4 text-left rounded-2xl border border-line bg-white hover:border-copper hover:bg-cream text-sm font-bold text-navy transition-all flex items-center gap-3.5"
                      >
                        <span className="w-6 h-6 rounded-lg bg-paper text-copper text-center leading-6 text-xs font-mono shrink-0">
                          0{idx + 1}
                        </span>
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-6">
                  <div className="w-16 h-16 rounded-3xl bg-green-100 text-green-700 mx-auto flex items-center justify-center text-3xl font-bold border border-green-300">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-navy">Diagnostic Verified!</h4>
                    <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
                      Your score has been verified and stamped into your Skill Passport and Learning Roadmap.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-6 px-7 py-5 rounded-2xl bg-paper border border-line">
                    <div>
                      <span className="text-xs uppercase font-bold text-muted block">Verified Score</span>
                      <span className="text-2xl font-extrabold text-green-700 font-mono">
                        {quizScore === 3 ? '96/100' : '92/100'}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-line" />
                    <div>
                      <span className="text-xs uppercase font-bold text-muted block">Status</span>
                      <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                        Employer-Validated
                      </span>
                    </div>
                    <div className="h-8 w-px bg-line" />
                    <div>
                      <span className="text-xs uppercase font-bold text-muted block">Reward</span>
                      <span className="text-base font-bold text-copper">+100 EP</span>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={handleResetQuiz}
                      className="px-7 py-3.5 rounded-2xl bg-navy hover:bg-navy-soft text-cream font-bold text-sm transition-colors"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
