import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Building2, GraduationCap, ArrowRight, ArrowLeft,
  CheckCircle2, Sparkles, ShieldCheck, Lock, Mail, Eye, EyeOff,
  ChevronRight, KeyRound, Check, Compass
} from 'lucide-react';

type WorkspaceType = 'student' | 'company' | 'institution';

interface WorkspaceConfig {
  id: WorkspaceType;
  title: string;
  shortTitle: string;
  role: string;
  badge: string;
  description: string;
  icon: typeof User;
  route: string;
  demoEmail: string;
  demoRoleTitle: string;
  accentColor: string;
  borderClass: string;
  tagClass: string;
  features: string[];
}

const WORKSPACES: Record<WorkspaceType, WorkspaceConfig> = {
  student: {
    id: 'student',
    title: 'Student & Learner',
    shortTitle: 'Student',
    role: 'For Learners & Candidates',
    badge: 'Candidate Persona',
    description: 'Build your verifiable skill passport, track adaptive learning roadmaps, and match with employers based on proven evidence.',
    icon: GraduationCap,
    route: '/student',
    demoEmail: 'jane.doe@skilloryn.io',
    demoRoleTitle: 'Level 12 Data Analyst Candidate',
    accentColor: 'blue',
    borderClass: 'border-blue-200 hover:border-blue-500',
    tagClass: 'bg-blue-50 text-blue-800 border-blue-200',
    features: [
      'Verified Skill Passport & PDF Export',
      'Actionable Learning Roadmap & Diagnostics',
      'AI Career Coach & Real-world Missions',
    ],
  },
  company: {
    id: 'company',
    title: 'Company & Recruiter',
    shortTitle: 'Company',
    role: 'For Hiring Teams & Talent Leads',
    badge: 'Employer Persona',
    description: 'Search candidates by proven competency scores, inspect real project evidence, and manage structured hiring workflows.',
    icon: Building2,
    route: '/company',
    demoEmail: 'recruiter@apexglobal.io',
    demoRoleTitle: 'Lead Technical Recruiter',
    accentColor: 'emerald',
    borderClass: 'border-emerald-200 hover:border-emerald-500',
    tagClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    features: [
      'Candidate Pipeline with Verified Skill Filtering',
      'Evidence Review & Artifact Inspection',
      'Structured Feedback & Direct Messaging',
    ],
  },
  institution: {
    id: 'institution',
    title: 'Institution & Educator',
    shortTitle: 'Institution',
    role: 'For Universities & Bootcamps',
    badge: 'Academic Persona',
    description: 'Monitor aggregate cohort readiness, pinpoint curriculum skill gaps, and deploy targeted interventions at scale.',
    icon: Compass,
    route: '/institution',
    demoEmail: 'dean@skilloryn.edu',
    demoRoleTitle: 'Director of Academic Readiness',
    accentColor: 'purple',
    borderClass: 'border-purple-200 hover:border-purple-500',
    tagClass: 'bg-purple-50 text-purple-800 border-purple-200',
    features: [
      'Cohort Readiness Analytics & Alignment',
      'Targeted Intervention Planner',
      'Real-time Employer Skill Demand Insights',
    ],
  },
};

export default function SignIn() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryWorkspace = searchParams.get('workspace') as WorkspaceType | null;
  const selectedWorkspace: WorkspaceType =
    queryWorkspace && WORKSPACES[queryWorkspace] ? queryWorkspace : 'student';

  const queryStep = searchParams.get('step');
  const step: 1 | 2 = queryStep === '2' || (queryWorkspace && queryStep !== '1') ? 2 : 1;

  const [email, setEmail] = useState<string>(WORKSPACES[selectedWorkspace].demoEmail);
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [demoLoaded, setDemoLoaded] = useState<boolean>(false);

  // Sync email when workspace changes
  useEffect(() => {
    setEmail(WORKSPACES[selectedWorkspace].demoEmail);
  }, [selectedWorkspace]);

  const handleSelectWorkspace = (ws: WorkspaceType) => {
    setSearchParams({ workspace: ws, step: '2' });
  };

  const handleQuickSwitchWorkspace = (ws: WorkspaceType) => {
    setSearchParams({ workspace: ws, step: '2' });
  };

  const handleBackToStep1 = () => {
    setSearchParams({});
  };

  const handleUseDemoAccount = () => {
    setEmail(WORKSPACES[selectedWorkspace].demoEmail);
    setPassword('password123');
    setDemoLoaded(true);
    setTimeout(() => setDemoLoaded(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(WORKSPACES[selectedWorkspace].route);
    }, 600);
  };

  const currentConfig = WORKSPACES[selectedWorkspace];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8fafc] text-slate-800 relative overflow-hidden font-sans">
      {/* Header */}
      <header className="relative z-10 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="font-black text-2xl text-slate-900 tracking-tight hover:text-indigo-600 transition-colors">
              Skilloryn
            </span>
          </Link>

          {/* Stepper Pill */}
          <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-semibold">
            <button
              onClick={handleBackToStep1}
              className={`flex items-center gap-2 transition-colors ${
                step === 1 ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                1
              </span>
              Choose Workspace
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <div className={`flex items-center gap-2 ${
              step === 2 ? 'text-indigo-600 font-bold' : 'text-slate-400'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                2
              </span>
              Sign In
            </div>
          </div>

          <Link
            to="/"
            className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait">
            {/* STEP 1: CHOOSE WORKSPACE */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-6 sm:space-y-10"
              >
                <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Step 1 of 2 · Select Persona
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                    Where would you like to sign in?
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Select your workspace. Each provides a focused, role-specific career cockpit.
                  </p>
                </div>

                {/* 3 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-2">
                  {(Object.keys(WORKSPACES) as WorkspaceType[]).map((key) => {
                    const ws = WORKSPACES[key];
                    const Icon = ws.icon;
                    return (
                      <div
                        key={ws.id}
                        onClick={() => handleSelectWorkspace(ws.id)}
                        className={`group flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
                      >
                        <div className="space-y-5">
                          <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:bg-indigo-600 transition-colors">
                              <Icon className="w-6 h-6" />
                            </div>
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${ws.tagClass}`}>
                              {ws.badge}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {ws.title}
                            </h3>
                            <p className="text-xs font-semibold text-slate-400 mt-0.5">{ws.role}</p>
                            <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                              {ws.description}
                            </p>
                          </div>

                          <div className="space-y-2 pt-3 border-t border-slate-100">
                            {ws.features.map((feature, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100">
                          <button
                            type="button"
                            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm group-hover:bg-indigo-600 transition-all shadow-xs"
                          >
                            <span>Choose {ws.shortTitle}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: SIGN IN CREDENTIALS */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.98, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -16 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="max-w-xl mx-auto space-y-4"
              >
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBackToStep1}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-xl hover:bg-white"
                  >
                    <ArrowLeft className="w-4 h-4" /> Switch Workspace
                  </button>

                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified SSL Session
                  </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 sm:gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center shadow-xs shrink-0 border border-white/15">
                          <currentConfig.icon className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-slate-300 border border-white/15">
                            {currentConfig.badge}
                          </span>
                          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                            Sign in to {currentConfig.title}
                          </h2>
                        </div>
                      </div>
                    </div>

                    {/* Quick Switch */}
                    <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center gap-2 overflow-x-auto text-sm no-scrollbar">
                      <span className="text-slate-400 text-xs font-medium mr-1 shrink-0">Quick switch:</span>
                      {(Object.keys(WORKSPACES) as WorkspaceType[]).map((key) => {
                        const isCurrent = key === selectedWorkspace;
                        const ws = WORKSPACES[key];
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleQuickSwitchWorkspace(key)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                              isCurrent
                                ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                                : 'bg-white/10 text-slate-300 hover:bg-white/20'
                            }`}
                          >
                            {ws.shortTitle}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-5">
                    {/* Demo preset button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                      <div className="flex items-center gap-3">
                        <KeyRound className="w-5 h-5 text-indigo-600 shrink-0" />
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900">
                            Instant Demo ({currentConfig.shortTitle})
                          </p>
                          <p className="text-[11px] text-slate-500">{currentConfig.demoRoleTitle}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleUseDemoAccount}
                        className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto ${
                          demoLoaded
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white hover:bg-slate-900 hover:text-white text-slate-800 border-slate-200 shadow-xs'
                        }`}
                      >
                        {demoLoaded ? (
                          <><Check className="w-3.5 h-3.5" /> Auto-Filled!</>
                        ) : (
                          <><Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Auto-Fill</>
                        )}
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="name@organization.com"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Password
                          </label>
                          <button
                            type="button"
                            className="text-xs font-semibold text-indigo-600 hover:underline"
                            onClick={() => alert('For this demo prototype, use password: password123')}
                          >
                            Forgot password?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 font-medium">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                          />
                          <span>Remember my session on this device</span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Authenticating into {currentConfig.shortTitle}...</span>
                          </div>
                        ) : (
                          <>
                            <span>Sign in to {currentConfig.shortTitle} Workspace</span>
                            <ArrowRight className="w-4 h-4 text-slate-300" />
                          </>
                        )}
                      </button>
                    </form>

                    <p className="text-[11px] text-slate-400 text-center pt-1">
                      Consent-first privacy & end-to-end evidence ledger security.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-200 bg-white/70 py-4 px-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Skilloryn Inc. All rights reserved.
      </footer>
    </div>
  );
}
