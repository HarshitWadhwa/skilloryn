/**
 * Password History & Cryptographic Storage Service
 * 
 * Demonstrates:
 * 1. Zero plaintext storage: only cryptographic salt + PBKDF2 hash are stored.
 * 2. Real-time verification against historical records.
 * 3. Prevention of password reuse (e.g. Last N passwords rule).
 * 4. Persistent browser storage with fallback for test environments.
 */

import {
  generateSaltHex,
  hashPasswordPbkdf2,
  timingSafeEqualHex
} from '../utils/passwordSecurity';

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface PasswordHistoryRecord {
  id: string;
  userId: string;
  saltHex: string;
  hashHex: string;
  algorithm: string;
  iterations: number;
  createdAt: string;
}

const STORAGE_USERS_KEY = 'skilloryn_sec_users_v1';
const STORAGE_HISTORY_KEY = 'skilloryn_sec_history_v1';

// In-memory fallback if neither IndexedDB nor localStorage is available
let memoryUsers: UserRecord[] = [];
let memoryHistory: PasswordHistoryRecord[] = [];

function isLocalStorageAvailable(): boolean {
  try {
    const test = '__sec_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

function loadUsersFromStorage(): UserRecord[] {
  if (isLocalStorageAvailable()) {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  }
  return memoryUsers;
}

function saveUsersToStorage(users: UserRecord[]): void {
  if (isLocalStorageAvailable()) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  }
  memoryUsers = users;
}

function loadHistoryFromStorage(): PasswordHistoryRecord[] {
  if (isLocalStorageAvailable()) {
    const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  }
  return memoryHistory;
}

function saveHistoryToStorage(history: PasswordHistoryRecord[]): void {
  if (isLocalStorageAvailable()) {
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(history));
  }
  memoryHistory = history;
}

export class PasswordHistoryService {
  /**
   * Retrieves all registered simulation users
   */
  static async getUsers(): Promise<UserRecord[]> {
    const users = loadUsersFromStorage();
    if (users.length === 0) {
      await this.seedDefaultData();
      return loadUsersFromStorage();
    }
    return users;
  }

  /**
   * Retrieves the cryptographic history records for a given user (newest first)
   */
  static async getUserHistory(userId: string): Promise<PasswordHistoryRecord[]> {
    const allHistory = loadHistoryFromStorage();
    return allHistory
      .filter(h => h.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Registers a new user with an initial password (stored securely as salted PBKDF2 hash)
   */
  static async registerUser(username: string, initialPassword: string): Promise<UserRecord> {
    const users = loadUsersFromStorage();
    const existing = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existing) {
      throw new Error(`User "${username}" already exists.`);
    }

    const userId = 'usr_' + Math.random().toString(36).substring(2, 9);
    const newUser: UserRecord = {
      id: userId,
      username,
      email: `${username.toLowerCase()}@skilloryn.io`,
      createdAt: new Date().toISOString()
    };

    // Generate cryptographic salt and hash
    const saltHex = generateSaltHex(16);
    const iterations = 100000;
    const hashHex = await hashPasswordPbkdf2(initialPassword, saltHex, iterations);

    const historyRecord: PasswordHistoryRecord = {
      id: 'pwd_' + Math.random().toString(36).substring(2, 9),
      userId,
      saltHex,
      hashHex,
      algorithm: 'PBKDF2-HMAC-SHA256',
      iterations,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsersToStorage(users);

    const history = loadHistoryFromStorage();
    history.push(historyRecord);
    saveHistoryToStorage(history);

    return newUser;
  }

  /**
   * Checks if candidate password matches any of the user's last N passwords
   * Returns whether it can be reused, and which historical entry matched if blocked.
   */
  static async checkPasswordReuse(
    userId: string,
    candidatePassword: string,
    historyDepth = 5
  ): Promise<{
    canReuse: boolean;
    matchedIndex?: number;
    matchedDate?: string;
    checkedRecordsCount: number;
  }> {
    const history = await this.getUserHistory(userId);
    const recordsToCheck = history.slice(0, historyDepth);

    for (let i = 0; i < recordsToCheck.length; i++) {
      const record = recordsToCheck[i];
      // Recompute candidate hash using the historical salt and iteration count
      const candidateHash = await hashPasswordPbkdf2(
        candidatePassword,
        record.saltHex,
        record.iterations
      );

      // Timing-safe comparison against stored hash
      if (timingSafeEqualHex(candidateHash, record.hashHex)) {
        return {
          canReuse: false,
          matchedIndex: i + 1, // 1-indexed (e.g. 1st most recent, 2nd, etc.)
          matchedDate: record.createdAt,
          checkedRecordsCount: recordsToCheck.length
        };
      }
    }

    return {
      canReuse: true,
      checkedRecordsCount: recordsToCheck.length
    };
  }

  /**
   * Changes the password for a user after enforcing reuse policy
   */
  static async changePassword(
    userId: string,
    newPassword: string,
    historyDepth = 5
  ): Promise<{
    success: boolean;
    error?: string;
    matchedIndex?: number;
    newRecord?: PasswordHistoryRecord;
  }> {
    const reuseCheck = await this.checkPasswordReuse(userId, newPassword, historyDepth);

    if (!reuseCheck.canReuse) {
      const positionText = reuseCheck.matchedIndex === 1
        ? 'your current password'
        : `password #${reuseCheck.matchedIndex} from your recent history`;
      return {
        success: false,
        error: `Password reuse detected! This password matches ${positionText}. Our security policy forbids reusing the last ${historyDepth} passwords.`,
        matchedIndex: reuseCheck.matchedIndex
      };
    }

    // Generate fresh salt and slow KDF hash
    const saltHex = generateSaltHex(16);
    const iterations = 100000;
    const hashHex = await hashPasswordPbkdf2(newPassword, saltHex, iterations);

    const newRecord: PasswordHistoryRecord = {
      id: 'pwd_' + Math.random().toString(36).substring(2, 9),
      userId,
      saltHex,
      hashHex,
      algorithm: 'PBKDF2-HMAC-SHA256',
      iterations,
      createdAt: new Date().toISOString()
    };

    const history = loadHistoryFromStorage();
    history.push(newRecord);
    saveHistoryToStorage(history);

    return {
      success: true,
      newRecord
    };
  }

  /**
   * Resets all history and user records to clean state
   */
  static async resetDatabase(): Promise<void> {
    saveUsersToStorage([]);
    saveHistoryToStorage([]);
    await this.seedDefaultData();
  }

  /**
   * Seeds demo users and realistic historical password entries
   */
  static async seedDefaultData(): Promise<void> {
    const demoUser: UserRecord = {
      id: 'usr_demo_alice',
      username: 'alice_security',
      email: 'alice@skilloryn.io',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString()
    };

    saveUsersToStorage([demoUser]);

    // Pre-populate Alice with 3 historical passwords so reuse prevention can be tested immediately:
    // Passwords: "Summer2025!Shield", "Winter2025#Orbit", "Spring2026@Nebula"
    const passwords = [
      { pwd: 'Summer2025!Shield', daysAgo: 60 },
      { pwd: 'Winter2025#Orbit', daysAgo: 30 },
      { pwd: 'Spring2026@Nebula', daysAgo: 5 }
    ];

    const records: PasswordHistoryRecord[] = [];
    for (const item of passwords) {
      const saltHex = generateSaltHex(16);
      const hashHex = await hashPasswordPbkdf2(item.pwd, saltHex, 100000);
      records.push({
        id: 'pwd_' + Math.random().toString(36).substring(2, 9),
        userId: demoUser.id,
        saltHex,
        hashHex,
        algorithm: 'PBKDF2-HMAC-SHA256',
        iterations: 100000,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * item.daysAgo).toISOString()
      });
    }

    saveHistoryToStorage(records);
  }
}
