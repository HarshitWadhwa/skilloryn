import { useNavigate, Link } from 'react-router-dom';
import { User, Building2, GraduationCap, ArrowRight, Sparkles, CheckCircle2, ArrowLeft, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import institutionLogo from '../assets/institution-logo-theme.png';

const workspaces = [
  {
    id: 'student',
    title: 'Student & Learner',
    shortTitle: 'Student',
    role: 'For Learners & Candidates',
    badge: 'Candidate Persona',
    description: 'Build your verifiable skill passport, track adaptive learning roadmaps, manage private applications, and connect with opportunities based on proven evidence.',
    icon: GraduationCap,
    themeClass: 'hover:border-copper',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    iconBg: 'bg-navy text-cream group-hover:bg-copper group-hover:text-white',
    route: '/student',
    features: [
      'Verifiable Skill Passport & PDF Export',
      'Actionable Dependency-Based Learning Roadmap',
      'Unified Opportunities & Private Applications',
      'Context-Aware AI Career Coach & Diagnostic Labs',
    ],
  },
  {
    id: 'company',
    title: 'Company & Recruiter',
    shortTitle: 'Company',
    role: 'For Hiring Teams & Talent Leads',
    badge: 'Employer Persona',
    description: 'Review candidates by proven competency scores, inspect real project evidence with consent, provide structured feedback, and streamline hiring pipelines.',
    icon: Building2,
    themeClass: 'hover:border-cyan-500',
    badgeBg: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    iconBg: 'bg-navy text-cream group-hover:bg-cyan-700 group-hover:text-white',
    route: '/company',
    features: [
      'Candidate Pipeline with Verified Skill Filtering',
      'Artifact & Repository Evidence Inspection',
      'Structured Competency Feedback System',
      'Private Direct Candidate Messaging',
    ],
  },
  {
    id: 'institution',
    title: 'Institution & Educator',
    shortTitle: 'Institution',
    role: 'For Universities & Bootcamps',
    badge: 'Academic Persona',
    description: 'Monitor aggregate, privacy-preserving cohort readiness, identify critical curriculum skill gaps, and deploy targeted interventions at scale.',
    icon: User,
    themeClass: 'hover:border-green-500',
    badgeBg: 'bg-green-100 text-green-900 border-green-300',
    iconBg: 'bg-navy text-cream group-hover:bg-green-700 group-hover:text-white',
    route: '/institution',
    features: [
      'Cohort Readiness & Curriculum Alignment Heatmaps',
      'Systemic Skill-Gap Trend Identification',
      'Targeted Intervention Planner & Deployment Tool',
      'Privacy-Preserving Aggregate Institutional Reports',
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

          <Link
            to="/sign-in"
            className="text-sm font-semibold text-muted hover:text-navy px-4 py-2 rounded-2xl hover:bg-surface transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Sign In / Switch Account
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10 relative z-10">
        <div className="max-w-6xl w-full">
          {/* Header Title */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream border border-copper-soft/60 text-copper-strong text-xs font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-copper" /> Choose Workspace Cockpit
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-navy tracking-tight">
              Select Your Workspace
            </h1>
            <p className="text-base text-muted max-w-2xl mx-auto leading-relaxed">
              Choose how you want to experience the platform. Each workspace is tailored to a specific role’s goals and workflows.
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-surface border border-line flex items-center gap-3 text-left max-w-2xl mx-auto shadow-xs">
              <Info className="w-5 h-5 text-copper shrink-0" />
              <p className="text-xs text-body leading-relaxed">
                <strong>Consent & Privacy:</strong> Workspace selection changes the dashboard view, <em>not your account permissions or data ownership</em>. Students always retain complete ownership of private evidence, assessments, and applications.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-3 gap-8"
          >
            {workspaces.map((ws) => {
              const Icon = ws.icon;
              return (
                <motion.div
                  key={ws.id}
                  variants={itemVariants}
                  onClick={() => navigate(ws.route)}
                  className={`group flex flex-col justify-between rounded-3xl bg-surface border border-line ${ws.themeClass} p-8 cursor-pointer shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300`}
                >
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className={`w-14 h-14 rounded-2xl ${ws.iconBg} flex items-center justify-center shadow-md transition-colors duration-300`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${ws.badgeBg}`}>
                        {ws.badge}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-navy group-hover:text-copper transition-colors">
                        {ws.title}
                      </h2>
                      <p className="text-xs font-semibold text-muted mt-1">{ws.role}</p>
                      <p className="text-sm text-body mt-3 leading-relaxed">
                        {ws.description}
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-3 border-t border-line/60">
                      {ws.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-body font-medium">
                          <CheckCircle2 className="w-4 h-4 text-copper shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-line/60">
                    <div className="w-full py-3.5 px-6 rounded-2xl bg-navy group-hover:bg-copper text-cream font-bold text-sm flex items-center justify-between shadow-sm transition-colors">
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

      <footer className="relative z-10 border-t border-line/60 bg-surface/50 py-5 px-6 text-center text-xs text-muted">
        &copy; {new Date().getFullYear()} Skilloryn Inc. All rights reserved.
      </footer>
    </div>
  );
}
