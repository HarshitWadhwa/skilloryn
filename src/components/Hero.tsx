import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero() {
  const navigate = useNavigate();
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-line backdrop-blur-md text-ink font-medium text-sm mb-8 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          <ShieldCheck className="w-4 h-4 text-skilloryn-400" />
          <span>Consent-first career intelligence</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl lg:text-7xl font-extrabold text-ink tracking-tight mb-8 leading-tight drop-shadow-sm"
        >
          Turn fragmented learning into <br className="hidden lg:block" />
          <span className="headline-hook">
            explainable readiness.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-xl text-muted max-w-3xl mx-auto mb-10 leading-relaxed font-medium"
        >
          Skilloryn connects students, companies, and institutions through a shared intelligence layer.
          Stop relying on black-box scores and start proving your potential with verified evidence.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <button onClick={() => navigate('/sign-in')} className="w-full sm:w-auto px-8 py-4 bg-ink hover:bg-amber-500 text-white rounded-full font-bold text-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2 group">
            Start Your Roadmap
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={() => navigate('/sign-in')} className="w-full sm:w-auto px-8 py-4 bg-surface hover:bg-paper text-ink border border-slate-300 hover:border-orange-300 rounded-full font-bold text-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-1 flex items-center justify-center gap-2">
            Explore Opportunities
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted font-medium"
        >
          <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-full backdrop-blur-sm border border-white/5">
            <CheckCircle2 className="w-5 h-5 text-skilloryn-400" />
            <span>Evidence before prediction</span>
          </div>
          <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-full backdrop-blur-sm border border-white/5">
            <CheckCircle2 className="w-5 h-5 text-skilloryn-400" />
            <span>Consent before connection</span>
          </div>
          <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-full backdrop-blur-sm border border-white/5">
            <CheckCircle2 className="w-5 h-5 text-skilloryn-400" />
            <span>AI guidance, not decisions</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
