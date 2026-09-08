import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import WorkspaceSelector from './pages/WorkspaceSelector';
import StudentDashboard from './pages/StudentDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import InstitutionDashboard from './pages/InstitutionDashboard';
import PassportPage from './pages/PassportPage';
import SkillDetailPage from './pages/SkillDetailPage';
import PasswordSecurityLab from './pages/PasswordSecurityLab';

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
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/choose-workspace" element={<WorkspaceSelector />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/company" element={<CompanyDashboard />} />
            <Route path="/institution" element={<InstitutionDashboard />} />
            <Route path="/passport/:slug" element={<PassportPage />} />
            <Route path="/passport/:slug/skills/:skillId" element={<SkillDetailPage />} />
            <Route path="/security-lab" element={<PasswordSecurityLab />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
