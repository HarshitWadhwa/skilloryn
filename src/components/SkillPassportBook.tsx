import { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  Award, CheckCircle2, ChevronLeft, ChevronRight,
  Download, ExternalLink, Fingerprint, Link2,
  Play, QrCode, Share2, ShieldCheck, BookOpen
} from 'lucide-react';
import janeAvatar from '../assets/jane-doe-avatar.svg';

export type SkillStatus = 'Verified' | 'Reviewed' | 'Self-Reported';

export interface PassportSkill {
  id: string;
  name: string;
  short: string;
  description: string;
  status: SkillStatus;
  score?: string;
  source: string;
  issueDate?: string;
}

export interface PassportProject {
  id: string;
  rank: number;
  title: string;
  description: string;
  url: string;
  label: string;
  stack: string[];
  outcome: string;
}

export interface PassportProfile {
  name: string;
  slug: string;
  role: string;
  level: string;
  location: string;
  email: string;
  photo?: string;
  summary: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export const DEFAULT_PROFILE: PassportProfile = {
  name: 'Jane Doe',
  slug: 'jane-doe',
  role: 'Data Analyst & Insights Specialist',
  level: 'Level 12 Candidate',
  location: 'London · Remote Ready',
  email: 'jane.doe@skilloryn.io',
  photo: janeAvatar,
  summary: 'Evidence-led analyst transforming raw telemetry and messy transactional logs into explainable growth strategies and high-retention product decisions.',
  linkedin: 'https://www.linkedin.com/in/jane-doe',
  github: 'https://github.com/janedoe',
  portfolio: 'https://janedoe.notion.site/portfolio',
};

export const DEFAULT_SKILLS: PassportSkill[] = [
  {
    id: 'advanced-sql',
    name: 'Advanced SQL & Window Functions',
    short: 'SQL',
    description: 'Complex partition windows, subqueries, indexing heuristics, and execution plan optimisation.',
    status: 'Verified',
    score: '92/100',
    source: 'Skilloryn Adaptive Diagnostic',
    issueDate: 'SEPT 2026',
  },
  {
    id: 'python-analysis',
    name: 'Python Data Analysis & ML',
    short: 'PY',
    description: 'Pandas, NumPy, statistical modeling, Scikit-Learn pipelines, and reproducible notebook artifacts.',
    status: 'Reviewed',
    score: '4 Artifacts',
    source: 'Project Evidence Peer Review',
    issueDate: 'AUG 2026',
  },
  {
    id: 'experimentation',
    name: 'A/B Testing & Causal Inference',
    short: 'A/B',
    description: 'Hypothesis pre-registration, MDE calculation, statistical power, and executive decision readouts.',
    status: 'Verified',
    score: '86/100',
    source: 'Skilloryn Mission Assessment',
    issueDate: 'SEP 2026',
  },
  {
    id: 'tableau',
    name: 'Tableau Visualisation & Dashboards',
    short: 'VIZ',
    description: 'Cohort drop-off command centers, executive storytelling, and interactive drill-down views.',
    status: 'Self-Reported',
    score: 'Portfolio Claim',
    source: 'Candidate Portfolio Submission',
    issueDate: 'JUL 2026',
  },
];

export const DEFAULT_PROJECTS: PassportProject[] = [
  {
    id: 'churn-model',
    rank: 1,
    title: 'Ecommerce Churn Predictor',
    description: 'Full-funnel customer churn prediction pipeline using XGBoost with feature engineering.',
    url: 'https://github.com/janedoe/ecommerce-churn-model',
    label: 'GitHub Repository',
    stack: ['Python', 'Pandas', 'XGBoost'],
    outcome: 'Improved churn recall by 18%.',
  },
  {
    id: 'retention-dashboard',
    rank: 2,
    title: 'Cohort Retention Command Center',
    description: 'Decision-ready analytics dashboard tracking weekly cohorts and drop-off factors.',
    url: 'https://janedoe.notion.site/retention-command-centre',
    label: 'Interactive Dashboard',
    stack: ['Tableau', 'SQL', 'Storytelling'],
    outcome: 'Reduced reporting cycle to 2 hours.',
  },
  {
    id: 'experiment-readout',
    rank: 3,
    title: 'Pricing Experiment Memo',
    description: 'Pre-registered A/B pricing test translation memo for senior stakeholders.',
    url: 'https://github.com/janedoe/pricing-experiment-readout',
    label: 'Evidence Memo',
    stack: ['Python', 'Statistics', 'A/B Testing'],
    outcome: 'Recommended a 7% pricing uplift.',
  },
];

interface SkillPassportBookProps {
  profile?: PassportProfile;
  skills?: PassportSkill[];
  projects?: PassportProject[];
  passportId?: string;
  selectedSkills?: Record<string, boolean>;
  selectedProjects?: Record<string, boolean>;
  onToggleSkill?: (id: string) => void;
  onToggleProject?: (id: string) => void;
  isInteractivePreview?: boolean;
  showCoverByDefault?: boolean;
}

export default function SkillPassportBook({
  profile = DEFAULT_PROFILE,
  skills = DEFAULT_SKILLS,
  projects = DEFAULT_PROJECTS,
  passportId = 'SKY-DA-9482-JANE',
  selectedSkills,
  selectedProjects,
  isInteractivePreview = false,
  showCoverByDefault = false,
}: SkillPassportBookProps) {
  const [isOpen, setIsOpen] = useState(!showCoverByDefault);
  const [currentPageSpread, setCurrentPageSpread] = useState<0 | 1 | 2>(0); // 0: Pages 02-03 (Identity & Visas), 1: Pages 04-05 (Evidence & Repos), 2: Pages 06-07 (Journey Atlas)
  const [activeStampSkill, setActiveStampSkill] = useState<PassportSkill | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const passportBookRef = useRef<HTMLDivElement>(null);

  const activeSkills = useMemo(() => {
    if (!selectedSkills) return skills;
    return skills.filter((s) => selectedSkills[s.id] !== false);
  }, [skills, selectedSkills]);

  const activeProjects = useMemo(() => {
    if (!selectedProjects) return projects;
    return projects.filter((p) => selectedProjects[p.id] !== false);
  }, [projects, selectedProjects]);

  const verifiedCount = activeSkills.filter((s) => s.status === 'Verified').length;
  const shareUrl = `${window.location.origin}/passport/${profile.slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2400);
    } catch {
      setIsCopied(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!passportBookRef.current) return;
    setIsDownloading(true);
    try {
      // Temporarily ensure book is open and at page spread 0 for clean biometric PDF
      const wasOpen = isOpen;
      const prevSpread = currentPageSpread;
      setIsOpen(true);
      setCurrentPageSpread(0);

      await new Promise((r) => setTimeout(r, 200));

      const canvas = await html2canvas(passportBookRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const margin = 10;
      const pdfWidth = 277;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/png', 1.0);

      pdf.addImage(imgData, 'PNG', margin, 12, pdfWidth, pdfHeight);

      // Embedded PDF clickable link to verify
      pdf.link(margin, 12, pdfWidth, pdfHeight, { url: shareUrl });

      pdf.save(`Skilloryn-Passport-${profile.name.replace(/\s+/g, '-')}-${passportId}.pdf`);

      if (!wasOpen) setIsOpen(false);
      setCurrentPageSpread(prevSpread);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Booklet Quick Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-3 mb-3 px-1 text-xs text-muted">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-bold text-navy">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Biometric Skill Passport
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline font-mono text-[11px] font-semibold text-slate-600">
            {passportId}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-navy font-bold shadow-xs transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            {isOpen ? 'Close Booklet' : 'Open Booklet'}
          </button>

          {isOpen && (
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs">
              <button
                onClick={() => setCurrentPageSpread((p) => (p > 0 ? (p - 1) as any : 2))}
                className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-navy transition-colors"
                title="Previous Spread"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-bold px-1.5 text-slate-700">
                {currentPageSpread === 0 ? 'P. 02-03' : currentPageSpread === 1 ? 'P. 04-05' : 'P. 06-07'}
              </span>
              <button
                onClick={() => setCurrentPageSpread((p) => (p < 2 ? (p + 1) as any : 0))}
                className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-navy transition-colors"
                title="Next Spread"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* THE PASSPORT BOOKLET STAGE */}
      <div className="w-full max-w-4xl relative select-none" style={{ perspective: 1800 }}>
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="closed-cover"
              initial={{ rotateY: 15, opacity: 0, scale: 0.95 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: -80, opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'left center' }}
              onClick={() => setIsOpen(true)}
              className="group cursor-pointer mx-auto w-full max-w-[420px] aspect-[1/1.42] rounded-2xl bg-gradient-to-br from-[#0c1a2e] via-[#091526] to-[#050d18] border-2 border-[#1e293b] p-8 sm:p-10 flex flex-col justify-between items-center text-center relative overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_30px_70px_rgba(10,25,47,0.45)]"
            >
              {/* Leatherette Grain Texture */}
              <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              {/* Gold Shimmer Foil Sweep */}
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-amber-300/10 to-transparent group-hover:translate-x-full duration-1000 transition-transform pointer-events-none" />

              {/* Gold Dashed Perimeter Stitching */}
              <div className="absolute inset-3 rounded-xl border border-dashed border-amber-400/40 pointer-events-none" />

              {/* Cover Header */}
              <div className="relative z-10 space-y-1.5 pt-2">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-extrabold text-amber-300/80">
                  Global Talent Network
                </p>
                <p className="text-xl sm:text-2xl font-black tracking-widest text-amber-200">
                  SKILLORYN
                </p>
              </div>

              {/* Gold Embossed Emblem & Biometric Icon */}
              <div className="relative z-10 flex flex-col items-center my-auto py-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-amber-400/50 p-2 flex items-center justify-center relative shadow-[0_0_25px_rgba(251,191,36,0.15)] group-hover:shadow-[0_0_35px_rgba(251,191,36,0.3)] transition-all">
                  <div className="w-full h-full rounded-full border border-amber-300/30 flex items-center justify-center bg-gradient-to-b from-amber-400/10 to-transparent">
                    <Award className="w-12 h-12 text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
                  </div>
                </div>

                {/* Official ICAO Biometric Symbol */}
                <div className="mt-5 flex items-center justify-center">
                  <div className="w-9 h-5 border-2 border-amber-400/80 rounded-sm flex items-center justify-center relative">
                    <div className="w-3 h-3 rounded-full border-2 border-amber-400/80" />
                    <div className="absolute left-0 right-0 h-0.5 bg-amber-400/80" />
                  </div>
                </div>
              </div>

              {/* Cover Title & Candidate Info */}
              <div className="relative z-10 space-y-3 pb-2 w-full">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-wider text-amber-200 leading-tight">
                    SKILL PASSPORT
                  </h3>
                  <p className="text-[10px] tracking-widest uppercase text-amber-300/70 font-semibold mt-0.5">
                    Verified Biometric Credential
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-400/20 text-center">
                  <p className="text-sm font-bold text-slate-200 tracking-wide">{profile.name}</p>
                  <p className="text-[10px] font-mono text-amber-300/80 mt-0.5">{passportId}</p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-bold text-amber-300 group-hover:bg-amber-400/20 transition-colors">
                  <Play className="w-3 h-3 fill-current" /> Click to Open Passport
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="open-spread"
              ref={passportBookRef}
              initial={{ rotateY: 80, opacity: 0, scale: 0.92 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: -15, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'center center' }}
              className="w-full rounded-2xl bg-white border border-slate-300 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] overflow-hidden relative"
            >
            {/* Spine Center Fold Shadow & Stitches */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-8 -translate-x-1/2 bg-gradient-to-r from-black/10 via-black/[0.02] to-black/10 pointer-events-none z-20" />
            <div className="hidden md:block absolute top-4 bottom-4 left-1/2 w-px -translate-x-1/2 bg-slate-300/80 pointer-events-none z-20" />

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              {/* LEFT PAGE: BIOMETRIC IDENTITY PAGE */}
              <div className="p-5 sm:p-7 bg-[#fcfdfd] passport-guilloche-bg flex flex-col justify-between relative min-h-[460px]">
                {/* Security Background Micro-lines */}
                <div className="space-y-4">
                  {/* Passport Authority Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-navy">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-navy text-amber-300 flex items-center justify-center font-bold text-xs shadow-xs">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-wider font-extrabold text-blue-700 leading-none">
                          Skilloryn Trust Network
                        </p>
                        <p className="text-xs font-black text-navy tracking-tight mt-0.5">
                          PASSPORT / PASSEPORT
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-semibold">
                        Type / Code
                      </span>
                      <span className="text-xs font-bold text-navy">P · SKL</span>
                    </div>
                  </div>

                  {/* Biometric Portrait & Metadata Table */}
                  <div className="flex gap-4 sm:gap-5 items-start pt-1">
                    {/* Portrait with Holographic Seal */}
                    <div className="relative shrink-0">
                      <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl border-2 border-slate-300 p-1 bg-white shadow-xs relative overflow-hidden">
                        <img
                          src={profile.photo || janeAvatar}
                          alt={profile.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {/* Holographic Watermark Badge */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-amber-300/10 to-transparent pointer-events-none" />
                        <div className="absolute bottom-1.5 left-1 right-1 bg-navy/90 text-white text-[7.5px] font-bold text-center py-0.5 rounded tracking-wider uppercase">
                          VERIFIED ID
                        </div>
                      </div>

                      {/* Official Live Status Dot */}
                      <div className="mt-2 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8.5px] font-extrabold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> AUTHENTICATED
                        </span>
                      </div>
                    </div>

                    {/* Official Metadata Grid */}
                    <div className="flex-1 min-w-0 space-y-2 text-xs">
                      <div>
                        <span className="text-[8.5px] uppercase tracking-wider font-bold text-slate-400 block leading-none">
                          Surname / Nom
                        </span>
                        <p className="font-extrabold text-navy text-sm uppercase tracking-wide">
                          {profile.name.split(' ').slice(-1)[0] || 'DOE'}
                        </p>
                      </div>

                      <div>
                        <span className="text-[8.5px] uppercase tracking-wider font-bold text-slate-400 block leading-none">
                          Given Names / Prénoms
                        </span>
                        <p className="font-bold text-navy text-xs uppercase tracking-wide">
                          {profile.name.split(' ').slice(0, -1).join(' ') || 'JANE'}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[8.5px] uppercase tracking-wider font-bold text-slate-400 block leading-none">
                            Specialisation
                          </span>
                          <p className="font-bold text-blue-700 text-[11px] truncate">
                            {profile.role.split('&')[0]}
                          </p>
                        </div>
                        <div>
                          <span className="text-[8.5px] uppercase tracking-wider font-bold text-slate-400 block leading-none">
                            Passport No.
                          </span>
                          <p className="font-mono font-bold text-navy text-[11px]">
                            {passportId}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[8.5px] uppercase tracking-wider font-bold text-slate-400 block leading-none">
                            Date of Issue
                          </span>
                          <p className="font-mono text-slate-700 text-[10.5px]">28 SEP 2026</p>
                        </div>
                        <div>
                          <span className="text-[8.5px] uppercase tracking-wider font-bold text-slate-400 block leading-none">
                            Validity
                          </span>
                          <p className="font-bold text-emerald-700 text-[10.5px]">CONTINUOUS</p>
                        </div>
                      </div>

                      {/* Bearer Signature Simulation */}
                      <div className="pt-1 border-t border-slate-200">
                        <span className="text-[8px] uppercase tracking-wider text-slate-400 block">
                          Bearer's Signature / Signature du titulaire
                        </span>
                        <p className="font-serif italic text-base text-slate-800 tracking-wider">
                          {profile.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Machine Readable Zone (MRZ) Optical Strip */}
                <div className="mt-4 pt-2.5 mrz-strip text-[9px] sm:text-[10px] text-slate-600 font-mono tracking-widest uppercase overflow-x-hidden leading-tight">
                  <p className="truncate">P&lt;SKL{profile.name.replace(/\s+/g, '&lt;&lt;').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</p>
                  <p className="truncate">{passportId.replace(/[^A-Z0-9]/g, '')}3GBR0101018F2609287&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;04</p>
                </div>

                <div className="flex items-center justify-between text-[8px] text-slate-400 pt-2 border-t border-slate-100">
                  <span>PAGE 02</span>
                  <span className="flex items-center gap-1 font-mono">
                    <QrCode className="w-3 h-3 text-slate-500" /> Cryptographic Ledger Seal
                  </span>
                </div>
              </div>

              {/* RIGHT PAGE: DYNAMIC SPREAD (VISAS, EVIDENCE, OR ROUTE) */}
              <div className="p-5 sm:p-7 bg-[#fcfdfd] passport-guilloche-bg flex flex-col justify-between relative min-h-[460px]">
                {/* SPREAD 0: VISAS & SKILL STAMPS (Page 03) */}
                {currentPageSpread === 0 && (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider font-extrabold text-blue-700 leading-none">
                          Endorsements & Visas
                        </p>
                        <h4 className="text-xs font-black text-navy tracking-tight mt-0.5">
                          VERIFIED SKILL STAMPS ({activeSkills.length})
                        </h4>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400">PAGE 03</span>
                    </div>

                    {/* Realistic Ink Stamps Grid */}
                    <div className="grid grid-cols-2 gap-3.5 py-1">
                      {activeSkills.map((skill, index) => {
                        const isVerified = skill.status === 'Verified';
                        const isReviewed = skill.status === 'Reviewed';
                        const rotationAngles = ['-4deg', '3deg', '-6deg', '4deg'];
                        const angle = rotationAngles[index % rotationAngles.length];

                        return (
                          <div
                            key={skill.id}
                            onClick={() => setActiveStampSkill(skill)}
                            style={{ transform: `rotate(${angle})` }}
                            className={`stamp-seal p-3 rounded-xl cursor-pointer border-2 transition-all relative ${
                              isVerified
                                ? 'border-blue-700 text-blue-900 bg-blue-50/40 hover:bg-blue-50'
                                : isReviewed
                                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/40 hover:bg-emerald-50'
                                : 'border-amber-700 text-amber-900 bg-amber-50/40 hover:bg-amber-50'
                            }`}
                          >
                            <div className="w-full flex items-center justify-between mb-1">
                              <span className="text-[7.5px] font-black tracking-widest uppercase">
                                ★ SKILLORYN STAMP ★
                              </span>
                              <span className="text-[7px] font-mono font-bold">
                                {skill.issueDate || 'SEP 2026'}
                              </span>
                            </div>

                            <p className="text-xs font-black text-navy text-center my-0.5 line-clamp-1">
                              {skill.name}
                            </p>

                            <div className="w-full flex items-center justify-between mt-1 pt-1 border-t border-current/20 text-[8px] font-bold">
                              <span className="uppercase">{skill.status}</span>
                              <span className="font-mono">{skill.score || 'CERTIFIED'}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Active Stamp Inspector / Quick Detail */}
                    {activeStampSkill ? (
                      <div className="mt-2 p-3 rounded-xl bg-slate-100/90 border border-slate-300 text-xs animate-fade-in">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-navy">{activeStampSkill.name}</span>
                          <Link
                            to={`/passport/${profile.slug}/skills/${activeStampSkill.id}`}
                            className="text-[10px] font-bold text-blue-700 hover:underline inline-flex items-center gap-0.5"
                          >
                            Inspect Trail <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {activeStampSkill.description}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                          <span>Source: <strong>{activeStampSkill.source}</strong></span>
                          <span className="font-mono font-bold text-navy">{activeStampSkill.score}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 p-2.5 rounded-xl border border-dashed border-slate-300 text-center text-slate-500 text-[10px]">
                        Click any visa stamp above to inspect verified telemetry & assessment proofs.
                      </div>
                    )}
                  </div>
                )}

                {/* SPREAD 1: EVIDENCE DOSSIER & REPOSITORIES (Page 04-05) */}
                {currentPageSpread === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider font-extrabold text-blue-700 leading-none">
                          Evidence Dossier
                        </p>
                        <h4 className="text-xs font-black text-navy tracking-tight mt-0.5">
                          LINKED ARTIFACTS & WORK ({activeProjects.length})
                        </h4>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400">PAGE 05</span>
                    </div>

                    <div className="space-y-2.5">
                      {activeProjects.map((project) => (
                        <a
                          key={project.id}
                          href={project.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-bold text-navy group-hover:text-blue-700 flex items-center gap-1.5">
                                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                                  #{project.rank}
                                </span>
                                {project.title}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {project.label} · {project.outcome}
                              </p>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.stack.map((tech) => (
                              <span
                                key={tech}
                                className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[8.5px] font-bold"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* SPREAD 2: FLIGHT ATLAS & CAREER ROUTE (Page 06-07) */}
                {currentPageSpread === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider font-extrabold text-blue-700 leading-none">
                          Navigation Route
                        </p>
                        <h4 className="text-xs font-black text-navy tracking-tight mt-0.5">
                          DATA ANALYST FLIGHT PATH
                        </h4>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400">PAGE 07</span>
                    </div>

                    <div className="p-3 rounded-xl bg-navy text-white space-y-3">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-300">Course Milestones</span>
                        <span className="font-bold text-amber-300">Stop 4 of 5 (Final Approach)</span>
                      </div>

                      <div className="space-y-2">
                        {[
                          { title: 'Core SQL Diagnostic', status: 'Completed (92/100)' },
                          { title: 'Python Notebook Evaluation', status: 'Verified' },
                          { title: 'A/B Hypothesis Memo', status: 'Passed' },
                          { title: 'Monzo Product Analyst Ready', status: 'Target Role (94% Match)' },
                        ].map((m, i) => (
                          <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-700/60 last:border-0">
                            <span className="flex items-center gap-2 text-slate-200">
                              <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
                                {i + 1}
                              </span>
                              {m.title}
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-400">{m.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Right Page Footer */}
                <div className="flex items-center justify-between text-[8px] text-slate-400 pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1 font-bold text-emerald-700">
                    <Fingerprint className="w-3 h-3" /> OFFICIAL SKILLORYN SEAL
                  </span>
                  <span>CONFIDENTIAL CANDIDATE RECORD</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

      {/* BOOKLET ACTION BUTTONS & SHARING BAR */}
      {!isInteractivePreview && (
        <div className="w-full max-w-4xl mt-5 flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Generating PDF...' : 'Download Passport PDF'}
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-navy text-xs font-bold shadow-xs transition-all"
            >
              {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4 text-blue-600" />}
              {isCopied ? 'Link Copied!' : 'Copy Share Link'}
            </button>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#0a66c2]/30 bg-[#0a66c2]/5 hover:bg-[#0a66c2]/10 text-[#0a66c2] text-xs font-bold transition-all"
            >
              <Share2 className="w-3.5 h-3.5" /> Share to LinkedIn
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">{verifiedCount} of {activeSkills.length} claims verified</span>
          </div>
        </div>
      )}
    </div>
  );
}
