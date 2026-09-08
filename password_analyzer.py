#!/usr/bin/env python3
"""
Password Strength Analyzer & Cryptography Lab
=============================================
A comprehensive educational and defensive tool to evaluate password strength,
suggest resilient alternatives, and demonstrate cryptographic security concepts
including Shannon entropy, salt, key stretching (PBKDF2), and password reuse prevention.

Requirements:
    Python 3.8+ (Pure standard library: sqlite3, hashlib, secrets, hmac, re, math)

Features:
    1. Multi-metric password analysis (length, character pool, Shannon entropy).
    2. Pattern detection: repeated chars, sequential series, keyboard walks, common breaches.
    3. Realistic crack time estimation across diverse threat models.
    4. Strong password generators: NIST SP 800-63B Diceware passphrases and CSPRNG random.
    5. SQLite database integration enforcing a history policy to prevent password reuse.
    6. Built-in interactive educational academy explaining fundamental cryptography concepts.
"""

import sys
import os
import re
import math
import hmac
import time
import secrets
import hashlib
import sqlite3
import argparse
from typing import List, Dict, Tuple, Optional

# Path configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DB_PATH = os.path.join(BASE_DIR, "passwords.db")

# Top common or breached passwords sample (NIST blacklist check)
COMMON_PASSWORDS = {
    "123456", "password", "123456789", "12345678", "12345", "111111", "1234567",
    "sunshine", "qwerty", "iloveyou", "princess", "admin", "welcome", "666666",
    "football", "monkey", "charlie", "donald", "master", "dragon", "baseball",
    "superman", "shadow", "trustno1", "secret", "hunter2", "pass123", "letmein",
    "access", "starwars", "killer", "test123", "cookie", "mustang", "michael",
    "jessica", "ashley", "computer", "system", "root", "login", "operator",
    "chelsea", "qwertyuiop", "asdfghjkl", "zxcvbnm", "password1", "p@ssword",
    "p@ssw0rd", "admin123", "admin1234", "default", "guest", "security"
}

# Common keyboard sequential walk patterns
KEYBOARD_WALKS = [
    "qwerty", "wertyu", "ertyui", "rtyuio", "tyuiop",
    "asdfgh", "sdfghj", "dfghjk", "fghjkl",
    "zxcvbn", "xcvbnm",
    "123456", "234567", "345678", "456789", "567890",
    "qazwsx", "wsxedc", "edcrfv", "rfvtgb", "tgbzhn"
]

# NIST-style evocative wordlist for Diceware passphrases
DICEWARE_WORDS = [
    "amber", "anchor", "beacon", "breeze", "bridge", "cactus", "canvas", "canyon",
    "cedar", "cipher", "clover", "cobalt", "comet", "coral", "cosmos", "crater",
    "crystal", "delta", "drift", "ember", "falcon", "fathom", "feather", "forest",
    "fossil", "galaxy", "garnet", "glacier", "granite", "harbor", "haven", "horizon",
    "island", "jaguar", "juniper", "lagoon", "lantern", "meadow", "meteor", "mirage",
    "monarch", "nebula", "nexus", "oasis", "obsidian", "ocean", "orbit", "orchid",
    "pebble", "phoenix", "pinnacle", "planet", "portal", "prairie", "prism", "pulsar",
    "quarry", "quartz", "quiver", "radius", "ravine", "ripple", "river", "rocket",
    "safari", "sequoia", "shadow", "shield", "silver", "solace", "spark", "sphere",
    "summit", "timber", "topaz", "torrent", "tracer", "tundra", "valley", "vector",
    "velvet", "vessel", "vertex", "vortex", "voyage", "whisper", "zenith", "zephyr"
]


# =====================================================================
# 1. CORE PASSWORD ANALYSIS ENGINE
# =====================================================================

def calculate_entropy(length: int, pool_size: int) -> float:
    """
    Calculates raw Shannon entropy in bits:
    E = L * log2(R)
    where L is password length and R is the pool of possible characters.
    """
    if length <= 0 or pool_size <= 0:
        return 0.0
    return round(length * math.log2(pool_size), 1)


def format_time_estimate(seconds: float) -> str:
    """Converts a duration in seconds into a human-readable crack time."""
    if seconds < 0.001:
        return "Instant (< 1 millisecond)"
    elif seconds < 1.0:
        return f"< 1 second ({seconds * 1000:.1f} ms)"
    elif seconds < 60:
        return f"{seconds:.1f} seconds"
    elif seconds < 3600:
        return f"{seconds / 60:.1f} minutes"
    elif seconds < 86400:
        return f"{seconds / 3600:.1f} hours"
    elif seconds < 86400 * 365:
        return f"{seconds / 86400:.1f} days"
    elif seconds < 86400 * 365 * 1000:
        return f"{seconds / (86400 * 365):.1f} years"
    elif seconds < 86400 * 365 * 1_000_000:
        return f"{seconds / (86400 * 365 * 1000):.1f} millennia"
    else:
        return "Centuries+ (> 1 billion years)"


def analyze_password(password: str) -> Dict:
    """
    Performs full evaluation of a password:
    - Length, character counts, and pool size
    - Raw & effective Shannon entropy
    - Vulnerability and pattern detection
    - Strength rating and score
    - Crack time estimations under different threat models
    """
    length = len(password)
    lower_cnt = sum(1 for c in password if c.islower())
    upper_cnt = sum(1 for c in password if c.isupper())
    digit_cnt = sum(1 for c in password if c.isdigit())
    symbol_cnt = sum(1 for c in password if not c.isalnum() and not c.isspace())

    # Calculate character set pool size R
    pool_size = 0
    if lower_cnt > 0:
        pool_size += 26
    if upper_cnt > 0:
        pool_size += 26
    if digit_cnt > 0:
        pool_size += 10
    if symbol_cnt > 0:
        pool_size += 33  # Standard printable ASCII special symbols

    raw_entropy = calculate_entropy(length, pool_size)
    lower_pwd = password.lower()
    patterns = []
    penalty_bits = 0.0

    # 1. Repeated consecutive identical characters (e.g., 'aaa', '1111')
    if re.search(r'(.)\1{2,}', password):
        patterns.append("Contains 3+ consecutive identical characters (e.g. 'aaa')")
        penalty_bits += 10.0

    # 2. Sequential series (e.g., '123', 'abc', 'cba')
    has_sequence = False
    for i in range(len(password) - 2):
        c1, c2, c3 = ord(password[i]), ord(password[i+1]), ord(password[i+2])
        if (c2 == c1 + 1 and c3 == c2 + 1) or (c2 == c1 - 1 and c3 == c2 - 1):
            patterns.append(f"Sequential run detected: '{password[i:i+3]}'")
            penalty_bits += 12.0
            has_sequence = True
            break

    # 3. Keyboard walk detection (e.g., 'qwerty', 'asdfgh')
    for walk in KEYBOARD_WALKS:
        if walk in lower_pwd:
            patterns.append(f"Common keyboard sequence detected: '{walk}'")
            penalty_bits += 15.0
            break

    # 4. NIST Blacklist / Common breached passwords
    is_common = lower_pwd in COMMON_PASSWORDS
    if is_common:
        patterns.append("Exact match found in top common/breached password dictionary")
        penalty_bits += 35.0

    # Calculate effective entropy
    effective_entropy = max(0.0, raw_entropy - penalty_bits)
    if is_common:
        effective_entropy = min(effective_entropy, 10.0)

    # Strength classification
    if effective_entropy >= 80 and length >= 14:
        strength = "EXCELLENT"
        score = 100
    elif effective_entropy >= 60 and length >= 10:
        strength = "STRONG"
        score = 80
    elif effective_entropy >= 45 and length >= 8:
        strength = "FAIR"
        score = 60
    elif effective_entropy >= 28 and length >= 6:
        strength = "WEAK"
        score = 40
    else:
        strength = "VERY WEAK"
        score = max(5, int((effective_entropy / 28.0) * 30))

    # Actionable suggestions
    suggestions = []
    if length < 12:
        suggestions.append(f"Increase password length from {length} to at least 12–16 characters.")
    if lower_cnt == 0:
        suggestions.append("Include lowercase characters (a-z).")
    if upper_cnt == 0:
        suggestions.append("Include uppercase characters (A-Z).")
    if digit_cnt == 0:
        suggestions.append("Include numbers (0-9).")
    if symbol_cnt == 0:
        suggestions.append("Include special symbols (!@#$%^&*).")
    if is_common:
        suggestions.append("Avoid standard dictionary words and widely known breached passwords.")
    if has_sequence:
        suggestions.append("Avoid sequential alphabetical or numeric sequences like '123' or 'abc'.")

    # Threat model crack time estimations
    # Search space ~ 2^(effective_entropy)
    # Average guesses to crack is 2^(effective_entropy - 1)
    if effective_entropy > 0:
        guesses = 2 ** max(0, effective_entropy - 1)
    else:
        guesses = 1

    # Speeds:
    # 1. Online throttled web form (rate limited with CAPTCHA): 100 guesses / second
    # 2. Offline fast unsalted GPU hash crack (e.g. NTLM / MD5): 100 billion guesses / second (1e11)
    # 3. Offline slow salted key derivation (e.g. PBKDF2 with 100k iters): 10,000 guesses / second (1e4)
    crack_times = {
        "online_throttled": format_time_estimate(guesses / 100.0),
        "offline_fast_gpu": format_time_estimate(guesses / 1e11),
        "offline_slow_kdf": format_time_estimate(guesses / 1e4),
    }

    return {
        "password": password,
        "length": length,
        "complexity": {
            "has_lower": lower_cnt > 0,
            "has_upper": upper_cnt > 0,
            "has_digit": digit_cnt > 0,
            "has_symbol": symbol_cnt > 0,
            "lower_count": lower_cnt,
            "upper_count": upper_cnt,
            "digit_count": digit_cnt,
            "symbol_count": symbol_cnt,
            "pool_size": pool_size
        },
        "raw_entropy": raw_entropy,
        "effective_entropy": effective_entropy,
        "strength": strength,
        "score": score,
        "is_common": is_common,
        "patterns": patterns,
        "suggestions": suggestions,
        "crack_times": crack_times
    }


# =====================================================================
# 2. STRONGER PASSWORD ALTERNATIVE GENERATORS
# =====================================================================

def generate_diceware_passphrase(num_words: int = 4, separator: str = "-", capitalize: bool = True) -> str:
    """
    Generates a memorable NIST SP 800-63B multi-word passphrase using CSPRNG.
    """
    words = [secrets.choice(DICEWARE_WORDS) for _ in range(num_words)]
    if capitalize:
        words = [w.capitalize() for w in words]
    # Append a 2-digit number for extra entropy
    suffix = str(secrets.randbelow(90) + 10)
    words[-1] = f"{words[-1]}{suffix}"
    return separator.join(words)


def generate_random_password(length: int = 16) -> str:
    """
    Generates a cryptographically strong random password using secrets (CSPRNG).
    Guarantees at least one lowercase, uppercase, digit, and symbol.
    """
    lowers = "abcdefghjkmnpqrstuvwxyz"  # Excludes ambiguous l, i, o
    uppers = "ABCDEFGHJKLMNPQRSTUVWXYZ"  # Excludes ambiguous I, O
    digits = "23456789"                  # Excludes ambiguous 0, 1
    symbols = "!@#$%^&*()-_=+"

    all_chars = lowers + uppers + digits + symbols

    # Guarantee presence of each class
    pwd = [
        secrets.choice(lowers),
        secrets.choice(uppers),
        secrets.choice(digits),
        secrets.choice(symbols)
    ]

    # Fill the remainder
    pwd += [secrets.choice(all_chars) for _ in range(length - 4)]

    # Cryptographically shuffle the array (Fisher-Yates shuffle with CSPRNG)
    for i in range(len(pwd) - 1, 0, -1):
        j = secrets.randbelow(i + 1)
        pwd[i], pwd[j] = pwd[j], pwd[i]

    return "".join(pwd)


def suggest_alternatives(base_password: str = "") -> Dict[str, str]:
    """Generates strong alternatives for the user."""
    passphrase = generate_diceware_passphrase(num_words=4, separator="-")
    random_pwd = generate_random_password(length=16)

    # Smart hardened alternative derived from base input
    clean_base = re.sub(r'[^a-zA-Z0-9]', '', base_password) or "Secure"
    clean_base = clean_base.capitalize()[:8]
    sym = secrets.choice("!@#$%&*")
    num = str(secrets.randbelow(900) + 100)
    hardened = f"{clean_base}{sym}{num}#Shield"

    return {
        "passphrase": passphrase,
        "random_password": random_pwd,
        "hardened": hardened
    }


# =====================================================================
# 3. DATABASE INTEGRATION & PASSWORD REUSE PREVENTION (SQLite)
# =====================================================================

class PasswordSecurityDB:
    """
    SQLite-backed authentication and password history manager.
    
    Security Best Practices Demonstrated:
    - Passwords are NEVER stored in plaintext.
    - Uses per-password random 16-byte cryptographic salt (secrets.token_bytes).
    - Uses PBKDF2-HMAC-SHA256 with 100,000 iterations to resist GPU attacks.
    - Uses hmac.compare_digest for constant-time comparison (prevents timing attacks).
    - Tracks historical hashes to forbid reusing the last N passwords.
    """

    def __init__(self, db_path: str = DEFAULT_DB_PATH, history_limit: int = 5, iterations: int = 100000):
        self.db_path = db_path
        self.history_limit = history_limit
        self.iterations = iterations
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    username TEXT UNIQUE NOT NULL,
                    created_at TEXT NOT NULL
                );
            """)
            conn.execute("""
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
            """)
            conn.commit()

    def hash_password(self, password: str, salt_bytes: bytes) -> str:
        """Derives a PBKDF2-HMAC-SHA256 hex digest."""
        key = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt_bytes,
            self.iterations,
            dklen=32
        )
        return key.hex()

    def get_or_create_user(self, username: str) -> Dict:
        with self._get_connection() as conn:
            row = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
            if row:
                return dict(row)
            
            user_id = f"usr_{secrets.token_hex(4)}"
            created_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            conn.execute(
                "INSERT INTO users (id, username, created_at) VALUES (?, ?, ?)",
                (user_id, username, created_at)
            )
            conn.commit()
            return {"id": user_id, "username": username, "created_at": created_at}

    def check_password_reuse(self, user_id: str, candidate_password: str) -> Tuple[bool, Optional[Dict]]:
        """
        Checks whether the candidate password matches any of the user's previous passwords.
        Returns: (can_reuse: bool, match_info: Optional[Dict])
        """
        with self._get_connection() as conn:
            history = conn.execute(
                "SELECT * FROM password_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
                (user_id, self.history_limit)
            ).fetchall()

            for idx, row in enumerate(history):
                salt_bytes = bytes.fromhex(row["salt_hex"])
                # Note: Uses stored iterations count for that specific hash
                stored_iters = row["iterations"]
                key = hashlib.pbkdf2_hmac(
                    'sha256',
                    candidate_password.encode('utf-8'),
                    salt_bytes,
                    stored_iters,
                    dklen=32
                )
                candidate_hash = key.hex()
                
                # Constant-time comparison to prevent side-channel timing attacks
                if hmac.compare_digest(candidate_hash, row["hash_hex"]):
                    return False, {
                        "position": idx + 1,
                        "created_at": row["created_at"],
                        "algorithm": row["algorithm"]
                    }

        return True, None

    def set_new_password(self, username: str, new_password: str) -> Dict:
        """
        Validates password reuse policy, then cryptographically salts, hashes,
        and records the new password in SQLite.
        """
        user = self.get_or_create_user(username)
        can_reuse, match_info = self.check_password_reuse(user["id"], new_password)

        if not can_reuse:
            return {
                "success": False,
                "error": (
                    f"Password matches previous password #{match_info['position']} "
                    f"(used on {match_info['created_at']}). "
                    f"Security policy forbids reusing your last {self.history_limit} passwords."
                ),
                "user": user
            }

        # Generate fresh cryptographically random 16-byte salt
        salt_bytes = secrets.token_bytes(16)
        salt_hex = salt_bytes.hex()
        hash_hex = self.hash_password(new_password, salt_bytes)

        pwd_id = f"pwd_{secrets.token_hex(4)}"
        created_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

        with self._get_connection() as conn:
            conn.execute("""
                INSERT INTO password_history (id, user_id, salt_hex, hash_hex, algorithm, iterations, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (pwd_id, user["id"], salt_hex, hash_hex, "PBKDF2-HMAC-SHA256", self.iterations, created_at))
            conn.commit()

        return {
            "success": True,
            "user": user,
            "salt_hex": salt_hex,
            "hash_hex": hash_hex,
            "iterations": self.iterations,
            "created_at": created_at
        }

    def verify_password(self, username: str, password: str) -> bool:
        """Verifies if the password matches the user's latest active password."""
        with self._get_connection() as conn:
            user = conn.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()
            if not user:
                return False

            latest = conn.execute(
                "SELECT * FROM password_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
                (user["id"],)
            ).fetchone()

            if not latest:
                return False

            salt_bytes = bytes.fromhex(latest["salt_hex"])
            stored_iters = latest["iterations"]
            key = hashlib.pbkdf2_hmac(
                'sha256',
                password.encode('utf-8'),
                salt_bytes,
                stored_iters,
                dklen=32
            )
            candidate_hash = key.hex()
            return hmac.compare_digest(candidate_hash, latest["hash_hex"])

    def get_history(self, username: str) -> List[Dict]:
        with self._get_connection() as conn:
            user = conn.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()
            if not user:
                return []
            rows = conn.execute(
                "SELECT id, salt_hex, hash_hex, algorithm, iterations, created_at FROM password_history WHERE user_id = ? ORDER BY created_at DESC",
                (user["id"],)
            ).fetchall()
            return [dict(r) for r in rows]


# =====================================================================
# 4. CRYPTOGRAPHY ACADEMY & EDUCATIONAL BRIEFINGS
# =====================================================================

def display_educational_academy():
    """Prints an in-depth educational walkthrough of core security & crypto concepts."""
    content = """
===============================================================================
                PASSWORD SECURITY & CRYPTOGRAPHY ACADEMY
===============================================================================

[1] SHANNON INFORMATION ENTROPY (E = L * log2(R))
-------------------------------------------------------------------------------
* Information entropy measures the fundamental unpredictability of a secret.
  - L = Length of the password
  - R = Size of the character pool (lowercase: 26, alphanumeric: 62, ASCII printable: 95)
* Key Takeaway: Length scales entropy linearly, but pool size scales logarithmically!
  - A 16-character lowercase password (26^16 = 4.36e22) has MORE entropy than an
    8-character password with letters, digits, and symbols (95^8 = 6.63e15).
  - Multi-word passphrases (Diceware) offer superior memory retention and huge entropy!

[2] THE CRITICAL ROLE OF CRYPTOGRAPHIC SALTING
-------------------------------------------------------------------------------
* Problem: If two users choose the same password 'iloveyou', their hashes in plain
  hashing (like raw MD5 or SHA256) would be identical.
* Attack: Attackers precompute trillions of hashes into "Rainbow Tables" to reverse
  passwords instantly in O(1) lookup time.
* Solution (Salting):
  - Every user gets a unique, cryptographically random salt (e.g. 16 bytes).
  - The hash stored is Hash(Password + Salt).
  - Result: Rainbow tables become useless because an attacker must build a bespoke
    table for every individual salt.

[3] SLOW HASHING & KEY STRETCHING (PBKDF2, Argon2, bcrypt)
-------------------------------------------------------------------------------
* Fast hashes (MD5, SHA-1, SHA-256) were designed to be FAST for file checksums
  and digital signatures. Modern GPUs compute over 100 BILLION MD5 hashes/sec!
* Key Stretching functions (PBKDF2, scrypt, Argon2id) introduce an intentional
  computational work factor (e.g., 100,000 to 600,000 iterations).
* Slowing down a verification to 50 milliseconds is unnoticeable to a human logging in,
  but cripples an offline brute-force attacker down from 100 billion/s to 10,000/s.

[4] TIMING-SAFE EQUALITY COMPARISON (hmac.compare_digest)
-------------------------------------------------------------------------------
* Standard string comparison ('==') terminates at the FIRST mismatching character:
  - If the 1st byte is wrong: fails in 1 nanosecond.
  - If the first 10 bytes match: fails in 10 nanoseconds.
* Side-Channel Vulnerability: Remote attackers measuring network microsecond jitter
  can reconstruct secrets byte by byte.
* Solution: Constant-time comparison checks every byte unconditionally, eliminating
  timing leakage.

[5] PASSWORD REUSE PREVENTION
-------------------------------------------------------------------------------
* Users frequently recycle modified variants of old passwords (e.g., 'Spring2025' -> 'Spring2026').
* Secure systems retain a cryptographic history of the last N hashes and re-verify
  candidate passwords against past salts without ever needing the original plaintext.
===============================================================================
"""
    print(content)


# =====================================================================
# 5. CLI PRESENTATION & DEMONSTRATION RUNNER
# =====================================================================

def print_analysis_card(analysis: Dict):
    """Renders a formatted terminal report for a password analysis."""
    p = analysis["password"]
    masked = p[0] + ("*" * (len(p) - 2)) + p[-1] if len(p) > 2 else "***"
    comp = analysis["complexity"]

    print(f"\n+----------------------------------------------------------------------+")
    print(f"| PASSWORD ANALYSIS REPORT                                             |")
    print(f"+----------------------------------------------------------------------+")
    print(f"  Target:            \"{masked}\" (Length: {analysis['length']} characters)")
    print(f"  Strength Rating:   [{analysis['strength']}] (Score: {analysis['score']}/100)")
    print(f"  Raw Entropy:       {analysis['raw_entropy']} bits")
    print(f"  Effective Entropy: {analysis['effective_entropy']} bits (after vulnerability penalties)")
    print(f"  Character Pool:    {comp['pool_size']} possible glyphs")
    print(f"  Diversity Check:   Lower: {comp['lower_count']} | Upper: {comp['upper_count']} | Digits: {comp['digit_count']} | Symbols: {comp['symbol_count']}")
    
    if analysis["patterns"]:
        print(f"\n  [!] Detected Vulnerabilities & Predictable Patterns:")
        for pat in analysis["patterns"]:
            print(f"      - {pat}")
    else:
        print(f"\n  [+] Pattern Detection: No predictable keyboard walks or common breaches detected.")

    print(f"\n  Estimated Crack Times Across Threat Models:")
    print(f"      - Online Throttled (100 req/s, CAPTCHA):     {analysis['crack_times']['online_throttled']}")
    print(f"      - Fast Unsalted GPU Hash (100B hashes/s):   {analysis['crack_times']['offline_fast_gpu']}")
    print(f"      - Salted PBKDF2/Argon2 (10k iters/s):       {analysis['crack_times']['offline_slow_kdf']}")

    if analysis["suggestions"]:
        print(f"\n  Improvement Recommendations:")
        for sug in analysis["suggestions"]:
            print(f"      * {sug}")

    print(f"+----------------------------------------------------------------------+\n")


def run_automated_demo():
    """Demonstrates all features end-to-end for tests, CI, and learning."""
    print("=======================================================================")
    print("       PASSWORD STRENGTH ANALYZER & CRYPTOGRAPHY LAB DEMO")
    print("=======================================================================")

    test_passwords = [
        "123456",
        "qwerty89",
        "Summer2026!",
        "Tr0ub4dor&3",
        "Beacon-Glacier-Meadow-Zephyr82"
    ]

    print("\n[PHASE 1] EVALUATING PASSWORDS OF DIVERSE STRENGTHS:\n")
    for pwd in test_passwords:
        analysis = analyze_password(pwd)
        print(f"Password: {pwd:32} -> Rating: [{analysis['strength']:9}] | Eff Entropy: {analysis['effective_entropy']:5.1f} bits | GPU Crack: {analysis['crack_times']['offline_fast_gpu']}")

    print("\n-----------------------------------------------------------------------")
    print("[PHASE 2] GENERATING STRONG ALTERNATIVES (Diceware & CSPRNG):")
    alts = suggest_alternatives("Summer2026!")
    print(f"  * NIST Diceware Passphrase: {alts['passphrase']}")
    print(f"  * CSPRNG High-Entropy:      {alts['random_password']}")
    print(f"  * Hardened Transformation:  {alts['hardened']}")

    print("\n-----------------------------------------------------------------------")
    print("[PHASE 3] TESTING SQLITE PASSWORD REUSE PREVENTION (PBKDF2-HMAC-SHA256):")
    demo_db_path = os.path.join(BASE_DIR, "demo_passwords.db")
    if os.path.exists(demo_db_path):
        try:
            os.remove(demo_db_path)
        except OSError:
            pass

    db = PasswordSecurityDB(db_path=demo_db_path, history_limit=3, iterations=50000)
    username = "alice_student"

    print(f"  User: '{username}' registering initial password 'Spring2026#Alpha'...")
    res1 = db.set_new_password(username, "Spring2026#Alpha")
    print(f"  ✓ Registered successfully! Salt: {res1['salt_hex'][:16]}... Hash: {res1['hash_hex'][:20]}...")

    print(f"  Changing password to 'Autumn2026$Beta'...")
    res2 = db.set_new_password(username, "Autumn2026$Beta")
    print(f"  ✓ Updated successfully!")

    print(f"  Attempting to REUSE previous password 'Spring2026#Alpha'...")
    res3 = db.set_new_password(username, "Spring2026#Alpha")
    if not res3["success"]:
        print(f"  🛡️ REJECTION BLOCKED BY POLICY:")
        print(f"     {res3['error']}")
    else:
        print("  Error: Reuse check failed to trigger!")

    print(f"\n  Authenticating user with correct password 'Autumn2026$Beta':")
    valid = db.verify_password(username, "Autumn2026$Beta")
    print(f"  ✓ Login authenticated: {valid}")

    # Clean up demo db
    try:
        os.remove(demo_db_path)
    except OSError:
        pass

    print("\n=======================================================================")
    print("  All demonstration tests completed successfully!")
    print("=======================================================================")


def interactive_menu():
    """Interactive command-line interface for exploratory use."""
    db = PasswordSecurityDB()

    while True:
        print("\n===================================================================")
        print("     PASSWORD STRENGTH ANALYZER & CRYPTOGRAPHY LAB")
        print("===================================================================")
        print("  [1] Analyze a password's strength, entropy, and crack time")
        print("  [2] Generate strong passwords (NIST Diceware passphrase or CSPRNG)")
        print("  [3] Test SQLite database password reuse prevention (PBKDF2 + Salt)")
        print("  [4] Password Security & Cryptography Academy (Concepts Explained)")
        print("  [5] Run automated demonstration suite")
        print("  [6] Exit")
        print("===================================================================")

        try:
            choice = input("Select an option (1-6): ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nExiting.")
            break

        if choice == "1":
            pwd = input("\nEnter password to analyze: ").strip()
            if not pwd:
                print("No password entered.")
                continue
            analysis = analyze_password(pwd)
            print_analysis_card(analysis)
            alts = suggest_alternatives(pwd)
            print("  Suggested Strong Alternatives:")
            print(f"    - Diceware Passphrase: {alts['passphrase']}")
            print(f"    - High-Entropy Random: {alts['random_password']}")
            print(f"    - Hardened Variant:    {alts['hardened']}")

        elif choice == "2":
            print("\n  Generator Options:")
            print(f"  1. Diceware Passphrase (NIST SP 800-63B): {generate_diceware_passphrase()}")
            print(f"  2. CSPRNG Random (16 characters):        {generate_random_password(16)}")
            print(f"  3. CSPRNG Ultra-Secure (24 characters):  {generate_random_password(24)}")

        elif choice == "3":
            print("\n  --- Database-Backed Password Manager ---")
            uname = input("Enter username: ").strip()
            if not uname:
                continue
            new_pwd = input("Enter new password to set: ").strip()
            if not new_pwd:
                continue

            result = db.set_new_password(uname, new_pwd)
            if result["success"]:
                print(f"\n  ✓ Success! Password cryptographically hashed and saved.")
                print(f"    Salt (16 bytes hex): {result['salt_hex']}")
                print(f"    PBKDF2-HMAC-SHA256:  {result['hash_hex']}")
                print(f"    Iterations:          {result['iterations']:,}")
            else:
                print(f"\n  🛡️ POLICY REJECTION:")
                print(f"    {result['error']}")

        elif choice == "4":
            display_educational_academy()

        elif choice == "5":
            run_automated_demo()

        elif choice == "6":
            print("Goodbye!")
            break
        else:
            print("Invalid selection. Please choose 1 to 6.")


# =====================================================================
# 6. ENTRY POINT & PARSER
# =====================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Password Strength Analyzer and Cryptography Lab"
    )
    parser.add_argument(
        "--check", "-c", type=str, help="Analyze a specific password and display report"
    )
    parser.add_argument(
        "--generate", "-g", action="store_true", help="Generate strong Diceware and CSPRNG passwords"
    )
    parser.add_argument(
        "--demo", "-d", action="store_true", help="Run automated demonstration of all capabilities"
    )
    parser.add_argument(
        "--learn", "-l", action="store_true", help="Display educational password security concepts"
    )
    parser.add_argument(
        "--db-user", type=str, help="Username to test with SQLite reuse prevention"
    )
    parser.add_argument(
        "--db-password", type=str, help="Password to set for the user with reuse prevention"
    )

    args = parser.parse_args()

    if args.check:
        analysis = analyze_password(args.check)
        print_analysis_card(analysis)
        alts = suggest_alternatives(args.check)
        print("  Suggested Strong Alternatives:")
        print(f"    - Diceware Passphrase: {alts['passphrase']}")
        print(f"    - High-Entropy Random: {alts['random_password']}")
        print(f"    - Hardened Variant:    {alts['hardened']}\n")
    elif args.generate:
        print("\n--- Strong Password Alternatives ---")
        print(f"1. NIST Diceware Passphrase: {generate_diceware_passphrase()}")
        print(f"2. CSPRNG 16-Char Random:    {generate_random_password(16)}")
        print(f"3. CSPRNG 24-Char Random:    {generate_random_password(24)}\n")
    elif args.demo:
        run_automated_demo()
    elif args.learn:
        display_educational_academy()
    elif args.db_user and args.db_password:
        db = PasswordSecurityDB()
        res = db.set_new_password(args.db_user, args.db_password)
        if res["success"]:
            print(f"Success: Password saved. Salt: {res['salt_hex'][:16]}... Hash: {res['hash_hex'][:20]}...")
        else:
            print(f"Rejected: {res['error']}")
    else:
        interactive_menu()


if __name__ == "__main__":
    main()
