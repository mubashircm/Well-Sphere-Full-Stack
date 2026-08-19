import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import Logo from "../common/Logo.jsx";
import LogoutConfirmModal from "../common/LogoutConfirmModal.jsx";
import { toast } from "../ui/Toast.jsx";

function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Click outside listener for profile dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleConfirmLogout() {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("You have been successfully logged out.");
      setShowLogoutModal(false);
      setProfileDropdownOpen(false);
      setMobileMenuOpen(false);
      navigate("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  const isEditor = user && ["editor", "superadmin"].includes(user.role);
  const isSuperAdmin = user && user.role === "superadmin";

  const navLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/topics", label: "Explore" },
    { to: "/search", label: "Search" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Left: Branding & Logo */}
        <div className="flex items-center gap-6">
          <Logo className="h-9 w-auto" />
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-1.5" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `text-sm font-medium px-4 py-2 rounded-full transition-all duration-150 ${
                  isActive
                    ? "text-teal-900 bg-teal-50/90 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-teal-900 hover:bg-slate-100/80"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Actions & Auth */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-teal-900 px-3.5 py-2 rounded-full transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium px-4 py-2 rounded-full shadow-sm shadow-teal-700/20 transition-all active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2.5" ref={dropdownRef}>
              {/* Elevated Workspace Shortcuts */}
              {isSuperAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
                >
                  SuperAdmin
                </Link>
              )}
              {isEditor && !isSuperAdmin && (
                <Link
                  to="/editor"
                  className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-teal-100 text-teal-900 hover:bg-teal-200 transition-colors"
                >
                  Editor Studio
                </Link>
              )}

              {/* User Dropdown Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-sm font-medium text-slate-800 cursor-pointer shadow-2xs"
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                  <span className="max-w-[100px] truncate">{user.name || "Account"}</span>
                  <svg className={`w-4 h-4 text-slate-500 transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate mt-0.5">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-800 transition-colors"
                      >
                        <span>📊</span> Dashboard
                      </Link>
                      <Link
                        to="/profile/saved"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-800 transition-colors"
                      >
                        <span>🔖</span> Saved Articles
                      </Link>
                      <Link
                        to="/profile/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-800 transition-colors"
                      >
                        <span>⚙️</span> Account Settings
                      </Link>
                    </div>

                    {isEditor && (
                      <div className="py-1 border-t border-slate-100">
                        <Link
                          to="/editor"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-teal-800 font-medium hover:bg-teal-50/70 transition-colors"
                        >
                          <span>✍️</span> Editor Studio
                        </Link>
                        {isSuperAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-amber-900 font-medium hover:bg-amber-50/70 transition-colors"
                          >
                            <span>🛡️</span> Admin Console
                          </Link>
                        )}
                      </div>
                    )}

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer font-medium"
                      >
                        <span>🚪</span> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <Link
              to="/dashboard"
              className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs"
              aria-label="User Dashboard"
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base font-medium px-4 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "text-teal-900 bg-teal-50 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-teal-900"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100">
            {!user ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-medium text-slate-700 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-medium bg-teal-700 hover:bg-teal-800 text-white py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  Create Free Account
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="px-4 py-2 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400">Signed in as</p>
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center text-sm font-medium px-3 py-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile/saved"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center text-sm font-medium px-3 py-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
                  >
                    Saved
                  </Link>
                </div>

                {isEditor && (
                  <div className="space-y-1.5 pt-1">
                    <Link
                      to="/editor"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center text-sm font-semibold px-3 py-2 rounded-xl bg-teal-50 text-teal-900 hover:bg-teal-100 transition-colors"
                    >
                      ✍️ Editor Studio
                    </Link>
                    {isSuperAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-center text-sm font-semibold px-3 py-2 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors"
                      >
                        🛡️ SuperAdmin Console
                      </Link>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className="w-full text-center text-sm font-medium py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        loading={loggingOut}
      />
    </header>
  );
}

export default Navbar;
