import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy text-slate-400 py-14 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center">
              <span className="font-black text-2xl text-white tracking-tight">
                Skilloryn
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              An evidence-led career intelligence network for learners, companies, and universities. Turning fragmented learning into tangible, employer-verified readiness.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cryptographic Proof & Consent-First Architecture</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link to="/passport" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Skill Passport
                </Link>
              </li>
              <li>
                <Link to="/student?tab=roadmap" className="hover:text-white transition-colors">
                  Learning Roadmap
                </Link>
              </li>
              <li>
                <Link to="/student?tab=opportunities" className="hover:text-white transition-colors">
                  Curated Opportunities
                </Link>
              </li>
              <li>
                <Link to="/student?tab=coach" className="hover:text-white transition-colors">
                  AI Career Coach
                </Link>
              </li>
            </ul>
          </div>

          {/* Workspaces */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Workspaces</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link to="/student" className="hover:text-white transition-colors">
                  Candidate Workspace
                </Link>
              </li>
              <li>
                <Link to="/company" className="hover:text-white transition-colors">
                  Employer Workspace
                </Link>
              </li>
              <li>
                <Link to="/institution" className="hover:text-white transition-colors">
                  Institutional Intelligence
                </Link>
              </li>
              <li>
                <Link to="/choose-workspace" className="hover:text-white transition-colors">
                  Workspace Selector
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} Skilloryn Inc. All rights reserved. Professional Career Intelligence.
          </p>
          <div className="flex gap-6 text-slate-400">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Consent Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
