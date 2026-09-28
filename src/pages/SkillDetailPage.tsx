import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, BadgeCheck, CheckCircle2, ChevronRight,
  ExternalLink, FileCheck2, GitBranch, ShieldCheck, Target
} from 'lucide-react';

function getPassportId(userSlug: string) {
  const key = `skilloryn-passport-id-${userSlug}`;
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const generated = `SKY-DA-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  window.localStorage.setItem(key, generated);
  return generated;
}

const skillDetails: Record<
  string,
  {
    name: string;
    status: string;
    score: string;
    eyebrow: string;
    summary: string;
    certifications: string[];
    activities: string[];
    evidence: { title: string; detail: string; url: string; date?: string }[];
  }
> = {
  'advanced-sql': {
    name: 'Advanced SQL & Window Functions',
    status: 'Verified',
    score: '92/100',
    eyebrow: 'Skill Stamp Endorsement · Data Analyst Pathway',
    summary:
      'Jane demonstrated verified mastery of multi-partition window frames, recursive CTEs, subquery factorization, indexing heuristics, and query plan execution optimization.',
    certifications: [
      'Skilloryn Adaptive Timed Diagnostic (92/100)',
      'Advanced Joins & Frame Partitioning Lab',
      'PostgreSQL Query Plan Optimization Benchmark',
    ],
    activities: [
      'Completed a 30-minute timed diagnostic with 92/100 verified score.',
      'Constructed reproducible cohort retention queries reducing table scans by 34%.',
      'Reviewed execution plans with EXPLAIN ANALYZE for customer funnel queries.',
    ],
    evidence: [
      {
        title: 'Ecommerce Churn Predictor SQL Prep',
        detail: 'SQL feature generation pipeline and cohort partition scripts.',
        url: 'https://github.com/janedoe/ecommerce-churn-model',
        date: 'Sep 2026',
      },
      {
        title: 'Skilloryn Diagnostic Baseline Record',
        detail: 'Cryptographic test ledger entry stored with continuous validation.',
        url: 'https://skilloryn.io/verify/advanced-sql',
        date: 'Sep 2026',
      },
    ],
  },
  'python-analysis': {
    name: 'Python Data Analysis & ML',
    status: 'Reviewed',
    score: '4 Artifacts',
    eyebrow: 'Skill Stamp Endorsement · Peer Code Review',
    summary:
      'A practical production-grade Python analytics workflow spanning data wrangling with Pandas/NumPy, statistical hypothesis testing, and Scikit-Learn evaluation pipelines.',
    certifications: [
      'Peer-Reviewed Code Evaluation',
      'Pandas & NumPy Notebook Checkpoint',
      'Model Evaluation & Bias Check',
    ],
    activities: [
      'Cleaned and transformed multi-table transactional customer records.',
      'Trained Random Forest and XGBoost classifiers comparing AUC-ROC.',
      'Documented assumptions, confidence intervals, and stakeholder takeaways in clean notebooks.',
    ],
    evidence: [
      {
        title: 'Ecommerce Churn Pipeline Notebook',
        detail: 'Full pipeline with exploratory analysis, cross-validation, and metrics.',
        url: 'https://github.com/janedoe/ecommerce-churn-model',
        date: 'Aug 2026',
      },
      {
        title: 'Pricing Experiment Readout Analysis',
        detail: 'Statistical hypothesis testing with bootstrap confidence intervals.',
        url: 'https://github.com/janedoe/pricing-experiment-readout',
        date: 'Aug 2026',
      },
    ],
  },
  tableau: {
    name: 'Tableau Visualisation & Storytelling',
    status: 'Self-Reported',
    score: 'Portfolio Claim',
    eyebrow: 'Skill Stamp Endorsement · Portfolio Submission',
    summary:
      'Interactive executive dashboards designed to bridge telemetry and business decisions with clear visual hierarchy, progressive disclosure, and concise narrative callouts.',
    certifications: [
      'Candidate Portfolio Submission',
      'Executive Dashboard Design Checkpoint',
      'Visual Information Architecture Review',
    ],
    activities: [
      'Designed a multi-cohort retention dashboard with interactive parameter controls.',
      'Created executive KPI summary cards highlighting month-over-month variances.',
      'Annotated charts with qualitative context rather than raw numbers alone.',
    ],
    evidence: [
      {
        title: 'Cohort Retention Command Center',
        detail: 'Dashboard specs, information architecture, and stakeholder walkthrough notes.',
        url: 'https://janedoe.notion.site/retention-command-centre',
        date: 'Jul 2026',
      },
    ],
  },
  experimentation: {
    name: 'A/B Testing & Causal Inference',
    status: 'Verified',
    score: '86/100',
    eyebrow: 'Skill Stamp Endorsement · Mission Assessment',
    summary:
      'Rigorous experiment design grounded in pre-registration, Minimum Detectable Effect (MDE) calculations, sample size budgeting, and executive decision memos under uncertainty.',
    certifications: [
      'Skilloryn Mission Assessment (86/100)',
      'Pre-registration & MDE Hypothesis Lab',
      'Statistical Significance & Peeking Mitigation',
    ],
    activities: [
      'Drafted a pre-registered experiment protocol with sample size power calculations.',
      'Analyzed treatment vs control metrics using two-tailed hypothesis tests.',
      'Delivered a stakeholder decision memo with risk intervals and recommended 7% price change.',
    ],
    evidence: [
      {
        title: 'Pricing Experiment Executive Memo',
        detail: 'A/B test statistical analysis, confidence intervals, and rollback criteria.',
        url: 'https://github.com/janedoe/pricing-experiment-readout',
        date: 'Sep 2026',
      },
    ],
  },
};

export default function SkillDetailPage() {
  const { skillId, slug } = useParams();
  const skill = skillDetails[skillId || 'advanced-sql'] || skillDetails['advanced-sql'];
  const passportId = getPassportId(slug || 'jane-doe');

  return (
    <div className="min-h-screen bg-paper text-ink relative">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-line/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to={`/passport/${slug || 'jane-doe'}`}
            className="flex flex-col text-slate-900 hover:text-indigo-600 transition-colors"
          >
            <span className="font-black text-2xl text-slate-900 leading-none">Skilloryn</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">
              Verified Skill Audit Trail
            </span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cryptographic Proof</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        <Link
          to={`/passport/${slug || 'jane-doe'}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-navy px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Passport Booklet
        </Link>

        <div className="grid lg:grid-cols-[1fr_0.68fr] gap-6 items-start">
          {/* Main Skill Card */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            {/* Header Banner */}
            <div className="bg-navy text-white p-6 sm:p-8 relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-300">
                  {skill.eyebrow}
                </span>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {skill.name}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 border border-white/20 text-xs font-mono font-extrabold shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {skill.score}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {skill.summary}
                </p>
              </div>
            </div>

            {/* Checkpoints & Activities */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Checkpoints */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-blue-600" /> Verified Competency Checkpoints
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {skill.certifications.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                    >
                      <span className="w-6 h-6 rounded-md bg-white border border-slate-200 text-blue-700 flex items-center justify-center font-mono text-[10px] font-bold">
                        0{idx + 1}
                      </span>
                      <p className="text-xs font-bold text-navy mt-3 leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Log */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-blue-600" /> Activity Evidence Log
                </h3>
                <div className="space-y-2.5">
                  {skill.activities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">{activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar: Passport Link & Artifacts */}
          <aside className="space-y-5 lg:sticky lg:top-20">
            {/* Candidate Identity Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Candidate Profile
                  </p>
                  <h3 className="font-extrabold text-navy text-sm">Jane Doe</h3>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/60 text-xs space-y-1">
                <p className="font-bold text-navy">Biometric Credential Bond</p>
                <p className="text-[11px] text-slate-600">
                  This skill trail is anchored to Passport ID <strong className="font-mono">{passportId}</strong>.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-muted">Verification Status</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[10px]">
                  {skill.status}
                </span>
              </div>
            </div>

            {/* Linked Artifacts */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-blue-600" /> Linked Repositories & Proofs
              </h3>

              <div className="space-y-2">
                {skill.evidence.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-navy group-hover:text-blue-700">
                        {item.title}
                      </p>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                    </div>
                    <p className="text-[10px] text-muted mt-1 leading-relaxed">{item.detail}</p>
                  </a>
                ))}
              </div>
            </div>

            <Link
              to={`/passport/${slug || 'jane-doe'}`}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-navy hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Return to Passport Booklet <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}
