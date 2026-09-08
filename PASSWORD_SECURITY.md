# Password Strength Analyzer & Cryptography Lab

A defensive cybersecurity project built to evaluate password strength, analyze vulnerability patterns, suggest resilient alternatives, and demonstrate fundamental cryptographic concepts such as Shannon entropy, salting, key stretching (PBKDF2), and password reuse prevention.

---

## 🚀 Key Features

### 1. Multi-Metric Password Analysis
- **Length & Complexity:** Quantifies character diversity across lowercase, uppercase, numbers, and special symbols.
- **Shannon Information Entropy ($E = L \times \log_2(R)$):** Evaluates mathematical unpredictability based on character pool size.
- **Vulnerability & Pattern Detection:**
  - Detects repeated consecutive characters (e.g., `aaa`, `1111`).
  - Identifies sequential alphabetical/numerical series (e.g., `123`, `abc`).
  - Detects common keyboard walk patterns (e.g., `qwerty`, `asdfgh`).
  - Matches against the NIST-recommended blacklist of top breached and common passwords.
- **Realistic Crack Time Estimates:** Compares resistance across three realistic threat models:
  - Online throttled web authentication (100 req/sec with CAPTCHA/rate-limiting).
  - Fast un-salted GPU hash cracking (100 billion hashes/sec, e.g., MD5 or NTLM).
  - Slow salted Key Derivation Functions (10,000 hashes/sec, e.g., PBKDF2 with 100k iterations).

### 2. Strong Password Generation
- **NIST SP 800-63B Diceware Passphrases:** Multi-word memorable passphrases combined with numbers and capitalization, offering superior human memorability and high entropy (~60–80+ bits).
- **High-Entropy Random Generation:** Cryptographically secure pseudo-random number generator (CSPRNG via Python `secrets` / Node `crypto`).
- **Targeted Hardening:** Converts weak passwords into resilient forms by replacing predictable patterns and introducing entropy.

### 3. SQLite Database Password Reuse Prevention
- **Cryptographic Salting:** Every password receives a unique 16-byte cryptographically random salt (`secrets.token_bytes(16)`).
- **Key Stretching:** Employs PBKDF2-HMAC-SHA256 with 100,000 iterations to withstand offline attacks.
- **Timing-Attack Resistance:** Employs constant-time comparisons (`hmac.compare_digest`) to prevent side-channel timing leaks.
- **History Policy:** Enforces a configurable history threshold (default: last 5 passwords) to reject reuse of previous credentials.

---

## 📁 Project Structure

| File | Description |
| :--- | :--- |
| `password_analyzer.py` | Standalone Python 3 CLI & module with zero external dependencies. |
| `test_password_analyzer.py` | Unit and integration tests for the Python analyzer and database. |
| `scripts/password_security_cli.mjs` | Standalone Node.js CLI with SQLite database support. |
| `src/utils/passwordSecurity.ts` | TypeScript cryptographic engine & entropy evaluator. |
| `src/services/passwordHistoryDb.ts` | Browser IndexedDB / WebCrypto PBKDF2 service. |
| `src/pages/PasswordSecurityLab.tsx` | Interactive React GUI lab with visual meters and academy. |

---

## 💻 Running the Tool

### Option A: Python Implementation (Standalone CLI)
Ensure Python 3.8+ is installed. Run:

```bash
# 1. Interactive Menu
python password_analyzer.py

# 2. Analyze a specific password
python password_analyzer.py --check "Tr0ub4dor&3"

# 3. Generate strong passphrases and random passwords
python password_analyzer.py --generate

# 4. View Cryptography & Security Academy concepts
python password_analyzer.py --learn

# 5. Run automated end-to-end demo
python password_analyzer.py --demo

# 6. Run Python unit tests
python -m unittest test_password_analyzer.py
```

### Option B: Node.js CLI
```bash
# Run automated demo
node scripts/password_security_cli.mjs --demo

# Or run interactive CLI
npm run security-cli
```

### Option C: Web Interactive Lab
```bash
# Start local dev server
npm run dev
```
Navigate to `http://localhost:5173/security-lab` to use the interactive dashboard.

---

## 🔒 Cryptography Concepts Explained

1. **Length vs. Complexity:**
   - Length scales entropy **linearly**, while character pool size scales **logarithmically**.
   - A 16-character lowercase passphrase ($26^{16} \approx 4.36 \times 10^{22}$) provides far greater resistance against brute-force attacks than an 8-character mixed-set password ($95^8 \approx 6.63 \times 10^{15}$).
2. **The Role of Salt:**
   - Appending a unique cryptographic salt prevents precomputed **Rainbow Table** attacks and ensures two identical passwords generate completely distinct hashes.
3. **Slow Key Derivation (PBKDF2 / Argon2):**
   - General-purpose hash functions (MD5, SHA-1) are designed to be fast for file verification. Modern GPUs compute hundreds of billions of MD5 hashes per second.
   - Key derivation functions intentionally introduce configurable iteration loops (e.g. 100,000+ rounds) to make brute-force attacks computationally prohibitive.
4. **Timing-Safe Comparison:**
   - Standard string comparisons exit on the first mismatching character, leaking timing information that can be measured over a network. Constant-time comparison verifies all bytes unconditionally.
