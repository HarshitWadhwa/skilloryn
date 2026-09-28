import { Award, Compass, Briefcase, ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Verified Skill Passport',
    tag: 'Proof Credential',
    description: 'A physical-metaphor digital credential uniting verified diagnostics, peer-reviewed GitHub repositories, and calibrated timestamps into a portable identity.',
    icon: Award,
    iconColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    linkText: 'Inspect Skill Passport',
    href: '/passport',
  },
  {
    title: 'Adaptive Learning Roadmap',
    tag: 'Progress Engine',
    description: 'Transform priority skill gaps into 2-minute diagnostic labs, structured missions, and evidence checkpoints with persistent streak tracking.',
    icon: Compass,
    iconColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    linkText: 'Explore Roadmap',
    href: '/student?tab=roadmap',
  },
  {
    title: 'Curated Tech Internships',
    tag: 'Algorithmic Match',
    description: 'Explore hiring openings with transparent rationale. Understand precisely which verified skills match and what steps remain before fast-track submission.',
    icon: Briefcase,
    iconColor: 'bg-purple-50 text-purple-700 border-purple-200',
    linkText: 'Browse Openings',
    href: '/student?tab=internships',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-white relative z-10 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200/60">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>End-to-End Readiness Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            A complete workflow for career readiness
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            A continuous loop taking learners from baseline diagnostics to employer application delivery, backed by unforgeable project evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card hover:shadow-card-hover hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs ${feature.iconColor}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  to={feature.href}
                  className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors group-hover:translate-x-0.5 duration-200"
                >
                  <span>{feature.linkText}</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
