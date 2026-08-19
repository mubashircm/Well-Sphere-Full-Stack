import { useState } from "react";
import { NavLink, Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import Logo from "../../components/common/Logo.jsx";
import LogoutConfirmModal from "../../components/common/LogoutConfirmModal.jsx";
import { toast } from "../../components/ui/Toast.jsx";

function EditorLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleConfirmLogout() {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("You have been successfully logged out.");
      setShowLogoutModal(false);
      navigate("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  const navItems = [
    {
      to: "/editor",
      label: "Studio Dashboard",
      end: true,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      to: "/editor/articles",
      label: "My Articles",
      end: true,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      to: "/editor/articles/create",
      label: "Write New Article",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      ),
    },
    {
      to: "/editor/comments",
      label: "Comment Moderation",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v5.018z" />
        </svg>
      ),
    },
    {
      to: "/editor/inquiries",
      label: "Reader Inquiries",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
    },
    {
      to: "/editor/analytics",
      label: "Editorial Analytics",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21H4.125A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
  ];

  // Compute clean breadcrumb label
  const breadcrumbLabel = (() => {
    const p = location.pathname;
    if (p === "/editor") return "Studio Dashboard";
    if (p === "/editor/articles") return "My Articles";
    if (p === "/editor/articles/create") return "Write Health Article";
    if (p.includes("/edit")) return "Edit Article";
    if (p === "/editor/comments") return "Comment Moderation";
    if (p === "/editor/inquiries") return "Reader Inquiries";
    if (p === "/editor/analytics") return "Editorial Analytics";
    return "Editorial Desk";
  })();

  const isWritingOrEditing =
    location.pathname === "/editor/articles/create" || location.pathname.includes("/edit");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden">
      {/* ─── MOBILE HEADER (< lg) ─────────────────────────────────────────── */}
      <header className="lg:hidden bg-white border-b border-slate-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Logo className="h-7 w-auto" />
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
            Editor
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileNavOpen((prev) => !prev)}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200 cursor-pointer"
          aria-label="Toggle editor navigation menu"
        >
          {mobileNavOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* ─── DESKTOP & MOBILE SIDEBAR ──────────────────────────────────────── */}
      <aside
        className={`${
          mobileNavOpen ? "block" : "hidden"
        } lg:flex lg:flex-col lg:w-72 bg-white text-slate-700 border-r border-slate-200/80 min-h-screen shrink-0 z-30 justify-between transition-all`}
      >
        <div>
          {/* Top Brand Section */}
          <div className="p-6 border-b border-slate-200/80 flex flex-col gap-2.5">
            <Logo className="h-8 w-auto" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200/70 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
              Editorial Studio
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5" aria-label="Editor Navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileNavOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-teal-50 text-teal-900 font-semibold border-l-4 border-teal-700 pl-3 rounded-r-xl shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                <span className="shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer (Profile & Workspace Switcher) */}
        <div className="p-4 border-t border-slate-200/80 space-y-3 bg-slate-50/60">
          {/* User Profile Card */}
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-700 to-emerald-800 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : "E"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{user?.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
          </div>

          {/* Quick Action Links */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Link
              to="/"
              className="flex-1 text-center py-2 rounded-xl text-slate-600 hover:text-teal-800 hover:bg-white border border-slate-200/80 transition-colors"
            >
              Public Site ↗
            </Link>
            {user?.role === "superadmin" && (
              <Link
                to="/admin"
                className="flex-1 text-center py-2 rounded-xl text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-colors"
              >
                Admin Console
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* ─── MAIN WORKSPACE AREA ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 min-h-screen text-slate-900">
        {/* Sticky Glass Topbar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 py-4 flex items-center justify-between shadow-2xs">
          {/* Breadcrumb Path */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500">
              <span className="font-semibold text-slate-800">Editorial Studio</span>
              <span>/</span>
              <span className="text-teal-800 font-semibold">{breadcrumbLabel}</span>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              <span>Evidence Framework Active</span>
            </div>
          </div>

          {/* Right Topbar Action */}
          <div className="flex items-center gap-3">
            {!isWritingOrEditing && (
              <Link
                to="/editor/articles/create"
                className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all hover:-translate-y-0.5 inline-flex items-center gap-1.5"
              >
                <span>+</span>
                <span>Write Article</span>
              </Link>
            )}
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto animate-fade-in-up">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        loading={loggingOut}
      />
    </div>
  );
}

export default EditorLayout;
