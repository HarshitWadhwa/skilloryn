import { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Code2,
  Cpu,
  CheckCircle2,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

type RoleCategory = 'analytics' | 'fullstack' | 'aiml';

interface RoleData {
  id: RoleCategory;
  label: string;
  icon: typeof TrendingUp;
  candidate: {
    name: string;
    role: string;
    level: string;
    score: number;
    initials: string;
  };
  topMatch: {
    company: string;
    logoText: string;
    logoBg: string;
    title: string;
    location: string;
    stipend: string;
    fit: number;
    tags: string[];
  };
  secondaryMatch: {
    company: string;
    logoText: string;
    logoBg: string;
    title: string;
    location: string;
    stipend: string;
    fit: number;
  };
  proofItems: Array<{
    title: string;
    desc: string;
    metric: string;
    icon: typeof TrendingUp;
    color: string;
  }>;
  ticker: string;
}

const ROLES_DATA: Record<RoleCategory, RoleData> = {
  analytics: {
    id: 'analytics',
    label: 'Product Analytics',
    icon: TrendingUp,
    candidate: {
      name: 'Aarav Patel',
      role: 'Product Data Analyst Candidate',
      level: 'Level 12 Verified',
      score: 94,
      initials: 'AP',
    },
    topMatch: {
      company: 'Swiggy',
      logoText: 'SW',
      logoBg: 'bg-orange-50 text-orange-600 border-orange-200',
      title: 'Product Data Analyst Intern',
      location: 'Bengaluru, Karnataka',
      stipend: '₹45,000 / month',
      fit: 96,
      tags: ['✓ Advanced SQL (92/100)', '✓ Cohort Retention Memo', '✓ Churn ML Notebook'],
    },
    secondaryMatch: {
      company: 'CRED',
      logoText: 'CR',
      logoBg: 'bg-purple-50 text-purple-600 border-purple-200',
      title: 'Product Insights Intern',
      location: 'Bengaluru',
      stipend: '₹50,000 / month',
      fit: 92,
    },
    proofItems: [
      {
        title: 'Advanced SQL & Window Functions',
        desc: 'Partitioned analytics diagnostic',
        metric: '92/100 · Top 4%',
        icon: TrendingUp,
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      },
      {
        title: 'Customer Churn Prediction Model',
        desc: 'Reproducible notebook & ROC-AUC 0.93',
        metric: 'Git Verified',
        icon: Layers,
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      },
      {
        title: 'A/B Testing Statistical Memo',
        desc: 'Hypothesis testing & sample calibration',
        metric: 'Peer Reviewed',
        icon: CheckCircle2,
        color: 'text-purple-600 bg-purple-50 border-purple-200',
      },
    ],
    ticker: '⚡ Swiggy analytics lead fast-tracked candidate for SQL benchmark (3m ago)',
  },
  fullstack: {
    id: 'fullstack',
    label: 'Frontend & Full-Stack',
    icon: Code2,
    candidate: {
      name: 'Priya Sharma',
      role: 'Full-Stack SDE Candidate',
      level: 'Level 14 Verified',
      score: 96,
      initials: 'PS',
    },
    topMatch: {
      company: 'Razorpay',
      logoText: 'RZ',
      logoBg: 'bg-blue-50 text-blue-600 border-blue-200',
      title: 'Frontend Platform Intern',
      location: 'Bengaluru, Karnataka',
      stipend: '₹60,000 / month',
      fit: 97,
      tags: ['✓ React & TypeScript (95/100)', '✓ Realtime Canvas Repo', '✓ Web Vitals 98/100'],
    },
    secondaryMatch: {
      company: 'Flipkart',
      logoText: 'FK',
      logoBg: 'bg-amber-50 text-amber-600 border-amber-200',
      title: 'Full-Stack UI Intern',
      location: 'Bengaluru',
      stipend: '₹50,000 / month',
      fit: 93,
    },
    proofItems: [
      {
        title: 'React 19 & TypeScript Systems',
        desc: 'Component architecture diagnostic',
        metric: '95/100 · Top 2%',
        icon: Code2,
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      },
      {
        title: 'Realtime Collaborative Whiteboard',
        desc: 'WebSocket repo & test coverage 94%',
        metric: 'Git Verified',
        icon: Layers,
        color: 'text-blue-600 bg-blue-50 border-blue-200',
      },
      {
        title: 'Lighthouse & Core Web Vitals',
        desc: 'Sub-80ms INP & zero layout shifts',
        metric: '98/100 Score',
        icon: CheckCircle2,
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      },
    ],
    ticker: '⚡ Razorpay engineering team verified live GitHub repository demo (11m ago)',
  },
  aiml: {
    id: 'aiml',
    label: 'AI & ML Systems',
    icon: Cpu,
    candidate: {
      name: 'Rohan Sen',
      role: 'ML Systems Candidate',
      level: 'Level 13 Verified',
      score: 95,
      initials: 'RS',
    },
    topMatch: {
      company: 'Zepto',
      logoText: 'ZP',
      logoBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      title: 'ML Systems & Demand Forecast Intern',
      location: 'Mumbai, Maharashtra',
      stipend: '₹55,000 / month',
      fit: 95,
      tags: ['✓ PyTorch Diagnostic (94/100)', '✓ Vector RAG Pipeline', '✓ 14ms Latency P99'],
    },
    secondaryMatch: {
      company: 'PhonePe',
      logoText: 'PP',
      logoBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      title: 'Machine Learning Platform Intern',
      location: 'Bengaluru',
      stipend: '₹50,000 / month',
      fit: 91,
    },
    proofItems: [
      {
        title: 'Transformer Fine-Tuning & PyTorch',
        desc: 'Distributed training diagnostic',
        metric: '94/100 · Top 3%',
        icon: Cpu,
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      },
      {
        title: 'Vector Search & Hybrid RAG Engine',
        desc: 'Qdrant + FastEmbed implementation',
        metric: 'Git Verified',
        icon: Layers,
        color: 'text-purple-600 bg-purple-50 border-purple-200',
      },
      {
        title: 'Model Quantization & TensorRT',
        desc: '14ms P99 inference on edge',
        metric: 'Calibrated',
        icon: CheckCircle2,
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      },
    ],
    ticker: '⚡ Zepto ML team verified demand forecasting notebook benchmarks (19m ago)',
  },
};

export default function Hero() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<RoleCategory>('analytics');

  const activeData = ROLES_DATA[selectedRole];

  return (
    <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/40">
      {/* High-end ambient atmospheric lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[620px] bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.13),rgba(255,255,255,0))] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* CENTERED HERO HEADER: BALANCED, AIRY & COMMANDING */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-4xl mx-auto space-y-6"
        >
          {/* Announcement / Trust Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Evidence-based talent network for high-growth tech</span>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => navigate('/student?tab=internships')}
              className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>120+ Live Roles</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Land top tech internships with{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
              proof of work.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Skip resume filters. Showcase verified diagnostics, reproducible project notebooks, and live competition benchmarks directly to engineering and product teams at Swiggy, CRED, Razorpay, and Flipkart.
          </p>

          {/* Centered CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => navigate('/student?tab=internships')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-slate-900/10 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
            >
              <span>Explore 120+ Internships</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/student?tab=competitions')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs hover:border-slate-300 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Browse Competitions & PPIs</span>
            </button>
          </div>

          {/* Subtle Hiring Partners Trust Bar */}
          <div className="pt-6 sm:pt-8 space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Verified evidence accepted by engineering and product teams at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-black text-slate-400 tracking-wider">
              <span className="hover:text-slate-800 transition-colors">SWIGGY</span>
              <span className="text-slate-200">·</span>
              <span className="hover:text-slate-800 transition-colors">CRED</span>
              <span className="text-slate-200">·</span>
              <span className="hover:text-slate-800 transition-colors">FLIPKART</span>
              <span className="text-slate-200">·</span>
              <span className="hover:text-slate-800 transition-colors">RAZORPAY</span>
              <span className="text-slate-200">·</span>
              <span className="hover:text-slate-800 transition-colors">ZEPTO</span>
              <span className="text-slate-200">·</span>
              <span className="hover:text-slate-800 transition-colors">ZOMATO</span>
            </div>
          </div>
        </motion.div>

        {/* FULL-WIDTH CENTERED INTERACTIVE PRODUCT SHOWCASE COCKPIT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="mt-12 sm:mt-16 max-w-5xl mx-auto relative"
        >
          {/* Ambient Natural Floating Micro-Badges */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden lg:flex absolute -top-5 -left-4 bg-white/95 backdrop-blur-md py-2 px-3.5 rounded-2xl shadow-lg border border-slate-200/90 items-center gap-2.5 z-20 pointer-events-none"
          >
            <div className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xs">
              ✓
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Benchmark Verified</p>
              <p className="text-xs font-black text-slate-900">Standardized Diagnostics · 92+</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            className="hidden lg:flex absolute -top-5 -right-4 bg-white/95 backdrop-blur-md py-2 px-3.5 rounded-2xl shadow-lg border border-slate-200/90 items-center gap-2.5 z-20 pointer-events-none"
          >
            <div className="w-7 h-7 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs">
              ⚡
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Algorithmic Match</p>
              <p className="text-xs font-black text-slate-900">96% Fit · Fast-Track Pipeline</p>
            </div>
          </motion.div>

          {/* Browser / Console Cockpit Bezel */}
          <div className="rounded-3xl p-1.5 sm:p-2 bg-gradient-to-b from-indigo-100/70 via-slate-200/60 to-slate-100 shadow-2xl shadow-indigo-950/5 border border-slate-200/70">
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
              {/* Cockpit Window Header */}
              <div className="px-4 sm:px-6 py-3.5 bg-slate-50/90 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Window Dots */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  <span className="text-[11px] font-mono text-slate-400 ml-2">skilloryn.telemetry // cockpit</span>
                </div>

                {/* Interactive Role Switcher */}
                <div className="inline-flex p-1 rounded-xl bg-slate-200/70 text-slate-600 text-xs font-bold gap-1 w-full sm:w-auto justify-center">
                  {(Object.keys(ROLES_DATA) as RoleCategory[]).map((key) => {
                    const item = ROLES_DATA[key];
                    const Icon = item.icon;
                    const isActive = selectedRole === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedRole(key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Live Calibration Indicator */}
                <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] text-slate-500 font-medium">Live Evidence Engine</span>
                </div>
              </div>

              {/* Cockpit Main Body Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeData.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="p-5 sm:p-7 grid md:grid-cols-12 gap-6 items-start"
                >
                  {/* LEFT COLUMN: CANDIDATE PROOF STACK (5 cols) */}
                  <div className="md:col-span-5 space-y-4 text-left">
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                          {activeData.candidate.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-slate-900">{activeData.candidate.name}</span>
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{activeData.candidate.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Readiness</span>
                        <span className="text-xs font-mono font-extrabold text-indigo-600">{activeData.candidate.score}/100</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold">
                        <span>Verified Evidence Artifacts</span>
                        <span className="text-emerald-600 font-bold">3 of 3 Verified</span>
                      </div>

                      {activeData.proofItems.map((item, idx) => {
                        const ItemIcon = item.icon;
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 transition-colors shadow-2xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <ItemIcon className="w-4 h-4 text-slate-500 shrink-0" />
                              <div className="truncate">
                                <p className="font-bold text-xs text-slate-900 truncate">{item.title}</p>
                                <p className="text-[11px] text-slate-500 truncate">{item.desc}</p>
                              </div>
                            </div>
                            <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${item.color}`}>
                              {item.metric}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: INSTANT MATCHED ROLES & FAST-TRACK (7 cols) */}
                  <div className="md:col-span-7 space-y-4 text-left">
                    {/* Top Recommended Internship Card */}
                    <div
                      onClick={() => navigate('/student?tab=internships')}
                      className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/40 via-white to-slate-50/60 border border-indigo-100 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-3.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border shadow-2xs ${activeData.topMatch.logoBg}`}>
                            {activeData.topMatch.logoText}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-indigo-600 tracking-wider">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Top Algorithmic Match</span>
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 group-hover:text-indigo-600 transition-colors">
                              {activeData.topMatch.company} · {activeData.topMatch.title}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                              {activeData.topMatch.location} · <span className="font-bold text-slate-700">{activeData.topMatch.stipend}</span>
                            </p>
                          </div>
                        </div>

                        <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-800 border border-indigo-200 shrink-0">
                          {activeData.topMatch.fit}% Fit
                        </span>
                      </div>

                      {/* Evidence Calibration Progress Meter */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                          <span>Benchmark Criteria Calibration</span>
                          <span className="text-indigo-600 font-bold">100% of benchmark requirements met</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${activeData.topMatch.fit}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full bg-indigo-600 rounded-full"
                          />
                        </div>
                      </div>

                      {/* Matched Tags & Apply CTA */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                        <div className="flex flex-wrap gap-1.5">
                          {activeData.topMatch.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <span className="text-xs font-bold text-indigo-600 group-hover:text-indigo-800 inline-flex items-center gap-1">
                          <span>Inspect Role</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                    {/* Secondary Match + Recruiter Feed */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div
                        onClick={() => navigate('/student?tab=internships')}
                        className="p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 transition-colors flex items-center justify-between gap-2 cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border shrink-0 ${activeData.secondaryMatch.logoBg}`}>
                            {activeData.secondaryMatch.logoText}
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {activeData.secondaryMatch.company} · {activeData.secondaryMatch.title}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">{activeData.secondaryMatch.stipend}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                          {activeData.secondaryMatch.fit}%
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-xs text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-[11px] text-slate-600 font-medium truncate leading-tight">
                          {activeData.ticker}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Cockpit Footer Strip */}
              <div className="px-5 py-3 bg-slate-50/90 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <span className="text-slate-500 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Direct recruiter evaluation based on verifiable proof of work · Zero resume screening</span>
                </span>
                <button
                  onClick={() => navigate('/student?tab=internships')}
                  className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group transition-colors cursor-pointer"
                >
                  <span>Open Student Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

