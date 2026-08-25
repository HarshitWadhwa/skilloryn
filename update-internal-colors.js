import fs from 'fs';
import path from 'path';

const files = [
  'src/App.tsx',
  'src/components/Navbar.tsx',
  'src/components/Hero.tsx',
  'src/components/Features.tsx',
  'src/components/Roles.tsx',
  'src/components/Footer.tsx',
  'src/pages/LandingPage.tsx',
  'src/pages/WorkspaceSelector.tsx',
  'src/pages/StudentDashboard.tsx',
  'src/pages/CompanyDashboard.tsx',
  'src/pages/InstitutionDashboard.tsx'
];

const replacements = [
  // Dashboard Sidebars & Headers
  { from: /<aside className="w-64 bg-white\/40 backdrop-blur-2xl border-r border-slate-200 hidden md:flex flex-col z-20">/g, to: '<aside className="w-64 bg-sunset-900 border-r border-sunset-900/10 hidden md:flex flex-col z-20 text-white">' },
  { from: /<header className="h-16 bg-white\/40 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">/g, to: '<header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">' },
  
  // Sidebar Logo background
  { from: /<div className="w-6 h-6 rounded bg-gradient-to-tr from-fuchsia-600 to-violet-600 flex items-center shadow-md shadow-fuchsia-500\/30 border border-fuchsia-400\/30 justify-center">/g, to: '<div className="w-6 h-6 rounded bg-sunset-500 flex items-center justify-center">' },
  { from: /<span className="font-bold text-slate-900 tracking-tight">Skilloryn<\/span>/g, to: '<span className="font-bold text-white tracking-tight">Skilloryn</span>' },
  { from: /<span className="text-slate-900 font-bold text-xs">/g, to: '<span className="text-white font-bold text-xs">' },
  
  // Sidebar workspace badge
  { from: /<span className="text-xs font-semibold text-fuchsia-400 bg-fuchsia-500\/10 px-2 py-0\.5 rounded border border-fuchsia-500\/20">Student Workspace<\/span>/g, to: '<span className="text-xs font-semibold text-sunset-300 bg-sunset-300/10 px-2 py-0.5 rounded border border-sunset-300/20">Student Workspace</span>' },
  { from: /<span className="text-xs font-semibold text-cyan-400 bg-cyan-500\/10 px-2 py-0\.5 rounded border border-cyan-500\/20">Company Workspace<\/span>/g, to: '<span className="text-xs font-semibold text-sunset-300 bg-sunset-300/10 px-2 py-0.5 rounded border border-sunset-300/20">Company Workspace</span>' },
  { from: /<span className="text-xs font-semibold text-amber-400 bg-amber-500\/10 px-2 py-0\.5 rounded border border-amber-500\/20">Institution Workspace<\/span>/g, to: '<span className="text-xs font-semibold text-sunset-300 bg-sunset-300/10 px-2 py-0.5 rounded border border-sunset-300/20">Institution Workspace</span>' },
  
  // Sidebar Nav Items (Fixing from previous script where text-white became text-slate-900)
  // Wait, in StudentDashboard it currently says:
  // "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === item.id ? 'bg-white shadow-sm border border-slate-200 text-skilloryn-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}"
  { from: /bg-white shadow-sm border border-slate-200 text-skilloryn-600/g, to: 'bg-white/10 text-white shadow-sm' },
  { from: /text-slate-500 hover:text-slate-900 hover:bg-slate-50/g, to: 'text-sunset-100/70 hover:text-white hover:bg-white/5' },
  
  // Dashboard Gradients for glassmorphism
  { from: /from-fuchsia-500 to-cyan-500/g, to: 'from-sunset-500 to-sunset-300' },
  { from: /from-fuchsia-600 to-cyan-600/g, to: 'from-sunset-500 to-sunset-300' },
  { from: /from-fuchsia-500 via-cyan-500 to-violet-500/g, to: 'from-sunset-500 via-sunset-300 to-orange-400' },
  
  // Glows
  { from: /bg-fuchsia-500\/10/g, to: 'bg-sunset-500/10' },
  { from: /bg-cyan-500\/10/g, to: 'bg-sunset-300/10' },
  { from: /text-fuchsia-400/g, to: 'text-sunset-500' },
  { from: /text-cyan-400/g, to: 'text-sunset-500' },
  { from: /text-violet-400/g, to: 'text-sunset-500' },

  // Buttons inside dashboards
  { from: /bg-slate-900/g, to: 'bg-sunset-900' }, // This might affect texts but since texts are text-slate-900 it should be fine
];

files.forEach(file => {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) {
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  
  replacements.forEach(({from, to}) => {
    content = content.replace(from, to);
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
});
