import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Building2, GraduationCap, ArrowRight, ArrowLeft,
  CheckCircle2, Sparkles, ShieldCheck, Lock, Mail, Eye, EyeOff,
  ChevronRight, KeyRound, Check, Compass
} from 'lucide-react';
import institutionLogo from '../assets/institution-logo-theme.png';

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
    accentColor: 'copper',
    borderClass: 'border-copper-soft/60 hover:border-copper',
    tagClass: 'bg-amber-100 text-amber-900 border-amber-300',
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
    accentColor: 'cyan',
    borderClass: 'border-cyan-200 hover:border-cyan-500',
    tagClass: 'bg-cyan-100 text-cyan-900 border-cyan-300',
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
    accentColor: 'teal',
    borderClass: 'border-green-200 hover:border-green-500',
    tagClass: 'bg-green-100 text-green-900 border-green-300',
    features: [
      'Cohort Readiness Analytics & Alignment',
      'Targeted Intervention Planner',
      'Real-time Employer Skill Demand Insights',
    ],
  },
};

export default function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryWorkspace = searchParams.get('workspace') as WorkspaceType | null;
  const initialWorkspace: WorkspaceType =
    queryWorkspace && WORKSPACES[queryWorkspace] ? queryWorkspace : 'student';

  const [step, setStep] = useState<1 | 2>(queryWorkspace ? 2 : 1);
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceType>(initialWorkspace);
  const [email, setEmail] = useState<string>(WORKSPACES[initialWorkspace].demoEmail);
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [demoLoaded, setDemoLoaded] = useState<boolean>(false);

  const handleSelectWorkspace = (ws: WorkspaceType) => {
    setSelectedWorkspace(ws);
    setEmail(WORKSPACES[ws].demoEmail);
    setPassword('password123');
    setStep(2);
  };

  const handleQuickSwitchWorkspace = (ws: WorkspaceType) => {
    setSelectedWorkspace(ws);
    setEmail(WORKSPACES[ws].demoEmail);
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
    <div className="min-h-screen flex flex-col justify-between bg-paper text-ink relative overflow-hidden font-sans">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-60" aria-hidden="true">
        <div className="theme-orb theme-orb-one" />
        <div className="theme-orb theme-orb-two" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-line/70 bg-surface/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cream flex items-center justify-center shadow-sm border border-copper-soft/40 overflow-hidden">
              <img src={institutionLogo} alt="Skilloryn" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-bold text-2xl text-navy tracking-tight">
              Skilloryn
            </span>
          </Link>

          {/* Stepper Pill */}
          <div className="hidden sm:flex items-center gap-3 px-5 py-2 rounded-full bg-surface border border-line shadow-sm text-sm font-semibold">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 transition-colors ${
                step === 1 ? 'text-copper font-bold' : 'text-muted hover:text-navy'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 1 ? 'bg-copper text-white' : 'bg-line text-muted'
              }`}>
                1
              </span>
              Choose Workspace
            </button>
            <ChevronRight className="w-4 h-4 text-muted/50" />
            <div className={`flex items-center gap-2 ${
              step === 2 ? 'text-copper font-bold' : 'text-muted'
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 2 ? 'bg-copper text-white' : 'bg-line text-muted'
              }`}>
                2
              </span>
              Sign In
            </div>
          </div>

          <Link
            to="/"
            className="text-sm font-semibold text-muted hover:text-navy flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6 sm:p-10">
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
                className="space-y-10"
              >
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream border border-copper-soft/60 text-copper-strong text-xs font-bold shadow-xs">
                    <Sparkles className="w-4 h-4 text-copper" /> Step 1 of 2 · Select Persona
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-navy tracking-tight">
                    Where would you like to sign in?
                  </h1>
                  <p className="text-base text-muted leading-relaxed">
                    Select your workspace. Each provides a focused, role-specific career cockpit.
                  </p>
                </div>

                {/* 3 Cards */}
                <div className="grid md:grid-cols-3 gap-8 pt-2">
                  {(Object.keys(WORKSPACES) as WorkspaceType[]).map((key) => {
                    const ws = WORKSPACES[key];
                    const Icon = ws.icon;
                    return (
                      <div
                        key={ws.id}
                        onClick={() => handleSelectWorkspace(ws.id)}
                        className={`group flex flex-col justify-between rounded-3xl bg-surface border ${ws.borderClass} p-8 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 cursor-pointer`}
                      >
                        <div className="space-y-6">
                          <div className="flex items-start justify-between">
                            <div className="w-14 h-14 rounded-2xl bg-navy text-cream flex items-center justify-center shadow-md group-hover:bg-copper group-hover:text-white transition-colors">
                              <Icon className="w-7 h-7" />
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${ws.tagClass}`}>
                              {ws.badge}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-2xl font-bold text-navy group-hover:text-copper transition-colors">
                              {ws.title}
                            </h3>
                            <p className="text-xs font-semibold text-muted mt-1">{ws.role}</p>
                            <p className="text-sm text-body mt-3 leading-relaxed">
                              {ws.description}
                            </p>
                          </div>

                          <div className="space-y-2.5 pt-3 border-t border-line/60">
                            {ws.features.map((feature, i) => (
                              <div key={i} className="flex items-center gap-2.5 text-xs text-body font-medium">
                                <CheckCircle2 className="w-4 h-4 text-copper shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-line/60">
                          <button
                            type="button"
                            className="w-full flex items-center justify-between px-5 py-3 rounded-2xl bg-navy text-cream font-bold text-sm group-hover:bg-copper group-hover:text-white transition-all shadow-sm"
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
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-navy transition-colors px-3 py-1.5 rounded-xl hover:bg-surface"
                  >
                    <ArrowLeft className="w-4 h-4" /> Switch Workspace
                  </button>

                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
                    <ShieldCheck className="w-4 h-4 text-copper" /> Verified SSL Session
                  </div>
                </div>

                {/* Card */}
                <div className="bg-surface rounded-3xl shadow-card border border-line overflow-hidden">
                  <div className="bg-navy text-cream p-8 relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-cream text-navy flex items-center justify-center shadow-md">
                          <currentConfig.icon className="w-7 h-7 text-copper" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/10 text-ice border border-white/15">
                            {currentConfig.badge}
                          </span>
                          <h2 className="text-2xl font-bold text-cream mt-1.5">
                            Sign in to {currentConfig.title}
                          </h2>
                        </div>
                      </div>
                    </div>

                    {/* Quick Switch */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto text-sm">
                      <span className="text-ice/70 text-xs font-medium mr-1 shrink-0">Quick switch:</span>
                      {(Object.keys(WORKSPACES) as WorkspaceType[]).map((key) => {
                        const isCurrent = key === selectedWorkspace;
                        const ws = WORKSPACES[key];
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleQuickSwitchWorkspace(key)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                              isCurrent
                                ? 'bg-cream text-navy shadow-xs font-extrabold'
                                : 'bg-white/10 text-ice hover:bg-white/20'
                            }`}
                          >
                            {ws.shortTitle}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    {/* Demo preset button */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-cream border border-copper-soft/60">
                      <div className="flex items-center gap-3">
                        <KeyRound className="w-5 h-5 text-copper shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-navy">
                            Instant Demo ({currentConfig.shortTitle})
                          </p>
                          <p className="text-xs text-muted">{currentConfig.demoRoleTitle}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleUseDemoAccount}
                        className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${
                          demoLoaded
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white hover:bg-navy hover:text-white text-navy border-copper-soft shadow-xs'
                        }`}
                      >
                        {demoLoaded ? (
                          <><Check className="w-4 h-4" /> Auto-Filled!</>
                        ) : (
                          <><Sparkles className="w-4 h-4 text-copper" /> Auto-Fill</>
                        )}
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="name@organization.com"
                            className="w-full pl-11 pr-4 py-3 bg-paper border border-line rounded-2xl text-sm text-ink focus:bg-white focus:border-copper outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-bold text-navy uppercase tracking-wider">
                            Password
                          </label>
                          <button
                            type="button"
                            className="text-xs font-semibold text-copper hover:underline"
                            onClick={() => alert('For this demo prototype, use password: password123')}
                          >
                            Forgot password?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full pl-11 pr-11 py-3 bg-paper border border-line rounded-2xl text-sm text-ink focus:bg-white focus:border-copper outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-body font-medium">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-line text-copper focus:ring-copper/30 accent-copper"
                          />
                          <span>Remember my session on this device</span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-3 py-3.5 px-6 rounded-2xl bg-navy hover:bg-navy-soft text-cream font-bold text-sm transition-all shadow-navy flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                            <span>Authenticating into {currentConfig.shortTitle}...</span>
                          </div>
                        ) : (
                          <>
                            <span>Sign in to {currentConfig.shortTitle} Workspace</span>
                            <ArrowRight className="w-4 h-4 text-copper-soft" />
                          </>
                        )}
                      </button>
                    </form>

                    <p className="text-xs text-muted text-center pt-2">
                      Consent-first privacy & end-to-end evidence ledger security.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-10 border-t border-line/60 bg-surface/50 py-5 px-6 text-center text-xs text-muted">
        &copy; {new Date().getFullYear()} Skilloryn Inc. All rights reserved.
      </footer>
    </div>
  );
}
