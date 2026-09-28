import { Menu, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logoImg from '../assets/skilloryn-logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-slate-200/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Brand Logo with Live Preview */}
          <Link to="/" className="flex items-center gap-2 group py-1">
            <img
              src={logoImg}
              alt="SkillOryn"
              className="h-8 sm:h-9 md:h-10 w-auto object-contain group-hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* Clean Nav Links (No icon/badge clutter) */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <Link to="/student?tab=internships" className="hover:text-indigo-600 transition-colors py-1">
              Internships
            </Link>
            <Link to="/student?tab=competitions" className="hover:text-indigo-600 transition-colors py-1">
              Competitions
            </Link>
            <Link to="/student?tab=jobs" className="hover:text-indigo-600 transition-colors py-1">
              Jobs
            </Link>
            <Link to="/passport" className="hover:text-indigo-600 transition-colors py-1">
              Skill Passport
            </Link>
            <Link to="/company" className="hover:text-indigo-600 transition-colors py-1">
              For Employers
            </Link>
          </div>

          {/* Clean Action CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/sign-in"
              className="text-sm font-bold text-slate-700 hover:text-slate-900 px-3 py-2 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/choose-workspace"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all hover:shadow-sm"
            >
              <span>Explore Workspaces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <Link
            to="/student?tab=internships"
            onClick={() => setIsOpen(false)}
            className="block px-3.5 py-2.5 text-sm font-semibold text-slate-800 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Internships
          </Link>
          <Link
            to="/student?tab=competitions"
            onClick={() => setIsOpen(false)}
            className="block px-3.5 py-2.5 text-sm font-semibold text-slate-800 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Competitions
          </Link>
          <Link
            to="/student?tab=jobs"
            onClick={() => setIsOpen(false)}
            className="block px-3.5 py-2.5 text-sm font-semibold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Jobs
          </Link>
          <Link
            to="/passport"
            onClick={() => setIsOpen(false)}
            className="block px-3.5 py-2.5 text-sm font-semibold text-slate-800 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Skill Passport
          </Link>
          <Link
            to="/company"
            onClick={() => setIsOpen(false)}
            className="block px-3.5 py-2.5 text-sm font-semibold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
          >
            For Employers
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/sign-in"
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-slate-700 font-bold text-sm py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 block transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/choose-workspace"
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-2.5 rounded-xl shadow-xs block transition-colors"
            >
              Explore Workspaces
            </Link>
          </div>
        </div>
      )}
    </motion.nav>
  );
}
