import { Menu, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import institutionLogo from '../assets/institution-logo-theme.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
      className="fixed w-full bg-surface backdrop-blur-xl z-50 border-b border-line shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cream/95 flex items-center justify-center shadow-sm border border-copper-soft/30 overflow-hidden">
              <img src={institutionLogo} alt="Skilloryn" className="w-7 h-7 object-contain" />
            </div>
            <span className="font-bold text-2xl text-ink tracking-tight">Skilloryn</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#passport" className="text-body hover:text-ink hover:shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all font-medium">Skill Passport</a>
            <a href="#roadmap" className="text-body hover:text-ink hover:shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all font-medium">Roadmap</a>
            <a href="#opportunities" className="text-body hover:text-ink hover:shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all font-medium">Opportunities</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/sign-in" className="text-body hover:text-ink font-medium px-4 py-2">
              Log in
            </Link>
            <Link to="/sign-in" className="bg-surface hover:bg-surface-strong/20 border border-slate-300 backdrop-blur-md text-ink px-5 py-2.5 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 flex items-center gap-2 group">
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-ink">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-surface/90 backdrop-blur-xl border-b border-line px-4 pt-2 pb-4 space-y-3 shadow-xl"
        >
          <a href="#passport" className="block px-3 py-2 text-body font-medium">Skill Passport</a>
          <a href="#roadmap" className="block px-3 py-2 text-body font-medium">Roadmap</a>
          <a href="#opportunities" className="block px-3 py-2 text-body font-medium">Opportunities</a>
          <div className="pt-4 flex flex-col gap-2">
            <Link to="/sign-in" className="w-full text-center text-ink font-medium py-2 border border-slate-300 rounded-lg block hover:bg-surface-strong">Log in</Link>
            <Link to="/sign-in" className="w-full text-center bg-skilloryn-600 text-ink font-medium py-2 rounded-lg block shadow-[0_0_15px_rgba(99,102,241,0.5)]">Get Started</Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
