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
  { from: /bg-sunset-900/g, to: 'bg-[#4A2C2A]' },
  { from: /text-sunset-900/g, to: 'text-[#4A2C2A]' },
  { from: /border-sunset-900/g, to: 'border-[#4A2C2A]' },
  { from: /from-sunset-900/g, to: 'from-[#4A2C2A]' },

  { from: /bg-sunset-500/g, to: 'bg-amber-500' },
  { from: /text-sunset-500/g, to: 'text-amber-500' },
  { from: /border-sunset-500/g, to: 'border-amber-500' },
  { from: /from-sunset-500/g, to: 'from-amber-500' },
  { from: /to-sunset-500/g, to: 'to-amber-500' },
  { from: /shadow-sunset-500/g, to: 'shadow-amber-500' },

  { from: /bg-sunset-300/g, to: 'bg-orange-300' },
  { from: /text-sunset-300/g, to: 'text-orange-300' },
  { from: /border-sunset-300/g, to: 'border-orange-300' },
  { from: /to-sunset-300/g, to: 'to-orange-300' },
  { from: /via-sunset-300/g, to: 'via-orange-300' },

  { from: /bg-sunset-100/g, to: 'bg-orange-50' },
  { from: /text-sunset-100/g, to: 'text-orange-100' },
  
  { from: /bg-sunset-50/g, to: 'bg-[#FFFBF6]' },
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
