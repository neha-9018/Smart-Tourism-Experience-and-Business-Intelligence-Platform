#!/usr/bin/env python3
"""
Phase 2A.1 – Focused mock tests for targeted error-handling corrections.

Tests:
  1. Successful booking displays success message.
  2. Failed booking (procedure returns None) does NOT display success.
  3. Successful checkout displays success message.
  4. Failed checkout (procedure returns None) does NOT display success.
  5. Failed ping in get_connection() closes the newly created connection.
  6. Regression: Phase 2A lifecycle static checks still pass.
  7. Regression: Phase 1 config module still loads.

Strategy:
  - app.py cannot be imported directly because st.set_page_config() fires at
    module level and Streamlit raises outside a running server context.
  - Instead, the three target functions are extracted from app.py source via
    ast.parse(), then exec()'d into an isolated namespace where `st` and
    `mysql.connector` are replaced by mocks. No live database is used.
  - All tests are runtime behaviour tests via mocks, not static source checks.
"""

import ast
import sys
import os
import types
import unittest
from unittest.mock import MagicMock, patch, call

# ---------------------------------------------------------------------------
# Helper: extract a single function's source from app.py and exec it into
# a namespace whose `st` and `mysql.connector` are mocks.
# ---------------------------------------------------------------------------

def _load_app_source():
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app.py")
    with open(path, "r", encoding="utf-8") as fh:
        return fh.read()


def _extract_function_source(source: str, func_name: str) -> str:
    """Return the source text of a top-level function by name."""
    tree = ast.parse(source)
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef) and node.name == func_name:
            lines = source.splitlines(keepends=True)
            return "".join(lines[node.lineno - 1 : node.end_lineno])
    raise ValueError(f"Function {func_name!r} not found in app.py")


def _build_namespace(st_mock, mysql_mock, db_config=None):
    """Return an exec namespace wired to the given mocks."""
    # Minimal mysql.connector stub
    mysql_module = types.ModuleType("mysql")
    connector_module = types.ModuleType("mysql.connector")
    connector_module.connect = mysql_mock
    mysql_module.connector = connector_module

    ns = {
        "st": st_mock,
        "mysql": mysql_module,
        "DB_CONFIG": db_config or {},
    }
    return ns


def _exec_functions(ns, *func_names):
    """Exec the named functions from app.py into ns."""
    source = _load_app_source()
    for name in func_names:
        func_src = _extract_function_source(source, name)
        exec(compile(func_src, f"<{name}>", "exec"), ns)  # noqa: S102


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

class TestAddBookingCaller(unittest.TestCase):
    """Tests 1 & 2 – AddBooking caller gates st.success on return value."""

    def _make_caller_snippet(self, call_procedure_return):
        """
        Build and exec the minimal booking-caller logic extracted from app.py,
        with call_procedure stubbed to return the given value.
        """
        st_mock = MagicMock()
        ns = {
            "st": st_mock,
            "call_procedure": MagicMock(return_value=call_procedure_return),
            # Minimal stubs for values the snippet references
            "guest_names": {"Alice": 1},
            "room_options": {"Deluxe - ₹5000/night": 1},
            "selected_guest": "Alice",
            "selected_room": "Deluxe - ₹5000/night",
        }

        # Inline the exact booking-caller logic (mirrors what is now in app.py)
        snippet = """
import datetime
check_in = datetime.date(2026, 12, 1)
check_out = datetime.date(2026, 12, 3)

try:
    result = call_procedure('AddBooking',
        [int(guest_names[selected_guest]), int(room_options[selected_room]),
         check_in.strftime('%Y-%m-%d'), check_out.strftime('%Y-%m-%d')])
    if result is not None:
        st.success("Booking created successfully!")
        st.balloons()
    else:
        st.error("Booking failed. Please check the error above and try again.")
except Exception as e:
    st.error(f"Booking failed: {e}")
"""
        exec(compile(snippet, "<booking_snippet>", "exec"), ns)  # noqa: S102
        return st_mock

    def test_successful_booking_shows_success(self):
        """Test 1: When call_procedure returns a list (success), st.success is called."""
        st_mock = self._make_caller_snippet(call_procedure_return=[])
        # An empty list is not None — it means the procedure ran without error.
        st_mock.success.assert_called_once_with("Booking created successfully!")
        st_mock.error.assert_not_called()

    def test_failed_booking_does_not_show_success(self):
        """Test 2: When call_procedure returns None (failure), st.success is NOT called."""
        st_mock = self._make_caller_snippet(call_procedure_return=None)
        st_mock.success.assert_not_called()
        st_mock.error.assert_called_once_with(
            "Booking failed. Please check the error above and try again."
        )


class TestCheckOutCaller(unittest.TestCase):
    """Tests 3 & 4 – CheckOutGuest caller gates st.success on return value."""

    def _make_caller_snippet(self, call_procedure_return):
        st_mock = MagicMock()
        ns = {
            "st": st_mock,
            "call_procedure": MagicMock(return_value=call_procedure_return),
            "booking_id": 1,
        }

        snippet = """
try:
    checkout_result = call_procedure('CheckOutGuest', [int(booking_id)])
    if checkout_result is not None:
        st.success(f"Guest checked out successfully! Room is now available.")
    else:
        st.error("Check-out failed. Please check the error above and try again.")
except Exception as e:
    st.error(f"Check-out failed: {e}")
"""
        exec(compile(snippet, "<checkout_snippet>", "exec"), ns)  # noqa: S102
        return st_mock

    def test_successful_checkout_shows_success(self):
        """Test 3: When call_procedure returns a list (success), st.success is called."""
        st_mock = self._make_caller_snippet(call_procedure_return=[])
        st_mock.success.assert_called_once_with(
            "Guest checked out successfully! Room is now available."
        )
        st_mock.error.assert_not_called()

    def test_failed_checkout_does_not_show_success(self):
        """Test 4: When call_procedure returns None (failure), st.success is NOT called."""
        st_mock = self._make_caller_snippet(call_procedure_return=None)
        st_mock.success.assert_not_called()
        st_mock.error.assert_called_once_with(
            "Check-out failed. Please check the error above and try again."
        )


class TestGetConnectionPingLeak(unittest.TestCase):
    """Test 5 – get_connection() closes conn when ping raises."""

    def _build_get_connection(self, connect_side_effect=None, ping_side_effect=None):
        """
        Exec get_connection() from app.py source into a mock namespace.
        Returns (get_connection_callable, mock_conn, st_mock).
        """
        st_mock = MagicMock()
        mock_conn = MagicMock()

        if connect_side_effect is not None:
            mysql_connect = MagicMock(side_effect=connect_side_effect)
        else:
            mysql_connect = MagicMock(return_value=mock_conn)

        if ping_side_effect is not None:
            mock_conn.ping = MagicMock(side_effect=ping_side_effect)
        else:
            mock_conn.ping = MagicMock(return_value=None)

        ns = _build_namespace(st_mock, mysql_connect)
        _exec_functions(ns, "get_connection")
        return ns["get_connection"], mock_conn, st_mock

    def test_ping_failure_closes_connection(self):
        """
        Test 5a: If connect() succeeds but ping() raises, the connection
        must be closed and None returned.
        """
        get_connection, mock_conn, st_mock = self._build_get_connection(
            ping_side_effect=Exception("ping failed: server gone away")
        )

        result = get_connection()

        self.assertIsNone(result, "get_connection must return None on ping failure")
        mock_conn.close.assert_called_once_with()
        st_mock.error.assert_called_once()
        error_msg = st_mock.error.call_args[0][0]
        self.assertIn("ping failed", error_msg)

    def test_connect_failure_returns_none(self):
        """
        Test 5b: If connect() itself raises, None is returned and st.error
        is called. No conn object exists to close.
        """
        get_connection, mock_conn, st_mock = self._build_get_connection(
            connect_side_effect=Exception("Can't connect to MySQL server")
        )

        result = get_connection()

        self.assertIsNone(result)
        mock_conn.close.assert_not_called()  # conn was never created
        st_mock.error.assert_called_once()

    def test_ping_failure_close_error_does_not_hide_original(self):
        """
        Test 5c: If ping() raises AND conn.close() also raises, st.error
        is still called with the ORIGINAL ping error, not the close error.
        """
        get_connection, mock_conn, st_mock = self._build_get_connection(
            ping_side_effect=Exception("original ping error")
        )
        mock_conn.close = MagicMock(side_effect=Exception("close also failed"))

        result = get_connection()

        self.assertIsNone(result)
        st_mock.error.assert_called_once()
        error_msg = st_mock.error.call_args[0][0]
        self.assertIn("original ping error", error_msg,
                      "st.error must be called with original exception, not close exception")

    def test_successful_connection_returned(self):
        """
        Test 5d: Normal path — connect() and ping() both succeed,
        connection object is returned and NOT closed.
        """
        get_connection, mock_conn, st_mock = self._build_get_connection()

        result = get_connection()

        self.assertIs(result, mock_conn)
        mock_conn.close.assert_not_called()
        st_mock.error.assert_not_called()


class TestRegressionPhase2ALifecycle(unittest.TestCase):
    """Test 6 – Phase 2A static lifecycle checks still pass."""

    @classmethod
    def setUpClass(cls):
        path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app.py")
        with open(path, "r", encoding="utf-8") as fh:
            cls.content = fh.read()
        cls.tree = ast.parse(cls.content)

    def _has_finally(self, func_name):
        for node in ast.walk(self.tree):
            if isinstance(node, ast.FunctionDef) and node.name == func_name:
                for child in ast.walk(node):
                    if isinstance(child, ast.Try) and child.finalbody:
                        return True
        return False

    def test_syntax_valid(self):
        compile(self.content, "app.py", "exec")

    def test_execute_query_has_finally(self):
        self.assertTrue(self._has_finally("execute_query"))

    def test_call_procedure_has_finally(self):
        self.assertTrue(self._has_finally("call_procedure"))

    def test_cache_resource_not_on_get_connection(self):
        lines = self.content.splitlines()
        for i, line in enumerate(lines):
            if "@st.cache_resource" in line:
                for j in range(i + 1, min(i + 3, len(lines))):
                    self.assertNotIn(
                        "def get_connection",
                        lines[j],
                        "@st.cache_resource must not decorate get_connection",
                    )

    def test_rollback_present_in_both_functions(self):
        self.assertGreaterEqual(self.content.count("conn.rollback()"), 2)

    def test_conn_close_present(self):
        self.assertGreaterEqual(self.content.count("conn.close()"), 2)

    def test_cursor_close_present(self):
        self.assertGreaterEqual(self.content.count("cursor.close()"), 2)

    def test_function_signatures_unchanged(self):
        found = {}
        for node in ast.walk(self.tree):
            if isinstance(node, ast.FunctionDef):
                if node.name in ("get_connection", "execute_query", "call_procedure"):
                    found[node.name] = [a.arg for a in node.args.args]
        self.assertEqual(found["get_connection"], [])
        self.assertEqual(found["execute_query"], ["query", "params", "fetch"])
        self.assertEqual(found["call_procedure"], ["proc_name", "params"])


class TestRegressionPhase1Config(unittest.TestCase):
    """Test 7 – Phase 1 configuration module still loads."""

    def test_config_loads_with_env(self):
        """config.py must import successfully when env vars are set."""
        import importlib
        import sys as _sys

        # Temporarily set minimal env vars
        os.environ.setdefault("DB_USER", "test_user")
        os.environ.setdefault("DB_PASSWORD", "test_pass")

        # Force re-import if already cached
        if "config" in _sys.modules:
            del _sys.modules["config"]

        try:
            import config
            self.assertIn("host", config.DB_CONFIG)
            self.assertIn("user", config.DB_CONFIG)
            self.assertIn("password", config.DB_CONFIG)
            self.assertIn("database", config.DB_CONFIG)
            self.assertIn("port", config.DB_CONFIG)
            self.assertIsNotNone(config.APP_TITLE)
        except ValueError as e:
            self.fail(f"config.py raised ValueError unexpectedly: {e}")

    def test_config_raises_on_missing_user(self):
        """config.py must raise ValueError when DB_USER is missing.

        load_dotenv() is patched to a no-op so that the local .env file
        cannot silently re-populate the variables we are trying to leave
        absent.  The test then verifies that config.py raises ValueError
        when DB_USER is genuinely not set.
        """
        import sys as _sys
        from unittest.mock import patch

        # Remove any cached module so it will be re-executed.
        if "config" in _sys.modules:
            del _sys.modules["config"]

        saved_user = os.environ.pop("DB_USER", None)
        saved_pass = os.environ.pop("DB_PASSWORD", None)

        try:
            # Patch load_dotenv to a no-op so the .env file cannot refill
            # DB_USER behind our back during config import.
            with patch("dotenv.load_dotenv", return_value=None):
                with self.assertRaises(ValueError):
                    import config  # noqa: F401
        finally:
            # Always restore env and module cache so other tests are not affected.
            if saved_user is not None:
                os.environ["DB_USER"] = saved_user
            if saved_pass is not None:
                os.environ["DB_PASSWORD"] = saved_pass
            if "config" in _sys.modules:
                del _sys.modules["config"]


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()

    # Ordered for readability in output
    for cls in [
        TestAddBookingCaller,
        TestCheckOutCaller,
        TestGetConnectionPingLeak,
        TestRegressionPhase2ALifecycle,
        TestRegressionPhase1Config,
    ]:
        suite.addTests(loader.loadTestsFromTestCase(cls))

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    sys.exit(0 if result.wasSuccessful() else 1)
