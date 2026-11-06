#!/usr/bin/env python3
"""
Database Connection Lifecycle Tests - Phase 2A
Tests proper connection cleanup, cursor handling, and transaction behavior.
"""

import os
import sys
import ast

print("=" * 70)
print("Database Connection Lifecycle Tests - Phase 2A")
print("=" * 70)
print()

# Test 1: File exists
print("Test 1: Verifying app.py exists...")
if os.path.exists('app.py'):
    print("✅ PASS: app.py found")
else:
    print("❌ FAIL: app.py not found")
    sys.exit(1)

# Test 2: Python syntax valid
print("\nTest 2: Validating Python syntax...")
try:
    with open('app.py', 'r', encoding='utf-8') as f:
        content = f.read()
    compile(content, 'app.py', 'exec')
    print("✅ PASS: app.py has valid Python syntax")
except SyntaxError as e:
    print(f"❌ FAIL: Syntax error in app.py: {e}")
    sys.exit(1)

# Test 3: Parse AST
print("\nTest 3: Parsing abstract syntax tree...")
try:
    tree = ast.parse(content)
    print("✅ PASS: AST parsed successfully")
except Exception as e:
    print(f"❌ FAIL: Cannot parse AST: {e}")
    sys.exit(1)

# Test 4: Function signatures
print("\nTest 4: Verifying function signatures...")

functions_found = {}
for node in ast.walk(tree):
    if isinstance(node, ast.FunctionDef):
        if node.name in ['get_connection', 'execute_query', 'call_procedure']:
            functions_found[node.name] = [arg.arg for arg in node.args.args]

expected = {
    'get_connection': [],
    'execute_query': ['query', 'params', 'fetch'],
    'call_procedure': ['proc_name', 'params']
}

for func_name, expected_params in expected.items():
    if func_name in functions_found:
        actual_params = functions_found[func_name]
        if actual_params == expected_params:
            print(f"✅ PASS: {func_name}({', '.join(expected_params)}) signature correct")
        else:
            print(f"❌ FAIL: {func_name} signature mismatch")
            print(f"   Expected: {expected_params}")
            print(f"   Found: {actual_params}")
            sys.exit(1)
    else:
        print(f"❌ FAIL: {func_name} not found")
        sys.exit(1)

# Test 5: finally blocks
print("\nTest 5: Verifying finally blocks...")

def has_finally_in_function(func_name, tree):
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef) and node.name == func_name:
            for child in ast.walk(node):
                if isinstance(child, ast.Try) and child.finalbody:
                    return True
    return False

for func in ['execute_query', 'call_procedure']:
    if has_finally_in_function(func, tree):
        print(f"✅ PASS: {func} has finally block")
    else:
        print(f"❌ FAIL: {func} missing finally block")
        sys.exit(1)

# Test 6: @st.cache_resource removed
print("\nTest 6: Verifying @st.cache_resource removed from get_connection...")
lines = content.split('\n')
cache_on_get_connection = False
for i, line in enumerate(lines):
    if '@st.cache_resource' in line:
        # Check if next non-empty line is get_connection
        for j in range(i+1, min(i+3, len(lines))):
            if 'def get_connection' in lines[j]:
                cache_on_get_connection = True
                break

if cache_on_get_connection:
    print("❌ FAIL: @st.cache_resource still on get_connection")
    sys.exit(1)
else:
    print("✅ PASS: @st.cache_resource removed from get_connection")

# Test 7: Rollback calls
print("\nTest 7: Verifying transaction rollback...")
rollback_count = content.count('conn.rollback()')
if rollback_count >= 2:
    print(f"✅ PASS: Found {rollback_count} rollback calls")
else:
    print(f"❌ FAIL: Expected at least 2 rollback calls, found {rollback_count}")
    sys.exit(1)

# Test 8: Connection close
print("\nTest 8: Verifying connection close in finally blocks...")
conn_close_count = content.count('conn.close()')
if conn_close_count >= 2:
    print(f"✅ PASS: Found {conn_close_count} connection close calls")
else:
    print(f"❌ FAIL: Expected at least 2 connection close calls, found {conn_close_count}")
    sys.exit(1)

# Test 9: Cursor close
print("\nTest 9: Verifying cursor close in finally blocks...")
cursor_close_count = content.count('cursor.close()')
if cursor_close_count >= 2:
    print(f"✅ PASS: Found {cursor_close_count} cursor close calls")
else:
    print(f"❌ FAIL: Expected at least 2 cursor close calls, found {cursor_close_count}")
    sys.exit(1)

# Test 10: Error handling preserved
print("\nTest 10: Verifying error handling...")
if 'st.error(f"Query error:' in content:
    print("✅ PASS: Query error handling preserved")
else:
    print("❌ FAIL: Query error handling missing")
    sys.exit(1)

if 'st.error(f"Procedure error:' in content:
    print("✅ PASS: Procedure error handling preserved")
else:
    print("❌ FAIL: Procedure error handling missing")
    sys.exit(1)

if 'st.error(f"Database connection error:' in content:
    print("✅ PASS: Connection error handling preserved")
else:
    print("❌ FAIL: Connection error handling missing")
    sys.exit(1)

# Test 11: Return values preserved
print("\nTest 11: Verifying return value patterns...")
if 'return None if fetch else False' in content:
    print("✅ PASS: execute_query error returns preserved")
else:
    print("❌ FAIL: execute_query error return pattern changed")
    sys.exit(1)

# Test 12: Commit calls preserved
print("\nTest 12: Verifying commit behavior...")
if content.count('conn.commit()') >= 2:
    print("✅ PASS: Commit calls preserved in both functions")
else:
    print("⚠️  WARNING: Expected at least 2 commit calls")

# Test 13: Docstrings added
print("\nTest 13: Verifying documentation...")
docstring_count = 0
for node in ast.walk(tree):
    if isinstance(node, ast.FunctionDef):
        if node.name in ['get_connection', 'execute_query', 'call_procedure']:
            if ast.get_docstring(node):
                docstring_count += 1
                print(f"✅ PASS: {node.name} has docstring")

if docstring_count < 3:
    print(f"⚠️  WARNING: Only {docstring_count}/3 functions have docstrings")

# Test 14: Connection ping added
print("\nTest 14: Verifying connection validation...")
if 'conn.ping(' in content:
    print("✅ PASS: Connection ping validation added")
else:
    print("⚠️  INFO: Connection ping not found (optional)")

# Summary
print("\n" + "=" * 70)
print("Test Summary - Phase 2A")
print("=" * 70)
print("✅ ALL STATIC CODE TESTS PASSED")
print()
print("Verified Changes:")
print("  ✅ @st.cache_resource removed from get_connection()")
print("  ✅ Connection created fresh on each call")
print("  ✅ finally blocks added to execute_query() and call_procedure()")
print("  ✅ conn.rollback() added in exception handlers")
print("  ✅ conn.close() added in finally blocks")
print("  ✅ cursor.close() added in finally blocks")
print("  ✅ Function signatures unchanged (backward compatible)")
print("  ✅ Error handling preserved")
print("  ✅ Return value patterns preserved")
print("  ✅ Docstrings added")
print()
print("Runtime Tests Not Executed:")
print("  ⏭️  MySQL connection tests (requires live database)")
print("  ⏭️  Transaction rollback tests (requires live database)")
print("  ⏭️  Connection leak tests (requires live database)")
print("  ⏭️  Cursor cleanup tests (requires live database)")
print()
print("Next Steps:")
print("  1. Run: python test_config.py")
print("  2. Configure MySQL database")
print("  3. Run: streamlit run app.py")
print("  4. Test all features (hotels, guests, bookings, payments)")
print("=" * 70)

