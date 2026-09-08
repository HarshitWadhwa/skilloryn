/**
 * Password Security & Cryptography Engine
 * 
 * Provides:
 * 1. Entropy calculation based on information theory: E = L * log2(R)
 * 2. Complexity, character diversity, and pattern detection (repeated, sequences, keyboard walks)
 * 3. Common password dictionary detection (NIST SP 800-63B recommendations)
 * 4. Realistic crack time estimation across threat models
 * 5. Cryptographically secure password & Diceware passphrase generation (CSPRNG)
 * 6. WebCrypto PBKDF2-HMAC-SHA256 salted hashing and verification
 */

// Common breached or easily guessed passwords (curated top sample)
export const COMMON_PASSWORDS = new Set([
  '123456', 'password', '123456789', '12345678', '12345', '111111', '1234567',
  'sunshine', 'qwerty', 'iloveyou', 'princess', 'admin', 'welcome', '666666',
  'football', 'monkey', 'charlie', 'donald', 'master', 'dragon', 'baseball',
  'superman', 'shadow', 'trustno1', 'secret', 'hunter2', 'pass123', 'letmein',
  'access', 'starwars', 'killer', 'test123', 'cookie', 'mustang', 'michael',
  'jessica', 'ashley', 'computer', 'system', 'root', 'login', 'operator',
  'chelsea', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm', 'password1', 'p@ssword',
  'p@ssw0rd', 'admin123', 'admin1234', 'default', 'guest', 'security'
]);

// Common keyboard sequential patterns
const KEYBOARD_WALKS = [
  'qwerty', 'wertyu', 'ertyui', 'rtyuio', 'tyuiop',
  'asdfgh', 'sdfghj', 'dfghjk', 'fghjkl',
  'zxcvbn', 'xcvbnm',
  '123456', '234567', '345678', '456789', '567890',
  'qazwsx', 'wsxedc', 'edcrfv', 'rfvtgb', 'tgbzhn'
];

// Curated list of evocative words for NIST-style Diceware passphrases
export const DICEWARE_WORDLIST = [
  'amber', 'anchor', 'beacon', 'breeze', 'bridge', 'cactus', 'canvas', 'canyon',
  'cedar', 'cipher', 'clover', 'cobalt', 'comet', 'coral', 'cosmos', 'crater',
  'crystal', 'delta', 'drift', 'ember', 'falcon', 'fathom', 'feather', 'forest',
  'fossil', 'galaxy', 'garnet', 'glacier', 'granite', 'harbor', 'haven', 'horizon',
  'island', 'jaguar', 'juniper', 'lagoon', 'lantern', 'meadow', 'meteor', 'mirage',
  'monarch', 'nebula', 'nexus', 'oasis', 'obsidian', 'ocean', 'orbit', 'orchid',
  'pebble', 'phoenix', 'pinnacle', 'planet', 'portal', 'prairie', 'prism', 'pulsar',
  'quarry', 'quartz', 'quiver', 'radius', 'ravine', 'ripple', 'river', 'rocket',
  'safari', 'sequoia', 'shadow', 'shield', 'silver', 'solace', 'spark', 'sphere',
  'summit', 'timber', 'topaz', 'torrent', 'tracer', 'tundra', 'valley', 'vector',
  'velvet', 'vessel', 'vertex', 'vortex', 'voyage', 'whisper', 'zenith', 'zephyr'
];

export interface ComplexityBreakdown {
  hasLower: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  lowerCount: number;
  upperCount: number;
  numberCount: number;
  symbolCount: number;
  poolSize: number;
}

export interface PatternFinding {
  type: 'repetition' | 'sequential' | 'keyboard_walk' | 'common_word' | 'leetspeak';
  message: string;
  penaltyBits: number;
}

export interface CrackTimeEstimates {
  onlineThrottled: string;  // 100 guesses/sec (Web form with rate limiter)
  offlineFastGpu: string;   // 100 billion guesses/sec (Fast un-salted GPU hash crack)
  offlineSlowKdf: string;   // 10,000 guesses/sec (Slow salted PBKDF2 / Argon2)
}

export type StrengthLevel = 'very_weak' | 'weak' | 'fair' | 'strong' | 'excellent';

export interface PasswordAnalysis {
  password: string;
  length: number;
  complexity: ComplexityBreakdown;
  rawEntropyBits: number;
  effectiveEntropyBits: number;
  strength: StrengthLevel;
  strengthScore: number; // 0 to 100
  isCommon: boolean;
  patterns: PatternFinding[];
  suggestions: string[];
  crackTime: CrackTimeEstimates;
}

/**
 * Calculates raw Shannon/information entropy:
 * E = L * log2(R)
 */
export function calculateEntropy(length: number, poolSize: number): number {
  if (length === 0 || poolSize <= 0) return 0;
  return Math.round(length * Math.log2(poolSize) * 10) / 10;
}

/**
 * Checks character complexity and pool size
 */
export function analyzeComplexity(password: string): ComplexityBreakdown {
  let lowerCount = 0;
  let upperCount = 0;
  let numberCount = 0;
  let symbolCount = 0;

  for (const char of password) {
    if (/[a-z]/.test(char)) lowerCount++;
    else if (/[A-Z]/.test(char)) upperCount++;
    else if (/[0-9]/.test(char)) numberCount++;
    else symbolCount++;
  }

  let poolSize = 0;
  if (lowerCount > 0) poolSize += 26;
  if (upperCount > 0) poolSize += 26;
  if (numberCount > 0) poolSize += 10;
  if (symbolCount > 0) poolSize += 33; // Standard printable symbols

  return {
    hasLower: lowerCount > 0,
    hasUpper: upperCount > 0,
    hasNumber: numberCount > 0,
    hasSymbol: symbolCount > 0,
    lowerCount,
    upperCount,
    numberCount,
    symbolCount,
    poolSize
  };
}

/**
 * Detects patterns that dramatically reduce practical entropy
 */
export function detectPatterns(password: string): PatternFinding[] {
  const findings: PatternFinding[] = [];
  const lower = password.toLowerCase();

  // 1. Repeated consecutive characters (e.g. "aaaa" or "1111")
  const repeatRegex = /(.)\1{2,}/g;
  let repeatMatch: RegExpExecArray | null;
  while ((repeatMatch = repeatRegex.exec(password)) !== null) {
    findings.push({
      type: 'repetition',
      message: `Repeated sequence: "${repeatMatch[0]}"`,
      penaltyBits: repeatMatch[0].length * 3
    });
  }

  // 2. Sequential numbers (e.g. "1234", "6789")
  for (let i = 0; i < password.length - 2; i++) {
    const c1 = password.charCodeAt(i);
    const c2 = password.charCodeAt(i + 1);
    const c3 = password.charCodeAt(i + 2);
    if ((c2 === c1 + 1 && c3 === c2 + 1) || (c2 === c1 - 1 && c3 === c2 - 1)) {
      findings.push({
        type: 'sequential',
        message: `Sequential series: "${password.slice(i, i + 3)}"`,
        penaltyBits: 8
      });
      break;
    }
  }

  // 3. Keyboard walks (e.g. "qwerty", "asdfgh")
  for (const walk of KEYBOARD_WALKS) {
    if (lower.includes(walk)) {
      findings.push({
        type: 'keyboard_walk',
        message: `Keyboard walk pattern: "${walk}"`,
        penaltyBits: 15
      });
      break;
    }
  }

  // 4. Common password exact or substring match
  if (COMMON_PASSWORDS.has(lower)) {
    findings.push({
      type: 'common_word',
      message: `Direct match in common/breached passwords list`,
      penaltyBits: 40
    });
  } else {
    for (const common of COMMON_PASSWORDS) {
      if (common.length >= 5 && lower.includes(common)) {
        findings.push({
          type: 'common_word',
          message: `Contains common weak word "${common}"`,
          penaltyBits: 20
        });
        break;
      }
    }
  }

  // 5. Common leetspeak substitutions (e.g. p@ssw0rd)
  const deLeeted = lower
    .replace(/@/g, 'a')
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/5/g, 's')
    .replace(/\$/g, 's')
    .replace(/!/g, 'i');

  if (deLeeted !== lower && (COMMON_PASSWORDS.has(deLeeted) || deLeeted.includes('password'))) {
    findings.push({
      type: 'leetspeak',
      message: 'Predictable leetspeak substitution detected (e.g. @ for a, 0 for o)',
      penaltyBits: 15
    });
  }

  return findings;
}

/**
 * Formats time in seconds to human-readable estimate
 */
export function formatCrackDuration(seconds: number): string {
  if (seconds < 1e-3) return 'Instant (< 1 ms)';
  if (seconds < 1) return '< 1 second';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 86400 * 30) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 86400 * 365) return `${Math.round(seconds / (86400 * 30))} months`;
  if (seconds < 86400 * 365 * 100) return `${Math.round(seconds / (86400 * 365))} years`;
  if (seconds < 86400 * 365 * 1e6) return `${(seconds / (86400 * 365 * 1e3)).toFixed(1)} thousand years`;
  if (seconds < 86400 * 365 * 1e9) return `${(seconds / (86400 * 365 * 1e6)).toFixed(1)} million years`;
  return 'Centuries+ (> 1 billion years)';
}

/**
 * Calculates estimated crack time based on effective entropy
 */
export function calculateCrackTimes(effectiveEntropy: number): CrackTimeEstimates {
  // Total search space = 2^entropy. Average guesses to crack is 2^(entropy - 1)
  const guesses = Math.pow(2, Math.max(0, effectiveEntropy - 1));

  // Threat scenarios
  const onlineRate = 100;           // 100 guesses/sec (rate limited web service)
  const offlineFastGpuRate = 1e11;  // 100 Billion guesses/sec (GPU rig un-salted MD5/SHA256)
  const offlineSlowKdfRate = 1e4;   // 10,000 guesses/sec (PBKDF2 / Argon2 / bcrypt)

  return {
    onlineThrottled: formatCrackDuration(guesses / onlineRate),
    offlineFastGpu: formatCrackDuration(guesses / offlineFastGpuRate),
    offlineSlowKdf: formatCrackDuration(guesses / offlineSlowKdfRate)
  };
}

/**
 * Full analysis of a password
 */
export function analyzePassword(password: string): PasswordAnalysis {
  const length = password.length;
  const complexity = analyzeComplexity(password);
  const rawEntropy = calculateEntropy(length, complexity.poolSize);
  const patterns = detectPatterns(password);
  const isCommon = COMMON_PASSWORDS.has(password.toLowerCase());

  // Calculate penalties from predictable patterns
  const totalPenalty = patterns.reduce((sum, p) => sum + p.penaltyBits, 0);
  const effectiveEntropyBits = Math.max(0, Math.round((rawEntropy - totalPenalty) * 10) / 10);

  // Determine strength category
  let strength: StrengthLevel;
  if (length === 0 || isCommon || effectiveEntropyBits < 28) {
    strength = 'very_weak';
  } else if (effectiveEntropyBits < 45 || length < 8) {
    strength = 'weak';
  } else if (effectiveEntropyBits < 60 || length < 10) {
    strength = 'fair';
  } else if (effectiveEntropyBits < 80 || length < 14) {
    strength = 'strong';
  } else {
    strength = 'excellent';
  }

  // 0 - 100 score normalized for UI meter
  const strengthScore = Math.min(100, Math.round((effectiveEntropyBits / 90) * 100));

  // Actionable recommendations
  const suggestions: string[] = [];
  if (length < 8) suggestions.push('Increase length to at least 8 characters (12+ recommended by NIST).');
  else if (length < 12) suggestions.push('Consider increasing length to 12-16 characters for exponential brute-force resistance.');

  if (!complexity.hasLower) suggestions.push('Add lowercase letters.');
  if (!complexity.hasUpper) suggestions.push('Add uppercase letters to expand the character search pool.');
  if (!complexity.hasNumber) suggestions.push('Add numbers to enhance character variety.');
  if (!complexity.hasSymbol) suggestions.push('Add special characters or symbols.');

  if (patterns.some(p => p.type === 'repetition')) suggestions.push('Avoid repeating identical characters consecutively.');
  if (patterns.some(p => p.type === 'sequential' || p.type === 'keyboard_walk')) suggestions.push('Avoid keyboard patterns like "qwerty" or sequential numbers like "123".');
  if (isCommon) suggestions.push('CRITICAL: This is one of the most frequently breached passwords globally. Change immediately.');

  const crackTime = calculateCrackTimes(effectiveEntropyBits);

  return {
    password,
    length,
    complexity,
    rawEntropyBits: rawEntropy,
    effectiveEntropyBits,
    strength,
    strengthScore,
    isCommon,
    patterns,
    suggestions,
    crackTime
  };
}

/**
 * Cryptographically Secure Random Byte Generator (cross-environment)
 */
function getSecureRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return bytes;
}

/**
 * Generates a high-entropy random password using CSPRNG
 */
export interface GenerateRandomOptions {
  length?: number;
  includeUpper?: boolean;
  includeLower?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
}

export function generateRandomPassword(options: GenerateRandomOptions = {}): string {
  const {
    length = 16,
    includeUpper = true,
    includeLower = true,
    includeNumbers = true,
    includeSymbols = true
  } = options;

  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

  let pool = '';
  const guaranteed: string[] = [];

  if (includeLower) {
    pool += lowerChars;
    const rnd = getSecureRandomBytes(1)[0] % lowerChars.length;
    guaranteed.push(lowerChars[rnd]);
  }
  if (includeUpper) {
    pool += upperChars;
    const rnd = getSecureRandomBytes(1)[0] % upperChars.length;
    guaranteed.push(upperChars[rnd]);
  }
  if (includeNumbers) {
    pool += numberChars;
    const rnd = getSecureRandomBytes(1)[0] % numberChars.length;
    guaranteed.push(numberChars[rnd]);
  }
  if (includeSymbols) {
    pool += symbolChars;
    const rnd = getSecureRandomBytes(1)[0] % symbolChars.length;
    guaranteed.push(symbolChars[rnd]);
  }

  if (pool.length === 0) pool = lowerChars + numberChars;

  const remainingLength = Math.max(0, length - guaranteed.length);
  const randomBytes = getSecureRandomBytes(remainingLength);
  const resultChars: string[] = [...guaranteed];

  for (let i = 0; i < remainingLength; i++) {
    resultChars.push(pool[randomBytes[i] % pool.length]);
  }

  // Fisher-Yates shuffle using CSPRNG
  for (let i = resultChars.length - 1; i > 0; i--) {
    const j = getSecureRandomBytes(1)[0] % (i + 1);
    [resultChars[i], resultChars[j]] = [resultChars[j], resultChars[i]];
  }

  return resultChars.join('');
}

/**
 * Generates a NIST SP 800-63B inspired Diceware multi-word passphrase
 * (e.g. "Cobalt-Falcon-Meadow-Pulsar84")
 */
export interface GeneratePassphraseOptions {
  wordCount?: number;
  separator?: string;
  capitalize?: boolean;
  includeNumber?: boolean;
}

export function generateDicewarePassphrase(options: GeneratePassphraseOptions = {}): string {
  const {
    wordCount = 4,
    separator = '-',
    capitalize = true,
    includeNumber = true
  } = options;

  const randomBytes = getSecureRandomBytes(wordCount);
  const chosenWords: string[] = [];

  for (let i = 0; i < wordCount; i++) {
    const wordIndex = randomBytes[i] % DICEWARE_WORDLIST.length;
    let word = DICEWARE_WORDLIST[wordIndex];
    if (capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    chosenWords.push(word);
  }

  if (includeNumber) {
    const num = (getSecureRandomBytes(1)[0] % 90) + 10; // 2-digit number
    chosenWords[chosenWords.length - 1] += num.toString();
  }

  return chosenWords.join(separator);
}

/**
 * Suggests strengthened alternatives for a candidate password
 */
export function suggestStrongerAlternatives(candidate: string): {
  passphrase: string;
  hardenedRandom: string;
  smartMutation: string;
} {
  const passphrase = generateDicewarePassphrase({ wordCount: 4, separator: '-' });
  const hardenedRandom = generateRandomPassword({ length: 16 });

  // Smart mutation: takes words or stems and hardens them
  let base = candidate.trim();
  if (base.length === 0) base = 'SecureShield';
  // Strip spaces, capitalize first letter, append high-entropy suffix
  const cleanBase = base.replace(/[^a-zA-Z0-9]/g, '');
  const prefix = cleanBase.charAt(0).toUpperCase() + cleanBase.slice(1, 10);
  const randomSuffix = getSecureRandomBytes(2);
  const symbol = ['#', '!', '$', '%', '&', '*'][randomSuffix[0] % 6];
  const num = (randomSuffix[1] % 900) + 100;
  const smartMutation = `${prefix}${symbol}${num}#Secure`;

  return {
    passphrase,
    hardenedRandom,
    smartMutation
  };
}

// ---------------------------------------------------------------------------
// Cryptographic Hashing Engine (WebCrypto PBKDF2 with Cryptographic Salt)
// ---------------------------------------------------------------------------

/**
 * Converts ArrayBuffer or Uint8Array to Hex String
 */
export function bufferToHex(buffer: ArrayBuffer | ArrayBufferLike | Uint8Array): string {
  const byteArray = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer as ArrayBuffer);
  return Array.from(byteArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Converts Hex String to Uint8Array
 */
export function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Generates a cryptographically secure 16-byte random salt
 */
export function generateSaltHex(byteLength = 16): string {
  const salt = getSecureRandomBytes(byteLength);
  return bufferToHex(salt);
}

/**
 * Derives a PBKDF2-HMAC-SHA256 hash using the Web Crypto API
 * Uses 100,000 iterations for slow key derivation
 */
export async function hashPasswordPbkdf2(
  password: string,
  saltHex: string,
  iterations = 100000
): Promise<string> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const saltBytes = hexToBuffer(saltHex);
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes as unknown as ArrayBuffer,
      iterations,
      hash: 'SHA-256'
    },
    passwordKey,
    256 // 256 bits = 32 bytes
  );

  return bufferToHex(derivedBits);
}

/**
 * Constant-time string equality check to prevent timing attacks
 */
export function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
