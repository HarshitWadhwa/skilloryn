import {
  ArrowLeft, Users, FileCheck, MessageSquare, CheckCircle2,
  XCircle, Search, GitBranch, ShieldCheck, Activity, TrendingUp, ChevronRight,
  Filter, Mail, Star, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import institutionLogo from '../assets/institution-logo-theme.png';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'feedback' | 'messages'>('overview');
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'candidates', label: 'Candidate Pipeline', icon: Users },
    { id: 'feedback', label: 'Evidence Review', icon: FileCheck },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ] as const;

  return (
    <div className="min-h-screen bg-transparent relative z-10 flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-navy border-r border-navy-line hidden md:flex flex-col z-20 text-white">
        <div className="h-16 flex items-center px-6 border-b border-navy-line">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/choose-workspace')}>
            <div className="w-8 h-8 rounded-lg bg-cream/95 flex items-center justify-center shadow-sm border border-copper-soft/30 overflow-hidden">
              <img src={institutionLogo} alt="Company workspace" className="w-7 h-7 object-contain" />
            </div>
            <span className="font-bold text-cream tracking-tight">Skilloryn <span className="text-copper-soft font-normal text-sm">Company</span></span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSelectedCandidate(null); }}
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
              <img src={institutionLogo} alt="Company workspace" className="w-7 h-7 object-contain" />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-end gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-ink">Acme Corp</p>
                <p className="text-xs text-muted font-medium">Hiring Manager</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold border-2 border-cyan-500/30 shadow-sm cursor-pointer">
                AC
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
                  <h1 className="text-3xl font-bold text-ink mb-2">Company Workspace</h1>
                  <p className="text-muted">Hire based on verified evidence, not guesswork.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Pipeline Stats */}
                  <div className="md:col-span-2 bg-navy border border-navy-line/60 rounded-3xl p-8 text-white shadow-md relative overflow-hidden group cursor-pointer hover:shadow-fuchsia-500/20 transition-all duration-300" onClick={() => setActiveTab('candidates')}>
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/15 text-cream font-medium text-xs mb-4 backdrop-blur-md border border-line">
                        <Users className="w-3 h-3" /> Active Requisition
                      </div>
                      <h2 className="text-3xl font-bold mb-3 group-hover:scale-[1.01] transition-transform origin-left">Junior Data Analyst</h2>
                      <p className="text-ice mb-8 max-w-lg leading-relaxed text-sm">You have <span className="font-bold text-cream">12 highly relevant candidates</span> matched based on verified SQL and Python evidence.</p>
                      <button className="px-6 py-3 bg-surface backdrop-blur-md text-ink border border-slate-300 rounded-xl font-bold text-sm group-hover:bg-surface-strong/20 transition-all flex items-center gap-2">
                        View Shortlist <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                    <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:opacity-30 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700">
                      <Users className="w-64 h-64" />
                    </div>
                  </div>

                  {/* Quick Action */}
                  <div className="bg-surface backdrop-blur-md rounded-3xl p-6 border border-line shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer" onClick={() => setActiveTab('feedback')}>
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6 border border-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                        <FileCheck className="w-6 h-6 text-cyan-300" />
                      </div>
                      <h3 className="font-bold text-ink mb-2 text-lg">Pending Reviews</h3>
                      <p className="text-muted text-sm mb-4">You have 3 candidates requesting manual evidence review.</p>
                      
                      <div className="flex -space-x-2 overflow-hidden mb-4">
                        <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-fuchsia-500/20 flex items-center justify-center text-xs font-bold text-fuchsia-300">JD</div>
                        <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-300">AS</div>
                        <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-300">MK</div>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-surface text-ink rounded-xl font-medium text-sm group-hover:bg-surface-strong/20 transition-colors">
                      Start Review
                    </button>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <div className="bg-surface backdrop-blur-md rounded-3xl p-6 border border-line shadow-md">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-ink text-lg flex items-center gap-2">
                        <Activity className="w-5 h-5 text-amber-600" /> Sourcing Activity
                      </h3>
                      <button className="text-xs text-muted hover:text-ink">View all</button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-surface-strong transition-colors cursor-pointer border border-transparent hover:border-line">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink mb-0.5">Verified Candidate Evidence</p>
                          <p className="text-xs text-muted">You verified Jane Doe's <span className="text-cyan-300">Python Churn Model</span>.</p>
                          <p className="text-xs text-muted mt-1">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-surface-strong transition-colors cursor-pointer border border-transparent hover:border-line">
                        <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Users className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink mb-0.5">New Match Found</p>
                          <p className="text-xs text-muted">A new candidate matches 92% of your requirements for Junior Data Analyst.</p>
                          <p className="text-xs text-muted mt-1">5 hours ago</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-surface-strong transition-colors cursor-pointer border border-transparent hover:border-line">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <MessageSquare className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink mb-0.5">Message Sent</p>
                          <p className="text-xs text-muted">You reached out to Alex Smith regarding their SQL portfolio.</p>
                          <p className="text-xs text-muted mt-1">Yesterday</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Funnel & Analytics */}
                  <div className="bg-surface backdrop-blur-md rounded-3xl p-6 border border-line shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-ink text-lg flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-amber-600" /> Hiring Funnel
                        </h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="group/bar">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted font-medium group-hover/bar:text-ink transition-colors">Sourced (Evidence Matched)</span>
                            <span className="font-bold text-ink">45</span>
                          </div>
                          <div className="w-full bg-surface rounded-full h-3 overflow-hidden">
                            <div className="bg-slate-400 h-full rounded-full w-full"></div>
                          </div>
                        </div>
                        <div className="group/bar">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted font-medium group-hover/bar:text-ink transition-colors">Shortlisted</span>
                            <span className="font-bold text-cyan-300">12</span>
                          </div>
                          <div className="w-full bg-surface rounded-full h-3 overflow-hidden">
                            <div className="bg-cyan-500 h-full rounded-full w-[26%]"></div>
                          </div>
                        </div>
                        <div className="group/bar">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted font-medium group-hover/bar:text-ink transition-colors">Interviewing</span>
                            <span className="font-bold text-fuchsia-300">4</span>
                          </div>
                          <div className="w-full bg-surface rounded-full h-3 overflow-hidden">
                            <div className="bg-fuchsia-500 h-full rounded-full w-[8%] relative">
                              <div className="absolute inset-0 bg-surface/20 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full mt-6 py-3 bg-surface border border-line text-ink rounded-xl font-medium text-sm hover:bg-surface-strong transition-colors">
                      View Full Analytics
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'candidates' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-ink mb-2">Candidate Pipeline</h1>
                    <p className="text-muted">Review 12 precisely matched candidates for <span className="font-bold text-fuchsia-300">Junior Data Analyst</span>.</p>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                      <input type="text" placeholder="Search skills, names..." className="w-full pl-9 pr-4 py-2 bg-surface border border-line rounded-xl text-sm focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 text-ink transition-all" />
                    </div>
                    <button className="px-4 py-2 bg-surface border border-line rounded-xl text-ink text-sm font-medium hover:bg-surface-strong transition-colors flex items-center gap-2">
                      <Filter className="w-4 h-4" /> Filters
                    </button>
                  </div>
                </div>

                {/* Pipeline Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-surface border border-line rounded-2xl p-4 flex flex-col justify-center items-center text-center">
                    <span className="text-2xl font-bold text-ink mb-1">12</span>
                    <span className="text-xs text-muted font-medium">New Matches</span>
                  </div>
                  <div className="bg-surface border border-line rounded-2xl p-4 flex flex-col justify-center items-center text-center">
                    <span className="text-2xl font-bold text-cyan-300 mb-1">8</span>
                    <span className="text-xs text-muted font-medium">Under Review</span>
                  </div>
                  <div className="bg-surface border border-line rounded-2xl p-4 flex flex-col justify-center items-center text-center">
                    <span className="text-2xl font-bold text-fuchsia-300 mb-1">4</span>
                    <span className="text-xs text-muted font-medium">Interviewing</span>
                  </div>
                  <div className="bg-surface border border-line rounded-2xl p-4 flex flex-col justify-center items-center text-center">
                    <span className="text-2xl font-bold text-green-400 mb-1">1</span>
                    <span className="text-xs text-muted font-medium">Offer Extended</span>
                  </div>
                </div>

                <div className="bg-surface backdrop-blur-md border border-line rounded-3xl overflow-hidden shadow-md">
                  <div className="border-b border-navy-line px-6 py-4 flex justify-between items-center bg-surface">
                    <h2 className="font-bold text-ink text-lg">New Matches (12)</h2>
                    <div className="text-xs text-muted font-medium flex gap-4">
                      <span className="cursor-pointer hover:text-ink transition-colors">Sort by: Match %</span>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-line/60">
                    {/* Candidate 1 */}
                    <div className="p-6 hover:bg-surface-strong-[0.02] transition-colors flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center group">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-ink flex items-center justify-center font-bold text-xl shadow-md shadow-cyan-500/20 shrink-0">
                          JD
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-xl text-ink cursor-pointer hover:text-cyan-300 transition-colors">Jane Doe</h3>
                            <span className="text-xs font-bold px-2 py-0.5 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full flex items-center gap-1 shadow-sm">
                              <ShieldCheck className="w-3 h-3" /> 98% Match
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 rounded-full">Top 5%</span>
                          </div>
                          <p className="text-sm text-muted mb-3">Former Data Analyst at TechCorp • B.S. Computer Science</p>
                          
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2.5 py-1 bg-surface text-ink text-xs font-medium rounded-lg border border-line flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-400"/> SQL (Advanced)</span>
                            <span className="px-2.5 py-1 bg-surface text-ink text-xs font-medium rounded-lg border border-line flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-400"/> Python (Pandas)</span>
                            <span className="px-2.5 py-1 bg-surface text-ink text-xs font-medium rounded-lg border border-line flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-400"/> Tableau</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 w-full xl:w-auto mt-4 xl:mt-0 justify-end">
                        <button className="p-2.5 text-muted hover:text-ink hover:bg-surface-strong rounded-xl transition-colors border border-transparent hover:border-line"><Mail className="w-5 h-5"/></button>
                        <button className="p-2.5 text-muted hover:text-amber-400 hover:bg-amber-400/10 rounded-xl transition-colors border border-transparent hover:border-amber-400/20"><Star className="w-5 h-5"/></button>
                        <button onClick={() => { setActiveTab('feedback'); setSelectedCandidate('Jane Doe'); }} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-ink rounded-xl text-sm font-bold shadow-md shadow-fuchsia-500/25 transition-all">
                          Review Evidence
                        </button>
                      </div>
                    </div>

                    {/* Candidate 2 */}
                    <div className="p-6 hover:bg-surface-strong-[0.02] transition-colors flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center group">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-ink flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-500/20 shrink-0">
                          AS
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-xl text-ink cursor-pointer hover:text-emerald-300 transition-colors">Alex Smith</h3>
                            <span className="text-xs font-bold px-2 py-0.5 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full flex items-center gap-1 shadow-sm">
                              <ShieldCheck className="w-3 h-3" /> 88% Match
                            </span>
                          </div>
                          <p className="text-sm text-muted mb-3">Self-taught Data Enthusiast • 3+ years freelancing</p>
                          
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2.5 py-1 bg-surface text-ink text-xs font-medium rounded-lg border border-line flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-400"/> SQL (Intermediate)</span>
                            <span className="px-2.5 py-1 bg-surface text-ink text-xs font-medium rounded-lg border border-line flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-400"/> PowerBI</span>
                            <span className="px-2.5 py-1 bg-rose-500/10 text-rose-300 text-xs font-medium rounded-lg border border-rose-500/20 flex items-center gap-1.5"><XCircle className="w-3 h-3 text-rose-400"/> Python</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 w-full xl:w-auto mt-4 xl:mt-0 justify-end">
                        <button className="p-2.5 text-muted hover:text-ink hover:bg-surface-strong rounded-xl transition-colors border border-transparent hover:border-line"><Mail className="w-5 h-5"/></button>
                        <button className="p-2.5 text-muted hover:text-amber-400 hover:bg-amber-400/10 rounded-xl transition-colors border border-transparent hover:border-amber-400/20"><Star className="w-5 h-5"/></button>
                        <button onClick={() => { setActiveTab('feedback'); setSelectedCandidate('Alex Smith'); }} className="px-6 py-2.5 bg-surface hover:bg-surface-strong/20 text-ink border border-line hover:border-slate-300 rounded-xl text-sm font-bold transition-all">
                          Review Evidence
                        </button>
                      </div>
                    </div>

                    {/* Candidate 3 */}
                    <div className="p-6 hover:bg-surface-strong-[0.02] transition-colors flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center group">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-ink flex items-center justify-center font-bold text-xl shadow-md shadow-amber-500/20 shrink-0">
                          MK
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-xl text-ink cursor-pointer hover:text-amber-300 transition-colors">Mariah Khan</h3>
                            <span className="text-xs font-bold px-2 py-0.5 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full flex items-center gap-1 shadow-sm">
                              <ShieldCheck className="w-3 h-3" /> 84% Match
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Fast Learner</span>
                          </div>
                          <p className="text-sm text-muted mb-3">Recent Bootcamp Grad • Mathematics Major</p>
                          
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2.5 py-1 bg-surface text-ink text-xs font-medium rounded-lg border border-line flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-400"/> Python (Advanced)</span>
                            <span className="px-2.5 py-1 bg-surface text-ink text-xs font-medium rounded-lg border border-line flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-400"/> R</span>
                            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 text-xs font-medium rounded-lg border border-amber-500/20 flex items-center gap-1.5"><AlertCircle className="w-3 h-3 text-amber-400"/> SQL (Pending)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 w-full xl:w-auto mt-4 xl:mt-0 justify-end">
                        <button className="p-2.5 text-muted hover:text-ink hover:bg-surface-strong rounded-xl transition-colors border border-transparent hover:border-line"><Mail className="w-5 h-5"/></button>
                        <button className="p-2.5 text-muted hover:text-amber-400 hover:bg-amber-400/10 rounded-xl transition-colors border border-transparent hover:border-amber-400/20"><Star className="w-5 h-5"/></button>
                        <button onClick={() => { setActiveTab('feedback'); setSelectedCandidate('Mariah Khan'); }} className="px-6 py-2.5 bg-surface hover:bg-surface-strong/20 text-ink border border-line hover:border-slate-300 rounded-xl text-sm font-bold transition-all">
                          Review Evidence
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-surface text-center text-sm font-medium text-muted hover:text-ink cursor-pointer transition-colors hover:bg-surface-strong">
                      View all 12 matches
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-3xl font-bold text-ink mb-2">Evidence Review Studio</h1>
                  <p className="text-muted">Inspect candidate projects and provide structured verification.</p>
                </div>

                {!selectedCandidate ? (
                  <div className="bg-surface border border-line rounded-2xl p-12 text-center shadow-md">
                    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-300">
                      <FileCheck className="w-8 h-8 text-muted" />
                    </div>
                    <h3 className="font-bold text-xl text-ink mb-2">Select a candidate to review</h3>
                    <p className="text-muted max-w-md mx-auto mb-6">Go back to the pipeline to select a candidate whose project evidence you want to inspect.</p>
                    <button onClick={() => setActiveTab('candidates')} className="px-6 py-2 bg-amber-500 text-ink rounded-lg font-semibold hover:bg-amber-400 transition-colors">
                      View Pipeline
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Evidence Inspector */}
                    <div className="bg-surface backdrop-blur-md border border-line rounded-3xl p-6 shadow-md flex flex-col h-[500px]">
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-navy-line">
                        <div className="flex items-center gap-3">
                          <GitBranch className="w-5 h-5 text-amber-600" />
                          <h2 className="font-bold text-ink text-lg">{selectedCandidate}'s Evidence</h2>
                        </div>
                        <span className="px-2 py-1 bg-surface text-muted text-xs rounded">ecommerce-churn-model</span>
                      </div>
                      <div className="flex-1 bg-paper/50 rounded-xl border border-white/5 p-4 overflow-y-auto font-mono text-xs text-muted space-y-2">
                        <p className="text-amber-600"># Model Evaluation Results</p>
                        <p>Accuracy: 0.94</p>
                        <p>Precision: 0.91</p>
                        <p>Recall: 0.89</p>
                        <br/>
                        <p className="text-amber-600">import pandas as pd</p>
                        <p className="text-amber-600">from sklearn.ensemble import RandomForestClassifier</p>
                        <p>...</p>
                        <p className="text-muted italic mt-8">// Code snippet rendered from repository. Read-only view.</p>
                      </div>
                    </div>

                    {/* Feedback Form */}
                    <div className="bg-surface backdrop-blur-md border border-line rounded-3xl p-6 shadow-md flex flex-col h-[500px]">
                      <h2 className="font-bold text-ink text-lg mb-6">Verification Decision</h2>
                      <div className="space-y-6 flex-1">
                        <div>
                          <label className="block text-sm font-medium text-muted mb-2">Does this evidence satisfy your Python Data Analysis requirement?</label>
                          <div className="flex gap-3">
                            <button className="flex-1 py-3 bg-green-500/10 border border-green-500/30 text-green-300 rounded-xl font-semibold flex justify-center items-center gap-2 hover:bg-green-500/20 transition-colors">
                              <CheckCircle2 className="w-5 h-5" /> Verify
                            </button>
                            <button className="flex-1 py-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl font-semibold flex justify-center items-center gap-2 hover:bg-rose-500/20 transition-colors">
                              <XCircle className="w-5 h-5" /> Request Changes
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted mb-2">Structured Feedback (Sent to Candidate)</label>
                          <textarea 
                            className="w-full bg-surface border border-line rounded-xl p-3 text-muted text-sm focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none h-32"
                            placeholder="Great use of Random Forest. To fully verify, please add a SHAP values plot to explain feature importance."
                          ></textarea>
                        </div>
                      </div>
                      <button className="w-full py-3 bg-amber-500 text-ink rounded-xl font-bold shadow-md hover:bg-amber-400 transition-colors mt-auto">
                        Submit Verification
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-3xl font-bold text-ink mb-2">Messages</h1>
                  <p className="text-muted">Your conversations with candidates.</p>
                </div>
                <div className="bg-surface border border-line rounded-2xl p-12 text-center shadow-sm">
                  <div className="w-16 h-16 bg-surface text-muted rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-300">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg text-ink mb-2">No active messages</h3>
                  <p className="text-muted max-w-sm mx-auto mb-6">Messages will appear here when you initiate a conversation with a verified candidate.</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
