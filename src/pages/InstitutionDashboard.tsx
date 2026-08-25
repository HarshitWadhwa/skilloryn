import {
  ArrowLeft, BarChart3, TrendingUp, AlertCircle, LayoutDashboard, Target, Users, Activity, ChevronRight, CheckCircle2,
  Zap, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import institutionLogo from '../assets/institution-logo-theme.png';

export default function InstitutionDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'readiness' | 'gaps' | 'demand'>('overview');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'readiness', label: 'Cohort Readiness', icon: BarChart3 },
    { id: 'gaps', label: 'Intervention Planner', icon: Target },
    { id: 'demand', label: 'Employer Demand', icon: TrendingUp },
  ] as const;

  return (
    <div className="min-h-screen bg-transparent relative z-10 flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-navy border-r border-navy-line hidden md:flex flex-col z-20 text-white">
        <div className="h-16 flex items-center px-6 border-b border-navy-line">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/choose-workspace')}>
            <div className="w-8 h-8 rounded-lg bg-cream/95 flex items-center justify-center shadow-sm border border-copper-soft/30 overflow-hidden">
              <img src={institutionLogo} alt="Institution workspace" className="w-7 h-7 object-contain" />
            </div>
            <span className="font-bold text-cream tracking-tight">Skilloryn <span className="text-copper-soft font-normal text-sm">Institution</span></span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === item.id
                  ? 'bg-cream text-navy shadow-sm border border-copper-soft'
                  : 'text-sidebar-muted hover:bg-navy-soft hover:text-cream'
                }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${activeTab === item.id ? 'text-amber-600' : 'text-muted'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-navy-line">
          <button onClick={() => navigate('/choose-workspace')} className="w-full flex items-center gap-2 text-sidebar-muted hover:text-cream text-sm font-medium p-2 rounded-lg hover:bg-navy-soft transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Switch Workspace
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 bg-surface/40 backdrop-blur-2xl border-b border-navy-line flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4 md:hidden">
            <div className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center border border-copper-soft/30 overflow-hidden">
              <img src={institutionLogo} alt="Institution workspace" className="w-7 h-7 object-contain" />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-end gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-ink">State University</p>
                <p className="text-xs text-muted font-medium">Career Services</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-cream/85 flex items-center justify-center border-2 border-cyan-500/30 shadow-sm cursor-pointer overflow-hidden">
                <img src={institutionLogo} alt="State University" className="w-9 h-9 object-contain" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-5xl mx-auto">

            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h1 className="text-3xl font-bold text-ink mb-2">Institution Command Center</h1>
                  <p className="text-muted">Track cohort readiness patterns and deploy targeted interventions.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Alert Panel */}
                  <div className="md:col-span-2 bg-navy border border-navy-line/60 rounded-3xl p-8 text-white shadow-md relative overflow-hidden group cursor-pointer hover:shadow-cyan-500/20 transition-all duration-300" onClick={() => setActiveTab('gaps')}>
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-medium text-xs mb-4 backdrop-blur-md">
                        <AlertCircle className="w-3 h-3" /> Action Required
                      </div>
                      <h2 className="text-3xl font-bold mb-3 group-hover:scale-[1.01] transition-transform origin-left">Widespread Gap: Advanced SQL</h2>
                      <p className="text-ice mb-8 max-w-lg leading-relaxed text-sm"><span className="font-bold text-cream">68% of your Data Science cohort</span> failed their most recent Advanced SQL diagnostic. This is blocking them from 40+ saved opportunities.</p>
                      <button className="px-6 py-3 bg-surface backdrop-blur-md text-ink border border-slate-300 rounded-xl font-bold text-sm group-hover:bg-surface-strong/20 transition-all flex items-center gap-2">
                        Plan Intervention <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                    <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:opacity-30 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700">
                      <AlertCircle className="w-64 h-64" />
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-surface backdrop-blur-md rounded-3xl p-6 border border-line shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer" onClick={() => setActiveTab('readiness')}>
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center mb-6 border border-fuchsia-500/30 group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-6 h-6 text-fuchsia-300" />
                      </div>
                      <h3 className="font-bold text-ink mb-2 text-lg">Cohort Health</h3>
                      <p className="text-muted text-sm mb-6"><span className="text-ink font-semibold">1,240</span> active students in the system.</p>
                      
                      <div className="space-y-4">
                        <div className="group/bar">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted font-medium group-hover/bar:text-ink transition-colors">Placement Ready</span>
                            <span className="font-bold text-green-400">32%</span>
                          </div>
                          <div className="w-full bg-surface rounded-full h-3 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full w-[32%] relative">
                              <div className="absolute inset-0 bg-surface/20 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-8 py-3 bg-surface text-ink rounded-xl font-medium text-sm group-hover:bg-surface-strong/20 transition-colors">
                      View Analytics
                    </button>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recent Interventions */}
                  <div className="bg-surface backdrop-blur-md rounded-3xl p-6 border border-line shadow-md">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-ink text-lg flex items-center gap-2">
                        <Activity className="w-5 h-5 text-amber-600" /> Recent Interventions
                      </h3>
                      <button className="text-xs text-muted hover:text-ink">View all</button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-surface-strong transition-colors cursor-pointer border border-transparent hover:border-line">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Target className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink mb-0.5">Deployed React Mission</p>
                          <p className="text-xs text-muted">Mission sent to <span className="text-ink">245 students</span> failing React Basics.</p>
                          <p className="text-xs text-muted mt-1">Yesterday</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-surface-strong transition-colors cursor-pointer border border-transparent hover:border-line">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink mb-0.5">Cohort Milestone Reached</p>
                          <p className="text-xs text-muted">Class of '25 hit 40% Placement Ready across all tracks.</p>
                          <p className="text-xs text-muted mt-1">3 days ago</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-surface-strong transition-colors cursor-pointer border border-transparent hover:border-line">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertCircle className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink mb-0.5">Skill Gap Alert Triggered</p>
                          <p className="text-xs text-muted">Sudden drop in Python Pandas verification success rates.</p>
                          <p className="text-xs text-muted mt-1">Last week</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Employer Demand Snapshot */}
                  <div className="bg-surface backdrop-blur-md rounded-3xl p-6 border border-line shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-ink text-lg flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-amber-600" /> Employer Demand Snapshot
                        </h3>
                      </div>
                      
                      <div className="space-y-5">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted font-medium">Data Engineering <span className="text-green-400 ml-2 text-xs">↑ 24%</span></span>
                          </div>
                          <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-green-400 h-full rounded-full w-[80%]"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted font-medium">Frontend (React/Next) <span className="text-green-400 ml-2 text-xs">↑ 12%</span></span>
                          </div>
                          <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full w-[65%]"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted font-medium">Cybersecurity <span className="text-rose-400 ml-2 text-xs">↓ 5%</span></span>
                          </div>
                          <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-rose-600 to-rose-400 h-full rounded-full w-[40%]"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-orange-300/10 border border-cyan-500/20 rounded-xl p-4 mt-6">
                        <p className="text-xs text-cyan-200">
                          <span className="font-bold text-ink">Pro Tip:</span> Consider deploying a Data Engineering bootcamp to your junior cohort to meet next year's projected demand spike.
                        </p>
                      </div>
                    </div>
                    
                    <button onClick={() => setActiveTab('demand')} className="w-full mt-6 py-3 bg-surface border border-line text-ink rounded-xl font-medium text-sm hover:bg-surface-strong transition-colors">
                      View Full Demand Trends
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'readiness' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-ink mb-2">Cohort Readiness Heatmap</h1>
                    <p className="text-muted">Deep-dive into student preparedness across 4 key career pathways.</p>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <select className="bg-surface border border-line text-ink rounded-xl px-4 py-2 text-sm outline-none focus:border-cyan-500 hover:bg-surface-strong transition-colors cursor-pointer w-full md:w-auto">
                      <option className="bg-surface">All Cohorts (1,250 Students)</option>
                      <option className="bg-surface">Class of 2026</option>
                      <option className="bg-surface">Class of 2027</option>
                    </select>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                  <div className="bg-surface border border-line rounded-2xl p-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-300/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors"></div>
                    <span className="text-2xl font-bold text-ink mb-1 block relative z-10">1,250</span>
                    <span className="text-xs text-muted font-medium relative z-10">Total Enrolled</span>
                  </div>
                  <div className="bg-surface border border-line rounded-2xl p-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-colors"></div>
                    <span className="text-2xl font-bold text-green-400 mb-1 block relative z-10">52%</span>
                    <span className="text-xs text-muted font-medium relative z-10">Avg Placement Ready</span>
                  </div>
                  <div className="bg-surface border border-line rounded-2xl p-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors"></div>
                    <span className="text-2xl font-bold text-amber-300 mb-1 block relative z-10">31%</span>
                    <span className="text-xs text-muted font-medium relative z-10">On Track</span>
                  </div>
                  <div className="bg-surface border border-line rounded-2xl p-4 relative overflow-hidden group border-rose-500/20">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-colors"></div>
                    <span className="text-2xl font-bold text-rose-400 mb-1 flex items-center gap-2 relative z-10">17% <AlertTriangle className="w-4 h-4"/></span>
                    <span className="text-xs text-muted font-medium relative z-10">At Risk (Critical Gaps)</span>
                  </div>
                </div>

                <div className="bg-surface backdrop-blur-md border border-line rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="p-8 space-y-8">
                    
                    {/* Pathway 1 */}
                    <div className="group">
                      <div className="flex flex-col md:flex-row justify-between md:items-end mb-3 gap-2">
                        <div>
                          <h3 className="font-bold text-ink text-lg group-hover:text-cyan-300 transition-colors">Data Analyst</h3>
                          <p className="text-sm text-muted">420 students tracking this pathway</p>
                        </div>
                        <button className="text-xs font-semibold px-4 py-1.5 bg-surface hover:bg-surface-strong border border-line rounded-lg text-ink transition-colors flex items-center gap-2">
                          View Student List <ChevronRight className="w-3 h-3"/>
                        </button>
                      </div>
                      <div className="flex h-10 rounded-xl overflow-hidden shadow-inner cursor-pointer hover:ring-2 hover:ring-white/20 transition-all">
                        <div className="bg-gradient-to-r from-green-600 to-green-500 h-full flex items-center justify-center text-xs font-bold text-ink hover:brightness-110 transition-all" style={{ width: '45%' }} title="Ready (189 students)">45%</div>
                        <div className="bg-gradient-to-r from-amber-600 to-amber-500 h-full flex items-center justify-center text-xs font-bold text-ink hover:brightness-110 transition-all" style={{ width: '35%' }} title="On Track (147 students)">35%</div>
                        <div className="bg-gradient-to-r from-rose-600 to-rose-500 h-full flex items-center justify-center text-xs font-bold text-ink hover:brightness-110 transition-all" style={{ width: '20%' }} title="At Risk (84 students)">20%</div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="text-muted">Top missing skill: <span className="text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Advanced SQL</span></span>
                        <span className="text-muted px-2">|</span>
                        <span className="text-muted">Strongest skill: <span className="text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">Python (Pandas)</span></span>
                      </div>
                    </div>

                    {/* Pathway 2 */}
                    <div className="group">
                      <div className="flex flex-col md:flex-row justify-between md:items-end mb-3 gap-2">
                        <div>
                          <h3 className="font-bold text-ink text-lg group-hover:text-cyan-300 transition-colors">Frontend Developer</h3>
                          <p className="text-sm text-muted">380 students tracking this pathway</p>
                        </div>
                        <button className="text-xs font-semibold px-4 py-1.5 bg-surface hover:bg-surface-strong border border-line rounded-lg text-ink transition-colors flex items-center gap-2">
                          View Student List <ChevronRight className="w-3 h-3"/>
                        </button>
                      </div>
                      <div className="flex h-10 rounded-xl overflow-hidden shadow-inner cursor-pointer hover:ring-2 hover:ring-white/20 transition-all">
                        <div className="bg-gradient-to-r from-green-600 to-green-500 h-full flex items-center justify-center text-xs font-bold text-ink hover:brightness-110 transition-all" style={{ width: '60%' }} title="Ready (228 students)">60%</div>
                        <div className="bg-gradient-to-r from-amber-600 to-amber-500 h-full flex items-center justify-center text-xs font-bold text-ink hover:brightness-110 transition-all" style={{ width: '25%' }} title="On Track (95 students)">25%</div>
                        <div className="bg-gradient-to-r from-rose-600 to-rose-500 h-full flex items-center justify-center text-xs font-bold text-ink hover:brightness-110 transition-all" style={{ width: '15%' }} title="At Risk (57 students)">15%</div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="text-muted">Top missing skill: <span className="text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">TypeScript Generics</span></span>
                        <span className="text-muted px-2">|</span>
                        <span className="text-muted">Strongest skill: <span className="text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">React Basics</span></span>
                      </div>
                    </div>

                    {/* Pathway 3 */}
                    <div className="group">
                      <div className="flex flex-col md:flex-row justify-between md:items-end mb-3 gap-2">
                        <div>
                          <h3 className="font-bold text-ink text-lg group-hover:text-cyan-300 transition-colors">Cloud Architect</h3>
                          <p className="text-sm text-muted">250 students tracking this pathway</p>
                        </div>
                        <button className="text-xs font-semibold px-4 py-1.5 bg-surface hover:bg-surface-strong border border-line rounded-lg text-ink transition-colors flex items-center gap-2">
                          View Student List <ChevronRight className="w-3 h-3"/>
                        </button>
                      </div>
                      <div className="flex h-10 rounded-xl overflow-hidden shadow-inner cursor-pointer hover:ring-2 hover:ring-white/20 transition-all">
                        <div className="bg-gradient-to-r from-green-600 to-green-500 h-full flex items-center justify-center text-xs font-bold text-ink hover:brightness-110 transition-all" style={{ width: '35%' }} title="Ready (88 students)">35%</div>
                        <div className="bg-gradient-to-r from-amber-600 to-amber-500 h-full flex items-center justify-center text-xs font-bold text-ink hover:brightness-110 transition-all" style={{ width: '45%' }} title="On Track (112 students)">45%</div>
                        <div className="bg-gradient-to-r from-rose-600 to-rose-500 h-full flex items-center justify-center text-xs font-bold text-ink hover:brightness-110 transition-all" style={{ width: '20%' }} title="At Risk (50 students)">20%</div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="text-muted">Top missing skill: <span className="text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Terraform / IaC</span></span>
                        <span className="text-muted px-2">|</span>
                        <span className="text-muted">Strongest skill: <span className="text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">AWS EC2 Basics</span></span>
                      </div>
                    </div>

                    {/* Pathway 4 */}
                    <div className="group">
                      <div className="flex flex-col md:flex-row justify-between md:items-end mb-3 gap-2">
                        <div>
                          <h3 className="font-bold text-ink text-lg group-hover:text-cyan-300 transition-colors">UX Designer</h3>
                          <p className="text-sm text-muted">200 students tracking this pathway</p>
                        </div>
                        <button className="text-xs font-semibold px-4 py-1.5 bg-surface hover:bg-surface-strong border border-line rounded-lg text-ink transition-colors flex items-center gap-2">
                          View Student List <ChevronRight className="w-3 h-3"/>
                        </button>
                      </div>
                      <div className="flex h-10 rounded-xl overflow-hidden shadow-inner cursor-pointer hover:ring-2 hover:ring-white/20 transition-all">
                        <div className="bg-gradient-to-r from-green-600 to-green-500 h-full flex items-center justify-center text-xs font-bold text-ink hover:brightness-110 transition-all" style={{ width: '70%' }} title="Ready (140 students)">70%</div>
                        <div className="bg-gradient-to-r from-amber-600 to-amber-500 h-full flex items-center justify-center text-xs font-bold text-ink hover:brightness-110 transition-all" style={{ width: '20%' }} title="On Track (40 students)">20%</div>
                        <div className="bg-gradient-to-r from-rose-600 to-rose-500 h-full flex items-center justify-center text-xs font-bold text-ink hover:brightness-110 transition-all" style={{ width: '10%' }} title="At Risk (20 students)">10%</div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="text-muted">Top missing skill: <span className="text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Design Systems</span></span>
                        <span className="text-muted px-2">|</span>
                        <span className="text-muted">Strongest skill: <span className="text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">Figma Prototyping</span></span>
                      </div>
                    </div>

                  </div>
                  
                  <div className="border-t border-navy-line bg-paper p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex justify-center gap-6 text-xs font-bold text-muted">
                      <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div> Placement Ready</span>
                      <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div> On Track</span>
                      <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div> At Risk (Missing critical evidence)</span>
                    </div>
                    
                    <button onClick={() => setActiveTab('gaps')} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-ink rounded-xl text-sm font-bold shadow-md shadow-cyan-500/25 transition-all flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Plan Interventions
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'gaps' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-3xl font-bold text-ink mb-2">Intervention Planner</h1>
                  <p className="text-muted">Identify critical skill gaps and deploy missions to your cohort.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Skill Gaps List */}
                  <div className="bg-surface backdrop-blur-md border border-line rounded-3xl p-6 shadow-md h-[500px] flex flex-col">
                    <h2 className="font-bold text-ink text-lg mb-4">Critical Skill Gaps</h2>
                    <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                      <div className="p-4 bg-surface border border-cyan-500/50 rounded-xl cursor-pointer hover:bg-surface-strong/20 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-ink">Advanced SQL (Window Functions)</h3>
                          <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold rounded-full">High Priority</span>
                        </div>
                        <p className="text-sm text-muted">Failed by 68% of Data Analyst tracking cohort. Required for 42 local opportunities.</p>
                      </div>
                      
                      <div className="p-4 bg-surface border border-line rounded-xl cursor-pointer hover:bg-surface-strong transition-colors opacity-70">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-ink">React Performance Optimization</h3>
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-full">Med Priority</span>
                        </div>
                        <p className="text-sm text-muted">Failed by 41% of Frontend Developer tracking cohort.</p>
                      </div>
                    </div>
                  </div>

                  {/* Deploy Intervention */}
                  <div className="bg-surface backdrop-blur-md border border-line rounded-3xl p-6 shadow-md h-[500px] flex flex-col">
                    <h2 className="font-bold text-ink text-lg mb-6">Deploy Intervention: Advanced SQL</h2>
                    <div className="space-y-6 flex-1">
                      <div>
                        <label className="block text-sm font-medium text-muted mb-2">Mission Type</label>
                        <select className="w-full bg-surface border border-line text-ink rounded-xl px-4 py-3 outline-none focus:border-cyan-500">
                          <option>Interactive Diagnostic (Auto-graded)</option>
                          <option>Project Submission (Manual Review)</option>
                          <option>External Resource (Read/Watch)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted mb-2">Mission Brief (Sent to Cohort)</label>
                        <textarea 
                          className="w-full bg-surface border border-line rounded-xl p-3 text-muted text-sm focus:border-cyan-500 outline-none h-32"
                          value="We noticed a gap in Window Functions across the cohort. Please complete this interactive diagnostic to boost your evidence score and unlock pending employer matches."
                          readOnly
                        ></textarea>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-amber-500 text-ink rounded-xl font-bold shadow-md hover:bg-amber-400 transition-colors mt-auto flex justify-center items-center gap-2">
                      <Target className="w-5 h-5" /> Deploy Mission to 285 Students
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'demand' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-3xl font-bold text-ink mb-2">Employer Demand</h1>
                  <p className="text-muted">Live trends on what companies in your network are looking for.</p>
                </div>
                <div className="bg-surface border border-line rounded-2xl p-12 text-center shadow-sm">
                  <div className="w-16 h-16 bg-surface text-muted rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-300">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg text-ink mb-2">Demand Analytics Syncing</h3>
                  <p className="text-muted max-w-sm mx-auto mb-6">Connecting to employer API to pull live market requirement data...</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
