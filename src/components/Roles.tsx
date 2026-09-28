import { User, Building2, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const roles = [
  {
    role: 'Learners & Candidates',
    icon: GraduationCap,
    title: 'Own your career narrative with verified proof',
    description: 'Transform what you study into what you can prove. Build an authentic biometric Skill Passport portfolio, select which evidence to disclose, and apply to tech internships with explainable readiness matching.',
    points: ['Adaptive timed diagnostic assessments', 'Verifiable skill endorsements & GitHub repo benchmarks', 'Direct recruiter pipeline with transparent match scores'],
    href: '/student',
    ctaText: 'Launch Student Workspace',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800'
  },
  {
    role: 'Hiring Teams & Recruiters',
    icon: Building2,
    title: 'Hire based on proven evidence, not resume claims',
    description: 'Review candidates by proven competency scores, inspect real project evidence with candidate consent, provide structured skill feedback, and accelerate technical hiring.',
    points: ['Candidate review pipeline with score filtering', 'Direct inspectable repository artifacts & notebooks', 'Structured feedback and confidential candidate chats'],
    href: '/company',
    ctaText: 'Launch Recruiter Workspace',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
  },
  {
    role: 'Universities & Bootcamps',
    icon: User,
    title: 'Intervene with aggregate cohort intelligence',
    description: 'Monitor aggregate curriculum alignment, identify systemic skill gaps before graduation, and deploy targeted diagnostic interventions without intrusive individual surveillance.',
    points: ['Cohort readiness & competency alignment heatmaps', 'Curriculum skill-gap detection across cohorts', 'One-click targeted intervention lab deployment'],
    href: '/institution',
    ctaText: 'Launch Educator Workspace',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800'
  }
];

export default function Roles() {
  return (
    <section className="py-16 sm:py-24 bg-slate-50/50 relative z-10 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Three roles, one intelligence layer
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Skilloryn connects the talent ecosystem through privacy-first career intelligence rules. Everyone sees what they need to succeed.
          </p>
        </div>

        <div className="space-y-16 sm:space-y-20">
          {roles.map((role, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-center ${
                idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className="flex-1 space-y-5 w-full">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${role.badgeColor}`}>
                  <role.icon className="w-4 h-4" />
                  <span>{role.role}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {role.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {role.description}
                </p>

                <ul className="space-y-2.5 pt-2">
                  {role.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3">
                  <Link
                    to={role.href}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all hover:gap-3 cursor-pointer"
                  >
                    <span>{role.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Image Card */}
              <div className="flex-1 w-full">
                <div className="relative rounded-2xl overflow-hidden shadow-card border border-slate-200 aspect-[4/3] group">
                  <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-300 z-10" />
                  <img
                    src={role.image}
                    alt={role.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
