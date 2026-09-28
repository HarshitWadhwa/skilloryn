export interface TrendingItem {
  id: string;
  brand: string;
  category: string;
  title: string;
  subtitle?: string;
  bullets: string[];
  buttonText: string;
  buttonColor: string; // Tailwind class
  badgeColor: string;
  gradientClass: string;
  textColor: string;
  imageUrl?: string;
  linkUrl: string;
  type: 'competition' | 'webinar' | 'hackathon' | 'degree';
  deadline: string;
  registeredCount: string;
  prizeAmount?: string;
  ppiAvailable?: boolean;
}

export const TRENDING_ITEMS: TrendingItem[] = [
  {
    id: 'asian-paints-trailblazers',
    brand: 'asianpaints',
    category: 'SEASON 3',
    title: 'TRAILBLAZERS 2026',
    subtitle: 'India’s Premier Cross-Campus Analytics & Case Championship',
    bullets: [
      '200+ Pre-Placement Interviews (PPIs)',
      'Prizes worth up to ₹5 Lakhs',
      'Certificates at every stage of the Competition',
    ],
    buttonText: 'Register now',
    buttonColor: 'bg-[#d81b60] hover:bg-[#c2185b] text-white',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    gradientClass: 'from-[#fce4ec] via-[#ffe0b2] to-[#fff3e0]',
    textColor: 'text-slate-900',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    linkUrl: '#register-asianpaints',
    type: 'competition',
    deadline: 'Registration closes in 6 days',
    registeredCount: '18,420 registered',
    prizeAmount: '₹5 Lakhs',
    ppiAvailable: true,
  },
  {
    id: 'loreal-sustainability',
    brand: "L'ORÉAL",
    category: '10th Edition',
    title: 'Sustainability Challenge',
    subtitle: 'Re-inventing Green Consumer Tech & Brand Intelligence',
    bullets: [
      'Pre-Placement Interview (PPI) opportunity',
      'Exclusive L’Oréal merchandise',
      'Recognition with certificates',
    ],
    buttonText: 'Register Now',
    buttonColor: 'bg-[#00897b] hover:bg-[#00796b] text-white',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    gradientClass: 'from-[#e0f2f1] via-[#e8f5e9] to-[#f1f8e9]',
    textColor: 'text-slate-900',
    linkUrl: '#register-loreal',
    type: 'competition',
    deadline: 'Registration closes in 9 days',
    registeredCount: '24,190 registered',
    prizeAmount: 'PPI + Goodies',
    ppiAvailable: true,
  },
  {
    id: 'atlas-online-mba',
    brand: 'ATLAS ONLINE',
    category: 'Online MBA',
    title: 'What if you graduated with proof of work?',
    subtitle: 'Earn your degree while building your AI projects portfolio.',
    bullets: [
      '4 live AI builds & production deploy',
      'AI-native curriculum with top mentors',
      'UGC recognised modern MBA',
    ],
    buttonText: 'Apply Now',
    buttonColor: 'bg-[#cddc39] hover:bg-[#c0ca33] text-slate-900 font-extrabold',
    badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    gradientClass: 'from-[#0f172a] via-[#1e293b] to-[#334155]',
    textColor: 'text-white',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    linkUrl: '#apply-atlas',
    type: 'degree',
    deadline: 'Cohort starts Oct 15, 2026',
    registeredCount: '3,840 applicants',
  },
  {
    id: 'flipkart-grid',
    brand: 'Flipkart',
    category: 'GRiD 6.0',
    title: 'National Tech & Data Challenge',
    subtitle: 'Solve next-gen Indian e-commerce supply chain & recommendation problems',
    bullets: [
      '₹5,25,000 Total Cash Prize Pool',
      'Direct SDE & Data Analyst PPIs for Finalists',
      'Live All-India Campus Leaderboard',
    ],
    buttonText: 'Register Now',
    buttonColor: 'bg-[#2874f0] hover:bg-[#1259c7] text-white',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    gradientClass: 'from-[#e3f2fd] via-[#e8eaf6] to-[#ede7f6]',
    textColor: 'text-slate-900',
    linkUrl: '#register-flipkart',
    type: 'hackathon',
    deadline: 'Closes in 4 days',
    registeredCount: '31,500 registered',
    prizeAmount: '₹5.25 Lakhs',
    ppiAvailable: true,
  },
  {
    id: 'tata-crucible',
    brand: 'TATA',
    category: 'Campus Edition 2026',
    title: 'Tata Crucible Business Challenge',
    subtitle: 'The ultimate test of business acumen, corporate strategy, and data instincts',
    bullets: [
      '₹2.5 Lakhs Grand Cash Prize',
      'Executive Fast-track Interview rounds',
      'Campus Ambassador badges',
    ],
    buttonText: 'Register Now',
    buttonColor: 'bg-[#003366] hover:bg-[#002244] text-white',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    gradientClass: 'from-[#e8eaf6] via-[#e1f5fe] to-[#f3e5f5]',
    textColor: 'text-slate-900',
    linkUrl: '#register-tata',
    type: 'competition',
    deadline: 'Closes in 11 days',
    registeredCount: '14,200 registered',
    prizeAmount: '₹2.5 Lakhs',
    ppiAvailable: true,
  },
];
