import { useNavigate, Link } from 'react-router-dom';
import { User, Building2, GraduationCap, ArrowRight, Sparkles, ShieldCheck, CheckCircle2, ArrowLeft, Lock, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import institutionLogo from '../assets/institution-logo-theme.png';

const workspaces = [
  {
    id: 'student',
    title: 'Student & Learner',
    shortTitle: 'Student',
    role: 'For Learners & Candidates',
    badge: 'Candidate Cockpit',
    description: 'Build your verifiable skill passport, track adaptive learning roadmaps, manage private applications, and connect with opportunities based on proven evidence.',
    icon: GraduationCap,
    themeClass: 'hover:border-copper',
    badgeBg: 'bg-amber-100/80 text-amber-900 border-amber-300/60',
    iconBg: 'bg-navy text-cream group-hover:bg-copper group-hover:text-white',
    route: '/student',
    features: [
      'Verifiable Skill Passport & Evidence Ledger',
      'Actionable Dependency-Based Learning Roadmap',
      'Unified Opportunity Discovery & Private Applications',
      'Context-Aware AI Career Coach & Diagnostic Labs',
    ],
  },
  {
    id: 'company',
    title: 'Company & Recruiter',
    shortTitle: 'Company',
    role: 'For Hiring Teams & Talent Leads',
    badge: 'Employer Cockpit',
    description: 'Review candidates by proven competency scores, inspect real project evidence with consent, provide structured feedback, and streamline hiring pipelines.',
    icon: Building2,
    themeClass: 'hover:border-cyan-500',
    badgeBg: 'bg-cyan-100/80 text-cyan-900 border-cyan-300/60',
    iconBg: 'bg-navy text-cream group-hover:bg-cyan-700 group-hover:text-white',
    route: '/company',
    features: [
      'Candidate Pipeline with Verified Competency Filtering',
      'Artifact & Repository Evidence Review Modal',
      'Structured Competency Feedback System',
      'Private Direct Candidate Messaging',
    ],
  },
  {
    id: 'institution',
    title: 'Institution & Educator',
    shortTitle: 'Institution',
    role: 'For Universities & Bootcamps',
    badge: 'Academic Cockpit',
    description: 'Monitor aggregate, privacy-preserving cohort readiness, identify critical curriculum skill gaps, and deploy targeted interventions at scale.',
    icon: User,
    themeClass: 'hover:border-green-500',
    badgeBg: 'bg-green-100/80 text-green-900 border-green-300/60',
    iconBg: 'bg-navy text-cream group-hover:bg-green-700 group-hover:text-white',
    route: '/institution',
    features: [
      'Aggregate Cohort Readiness & Alignment Heatmaps',
      'Curriculum Skill-Gap Trend Identification',
      'Targeted Intervention Planner & Deployment Tool',
      'Privacy-Preserving Aggregate Institutional Reports',
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 120, damping: 14 },
  },
};

export default function WorkspaceSelector() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-paper text-ink relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="theme-orb theme-orb-one" />
        <div className="theme-orb theme-orb-two" />
        <div className="theme-grid" />
        <div className="pointer-glow" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-line/70 bg-surface/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-cream/95 flex items-center justify-center shadow-sm border border-copper-soft/40 overflow-hidden group-hover:scale-105 transition-transform">
              <img src={institutionLogo} alt="Skilloryn" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-bold text-2xl text-ink tracking-tight font-display">
              Skilloryn
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/sign-in"
              className="text-xs sm:text-sm font-semibold text-muted hover:text-navy px-3 py-1.5 rounded-xl hover:bg-surface-strong/60 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Sign In / Switch Account
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative z-10">
        <div className="max-w-6xl w-full">
          {/* Title & Consent Notice */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream border border-copper-soft/60 text-copper-strong text-xs font-bold shadow-xs mb-4">
              <Sparkles className="w-3.5 h-3.5 text-copper" /> Choose Workspace Cockpit
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy font-display tracking-tight mb-3">
              Select Your Workspace
            </h1>
            <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed">
              Choose how you want to experience the platform. Each workspace is tailored to a specific role’s goals and workflows.
            </p>

            {/* Privacy & Ownership Clarity Banner */}
            <div className="mt-5 p-3.5 rounded-2xl bg-surface border border-line flex items-start sm:items-center gap-3 text-left max-w-2xl mx-auto shadow-xs">
              <Info className="w-4 h-4 text-copper shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-xs text-body leading-relaxed">
                <strong>Consent & Privacy:</strong> Workspace selection changes the dashboard view, <em>not your account permissions or data ownership</em>. Students always retain complete ownership of private evidence, assessments, and applications.
              </p>
            </div>
          </div>

          {/* 3 Workspaces Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {workspaces.map((ws) => {
              const Icon = ws.icon;
              return (
                <motion.div
                  key={ws.id}
                  variants={itemVariants}
                  onClick={() => navigate(ws.route)}
                  className={`group relative flex flex-col justify-between rounded-3xl bg-surface border border-line ${ws.themeClass} p-7 sm:p-8 cursor-pointer shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 overflow-hidden`}
                >
                  <div className="space-y-5 relative z-10">
                    <div className="flex items-start justify-between">
                      <div className={`w-14 h-14 rounded-2xl ${ws.iconBg} flex items-center justify-center shadow-md transition-colors duration-300`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${ws.badgeBg}`}>
                        {ws.badge}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-navy group-hover:text-copper transition-colors font-display">
                        {ws.title}
                      </h2>
                      <p className="text-xs text-muted font-semibold mt-1">{ws.role}</p>
                      <p className="text-xs sm:text-sm text-body mt-3 leading-relaxed">
                        {ws.description}
                      </p>
                    </div>

                    {/* Features checklist */}
                    <div className="space-y-2 pt-3 border-t border-line/60">
                      {ws.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-body font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-copper shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-line/60 relative z-10">
                    <div className="w-full py-3 px-5 rounded-xl bg-navy group-hover:bg-copper text-cream font-bold text-xs sm:text-sm flex items-center justify-between shadow-sm transition-colors">
                      <span>Launch {ws.shortTitle} Workspace</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-line/60 bg-surface/50 py-4 px-4 text-center text-xs text-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Skilloryn Inc. Verified Evidence & Career Intelligence.</span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-copper" /> Consent-First Architecture</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-copper" /> End-to-End Encrypted Records</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
