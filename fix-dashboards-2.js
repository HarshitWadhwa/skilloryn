import fs from 'fs';
import path from 'path';

const files = [
  'src/pages/StudentDashboard.tsx',
  'src/pages/CompanyDashboard.tsx',
  'src/pages/InstitutionDashboard.tsx'
];

const replacements = [
  // 1. Remove background gradients completely for main banners and cards, replace with Sunset Sand Solid Dark
  { from: /bg-gradient-to-br from-fuchsia-600(?:\/80)? to-violet-600(?:\/80)? backdrop-blur-md border border-fuchsia-400\/30/g, to: 'bg-[#4A2C2A] border border-[#4A2C2A]/20' },
  { from: /bg-gradient-to-br from-cyan-600(?:\/80)? to-blue-600(?:\/80)? backdrop-blur-md border border-cyan-400\/30/g, to: 'bg-[#4A2C2A] border border-[#4A2C2A]/20' },
  { from: /bg-gradient-to-br from-amber-600(?:\/80)? to-orange-600(?:\/80)? backdrop-blur-md border border-amber-400\/30/g, to: 'bg-[#4A2C2A] border border-[#4A2C2A]/20' },
  { from: /bg-gradient-to-br from-emerald-600(?:\/80)? to-green-600(?:\/80)? backdrop-blur-md border border-emerald-400\/30/g, to: 'bg-[#4A2C2A] border border-[#4A2C2A]/20' },

  // 2. Fix sidebar active tabs (bg-fuchsia-500/20, bg-cyan-500/20) to Sunset Sand Orange-50
  { from: /bg-fuchsia-500\/20 text-fuchsia-300 shadow-sm shadow-fuchsia-500\/20 border border-fuchsia-500\/30/g, to: 'bg-orange-50 text-[#4A2C2A] shadow-sm border border-orange-200' },
  { from: /bg-cyan-500\/20 text-cyan-300 shadow-sm shadow-cyan-500\/20 border border-cyan-500\/30/g, to: 'bg-orange-50 text-[#4A2C2A] shadow-sm border border-orange-200' },
  { from: /bg-amber-500\/20 text-amber-300 shadow-sm shadow-amber-500\/20 border border-amber-500\/30/g, to: 'bg-orange-50 text-[#4A2C2A] shadow-sm border border-orange-200' },
  { from: /bg-emerald-500\/20 text-emerald-300 shadow-sm shadow-emerald-500\/20 border border-emerald-500\/30/g, to: 'bg-orange-50 text-[#4A2C2A] shadow-sm border border-orange-200' },
  { from: /bg-fuchsia-100/g, to: 'bg-orange-50' },
  { from: /bg-cyan-100/g, to: 'bg-orange-50' },
  { from: /bg-amber-100/g, to: 'bg-orange-50' },

  // 3. Buttons (bg-gradient-to-r from-fuchsia-600 to-violet-600) -> bg-amber-500
  { from: /bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-slate-900/g, to: 'bg-amber-500 hover:bg-amber-400 text-[#4A2C2A]' },
  { from: /bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-900/g, to: 'bg-amber-500 hover:bg-amber-400 text-[#4A2C2A]' },
  { from: /bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-slate-900/g, to: 'bg-amber-500 hover:bg-amber-400 text-[#4A2C2A]' },

  { from: /bg-gradient-to-r from-fuchsia-600 to-violet-600 text-slate-900/g, to: 'bg-amber-500 text-[#4A2C2A]' },
  { from: /bg-gradient-to-r from-cyan-600 to-blue-600 text-slate-900/g, to: 'bg-amber-500 text-[#4A2C2A]' },
  
  { from: /bg-gradient-to-r from-fuchsia-500 to-violet-500 text-slate-900/g, to: 'bg-amber-500 text-[#4A2C2A]' },
  { from: /bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900/g, to: 'bg-amber-500 text-[#4A2C2A]' },

  { from: /hover:from-fuchsia-400 hover:to-violet-400/g, to: 'hover:bg-amber-400' },
  { from: /hover:from-fuchsia-500 hover:to-violet-500/g, to: 'hover:bg-amber-400' },
  { from: /hover:from-cyan-400 hover:to-blue-400/g, to: 'hover:bg-amber-400' },
  { from: /hover:from-cyan-500 hover:to-blue-500/g, to: 'hover:bg-amber-400' },

  // 4. Icons and Badges (from-fuchsia-600 to-violet-600) -> bg-amber-500
  { from: /bg-gradient-to-tr from-fuchsia-600 to-violet-600/g, to: 'bg-amber-500' },
  { from: /bg-gradient-to-tr from-cyan-600 to-blue-600/g, to: 'bg-amber-500' },
  { from: /bg-gradient-to-tr from-amber-600 to-orange-600/g, to: 'bg-amber-500' },

  { from: /bg-gradient-to-tr from-fuchsia-500 via-violet-500 to-cyan-500 text-slate-900/g, to: 'bg-amber-500 text-[#4A2C2A]' },

  { from: /bg-gradient-to-r from-fuchsia-500 to-violet-500/g, to: 'bg-amber-500' },
  { from: /bg-gradient-to-r from-cyan-500 to-blue-500/g, to: 'bg-amber-500' },

  // 5. Active Tab Icons
  { from: /text-amber-500/g, to: 'text-amber-600' }, // Just to darken it slightly if it was used for active icons
  { from: /text-cyan-500/g, to: 'text-amber-600' },
  { from: /text-fuchsia-500/g, to: 'text-amber-600' },

  // 6. Text formatting inside the dark banners
  { from: /text-slate-900 shadow-md relative overflow-hidden group/g, to: 'text-white shadow-md relative overflow-hidden group' },
  { from: /text-slate-900 rounded-lg text-sm/g, to: 'text-white rounded-lg text-sm' },
  { from: /text-slate-900 rounded-xl text-sm/g, to: 'text-white rounded-xl text-sm' },
  { from: /text-slate-900 font-semibold/g, to: 'text-white font-semibold' },
  { from: /text-slate-900 rounded-xl font-bold/g, to: 'text-white rounded-xl font-bold' },
  { from: /text-slate-900 shadow-/g, to: 'text-white shadow-' },
  
  // Specifically fix the main banner title/content colors from the screenshot which might be text-slate-900
  { from: /text-slate-900 mb-2/g, to: 'text-white mb-2' },
  { from: /text-slate-800 mb-4/g, to: 'text-white/90 mb-4' },
  { from: /text-slate-800 font-bold/g, to: 'text-white font-bold' },
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
