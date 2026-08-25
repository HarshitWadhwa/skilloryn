import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-muted py-12 border-t border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-skilloryn-600 flex items-center justify-center">
                <span className="text-ink font-bold text-xl">S</span>
              </div>
              <span className="font-bold text-2xl text-ink tracking-tight">Skilloryn</span>
            </div>
            <p className="text-muted max-w-sm mb-6">
              An evidence-led career intelligence platform for academia–industry collaboration. Converting learning into actionable pathways.
            </p>
          </div>
          <div>
            <h4 className="text-ink font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/sign-in" className="hover:text-skilloryn-400 transition-colors">Skill Passport</Link></li>
              <li><Link to="/sign-in" className="hover:text-skilloryn-400 transition-colors">Learning Roadmap</Link></li>
              <li><Link to="/sign-in" className="hover:text-skilloryn-400 transition-colors">Opportunities</Link></li>
              <li><Link to="/sign-in" className="hover:text-skilloryn-400 transition-colors">AI Coach</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-ink font-semibold mb-4">Workspaces</h4>
            <ul className="space-y-2">
              <li><Link to="/sign-in" className="hover:text-skilloryn-400 transition-colors">For Students</Link></li>
              <li><Link to="/sign-in" className="hover:text-skilloryn-400 transition-colors">For Companies</Link></li>
              <li><Link to="/sign-in" className="hover:text-skilloryn-400 transition-colors">For Institutions</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-dark-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-sm">
            © 2026 Skilloryn Prototype. SIH Hackathon Submission.
          </p>
          <div className="flex gap-6 text-sm">
            <span className="text-muted cursor-not-allowed">Privacy</span>
            <span className="text-muted cursor-not-allowed">Terms</span>
            <span className="text-muted cursor-not-allowed">Consent Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
