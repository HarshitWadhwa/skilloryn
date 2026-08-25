import { User, Building2, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const roles = [
  {
    role: 'Students',
    icon: User,
    title: 'Own your career narrative',
    description: 'Transform what you learn into what you can prove. You own your profile, assessments, and selected projects. Decide what to share and see exactly why an opportunity is right for you.',
    points: ['Diagnostic assessments', 'Evidence points & streaks', 'Private application tracking'],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800'
  },
  {
    role: 'Companies',
    icon: Building2,
    title: 'Hire based on evidence, not guesswork',
    description: 'Review candidates through an evidence-first workspace. Connect your requirements with actual student skill signals and provide structured feedback to guide their development.',
    points: ['Evidence review dashboard', 'Structured candidate feedback', 'Private messaging flows'],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
  },
  {
    role: 'Institutions',
    icon: GraduationCap,
    title: 'Intervene with aggregate intelligence',
    description: 'Track cohort readiness patterns, common skill gaps, and employer demand signals. Plan targeted interventions without needing raw surveillance data on every student.',
    points: ['Competency heatmaps', 'Employer demand context', 'Targeted intervention planning'],
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800'
  }
];

export default function Roles() {
  return (
    <section className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-ink mb-4 drop-shadow-md">Three roles, one intelligence layer</h2>
          <p className="text-lg text-muted">
            Skilloryn connects the ecosystem through privacy and career intelligence rules. Everyone sees what they need to succeed.
          </p>
        </motion.div>

        <div className="space-y-24">
          {roles.map((role, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
              key={idx} 
              className={`flex flex-col lg:flex-row gap-12 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface backdrop-blur-sm text-ink font-semibold text-sm border border-line shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                  <role.icon className="w-4 h-4" />
                  {role.role}
                </div>
                <h3 className="text-3xl font-bold text-ink drop-shadow-md">{role.title}</h3>
                <p className="text-lg text-muted leading-relaxed">
                  {role.description}
                </p>
                <ul className="space-y-3 pt-4">
                  {role.points.map((point, i) => (
                    <li key={i} className="flex items-center gap-3 text-body font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-skilloryn-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full">
                <div className="relative rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.4)] aspect-[4/3] group border border-line">
                  <div className="absolute inset-0 bg-indigo-900/40 mix-blend-multiply group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img src={role.image} alt={role.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
