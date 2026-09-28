import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Home, GraduationCap, Briefcase, Trophy, Terminal,
  ClipboardCheck, Video, Users, Puzzle, Award,
  Sparkles, Search, Play, Check, X,
  ArrowRight, RefreshCw, Bookmark, BookmarkCheck,
  Menu, Flame, Zap, MapPin, CheckCircle2, Bot, Send,
  Calendar, Star, FileText, MessageSquare, ChevronRight,
  Eye, EyeOff
} from 'lucide-react';
import { INITIAL_SKILLS, type VerifiableSkill } from '../data/skillsData';
import { INITIAL_ROADMAP, type RoadmapNode } from '../data/roadmapData';
import { INITIAL_OPPORTUNITIES, type Opportunity } from '../data/opportunitiesData';
import { INITIAL_APPLICATIONS, type ApplicationItem, type ApplicationStage } from '../data/applicationsData';
import { type CoachMessage, PRESET_PROMPTS, getCoachResponse } from '../data/aiCoachService';
import SkillPassportBook, { DEFAULT_PROFILE, DEFAULT_SKILLS, DEFAULT_PROJECTS } from '../components/SkillPassportBook';
import TrendingCarousel from '../components/TrendingCarousel';
import { TRENDING_ITEMS, type TrendingItem } from '../data/trendingData';

export type StudentTab =
  | 'home'
  | 'internships'
  | 'jobs'
  | 'competitions'
  | 'simulator'
  | 'mock-tests'
  | 'mock-interview'
  | 'mentorship'
  | 'prep-zone'
  | 'passport'
  | 'applications'
  | 'messages'
  | 'profile'
  // Compatibility aliases
  | 'overview'
  | 'roadmap'
  | 'opportunities'
  | 'coach';

interface Mentor {
  id: string;
  name: string;
  company: string;
  role: string;
  experience: string;
  specialty: string;
  avatar: string;
  rating: number;
  sessionsCompleted: number;
  availableSlots: string[];
}

const MENTORS: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'Arjun Sharma',
    company: 'Swiggy',
    role: 'Staff Data Engineer',
    experience: '8+ yrs exp (Ex-Flipkart)',
    specialty: 'Mock SQL & Hyper-scale Data Pipelines',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    rating: 4.9,
    sessionsCompleted: 142,
    availableSlots: ['Tomorrow at 5:00 PM IST', 'Thursday at 6:30 PM IST', 'Saturday at 11:00 AM IST'],
  },
  {
    id: 'mentor-2',
    name: 'Priya Nair',
    company: 'CRED',
    role: 'Principal Product Analyst',
    experience: '6+ yrs exp',
    specialty: 'Product Sense & Cohort Retention Memos',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    rating: 5.0,
    sessionsCompleted: 98,
    availableSlots: ['Wednesday at 7:00 PM IST', 'Friday at 4:30 PM IST', 'Sunday at 10:00 AM IST'],
  },
  {
    id: 'mentor-3',
    name: 'Vikram Sengupta',
    company: 'Razorpay',
    role: 'Lead SDE (Payments Core)',
    experience: '7+ yrs exp',
    specialty: 'System Design & Fast-Track Referral Prep',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    rating: 4.8,
    sessionsCompleted: 215,
    availableSlots: ['Thursday at 5:00 PM IST', 'Saturday at 2:00 PM IST'],
  },
  {
    id: 'mentor-4',
    name: 'Ananya Roy',
    company: 'Google India',
    role: 'Senior Machine Learning Engineer',
    experience: '5+ yrs exp (IIT Delhi)',
    specialty: 'AI/ML Case Studies & Hackathon Strategy',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    rating: 4.9,
    sessionsCompleted: 87,
    availableSlots: ['Tomorrow at 6:00 PM IST', 'Friday at 8:00 PM IST'],
  },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab mapping with backward-compatibility normalization
  const rawTab = searchParams.get('tab');
  const activeTab: StudentTab = useMemo(() => {
    if (!rawTab || rawTab === 'home' || rawTab === 'overview') return 'home';
    if (rawTab === 'opportunities' || rawTab === 'internships') return 'internships';
    if (rawTab === 'roadmap') return 'prep-zone';
    if (rawTab === 'coach') return 'mock-interview';
    const validTabs: StudentTab[] = [
      'home', 'internships', 'jobs', 'competitions', 'simulator',
      'mock-tests', 'mock-interview', 'mentorship', 'prep-zone',
      'passport', 'applications', 'messages', 'profile'
    ];
    return validTabs.includes(rawTab as StudentTab) ? (rawTab as StudentTab) : 'home';
  }, [rawTab]);

  const setActiveTab = useCallback(
    (tab: StudentTab) => {
      if (tab === 'home') {
        setSearchParams({});
      } else {
        setSearchParams({ tab });
      }
    },
    [setSearchParams]
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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
      text: 'Namaste Jane! 👋 I am your context-aware **AI Career Coach & Interview Simulator**.\n\nI have evaluated your progress for India’s top tech roles at **Swiggy, CRED, and Flipkart**. Your highest-leverage next action is **Window Functions (Node 02)**.\n\nHow can I help you practice or prepare today?',
      timestamp: 'Today at 09:00',
      signalsUsed: ['Target Role: Data Analyst', 'Priority Gap: Window Functions', 'Diagnostic Baseline: 92/100 SQL'],
    },
  ]);
  const [coachInput, setCoachInput] = useState('');
  const [isCoachThinking, setIsCoachThinking] = useState(false);

  // Recruiter Chat State
  const [recruiterChat, setRecruiterChat] = useState<{ id: string; sender: 'recruiter' | 'student'; text: string; time: string }[]>([
    { id: '1', sender: 'recruiter', text: 'Hi Jane, we reviewed your verified SQL diagnostic score and Customer Retention repository for the Product Data Analyst role at Monzo / Swiggy. Impressive execution plans!', time: 'Yesterday at 15:30' },
    { id: '2', sender: 'student', text: 'Thank you! The cohort query optimization reduced sequential table scans by 34%. Happy to walk through the reproducible notebooks.', time: 'Yesterday at 16:15' },
    { id: '3', sender: 'recruiter', text: 'Would you be available for a 30-minute technical discussion next Tuesday?', time: 'Today at 10:20' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Opportunities Search & Filter State
  const [oppSearch, setOppSearch] = useState('');
  const [oppModeFilter, setOppModeFilter] = useState<'All' | 'Remote' | 'Hybrid' | 'On-site'>('All');
  const [oppStipendFilter, setOppStipendFilter] = useState<string>('All');
  const [showHiddenOpps, setShowHiddenOpps] = useState(false);

  // Competitions Filter State
  const [compFilter, setCompFilter] = useState<string>('All');
  const [selectedCompModal, setSelectedCompModal] = useState<TrendingItem | null>(null);

  // Modals

  const [showMentorModal, setShowMentorModal] = useState(false);
  const [mentorFormData, setMentorFormData] = useState({
    name: '', company: '', role: '', specialty: '', hours: '2-4 hrs/week'
  });

  const [bookingMentor, setBookingMentor] = useState<Mentor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  // Diagnostic Quiz Modal State
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Hiring Simulator Sandbox State
  const [simulatorQuery, setSimulatorQuery] = useState(`-- Swiggy Delivery ETA & Surge Multiplier
SELECT 
    order_id,
    zone_id,
    order_timestamp,
    delivery_time_mins,
    AVG(delivery_time_mins) OVER (
        PARTITION BY zone_id 
        ORDER BY order_timestamp 
        ROWS BETWEEN 5 PRECEDING AND CURRENT ROW
    ) AS rolling_avg_eta
FROM swiggy_order_telemetry
WHERE city = 'Bengaluru'
ORDER BY order_timestamp DESC;`);
  const [simulationResult, setSimulationResult] = useState<{
    status: 'idle' | 'running' | 'success' | 'error';
    latencyMs?: number;
    rowsAffected?: number;
    message?: string;
  }>({ status: 'idle' });

  // Sync to LocalStorage
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
      showToast('🎉 Daily check-in complete! +15 Evidence Points added.');
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
      showToast('🏆 Diagnostic passed! +100 EP earned & verified stamp issued.');
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
    showToast('Updated saved preferences');
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
      showToast(`Added ${opp.company} application to your tracker!`);
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
    showToast(`Application stage updated to: ${newStage}`);
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
      const response = getCoachResponse(promptText, {
        studentName: 'Jane Doe',
        targetRole: 'Data Analyst & Insights Specialist',
        priorityGap: 'Window Functions (Node 02)',
        verifiedScore: '92/100 SQL Diagnostic',
        completedMissionsCount: 3,
        activeApplicationsCount: applications.length,
      });
      setCoachMessages((prev) => [...prev, response]);
      setIsCoachThinking(false);
    }, 700);
  };

  const handleSendRecruiterMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: 'student' as const,
      text: chatInput.trim(),
      time: 'Just now',
    };
    setRecruiterChat((prev) => [...prev, newMsg]);
    setChatInput('');
    showToast('Message sent to recruiter');
  };

  const handleRunSimulation = () => {
    setSimulationResult({ status: 'running' });
    setTimeout(() => {
      setSimulationResult({
        status: 'success',
        latencyMs: 14.2,
        rowsAffected: 12480,
        message: 'Partition window execution verified. Peak speedup: 3.4x over sequential scans. +120 Evidence Points awarded!',
      });
      setPoints((p) => p + 120);
      showToast('⚡ Simulation Passed! +120 Evidence Points added.');
    }, 900);
  };


  const handleMentorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowMentorModal(false);
    showToast(`🎉 Thank you, ${mentorFormData.name || 'Mentor'}! Your application is in review.`);
    setMentorFormData({ name: '', company: '', role: '', specialty: '', hours: '2-4 hrs/week' });
  };

  const handleBookMentorConfirm = () => {
    if (!bookingMentor) return;
    showToast(`✅ Mentorship session booked with ${bookingMentor.name} for ${selectedSlot || 'the selected slot'}!`);
    setBookingMentor(null);
    setSelectedSlot('');
  };

  // Filtered Opportunities
  const filteredInternships = useMemo(() => {
    return opportunities.filter((opp) => {
      if (!showHiddenOpps && opp.isLessRelevant) return false;
      const matchesSearch =
        opp.company.toLowerCase().includes(oppSearch.toLowerCase()) ||
        opp.title.toLowerCase().includes(oppSearch.toLowerCase()) ||
        opp.requiredSkills.some((s) => s.toLowerCase().includes(oppSearch.toLowerCase()));
      const matchesMode = oppModeFilter === 'All' || opp.workMode === oppModeFilter;
      const matchesStipend =
        oppStipendFilter === 'All' ||
        (oppStipendFilter === '50k+' && (opp.salaryRange?.includes('50,000') || opp.salaryRange?.includes('60,000') || opp.salaryRange?.includes('55,000'))) ||
        (oppStipendFilter === '40k+' && (opp.salaryRange?.includes('40,000') || opp.salaryRange?.includes('45,000')));
      return matchesSearch && matchesMode && matchesStipend;
    });
  }, [opportunities, oppSearch, oppModeFilter, oppStipendFilter, showHiddenOpps]);

  // Sidebar Menu Items
  const sidebarNavItems = [
    { id: 'home' as StudentTab, label: 'Home', icon: Home },
    { id: 'internships' as StudentTab, label: 'Internships', icon: GraduationCap },
    { id: 'jobs' as StudentTab, label: 'Jobs', icon: Briefcase },
    { id: 'competitions' as StudentTab, label: 'Competitions', icon: Trophy },
    { id: 'simulator' as StudentTab, label: 'Hiring Simulator', icon: Terminal },
    { id: 'mock-tests' as StudentTab, label: 'Mock Tests', icon: ClipboardCheck },
    { id: 'mock-interview' as StudentTab, label: 'Mock Interview', icon: Video },
    { id: 'mentorship' as StudentTab, label: 'Mentorship', icon: Users, hasChevron: true },
    { id: 'prep-zone' as StudentTab, label: 'Prep Zone', icon: Puzzle, hasChevron: true },
    { id: 'passport' as StudentTab, label: 'Skill Passport', icon: Award },
    { id: 'applications' as StudentTab, label: 'Applications', icon: FileText, badge: applications.length.toString() },
    { id: 'messages' as StudentTab, label: 'Messages', icon: MessageSquare, badge: '1' },
  ];

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans relative overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 border border-slate-700 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-sm font-bold">{toastMessage}</p>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200/90 hidden md:flex flex-col z-20 text-slate-800 shrink-0">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-slate-100 justify-between">
          <div
            className="flex flex-col cursor-pointer group"
            onClick={() => navigate('/choose-workspace')}
            title="Switch Workspace"
          >
            <span className="font-black text-xl text-slate-900 tracking-tight block leading-none">
              Skilloryn
            </span>
            <span className="text-[10px] text-indigo-600 font-bold tracking-wider uppercase block mt-1">
              Student Workspace
            </span>
          </div>
        </div>

        {/* Main Navigation Menu */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto no-scrollbar">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const badgeColor = 'badgeColor' in item ? item.badgeColor : undefined;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`ml-auto px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${badgeColor || 'bg-indigo-100 text-indigo-700'}`}>
                    {item.badge}
                  </span>
                )}
                {item.hasChevron && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Student Helper Cards */}
        <div className="p-3.5 border-t border-slate-100 space-y-2.5 bg-slate-50/40">
          {/* Card 1: AI Mock Interview Practice */}
          <div
            onClick={() => setActiveTab('mock-interview')}
            className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100/80 hover:bg-indigo-100/60 transition-colors cursor-pointer flex items-center justify-between gap-2 group"
          >
            <div>
              <p className="text-xs font-bold text-slate-900">AI Mock Interview</p>
              <p className="text-[10px] text-slate-500">Practice live technical rounds.</p>
            </div>
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
              <Video className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: 1-on-1 Mentorship */}
          <div
            onClick={() => setActiveTab('mentorship')}
            className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100/80 hover:bg-purple-100/60 transition-colors cursor-pointer flex items-center justify-between gap-2 group"
          >
            <div>
              <p className="text-xs font-bold text-slate-900">1-on-1 Mentorship</p>
              <p className="text-[10px] text-slate-500">Learn from Swiggy & CRED leads.</p>
            </div>
            <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Top Header Bar */}
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-extrabold text-base text-slate-900">Skilloryn</span>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <h1 className="text-lg font-extrabold text-slate-900 capitalize">
              {sidebarNavItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Data Analyst Pathway
            </span>
          </div>

          {/* Gamification & User Badge */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold">
              <button
                onClick={handleDailyCheckIn}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors"
                title="Click to claim daily check-in"
              >
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="font-bold text-slate-900">{streak} <span className="text-slate-500 font-normal">Days</span></span>
              </button>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200" title="Evidence Points">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-slate-900">{points} <span className="text-slate-500 font-normal">EP</span></span>
              </div>
            </div>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            {/* Profile Avatar */}
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-xs font-bold text-slate-900">Jane Doe</p>
                <p className="text-[10px] text-slate-500">Level 12 Candidate</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-1.5 z-30 shadow-xl max-h-[80vh] overflow-y-auto">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-indigo-600" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* TAB 1: HOME */}
            {activeTab === 'home' && (
              <div className="space-y-6 sm:space-y-8">
                {/* 1. Welcome & Priority Action Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-slate-800">
                  <div className="relative z-10 space-y-4 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/15">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Priority Readiness Mission
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                        Master Window Functions (Node 02)
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                        Window functions are tested in <strong>88% of data analytics interviews at Swiggy & CRED</strong>. Complete this 2-minute diagnostic to verify analytical framing and raise your Swiggy match to <strong>98%</strong>.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                      <button
                        onClick={() => setDiagnosticOpen(true)}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Start 2-Min Diagnostic (+100 EP)
                      </button>
                      <button
                        onClick={handleDailyCheckIn}
                        disabled={checkedInToday}
                        className={`px-5 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                          checkedInToday
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 cursor-default'
                            : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
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

                {/* 2. Embedded Trending Now Carousel (Image 2 Match) */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                  <TrendingCarousel />
                </div>

                {/* 3. Recommended Indian Tech Internships */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Top Internships For You 🇮🇳
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Calibrated directly to your verified SQL and portfolio evidence.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('internships')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      View All ({opportunities.length}) <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {opportunities.slice(0, 2).map((opp) => (
                      <div
                        key={opp.id}
                        className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-card transition-all space-y-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
                              {opp.company}
                            </span>
                            <h4 className="text-base font-bold text-slate-900 mt-0.5">{opp.title}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {opp.location} · {opp.workMode}
                            </p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 shrink-0">
                            {opp.matchScore}% Match
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                          <span className="font-extrabold text-slate-900 font-mono">
                            {opp.salaryRange || opp.stipend}
                          </span>
                          <button
                            onClick={() => handlePrepareApplication(opp)}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs transition-colors flex items-center gap-1"
                          >
                            <span>Apply</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Quick Readiness & Skill Passport Gateway */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Verified Evidence Summary */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-slate-900">Verified Evidence Signals</h4>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        3 Verified
                      </span>
                    </div>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-semibold text-slate-800">Advanced SQL Diagnostic</span>
                        <span className="font-mono font-bold text-emerald-700">92/100 · Verified</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-semibold text-slate-800">Customer Churn Model</span>
                        <span className="font-mono font-bold text-blue-700">4 Artifacts · Reviewed</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-semibold text-slate-800">Pricing Experiment Memo</span>
                        <span className="font-mono font-bold text-emerald-700">86/100 · Assessed</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('passport')}
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:text-indigo-600 border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      Open 3D Skill Passport <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Hiring Simulator Quick Trigger */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                          Interactive Challenge
                        </span>
                        <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" /> +120 EP
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900">
                        Swiggy Delivery ETA & Surge Simulator
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Execute real-time hyper-local rider partition queries in our in-browser SQL engine.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('simulator')}
                      className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Terminal className="w-3.5 h-3.5" /> Launch Hiring Simulator
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: INTERNSHIPS (INDIA CENTRIC) */}
            {activeTab === 'internships' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      Internships
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verified proof-of-work hiring at top tech teams.
                    </p>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={oppModeFilter}
                      onChange={(e) => setOppModeFilter(e.target.value as any)}
                      className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none"
                    >
                      <option value="All">All Locations & Modes</option>
                      <option value="Remote">Remote Only</option>
                      <option value="Hybrid">Hybrid (Bengaluru/Gurgaon)</option>
                      <option value="On-site">On-site</option>
                    </select>

                    <select
                      value={oppStipendFilter}
                      onChange={(e) => setOppStipendFilter(e.target.value)}
                      className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none"
                    >
                      <option value="All">All Stipends</option>
                      <option value="50k+">₹50,000+ / month</option>
                      <option value="40k+">₹40,000+ / month</option>
                    </select>

                    <button
                      onClick={() => setShowHiddenOpps(!showHiddenOpps)}
                      className={`text-xs font-semibold px-3 py-2 rounded-xl border flex items-center gap-1 transition-colors ${
                        showHiddenOpps
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {showHiddenOpps ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showHiddenOpps ? 'Hide Archived' : 'Show Archived'}</span>
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={oppSearch}
                    onChange={(e) => setOppSearch(e.target.value)}
                    placeholder="Search by company, role, or skill (e.g. Swiggy, CRED, SQL, Python)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
                  />
                </div>

                {/* Opportunities Cards */}
                <div className="space-y-4">
                  {filteredInternships.map((opp) => (
                    <div
                      key={opp.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card hover:border-indigo-300 transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold uppercase text-indigo-600">
                              {opp.company}
                            </span>
                            {opp.ppiPotential && (
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                                PPI Available
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">{opp.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                            <span className="flex items-center gap-1 font-semibold text-slate-700">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {opp.location} ({opp.workMode})
                            </span>
                            <span>·</span>
                            <span className="font-extrabold text-slate-900 font-mono">
                              {opp.salaryRange || opp.stipend}
                            </span>
                            {opp.duration && (
                              <>
                                <span>·</span>
                                <span className="text-slate-500">{opp.duration}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:self-start">
                          <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {opp.matchScore}% Match
                          </span>
                          <button
                            onClick={() => handleToggleSaveOpp(opp.id)}
                            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                            title={opp.saved ? 'Saved' : 'Save opportunity'}
                          >
                            {opp.saved ? <BookmarkCheck className="w-4 h-4 text-indigo-600" /> : <Bookmark className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleToggleLessRelevant(opp.id)}
                            className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors text-xs"
                            title={opp.isLessRelevant ? 'Restore opportunity' : 'Hide / mark less relevant'}
                          >
                            {opp.isLessRelevant ? 'Restore' : 'Hide'}
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {opp.description}
                      </p>

                      {/* Match Rationale Breakdown */}
                      <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-2 text-xs">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                          <span>Why you match:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                          {opp.matchRationale.matchingEvidence.map((ev, i) => (
                            <li key={i}>{ev}</li>
                          ))}
                        </ul>
                        <div className="pt-1 text-slate-700">
                          <strong className="text-slate-900">Next step:</strong> {opp.matchRationale.actionableStep}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex flex-wrap gap-1.5">
                          {opp.requiredSkills.map((sk) => (
                            <span key={sk} className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                              {sk}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => handlePrepareApplication(opp)}
                          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 shadow-xs"
                        >
                          <span>Prepare Application</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: JOBS */}
            {activeTab === 'jobs' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Graduate & Early Career Tech Jobs 💼
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Full-time high-growth software and analytics roles across India and global remote teams.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Job 1: Razorpay */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-black uppercase text-indigo-600">Razorpay</span>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5">Associate Data Analyst</h3>
                        <p className="text-xs text-slate-500">Bengaluru · Hybrid</p>
                      </div>
                      <span className="font-mono font-black text-xs text-slate-900 px-2.5 py-1 rounded-full bg-slate-100">
                        ₹18 - 24 LPA
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Lead payment telemetry reconciliation, merchant churn curves, and instant settlements optimization.
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        93% Match Fit
                      </span>
                      <button
                        onClick={() => setActiveTab('passport')}
                        className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        Submit Passport <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Job 2: CRED */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-black uppercase text-indigo-600">CRED</span>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5">Junior Analytics Engineer</h3>
                        <p className="text-xs text-slate-500">Bengaluru · On-site</p>
                      </div>
                      <span className="font-mono font-black text-xs text-slate-900 px-2.5 py-1 rounded-full bg-slate-100">
                        ₹22 - 30 LPA
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Build high-throughput clickstream data models and credit card reward behavioral clusters.
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        89% Match Fit
                      </span>
                      <button
                        onClick={() => setActiveTab('passport')}
                        className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        Submit Passport <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Job 3: Flipkart */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-black uppercase text-indigo-600">Flipkart</span>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5">Supply Chain Systems Analyst</h3>
                        <p className="text-xs text-slate-500">Bengaluru · Hybrid</p>
                      </div>
                      <span className="font-mono font-black text-xs text-slate-900 px-2.5 py-1 rounded-full bg-slate-100">
                        ₹16 - 22 LPA
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Optimize automated warehouse fulfillment routing, demand surges, and inventory forecasting.
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        91% Match Fit
                      </span>
                      <button
                        onClick={() => setActiveTab('passport')}
                        className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        Submit Passport <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Job 4: Monzo Bank */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-black uppercase text-indigo-600">Monzo Bank</span>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5">Product Data Analyst</h3>
                        <p className="text-xs text-slate-500">London / Remote</p>
                      </div>
                      <span className="font-mono font-black text-xs text-slate-900 px-2.5 py-1 rounded-full bg-slate-100">
                        £42,000 - £50,000
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Design executive product retention metrics and test customer acquisition flows with reproducible code.
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        94% Match Fit
                      </span>
                      <button
                        onClick={() => setActiveTab('passport')}
                        className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        Submit Passport <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: COMPETITIONS & WEBINARS (MATCHING IMAGE 2) */}
            {activeTab === 'competitions' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Competitions, Hackathons & Webinars 🏆
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pre-Placement Interview (PPI) opportunities, cash prize pools in ₹ Lakhs, and certificates.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 pb-1">
                  {['All', 'competition', 'hackathon', 'degree'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setCompFilter(f)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        compFilter === f
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {f === 'All' ? 'All Live Challenges' : f === 'competition' ? 'Campus Championships' : f === 'hackathon' ? 'Hackathons' : 'Webinars & Degrees'}
                    </button>
                  ))}
                </div>

                {/* Competitions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {TRENDING_ITEMS.filter((item) => compFilter === 'All' || item.type === compFilter).map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-3xl p-6 bg-gradient-to-br ${item.gradientClass} ${item.textColor} border border-black/5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group`}
                    >
                      <div className="space-y-3 relative z-10">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider">
                            {item.brand}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                            {item.category}
                          </span>
                        </div>

                        <h3 className="text-xl font-black tracking-tight leading-snug">
                          {item.title}
                        </h3>

                        {item.subtitle && (
                          <p className="text-xs opacity-80 leading-relaxed font-medium">
                            {item.subtitle}
                          </p>
                        )}

                        <ul className="space-y-1.5 pt-2 text-xs">
                          {item.bullets.map((b, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="opacity-70 mt-0.5">•</span>
                              <span className="font-semibold">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-5 mt-4 border-t border-black/10 relative z-10 space-y-3">
                        <div className="flex items-center justify-between text-[11px] opacity-80 font-medium">
                          <span>{item.registeredCount}</span>
                          <span>{item.deadline}</span>
                        </div>

                        <button
                          onClick={() => setSelectedCompModal(item)}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 ${item.buttonColor}`}
                        >
                          <span>{item.buttonText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: HIRING SIMULATOR */}
            {activeTab === 'simulator' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Interactive Company Hiring Simulator 💻
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Simulate real-world engineering and analytics assignments from Swiggy & Flipkart before your interviews.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-card space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-orange-600">Swiggy</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                          Hyper-local Analytics
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        Challenge: Rolling Delivery ETA & Surge Window Multipliers
                      </h3>
                      <p className="text-xs text-slate-500">
                        Compute 15-minute moving delivery averages partitioned by zone without table scan spikes.
                      </p>
                    </div>

                    <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5 self-start">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> Reward: +120 EP
                    </span>
                  </div>

                  {/* SQL Code Sandbox */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                      <span>query_editor.sql</span>
                      <span>PostgreSQL 16 Dialect</span>
                    </div>
                    <textarea
                      value={simulatorQuery}
                      onChange={(e) => setSimulatorQuery(e.target.value)}
                      rows={10}
                      className="w-full p-4 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Benchmark target: Execution time &lt; 25ms
                    </span>
                    <button
                      onClick={handleRunSimulation}
                      disabled={simulationResult.status === 'running'}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all active:scale-95 disabled:opacity-50"
                    >
                      {simulationResult.status === 'running' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Simulating...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>Run Simulation</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Execution Results */}
                  {simulationResult.status === 'success' && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Execution Plan Passed! Benchmark Met</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] pt-1">
                        <div>Runtime: <strong>{simulationResult.latencyMs} ms</strong></div>
                        <div>Rows Evaluated: <strong>{simulationResult.rowsAffected?.toLocaleString()}</strong></div>
                        <div>Indexed Scans: <strong>100%</strong></div>
                      </div>
                      <p className="text-slate-600 pt-1 font-sans">{simulationResult.message}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 6: MOCK TESTS */}
            {activeTab === 'mock-tests' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Diagnostic Assessment Lab & Mock Tests ⏱️
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Timed adaptive micro-diagnostics. Passed benchmarks stamp verified credentials directly into your Skill Passport.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Test 1 */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-indigo-600">Adaptive Diagnostic</span>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5">Advanced SQL & Window Functions</h3>
                        <p className="text-xs text-slate-500">3 Questions · 2 Minutes</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        +100 EP
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Evaluate partition clauses, frame bounding, rolling metrics, and sequential scan mitigations.
                    </p>
                    <button
                      onClick={() => setDiagnosticOpen(true)}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Start Adaptive Test
                    </button>
                  </div>

                  {/* Test 2 */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-indigo-600">Adaptive Diagnostic</span>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5">Python Vectorization & Pandas Pipelines</h3>
                        <p className="text-xs text-slate-500">5 Questions · 4 Minutes</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        +150 EP
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Vectorized groupby operations, datetime transformations, memory allocation heuristics, and NumPy speedups.
                    </p>
                    <button
                      onClick={() => showToast('Python test loaded. Ready for test run.')}
                      className="w-full py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Take Python Assessment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: MOCK INTERVIEW */}
            {activeTab === 'mock-interview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    AI Career Coach & Mock Interview Simulator 🎙️
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Simulate technical and behavioral interviews calibrated for Indian tech employers (Swiggy, CRED, Razorpay).
                  </p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 flex flex-col h-[520px]">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                    {coachMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-slate-900 text-white rounded-tr-xs'
                              : 'bg-slate-100 text-slate-900 rounded-tl-xs'
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.text}</p>
                          {msg.signalsUsed && (
                            <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex flex-wrap gap-1">
                              {msg.signalsUsed.map((s, i) => (
                                <span key={i} className="text-[9.5px] px-2 py-0.5 rounded-full bg-white/70 text-slate-600 font-bold">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                      </div>
                    ))}
                    {isCoachThinking && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold p-2">
                        <Bot className="w-4 h-4 animate-bounce text-indigo-600" />
                        <span>Evaluating your candidate telemetry...</span>
                      </div>
                    )}
                  </div>

                  {/* Preset Questions */}
                  <div className="pt-3 pb-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {PRESET_PROMPTS.slice(0, 3).map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAskCoach(prompt)}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  {/* Input Field */}
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={coachInput}
                      onChange={(e) => setCoachInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && coachInput.trim()) {
                          handleAskCoach(coachInput);
                          setCoachInput('');
                        }
                      }}
                      placeholder="Ask for interview questions, SQL guidance, or Swiggy preparation..."
                      className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => {
                        if (coachInput.trim()) {
                          handleAskCoach(coachInput);
                          setCoachInput('');
                        }
                      }}
                      className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: MENTORSHIP */}
            {activeTab === 'mentorship' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      1-on-1 Verified Tech Mentorship 🤝
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Connect with senior engineers and product leads from Swiggy, CRED, Google India & Razorpay.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowMentorModal(true)}
                    className="px-4 py-2 rounded-xl border border-purple-300 bg-purple-50 text-purple-700 font-bold text-xs hover:bg-purple-100 transition-colors self-start"
                  >
                    + Become a Mentor
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {MENTORS.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card hover:border-indigo-300 transition-all space-y-4"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900">{m.name}</h3>
                            <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                              <Star className="w-3.5 h-3.5 fill-current" /> {m.rating}
                            </span>
                          </div>
                          <p className="text-xs font-extrabold text-indigo-600 mt-0.5">
                            {m.role} @ {m.company}
                          </p>
                          <p className="text-[11px] text-slate-500">{m.experience}</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
                          Specialty
                        </span>
                        <p className="font-semibold text-slate-800 mt-0.5">{m.specialty}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-xs text-slate-500">
                          {m.sessionsCompleted} sessions completed
                        </span>
                        <button
                          onClick={() => {
                            setBookingMentor(m);
                            setSelectedSlot(m.availableSlots[0]);
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                        >
                          <Calendar className="w-3.5 h-3.5" /> Book Session
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 9: PREP ZONE & ROADMAP */}
            {activeTab === 'prep-zone' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Learning Roadmap & Prep Zone 📚
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified milestone progression with interactive cheat sheets and diagnostic assessments.
                  </p>
                </div>

                {/* Progression Tree */}
                <div className="space-y-4">
                  {roadmap.map((node) => (
                    <div
                      key={node.id}
                      className={`p-6 rounded-3xl border transition-all ${
                        node.state === 'completed'
                          ? 'bg-white border-emerald-200 shadow-xs'
                          : node.state === 'active'
                          ? 'bg-white border-indigo-400 shadow-md ring-2 ring-indigo-100'
                          : 'bg-slate-50 border-slate-200 opacity-70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-400">
                              Node 0{node.id}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                node.state === 'completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : node.state === 'active'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {node.state.toUpperCase()}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900">{node.title}</h3>
                          <p className="text-xs text-slate-600">{node.whyItMatters}</p>
                        </div>

                        {node.score && (
                          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 shrink-0">
                            {node.score}
                          </span>
                        )}
                      </div>

                      {node.state === 'active' && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs text-indigo-700 font-semibold">
                            Priority gap for Swiggy & CRED applications
                          </span>
                          <button
                            onClick={() => setDiagnosticOpen(true)}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" /> Verify Node (+100 EP)
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 10: SKILL PASSPORT (HERO PRODUCT WITH 3D FLIP) */}
            {activeTab === 'passport' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Verified Skill Passport 🛂
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your tamper-proof digital passport with verified stamps, reproducible GitHub artifacts, and biometric ID.
                  </p>
                </div>

                <div className="flex justify-center">
                  <SkillPassportBook
                    profile={DEFAULT_PROFILE}
                    skills={DEFAULT_SKILLS}
                    projects={DEFAULT_PROJECTS}
                    passportId="SKY-DA-9482-JANE"
                    isInteractivePreview={false}
                    showCoverByDefault={true}
                  />
                </div>
              </div>
            )}

            {/* TAB 11: APPLICATIONS TRACKER */}
            {activeTab === 'applications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      Application Tracker 📋
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Track verified submissions, missing preparation steps, and stage progressions.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-extrabold uppercase text-indigo-600">{app.company}</span>
                          <h3 className="text-base font-bold text-slate-900 mt-0.5">{app.role}</h3>
                        </div>

                        {/* Stage Selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-semibold">Stage:</span>
                          <select
                            value={app.stage}
                            onChange={(e) => handleUpdateAppStage(app.id, e.target.value as ApplicationStage)}
                            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none"
                          >
                            <option value="Saved">Saved</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Interview or next step">Interview</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                          <span className="font-bold text-slate-700 block mb-1">Attached Verified Evidence:</span>
                          <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                            {app.selectedEvidence.map((ev, i) => (
                              <li key={i}>{ev.title} ({ev.verifiedScore || ev.type})</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
                          <span className="font-bold text-amber-900 block mb-1">Recommended Next Step:</span>
                          <p className="text-amber-800">{app.nextRecommendedAction}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 12: RECRUITER MESSAGES */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Recruiter In-App Messenger 💬
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Direct communication with verified talent partners and recruiters.
                  </p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 flex flex-col h-[520px]">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center">
                      MZ
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Monzo Bank & Swiggy Talent Acquisition</h4>
                      <p className="text-[10px] text-emerald-600 font-bold">Active Recruiter Verified</p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 py-4">
                    {recruiterChat.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                            msg.sender === 'student'
                              ? 'bg-slate-900 text-white rounded-tr-xs'
                              : 'bg-slate-100 text-slate-900 rounded-tl-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendRecruiterMessage();
                      }}
                      placeholder="Reply to recruiter regarding technical interview availability..."
                      className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={handleSendRecruiterMessage}
                      className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 13: PROFILE & PRIVACY */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Candidate Profile & Privacy Controls 🛡️
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Consent-first data sharing and verified identification ledger.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
                  <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-300 flex items-center justify-center font-black text-xl shadow-xs">
                      JD
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Jane Doe</h3>
                      <p className="text-xs text-slate-500">Level 12 Candidate · Data Analyst Pathway</p>
                      <p className="text-xs text-indigo-600 font-mono mt-0.5">ID: SKY-DA-9482-JANE</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <h4 className="font-bold text-slate-900">Consent & Recruiter Visibility</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded text-indigo-600 w-4 h-4" />
                        <span className="text-slate-700">Allow verified employers (Swiggy, CRED) to inspect my Skill Passport.</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded text-indigo-600 w-4 h-4" />
                        <span className="text-slate-700">Include timestamped diagnostic results in anonymous talent pool indexing.</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded text-indigo-600 w-4 h-4" />
                        <span className="text-slate-700">Receive fast-track interview invitations via in-app messenger.</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
      {/* BECOME A MENTOR MODAL */}
      {showMentorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Join the Skilloryn Mentor Network</h3>
                <p className="text-xs text-slate-500">Guide high-potential Indian students through mock interviews & code reviews.</p>
              </div>
              <button onClick={() => setShowMentorModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMentorSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Siddharth Verma"
                  value={mentorFormData.name}
                  onChange={(e) => setMentorFormData({ ...mentorFormData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Company</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swiggy, CRED, Google"
                    value={mentorFormData.company}
                    onChange={(e) => setMentorFormData({ ...mentorFormData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Data Analyst"
                    value={mentorFormData.role}
                    onChange={(e) => setMentorFormData({ ...mentorFormData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mentoring Specialty</label>
                <input
                  type="text"
                  placeholder="e.g. Mock SQL Interviews, System Design, Resume Roasts"
                  value={mentorFormData.specialty}
                  onChange={(e) => setMentorFormData({ ...mentorFormData, specialty: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMentorModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MENTOR SESSION BOOKING MODAL */}
      {bookingMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Book 1-on-1 Session</h3>
                <p className="text-xs text-slate-500">{bookingMentor.name} · {bookingMentor.role} @ {bookingMentor.company}</p>
              </div>
              <button onClick={() => setBookingMentor(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="font-bold text-slate-700">Choose Available Slot (IST):</p>
              {bookingMentor.availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`w-full p-3 rounded-xl border text-left font-medium transition-all ${
                    selectedSlot === slot
                      ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setBookingMentor(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleBookMentorConfirm}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPETITION REGISTRATION MODAL */}
      {selectedCompModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-black uppercase text-rose-600">{selectedCompModal.brand}</span>
                <h3 className="text-lg font-black text-slate-900">{selectedCompModal.title}</h3>
              </div>
              <button onClick={() => setSelectedCompModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">{selectedCompModal.subtitle}</p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <p className="font-bold text-slate-800">Included Perks:</p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  {selectedCompModal.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Your Skill Passport (Jane Doe) will be automatically linked for PPI fast-track.</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedCompModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast(`🎉 Registered for ${selectedCompModal.brand} ${selectedCompModal.title}!`);
                  setSelectedCompModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
              >
                Confirm Registration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIAGNOSTIC QUIZ MODAL */}
      {diagnosticOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            {!quizFinished ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-indigo-600">Adaptive Diagnostic Assessment</span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Question {currentQuestionIndex + 1} of {quizQuestions.length}
                    </h3>
                  </div>
                  <button onClick={handleResetQuiz} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    {quizQuestions[currentQuestionIndex].question}
                  </p>

                  <div className="space-y-2">
                    {quizQuestions[currentQuestionIndex].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswerQuiz(i)}
                        className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-left text-xs font-semibold text-slate-700 transition-all flex items-center justify-between group"
                      >
                        <span>{opt}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Diagnostic Passed!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  You scored <strong>{quizScore} / {quizQuestions.length}</strong>. Your SQL window functions competency is verified and timestamped on your Skill Passport.
                </p>
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold inline-block">
                  +100 Evidence Points Earned
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleResetQuiz}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
