import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Shield, KeyRound, Lock, RefreshCw,
  Copy, Check, Database, AlertTriangle, Info, Sparkles, Clock,
  Eye, EyeOff, ArrowLeft, Terminal, Cpu, BookOpen,
  CheckCircle2, XCircle, ChevronRight, Zap
} from 'lucide-react';
import institutionLogo from '../assets/institution-logo-theme.png';
import {
  analyzePassword,
  generateDicewarePassphrase,
  generateRandomPassword,
  suggestStrongerAlternatives
} from '../utils/passwordSecurity';
import type { PasswordAnalysis, StrengthLevel } from '../utils/passwordSecurity';
import { PasswordHistoryService } from '../services/passwordHistoryDb';
import type { UserRecord, PasswordHistoryRecord } from '../services/passwordHistoryDb';

type TabType = 'analyzer' | 'generator' | 'database' | 'academy';

export default function PasswordSecurityLab() {
  const [activeTab, setActiveTab] = useState<TabType>('analyzer');

  // Analyzer state
  const [inputPassword, setInputPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [analysis, setAnalysis] = useState<PasswordAnalysis>(analyzePassword('password123'));

  useEffect(() => {
    setAnalysis(analyzePassword(inputPassword));
  }, [inputPassword]);

  // Generator state
  const [genMode, setGenMode] = useState<'passphrase' | 'random' | 'smart'>('passphrase');
  const [passphraseWordCount, setPassphraseWordCount] = useState<number>(4);
  const [passphraseSep, setPassphraseSep] = useState<string>('-');
  const [passphraseCapitalize, setPassphraseCapitalize] = useState<boolean>(true);
  const [passphraseNumber, setPassphraseNumber] = useState<boolean>(true);

  const [randomLength, setRandomLength] = useState<number>(16);
  const [randomUpper, setRandomUpper] = useState<boolean>(true);
  const [randomLower, setRandomLower] = useState<boolean>(true);
  const [randomNumbers, setRandomNumbers] = useState<boolean>(true);
  const [randomSymbols, setRandomSymbols] = useState<boolean>(true);

  const [generatedResult, setGeneratedResult] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Generate initial password on load
  useEffect(() => {
    handleGenerate();
  }, [
    genMode, passphraseWordCount, passphraseSep, passphraseCapitalize, passphraseNumber,
    randomLength, randomUpper, randomLower, randomNumbers, randomSymbols
  ]);

  const handleGenerate = () => {
    if (genMode === 'passphrase') {
      const p = generateDicewarePassphrase({
        wordCount: passphraseWordCount,
        separator: passphraseSep,
        capitalize: passphraseCapitalize,
        includeNumber: passphraseNumber
      });
      setGeneratedResult(p);
    } else if (genMode === 'random') {
      const p = generateRandomPassword({
        length: randomLength,
        includeUpper: randomUpper,
        includeLower: randomLower,
        includeNumbers: randomNumbers,
        includeSymbols: randomSymbols
      });
      setGeneratedResult(p);
    } else {
      const alts = suggestStrongerAlternatives(inputPassword);
      setGeneratedResult(alts.smartMutation);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSendToAnalyzer = (text: string) => {
    setInputPassword(text);
    setActiveTab('analyzer');
  };

  // Database Simulator state
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [userHistory, setUserHistory] = useState<PasswordHistoryRecord[]>([]);
  const [candidatePassword, setCandidatePassword] = useState<string>('');
  const [dbHistoryDepth, setDbHistoryDepth] = useState<number>(5);
  const [dbStatusMessage, setDbStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
    details?: string;
  } | null>(null);
  const [isDbWorking, setIsDbWorking] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('');
  const [showNewUserModal, setShowNewUserModal] = useState<boolean>(false);

  const loadDbData = async () => {
    const list = await PasswordHistoryService.getUsers();
    setUsers(list);
    if (list.length > 0 && (!selectedUserId || !list.some(u => u.id === selectedUserId))) {
      setSelectedUserId(list[0].id);
      const hist = await PasswordHistoryService.getUserHistory(list[0].id);
      setUserHistory(hist);
    } else if (selectedUserId) {
      const hist = await PasswordHistoryService.getUserHistory(selectedUserId);
      setUserHistory(hist);
    }
  };

  useEffect(() => {
    loadDbData();
  }, []);

  const handleSelectUser = async (userId: string) => {
    setSelectedUserId(userId);
    setDbStatusMessage(null);
    setCandidatePassword('');
    const hist = await PasswordHistoryService.getUserHistory(userId);
    setUserHistory(hist);
  };

  const handleTestChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidatePassword.trim()) return;

    setIsDbWorking(true);
    setDbStatusMessage(null);

    try {
      const res = await PasswordHistoryService.changePassword(
        selectedUserId,
        candidatePassword,
        dbHistoryDepth
      );

      if (res.success) {
        setDbStatusMessage({
          type: 'success',
          text: '✓ Password successfully accepted and updated!',
          details: 'A new 16-byte random salt and PBKDF2-HMAC-SHA256 (100,000 iterations) hash were securely generated and written to the database history.'
        });
        setCandidatePassword('');
        const hist = await PasswordHistoryService.getUserHistory(selectedUserId);
        setUserHistory(hist);
      } else {
        setDbStatusMessage({
          type: 'error',
          text: '🛡️ Password Change Blocked (Reuse Policy Violation)',
          details: res.error
        });
      }
    } finally {
      setIsDbWorking(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    try {
      const newUser = await PasswordHistoryService.registerUser(
        newUsername.trim(),
        'InitialPassword123!'
      );
      setNewUsername('');
      setShowNewUserModal(false);
      await loadDbData();
      await handleSelectUser(newUser.id);
      setDbStatusMessage({
        type: 'info',
        text: `User "${newUser.username}" created with default password "InitialPassword123!".`,
        details: 'Initial password record stored as salted PBKDF2 hash in database history.'
      });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error creating user');
    }
  };

  const handleResetDb = async () => {
    if (confirm('Reset simulator database to default demo data?')) {
      await PasswordHistoryService.resetDatabase();
      await loadDbData();
      setDbStatusMessage({
        type: 'info',
        text: 'Database restored to initial demo state with Alice (3 historical passwords).'
      });
    }
  };

  // Helper colors for strength
  const getStrengthBadge = (str: StrengthLevel) => {
    switch (str) {
      case 'very_weak':
        return { label: 'Very Weak', color: 'bg-red-100 text-red-700 border-red-300', barColor: 'bg-red-500' };
      case 'weak':
        return { label: 'Weak', color: 'bg-orange-100 text-orange-700 border-orange-300', barColor: 'bg-orange-500' };
      case 'fair':
        return { label: 'Fair', color: 'bg-amber-100 text-amber-700 border-amber-300', barColor: 'bg-amber-500' };
      case 'strong':
        return { label: 'Strong', color: 'bg-blue-100 text-blue-700 border-blue-300', barColor: 'bg-blue-500' };
      case 'excellent':
        return { label: 'Excellent (NIST Grade)', color: 'bg-emerald-100 text-emerald-700 border-emerald-300', barColor: 'bg-emerald-500' };
    }
  };

  const badge = getStrengthBadge(analysis.strength);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-paper text-ink relative font-sans">
      {/* Header */}
      <header className="relative z-10 border-b border-line/70 bg-surface/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cream flex items-center justify-center shadow-sm border border-copper-soft/40 overflow-hidden">
                <img src={institutionLogo} alt="Skilloryn" className="w-8 h-8 object-contain" />
              </div>
              <span className="font-bold text-2xl text-navy tracking-tight hidden sm:inline">
                Skilloryn
              </span>
            </Link>
            <span className="text-muted/40 font-light text-xl">/</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-navy">Security & Cryptography Lab</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-copper-soft/20 text-copper-strong border border-copper-soft/40">
                Interactive
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/sign-in"
              className="text-xs sm:text-sm font-semibold text-muted hover:text-navy transition-colors px-3 py-1.5 rounded-xl hover:bg-surface border border-line"
            >
              Sign In
            </Link>
            <Link
              to="/"
              className="text-xs sm:text-sm font-semibold text-muted hover:text-navy flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Banner Hero */}
        <div className="rounded-3xl bg-navy text-cream p-6 sm:p-10 shadow-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-copper/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-ice border border-white/15 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-copper" /> Password Security, Entropy & Cryptographic Storage
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Password Security & Cryptography Learning Lab
            </h1>
            <p className="text-sm sm:text-base text-ice/80 leading-relaxed">
              Explore how password length, character complexity, and pattern avoidance determine cryptographic
              search space. Generate NIST-recommended Diceware passphrases, and simulate how real-world databases
              enforce password reuse policies without ever storing plaintext.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-line pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all shrink-0 ${
              activeTab === 'analyzer'
                ? 'bg-navy text-cream shadow-sm'
                : 'text-muted hover:text-navy hover:bg-surface'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Password Analyzer</span>
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all shrink-0 ${
              activeTab === 'generator'
                ? 'bg-navy text-cream shadow-sm'
                : 'text-muted hover:text-navy hover:bg-surface'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Alternative Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all shrink-0 ${
              activeTab === 'database'
                ? 'bg-navy text-cream shadow-sm'
                : 'text-muted hover:text-navy hover:bg-surface'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database Reuse Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('academy')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all shrink-0 ${
              activeTab === 'academy'
                ? 'bg-navy text-cream shadow-sm'
                : 'text-muted hover:text-navy hover:bg-surface'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Cryptography Academy</span>
          </button>
        </div>

        {/* TAB 1: ANALYZER */}
        {activeTab === 'analyzer' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="grid lg:grid-cols-12 gap-8"
          >
            {/* Input & Score Section */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-line shadow-card space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-navy uppercase tracking-wider">
                      Test Any Password
                    </label>
                    <span className="text-xs text-muted font-medium">
                      Calculated locally via WebCrypto API
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      placeholder="Type a password to analyze..."
                      className="w-full pl-4 pr-24 py-3.5 bg-paper border border-line rounded-2xl text-base text-ink font-mono focus:bg-white focus:border-copper outline-none transition-all shadow-inner"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-paper"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(inputPassword)}
                        className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-paper"
                        title="Copy password"
                      >
                        {copySuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Strength Meter Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-navy flex items-center gap-1.5">
                      Entropy Score: <span className="font-mono text-copper-strong">{analysis.effectiveEntropyBits} bits</span>
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[11px] uppercase ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-paper rounded-full overflow-hidden border border-line p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${badge.barColor}`}
                      style={{ width: `${Math.max(5, analysis.strengthScore)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted font-medium pt-1">
                    <span>0 bits (Trivial)</span>
                    <span>45 bits (Acceptable)</span>
                    <span>80+ bits (Cryptographically Strong)</span>
                  </div>
                </div>

                {/* Length & Pool Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-paper border border-line text-center">
                    <p className="text-[11px] font-semibold text-muted">Length</p>
                    <p className="text-xl font-extrabold text-navy mt-0.5 font-mono">{analysis.length}</p>
                    <p className="text-[10px] text-muted">{analysis.length >= 12 ? '✓ NIST Good' : 'Short (<12)'}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-paper border border-line text-center">
                    <p className="text-[11px] font-semibold text-muted">Pool Size (R)</p>
                    <p className="text-xl font-extrabold text-navy mt-0.5 font-mono">{analysis.complexity.poolSize}</p>
                    <p className="text-[10px] text-muted">Characters</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-paper border border-line text-center">
                    <p className="text-[11px] font-semibold text-muted">Raw Entropy</p>
                    <p className="text-xl font-extrabold text-navy mt-0.5 font-mono">{analysis.rawEntropyBits}</p>
                    <p className="text-[10px] text-muted">Bits</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-paper border border-line text-center">
                    <p className="text-[11px] font-semibold text-muted">Pattern Penalty</p>
                    <p className="text-xl font-extrabold text-red-600 mt-0.5 font-mono">
                      -{Math.round((analysis.rawEntropyBits - analysis.effectiveEntropyBits) * 10) / 10}
                    </p>
                    <p className="text-[10px] text-muted">Bits Lost</p>
                  </div>
                </div>

                {/* Checklist Breakdown */}
                <div className="space-y-3 pt-3 border-t border-line">
                  <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
                    Security Checklist & Complexity
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="flex items-center gap-2">
                      {analysis.length >= 8 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      )}
                      <span>Length 8+ ({analysis.length} chars)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {analysis.complexity.hasLower ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <span>Lowercase letters ({analysis.complexity.lowerCount})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {analysis.complexity.hasUpper ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <span>Uppercase letters ({analysis.complexity.upperCount})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {analysis.complexity.hasNumber ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <span>Numbers ({analysis.complexity.numberCount})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {analysis.complexity.hasSymbol ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <span>Special Symbols ({analysis.complexity.symbolCount})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!analysis.isCommon ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                      <span className={analysis.isCommon ? 'text-red-700 font-bold' : ''}>
                        {analysis.isCommon ? 'Known Breached Password!' : 'Not in common password list'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pattern Findings */}
                {analysis.patterns.length > 0 && (
                  <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-red-800">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>Vulnerabilities & Predictable Patterns Detected:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-red-700">
                      {analysis.patterns.map((p, idx) => (
                        <li key={idx}>{p.message} (-{p.penaltyBits} bits effective entropy)</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Crack Time Threat Model & Suggestions */}
            <div className="lg:col-span-5 space-y-6">
              {/* Crack Time Estimator Card */}
              <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-line shadow-card space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-navy flex items-center gap-2">
                    <Clock className="w-5 h-5 text-copper" /> Crack Time Estimator
                  </h3>
                  <span className="text-xs text-muted font-mono">2^(E-1) Guesses</span>
                </div>
                <p className="text-xs text-muted">
                  How long it takes an adversary to brute force all possible permutations under different attack environments:
                </p>

                <div className="space-y-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-paper border border-line flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-navy">Online Rate-Limited</p>
                      <p className="text-[11px] text-muted">Web form (100 guesses/sec)</p>
                    </div>
                    <span className="text-xs font-extrabold text-navy font-mono px-2.5 py-1 rounded-lg bg-surface border border-line">
                      {analysis.crackTime.onlineThrottled}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-paper border border-line flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-navy">Offline GPU Fast Hash</p>
                      <p className="text-[11px] text-muted">Unsalted MD5/SHA256 (100 GH/s)</p>
                    </div>
                    <span className={`text-xs font-extrabold font-mono px-2.5 py-1 rounded-lg border ${
                      analysis.crackTime.offlineFastGpu.includes('Instant') || analysis.crackTime.offlineFastGpu.includes('second')
                        ? 'bg-red-50 text-red-700 border-red-300'
                        : 'bg-surface text-navy border-line'
                    }`}>
                      {analysis.crackTime.offlineFastGpu}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-paper border border-line flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-navy">Offline Slow KDF</p>
                      <p className="text-[11px] text-muted">Salted PBKDF2 / Argon2 (10k/sec)</p>
                    </div>
                    <span className="text-xs font-extrabold text-navy font-mono px-2.5 py-1 rounded-lg bg-surface border border-line">
                      {analysis.crackTime.offlineSlowKdf}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-cream/70 border border-copper-soft/50 text-[11px] text-body flex items-start gap-2">
                  <Info className="w-4 h-4 text-copper shrink-0 mt-0.5" />
                  <span>
                    Notice how Slow KDFs (PBKDF2/Argon2) turn seconds of cracking into decades by forcing the CPU/GPU to perform 100,000 mathematical iterations per guess.
                  </span>
                </div>
              </div>

              {/* Actionable Suggestions */}
              <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-line shadow-card space-y-4">
                <h3 className="text-base font-bold text-navy flex items-center gap-2">
                  <Zap className="w-5 h-5 text-copper" /> Security Recommendations
                </h3>

                {analysis.suggestions.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Great job! This password fulfills modern entropy and complexity requirements.</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {analysis.suggestions.map((sug, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-body">
                        <ChevronRight className="w-4 h-4 text-copper shrink-0 mt-0.5" />
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const alts = suggestStrongerAlternatives(inputPassword);
                      setInputPassword(alts.smartMutation);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-paper hover:bg-white text-navy font-bold text-xs border border-line hover:border-copper transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Sparkles className="w-4 h-4 text-copper" />
                    <span>Auto-Harden Current Password</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: GENERATOR */}
        {activeTab === 'generator' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-line shadow-card space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-navy">Strong Password Generator</h2>
                  <p className="text-xs text-muted mt-1">
                    Powered by Cryptographically Secure Pseudorandom Number Generation (CSPRNG)
                  </p>
                </div>

                {/* Generator Mode Selector */}
                <div className="inline-flex p-1 rounded-2xl bg-paper border border-line text-xs font-bold">
                  <button
                    onClick={() => setGenMode('passphrase')}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      genMode === 'passphrase' ? 'bg-navy text-cream shadow-sm' : 'text-muted hover:text-navy'
                    }`}
                  >
                    Diceware Passphrase
                  </button>
                  <button
                    onClick={() => setGenMode('random')}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      genMode === 'random' ? 'bg-navy text-cream shadow-sm' : 'text-muted hover:text-navy'
                    }`}
                  >
                    Random Characters
                  </button>
                  <button
                    onClick={() => setGenMode('smart')}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      genMode === 'smart' ? 'bg-navy text-cream shadow-sm' : 'text-muted hover:text-navy'
                    }`}
                  >
                    Smart Hardener
                  </button>
                </div>
              </div>

              {/* Display Result Box */}
              <div className="p-6 rounded-3xl bg-paper border-2 border-line/80 relative space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted">
                    Generated Password Output
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleGenerate}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-white text-navy text-xs font-bold border border-line shadow-xs transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-copper" /> Re-roll
                    </button>
                    <button
                      onClick={() => handleCopy(generatedResult)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-navy text-cream text-xs font-bold shadow-xs hover:bg-navy-soft transition-all"
                    >
                      {copySuccess ? (
                        <><Check className="w-3.5 h-3.5" /> Copied!</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /> Copy</>
                      )}
                    </button>
                  </div>
                </div>

                <div className="font-mono text-xl sm:text-2xl font-extrabold text-navy tracking-wide break-all select-all py-2">
                  {generatedResult}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-line/70 text-xs">
                  <div className="flex items-center gap-4 text-muted">
                    <span>Length: <strong className="text-navy">{generatedResult.length}</strong> chars</span>
                    <span>Entropy: <strong className="text-copper-strong">{analyzePassword(generatedResult).effectiveEntropyBits}</strong> bits</span>
                  </div>
                  <button
                    onClick={() => handleSendToAnalyzer(generatedResult)}
                    className="text-xs font-bold text-copper hover:underline inline-flex items-center gap-1"
                  >
                    Inspect in Analyzer <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Mode Controls */}
              {genMode === 'passphrase' && (
                <div className="space-y-6 pt-2">
                  <div className="p-4 rounded-2xl bg-cream/70 border border-copper-soft/50 text-xs text-body leading-relaxed flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-copper shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-navy">NIST SP 800-63B Recommendation:</strong> Multi-word passphrases like
                      <code className="mx-1 px-1.5 py-0.5 bg-paper rounded font-mono font-bold">Cobalt-Falcon-Meadow-Pulsar84</code>
                      provide high mathematical entropy while remaining easy for human memory without written notes.
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-navy">
                        <span>Word Count</span>
                        <span className="font-mono">{passphraseWordCount} words</span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="8"
                        value={passphraseWordCount}
                        onChange={(e) => setPassphraseWordCount(Number(e.target.value))}
                        className="w-full accent-copper cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-navy">Word Separator</label>
                      <select
                        value={passphraseSep}
                        onChange={(e) => setPassphraseSep(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-line rounded-xl text-xs font-mono text-ink outline-none"
                      >
                        <option value="-">Hyphen (-)</option>
                        <option value=".">Period (.)</option>
                        <option value="_">Underscore (_)</option>
                        <option value=" ">Space ( )</option>
                        <option value="#">Hash (#)</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-2.5 text-xs text-navy font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={passphraseCapitalize}
                        onChange={(e) => setPassphraseCapitalize(e.target.checked)}
                        className="w-4 h-4 rounded border-line text-copper accent-copper"
                      />
                      <span>Capitalize each word</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-navy font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={passphraseNumber}
                        onChange={(e) => setPassphraseNumber(e.target.checked)}
                        className="w-4 h-4 rounded border-line text-copper accent-copper"
                      />
                      <span>Append random 2-digit number suffix</span>
                    </label>
                  </div>
                </div>
              )}

              {genMode === 'random' && (
                <div className="space-y-6 pt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-navy">
                      <span>Password Length</span>
                      <span className="font-mono">{randomLength} characters</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="32"
                      value={randomLength}
                      onChange={(e) => setRandomLength(Number(e.target.value))}
                      className="w-full accent-copper cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-navy cursor-pointer">
                      <input
                        type="checkbox"
                        checked={randomUpper}
                        onChange={(e) => setRandomUpper(e.target.checked)}
                        className="w-4 h-4 accent-copper"
                      />
                      <span>Uppercase (A-Z)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-navy cursor-pointer">
                      <input
                        type="checkbox"
                        checked={randomLower}
                        onChange={(e) => setRandomLower(e.target.checked)}
                        className="w-4 h-4 accent-copper"
                      />
                      <span>Lowercase (a-z)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-navy cursor-pointer">
                      <input
                        type="checkbox"
                        checked={randomNumbers}
                        onChange={(e) => setRandomNumbers(e.target.checked)}
                        className="w-4 h-4 accent-copper"
                      />
                      <span>Numbers (0-9)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-navy cursor-pointer">
                      <input
                        type="checkbox"
                        checked={randomSymbols}
                        onChange={(e) => setRandomSymbols(e.target.checked)}
                        className="w-4 h-4 accent-copper"
                      />
                      <span>Symbols (!@#$%)</span>
                    </label>
                  </div>
                </div>
              )}

              {genMode === 'smart' && (
                <div className="space-y-4 pt-2 text-xs text-body">
                  <p>
                    The Smart Hardener takes your existing input password, strips vulnerable dictionary sequences,
                    applies proper capitalization, and appends a high-entropy CSPRNG symbol-number combination.
                  </p>
                  <div className="p-4 rounded-2xl bg-paper border border-line space-y-2">
                    <p className="font-bold text-navy">Current base phrase in Analyzer:</p>
                    <code className="block p-2 bg-surface rounded-xl font-mono text-sm border border-line">
                      {inputPassword}
                    </code>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 3: DATABASE REUSE SIMULATOR */}
        {activeTab === 'database' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-line shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-navy flex items-center gap-2.5">
                    <Database className="w-6 h-6 text-copper" />
                    Database Password Reuse Prevention Simulator
                  </h2>
                  <p className="text-xs text-muted mt-1">
                    Demonstrating zero-plaintext cryptographic storage and history verification via salted PBKDF2 hashes
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowNewUserModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-surface hover:bg-paper text-navy text-xs font-bold border border-line shadow-xs"
                  >
                    + New User
                  </button>
                  <button
                    onClick={handleResetDb}
                    className="px-3.5 py-2 rounded-xl bg-surface hover:bg-paper text-muted hover:text-navy text-xs font-bold border border-line shadow-xs"
                    title="Reset to demo state"
                  >
                    Reset Demo
                  </button>
                </div>
              </div>

              {/* User Selection & Depth Config */}
              <div className="grid sm:grid-cols-12 gap-4 p-4 rounded-2xl bg-paper border border-line">
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-navy mb-1.5">Select Simulated Account</label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => handleSelectUser(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-line rounded-xl text-xs font-semibold text-ink outline-none"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.username} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-navy">History Depth Policy</label>
                    <span className="text-xs font-mono text-copper-strong font-bold">Last {dbHistoryDepth} Passwords</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={dbHistoryDepth}
                    onChange={(e) => setDbHistoryDepth(Number(e.target.value))}
                    className="w-full accent-copper cursor-pointer mt-2"
                  />
                  <span className="text-[10px] text-muted block mt-1">
                    Reusing any of the previous {dbHistoryDepth} passwords will be blocked
                  </span>
                </div>
              </div>

              {/* Password Change Simulation Form */}
              <form onSubmit={handleTestChangePassword} className="space-y-4 pt-2">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-navy uppercase tracking-wider">
                      Attempt to Set New Password
                    </label>
                    <span className="text-xs text-muted">
                      Try entering an old password like <code className="font-mono text-copper">Summer2025!Shield</code> or a new one
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Lock className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={candidatePassword}
                        onChange={(e) => setCandidatePassword(e.target.value)}
                        placeholder="Enter candidate new password..."
                        className="w-full pl-11 pr-4 py-3 bg-paper border border-line rounded-2xl text-sm font-mono text-ink focus:bg-white focus:border-copper outline-none transition-all"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isDbWorking}
                      className="px-6 py-3 rounded-2xl bg-navy hover:bg-navy-soft text-cream font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 shrink-0"
                    >
                      {isDbWorking ? (
                        <>
                          <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                          <span>Checking PBKDF2...</span>
                        </>
                      ) : (
                        <>
                          <Database className="w-4 h-4 text-copper-soft" />
                          <span>Commit Password Change</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Status Alert */}
                {dbStatusMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-2xl border text-xs space-y-1 ${
                      dbStatusMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : dbStatusMessage.type === 'error'
                        ? 'bg-red-50 text-red-900 border-red-300'
                        : 'bg-blue-50 text-blue-900 border-blue-300'
                    }`}
                  >
                    <p className="font-bold text-sm">{dbStatusMessage.text}</p>
                    {dbStatusMessage.details && (
                      <p className="text-xs leading-relaxed opacity-90">{dbStatusMessage.details}</p>
                    )}
                  </motion.div>
                )}
              </form>

              {/* Database Records Table Inspector */}
              <div className="space-y-3 pt-4 border-t border-line">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                    <Database className="w-4 h-4 text-copper" />
                    Simulated SQLite / Database Table: <code className="font-mono text-copper-strong">password_history</code>
                  </h4>
                  <span className="text-xs text-muted">
                    Total records: {userHistory.length} (Active rule: Last {dbHistoryDepth})
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-line bg-paper">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-line bg-surface text-navy font-bold">
                        <th className="p-3">#</th>
                        <th className="p-3">Role / Status</th>
                        <th className="p-3">Cryptographic Salt (Hex)</th>
                        <th className="p-3">PBKDF2-SHA256 Hash</th>
                        <th className="p-3">Iterations</th>
                        <th className="p-3">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line font-mono text-[11px]">
                      {userHistory.map((rec, index) => {
                        const isProtected = index < dbHistoryDepth;
                        return (
                          <tr
                            key={rec.id}
                            className={index === 0 ? 'bg-emerald-500/10' : isProtected ? 'bg-surface/50' : 'opacity-60'}
                          >
                            <td className="p-3 font-bold text-navy">{index + 1}</td>
                            <td className="p-3">
                              {index === 0 ? (
                                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-sans font-bold text-[10px]">
                                  CURRENT
                                </span>
                              ) : isProtected ? (
                                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-sans font-bold text-[10px]">
                                  PROTECTED #{index + 1}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-line text-muted font-sans font-medium text-[10px]">
                                  ARCHIVED
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-muted">
                              {rec.saltHex.slice(0, 12)}...
                            </td>
                            <td className="p-3 text-navy font-bold">
                              {rec.hashHex.slice(0, 20)}...
                            </td>
                            <td className="p-3 text-muted font-sans">
                              {rec.iterations.toLocaleString()}
                            </td>
                            <td className="p-3 text-muted font-sans">
                              {new Date(rec.createdAt).toLocaleDateString()} {new Date(rec.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                          </tr>
                        );
                      })}
                      {userHistory.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-muted font-sans">
                            No history records found for this user.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 rounded-2xl bg-cream/70 border border-copper-soft/50 text-xs text-body flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-copper shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-navy">Key Architectural Takeaway:</strong> Notice that at no point is the user's
                    plaintext password stored in the database. When the user attempts a password change, the server takes each historical
                    salt, re-runs PBKDF2 with 100,000 rounds on the candidate input, and compares the resulting hashes using constant-time checks.
                  </div>
                </div>
              </div>
            </div>

            {/* Modal for creating a new user */}
            {showNewUserModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-xs">
                <div className="bg-surface rounded-3xl p-6 sm:p-8 max-w-md w-full border border-line shadow-card space-y-4">
                  <h3 className="text-lg font-bold text-navy">Add Simulation User</h3>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-navy mb-1.5">Username</label>
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="e.g. bob_engineer"
                        required
                        className="w-full px-3 py-2 bg-paper border border-line rounded-xl text-sm text-ink outline-none"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowNewUserModal(false)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-muted hover:text-navy"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-navy text-cream text-xs font-bold"
                      >
                        Create User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 4: ACADEMY & CONCEPTS */}
        {activeTab === 'academy' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Concept 1: Entropy */}
              <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-line shadow-card space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cream text-navy flex items-center justify-center border border-copper-soft/50 shadow-xs">
                  <Cpu className="w-6 h-6 text-copper" />
                </div>
                <h3 className="text-lg font-bold text-navy">1. Information Entropy (E = L × log₂ R)</h3>
                <p className="text-xs text-body leading-relaxed">
                  Shannon entropy measures cryptographic unpredictability in bits. Each bit doubles the total number of
                  guesses an attacker must attempt (2^E).
                </p>
                <div className="p-3 rounded-2xl bg-paper border border-line font-mono text-xs space-y-1">
                  <p className="text-muted text-[11px]">// Character Pool Sizes (R)</p>
                  <p>Lowercase only (a-z): <strong className="text-navy">R = 26</strong></p>
                  <p>Letters + Numbers: <strong className="text-navy">R = 62</strong></p>
                  <p>All Printable ASCII: <strong className="text-navy">R = 95</strong></p>
                </div>
                <p className="text-xs text-muted">
                  <strong>Insight:</strong> Adding length (L) expands the exponent exponentially. A 16-character lowercase phrase
                  (26¹⁶ ≈ 4.3 × 10²²) is far stronger than an 8-character mixed password (95⁸ ≈ 6.6 × 10¹⁵).
                </p>
              </div>

              {/* Concept 2: Hashing vs Encryption */}
              <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-line shadow-card space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cream text-navy flex items-center justify-center border border-copper-soft/50 shadow-xs">
                  <Lock className="w-6 h-6 text-copper" />
                </div>
                <h3 className="text-lg font-bold text-navy">2. Hashing vs. Encryption</h3>
                <p className="text-xs text-body leading-relaxed">
                  A common security misconception is treating hashing and encryption as synonyms:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-paper border border-line">
                    <strong className="text-navy">Encryption (Two-Way):</strong> Reversible with a secret key. Used for messages,
                    documents, and transport channels (TLS).
                  </div>
                  <div className="p-2.5 rounded-xl bg-paper border border-line">
                    <strong className="text-navy">Cryptographic Hashing (One-Way):</strong> Irreversible mathematical trapdoor.
                    Given H = Hash(P), it is computationally infeasible to invert H back to P.
                  </div>
                </div>
              </div>

              {/* Concept 3: Why Salt Matters */}
              <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-line shadow-card space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cream text-navy flex items-center justify-center border border-copper-soft/50 shadow-xs">
                  <ShieldCheck className="w-6 h-6 text-copper" />
                </div>
                <h3 className="text-lg font-bold text-navy">3. Why Cryptographic Salt is Mandatory</h3>
                <p className="text-xs text-body leading-relaxed">
                  A <strong>Salt</strong> is a unique, cryptographically random byte sequence (e.g. 16 bytes) generated for every user password:
                </p>
                <ul className="list-disc list-inside text-xs text-body space-y-1.5">
                  <li><strong>Defeats Rainbow Tables:</strong> Precomputed lookup tables of hashes become useless because the table would have to be precomputed separately for every unique 128-bit salt.</li>
                  <li><strong>Hides Identical Passwords:</strong> If two users choose the exact same password, their stored hashes look completely distinct.</li>
                </ul>
              </div>

              {/* Concept 4: Slow KDFs */}
              <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-line shadow-card space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cream text-navy flex items-center justify-center border border-copper-soft/50 shadow-xs">
                  <Terminal className="w-6 h-6 text-copper" />
                </div>
                <h3 className="text-lg font-bold text-navy">4. Slow KDFs (PBKDF2, Argon2, bcrypt)</h3>
                <p className="text-xs text-body leading-relaxed">
                  Fast hash algorithms like MD5 or SHA-256 were designed for throughput (verifying gigabyte files in seconds).
                  Modern GPUs can test over <strong>100 billion SHA-256 hashes per second</strong>.
                </p>
                <p className="text-xs text-muted">
                  <strong>Solution:</strong> Key Derivation Functions (KDFs) introduce tunable work factors (e.g. 100,000 rounds of PBKDF2,
                  or Argon2's memory hardness) that take ~100ms per attempt on legitimate hardware, reducing attacker brute-force capability
                  from billions of guesses/sec to just thousands.
                </p>
              </div>
            </div>

            {/* Terminal CLI Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-navy text-cream shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-ice">
                  <Terminal className="w-3.5 h-3.5 text-copper" /> Standalone Terminal CLI & SQLite Tool
                </div>
                <h4 className="text-xl font-bold">Prefer the Terminal?</h4>
                <p className="text-xs text-ice/80 max-w-xl">
                  Run our companion Node.js CLI script to inspect the SQLite database file (<code className="text-copper">passwords.db</code>)
                  and test password reuse prevention from the command line:
                </p>
              </div>

              <div className="p-3 bg-black/40 rounded-2xl border border-white/10 font-mono text-xs text-ice/90 shrink-0">
                npm run security-cli
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-line/60 bg-surface/50 py-5 px-6 text-center text-xs text-muted mt-12">
        &copy; {new Date().getFullYear()} Skilloryn Inc. · Password Security & Cryptography Learning Lab
      </footer>
    </div>
  );
}
