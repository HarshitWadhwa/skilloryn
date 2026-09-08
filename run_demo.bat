@echo off
title Password Strength Analyzer & Cryptography Lab
echo ===============================================================
echo   Starting Password Strength Analyzer & Cryptography Lab
echo ===============================================================
python password_analyzer.py
if errorlevel 1 (
    echo.
    echo Python command failed or Python is not installed.
    echo Trying Node.js CLI fallback...
    node scripts/password_security_cli.mjs --demo
)
pause
