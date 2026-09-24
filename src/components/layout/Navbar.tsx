import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { BriefcaseBusiness, Menu, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { clearAuth } from "../../features/auth/authSlice";

import { authService } from "../../features/auth/authService";
import { addToast } from "../../features/toasts/toastSlice";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("auth_token");

      dispatch(clearAuth());

      dispatch(
        addToast({
          type: "success",
          message: "You have been logged out.",
        }),
      );

      setIsMenuOpen(false);

      navigate("/login");
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-blue-600"
          onClick={() => setIsMenuOpen(false)}
        >
          <BriefcaseBusiness className="h-7 w-7" />

          <span>JobHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`
            }
          >
            Find Jobs
          </NavLink>

          <NavLink
            to="/companies"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`
            }
          >
            Companies
          </NavLink>
        </nav>

        {/* Desktop Authentication Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated && user ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Dashboard
              </Link>

              <span className="text-sm font-medium text-gray-700">
                {user.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Post a Job
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 shadow-sm md:hidden">
          <nav className="flex flex-col gap-2">
            <NavLink
              to="/jobs"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }`
              }
            >
              Find Jobs
            </NavLink>

            <NavLink
              to="/companies"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }`
              }
            >
              Companies
            </NavLink>

            <div className="mt-3 border-t border-gray-200 pt-3">
              {isAuthenticated && user ? (
                <div className="flex flex-col gap-2">
                  <div className="px-3 py-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Signed in as
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg bg-red-50 px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-100"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Post a Job
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
