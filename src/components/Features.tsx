import { Award, Compass, Briefcase, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Skill Passport',
    description: 'Combine skills with visible provenance, selected project evidence, and assessment context instead of just a static resume.',
    icon: Award,
    color: 'bg-blue-500/20 text-blue-300',
    link: 'View Passport'
  },
  {
    title: 'Personalised Roadmap',
    description: 'Convert priority skill gaps into daily missions, diagnostics, resources, and a structured next-best action to keep learning actionable.',
    icon: Compass,
    color: 'bg-teal-500/20 text-teal-300',
    link: 'Explore Roadmap'
  },
  {
    title: 'Curated Opportunities',
    description: 'Search for opportunities with explainable relevance. Understand why a role is a fit for your skills, rather than relying on a matching number.',
    icon: Briefcase,
    color: 'bg-purple-500/20 text-purple-300',
    link: 'Find Roles'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink mb-3 sm:mb-4 drop-shadow-md">A complete workflow for career readiness</h2>
          <p className="text-base sm:text-lg text-muted">
            A continuous improvement loop that takes you from assessing skill gaps to preparing opportunity applications, backed by visible evidence.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="bg-surface backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-line shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.2)] hover:border-slate-300 hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-inner ${feature.color}`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-3">{feature.title}</h3>
              <p className="text-muted mb-6 leading-relaxed">
                {feature.description}
              </p>
              <Link to="/sign-in" className="inline-flex items-center text-skilloryn-400 font-semibold group-hover:text-skilloryn-300 transition-colors">
                {feature.link}
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
