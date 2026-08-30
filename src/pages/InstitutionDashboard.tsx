import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap, Users, BarChart3, Target, Zap, Settings,
  CheckCircle2, ArrowLeft, ChevronRight, Download,
  Plus, RefreshCw, Menu, X, ShieldCheck
} from 'lucide-react';
import institutionLogo from '../assets/institution-logo-theme.png';
import { INITIAL_COHORTS, INITIAL_SKILL_GAPS, INITIAL_INTERVENTIONS, type CohortItem, type DeployedIntervention } from '../data/institutionData';

type InstitutionTab = 'overview' | 'cohorts' | 'readiness' | 'gaps' | 'interventions' | 'reports';

export default function InstitutionDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<InstitutionTab>('overview');
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
    <div className="min-h-screen flex bg-paper text-ink font-sans relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-60" aria-hidden="true">
        <div className="theme-orb theme-orb-two" />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-6 py-3.5 rounded-2xl bg-navy text-cream font-bold text-sm shadow-xl border border-green-400/50 animate-slide-up flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-300" />
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
              <span className="text-xs text-green-300 font-medium block">Academic Cockpit</span>
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
                    ? 'bg-cream text-navy shadow-sm font-bold border border-green-300'
                    : 'text-sidebar-muted hover:bg-navy-soft hover:text-cream'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-green-700' : 'text-sidebar-muted'}`} />
                <span>{item.label}</span>
                {item.id === 'interventions' && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-300 font-bold">
                    {interventions.length}
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

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <header className="h-20 bg-surface/90 backdrop-blur-md border-b border-line flex items-center justify-between px-6 sm:px-8 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-surface border border-line text-navy"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-bold text-base text-navy">Institution</span>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <h1 className="text-xl font-bold text-navy capitalize">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-900 border border-green-300">
              Department of Computer Science & Analytics
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block leading-tight">
              <p className="text-sm font-bold text-navy">Dean Robert Miller</p>
              <p className="text-xs text-muted">Director of Academic Readiness</p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-navy text-cream flex items-center justify-center font-bold text-xs shadow-xs border border-copper-soft/30">
              RM
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

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
          <div className="max-w-5xl mx-auto space-y-8">

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="bg-navy text-cream rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-navy border border-navy-line/60">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-green-200 text-xs font-semibold border border-white/15">
                        <ShieldCheck className="w-4 h-4 text-green-300" /> Aggregate Privacy-Safe Intelligence
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-cream leading-tight">
                        Institutional Readiness Cockpit
                      </h2>
                      <p className="text-base text-ice/90 leading-relaxed">
                        Track cohort career readiness, identify systemic curriculum bottlenecks, and deploy targeted interventions.
                      </p>
                    </div>

                    <button
                      onClick={() => setDeployModalOpen(true)}
                      className="px-7 py-3.5 rounded-2xl bg-copper hover:bg-copper-strong text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all shrink-0"
                    >
                      <Zap className="w-4 h-4" /> Deploy Intervention
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="bg-surface rounded-3xl p-7 border border-line shadow-card space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block">Average Cohort Readiness</span>
                    <span className="text-3xl font-extrabold text-navy block">84%</span>
                    <p className="text-sm text-green-700 font-semibold pt-1">▲ 6% uplift since last term</p>
                  </div>

                  <div className="bg-surface rounded-3xl p-7 border border-line shadow-card space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block">Diagnostic Participation</span>
                    <span className="text-3xl font-extrabold text-navy block">91%</span>
                    <p className="text-sm text-muted pt-1">146 out of 160 students assessed</p>
                  </div>

                  <div className="bg-surface rounded-3xl p-7 border border-line shadow-card space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block">Top Systemic Gap</span>
                    <span className="text-2xl font-bold text-amber-700 block">Window Functions</span>
                    <p className="text-sm text-muted pt-1">42% of Cohort 2026-A requires lab</p>
                  </div>
                </div>

                <div className="bg-surface rounded-3xl p-8 border border-line shadow-card space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-navy">Active Remediation Interventions</h3>
                    <button
                      onClick={() => setActiveTab('interventions')}
                      className="text-sm font-bold text-copper hover:underline flex items-center gap-1"
                    >
                      Manage All ({interventions.length}) <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {interventions.map((interv) => (
                      <div key={interv.id} className="p-5 rounded-2xl bg-paper border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                        <div>
                          <p className="font-bold text-navy text-base">{interv.title}</p>
                          <p className="text-xs text-muted mt-0.5">{interv.targetCohortName} · {interv.enrolledStudentsCount} Students Enrolled</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-green-700">+{interv.projectedReadinessUplift}% Projected Uplift</span>
                          <span className="px-3 py-1 rounded-full bg-cream border border-copper-soft text-copper-strong font-bold text-xs">
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
                <div className="bg-surface p-7 rounded-3xl border border-line shadow-card flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-green-800 uppercase tracking-wider">Cohort Rosters</span>
                    <h2 className="text-2xl font-bold text-navy mt-1">Monitored Cohorts</h2>
                    <p className="text-sm text-muted mt-1">Aggregated performance and diagnostic participation by academic stream.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {cohorts.map((cohort) => (
                    <div key={cohort.id} className="bg-surface rounded-3xl p-8 border border-line shadow-card space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-muted">{cohort.department}</span>
                          <h3 className="text-2xl font-bold text-navy mt-1">{cohort.name}</h3>
                          <p className="text-xs text-muted mt-0.5">{cohort.totalStudents} Active Students</p>
                        </div>
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-900 border border-green-300">
                          {cohort.readinessRate}% Career Ready
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4 text-sm">
                        <div className="p-4 rounded-2xl bg-paper border border-line">
                          <span className="text-xs uppercase font-bold text-muted block mb-1">Diagnostic Completion:</span>
                          <span className="text-xl font-extrabold text-navy">{cohort.diagnosticCompletionRate}%</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-cream border border-copper-soft/60">
                          <span className="text-xs uppercase font-bold text-muted block mb-1">Top Priority Gap:</span>
                          <span className="text-sm font-bold text-copper-strong block">{cohort.topSkillGap}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-paper border border-line">
                          <span className="text-xs uppercase font-bold text-muted block mb-1">Priority Action:</span>
                          <span className="text-sm text-navy font-medium block">{cohort.priorityIntervention}</span>
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
                <div className="bg-surface p-7 rounded-3xl border border-line shadow-card">
                  <span className="text-xs font-bold text-green-800 uppercase tracking-wider">Curriculum Alignment</span>
                  <h2 className="text-2xl font-bold text-navy mt-1">Competency Readiness Heatmap</h2>
                  <p className="text-sm text-muted mt-1">Heatmap analysis correlating coursework completion with real diagnostic verification scores.</p>
                </div>

                <div className="bg-surface rounded-3xl p-8 border border-line shadow-card space-y-6">
                  <div className="space-y-5">
                    {[
                      { skill: 'Relational SQL & Query Foundations', level: 94, status: 'Strong Alignment' },
                      { skill: 'Python Data Structures & Pandas', level: 88, status: 'On Target' },
                      { skill: 'Advanced Window Functions (PARTITION BY)', level: 58, status: 'Intervention Required (42% Gap)' },
                      { skill: 'A/B Testing & Causal Inference', level: 68, status: 'Moderate Gap' },
                      { skill: 'Executive Dashboard Storytelling', level: 76, status: 'On Target' },
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-sm font-bold">
                          <span className="text-navy">{item.skill}</span>
                          <span className={item.level < 70 ? 'text-amber-700' : 'text-green-700'}>{item.level}% Readiness ({item.status})</span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-paper overflow-hidden border border-line">
                          <div
                            className={`h-full transition-all ${
                              item.level < 70 ? 'bg-amber-500' : 'bg-green-600'
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
                <div className="bg-surface p-7 rounded-3xl border border-line shadow-card">
                  <span className="text-xs font-bold text-green-800 uppercase tracking-wider">Industry Demand Correlation</span>
                  <h2 className="text-2xl font-bold text-navy mt-1">Systemic Skill-Gap Trends</h2>
                  <p className="text-sm text-muted mt-1">Priority gaps identified through employer rejections and verified assessment checkpoints.</p>
                </div>

                <div className="space-y-5">
                  {INITIAL_SKILL_GAPS.map((gap) => (
                    <div key={gap.skillId} className="bg-surface rounded-3xl p-8 border border-line shadow-card space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                            {gap.severity} Severity Gap
                          </span>
                          <h3 className="text-2xl font-bold text-navy mt-1.5">{gap.skillName}</h3>
                          <p className="text-sm text-muted mt-0.5">{gap.studentsAffectedCount} students affected ({gap.percentageAffected}% of cohort)</p>
                        </div>
                        <span className="text-sm font-extrabold text-navy px-4 py-2 rounded-2xl bg-paper border border-line">
                          Demand Index: {gap.employerDemandIndex}/100
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-cream border border-copper-soft/60 text-sm">
                        <span className="font-bold text-navy block text-xs">Recommended Academic Action:</span>
                        <p className="text-body leading-relaxed mt-1">{gap.recommendedAction}</p>
                      </div>

                      <div className="pt-3 border-t border-line/60 flex justify-end">
                        <button
                          onClick={() => {
                            setInterventionTitle(gap.skillName + ' Workshop');
                            setDeployModalOpen(true);
                          }}
                          className="px-5 py-2.5 rounded-2xl bg-navy hover:bg-copper text-cream font-bold text-xs transition-colors flex items-center gap-2"
                        >
                          <Zap className="w-4 h-4" /> Deploy Targeted Workshop
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
                <div className="bg-surface p-7 rounded-3xl border border-line shadow-card flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-green-800 uppercase tracking-wider">Targeted Remediation</span>
                    <h2 className="text-2xl font-bold text-navy mt-1">Intervention Planner</h2>
                    <p className="text-sm text-muted mt-1">Deploy workshops, mentor review sprints, and diagnostic refreshers.</p>
                  </div>
                  <button
                    onClick={() => setDeployModalOpen(true)}
                    className="px-5 py-3 rounded-2xl bg-navy hover:bg-copper text-cream font-bold text-sm transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Create New Intervention
                  </button>
                </div>

                <div className="space-y-5">
                  {interventions.map((interv) => (
                    <div key={interv.id} className="bg-surface rounded-3xl p-8 border border-line shadow-card space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-muted">{interv.targetCohortName}</span>
                          <h3 className="text-2xl font-bold text-navy mt-1">{interv.title}</h3>
                          <p className="text-sm text-muted mt-0.5">Deadline: {interv.deadline} · {interv.enrolledStudentsCount} Students Enrolled</p>
                        </div>
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-900 border border-green-300">
                          +{interv.projectedReadinessUplift}% Projected Uplift
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm font-bold">
                          <span className="text-muted">Student Completion Progress</span>
                          <span className="text-navy">{interv.completionRate}%</span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-paper overflow-hidden border border-line">
                          <div className="h-full bg-green-600 transition-all" style={{ width: `${interv.completionRate}%` }} />
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
                <div className="bg-surface p-7 rounded-3xl border border-line shadow-card space-y-2">
                  <span className="text-xs font-bold text-green-800 uppercase tracking-wider">Institutional Reporting</span>
                  <h2 className="text-2xl font-bold text-navy">Aggregate Reports & Accreditation Exports</h2>
                  <p className="text-sm text-muted leading-relaxed">
                    Generate privacy-safe aggregate accreditation reports demonstrating student competency evidence and industry readiness benchmarks.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-surface rounded-3xl p-8 border border-line shadow-card space-y-4">
                    <h3 className="font-bold text-lg text-navy">Accreditation Report (2025/2026)</h3>
                    <p className="text-sm text-body leading-relaxed">
                      Comprehensive summary of cohort diagnostic participation, verified competency distributions, and curriculum alignment scores.
                    </p>
                    <button
                      onClick={() => alert('Aggregate accreditation PDF exported successfully.')}
                      className="px-5 py-3 rounded-2xl bg-navy hover:bg-navy-soft text-cream font-bold text-sm flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Export Accreditation PDF
                    </button>
                  </div>

                  <div className="bg-surface rounded-3xl p-8 border border-line shadow-card space-y-4">
                    <h3 className="font-bold text-lg text-navy">Privacy & Consent Protocols</h3>
                    <p className="text-sm text-body leading-relaxed">
                      All institutional data is processed under k-anonymity privacy rules. Individual student records and private draft repositories are excluded from institutional exports.
                    </p>
                    <div className="flex items-center gap-2 text-sm font-bold text-green-700">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface w-full max-w-xl rounded-3xl shadow-2xl border border-line overflow-hidden animate-slide-up">
            <div className="p-6 bg-navy text-cream flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-green-300 block">
                  Academic Intervention Tool
                </span>
                <h3 className="text-lg font-bold text-cream mt-0.5">
                  Deploy Targeted Curriculum Module
                </h3>
              </div>
              <button
                onClick={() => setDeployModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-ice hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeployIntervention} className="p-8 space-y-5">
              <div>
                <label className="text-xs font-bold uppercase text-muted block mb-1.5">Target Academic Cohort</label>
                <select
                  value={selectedCohortId}
                  onChange={(e) => setSelectedCohortId(e.target.value)}
                  className="w-full p-3 bg-paper rounded-2xl border border-line text-sm font-semibold text-navy outline-none"
                >
                  {cohorts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.totalStudents} students)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted block mb-1.5">Intervention Module Title</label>
                <input
                  type="text"
                  value={interventionTitle}
                  onChange={(e) => setInterventionTitle(e.target.value)}
                  className="w-full p-3 bg-paper rounded-2xl border border-line text-sm text-navy font-semibold outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted block mb-1.5">Completion Deadline</label>
                <input
                  type="date"
                  value={interventionDeadline}
                  onChange={(e) => setInterventionDeadline(e.target.value)}
                  className="w-full p-3 bg-paper rounded-2xl border border-line text-sm text-navy outline-none"
                  required
                />
              </div>

              <div className="p-4 rounded-2xl bg-cream border border-copper-soft/60 space-y-1 text-sm">
                <span className="font-bold text-navy block text-xs">Estimated Impact:</span>
                <p className="text-body text-xs">
                  Projected <strong>+15% readiness uplift</strong> for enrolled cohort upon diagnostic lab completion.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeployModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-navy hover:bg-copper text-cream font-bold text-sm transition-colors"
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
