import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const SignIn = lazy(() => import('./pages/SignIn'));
const WorkspaceSelector = lazy(() => import('./pages/WorkspaceSelector'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const CompanyDashboard = lazy(() => import('./pages/CompanyDashboard'));
const InstitutionDashboard = lazy(() => import('./pages/InstitutionDashboard'));
const PassportPage = lazy(() => import('./pages/PassportPage'));
const SkillDetailPage = lazy(() => import('./pages/SkillDetailPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Skilloryn...</span>
      </div>
    </div>
  );
}

function App() {
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--cursor-x', `${event.clientX - rect.left}px`);
    target.style.setProperty('--cursor-y', `${event.clientY - rect.top}px`);
  };

  return (
    <Router>
      <div onPointerMove={handlePointerMove} className="min-h-screen bg-paper text-ink selection:bg-cyan-500/25 selection:text-ink relative overflow-hidden">
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
          <div className="theme-orb theme-orb-one" />
          <div className="theme-orb theme-orb-two" />
          <div className="theme-orb theme-orb-three" />
          <div className="theme-grid" />
          <div className="pointer-glow" />
        </div>
        <div className="relative z-10 h-full w-full">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/choose-workspace" element={<WorkspaceSelector />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/company" element={<CompanyDashboard />} />
              <Route path="/institution" element={<InstitutionDashboard />} />
              <Route path="/passport" element={<PassportPage />} />
              <Route path="/passport/:slug" element={<PassportPage />} />
              <Route path="/passport/:slug/skills/:skillId" element={<SkillDetailPage />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  );
}

export default App;
