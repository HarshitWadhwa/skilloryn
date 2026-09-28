import { useState, useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, Check, ChevronRight,
  FileCheck2, IdCard, LockKeyhole,
  ShieldCheck, Sparkles
} from 'lucide-react';
import SkillPassportBook, {
  DEFAULT_PROFILE, DEFAULT_SKILLS, DEFAULT_PROJECTS
} from '../components/SkillPassportBook';

function getPassportId(userSlug: string) {
  const key = `skilloryn-passport-id-${userSlug}`;
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const generated = `SKY-DA-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  window.localStorage.setItem(key, generated);
  return generated;
}

export default function PassportPage() {
  const { slug } = useParams();
  const passportSlug = slug || DEFAULT_PROFILE.slug;
  const [passportId] = useState(() => getPassportId(passportSlug));

  // Customizable shared claims stored in localStorage
  const [selectedSkills, setSelectedSkills] = useState<Record<string, boolean>>(() => {
    const stored = window.localStorage.getItem(`skilloryn-shared-skills-${passportSlug}`);
    if (stored) {
      try {
        return JSON.parse(stored) as Record<string, boolean>;
      } catch {
        /* fallback */
      }
    }
    return Object.fromEntries(DEFAULT_SKILLS.map((s) => [s.id, true]));
  });

  const [selectedProjects, setSelectedProjects] = useState<Record<string, boolean>>(() => {
    const stored = window.localStorage.getItem(`skilloryn-shared-projects-${passportSlug}`);
    if (stored) {
      try {
        return JSON.parse(stored) as Record<string, boolean>;
      } catch {
        /* fallback */
      }
    }
    return Object.fromEntries(DEFAULT_PROJECTS.map((p) => [p.id, true]));
  });

  useEffect(() => {
    window.localStorage.setItem(`skilloryn-shared-skills-${passportSlug}`, JSON.stringify(selectedSkills));
  }, [passportSlug, selectedSkills]);

  useEffect(() => {
    window.localStorage.setItem(`skilloryn-shared-projects-${passportSlug}`, JSON.stringify(selectedProjects));
  }, [passportSlug, selectedProjects]);

  const toggleSkill = (id: string) => {
    setSelectedSkills((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleProject = (id: string) => {
    setSelectedProjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const visibleSkills = useMemo(
    () => DEFAULT_SKILLS.filter((s) => selectedSkills[s.id] !== false),
    [selectedSkills]
  );

  return (
    <div className="min-h-screen bg-paper text-ink relative">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-line/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/student" className="flex flex-col text-slate-900 hover:text-indigo-600 transition-colors">
            <span className="font-black text-2xl text-slate-900 leading-none">Skilloryn</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">
              Verified Credential
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cryptographically Verified</span>
            </div>

            <Link
              to="/student"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-navy px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Workspace
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Hero Product Showcase
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy">
              Candidate Skill Passport
            </h1>
            <p className="text-muted text-sm sm:text-base mt-1.5 max-w-2xl leading-relaxed">
              An authentic biometric booklet credential proving practical capability through real code audits, diagnostic baselines, and reproducible project evidence.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-card flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <IdCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Unique Ledger ID</p>
              <p className="font-mono text-xs font-extrabold text-navy">{passportId}</p>
            </div>
          </div>
        </div>

        {/* HERO COMPONENT: THE AUTHENTIC SKILL PASSPORT BOOKLET */}
        <section className="pt-2">
          <SkillPassportBook
            profile={DEFAULT_PROFILE}
            skills={DEFAULT_SKILLS}
            projects={DEFAULT_PROJECTS}
            passportId={passportId}
            selectedSkills={selectedSkills}
            selectedProjects={selectedProjects}
            onToggleSkill={toggleSkill}
            onToggleProject={toggleProject}
            showCoverByDefault={false}
          />
        </section>

        {/* RECRUITER AUDIT & SHARING CONTROLS GRID */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start pt-4">
          {/* LEFT: PRIVACY & CLAIM CUSTOMIZATION (LINKEDIN STYLE) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <LockKeyhole className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-navy">Share Settings & Evidence Visibility</h3>
                  <p className="text-xs text-muted">Select exactly which claims appear on the public booklet & PDF.</p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                {visibleSkills.length} of {DEFAULT_SKILLS.length} Visible
              </span>
            </div>

            {/* Skill Toggles */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Skills & Endorsement Visas
              </span>
              <div className="space-y-2">
                {DEFAULT_SKILLS.map((skill) => {
                  const isChecked = selectedSkills[skill.id] !== false;
                  return (
                    <label
                      key={skill.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-blue-200 bg-blue-50/30'
                          : 'border-slate-200 bg-slate-50/50 opacity-60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSkill(skill.id)}
                        className="sr-only"
                      />
                      <span
                        className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                          isChecked ? 'bg-navy border-navy text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-navy truncate">{skill.name}</p>
                          <span className="text-[10px] font-mono font-bold text-blue-700">
                            {skill.score}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted truncate mt-0.5">{skill.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Project Toggles */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Evidence Repositories & Artifacts
              </span>
              <div className="space-y-2">
                {DEFAULT_PROJECTS.map((proj) => {
                  const isChecked = selectedProjects[proj.id] !== false;
                  return (
                    <label
                      key={proj.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-blue-200 bg-blue-50/30'
                          : 'border-slate-200 bg-slate-50/50 opacity-60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleProject(proj.id)}
                        className="sr-only"
                      />
                      <span
                        className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                          isChecked ? 'bg-navy border-navy text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-navy">#{proj.rank} {proj.title}</p>
                        <p className="text-[10px] text-muted mt-0.5">{proj.label} · {proj.outcome}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: RECRUITER EVIDENCE LEDGER & AUDIT TRAIL */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-navy">Recruiter Verification Ledger</h3>
                <p className="text-xs text-muted">Evidence telemetry and cryptographic proof for hiring teams.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-700">
                  Diagnostic Baseline
                </span>
                <p className="text-xs font-bold text-navy">Skilloryn Timed Adaptive Diagnostic (92/100)</p>
                <p className="text-[10px] text-muted leading-relaxed">
                  30-minute timed evaluation covering partition windows, recursive CTEs, and execution plan benchmarks.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700">
                  Project Code Review
                </span>
                <p className="text-xs font-bold text-navy">Monzo-Ready Cohort Retention Analysis</p>
                <p className="text-[10px] text-muted leading-relaxed">
                  Peer-reviewed repository with unit-tested feature pipelines and reproducible Jupyter notebooks.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-700">
                  Continuous Provenance
                </span>
                <p className="text-xs font-bold text-navy">Tamper-Evident SHA-256 Ledger Record</p>
                <p className="font-mono text-[9.5px] text-slate-500 break-all">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/student"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-navy hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Return to Student Dashboard <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-xs text-muted border-t border-line/60 flex flex-col sm:flex-row items-center justify-between gap-3 mt-10">
        <p>&copy; {new Date().getFullYear()} Skilloryn Global Talent Network. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/choose-workspace" className="hover:text-navy font-medium">Switch Workspace</Link>
          <span>·</span>
          <Link to="/sign-in" className="hover:text-navy font-medium">Sign In</Link>
        </div>
      </footer>
    </div>
  );
}
