#!/usr/bin/env node

/**
 * Standalone Password Security & Cryptography CLI Lab
 * 
 * Features:
 * - Check password length, complexity, entropy, patterns, and uniqueness
 * - Suggest stronger password alternatives (Diceware passphrases & random CSPRNG)
 * - Integrated SQLite database preventing reuse of old passwords using PBKDF2 + salt
 * 
 * Usage:
 *   node scripts/password_security_cli.mjs --demo
 *   node scripts/password_security_cli.mjs
 */

import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'passwords.db');

// Top common/breached passwords sample
const COMMON_PASSWORDS = new Set([
  '123456', 'password', '123456789', '12345678', '12345', '111111', '1234567',
  'sunshine', 'qwerty', 'iloveyou', 'princess', 'admin', 'welcome', '666666',
  'football', 'monkey', 'charlie', 'donald', 'master', 'dragon', 'baseball',
  'superman', 'shadow', 'trustno1', 'secret', 'hunter2', 'pass123', 'letmein',
  'chelsea', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm', 'password1', 'p@ssword',
  'p@ssw0rd', 'admin123', 'admin1234', 'default', 'guest', 'security'
]);

const KEYBOARD_WALKS = ['qwerty', 'asdfgh', 'zxcvbn', '123456', 'qazwsx', 'wsxedc'];

const WORDLIST = [
  'amber', 'anchor', 'beacon', 'breeze', 'bridge', 'cactus', 'canvas', 'canyon',
  'cedar', 'cipher', 'clover', 'cobalt', 'comet', 'coral', 'cosmos', 'crater',
  'crystal', 'delta', 'drift', 'ember', 'falcon', 'fathom', 'feather', 'forest',
  'galaxy', 'glacier', 'granite', 'harbor', 'haven', 'horizon', 'island', 'jaguar',
  'lagoon', 'lantern', 'meadow', 'meteor', 'mirage', 'monarch', 'nebula', 'nexus',
  'oasis', 'obsidian', 'ocean', 'orbit', 'orchid', 'phoenix', 'planet', 'portal',
  'quartz', 'radius', 'ripple', 'river', 'rocket', 'safari', 'shadow', 'shield',
  'summit', 'timber', 'topaz', 'torrent', 'tracer', 'tundra', 'valley', 'vector',
  'velvet', 'vortex', 'voyage', 'whisper', 'zenith', 'zephyr'
];

// Initialize SQLite database
const db = new DatabaseSync(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS password_history (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    salt_hex TEXT NOT NULL,
    hash_hex TEXT NOT NULL,
    algorithm TEXT NOT NULL,
    iterations INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

/**
 * Cryptography Helpers
 */
function hashPasswordPbkdf2(password, saltHex, iterations = 100000) {
  const salt = Buffer.from(saltHex, 'hex');
  const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
  return derivedKey.toString('hex');
}

function generateSaltHex(byteLength = 16) {
  return crypto.randomBytes(byteLength).toString('hex');
}

function timingSafeCheck(aHex, bHex) {
  const bufA = Buffer.from(aHex, 'hex');
  const bufB = Buffer.from(bHex, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Password Security Analysis
 */
function analyzePassword(password) {
  const length = password.length;
  let lower = 0, upper = 0, num = 0, sym = 0;

  for (const c of password) {
    if (/[a-z]/.test(c)) lower++;
    else if (/[A-Z]/.test(c)) upper++;
    else if (/[0-9]/.test(c)) num++;
    else sym++;
  }

  let poolSize = 0;
  if (lower > 0) poolSize += 26;
  if (upper > 0) poolSize += 26;
  if (num > 0) poolSize += 10;
  if (sym > 0) poolSize += 33;

  const rawEntropy = length > 0 && poolSize > 0
    ? Math.round(length * Math.log2(poolSize) * 10) / 10
    : 0;

  const lowerPwd = password.toLowerCase();
  const patterns = [];

  // Repeated
  if (/(.)\1{2,}/.test(password)) {
    patterns.push('Contains 3+ repeated identical characters');
  }

  // Sequences
  for (let i = 0; i < password.length - 2; i++) {
    const c1 = password.charCodeAt(i);
    const c2 = password.charCodeAt(i + 1);
    const c3 = password.charCodeAt(i + 2);
    if ((c2 === c1 + 1 && c3 === c2 + 1) || (c2 === c1 - 1 && c3 === c2 - 1)) {
      patterns.push(`Sequential series detected: "${password.slice(i, i + 3)}"`);
      break;
    }
  }

  // Keyboard walks
  for (const walk of KEYBOARD_WALKS) {
    if (lowerPwd.includes(walk)) {
      patterns.push(`Keyboard walk pattern: "${walk}"`);
      break;
    }
  }

  // Blacklist
  const isCommon = COMMON_PASSWORDS.has(lowerPwd);
  if (isCommon) {
    patterns.push('Exact match in top common/breached passwords list');
  }

  let effectiveEntropy = rawEntropy;
  if (isCommon) effectiveEntropy = Math.min(effectiveEntropy, 10);
  if (patterns.length > 0) effectiveEntropy = Math.max(0, effectiveEntropy - patterns.length * 10);

  let strength = 'VERY WEAK';
  if (effectiveEntropy >= 80 && length >= 14) strength = 'EXCELLENT';
  else if (effectiveEntropy >= 60 && length >= 10) strength = 'STRONG';
  else if (effectiveEntropy >= 45 && length >= 8) strength = 'FAIR';
  else if (effectiveEntropy >= 28) strength = 'WEAK';

  // Crack times
  const guesses = Math.pow(2, Math.max(0, effectiveEntropy - 1));
  const formatTime = (sec) => {
    if (sec < 0.001) return 'Instant (< 1 ms)';
    if (sec < 1) return '< 1 second';
    if (sec < 60) return `${Math.round(sec)} seconds`;
    if (sec < 3600) return `${Math.round(sec / 60)} minutes`;
    if (sec < 86400) return `${Math.round(sec / 3600)} hours`;
    if (sec < 86400 * 365) return `${Math.round(sec / 86400)} days`;
    if (sec < 86400 * 365 * 100) return `${Math.round(sec / (86400 * 365))} years`;
    return 'Centuries+ (> 1 billion years)';
  };

  return {
    password,
    length,
    poolSize,
    rawEntropy,
    effectiveEntropy,
    strength,
    isCommon,
    patterns,
    crackTimes: {
      online: formatTime(guesses / 100),
      gpuFastHash: formatTime(guesses / 1e11),
      slowKdf: formatTime(guesses / 1e4)
    }
  };
}

/**
 * Strong Password Alternatives
 */
function generateAlternatives(basePassword = '') {
  // 1. Diceware Passphrase (NIST SP 800-63B inspired)
  const randomBytes = crypto.randomBytes(4);
  const words = [];
  for (let i = 0; i < 4; i++) {
    const w = WORDLIST[randomBytes[i] % WORDLIST.length];
    words.push(w.charAt(0).toUpperCase() + w.slice(1));
  }
  const suffixNum = (crypto.randomBytes(1)[0] % 90) + 10;
  words[words.length - 1] += suffixNum;
  const passphrase = words.join('-');

  // 2. High-Entropy Random Characters
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
  const charBytes = crypto.randomBytes(16);
  let randomPwd = '';
  for (let i = 0; i < 16; i++) {
    randomPwd += charset[charBytes[i] % charset.length];
  }

  // 3. Smart hardened version
  let prefix = basePassword.replace(/[^a-zA-Z0-9]/g, '') || 'Secure';
  prefix = prefix.charAt(0).toUpperCase() + prefix.slice(1, 10);
  const symbol = '!@#$%^&*' [crypto.randomBytes(1)[0] % 8];
  const num = (crypto.randomBytes(2).readUInt16BE(0) % 900) + 100;
  const hardened = `${prefix}${symbol}${num}#Shield`;

  return { passphrase, randomPwd, hardened };
}

/**
 * Database Reuse Prevention Engine
 */
function getOrCreateUser(username) {
  const existing = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (existing) return existing;

  const id = 'usr_' + crypto.randomBytes(4).toString('hex');
  const now = new Date().toISOString();
  db.prepare('INSERT INTO users (id, username, created_at) VALUES (?, ?, ?)').run(id, username, now);
  return { id, username, created_at: now };
}

function checkPasswordReuse(userId, candidatePassword, historyDepth = 5) {
  const history = db.prepare(
    'SELECT * FROM password_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ?'
  ).all(userId, historyDepth);

  for (let i = 0; i < history.length; i++) {
    const record = history[i];
    const candidateHash = hashPasswordPbkdf2(candidatePassword, record.salt_hex, record.iterations);
    if (timingSafeCheck(candidateHash, record.hash_hex)) {
      return {
        canReuse: false,
        matchedPosition: i + 1,
        matchedCreatedAt: record.created_at
      };
    }
  }

  return { canReuse: true };
}

function saveNewPassword(userId, password, historyDepth = 5) {
  const reuse = checkPasswordReuse(userId, password, historyDepth);
  if (!reuse.canReuse) {
    return {
      success: false,
      error: `Password matches previous password #${reuse.matchedPosition} (created at ${reuse.matchedCreatedAt}). Reusing the last ${historyDepth} passwords is prohibited.`
    };
  }

  const saltHex = generateSaltHex(16);
  const iterations = 100000;
  const hashHex = hashPasswordPbkdf2(password, saltHex, iterations);
  const id = 'pwd_' + crypto.randomBytes(4).toString('hex');
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO password_history (id, user_id, salt_hex, hash_hex, algorithm, iterations, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, userId, saltHex, hashHex, 'PBKDF2-HMAC-SHA256', iterations, now);

  return {
    success: true,
    saltHex,
    hashHex,
    iterations
  };
}

/**
 * Demo Mode for automated inspection & learning
 */
async function runDemo() {
  console.log('\n===============================================================');
  console.log('  PASSWORD SECURITY & CRYPTOGRAPHY LAB (CLI & SQLite)');
  console.log('===============================================================\n');

  console.log('[1] ANALYZING SAMPLE PASSWORDS:');
  const testPasswords = [
    'password123',
    'qwerty789',
    'Tr0ub4dor&3',
    'Cobalt-Falcon-Meadow-Pulsar84'
  ];

  for (const pwd of testPasswords) {
    const analysis = analyzePassword(pwd);
    console.log(`\nPassword: "${analysis.password}"`);
    console.log(`  - Length: ${analysis.length} chars | Pool Size: ${analysis.poolSize}`);
    console.log(`  - Effective Entropy: ${analysis.effectiveEntropy} bits`);
    console.log(`  - Strength Rating: [${analysis.strength}]`);
    if (analysis.patterns.length > 0) {
      console.log(`  - Detected Vulnerabilities: ${analysis.patterns.join(', ')}`);
    }
    console.log(`  - Crack Times:`);
    console.log(`      * Online Web (100 req/s):       ${analysis.crackTimes.online}`);
    console.log(`      * Unsalted GPU Fast Hash:        ${analysis.crackTimes.gpuFastHash}`);
    console.log(`      * Salted PBKDF2/Argon2 (Slow):   ${analysis.crackTimes.slowKdf}`);
  }

  console.log('\n---------------------------------------------------------------');
  console.log('[2] SUGGESTING STRONGER ALTERNATIVES:');
  const alts = generateAlternatives('summer2026');
  console.log(`  1. Diceware Passphrase:  ${alts.passphrase}`);
  console.log(`  2. High-Entropy Random:  ${alts.randomPwd}`);
  console.log(`  3. Smart Hardened:       ${alts.hardened}`);

  console.log('\n---------------------------------------------------------------');
  console.log('[3] DATABASE-BACKED PASSWORD REUSE PREVENTION (SQLite):');
  console.log(`  Database File: ${DB_PATH}`);

  const user = getOrCreateUser('demo_student');
  // Clear previous demo run history for clean reproduction
  db.prepare('DELETE FROM password_history WHERE user_id = ?').run(user.id);
  console.log(`  User: "${user.username}" (ID: ${user.id})`);

  console.log('\n  Step A: Setting initial password "Summer2026!Shield"...');
  const res1 = saveNewPassword(user.id, 'Summer2026!Shield');
  if (res1.success) {
    console.log(`  ✓ Successfully stored in SQLite!`);
    console.log(`    Salt (16 bytes hex): ${res1.saltHex}`);
    console.log(`    PBKDF2 Hash (SHA-256, 100k iters): ${res1.hashHex.slice(0, 32)}...`);
    console.log(`    NOTE: Plaintext password is NEVER stored!`);
  }

  console.log('\n  Step B: Setting new password "Winter2026#Cosmos"...');
  const res2 = saveNewPassword(user.id, 'Winter2026#Cosmos');
  console.log(`  ✓ Success: ${res2.success}`);

  console.log('\n  Step C: Attempting to REUSE previous password "Summer2026!Shield"...');
  const res3 = saveNewPassword(user.id, 'Summer2026!Shield');
  if (!res3.success) {
    console.log(`  🛡️ REJECTION BLOCKED BY POLICY:`);
    console.log(`    ${res3.error}`);
    console.log(`    How it works: The system salted and derived the hash of the candidate`);
    console.log(`    password using the historical salt, finding a cryptographic match`);
    console.log(`    without ever needing to store the plaintext!`);
  }

  console.log('\n===============================================================');
  console.log('  Demo completed successfully.');
  console.log('===============================================================\n');
}

/**
 * Interactive Terminal Menu
 */
async function runInteractive() {
  const rl = readline.createInterface({ input, output });

  try {
    console.log('\n===============================================================');
    console.log('  Welcome to the Password Security & Cryptography Terminal Lab');
    console.log('===============================================================');

    while (true) {
      console.log('\nSelect an option:');
      console.log('1. Check Password (Entropy, Complexity, Crack Time)');
      console.log('2. Generate Strong Password Alternatives');
      console.log('3. Test Database Password Reuse Prevention (SQLite)');
      console.log('4. Run Full Demonstration');
      console.log('5. Exit');

      const choice = (await rl.question('\nChoice (1-5): ')).trim();

      if (choice === '1') {
        const pwd = await rl.question('Enter password to analyze: ');
        const analysis = analyzePassword(pwd);
        console.log(`\nAnalysis for "${pwd}":`);
        console.log(`  Length: ${analysis.length} | Pool: ${analysis.poolSize}`);
        console.log(`  Entropy: ${analysis.effectiveEntropy} bits | Strength: [${analysis.strength}]`);
        if (analysis.patterns.length > 0) {
          console.log(`  Patterns: ${analysis.patterns.join(', ')}`);
        }
        console.log(`  Online crack estimate: ${analysis.crackTimes.online}`);
        console.log(`  Slow KDF crack estimate: ${analysis.crackTimes.slowKdf}`);
      } else if (choice === '2') {
        const base = await rl.question('Optional base word to strengthen (or press Enter): ');
        const alts = generateAlternatives(base);
        console.log('\nRecommended Alternatives:');
        console.log(`  Diceware Passphrase:  ${alts.passphrase}`);
        console.log(`  Random CSPRNG (16c):  ${alts.randomPwd}`);
        console.log(`  Hardened Mutation:    ${alts.hardened}`);
      } else if (choice === '3') {
        const username = (await rl.question('Enter username: ')).trim() || 'test_user';
        const user = getOrCreateUser(username);
        const pwd = await rl.question('Enter new password to register/update: ');
        const result = saveNewPassword(user.id, pwd);
        if (result.success) {
          console.log(`\n✓ Password accepted and stored in SQLite!`);
          console.log(`  Stored Salt: ${result.saltHex}`);
          console.log(`  PBKDF2 Hash: ${result.hashHex}`);
        } else {
          console.log(`\n✗ Blocked: ${result.error}`);
        }
      } else if (choice === '4') {
        await runDemo();
      } else if (choice === '5') {
        console.log('Goodbye!');
        break;
      }
    }
  } finally {
    rl.close();
  }
}

// Execute
if (process.argv.includes('--demo')) {
  runDemo();
} else {
  runInteractive();
}
