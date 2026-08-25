import {
  ArrowLeft, LayoutDashboard, Award, Compass, Target,
  Briefcase, FileText, Flame, Zap, ChevronRight,
  CheckCircle2, GitBranch, Bot, X, Search, FileSignature,
  Activity, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import institutionLogo from '../assets/institution-logo-theme.png';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'passport' | 'roadmap' | 'missions' | 'opportunities' | 'applications'>('overview');

  // Interactive State
  const [points, setPoints] = useState(1240);
  const [streak, setStreak] = useState(12);
  const [showCoach, setShowCoach] = useState(false);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);

  const handleMissionComplete = (id: number, reward: number) => {
    if (!completedMissions.includes(id)) {
      setCompletedMissions([...completedMissions, id]);
      setPoints(prev => prev + reward);
    }
  };

  const roadmapNodes = [
    { id: 1, title: 'SQL Fundamentals & Joins', desc: 'Diagnostic completed. Verified competency achieved.', state: 'completed' },
    { id: 2, title: 'Master Window Functions', desc: 'Window functions are frequently requested in top-tier analyst roles. This is your priority gap.', state: completedMissions.includes(2) ? 'completed' : 'active' },
    { id: 3, title: 'Python Pandas Data Manipulation', desc: "Now that you've mastered SQL, it's time to build your Pandas skills for data manipulation.", state: completedMissions.includes(2) ? 'active' : 'locked' },
    { id: 4, title: 'Data Cleaning & Preprocessing', desc: 'Learn to handle missing values, outliers, and format data for analysis.', state: 'locked' },
    { id: 5, title: 'Exploratory Data Analysis (EDA)', desc: 'Discover patterns, spot anomalies, and frame hypotheses.', state: 'locked' },
    { id: 6, title: 'Statistics & A/B Testing', desc: 'Understand distributions, statistical significance, and experiment design.', state: 'locked' },
    { id: 7, title: 'Data Visualization with Tableau', desc: 'Build interactive dashboards and visual stories.', state: 'locked' },
    { id: 8, title: 'Storytelling & Presentations', desc: 'Communicate insights effectively to non-technical stakeholders.', state: 'locked' },
    { id: 9, title: 'End-to-End Portfolio Project', desc: 'Build and publish a comprehensive project proving your skills.', state: 'locked' },
    { id: 10, title: 'Opportunity Readiness', desc: 'Prepare your evidence portfolio for applications.', state: 'locked' },
  ];
  const completedNodesCount = roadmapNodes.filter(n => n.state === 'completed').length;
  const progressPercentage = Math.round((completedNodesCount / roadmapNodes.length) * 100);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'passport', label: 'Skill Passport', icon: Award },
    { id: 'roadmap', label: 'Learning Roadmap', icon: Compass },
    { id: 'missions', label: 'Daily Missions', icon: Target },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
  ] as const;

  return (
    <div className="min-h-screen bg-transparent relative z-10 flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-navy border-r border-navy-line hidden md:flex flex-col z-20 text-white">
        <div className="h-16 flex items-center px-6 border-b border-navy-line/60">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/choose-workspace')}>
            <div className="w-8 h-8 rounded-lg bg-cream/95 flex items-center justify-center shadow-sm border border-copper-soft/30 overflow-hidden">
              <img src={institutionLogo} alt="Student workspace" className="w-7 h-7 object-contain" />
            </div>
            <span className="font-bold text-white tracking-tight">Skilloryn</span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === item.id
                  ? 'bg-cream text-navy shadow-sm border border-copper-soft'
                  : 'text-muted hover:bg-surface-strong/80 hover:text-ink'
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
              <img src={institutionLogo} alt="Student workspace" className="w-7 h-7 object-contain" />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-end gap-6">
            <div className="hidden sm:flex items-center gap-6">
              <div className="flex items-center gap-2" title="Current Streak">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-ink">{streak} <span className="text-muted text-sm font-medium">Days</span></span>
              </div>
              <div className="flex items-center gap-2" title="Evidence Points">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-ink">{points} <span className="text-muted text-sm font-medium">EP</span></span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-ink">Jane Doe</p>
                <p className="text-xs text-muted font-medium">Lvl 12 Analyst</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 flex items-center justify-center font-bold border-2 border-line shadow-sm cursor-pointer">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-5xl mx-auto">

            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-ink mb-2">Welcome back, Jane.</h1>
                    <p className="text-muted">You are <span className="font-bold text-fuchsia-300">160 EP</span> away from reaching Level 13.</p>
                  </div>
                  <button
                    onClick={() => {
                      if (!completedMissions.includes(999)) {
                        handleMissionComplete(999, 5);
                        setStreak(prev => prev + 1);
                      }
                    }}
                    className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md ${completedMissions.includes(999) ? 'bg-green-500/20 text-green-300 border border-green-500/30 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400 text-ink shadow-fuchsia-500/25'
                      }`}
                  >
                    {completedMissions.includes(999) ? (
                      <><CheckCircle2 className="w-4 h-4" /> Checked In</>
                    ) : (
                      <><Zap className="w-4 h-4" /> Daily Check-in (+5 EP)</>
                    )}
                  </button>
                </div>

                {/* Top Row */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Next Step Card */}
                  <div className="md:col-span-2 bg-navy border border-navy-line/60 rounded-3xl p-8 text-white shadow-md relative overflow-hidden group cursor-pointer hover:shadow-fuchsia-500/20 transition-all duration-300" onClick={() => setActiveTab('missions')}>
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/15 text-cream font-medium text-xs mb-4 backdrop-blur-md border border-line">
                        <Target className="w-3 h-3 text-fuchsia-200" /> Priority Mission
                      </div>
                      <h2 className="text-3xl font-bold mb-3 group-hover:scale-[1.01] transition-transform origin-left">Master Window Functions</h2>
                      <p className="text-ice mb-8 max-w-lg leading-relaxed text-sm">Based on your recent SQL diagnostic, improving window functions increases your relevance for <span className="font-bold text-cream">14 saved roles</span> at top tier companies.</p>
                      <button className="px-6 py-3 bg-surface backdrop-blur-md text-ink border border-slate-300 rounded-xl font-bold text-sm group-hover:bg-surface-strong/20 transition-all flex items-center gap-2">
                        Start Mission <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                    <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:opacity-30 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700">
                      <Compass className="w-64 h-64" />
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-surface backdrop-blur-md rounded-3xl p-6 border border-line shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer" onClick={() => setActiveTab('passport')}>
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Award className="w-6 h-6 text-cyan-300" />
                      </div>
                      <h3 className="font-bold text-ink mb-6 text-lg">Readiness Context</h3>
                      <div className="space-y-5">
                        <div className="group/bar">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted font-medium group-hover/bar:text-ink transition-colors">Data Analyst Roles</span>
                            <span className="font-bold text-cyan-300">72%</span>
                          </div>
                          <div className="w-full bg-surface rounded-full h-2.5 overflow-hidden">
                            <div className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full rounded-full relative">
                              <div className="absolute inset-0 bg-surface/20 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                        <div className="group/bar">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted font-medium group-hover/bar:text-ink transition-colors">Verified Evidence</span>
                            <span className="font-bold text-fuchsia-300">4 items</span>
                          </div>
                          <div className="w-full bg-surface rounded-full h-2.5 overflow-hidden">
                            <div className="bg-gradient-to-r from-fuchsia-600 to-fuchsia-400 h-full rounded-full w-[40%] relative">
                              <div className="absolute inset-0 bg-surface/20 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-8 pt-4 border-t border-navy-line text-sm font-semibold text-muted group-hover:text-ink transition-colors">
                      View full passport
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </div>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <div className="bg-surface backdrop-blur-md rounded-3xl p-6 border border-line shadow-md">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-ink text-lg flex items-center gap-2">
                        <Activity className="w-5 h-5 text-amber-600" /> Recent Activity
                      </h3>
                      <button className="text-xs text-muted hover:text-ink">View all</button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-surface-strong transition-colors cursor-pointer border border-transparent hover:border-line">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink mb-0.5">Completed SQL Diagnostic</p>
                          <p className="text-xs text-muted">Scored 92/100. You earned the <span className="text-green-300">Verified</span> badge.</p>
                          <p className="text-xs text-muted mt-1">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-surface-strong transition-colors cursor-pointer border border-transparent hover:border-line">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <GitBranch className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink mb-0.5">Connected GitHub Repository</p>
                          <p className="text-xs text-muted"><span className="text-cyan-300">ecommerce-churn-model</span> added to evidence.</p>
                          <p className="text-xs text-muted mt-1">Yesterday</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-surface-strong transition-colors cursor-pointer border border-transparent hover:border-line">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Flame className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink mb-0.5">12 Day Streak!</p>
                          <p className="text-xs text-muted">You've logged in for 12 consecutive days. Keep it up!</p>
                          <p className="text-xs text-muted mt-1">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Peer Insights & Trends */}
                  <div className="bg-surface backdrop-blur-md rounded-3xl p-6 border border-line shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-ink text-lg flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-amber-600" /> Market Insights
                        </h3>
                      </div>
                      
                      <div className="bg-gradient-to-r from-fuchsia-500/10 to-transparent border border-fuchsia-500/20 rounded-2xl p-5 mb-4">
                        <h4 className="text-sm font-bold text-fuchsia-300 mb-1">Top 15% Applicant</h4>
                        <p className="text-sm text-muted">Your verified SQL score puts you in the top 15% of candidates applying for Data Analyst roles this week.</p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-ink">Trending Skills in your target roles:</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1.5 bg-surface border border-line text-body text-xs font-medium rounded-lg flex items-center gap-1"><TrendingUp className="w-3 h-3 text-green-400"/> Tableau</span>
                          <span className="px-3 py-1.5 bg-surface border border-line text-body text-xs font-medium rounded-lg flex items-center gap-1"><TrendingUp className="w-3 h-3 text-green-400"/> Python</span>
                          <span className="px-3 py-1.5 bg-surface border border-line text-body text-xs font-medium rounded-lg flex items-center gap-1"><TrendingUp className="w-3 h-3 text-green-400"/> A/B Testing</span>
                          <span className="px-3 py-1.5 bg-surface border border-line text-body text-xs font-medium rounded-lg flex items-center gap-1"><TrendingUp className="w-3 h-3 text-green-400"/> Snowflake</span>
                        </div>
                      </div>
                    </div>
                    
                    <button onClick={() => setActiveTab('opportunities')} className="w-full mt-6 py-3 bg-surface border border-line text-ink rounded-xl font-medium text-sm hover:bg-surface-strong transition-colors">
                      Explore Matching Roles
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'passport' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-3xl font-bold text-ink mb-2">Skill Passport</h1>
                  <p className="text-muted">Your portable, evidence-aware profile. You control what gets shared.</p>
                </div>

                {/* Competency Ledger */}
                <div className="bg-surface backdrop-blur-md border border-line rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                  <div className="border-b border-navy-line px-8 py-5 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                    <h2 className="font-bold text-ink flex items-center gap-2"><Award className="w-5 h-5 text-skilloryn-600" /> Competency Ledger</h2>
                    <button onClick={() => navigate('/passport/jane-doe')} className="text-sm font-semibold text-skilloryn-600 hover:text-skilloryn-700 inline-flex items-center gap-1.5">Share Passport <ChevronRight className="w-4 h-4" /></button>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between border-b border-navy-line pb-6 last:border-0 last:pb-0">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-lg text-ink">Advanced SQL</h3>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">Verified</span>
                        </div>
                        <p className="text-muted text-sm">Complex queries, joins, subqueries, and database optimization.</p>
                      </div>
                      <div className="text-sm text-muted bg-surface px-4 py-2 rounded-lg border border-line">
                        Source: <span className="font-medium text-ink">Skilloryn Adaptive Diagnostic</span> (Score: 92/100)
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between border-b border-navy-line pb-6 last:border-0 last:pb-0">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-lg text-ink">Python Data Analysis</h3>
                          <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold rounded-full">Reviewed</span>
                        </div>
                        <p className="text-muted text-sm">Pandas, NumPy, and statistical modelling.</p>
                      </div>
                      <div className="text-sm text-muted bg-surface px-4 py-2 rounded-lg border border-line flex items-center gap-2">
                        <GitBranch className="w-4 h-4" />
                        <span className="font-medium text-ink">ecommerce-churn-model</span> repo
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between border-b border-navy-line pb-6 last:border-0 last:pb-0">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-lg text-ink">Tableau Visualisation</h3>
                          <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold rounded-full">Self-Reported</span>
                        </div>
                        <p className="text-muted text-sm">Interactive dashboards and storytelling.</p>
                      </div>
                      <button onClick={() => setActiveTab('missions')} className="text-sm font-semibold text-skilloryn-600 bg-fuchsia-500/20 px-4 py-2 rounded-lg hover:bg-fuchsia-500/30 border border-fuchsia-500/30 transition-colors">
                        Prove this skill
                      </button>
                    </div>
                  </div>
                </div>

                {/* Project Evidence Preview */}
                <div className="bg-surface backdrop-blur-md border border-line rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                  <div className="border-b border-navy-line px-8 py-5 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                    <h2 className="font-bold text-ink flex items-center gap-2"><GitBranch className="w-5 h-5 text-body" /> Project Evidence Preview</h2>
                  </div>
                  <div className="p-6">
                    <div className="bg-surface backdrop-blur-sm border border-line rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-blue-600 group-hover:underline text-lg">janedoe/ecommerce-churn-model</h3>
                        <span className="text-xs font-medium px-2 py-1 bg-surface text-muted rounded">Public</span>
                      </div>
                      <p className="text-muted text-sm mb-4">End-to-end customer churn prediction using Random Forest and XGBoost. Includes data cleaning, EDA, and model evaluation.</p>
                      <div className="flex items-center gap-4 text-xs font-medium text-muted">
                        <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Python 98%</span>
                        <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div> Jupyter Notebook 2%</span>
                        <span>⭐ 12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'roadmap' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-ink mb-2">Data Analyst Pathway</h1>
                    <p className="text-muted">Your personalised learning roadmap based on diagnostic results.</p>
                  </div>
                </div>

                <div className="bg-surface backdrop-blur-md p-8 rounded-3xl border border-line shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-ink text-xl">Pathway Progress</span>
                    <span className="font-bold text-fuchsia-300 bg-fuchsia-500/20 border border-fuchsia-500/30 px-3 py-1 rounded-full">{progressPercentage}% Complete</span>
                  </div>
                  <div className="w-full bg-surface rounded-full h-4 mb-4 overflow-hidden relative shadow-inner">
                    <div className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                  <p className="text-sm text-muted">
                    {completedMissions.includes(2)
                      ? "Great job! You've mastered Window Functions. Next up: Python."
                      : "Complete your priority mission to advance to the next stage."}
                  </p>
                </div>

                <div className="relative pl-8 border-l-2 border-line space-y-12 py-4">
                  {roadmapNodes.map((node) => (
                    <div key={node.id} className="relative">
                      {node.state === 'completed' && (
                        <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-green-400 ring-4 ring-white/10 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-ink" />
                        </div>
                      )}
                      {node.state === 'active' && (
                        <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-surface/400 ring-4 ring-white animate-pulse"></div>
                      )}
                      {node.state === 'locked' && (
                        <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-surface/20 ring-4 ring-white/10"></div>
                      )}
                      
                      {node.state === 'completed' && (
                        <div className="bg-surface border border-line rounded-xl p-5 shadow-sm opacity-60">
                          <h3 className="font-bold text-ink mb-1 line-through">{node.title}</h3>
                          <p className="text-sm text-muted">{node.desc}</p>
                        </div>
                      )}

                      {node.state === 'active' && (
                        <div className="bg-surface border-2 border-fuchsia-500/50 rounded-xl p-5 shadow-md relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-skilloryn-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
                          <div className="relative z-10">
                            <h3 className="font-bold text-ink text-lg mb-2">{node.title}</h3>
                            <p className="text-sm text-muted mb-4 max-w-lg">{node.desc}</p>
                            <div className="flex gap-3">
                              {node.id === 2 ? (
                                <button onClick={() => { handleMissionComplete(2, 20); }} className="px-4 py-2 bg-amber-500 text-ink text-sm font-semibold rounded-lg hover:bg-amber-400">Complete Mission</button>
                              ) : (
                                <button className="px-4 py-2 bg-amber-500 text-ink text-sm font-semibold rounded-lg hover:bg-amber-400">Start Next Mission</button>
                              )}
                              <button onClick={() => setShowCoach(true)} className="px-4 py-2 bg-surface text-body text-sm font-semibold rounded-lg hover:bg-surface-strong/20 flex items-center gap-2"><Bot className="w-4 h-4"/> Ask Coach</button>
                            </div>
                          </div>
                        </div>
                      )}

                      {node.state === 'locked' && (
                        <div className="bg-surface border border-line rounded-xl p-5 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-muted">{node.title}</h3>
                            <span className="text-xs font-bold text-muted bg-surface px-2 py-1 rounded">Locked</span>
                          </div>
                          <p className="text-sm text-muted">{node.desc}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'missions' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-3xl font-bold text-ink mb-2">Daily Missions & Diagnostics</h1>
                  <p className="text-muted">Actionable steps to build your evidence portfolio.</p>
                </div>

                <div className="grid gap-4">
                  {/* Mission 1 */}
                  <div className={`border rounded-2xl p-6 transition-all ${completedMissions.includes(1) ? 'bg-surface border-line opacity-60' : 'bg-surface border-line shadow-sm hover:border-skilloryn-300'}`}>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${completedMissions.includes(1) ? 'bg-slate-200 text-muted' : 'bg-teal-100 text-amber-600'}`}>
                          <Target className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-ink mb-1">{completedMissions.includes(1) ? 'SQL Diagnostic (Completed)' : 'Take Adaptive SQL Diagnostic'}</h3>
                          <p className="text-muted text-sm max-w-xl">Establish your baseline competency in SQL to receive a 'Verified' tag in your passport.</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2 shrink-0">
                        <span className="inline-flex font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full text-sm items-center gap-1">
                          <Zap className="w-4 h-4" /> 40 EP
                        </span>
                        {!completedMissions.includes(1) && (
                          <button onClick={() => handleMissionComplete(1, 40)} className="px-4 py-2 bg-navy text-cream rounded-lg text-sm font-semibold hover:bg-surface-strong/20">
                            Start Diagnostic
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mission 2 */}
                  <div className={`border rounded-2xl p-6 transition-all ${completedMissions.includes(2) ? 'bg-surface border-line opacity-60' : 'bg-surface border-skilloryn-500 shadow-md relative overflow-hidden'}`}>
                    {!completedMissions.includes(2) && <div className="absolute top-0 left-0 w-1 h-full bg-skilloryn-500"></div>}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${completedMissions.includes(2) ? 'bg-slate-200 text-muted' : 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30'}`}>
                          <Flame className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-ink mb-1">Practice Window Functions</h3>
                          <p className="text-muted text-sm max-w-xl">Complete 5 interactive query exercises focused on RANK(), DENSE_RANK(), and PARTITION BY.</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2 shrink-0">
                        <span className="inline-flex font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm items-center gap-1">
                          <Zap className="w-4 h-4" /> 20 EP
                        </span>
                        {!completedMissions.includes(2) && (
                          <button onClick={() => handleMissionComplete(2, 20)} className="px-4 py-2 bg-amber-500 text-ink rounded-lg text-sm font-semibold hover:bg-amber-400">
                            Complete Mission
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'opportunities' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-bold text-ink mb-2">Curated Opportunities</h1>
                    <p className="text-muted">Roles that match your verified skill evidence.</p>
                  </div>
                  <div className="relative hidden sm:block">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input type="text" placeholder="Search roles..." className="pl-9 pr-4 py-2 border border-line rounded-lg text-sm focus:outline-none focus:border-skilloryn-500 focus:ring-1 focus:ring-skilloryn-500" />
                  </div>
                </div>

                <div className="grid gap-6">
                  {/* Job Card 1 */}
                  <div className="bg-surface backdrop-blur-sm border border-line rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center font-bold text-fuchsia-300 text-xl">
                          F
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-ink">Data Analyst Intern</h3>
                          <p className="text-muted font-medium">FinTech Innovations • Remote / Bangalore</p>
                        </div>
                      </div>
                      <button className="text-muted hover:text-muted text-sm font-medium">Less relevant</button>
                    </div>

                    <div className="bg-orange-300/10 border border-cyan-500/30 rounded-xl p-4 mb-6">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-cyan-200 text-sm">Why this is a match</h4>
                          <p className="text-cyan-300 text-sm mt-1">
                            Your <span className="font-bold">Verified SQL</span> score (92) and <span className="font-bold">Python Churn Model</span> project satisfy their core requirements for data manipulation and predictive modeling.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-surface text-body text-xs font-semibold rounded-full">SQL (Required)</span>
                      <span className="px-3 py-1 bg-surface text-body text-xs font-semibold rounded-full">Python (Required)</span>
                      <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold rounded-full">Tableau (Gap: Missing Proof)</span>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-navy-line">
                      <button onClick={() => setActiveTab('applications')} className="px-6 py-2.5 bg-navy text-cream rounded-lg text-sm font-semibold hover:bg-surface-strong/20 transition-colors">Prepare Application</button>
                      <button className="px-6 py-2.5 bg-surface border border-line text-body rounded-lg text-sm font-semibold hover:bg-surface-strong transition-colors">Save Role</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-3xl font-bold text-ink mb-2">Applications</h1>
                  <p className="text-muted">Track your prepared, ready, and submitted evidence applications.</p>
                </div>

                <div className="bg-surface border border-line rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center h-64">
                  <div className="w-16 h-16 bg-surface text-muted rounded-full flex items-center justify-center mb-4">
                    <FileSignature className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg text-ink mb-2">No active applications</h3>
                  <p className="text-muted max-w-sm mb-6">When you prepare an application from the Opportunities tab, you can track its status here.</p>
                  <button onClick={() => setActiveTab('opportunities')} className="px-6 py-2 bg-amber-500 text-ink rounded-lg text-sm font-semibold hover:bg-amber-400 transition-colors">
                    Find Opportunities
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Floating AI Coach Button (Mobile & Desktop) */}
        <button
          onClick={() => setShowCoach(true)}
          className={`absolute bottom-6 right-6 w-16 h-16 bg-amber-500 text-ink rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(99,102,241,0.4)] hover:shadow-[0_8px_40px_rgba(99,102,241,0.6)] hover:-translate-y-1 hover:scale-110 transition-all duration-300 z-20 ${showCoach ? 'hidden' : 'flex'}`}
        >
          <Bot className="w-7 h-7" />
        </button>
      </div>

      {/* AI Coach Slide-out Drawer */}
      {showCoach && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-surface/20 backdrop-blur-sm" onClick={() => setShowCoach(false)}></div>
          <div className="relative w-full max-w-sm bg-surface/95 backdrop-blur-3xl border-l border-line h-full text-ink shadow-2xl flex flex-col animate-slide-up sm:animate-fade-in">
            <div className="h-16 border-b border-navy-line flex items-center justify-between px-6 bg-surface">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-ink">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="font-bold text-ink">AI Career Coach</span>
              </div>
              <button onClick={() => setShowCoach(false)} className="text-muted hover:text-ink">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded-full shrink-0 flex items-center justify-center text-ink mt-1">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-surface p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-body border border-line">
                  <p className="mb-2">Hi Jane! I see you have a <span className="font-semibold text-ink">verified gap</span> in Window Functions for the Data Analyst path.</p>
                  <p>Would you like me to recommend a practical exercise or explain how `PARTITION BY` works?</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface border-t border-navy-line">
              <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                <button className="whitespace-nowrap px-3 py-1.5 bg-surface hover:bg-surface-strong/20 text-body text-xs font-medium rounded-full">Explain PARTITION BY</button>
                <button className="whitespace-nowrap px-3 py-1.5 bg-surface hover:bg-surface-strong/20 text-body text-xs font-medium rounded-full">Give me an exercise</button>
              </div>
              <div className="relative">
                <input type="text" placeholder="Ask your coach..." className="w-full bg-surface border-transparent focus:border-skilloryn-500 focus:bg-surface focus:ring-0 rounded-xl px-4 py-3 text-sm" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-skilloryn-600 hover:bg-skilloryn-50 rounded-lg">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
