#!/usr/bin/env python3
"""
Configuration Test Script
Tests that config.py loads correctly and validates environment variables.
Run this before starting the application to verify setup.
"""

import os
import sys

print("=" * 60)
print("Hotel Management System - Configuration Test")
print("=" * 60)
print()

# Test 1: Check if .env file exists
print("Test 1: Checking for .env file...")
if os.path.exists('.env'):
    print("✅ PASS: .env file found")
else:
    print("⚠️  WARNING: .env file not found")
    print("   Create .env from .env.example and configure your credentials")
    print()

# Test 2: Load environment variables
print("\nTest 2: Loading environment variables...")
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("✅ PASS: python-dotenv loaded successfully")
except ImportError:
    print("❌ FAIL: python-dotenv not installed")
    print("   Run: pip install python-dotenv")
    sys.exit(1)

# Test 3: Check required environment variables
print("\nTest 3: Checking required environment variables...")
required_vars = ['DB_USER', 'DB_PASSWORD']
missing_vars = []

for var in required_vars:
    value = os.getenv(var)
    if value:
        print(f"✅ PASS: {var} is set")
    else:
        print(f"❌ FAIL: {var} is not set")
        missing_vars.append(var)

if missing_vars:
    print(f"\n⚠️  Missing variables: {', '.join(missing_vars)}")
    print("   Set these in your .env file")
    print()

# Test 4: Load config.py
print("\nTest 4: Loading config.py...")
try:
    import config
    print("✅ PASS: config.py loaded successfully")
except ValueError as e:
    print(f"❌ FAIL: Configuration validation error")
    print(f"   Error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"❌ FAIL: Could not load config.py")
    print(f"   Error: {e}")
    sys.exit(1)

# Test 5: Verify DB_CONFIG structure
print("\nTest 5: Verifying DB_CONFIG structure...")
try:
    assert hasattr(config, 'DB_CONFIG'), "DB_CONFIG not found"
    assert isinstance(config.DB_CONFIG, dict), "DB_CONFIG is not a dictionary"
    
    required_keys = ['host', 'user', 'password', 'database', 'port']
    for key in required_keys:
        assert key in config.DB_CONFIG, f"Missing key: {key}"
    
    print("✅ PASS: DB_CONFIG has all required keys")
    print(f"   - Host: {config.DB_CONFIG['host']}")
    print(f"   - User: {config.DB_CONFIG['user']}")
    print(f"   - Password: {'*' * len(config.DB_CONFIG['password'])}")
    print(f"   - Database: {config.DB_CONFIG['database']}")
    print(f"   - Port: {config.DB_CONFIG['port']}")
except AssertionError as e:
    print(f"❌ FAIL: {e}")
    sys.exit(1)

# Test 6: Verify application settings
print("\nTest 6: Verifying application settings...")
try:
    assert hasattr(config, 'APP_TITLE'), "APP_TITLE not found"
    assert hasattr(config, 'APP_ICON'), "APP_ICON not found"
    assert hasattr(config, 'PRIMARY_COLOR'), "PRIMARY_COLOR not found"
    assert hasattr(config, 'SECONDARY_COLOR'), "SECONDARY_COLOR not found"
    
    print("✅ PASS: Application settings loaded")
    print(f"   - Title: {config.APP_TITLE}")
    print(f"   - Icon: {config.APP_ICON}")
    print(f"   - Primary Color: {config.PRIMARY_COLOR}")
    print(f"   - Secondary Color: {config.SECONDARY_COLOR}")
except AssertionError as e:
    print(f"❌ FAIL: {e}")
    sys.exit(1)

# Test 7: Test database connection (optional)
print("\nTest 7: Testing database connection...")
print("⏭️  SKIPPED: Run 'python test_db_connection.py' to test MySQL connection")

# Summary
print("\n" + "=" * 60)
print("Configuration Test Summary")
print("=" * 60)
if missing_vars:
    print("❌ FAILED: Some environment variables are missing")
    print(f"   Please set: {', '.join(missing_vars)} in your .env file")
    sys.exit(1)
else:
    print("✅ ALL TESTS PASSED")
    print("   Your configuration is ready!")
    print("   Run 'streamlit run app.py' to start the application")
print("=" * 60)
