import { describe, it, expect, beforeEach } from 'vitest';
import {
  analyzeComplexity,
  calculateEntropy,
  detectPatterns,
  analyzePassword,
  generateRandomPassword,
  generateDicewarePassphrase,
  suggestStrongerAlternatives,
  hashPasswordPbkdf2,
  generateSaltHex,
  timingSafeEqualHex
} from '../utils/passwordSecurity';
import { PasswordHistoryService } from '../services/passwordHistoryDb';

describe('Password Security Analyzer & Entropy Calculator', () => {
  it('correctly calculates character pool sizes and complexity breakdown', () => {
    const lowerOnly = analyzeComplexity('secret');
    expect(lowerOnly.hasLower).toBe(true);
    expect(lowerOnly.hasUpper).toBe(false);
    expect(lowerOnly.hasNumber).toBe(false);
    expect(lowerOnly.hasSymbol).toBe(false);
    expect(lowerOnly.poolSize).toBe(26);

    const fullMix = analyzeComplexity('P@ssw0rd123');
    expect(fullMix.hasLower).toBe(true);
    expect(fullMix.hasUpper).toBe(true);
    expect(fullMix.hasNumber).toBe(true);
    expect(fullMix.hasSymbol).toBe(true);
    expect(fullMix.poolSize).toBe(26 + 26 + 10 + 33);
  });

  it('calculates Shannon entropy correctly: E = L * log2(R)', () => {
    // Length 10, pool size 26 -> 10 * log2(26) ~= 47.00 bits
    const entropy = calculateEntropy(10, 26);
    expect(entropy).toBeCloseTo(47.0, 1);

    // Empty password
    expect(calculateEntropy(0, 26)).toBe(0);
  });

  it('detects sequential series, repetitions, and keyboard walks', () => {
    const repPatterns = detectPatterns('aaaa123');
    expect(repPatterns.some(p => p.type === 'repetition')).toBe(true);
    expect(repPatterns.some(p => p.type === 'sequential')).toBe(true);

    const walkPatterns = detectPatterns('my_qwerty_pass');
    expect(walkPatterns.some(p => p.type === 'keyboard_walk')).toBe(true);

    const commonPatterns = detectPatterns('password');
    expect(commonPatterns.some(p => p.type === 'common_word')).toBe(true);

    const leetPatterns = detectPatterns('p@ssw0rd');
    expect(leetPatterns.some(p => p.type === 'leetspeak')).toBe(true);
  });

  it('accurately evaluates overall password strength and provides actionable suggestions', () => {
    const weakAnalysis = analyzePassword('123456');
    expect(weakAnalysis.strength).toBe('very_weak');
    expect(weakAnalysis.isCommon).toBe(true);
    expect(weakAnalysis.suggestions.length).toBeGreaterThan(0);

    const strongPassphrase = analyzePassword('Cobalt-Falcon-Meadow-Pulsar84');
    expect(strongPassphrase.strength).toBe('excellent');
    expect(strongPassphrase.effectiveEntropyBits).toBeGreaterThan(80);
    expect(strongPassphrase.isCommon).toBe(false);
  });
});

describe('CSPRNG Password & Passphrase Generators', () => {
  it('generates high-entropy random characters of specified length', () => {
    const pwd16 = generateRandomPassword({ length: 16 });
    expect(pwd16.length).toBe(16);

    const pwd24 = generateRandomPassword({ length: 24 });
    expect(pwd24.length).toBe(24);

    const analysis = analyzePassword(pwd24);
    expect(analysis.strength).toBe('excellent');
  });

  it('generates NIST-inspired Diceware passphrases', () => {
    const passphrase = generateDicewarePassphrase({
      wordCount: 4,
      separator: '-',
      capitalize: true,
      includeNumber: true
    });

    const segments = passphrase.split('-');
    expect(segments.length).toBe(4);
    // Capitalized first letters
    expect(segments[0][0]).toBe(segments[0][0].toUpperCase());
    // Last segment contains a 2-digit number suffix
    expect(/\d{2}$/.test(segments[3])).toBe(true);
  });

  it('provides smart suggestions to strengthen weak passwords', () => {
    const alts = suggestStrongerAlternatives('summer2026');
    expect(alts.passphrase).toBeDefined();
    expect(alts.hardenedRandom).toHaveLength(16);
    expect(alts.smartMutation).toContain('#Secure');
  });
});

describe('WebCrypto PBKDF2 Hashing & Database Reuse Prevention', () => {
  it('generates cryptographic salts and deterministic PBKDF2 hashes', async () => {
    const salt = generateSaltHex(16);
    expect(salt).toHaveLength(32); // 16 bytes = 32 hex chars

    const hash1 = await hashPasswordPbkdf2('mySecurePassword123!', salt, 1000);
    const hash2 = await hashPasswordPbkdf2('mySecurePassword123!', salt, 1000);
    expect(hash1).toBe(hash2);

    // Different salt produces completely distinct hash
    const saltB = generateSaltHex(16);
    const hashB = await hashPasswordPbkdf2('mySecurePassword123!', saltB, 1000);
    expect(hash1).not.toBe(hashB);

    expect(timingSafeEqualHex(hash1, hash2)).toBe(true);
    expect(timingSafeEqualHex(hash1, hashB)).toBe(false);
  });

  describe('PasswordHistoryService Database Simulation', () => {
    beforeEach(async () => {
      await PasswordHistoryService.resetDatabase();
    });

    it('blocks password reuse against historical passwords', async () => {
      const user = await PasswordHistoryService.registerUser(
        'crypto_learner',
        'InitialPassword123!'
      );

      // Attempt to immediately reuse initial password
      const reuseAttempt = await PasswordHistoryService.changePassword(
        user.id,
        'InitialPassword123!',
        5
      );
      expect(reuseAttempt.success).toBe(false);
      expect(reuseAttempt.error).toContain('Password reuse detected');

      // Change to a new unique password
      const change1 = await PasswordHistoryService.changePassword(
        user.id,
        'SecondDifferentPassword456#',
        5
      );
      expect(change1.success).toBe(true);

      // Attempt to reuse initial password again (still in last 5 history)
      const reuseAttempt2 = await PasswordHistoryService.changePassword(
        user.id,
        'InitialPassword123!',
        5
      );
      expect(reuseAttempt2.success).toBe(false);
      expect(reuseAttempt2.matchedIndex).toBe(2);

      // Inspect history to confirm zero plaintext is stored
      const history = await PasswordHistoryService.getUserHistory(user.id);
      expect(history.length).toBe(2);
      expect(history[0].saltHex).toBeDefined();
      expect(history[0].hashHex).toBeDefined();
      // Ensure plaintexts are nowhere in the record
      expect((history[0] as unknown as { password?: string }).password).toBeUndefined();
    });
  });
});
