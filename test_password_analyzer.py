#!/usr/bin/env python3
"""
Unit and Integration Tests for Password Strength Analyzer
=========================================================
Tests entropy calculations, vulnerability/pattern detection,
CSPRNG generators, and SQLite password reuse prevention with PBKDF2 salting.
"""

import unittest
import os
import shutil
import tempfile

from password_analyzer import (
    calculate_entropy,
    analyze_password,
    generate_diceware_passphrase,
    generate_random_password,
    suggest_alternatives,
    PasswordSecurityDB,
    COMMON_PASSWORDS
)


class TestPasswordStrengthAnalyzer(unittest.TestCase):

    def test_calculate_entropy(self):
        # Empty password
        self.assertEqual(calculate_entropy(0, 95), 0.0)
        # 10 chars from 10 digits: 10 * log2(10) ≈ 33.2 bits
        self.assertAlmostEqual(calculate_entropy(10, 10), 33.2, places=1)
        # 8 chars from 95 ascii: 8 * log2(95) ≈ 52.5 bits
        self.assertAlmostEqual(calculate_entropy(8, 95), 52.5, places=1)

    def test_common_breached_password_detection(self):
        res = analyze_password("password")
        self.assertTrue(res["is_common"])
        self.assertEqual(res["strength"], "VERY WEAK")
        self.assertTrue(any("common/breached" in p for p in res["patterns"]))

    def test_keyboard_walk_detection(self):
        res = analyze_password("MyQwertyPass")
        self.assertTrue(any("keyboard sequence" in p.lower() for p in res["patterns"]))

    def test_sequential_run_detection(self):
        res = analyze_password("Safe123Word")
        self.assertTrue(any("sequential run" in p.lower() for p in res["patterns"]))

    def test_repetition_detection(self):
        res = analyze_password("Abcdddd12!")
        self.assertTrue(any("consecutive identical" in p.lower() for p in res["patterns"]))

    def test_high_strength_password(self):
        res = analyze_password("Kx#92mP$qL8*vN2!")
        self.assertIn(res["strength"], ["STRONG", "EXCELLENT"])
        self.assertGreaterEqual(res["effective_entropy"], 60.0)
        self.assertEqual(len(res["patterns"]), 0)

    def test_passphrase_generator(self):
        phrase = generate_diceware_passphrase(num_words=4, separator="-")
        parts = phrase.split("-")
        self.assertEqual(len(parts), 4)
        # Check that suffix number exists
        self.assertTrue(any(c.isdigit() for c in parts[-1]))

    def test_random_password_generator(self):
        pwd = generate_random_password(length=20)
        self.assertEqual(len(pwd), 20)
        # Must contain lower, upper, digit, symbol
        self.assertTrue(any(c.islower() for c in pwd))
        self.assertTrue(any(c.isupper() for c in pwd))
        self.assertTrue(any(c.isdigit() for c in pwd))
        self.assertTrue(any(not c.isalnum() for c in pwd))


class TestPasswordSecurityDB(unittest.TestCase):

    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.db_path = os.path.join(self.temp_dir, "test_passwords.db")
        self.db = PasswordSecurityDB(db_path=self.db_path, history_limit=3, iterations=20000)

    def tearDown(self):
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_user_registration_and_authentication(self):
        username = "test_user_1"
        res = self.db.set_new_password(username, "InitialSecret123#")
        self.assertTrue(res["success"])
        self.assertTrue(len(res["salt_hex"]) >= 32)
        self.assertTrue(len(res["hash_hex"]) == 64)

        # Verify correct password
        self.assertTrue(self.db.verify_password(username, "InitialSecret123#"))
        # Verify wrong password
        self.assertFalse(self.db.verify_password(username, "WrongPassword999!"))

    def test_password_reuse_prevention(self):
        username = "test_user_reuse"
        # 1st password
        res1 = self.db.set_new_password(username, "PassOne#123")
        self.assertTrue(res1["success"])

        # 2nd password
        res2 = self.db.set_new_password(username, "PassTwo#456")
        self.assertTrue(res2["success"])

        # Try to reuse 1st password -> should fail
        res_reuse = self.db.set_new_password(username, "PassOne#123")
        self.assertFalse(res_reuse["success"])
        self.assertIn("matches previous password", res_reuse["error"])

        # 3rd password
        res3 = self.db.set_new_password(username, "PassThree#789")
        self.assertTrue(res3["success"])

        # 4th password (pushes 1st out of history limit 3)
        res4 = self.db.set_new_password(username, "PassFour#000")
        self.assertTrue(res4["success"])

        # Now 1st password can be reused because history_limit is 3
        res_reuse_old = self.db.set_new_password(username, "PassOne#123")
        self.assertTrue(res_reuse_old["success"])


if __name__ == "__main__":
    unittest.main()
