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
      text: 'Hi Jane! 👋 I am your context-aware **AI Career Coach**.\n\nI have analyzed your **Data Analyst** roadmap and noticed your highest-leverage opportunity: **Window Functions (Node 02)**.\n\nHow can I help guide your progress today?',
      timestamp: 'Today at 09:00',
      signalsUsed: ['Target Role: Data Analyst', 'Priority Gap: Window Functions', 'Diagnostic Baseline: 92/100 SQL'],
    },
  ]);
  const [coachInput, setCoachInput] = useState('');
  const [isCoachThinking, setIsCoachThinking] = useState(false);

  // Messages / Recruiter Chat State
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

  // Sync to local storage
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

  // Daily Check-in handler
  const handleDailyCheckIn = () => {
    if (!checkedInToday) {
      setCheckedInToday(true);
      setPoints((prev) => prev + 15);
      setStreak((prev) => prev + 1);
      localStorage.setItem('skilloryn_checked_in', 'true');
    }
  };

  // Diagnostic Quiz questions
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
      // Unlock Node 02 in roadmap & update skills
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

  // Opportunity Actions
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
        studentNotes: `Prepared application from opportunity discovery. Target match score: ${opp.matchScore}%.`,
        nextRecommendedAction: opp.matchRationale.actionableStep,
        isSharedWithCompany: false,
      };
      setApplications([newApp, ...applications]);
    }
    setActiveTab('applications');
  };

  // Update Application Stage
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

  // Coach prompt handler
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

  // Recruiter chat handler
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

  // Filtered Opportunities
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

  // Filtered Applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (appStageFilter === 'All') return true;
      return app.stage === appStageFilter;
    });
  }, [applications, appStageFilter]);

  // Approved Course recommendations based on priority gap
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
      {/* Background Decor */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="theme-orb theme-orb-one" />
        <div className="theme-orb theme-orb-two" />
        <div className="theme-grid" />
      </div>

      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-navy border-r border-navy-line hidden md:flex flex-col z-20 text-white shrink-0">
        {/* Workspace Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-navy-line/70 justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/choose-workspace')}
            title="Switch Workspace"
          >
            <div className="w-9 h-9 rounded-xl bg-cream/95 flex items-center justify-center shadow-sm border border-copper-soft/30 overflow-hidden group-hover:scale-105 transition-transform">
              <img src={institutionLogo} alt="Skilloryn" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <span className="font-bold text-lg text-cream tracking-tight block font-display leading-tight">
                Skilloryn
              </span>
              <span className="text-[10px] text-copper-soft font-bold uppercase tracking-wider block">
                Student Cockpit
              </span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 py-5 px-3.5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cream text-navy shadow-sm font-bold border border-copper-soft'
                    : 'text-sidebar-muted hover:bg-navy-soft hover:text-cream'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-copper' : 'text-sidebar-muted'}`} />
                <span>{item.label}</span>
                {item.id === 'applications' && applications.length > 0 && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] bg-copper/20 text-copper-soft font-bold">
                    {applications.length}
                  </span>
                )}
                {item.id === 'messages' && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-copper animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-navy-line/70 space-y-2">
          <button
            onClick={() => navigate('/choose-workspace')}
            className="w-full flex items-center justify-between text-sidebar-muted hover:text-cream text-xs font-semibold p-2.5 rounded-xl hover:bg-navy-soft transition-colors"
          >
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-copper-soft" /> Switch Workspace
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <Link
            to="/sign-in"
            className="w-full flex items-center justify-between text-sidebar-muted hover:text-rose-300 text-xs font-semibold p-2.5 rounded-xl hover:bg-navy-soft transition-colors"
          >
            <span>Sign Out</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* MAIN VIEWPORT CONTAINER */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Top Header */}
        <header className="h-16 bg-surface/80 backdrop-blur-xl border-b border-line flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-20">
          {/* Mobile brand & toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-surface border border-line text-navy"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cream flex items-center justify-center border border-copper-soft/30 overflow-hidden">
                <img src={institutionLogo} alt="Skilloryn" className="w-6 h-6 object-contain" />
              </div>
              <span className="font-bold text-sm font-display text-navy">Skilloryn</span>
            </div>
          </div>

          {/* Page Title for Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <h1 className="text-base font-bold text-navy font-display capitalize">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cream text-copper-strong border border-copper-soft/60">
              Data Analyst Pathway
            </span>
          </div>

          {/* Header Stats & Persona */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Gamification Stats */}
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="flex items-center gap-1.5" title="Daily Streak">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-extrabold text-navy">{streak} <span className="text-muted font-normal">Days</span></span>
              </div>
              <div className="flex items-center gap-1.5" title="Evidence Points (EP)">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-extrabold text-navy">{points} <span className="text-muted font-normal">EP</span></span>
              </div>
            </div>

            <div className="h-6 w-px bg-line hidden sm:block" />

            {/* Profile pill */}
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-xs font-bold text-navy">Jane Doe</p>
                <p className="text-[10px] text-muted">Level 12 Analyst</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-navy text-cream flex items-center justify-center font-bold text-xs shadow-xs border border-copper-soft/40">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* MOBILE SLIDE-DOWN DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-navy text-white border-b border-navy-line p-4 space-y-1 z-30 shadow-xl">
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
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold ${
                    isActive ? 'bg-cream text-navy font-bold' : 'text-sidebar-muted hover:bg-navy-soft'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-2 border-t border-white/10 flex justify-between">
              <button
                onClick={() => navigate('/choose-workspace')}
                className="text-xs text-copper-soft font-bold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Switch Workspace
              </button>
              <Link to="/sign-in" className="text-xs text-rose-300 font-bold">
                Sign Out
              </Link>
            </div>
          </div>
        )}

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* TAB 1: OVERVIEW COMMAND CENTRE */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* 1. Today's Next Action (Command Center Hero) */}
                <div className="bg-navy text-cream rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-navy border border-navy-line/60">
                  <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full border border-copper-soft/20 pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-ice text-xs font-bold border border-white/15">
                        <Sparkles className="w-3.5 h-3.5 text-copper-soft" /> Priority Next Action for Today
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold font-display text-cream">
                        Master Analytical Window Functions (Node 02)
                      </h2>
                      <p className="text-xs sm:text-sm text-ice leading-relaxed">
                        Window functions are requested in <strong>88% of data analyst job descriptions</strong>. Completing this 3-question diagnostic bridges your primary gap and boosts your Monzo application match to <strong>98%</strong>.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setDiagnosticOpen(true)}
                        className="px-6 py-3 rounded-xl bg-copper hover:bg-copper-strong text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
                      >
                        <Play className="w-4 h-4 fill-current" /> Start 2-Min Diagnostic (+100 EP)
                      </button>
                      <button
                        onClick={handleDailyCheckIn}
                        disabled={checkedInToday}
                        className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                          checkedInToday
                            ? 'bg-green-500/20 text-green-300 border-green-500/40 cursor-default'
                            : 'bg-white/10 hover:bg-white/20 text-cream border-white/20'
                        }`}
                      >
                        {checkedInToday ? (
                          <><Check className="w-3.5 h-3.5" /> Checked In Today</>
                        ) : (
                          <><Zap className="w-3.5 h-3.5 text-amber-400" /> Daily Check-In (+15 EP)</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Pathway & Gaps + Evidence Progress Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Skill Gap Matrix */}
                  <div className="bg-surface rounded-3xl p-6 border border-line shadow-card space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-navy font-display">Target Pathway Gaps</h3>
                      <span className="text-[10px] font-bold text-copper uppercase tracking-wider">
                        Data Analyst
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 rounded-2xl bg-cream border border-copper-soft/60">
                        <div className="flex items-center justify-between text-xs font-bold text-navy mb-1">
                          <span>Window Functions Framing</span>
                          <span className="text-copper">Priority Gap</span>
                        </div>
                        <p className="text-[11px] text-muted">Node 02 in Learning Roadmap</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-paper border border-line">
                        <div className="flex items-center justify-between text-xs font-bold text-navy mb-1">
                          <span>Python Vectorized Pipelines</span>
                          <span className="text-green-700 font-semibold">Active Node</span>
                        </div>
                        <p className="text-[11px] text-muted">Node 03 in Learning Roadmap</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('roadmap')}
                      className="w-full py-2 rounded-xl text-xs font-bold text-navy hover:text-copper border border-line hover:border-copper/40 transition-colors flex items-center justify-center gap-1"
                    >
                      View Full Roadmap <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Evidence & Verifications */}
                  <div className="bg-surface rounded-3xl p-6 border border-line shadow-card space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-navy font-display">Verified Evidence Ledger</h3>
                      <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        3 Verified Signals
                      </span>
                    </div>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-paper border border-line">
                        <span className="font-medium text-navy">Advanced SQL Diagnostic</span>
                        <span className="font-mono font-bold text-green-700">92/100 · Verified</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-paper border border-line">
                        <span className="font-medium text-navy">Ecommerce Churn Model</span>
                        <span className="font-mono font-bold text-cyan-800">4 Artifacts · Reviewed</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-paper border border-line">
                        <span className="font-medium text-navy">Pricing Experiment Memo</span>
                        <span className="font-mono font-bold text-green-700">86/100 · Assessed</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('passport')}
                      className="w-full py-2 rounded-xl text-xs font-bold text-navy hover:text-copper border border-line hover:border-copper/40 transition-colors flex items-center justify-center gap-1"
                    >
                      Open Skill Passport <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* AI Coach Instant Recommendation */}
                  <div className="bg-surface rounded-3xl p-6 border border-line shadow-card flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-copper" />
                        <h3 className="font-bold text-sm text-navy font-display">AI Coach Advice</h3>
                      </div>
                      <p className="text-xs text-body leading-relaxed">
                        "Your Monzo Bank application is due in <strong>12 days</strong>. Your SQL foundations and pricing memo are ready. Complete Node 02 to bridge the window functions criteria before submitting."
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('coach')}
                      className="w-full py-2.5 rounded-xl bg-navy text-cream hover:bg-navy-soft font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      Chat with AI Coach <ChevronRight className="w-3.5 h-3.5 text-copper-soft" />
                    </button>
                  </div>
                </div>

                {/* 3. Relevant Opportunities Preview */}
                <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-line shadow-card space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-navy font-display">Matched Opportunities</h3>
                      <p className="text-xs text-muted">Ranked by your verified evidence signals and portfolio artifacts.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('opportunities')}
                      className="text-xs font-bold text-copper hover:text-copper-strong flex items-center gap-1"
                    >
                      View All ({opportunities.length}) <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {opportunities.slice(0, 2).map((opp) => (
                      <div
                        key={opp.id}
                        className="p-5 rounded-2xl border border-line bg-paper/60 hover:bg-paper hover:border-copper-soft transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{opp.company}</span>
                            <h4 className="font-bold text-sm text-navy mt-0.5">{opp.title}</h4>
                            <p className="text-[11px] text-muted">{opp.location} · {opp.workMode}</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-green-100 text-green-900 border border-green-300">
                            {opp.matchScore}% Match
                          </span>
                        </div>

                        <p className="text-xs text-body line-clamp-2 leading-relaxed">
                          {opp.matchRationale.matchingEvidence[0]}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-line/60">
                          <span className="text-[11px] text-muted">{opp.deadline}</span>
                          <button
                            onClick={() => handlePrepareApplication(opp)}
                            className="px-3.5 py-1.5 rounded-lg bg-navy hover:bg-copper text-cream font-bold text-xs transition-colors flex items-center gap-1"
                          >
                            Prepare Application <ArrowRight className="w-3 h-3" />
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
                {/* Passport Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-line shadow-card">
                  <div>
                    <span className="text-xs font-bold text-copper uppercase tracking-wider">Verifiable Identity</span>
                    <h2 className="text-2xl font-bold text-navy font-display mt-1">Jane Doe · Skill Passport</h2>
                    <p className="text-xs text-muted mt-1">
                      Passport ID: <span className="font-mono font-bold text-navy">SKY-DA-9482-JANE</span> · Consent-first evidence ledger
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      to="/passport/jane-doe"
                      target="_blank"
                      className="px-4 py-2.5 rounded-xl border border-line bg-paper hover:bg-white text-xs font-bold text-navy transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-copper" /> View Public Certificate
                    </Link>
                  </div>
                </div>

                {/* Skills Cards Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="bg-surface rounded-3xl p-6 border border-line shadow-card space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{skill.category}</span>
                            <h3 className="text-lg font-bold text-navy font-display mt-0.5">{skill.name}</h3>
                          </div>
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
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

                        <p className="text-xs text-body leading-relaxed">{skill.summary}</p>

                        {/* Evidence Items */}
                        <div className="space-y-2 pt-2 border-t border-line/60">
                          <span className="text-[11px] font-bold text-navy block">Attached Evidence:</span>
                          {skill.evidenceItems.map((item, idx) => (
                            <a
                              key={idx}
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between p-2.5 rounded-xl bg-paper hover:bg-white border border-line text-xs transition-colors group"
                            >
                              <div className="truncate mr-2">
                                <p className="font-bold text-navy group-hover:text-copper truncate">{item.title}</p>
                                <p className="text-[10px] text-muted truncate">{item.detail}</p>
                              </div>
                              {item.isCredentialsFreePreview && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface border border-line text-muted shrink-0 font-mono">
                                  Preview
                                </span>
                              )}
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Strengthen action & Privacy */}
                      <div className="pt-4 border-t border-line/60 space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-cream border border-copper-soft/60">
                          <span className="font-bold text-navy block text-[11px]">How to strengthen:</span>
                          <p className="text-body text-[11px] mt-0.5">{skill.strengthenAction}</p>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-muted pt-1">
                          <span>Updated: {skill.lastUpdated}</span>
                          <span className="capitalize font-semibold text-navy">
                            Privacy: {skill.privacy === 'employers' ? 'Shared with selected employers' : 'Visible only to me'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: LEARNING ROADMAP */}
            {activeTab === 'roadmap' && (
              <div className="space-y-8">
                <div className="bg-surface p-6 rounded-3xl border border-line shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-copper uppercase tracking-wider">Dependency-Based Learning</span>
                    <h2 className="text-2xl font-bold text-navy font-display mt-1">Data Analyst Progression Path</h2>
                    <p className="text-xs text-muted mt-1">Actionable tasks linked to approved resources and verified portfolio outcomes.</p>
                  </div>
                  <button
                    onClick={() => setDiagnosticOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-navy hover:bg-copper text-cream font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" /> Take Priority Diagnostic
                  </button>
                </div>

                {/* Nodes List */}
                <div className="space-y-4">
                  {roadmap.map((node) => (
                    <div
                      key={node.id}
                      className={`p-6 rounded-3xl border transition-all ${
                        node.state === 'completed'
                          ? 'bg-surface border-green-300 shadow-sm'
                          : node.state === 'active'
                          ? 'bg-cream/70 border-copper shadow-md ring-1 ring-copper/30'
                          : 'bg-paper/50 border-line opacity-75'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
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
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{node.category}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  node.state === 'completed'
                                    ? 'bg-green-100 text-green-900'
                                    : node.state === 'active'
                                    ? 'bg-amber-100 text-amber-900 font-extrabold'
                                    : 'bg-line text-muted'
                                }`}
                              >
                                {node.state === 'completed' ? '✓ Completed' : node.state === 'active' ? 'Active Gap' : 'Locked'}
                              </span>
                              {node.score && (
                                <span className="text-[11px] font-mono font-bold text-green-700">{node.score}</span>
                              )}
                            </div>
                            <h3 className="text-lg font-bold text-navy font-display">{node.title}</h3>
                            <p className="text-xs text-body leading-relaxed max-w-3xl">
                              <strong>Why it matters:</strong> {node.whyItMatters}
                            </p>
                          </div>
                        </div>

                        {node.state === 'active' && (
                          <button
                            onClick={() => setDiagnosticOpen(true)}
                            className="px-4 py-2 rounded-xl bg-copper text-white hover:bg-copper-strong font-bold text-xs shrink-0 transition-colors"
                          >
                            Take Diagnostic Lab
                          </button>
                        )}
                      </div>

                      {/* Details Box */}
                      <div className="grid sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-line/60 text-xs">
                        <div className="p-3 rounded-2xl bg-white border border-line">
                          <span className="text-[10px] font-bold uppercase text-muted block mb-1">Approved Resource:</span>
                          <a
                            href={node.learningResource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-navy hover:text-copper flex items-center gap-1"
                          >
                            {node.learningResource.title} <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                          <span className="text-[10px] text-muted mt-1 block">{node.learningResource.provider} · {node.estimatedTime}</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-white border border-line">
                          <span className="text-[10px] font-bold uppercase text-muted block mb-1">Practical Task:</span>
                          <p className="text-body text-[11px] leading-relaxed">{node.practicalTask}</p>
                        </div>

                        <div className="p-3 rounded-2xl bg-white border border-line">
                          <span className="text-[10px] font-bold uppercase text-muted block mb-1">Portfolio Output:</span>
                          <p className="text-body text-[11px] leading-relaxed">{node.expectedEvidence}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Approved Catalogue Recommendations */}
                <div className="bg-surface p-6 rounded-3xl border border-line shadow-card space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-copper" />
                    <h3 className="font-bold text-sm text-navy font-display">Approved AI Course Recommendations</h3>
                  </div>
                  <p className="text-xs text-muted">{courseRecommendations.summaryMessage}</p>

                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                    {courseRecommendations.recommendations.map((course) => (
                      <div key={course.id} className="p-4 rounded-2xl border border-line bg-paper space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs text-navy">{course.title}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cream border border-copper-soft text-copper-strong">
                            {course.estimatedHours}h
                          </span>
                        </div>
                        <p className="text-[11px] text-muted">{course.provider}</p>
                        <p className="text-xs text-body leading-relaxed">{course.whySelected}</p>
                        <div className="pt-2 border-t border-line/60 flex justify-between items-center text-xs">
                          <span className="text-[11px] font-semibold text-navy">Order #{course.completionOrder}</span>
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-copper hover:text-copper-strong flex items-center gap-1 text-xs"
                          >
                            Open Resource <ExternalLink className="w-3 h-3" />
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
                {/* Search & Filters */}
                <div className="bg-surface p-6 rounded-3xl border border-line shadow-card space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search by role, company, or skill (e.g., SQL, Monzo, Python)..."
                        value={oppSearch}
                        onChange={(e) => setOppSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-paper border border-line rounded-xl text-xs text-ink placeholder:text-muted/60 focus:bg-white focus:border-copper outline-none transition-all"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={oppModeFilter}
                        onChange={(e: any) => setOppModeFilter(e.target.value)}
                        className="bg-paper border border-line rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                      >
                        <option value="All">All Work Modes</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="On-site">On-site</option>
                      </select>
                      <select
                        value={oppTypeFilter}
                        onChange={(e: any) => setOppTypeFilter(e.target.value)}
                        className="bg-paper border border-line rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                      >
                        <option value="All">All Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-line/60">
                    <span>Showing {filteredOpportunities.length} opportunities</span>
                    <button
                      onClick={() => setShowHiddenOpps(!showHiddenOpps)}
                      className="text-xs font-bold text-copper hover:underline"
                    >
                      {showHiddenOpps ? 'Show active recommendations' : 'Show hidden / less relevant'}
                    </button>
                  </div>
                </div>

                {/* Opportunities Cards */}
                <div className="space-y-4">
                  {filteredOpportunities.map((opp) => (
                    <div
                      key={opp.id}
                      className="bg-surface rounded-3xl p-6 border border-line shadow-card space-y-4 hover:border-copper-soft transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-navy">{opp.company}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-paper border border-line font-medium text-muted">
                              {opp.workMode}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-paper border border-line font-medium text-muted">
                              {opp.type}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-navy font-display mt-1">{opp.title}</h3>
                          <p className="text-xs text-muted mt-0.5">{opp.location} · {opp.salaryRange}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-green-100 text-green-900 border border-green-300">
                            {opp.matchScore}% Match
                          </span>
                          <button
                            onClick={() => handleToggleSaveOpp(opp.id)}
                            className="p-2 rounded-xl border border-line hover:bg-paper text-navy transition-colors"
                            title={opp.saved ? 'Unsave' : 'Save opportunity'}
                          >
                            {opp.saved ? <BookmarkCheck className="w-4 h-4 text-copper" /> : <Bookmark className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-body leading-relaxed">{opp.description}</p>

                      {/* Match Rationale Card */}
                      <div className="p-4 rounded-2xl bg-cream border border-copper-soft/60 space-y-2 text-xs">
                        <span className="font-bold text-navy block text-[11px]">Match Rationale & Evidence Bridge:</span>
                        <div className="space-y-1 text-body">
                          {opp.matchRationale.matchingEvidence.map((ev, idx) => (
                            <div key={idx} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-green-700 shrink-0 mt-0.5" />
                              <span>{ev}</span>
                            </div>
                          ))}
                          <div className="flex items-start gap-1.5 text-copper-strong font-medium">
                            <ArrowRight className="w-3.5 h-3.5 text-copper shrink-0 mt-0.5" />
                            <span>Actionable Step: {opp.matchRationale.actionableStep}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-3 border-t border-line/60 text-xs">
                        <button
                          onClick={() => handleToggleLessRelevant(opp.id)}
                          className="text-muted hover:text-navy text-[11px] underline"
                        >
                          {opp.isLessRelevant ? 'Restore to recommendations' : 'Mark as less relevant'}
                        </button>

                        <div className="flex items-center gap-3">
                          <span className="text-muted text-[11px]">{opp.deadline}</span>
                          <button
                            onClick={() => handlePrepareApplication(opp)}
                            className="px-4 py-2 rounded-xl bg-navy hover:bg-copper text-cream font-bold text-xs transition-colors flex items-center gap-1.5"
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
                <div className="bg-surface p-6 rounded-3xl border border-line shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-copper uppercase tracking-wider">Private Workflow</span>
                    <h2 className="text-2xl font-bold text-navy font-display mt-1">Application Tracker</h2>
                    <p className="text-xs text-muted mt-1">All application records and notes remain private to you unless explicitly shared.</p>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                    {['All', 'Saved', 'Ready to apply', 'Submitted', 'Interview or next step'].map((stage) => (
                      <button
                        key={stage}
                        onClick={() => setAppStageFilter(stage)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
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

                <div className="space-y-4">
                  {filteredApplications.map((app) => (
                    <div
                      key={app.id}
                      className="bg-surface rounded-3xl p-6 border border-line shadow-card space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{app.company}</span>
                          <h3 className="text-lg font-bold text-navy font-display mt-0.5">{app.role}</h3>
                          <p className="text-xs text-muted">Deadline: {app.deadline || 'Rolling'} · Last updated: {app.lastUpdated}</p>
                        </div>

                        {/* Stage Selector */}
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

                      {/* Attached Evidence & Missing Steps */}
                      <div className="grid sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-2xl bg-paper border border-line space-y-1.5">
                          <span className="font-bold text-navy block text-[11px]">Selected Evidence for Sharing:</span>
                          {app.selectedEvidence.map((ev, idx) => (
                            <div key={idx} className="flex items-center justify-between text-body">
                              <span>• {ev.title}</span>
                              <span className="font-mono font-bold text-green-700 text-[10px]">{ev.verifiedScore}</span>
                            </div>
                          ))}
                        </div>

                        <div className="p-3.5 rounded-2xl bg-cream border border-copper-soft/60 space-y-1.5">
                          <span className="font-bold text-navy block text-[11px]">Next Recommended Action:</span>
                          <p className="text-body text-[11px] leading-relaxed">{app.nextRecommendedAction}</p>
                        </div>
                      </div>

                      {/* Student Private Notes */}
                      <div className="p-4 rounded-2xl bg-surface-strong border border-line space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-navy text-[11px] flex items-center gap-1.5">
                            <Edit3 className="w-3.5 h-3.5 text-copper" /> Private Student Notes (Visible only to you)
                          </span>
                          {editingNoteAppId !== app.id && (
                            <button
                              onClick={() => {
                                setEditingNoteAppId(app.id);
                                setTempNote(app.studentNotes);
                              }}
                              className="text-copper hover:underline text-[11px] font-bold"
                            >
                              Edit Note
                            </button>
                          )}
                        </div>

                        {editingNoteAppId === app.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={tempNote}
                              onChange={(e) => setTempNote(e.target.value)}
                              rows={3}
                              className="w-full p-2.5 rounded-xl border border-copper bg-paper text-xs outline-none"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingNoteAppId(null)}
                                className="px-3 py-1 rounded-lg border text-xs"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveAppNote(app.id)}
                                className="px-3 py-1 rounded-lg bg-navy text-white text-xs font-bold"
                              >
                                Save Note
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-body text-xs italic">{app.studentNotes || 'No notes added yet.'}</p>
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
                <div className="bg-surface p-6 rounded-3xl border border-line shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-navy text-cream flex items-center justify-center">
                      <Bot className="w-5 h-5 text-copper-soft" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-navy font-display">Context-Aware AI Career Coach</h2>
                      <p className="text-xs text-muted">
                        Advisory recommendations grounded in your verified signals, diagnostic gaps, and target role requirements.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Card */}
                <div className="bg-surface rounded-3xl border border-line shadow-card overflow-hidden flex flex-col h-[520px]">
                  {/* Messages Stream */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-paper/40">
                    {coachMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.sender === 'bot' && (
                          <div className="w-8 h-8 rounded-xl bg-navy text-cream flex items-center justify-center shrink-0 mt-1">
                            <Bot className="w-4 h-4 text-copper-soft" />
                          </div>
                        )}
                        <div
                          className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-navy text-cream rounded-tr-none shadow-xs'
                              : 'bg-white border border-line text-body rounded-tl-none shadow-xs space-y-3'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{msg.text}</div>

                          {msg.signalsUsed && (
                            <div className="pt-2 border-t border-line/60 text-[10px] text-muted space-y-1">
                              <span className="font-bold text-navy block">Signals Used:</span>
                              <div className="flex flex-wrap gap-1">
                                {msg.signalsUsed.map((sig, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded bg-paper border border-line">
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
                              className="w-full py-2 px-3 rounded-xl bg-cream hover:bg-amber-100 text-copper-strong border border-copper-soft/60 font-bold text-[11px] flex items-center justify-between transition-colors"
                            >
                              <span>{msg.suggestedAction.label}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {isCoachThinking && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-xl bg-navy text-cream flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-copper-soft" />
                        </div>
                        <div className="bg-white border border-line p-3 rounded-2xl text-xs text-muted flex items-center gap-2">
                          <span className="w-3 h-3 border-2 border-copper border-t-transparent rounded-full animate-spin" />
                          <span>Evaluating verified signals and opportunity deadlines...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Prompts & Input Bar */}
                  <div className="p-4 bg-surface border-t border-line space-y-3">
                    <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                      {PRESET_PROMPTS.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => handleAskCoach(prompt)}
                          className="px-3 py-1.5 rounded-full bg-cream hover:bg-amber-100 text-copper-strong border border-copper-soft/60 whitespace-nowrap text-xs font-bold transition-colors shrink-0"
                        >
                          ⚡ {prompt}
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handleSendCustomCoach} className="flex gap-2">
                      <input
                        type="text"
                        value={coachInput}
                        onChange={(e) => setCoachInput(e.target.value)}
                        placeholder="Ask your coach anything about skills, courses, or interview prep..."
                        className="flex-1 bg-paper border border-line rounded-xl px-4 py-2.5 text-xs text-ink focus:bg-white focus:border-copper outline-none transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!coachInput.trim() || isCoachThinking}
                        className="px-5 py-2.5 rounded-xl bg-navy hover:bg-copper text-cream font-bold text-xs transition-colors disabled:opacity-50"
                      >
                        Ask
                      </button>
                    </form>

                    <p className="text-[10px] text-muted text-center">
                      Advisory AI guidance based on verified learner signals. Never guarantees placement, salary, or automated selection.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: MESSAGES */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="bg-surface p-6 rounded-3xl border border-line shadow-card flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-copper uppercase tracking-wider">Recruiter Dialogue</span>
                    <h2 className="text-2xl font-bold text-navy font-display mt-1">Direct Recruiter Communications</h2>
                    <p className="text-xs text-muted mt-1">Encrypted messaging with verified hiring managers who reviewed your evidence.</p>
                  </div>
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-300">
                    Active Recruiter Thread
                  </span>
                </div>

                <div className="bg-surface rounded-3xl border border-line shadow-card overflow-hidden flex flex-col h-[500px]">
                  {/* Chat header */}
                  <div className="p-4 bg-navy text-cream flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cream text-navy font-bold flex items-center justify-center text-xs">
                        MZ
                      </div>
                      <div>
                        <p className="font-bold text-xs text-cream">Marcus Vance · Talent Lead</p>
                        <p className="text-[10px] text-ice">Monzo Bank · Product Data Analyst Role</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-copper-soft font-bold">Verified Recruiter</span>
                  </div>

                  {/* Messages list */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-paper/40 text-xs">
                    {recruiterChat.map((m) => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${m.sender === 'student' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`p-3.5 rounded-2xl max-w-[80%] leading-relaxed ${
                            m.sender === 'student'
                              ? 'bg-navy text-cream rounded-tr-none'
                              : 'bg-white border border-line text-navy rounded-tl-none shadow-xs'
                          }`}
                        >
                          {m.text}
                        </div>
                        <span className="text-[10px] text-muted mt-1 px-1">{m.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSendRecruiterMsg} className="p-4 bg-surface border-t border-line flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type your response to Marcus..."
                      className="flex-1 bg-paper border border-line rounded-xl px-4 py-2.5 text-xs text-ink focus:bg-white focus:border-copper outline-none transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="px-5 py-2.5 rounded-xl bg-navy hover:bg-copper text-cream font-bold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" /> Send
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 8: PROFILE & PRIVACY */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-surface p-6 rounded-3xl border border-line shadow-card space-y-2">
                  <span className="text-xs font-bold text-copper uppercase tracking-wider">Consent & Data Ownership</span>
                  <h2 className="text-2xl font-bold text-navy font-display">Student Profile & Privacy Control</h2>
                  <p className="text-xs text-muted leading-relaxed">
                    You have complete ownership of your evidence, diagnostic records, and application history. Skilloryn never exposes private repositories or raw surveillance data without explicit consent.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Identity Card */}
                  <div className="bg-surface rounded-3xl p-6 border border-line shadow-card space-y-4">
                    <h3 className="font-bold text-sm text-navy font-display">Profile Details</h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-muted block mb-1">Full Name</label>
                        <input
                          type="text"
                          defaultValue="Jane Doe"
                          className="w-full p-2.5 bg-paper rounded-xl border border-line text-navy font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-muted block mb-1">Primary Email</label>
                        <input
                          type="email"
                          defaultValue="jane.doe@skilloryn.io"
                          disabled
                          className="w-full p-2.5 bg-paper rounded-xl border border-line text-muted font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-muted block mb-1">Target Career Pathway</label>
                        <select className="w-full p-2.5 bg-paper rounded-xl border border-line text-navy font-semibold">
                          <option>Data Analyst (Level 12)</option>
                          <option>Analytics Engineer</option>
                          <option>Business Intelligence Specialist</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Toggles */}
                  <div className="bg-surface rounded-3xl p-6 border border-line shadow-card space-y-4">
                    <h3 className="font-bold text-sm text-navy font-display">Evidence Sharing Permissions</h3>
                    <div className="space-y-3 text-xs">
                      <label className="flex items-start gap-3 p-3 rounded-2xl bg-paper border border-line cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 mt-0.5 accent-copper rounded" />
                        <div>
                          <span className="font-bold text-navy block">Share Verified Scores with Employers</span>
                          <span className="text-muted text-[11px]">Allow recruiters reviewing applications to see validated assessment scores.</span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 rounded-2xl bg-paper border border-line cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 mt-0.5 accent-copper rounded" />
                        <div>
                          <span className="font-bold text-navy block">Include Anonymized Readiness in Institution Analytics</span>
                          <span className="text-muted text-[11px]">Helps your university design targeted curriculum workshops without sharing personal records.</span>
                        </div>
                      </label>

                      <div className="pt-2">
                        <button
                          onClick={() => alert('Evidence archive exported successfully to JSON/PDF.')}
                          className="w-full py-2.5 rounded-xl border border-line hover:bg-paper font-bold text-xs text-navy transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5 text-copper" /> Export Full Evidence Data Archive
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

      {/* INTERACTIVE DIAGNOSTIC ASSESSMENT MODAL */}
      {diagnosticOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface w-full max-w-xl rounded-3xl shadow-2xl border border-line overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="p-6 bg-navy text-cream flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-copper-soft block">
                  Proctored Diagnostic Assessment
                </span>
                <h3 className="text-lg font-bold font-display text-cream mt-0.5">
                  SQL Window Functions & Analytical Framing
                </h3>
              </div>
              <button
                onClick={handleResetQuiz}
                className="p-1 rounded-lg hover:bg-white/10 text-ice hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {!quizFinished ? (
                <>
                  <div className="flex items-center justify-between text-xs font-bold text-muted">
                    <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                    <span className="text-copper">Timed Assessment</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-paper overflow-hidden border border-line">
                    <div
                      className="h-full bg-copper transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-paper border border-line">
                    <p className="text-sm font-bold text-navy leading-relaxed">
                      {quizQuestions[currentQuestionIndex].question}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {quizQuestions[currentQuestionIndex].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswerQuiz(idx)}
                        className="w-full p-3.5 text-left rounded-xl border border-line bg-white hover:border-copper hover:bg-cream text-xs font-bold text-navy transition-all flex items-center gap-3"
                      >
                        <span className="w-5 h-5 rounded-md bg-paper text-copper text-center leading-5 text-[10px] font-mono shrink-0">
                          0{idx + 1}
                        </span>
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-5">
                  <div className="w-16 h-16 rounded-3xl bg-green-100 text-green-700 mx-auto flex items-center justify-center text-3xl font-bold border border-green-300">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-navy font-display">Diagnostic Verified!</h4>
                    <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
                      Your score has been verified and stamped into your Skill Passport and Learning Roadmap.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-6 px-6 py-4 rounded-2xl bg-paper border border-line">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted block">Verified Score</span>
                      <span className="text-2xl font-extrabold text-green-700 font-mono">
                        {quizScore === 3 ? '96/100' : '92/100'}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-line" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted block">Status</span>
                      <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                        Employer-Validated
                      </span>
                    </div>
                    <div className="h-8 w-px bg-line" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted block">Reward</span>
                      <span className="text-sm font-bold text-copper">+100 EP</span>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={handleResetQuiz}
                      className="px-6 py-3 rounded-xl bg-navy hover:bg-navy-soft text-cream font-bold text-xs transition-colors"
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
