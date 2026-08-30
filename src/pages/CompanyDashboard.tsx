import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users, Briefcase, FileCheck, MessageSquare, Building2,
  CheckCircle2, Search, ArrowRight, ArrowLeft,
  ChevronRight, ExternalLink, ShieldCheck, Star, Send,
  Plus, RefreshCw, Menu, X
} from 'lucide-react';
import institutionLogo from '../assets/institution-logo-theme.png';
import { INITIAL_CANDIDATES, type CandidateReviewItem } from '../data/companyData';

type CompanyTab = 'overview' | 'opportunities' | 'candidates' | 'feedback' | 'messages' | 'profile';

export default function CompanyDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<CompanyTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen flex bg-paper text-ink font-sans relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-60" aria-hidden="true">
        <div className="theme-orb theme-orb-two" />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-6 py-3.5 rounded-2xl bg-navy text-cream font-bold text-sm shadow-xl border border-cyan-400/50 animate-slide-up flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SIDEBAR */}
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
              <span className="text-xs text-cyan-300 font-medium block">Company Workspace</span>
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
                    ? 'bg-cream text-navy shadow-sm font-bold border border-cyan-300'
                    : 'text-sidebar-muted hover:bg-navy-soft hover:text-cream'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-700' : 'text-sidebar-muted'}`} />
                <span>{item.label}</span>
                {item.id === 'candidates' && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-xs bg-cyan-500/20 text-cyan-300 font-bold">
                    {candidates.length}
                  </span>
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

      {/* VIEWPORT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <header className="h-20 bg-surface/90 backdrop-blur-md border-b border-line flex items-center justify-between px-6 sm:px-8 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-surface border border-line text-navy"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-bold text-base text-navy">Company</span>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <h1 className="text-xl font-bold text-navy capitalize">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300">
              Monzo Bank Hiring Pipeline
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block leading-tight">
              <p className="text-sm font-bold text-navy">Marcus Vance</p>
              <p className="text-xs text-muted">Talent Lead · Monzo</p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-navy text-cream flex items-center justify-center font-bold text-xs shadow-xs border border-copper-soft/30">
              MV
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

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
          <div className="max-w-5xl mx-auto space-y-8">

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="bg-navy text-cream rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-navy border border-navy-line/60">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-cyan-200 text-xs font-semibold border border-white/15">
                        <ShieldCheck className="w-4 h-4 text-cyan-300" /> Evidence-First Hiring Engine
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-cream leading-tight">
                        Candidate Talent Pipeline
                      </h2>
                      <p className="text-base text-ice/90 leading-relaxed">
                        Review candidates filtered strictly by verified diagnostic scores and reproducible code artifacts.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('candidates')}
                      className="px-7 py-3.5 rounded-2xl bg-copper hover:bg-copper-strong text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all shrink-0"
                    >
                      Review Candidates ({candidates.length}) <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="bg-surface rounded-3xl p-7 border border-line shadow-card space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block">Active Pipeline</span>
                    <span className="text-3xl font-extrabold text-navy block">{candidates.length} Candidates</span>
                    <p className="text-sm text-green-700 font-semibold pt-1">1 in Technical Review (Jane Doe)</p>
                  </div>

                  <div className="bg-surface rounded-3xl p-7 border border-line shadow-card space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block">Average SQL Score</span>
                    <span className="text-3xl font-extrabold text-navy block">94/100</span>
                    <p className="text-sm text-muted pt-1">Verified via proctored diagnostics</p>
                  </div>

                  <div className="bg-surface rounded-3xl p-7 border border-line shadow-card space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block">Published Openings</span>
                    <span className="text-3xl font-extrabold text-navy block">{companyRoles.length} Active</span>
                    <p className="text-sm text-muted pt-1">23 evidence packets received</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: OPPORTUNITIES */}
            {activeTab === 'opportunities' && (
              <div className="space-y-6">
                <div className="bg-surface p-7 rounded-3xl border border-line shadow-card flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider">Opportunity Publisher</span>
                    <h2 className="text-2xl font-bold text-navy mt-1">Published Role Requirements</h2>
                    <p className="text-sm text-muted mt-1">Candidates match based on explicit evidence benchmarks you require.</p>
                  </div>
                  <button
                    onClick={() => alert('New opportunity creation modal will open in the next sprint.')}
                    className="px-5 py-3 rounded-2xl bg-navy hover:bg-copper text-cream font-bold text-sm transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Publish New Role
                  </button>
                </div>

                <div className="space-y-5">
                  {companyRoles.map((role) => (
                    <div key={role.id} className="bg-surface rounded-3xl p-8 border border-line shadow-card space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-muted">{role.department}</span>
                          <h3 className="text-2xl font-bold text-navy mt-1">{role.title}</h3>
                          <p className="text-xs text-muted mt-0.5">Deadline: {role.deadline}</p>
                        </div>
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-900 border border-green-300">
                          {role.status}
                        </span>
                      </div>

                      <div className="p-5 rounded-2xl bg-paper border border-line text-sm space-y-2">
                        <span className="font-bold text-navy block text-xs">Required Evidence Criteria:</span>
                        <div className="flex flex-wrap gap-2.5">
                          {role.requiredEvidence.map((req, i) => (
                            <span key={i} className="px-3.5 py-1.5 rounded-xl bg-white border border-line font-medium text-navy text-xs">
                              ✓ {req}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-line/60 text-sm">
                        <span className="font-bold text-navy">{role.applicantsCount} Applicants · {role.verifiedMatchesCount} High Matches</span>
                        <button
                          onClick={() => setActiveTab('candidates')}
                          className="font-bold text-copper hover:underline flex items-center gap-1 text-sm"
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
                <div className="bg-surface p-7 rounded-3xl border border-line shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider">Candidate Evidence Review</span>
                    <h2 className="text-2xl font-bold text-navy mt-1">Applicant Dossiers</h2>
                    <p className="text-sm text-muted mt-1">Review only evidence explicitly shared by the student under consent rules.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search candidate..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2.5 rounded-2xl border border-line bg-paper text-sm text-navy outline-none"
                      />
                    </div>
                    {['All', 'Screening', 'Technical Review', 'Interview', 'Offer'].map((stg) => (
                      <button
                        key={stg}
                        onClick={() => setStageFilter(stg)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                          stageFilter === stg
                            ? 'bg-navy text-cream'
                            : 'bg-paper text-body hover:bg-white border border-line'
                        }`}
                      >
                        {stg}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 items-start">
                  <div className="space-y-3.5">
                    {filteredCandidates.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCandidateId(c.id)}
                        className={`p-6 rounded-3xl border cursor-pointer transition-all ${
                          selectedCandidateId === c.id
                            ? 'bg-cream border-copper shadow-md'
                            : 'bg-surface border-line hover:border-copper-soft'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-base text-navy">{c.name}</h4>
                            <p className="text-xs text-muted mt-0.5">{c.appliedRole}</p>
                          </div>
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-900 border border-green-300">
                            {c.overallMatch}% Match
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-line/60 text-xs">
                          <span className="font-bold text-navy">{c.stage}</span>
                          <span className="text-muted">{c.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="lg:col-span-2 bg-surface rounded-3xl p-8 border border-line shadow-card space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-line">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted">{selectedCandidate.targetRole}</span>
                        <h3 className="text-2xl font-bold text-navy mt-1">{selectedCandidate.name}</h3>
                        <p className="text-sm text-muted mt-0.5">{selectedCandidate.location} · Applied: {selectedCandidate.appliedRole}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted">Stage:</span>
                        <select
                          value={selectedCandidate.stage}
                          onChange={(e: any) => handleUpdateStage(selectedCandidate.id, e.target.value)}
                          className="bg-paper border border-line rounded-xl px-3 py-2 text-xs font-bold text-navy outline-none"
                        >
                          <option value="Screening">Screening</option>
                          <option value="Technical Review">Technical Review</option>
                          <option value="Interview">Interview</option>
                          <option value="Offer">Offer</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-cream border border-copper-soft/60 space-y-1.5 text-sm">
                      <span className="font-bold text-navy block text-xs">Match Rationale:</span>
                      <p className="text-body leading-relaxed">{selectedCandidate.matchExplanation}</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-xs text-navy uppercase tracking-wider">Verified Skill Evidence</h4>
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        {selectedCandidate.verifiedSkills.map((sk, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-paper border border-line space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-navy text-sm">{sk.name}</span>
                              <span className="font-mono font-bold text-green-700 text-xs">{sk.score}</span>
                            </div>
                            <p className="text-xs text-muted">{sk.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-xs text-navy uppercase tracking-wider">Submitted Project Artifacts</h4>
                      <div className="space-y-2.5">
                        {selectedCandidate.submittedEvidence.map((ev, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-paper border border-line flex items-center justify-between text-sm">
                            <div>
                              <p className="font-bold text-navy">{ev.title}</p>
                              <p className="text-xs text-muted mt-0.5">{ev.summary}</p>
                            </div>
                            <a
                              href={ev.url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 rounded-xl bg-white hover:bg-cream border border-line text-copper font-bold text-xs flex items-center gap-1.5 shrink-0 ml-3"
                            >
                              Inspect Code <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdateStage(selectedCandidate.id, 'Interview')}
                          className="px-5 py-2.5 rounded-xl bg-navy hover:bg-navy-soft text-cream font-bold text-xs"
                        >
                          Schedule Technical Interview
                        </button>
                        <button
                          onClick={() => setActiveTab('feedback')}
                          className="px-5 py-2.5 rounded-xl bg-paper hover:bg-white border border-line text-navy font-bold text-xs"
                        >
                          Provide Structured Feedback
                        </button>
                      </div>

                      <button
                        onClick={() => setActiveTab('messages')}
                        className="text-xs font-bold text-copper hover:underline flex items-center gap-1"
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
                <div className="bg-surface p-7 rounded-3xl border border-line shadow-card">
                  <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider">Candidate Development</span>
                  <h2 className="text-2xl font-bold text-navy mt-1">Provide Structured Feedback</h2>
                  <p className="text-sm text-muted mt-1">Feedback is connected directly to a skill or evidence item and provides actionable guidance.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <form onSubmit={handleSubmitFeedback} className="bg-surface rounded-3xl p-8 border border-line shadow-card space-y-5">
                    <h3 className="font-bold text-lg text-navy">New Feedback for {selectedCandidate.name}</h3>

                    <div>
                      <label className="text-xs font-bold uppercase text-muted block mb-1.5">Target Skill / Evidence</label>
                      <select
                        value={feedbackSkill}
                        onChange={(e) => setFeedbackSkill(e.target.value)}
                        className="w-full p-3 bg-paper rounded-2xl border border-line text-sm font-semibold text-navy outline-none"
                      >
                        <option>Advanced SQL & Window Functions</option>
                        <option>Python Data Analysis & Modeling</option>
                        <option>A/B Testing & Causal Inference</option>
                        <option>Tableau Visual Storytelling</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-muted block mb-1.5">Score (1 - 5)</label>
                      <div className="flex gap-2.5">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setFeedbackScore(num)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                              feedbackScore === num
                                ? 'bg-navy text-cream border-navy'
                                : 'bg-paper text-body border-line'
                            }`}
                          >
                            {num} ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-muted block mb-1.5">Constructive Evaluation Note</label>
                      <textarea
                        rows={3}
                        value={feedbackNote}
                        onChange={(e) => setFeedbackNote(e.target.value)}
                        placeholder="Highlight technical strengths in execution plans, repo architecture, or statistical rigor..."
                        className="w-full p-3 bg-paper rounded-2xl border border-line text-sm text-navy outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-muted block mb-1.5">Suggested Improvement Action</label>
                      <input
                        type="text"
                        value={feedbackAction}
                        onChange={(e) => setFeedbackAction(e.target.value)}
                        placeholder="e.g., Include execution benchmark comparisons in README..."
                        className="w-full p-3 bg-paper rounded-2xl border border-line text-sm text-navy outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl bg-navy hover:bg-copper text-cream font-bold text-sm transition-colors"
                    >
                      Submit Structured Feedback
                    </button>
                  </form>

                  <div className="bg-surface rounded-3xl p-8 border border-line shadow-card space-y-4">
                    <h3 className="font-bold text-lg text-navy">Submitted Feedback Log</h3>
                    {selectedCandidate.structuredFeedback.length > 0 ? (
                      <div className="space-y-3.5">
                        {selectedCandidate.structuredFeedback.map((fb, idx) => (
                          <div key={idx} className="p-5 rounded-2xl bg-paper border border-line text-sm space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-navy">{fb.skillName}</span>
                              <span className="font-bold text-amber-600">{fb.score} / 5 ★</span>
                            </div>
                            <p className="text-body leading-relaxed">"{fb.constructiveNote}"</p>
                            <p className="text-xs text-muted">Action: {fb.suggestedAction} · {fb.submittedAt}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted italic">No feedback submitted yet for this candidate.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: MESSAGES */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="bg-surface p-7 rounded-3xl border border-line shadow-card">
                  <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider">Direct Candidate Dialogue</span>
                  <h2 className="text-2xl font-bold text-navy mt-1">Candidate Messaging</h2>
                  <p className="text-sm text-muted mt-1">End-to-end encrypted messaging with candidate Jane Doe.</p>
                </div>

                <div className="bg-surface rounded-3xl border border-line shadow-card overflow-hidden flex flex-col h-[520px]">
                  <div className="p-5 bg-navy text-cream flex items-center justify-between">
                    <div>
                      <p className="font-bold text-base text-cream">Jane Doe</p>
                      <p className="text-xs text-ice">Applied: Product Data Analyst (94% match)</p>
                    </div>
                    <span className="text-xs font-bold text-green-300">Active Candidate</span>
                  </div>

                  <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-4 bg-paper/40 text-sm">
                    {chatMessages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${m.sender === 'recruiter' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`p-4 rounded-2xl max-w-[80%] leading-relaxed ${
                            m.sender === 'recruiter'
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

                  <form onSubmit={handleSendMessage} className="p-5 bg-surface border-t border-line flex gap-3">
                    <input
                      type="text"
                      value={newMsgText}
                      onChange={(e) => setNewMsgText(e.target.value)}
                      placeholder="Type your message to Jane Doe..."
                      className="flex-1 bg-paper border border-line rounded-2xl px-5 py-3 text-sm text-ink focus:bg-white focus:border-copper outline-none transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!newMsgText.trim()}
                      className="px-6 py-3 rounded-2xl bg-navy hover:bg-copper text-cream font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" /> Send
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 6: PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-surface p-7 rounded-3xl border border-line shadow-card space-y-2">
                  <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider">Organisation Settings</span>
                  <h2 className="text-2xl font-bold text-navy">Monzo Bank · Employer Profile</h2>
                  <p className="text-sm text-muted leading-relaxed">
                    Manage your hiring team members, verified skill requirement rubrics, and data retention policies.
                  </p>
                </div>

                <div className="bg-surface rounded-3xl p-8 border border-line shadow-card space-y-5 max-w-xl">
                  <div className="space-y-4 text-sm">
                    <div>
                      <label className="text-xs font-bold uppercase text-muted block mb-1.5">Company Name</label>
                      <input type="text" defaultValue="Monzo Bank" className="w-full p-3 bg-paper rounded-2xl border border-line text-navy font-semibold" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-muted block mb-1.5">Hiring Lead Email</label>
                      <input type="email" defaultValue="recruiter@monzo.com" disabled className="w-full p-3 bg-paper rounded-2xl border border-line text-muted font-mono" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-muted block mb-1.5">Verification Standard</label>
                      <input type="text" defaultValue="Skilloryn Proctored Diagnostic Rubric v2.4" disabled className="w-full p-3 bg-paper rounded-2xl border border-line text-muted" />
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
