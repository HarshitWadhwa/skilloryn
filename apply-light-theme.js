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

// Conversions for dark glassmorphism -> light theme
const replacements = [
  // Backgrounds
  { from: /bg-slate-950/g, to: 'bg-[#FFFBF6]' },
  { from: /bg-slate-900/g, to: 'bg-white' },
  { from: /bg-white\/5/g, to: 'bg-white' },
  { from: /bg-white\/10/g, to: 'bg-white' },
  { from: /bg-white\/\[0\.02\]/g, to: 'bg-slate-50' },
  
  // Text colors
  { from: /text-white/g, to: 'text-slate-900' },
  { from: /text-slate-300/g, to: 'text-slate-600' },
  { from: /text-slate-400/g, to: 'text-slate-500' },
  
  // Borders
  { from: /border-white\/10/g, to: 'border-slate-200' },
  { from: /border-white\/20/g, to: 'border-slate-300' },

  // Specific shadows
  { from: /shadow-lg/g, to: 'shadow-md' },
  { from: /shadow-\[0_8px_30px_rgb\(0\,0\,0\,0\.2\)\]/g, to: 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]' }
];

files.forEach(file => {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - not found`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  
  replacements.forEach(({from, to}) => {
    content = content.replace(from, to);
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
