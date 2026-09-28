import { useNavigate, Link } from 'react-router-dom';
import { User, Building2, GraduationCap, ArrowRight, Sparkles, CheckCircle2, ArrowLeft, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import logoImg from '../assets/skilloryn-logo.png';

const workspaces = [
  {
    id: 'student',
    title: 'Student & Learner',
    shortTitle: 'Candidate',
    role: 'For Job Seekers & Learners',
    badge: 'Candidate Persona',
    description: 'Build your verifiable biometric skill passport, track adaptive learning roadmaps, manage private applications, and connect with opportunities based on proven evidence.',
    icon: GraduationCap,
    themeClass: 'hover:border-blue-400',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    iconBg: 'bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white',
    route: '/student',
    features: [
      'Verifiable Biometric Skill Passport & PDF Export',
      'Adaptive Dependency-Based Learning Roadmap',
      'Unified Opportunities & Private Applications',
      'Context-Aware AI Career Coach & Diagnostic Labs',
    ],
  },
  {
    id: 'company',
    title: 'Company & Recruiter',
    shortTitle: 'Recruiter',
    role: 'For Hiring Teams & Talent Leads',
    badge: 'Employer Persona',
    description: 'Review candidates by proven competency scores, inspect real project evidence with consent, provide structured feedback, and streamline hiring pipelines.',
    icon: Building2,
    themeClass: 'hover:border-emerald-400',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    iconBg: 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white',
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
    shortTitle: 'Academic',
    role: 'For Universities & Bootcamps',
    badge: 'Academic Persona',
    description: 'Monitor aggregate, privacy-preserving cohort readiness, identify critical curriculum skill gaps, and deploy targeted interventions at scale.',
    icon: User,
    themeClass: 'hover:border-purple-400',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    iconBg: 'bg-purple-50 text-purple-700 group-hover:bg-purple-700 group-hover:text-white',
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
    <div className="min-h-screen flex flex-col justify-between bg-[#f8fafc] text-slate-800 relative font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center group py-1">
            <img
              src={logoImg}
              alt="SkillOryn"
              className="h-8 sm:h-9 w-auto object-contain group-hover:opacity-90 transition-opacity"
            />
          </Link>

          <Link
            to="/sign-in"
            className="text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> <span>Sign In / Switch</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative z-10">
        <div className="max-w-6xl w-full">
          {/* Header Title */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5" /> Select Persona Cockpit
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Select Your Workspace
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Choose how you want to experience the platform. Each workspace is customized to a specific role’s goals, workflows, and intelligence views.
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200/90 flex items-center gap-3 text-left max-w-2xl mx-auto shadow-xs">
              <Info className="w-5 h-5 text-indigo-600 shrink-0" />
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Consent & Privacy Guarantee:</strong> Workspace selection changes the dashboard lens, <em>never your account permissions or data ownership</em>. Students always retain complete control over private evidence, assessments, and applications.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {workspaces.map((ws) => {
              const Icon = ws.icon;
              return (
                <motion.div
                  key={ws.id}
                  variants={itemVariants}
                  onClick={() => navigate(ws.route)}
                  className={`group flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 ${ws.themeClass} p-6 sm:p-8 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className="space-y-5">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-xl ${ws.iconBg} flex items-center justify-center shadow-xs transition-colors duration-200`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${ws.badgeBg}`}>
                        {ws.badge}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {ws.title}
                      </h2>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">{ws.role}</p>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                        {ws.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      {ws.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="w-full py-3 px-5 rounded-xl bg-slate-900 group-hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-xs transition-colors">
                      <span>Launch {ws.shortTitle} Workspace</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white/70 py-4 px-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Skilloryn Inc. All rights reserved.
      </footer>
    </div>
  );
}
