import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import logoImg from '../assets/skilloryn-logo.png';
import {
  GraduationCap, Users, BarChart3, Target, Zap, Settings,
  CheckCircle2, ArrowLeft, ChevronRight, Download,
  Plus, RefreshCw, Menu, X, ShieldCheck
} from 'lucide-react';
import { INITIAL_COHORTS, INITIAL_SKILL_GAPS, INITIAL_INTERVENTIONS, type CohortItem, type DeployedIntervention } from '../data/institutionData';

type InstitutionTab = 'overview' | 'cohorts' | 'readiness' | 'gaps' | 'interventions' | 'reports';

export default function InstitutionDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-driven Tab Navigation (for browser/phone back-button support)
  const tabParam = searchParams.get('tab') as InstitutionTab | null;
  const activeTab: InstitutionTab =
    tabParam && ['overview', 'cohorts', 'readiness', 'gaps', 'interventions', 'reports'].includes(tabParam)
      ? tabParam
      : 'overview';

  const setActiveTab = useCallback(
    (tab: InstitutionTab) => {
      if (tab === 'overview') {
        setSearchParams({});
      } else {
        setSearchParams({ tab });
      }
    },
    [setSearchParams]
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [cohorts] = useState<CohortItem[]>(() => {
    const saved = localStorage.getItem('skilloryn_institution_cohorts');
    return saved ? JSON.parse(saved) : INITIAL_COHORTS;
  });
  const [interventions, setInterventions] = useState<DeployedIntervention[]>(() => {
    const saved = localStorage.getItem('skilloryn_institution_interventions');
    return saved ? JSON.parse(saved) : INITIAL_INTERVENTIONS;
  });

  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [selectedCohortId, setSelectedCohortId] = useState('cohort-2026-a');
  const [interventionTitle, setInterventionTitle] = useState('SQL Window Functions & Analytical Framing Lab');
  const [interventionDeadline, setInterventionDeadline] = useState('2026-09-20');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Popstate listener for deploy modal and mobile drawer
  useEffect(() => {
    if (deployModalOpen) {
      window.history.pushState({ modal: 'deploy' }, '');
      const onPopState = () => {
        setDeployModalOpen(false);
      };
      window.addEventListener('popstate', onPopState);
      return () => {
        window.removeEventListener('popstate', onPopState);
      };
    }
  }, [deployModalOpen]);

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

  const handleCloseDeployModal = () => {
    if (window.history.state?.modal === 'deploy') {
      window.history.back();
    } else {
      setDeployModalOpen(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('skilloryn_institution_interventions', JSON.stringify(interventions));
  }, [interventions]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDeployIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    const cohort = cohorts.find((c) => c.id === selectedCohortId) || cohorts[0];

    const newIntervention: DeployedIntervention = {
      id: `interv-${Date.now()}`,
      title: interventionTitle,
      targetCohortId: cohort.id,
      targetCohortName: cohort.name,
      enrolledStudentsCount: cohort.totalStudents,
      status: 'In Progress',
      deadline: interventionDeadline,
      projectedReadinessUplift: 15,
      completionRate: 0,
    };

    setInterventions([newIntervention, ...interventions]);
    setDeployModalOpen(false);
    showToast(`Intervention deployed to ${cohort.totalStudents} students!`);
  };

  const navItems = [
    { id: 'overview' as InstitutionTab, label: 'Institution Overview', icon: GraduationCap },
    { id: 'cohorts' as InstitutionTab, label: 'Cohorts', icon: Users },
    { id: 'readiness' as InstitutionTab, label: 'Readiness Analytics', icon: BarChart3 },
    { id: 'gaps' as InstitutionTab, label: 'Skill-Gap Trends', icon: Target },
    { id: 'interventions' as InstitutionTab, label: 'Interventions', icon: Zap },
    { id: 'reports' as InstitutionTab, label: 'Reports & Settings', icon: Settings },
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
                {item.id === 'interventions' && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-700 font-extrabold">
                    {interventions.length}
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

      {/* MAIN VIEWPORT */}
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
              Department of Computer Science & Analytics
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block leading-tight">
              <p className="text-xs font-bold text-slate-900">Dean Robert Miller</p>
              <p className="text-[10px] text-slate-500">Director of Academic Readiness</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              RM
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
                  {item.id === 'interventions' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {interventions.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 sm:space-y-8">
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-slate-800">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold border border-white/15">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Aggregate Privacy-Safe Intelligence
                      </div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                        Institutional Readiness Cockpit
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Track cohort career readiness, identify systemic curriculum bottlenecks, and deploy targeted interventions.
                      </p>
                    </div>

                    <button
                      onClick={() => setDeployModalOpen(true)}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all shrink-0 active:scale-95"
                    >
                      <Zap className="w-4 h-4" /> <span>Deploy Intervention</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Average Cohort Readiness</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 block">84%</span>
                    <p className="text-xs text-emerald-600 font-semibold pt-1">▲ 6% uplift since last term</p>
                  </div>

                  <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Diagnostic Participation</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 block">91%</span>
                    <p className="text-xs text-slate-500 pt-1">112 of 124 students tested</p>
                  </div>

                  <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Top Systemic Gap</span>
                    <span className="text-2xl font-black text-amber-600 block">Window Functions</span>
                    <p className="text-xs text-slate-500 pt-1">42% of Cohort 2026-A requires lab</p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">Active Remediation Interventions</h3>
                    <button
                      onClick={() => setActiveTab('interventions')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      Manage All ({interventions.length}) <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {interventions.map((interv) => (
                      <div key={interv.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                        <div>
                          <p className="font-bold text-slate-900 text-sm sm:text-base">{interv.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{interv.targetCohortName} · {interv.enrolledStudentsCount} Students Enrolled</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-emerald-700">+{interv.projectedReadinessUplift}% Projected Uplift</span>
                          <span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs">
                            {interv.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: COHORTS */}
            {activeTab === 'cohorts' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Cohort Rosters</span>
                    <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">Monitored Cohorts</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Aggregated performance and diagnostic participation by academic stream.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {cohorts.map((cohort) => (
                    <div key={cohort.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-slate-400">{cohort.department}</span>
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{cohort.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{cohort.totalStudents} Active Students</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
                          {cohort.readinessRate}% Career Ready
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-3.5 text-xs sm:text-sm">
                        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                          <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Diagnostic Completion:</span>
                          <span className="text-xl font-extrabold text-slate-900">{cohort.diagnosticCompletionRate}%</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                          <span className="text-xs uppercase font-bold text-indigo-600 block mb-1">Top Priority Gap:</span>
                          <span className="text-sm font-bold text-indigo-900 block">{cohort.topSkillGap}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                          <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Priority Action:</span>
                          <span className="text-xs sm:text-sm text-slate-800 font-semibold block">{cohort.priorityIntervention}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: READINESS */}
            {activeTab === 'readiness' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Curriculum Alignment</span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">Competency Readiness Heatmap</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Heatmap analysis correlating coursework completion with real diagnostic verification scores.</p>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
                  <div className="space-y-4">
                    {[
                      { skill: 'Relational SQL & Query Foundations', level: 94, status: 'Strong Alignment' },
                      { skill: 'Python Data Structures & Pandas', level: 88, status: 'On Target' },
                      { skill: 'Advanced Window Functions (PARTITION BY)', level: 58, status: 'Intervention Required (42% Gap)' },
                      { skill: 'A/B Testing & Causal Inference', level: 68, status: 'Moderate Gap' },
                      { skill: 'Executive Dashboard Storytelling', level: 76, status: 'On Target' },
                    ].map((item, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                          <span className="text-slate-800">{item.skill}</span>
                          <span className={item.level < 70 ? 'text-amber-600' : 'text-emerald-700'}>{item.level}% Readiness ({item.status})</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              item.level < 70 ? 'bg-amber-500' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${item.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: GAPS */}
            {activeTab === 'gaps' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Industry Demand Correlation</span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">Systemic Skill-Gap Trends</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Priority gaps identified through employer rejections and verified assessment checkpoints.</p>
                </div>

                <div className="space-y-4">
                  {INITIAL_SKILL_GAPS.map((gap) => (
                    <div key={gap.skillId} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            {gap.severity} Severity Gap
                          </span>
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5">{gap.skillName}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{gap.studentsAffectedCount} students affected ({gap.percentageAffected}% of cohort)</p>
                        </div>
                        <span className="text-xs font-extrabold text-slate-700 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 w-fit">
                          Demand Index: {gap.employerDemandIndex}/100
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs sm:text-sm">
                        <span className="font-bold text-indigo-900 block text-xs">Recommended Academic Action:</span>
                        <p className="text-slate-700 leading-relaxed mt-0.5">{gap.recommendedAction}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => {
                            setInterventionTitle(gap.skillName + ' Workshop');
                            setDeployModalOpen(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                        >
                          <Zap className="w-3.5 h-3.5" /> Deploy Targeted Workshop
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: INTERVENTIONS */}
            {activeTab === 'interventions' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Targeted Remediation</span>
                    <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">Intervention Planner</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Deploy workshops, mentor review sprints, and diagnostic refreshers.</p>
                  </div>
                  <button
                    onClick={() => setDeployModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Create New Intervention
                  </button>
                </div>

                <div className="space-y-4">
                  {interventions.map((interv) => (
                    <div key={interv.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-slate-400">{interv.targetCohortName}</span>
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{interv.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Deadline: {interv.deadline} · {interv.enrolledStudentsCount} Students Enrolled</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
                          +{interv.projectedReadinessUplift}% Projected Uplift
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                          <span className="text-slate-500">Student Completion Progress</span>
                          <span className="text-slate-900">{interv.completionRate}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${interv.completionRate}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: REPORTS */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Institutional Reporting</span>
                  <h2 className="text-2xl font-extrabold text-slate-900">Aggregate Reports & Accreditation Exports</h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Generate privacy-safe aggregate accreditation reports demonstrating student competency evidence and industry readiness benchmarks.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
                    <h3 className="font-bold text-base sm:text-lg text-slate-900">Accreditation Report (2025/2026)</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Comprehensive summary of cohort diagnostic participation, verified competency distributions, and curriculum alignment scores.
                    </p>
                    <button
                      onClick={() => alert('Aggregate accreditation PDF exported successfully.')}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" /> Export Accreditation PDF
                    </button>
                  </div>

                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
                    <h3 className="font-bold text-base sm:text-lg text-slate-900">Privacy & Consent Protocols</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      All institutional data is processed under k-anonymity privacy rules. Individual student records and private draft repositories are excluded from institutional exports.
                    </p>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 pt-1">
                      <ShieldCheck className="w-4 h-4" /> k-Anonymity Verified (v2.4)
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* DEPLOY MODAL */}
      {deployModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-slide-up">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Academic Intervention Tool
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Deploy Targeted Curriculum Module
                </h3>
              </div>
              <button
                onClick={handleCloseDeployModal}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeployIntervention} className="p-6 sm:p-8 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Target Academic Cohort</label>
                <select
                  value={selectedCohortId}
                  onChange={(e) => setSelectedCohortId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50/70 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500"
                >
                  {cohorts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.totalStudents} students)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Intervention Module Title</label>
                <input
                  type="text"
                  value={interventionTitle}
                  onChange={(e) => setInterventionTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50/70 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-semibold outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Completion Deadline</label>
                <input
                  type="date"
                  value={interventionDeadline}
                  onChange={(e) => setInterventionDeadline(e.target.value)}
                  className="w-full p-2.5 bg-slate-50/70 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs space-y-0.5">
                <span className="font-bold text-indigo-900 block">Estimated Impact:</span>
                <p className="text-slate-700">
                  Projected <strong>+15% readiness uplift</strong> for enrolled cohort upon diagnostic lab completion.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCloseDeployModal}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs sm:text-sm font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  Deploy to Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
