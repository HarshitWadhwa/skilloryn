import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/choose-workspace');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="max-w-md w-full bg-surface rounded-2xl shadow-xl border border-line p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-skilloryn-600 flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h2 className="text-2xl font-bold text-ink">Sign in to Skilloryn</h2>
          <p className="text-muted mt-2 text-center text-sm">
            Enter your credentials to access your career intelligence workspace.
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-body mb-1">Email address</label>
            <input 
              type="email" 
              defaultValue="demo@skilloryn.com"
              className="w-full px-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-skilloryn-500 focus:border-skilloryn-500 outline-none transition-all" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-body mb-1">Password</label>
            <input 
              type="password" 
              defaultValue="password123"
              className="w-full px-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-skilloryn-500 focus:border-skilloryn-500 outline-none transition-all" 
              required 
            />
          </div>
          <button type="submit" className="w-full bg-skilloryn-600 hover:bg-skilloryn-700 text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 group">
            Sign In
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted">
          <p>This is a demo prototype. Click Sign In to continue.</p>
        </div>
      </div>
    </div>
  );
}
