import { useNavigate } from 'react-router-dom';
import { User, Building2, GraduationCap, ArrowRight, Sparkles, Target, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const workspaces = [
  {
    id: 'student',
    title: 'Student Workspace',
    role: 'For Learners & Candidates',
    description: 'Build your skill passport, complete missions, and get matched to jobs based on verified evidence.',
    icon: User,
    color: 'from-amber-500 to-orange-400',
    shadow: 'shadow-amber-500/20',
    border: 'border-amber-500/30',
    bgLight: 'bg-orange-50',
    textLight: 'text-ink',
    features: ['Skill Passport', 'AI Career Coach', 'Real-world Missions'],
    route: '/student'
  },
  {
    id: 'company',
    title: 'Company Workspace',
    role: 'For Recruiters & Hiring Managers',
    description: 'Source candidates based on verified skills, review evidence, and streamline your hiring pipeline.',
    icon: Building2,
    color: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-blue-500/20',
    border: 'border-blue-500/30',
    bgLight: 'bg-blue-50',
    textLight: 'text-blue-700',
    features: ['Evidence Review', 'Candidate Pipeline', 'Smart Matching'],
    route: '/company'
  },
  {
    id: 'institution',
    title: 'Institution Workspace',
    role: 'For Universities & Bootcamps',
    description: 'Track cohort readiness, identify skill gaps, and deploy targeted interventions at scale.',
    icon: GraduationCap,
    color: 'from-emerald-500 to-green-400',
    shadow: 'shadow-emerald-500/20',
    border: 'border-emerald-500/30',
    bgLight: 'bg-emerald-50',
    textLight: 'text-emerald-700',
    features: ['Cohort Analytics', 'Readiness Heatmaps', 'Intervention Tools'],
    route: '/institution'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 100 }
  }
};

export default function WorkspaceSelector() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '5s' }} />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10 pt-24 pb-12">
        <div className="max-w-6xl w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-line text-ink font-bold text-sm mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" /> Select Your Workspace
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-ink mb-6 tracking-tight">
              Welcome to <span className="headline-hook">Skilloryn</span>
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto font-medium">
              Choose how you want to experience the platform. Each workspace is tailored to your specific goals and workflows.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-3 gap-8"
          >
            {workspaces.map((workspace) => (
              <motion.div
                key={workspace.id}
                variants={itemVariants}
                onClick={() => navigate(workspace.route)}
                className={`group relative bg-surface border border-line rounded-[2rem] p-8 cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-orange-300`}
              >
                {/* Glow Effect */}
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${workspace.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700 rounded-full -mr-20 -mt-20`}></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${workspace.color} flex items-center justify-center mb-8 shadow-md transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                    <workspace.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className={`inline-flex px-3 py-1 rounded-full ${workspace.bgLight} ${workspace.textLight} border ${workspace.border} text-xs font-bold mb-4 w-fit items-center gap-1.5`}>
                    <Target className="w-3 h-3" /> {workspace.role}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-ink mb-4 group-hover:text-amber-500 transition-colors">
                    {workspace.title}
                  </h2>
                  
                  <p className="text-muted mb-8 flex-1 leading-relaxed text-sm">
                    {workspace.description}
                  </p>

                  <div className="space-y-3 mb-10 p-4 bg-paper rounded-2xl border border-line group-hover:border-orange-300/50 transition-colors">
                    {workspace.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-medium text-body group-hover:text-ink transition-colors">
                        <CheckCircle2 className={`w-4 h-4 ${workspace.textLight} shrink-0`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className={`mt-auto flex items-center justify-between w-full py-4 px-6 rounded-xl bg-ink border border-ink text-white font-bold group-hover:bg-amber-500 group-hover:border-amber-500 shadow-md transition-all`}>
                    <span>Enter Workspace</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
