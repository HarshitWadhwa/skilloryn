import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import logoImg from '../assets/skilloryn-logo.png';
import {
  Users, Briefcase, FileCheck, MessageSquare, Building2,
  CheckCircle2, Search, ArrowRight, ArrowLeft,
  ChevronRight, ExternalLink, ShieldCheck, Star, Send,
  Plus, RefreshCw, Menu, X
} from 'lucide-react';
import { INITIAL_CANDIDATES, type CandidateReviewItem } from '../data/companyData';

type CompanyTab = 'overview' | 'opportunities' | 'candidates' | 'feedback' | 'messages' | 'profile';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-driven Tab Navigation (for browser/phone back-button support)
  const tabParam = searchParams.get('tab') as CompanyTab | null;
  const activeTab: CompanyTab =
    tabParam && ['overview', 'opportunities', 'candidates', 'feedback', 'messages', 'profile'].includes(tabParam)
      ? tabParam
      : 'overview';

  const setActiveTab = useCallback(
    (tab: CompanyTab) => {
      if (tab === 'overview') {
        setSearchParams({});
      } else {
        setSearchParams({ tab });
      }
    },
    [setSearchParams]
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      window.history.pushState({ modal: 'mobileMenu' }, '');
      const onPopState = () => {
        setMobileMenuOpen(false);
      };
      window.addEventListener('popstate', onPopState);
      return () => {
        window.removeEventListener('popstate', onPopState);
      };
    }
  }, [mobileMenuOpen]);

  const [candidates, setCandidates] = useState<CandidateReviewItem[]>(() => {
    const saved = localStorage.getItem('skilloryn_company_candidates');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
  });

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('cand-jane-doe');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [feedbackSkill, setFeedbackSkill] = useState('Advanced SQL & Window Functions');
  const [feedbackScore, setFeedbackScore] = useState(5);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [feedbackAction, setFeedbackAction] = useState('');

  const [chatMessages, setChatMessages] = useState<{ id: string; sender: 'recruiter' | 'candidate'; text: string; time: string }[]>([
    { id: '1', sender: 'recruiter', text: 'Hi Jane, we reviewed your verified SQL diagnostic score and Customer Retention repository for the Product Data Analyst role at Monzo. Impressive execution plans!', time: 'Yesterday at 15:30' },
    { id: '2', sender: 'candidate', text: 'Thank you! The cohort query optimization reduced sequential table scans by 34%. Happy to walk through the reproducible notebooks.', time: 'Yesterday at 16:15' },
    { id: '3', sender: 'recruiter', text: 'Would you be available for a 30-minute technical discussion next Tuesday?', time: 'Today at 10:20' },
  ]);
  const [newMsgText, setNewMsgText] = useState('');

  const [companyRoles] = useState([
    {
      id: 'cr-1',
      title: 'Product Data Analyst (Growth & Retention)',
      department: 'Product Growth Squad',
      applicantsCount: 14,
      verifiedMatchesCount: 6,
      requiredEvidence: ['Advanced SQL (90+)', 'A/B Testing Memo', 'Cohort Retention Repo'],
      status: 'Active',
      deadline: 'Sep 12, 2026',
    },
    {
      id: 'cr-2',
      title: 'Junior Analytics Engineer',
      department: 'Data Platform Squad',
      applicantsCount: 9,
      verifiedMatchesCount: 3,
      requiredEvidence: ['SQL Modeling', 'Python ETL', 'GitHub Artifacts'],
      status: 'Active',
      deadline: 'Sep 25, 2026',
    },
  ]);

  useEffect(() => {
    localStorage.setItem('skilloryn_company_candidates', JSON.stringify(candidates));
  }, [candidates]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  const handleUpdateStage = (candidateId: string, newStage: CandidateReviewItem['stage']) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
    );
    showToast(`Candidate stage updated to: ${newStage}`);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackNote.trim()) return;

    const newFeedback = {
      skillId: feedbackSkill.toLowerCase().replace(/\s+/g, '-'),
      skillName: feedbackSkill,
      score: feedbackScore,
      constructiveNote: feedbackNote,
      suggestedAction: feedbackAction || 'Continue ongoing roadmap milestones.',
      submittedAt: 'Just now',
    };

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === selectedCandidateId
          ? { ...c, structuredFeedback: [newFeedback, ...c.structuredFeedback] }
          : c
      )
    );

    setFeedbackNote('');
    setFeedbackAction('');
    showToast('Constructive feedback submitted to candidate!');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;

    const msg = {
      id: `msg-${Date.now()}`,
      sender: 'recruiter' as const,
      text: newMsgText,
      time: 'Just now',
    };

    setChatMessages((prev) => [...prev, msg]);
    setNewMsgText('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `cand-${Date.now()}`,
          sender: 'candidate',
          text: 'Thank you for the update! Tuesday at 14:00 BST works perfectly for me.',
          time: 'Just now',
        },
      ]);
    }, 1200);
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.appliedRole.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'All' || c.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const navItems = [
    { id: 'overview' as CompanyTab, label: 'Company Overview', icon: Users },
    { id: 'opportunities' as CompanyTab, label: 'Opportunities', icon: Briefcase },
    { id: 'candidates' as CompanyTab, label: 'Candidate Review', icon: FileCheck },
    { id: 'feedback' as CompanyTab, label: 'Feedback', icon: Star },
    { id: 'messages' as CompanyTab, label: 'Messages', icon: MessageSquare },
    { id: 'profile' as CompanyTab, label: 'Organisation Profile', icon: Building2 },
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

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200/90 hidden md:flex flex-col z-20 text-slate-800 shrink-0">
        <div className="h-16 flex items-center px-4 border-b border-slate-100 justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate('/choose-workspace')}
            title="Switch Workspace"
          >
            <img
              src={logoImg}
              alt="SkillOryn"
              className="h-8 sm:h-9 w-auto object-contain group-hover:opacity-90 transition-opacity"
            />
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
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
                {item.id === 'candidates' && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-700 font-extrabold">
                    {candidates.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3.5 border-t border-slate-100 space-y-1.5 bg-slate-50/40">
          <button
            onClick={() => navigate('/choose-workspace')}
            className="w-full flex items-center justify-between text-slate-600 hover:text-slate-900 text-xs font-semibold p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" /> Switch Workspace
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <Link
            to="/sign-in"
            className="w-full flex items-center justify-between text-slate-500 hover:text-rose-600 text-xs font-semibold p-2.5 rounded-xl hover:bg-rose-50/60 transition-colors"
          >
            <span>Sign Out</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* VIEWPORT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-extrabold text-base text-slate-900">Skilloryn</span>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <h1 className="text-lg font-extrabold text-slate-900 capitalize">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Monzo Bank Hiring Pipeline
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block leading-tight">
              <p className="text-xs font-bold text-slate-900">Marcus Vance</p>
              <p className="text-[10px] text-slate-500">Talent Lead · Monzo</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              MV
            </div>
          </div>
        </header>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-1.5 z-30 shadow-xl">
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-indigo-600" />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'candidates' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {candidates.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 sm:space-y-8">
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-slate-800">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold border border-white/15">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Evidence-First Hiring Engine
                      </div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                        Candidate Talent Pipeline
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Review candidates filtered strictly by verified diagnostic scores and reproducible code artifacts.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('candidates')}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all shrink-0 active:scale-95"
                    >
                      <span>Review Candidates ({candidates.length})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Active Pipeline</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{candidates.length} Candidates</span>
                    <p className="text-xs text-emerald-600 font-semibold pt-1">1 in Technical Review (Jane Doe)</p>
                  </div>

                  <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Average SQL Score</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 block">94/100</span>
                    <p className="text-xs text-slate-500 pt-1">Verified via proctored diagnostics</p>
                  </div>

                  <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Published Openings</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{companyRoles.length} Active</span>
                    <p className="text-xs text-slate-500 pt-1">23 evidence packets received</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: OPPORTUNITIES */}
            {activeTab === 'opportunities' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Opportunity Publisher</span>
                    <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">Published Role Requirements</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Candidates match based on explicit evidence benchmarks you require.</p>
                  </div>
                  <button
                    onClick={() => alert('New opportunity creation modal will open in the next sprint.')}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-xs shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Publish New Role
                  </button>
                </div>

                <div className="space-y-5">
                  {companyRoles.map((role) => (
                    <div key={role.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-slate-400">{role.department}</span>
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{role.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Deadline: {role.deadline}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
                          {role.status}
                        </span>
                      </div>

                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-100 text-sm space-y-2">
                        <span className="font-bold text-slate-800 block text-xs">Required Evidence Criteria:</span>
                        <div className="flex flex-wrap gap-2">
                          {role.requiredEvidence.map((req, i) => (
                            <span key={i} className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium text-xs">
                              ✓ {req}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs sm:text-sm">
                        <span className="font-bold text-slate-700">{role.applicantsCount} Applicants · {role.verifiedMatchesCount} High Matches</span>
                        <button
                          onClick={() => setActiveTab('candidates')}
                          className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          Inspect Applicant Evidence <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: CANDIDATES */}
            {activeTab === 'candidates' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Candidate Evidence Review</span>
                    <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">Applicant Dossiers</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Review only evidence explicitly shared by the student under consent rules.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search candidate..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-500"
                      />
                    </div>
                    {['All', 'Screening', 'Technical Review', 'Interview', 'Offer'].map((stg) => (
                      <button
                        key={stg}
                        onClick={() => setStageFilter(stg)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          stageFilter === stg
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                        }`}
                      >
                        {stg}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 items-start">
                  <div className="space-y-3">
                    {filteredCandidates.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCandidateId(c.id)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                          selectedCandidateId === c.id
                            ? 'bg-indigo-50/70 border-indigo-400 shadow-xs'
                            : 'bg-white border-slate-200/80 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{c.appliedRole}</p>
                          </div>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {c.overallMatch}% Match
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-slate-100 text-xs">
                          <span className="font-semibold text-slate-700">{c.stage}</span>
                          <span className="text-slate-400">{c.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{selectedCandidate.targetRole}</span>
                        <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{selectedCandidate.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{selectedCandidate.location} · Applied: {selectedCandidate.appliedRole}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Stage:</span>
                        <select
                          value={selectedCandidate.stage}
                          onChange={(e: any) => handleUpdateStage(selectedCandidate.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
                        >
                          <option value="Screening">Screening</option>
                          <option value="Technical Review">Technical Review</option>
                          <option value="Interview">Interview</option>
                          <option value="Offer">Offer</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1 text-xs sm:text-sm">
                      <span className="font-bold text-indigo-900 block text-xs">Match Rationale:</span>
                      <p className="text-slate-700 leading-relaxed">{selectedCandidate.matchExplanation}</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Verified Skill Evidence</h4>
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        {selectedCandidate.verifiedSkills.map((sk, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 text-xs sm:text-sm">{sk.name}</span>
                              <span className="font-mono font-bold text-emerald-700 text-xs">{sk.score}</span>
                            </div>
                            <p className="text-xs text-slate-500">{sk.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Submitted Project Artifacts</h4>
                      <div className="space-y-2.5">
                        {selectedCandidate.submittedEvidence.map((ev, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                            <div>
                              <p className="font-bold text-slate-900">{ev.title}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{ev.summary}</p>
                            </div>
                            <a
                              href={ev.url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-indigo-600 font-bold text-xs flex items-center gap-1.5 shrink-0 ml-3 shadow-2xs"
                            >
                              Inspect Code <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex gap-2.5">
                        <button
                          onClick={() => handleUpdateStage(selectedCandidate.id, 'Interview')}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
                        >
                          Schedule Technical Interview
                        </button>
                        <button
                          onClick={() => setActiveTab('feedback')}
                          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs"
                        >
                          Provide Structured Feedback
                        </button>
                      </div>

                      <button
                        onClick={() => setActiveTab('messages')}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        Message Candidate <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: FEEDBACK */}
            {activeTab === 'feedback' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Candidate Development</span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">Provide Structured Feedback</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Feedback is connected directly to a skill or evidence item and provides actionable guidance.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <form onSubmit={handleSubmitFeedback} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                    <h3 className="font-bold text-base sm:text-lg text-slate-900">New Feedback for {selectedCandidate.name}</h3>

                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Target Skill / Evidence</label>
                      <select
                        value={feedbackSkill}
                        onChange={(e) => setFeedbackSkill(e.target.value)}
                        className="w-full p-2.5 bg-slate-50/70 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500"
                      >
                        <option>Advanced SQL & Window Functions</option>
                        <option>Python Data Analysis & Modeling</option>
                        <option>A/B Testing & Causal Inference</option>
                        <option>Tableau Visual Storytelling</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Score (1 - 5)</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setFeedbackScore(num)}
                            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors ${
                              feedbackScore === num
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {num} ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Constructive Evaluation Note</label>
                      <textarea
                        rows={3}
                        value={feedbackNote}
                        onChange={(e) => setFeedbackNote(e.target.value)}
                        placeholder="Highlight technical strengths in execution plans, repo architecture, or statistical rigor..."
                        className="w-full p-2.5 bg-slate-50/70 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Suggested Improvement Action</label>
                      <input
                        type="text"
                        value={feedbackAction}
                        onChange={(e) => setFeedbackAction(e.target.value)}
                        placeholder="e.g., Include execution benchmark comparisons in README..."
                        className="w-full p-2.5 bg-slate-50/70 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
                    >
                      Submit Structured Feedback
                    </button>
                  </form>

                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                    <h3 className="font-bold text-base sm:text-lg text-slate-900">Submitted Feedback Log</h3>
                    {selectedCandidate.structuredFeedback.length > 0 ? (
                      <div className="space-y-3">
                        {selectedCandidate.structuredFeedback.map((fb, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs sm:text-sm space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{fb.skillName}</span>
                              <span className="font-bold text-amber-600">{fb.score} / 5 ★</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed">"{fb.constructiveNote}"</p>
                            <p className="text-[11px] text-slate-400">Action: {fb.suggestedAction} · {fb.submittedAt}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-slate-400 italic">No feedback submitted yet for this candidate.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: MESSAGES */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Direct Candidate Dialogue</span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">Candidate Messaging</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">End-to-end encrypted messaging with candidate Jane Doe.</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[520px]">
                  <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm sm:text-base text-white">Jane Doe</p>
                      <p className="text-xs text-slate-300">Applied: Product Data Analyst (94% match)</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-700/50">Active Candidate</span>
                  </div>

                  <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5 bg-slate-50/50 text-xs sm:text-sm">
                    {chatMessages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${m.sender === 'recruiter' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`p-3.5 rounded-2xl max-w-[80%] leading-relaxed ${
                            m.sender === 'recruiter'
                              ? 'bg-slate-900 text-white rounded-tr-none shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                          }`}
                        >
                          {m.text}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2.5">
                    <input
                      type="text"
                      value={newMsgText}
                      onChange={(e) => setNewMsgText(e.target.value)}
                      placeholder="Type your message to Jane Doe..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!newMsgText.trim()}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" /> <span>Send</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 6: PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Organisation Settings</span>
                  <h2 className="text-2xl font-extrabold text-slate-900">Monzo Bank · Employer Profile</h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Manage your hiring team members, verified skill requirement rubrics, and data retention policies.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 max-w-xl">
                  <div className="space-y-3.5 text-xs sm:text-sm">
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Company Name</label>
                      <input type="text" defaultValue="Monzo Bank" className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-semibold" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Hiring Lead Email</label>
                      <input type="email" defaultValue="recruiter@monzo.com" disabled className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 font-mono text-xs" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Verification Standard</label>
                      <input type="text" defaultValue="Skilloryn Proctored Diagnostic Rubric v2.4" disabled className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs" />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
