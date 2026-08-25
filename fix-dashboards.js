import fs from 'fs';
import path from 'path';

const files = [
  'src/pages/StudentDashboard.tsx',
  'src/pages/CompanyDashboard.tsx',
  'src/pages/InstitutionDashboard.tsx'
];

const replacements = [
  // Student Dashboard (Fuchsia / Violet)
  { from: /from-fuchsia-600(?:\/80)?/g, to: 'from-amber-500' },
  { from: /to-violet-600(?:\/80)?/g, to: 'to-orange-400' },
  { from: /from-fuchsia-500(?:\/\d+)?/g, to: 'from-amber-500' },
  { from: /to-violet-500(?:\/\d+)?/g, to: 'to-orange-400' },
  { from: /via-violet-500/g, to: 'via-orange-400' },
  { from: /to-cyan-500/g, to: 'to-orange-300' },
  { from: /from-fuchsia-400/g, to: 'from-amber-400' },
  { from: /hover:from-fuchsia-500/g, to: 'hover:from-amber-400' },
  { from: /hover:to-violet-500/g, to: 'hover:to-orange-300' },
  { from: /hover:from-fuchsia-400/g, to: 'hover:from-amber-400' },
  { from: /hover:to-violet-400/g, to: 'hover:to-orange-300' },
  { from: /bg-fuchsia-500\/20/g, to: 'bg-orange-100' },
  { from: /text-fuchsia-300/g, to: 'text-[#4A2C2A]' },
  { from: /shadow-fuchsia-500\/(?:\d+)/g, to: 'shadow-amber-500/20' },
  { from: /border-fuchsia-500\/(?:\d+)/g, to: 'border-orange-200' },
  { from: /border-fuchsia-400\/(?:\d+)/g, to: 'border-orange-200' },
  { from: /bg-fuchsia-100/g, to: 'bg-orange-50' },
  { from: /text-fuchsia-900/g, to: 'text-[#4A2C2A]' },

  // Company Dashboard (Cyan / Blue)
  { from: /from-cyan-600(?:\/80)?/g, to: 'from-[#4A2C2A]' },
  { from: /to-blue-600(?:\/80)?/g, to: 'to-[#4A2C2A]' },
  { from: /from-cyan-500(?:\/\d+)?/g, to: 'from-[#4A2C2A]' },
  { from: /to-blue-500(?:\/\d+)?/g, to: 'to-[#4A2C2A]' },
  { from: /from-cyan-400/g, to: 'from-orange-400' },
  { from: /hover:from-cyan-500/g, to: 'hover:from-[#4A2C2A]/80' },
  { from: /hover:to-blue-500/g, to: 'hover:to-[#4A2C2A]/80' },
  { from: /bg-cyan-500\/20/g, to: 'bg-blue-50' },
  { from: /text-cyan-300/g, to: 'text-blue-800' },
  { from: /shadow-cyan-500\/(?:\d+)/g, to: 'shadow-blue-500/20' },
  { from: /border-cyan-500\/(?:\d+)/g, to: 'border-blue-200' },
  { from: /border-cyan-400\/(?:\d+)/g, to: 'border-blue-200' },

  // Institution Dashboard (Amber / Orange - old neon version)
  // Wait, Institution already uses amber/orange. Let's make sure it matches the new theme
  { from: /from-amber-600(?:\/80)?/g, to: 'from-[#4A2C2A]' },
  { from: /to-orange-600(?:\/80)?/g, to: 'to-[#4A2C2A]' },
  { from: /bg-amber-500\/20/g, to: 'bg-emerald-50' },
  { from: /text-amber-300/g, to: 'text-emerald-800' },

  // Fix button text colors for the dark main banner
  { from: /text-slate-900 shadow-md relative overflow-hidden group/g, to: 'text-white shadow-md relative overflow-hidden group' },
  { from: /text-slate-900 rounded-lg text-sm/g, to: 'text-white rounded-lg text-sm' },
  { from: /text-slate-900 rounded-xl text-sm/g, to: 'text-white rounded-xl text-sm' },
  { from: /text-slate-900 font-semibold/g, to: 'text-white font-semibold' },
  { from: /text-slate-900 shadow-/g, to: 'text-white shadow-' },
  { from: /text-slate-900 rounded-xl font-bold/g, to: 'text-white rounded-xl font-bold' },
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
