import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Feedback from "../../components/ui/Feedback.jsx";
import { useApi } from "../../hooks/useApi.js";
import { apiClient } from "../../services/api/client.js";
import { formatDate } from "../../data/articles.js";
import { useAuth } from "../../auth/AuthContext.jsx";

function getRoleBadge(role) {
  switch (role) {
    case "superadmin":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          SuperAdmin
        </span>
      );
    case "editor":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
          Editor
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-600">
          Member
        </span>
      );
  }
}

function UserManagementPage() {
  const { user: currentAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentRole = searchParams.get("role") || "all";
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);

  const queryPath = useMemo(() => {
    const params = new URLSearchParams();
    if (currentRole && currentRole !== "all") params.set("role", currentRole);
    if (search.trim()) params.set("search", search.trim());
    const qStr = params.toString();
    return `/admin/users${qStr ? `?${qStr}` : ""}`;
  }, [currentRole, search]);

  const { data, loading, error } = useApi(queryPath);
  const [localUsers, setLocalUsers] = useState(null);

  const users = localUsers ?? data?.users ?? [];

  function setRoleFilter(role) {
    setLocalUsers(null);
    if (role === "all") {
      searchParams.delete("role");
    } else {
      searchParams.set("role", role);
    }
    setSearchParams(searchParams);
  }

  async function handleRoleChange(userId, newRole, userName) {
    if (userId === currentAdmin?.id && newRole !== "superadmin") {
      alert("You cannot demote your own SuperAdmin account.");
      return;
    }
    if (!window.confirm(`Change ${userName}'s role to "${newRole}"?`)) return;

    setUpdatingId(userId);
    setActionFeedback(null);
    try {
      await apiClient(`/admin/users/${userId}`, {
        method: "PATCH",
        body: { role: newRole },
      });
      setActionFeedback({
        tone: "info",
        message: `${userName}'s role was updated to ${newRole}.`,
      });
      setLocalUsers((prev) =>
        (prev ?? users).map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      setActionFeedback({ tone: "error", message: err.message || "Failed to update role." });
    } finally {
      setUpdatingId(null);
    }
  }

  const roleTabs = [
    { key: "all", label: "All Users" },
    { key: "user", label: "Members" },
    { key: "editor", label: "Editors" },
    { key: "superadmin", label: "SuperAdmins" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          User & Role Administration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage member accounts, assign editorial roles, promote administrators, and oversee access privileges.
        </p>
      </div>

      {actionFeedback && (
        <Feedback tone={actionFeedback.tone} role="status">
          {actionFeedback.message}
        </Feedback>
      )}

      {/* ─── FILTER TABS & SEARCH BAR ───────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto">
          {roleTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 ${
                currentRole === tab.key
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setRoleFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="w-full md:w-80">
          <input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => {
              setLocalUsers(null);
              setSearch(e.target.value);
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 bg-white"
          />
        </div>
      </div>

      {error && <Feedback tone="error">{error}</Feedback>}

      {/* ─── USERS TABLE ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-12 bg-slate-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-slate-500">No user accounts matched your search or role filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">User</th>
                  <th className="py-3.5 px-5">Email</th>
                  <th className="py-3.5 px-5">Role</th>
                  <th className="py-3.5 px-5">Joined</th>
                  <th className="py-3.5 px-5 text-right">Assign Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((targetUser) => {
                  const initial = targetUser.name ? targetUser.name.charAt(0).toUpperCase() : "U";
                  return (
                    <tr key={targetUser._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center border border-teal-100 shrink-0">
                            {initial}
                          </div>
                          <div>
                            <strong className="font-semibold text-slate-900 block">{targetUser.name}</strong>
                            {targetUser._id === currentAdmin?.id && (
                              <span className="text-[11px] font-semibold text-teal-700">(Current Session)</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-mono text-xs text-slate-600">
                        {targetUser.email}
                      </td>
                      <td className="py-4 px-5">
                        {getRoleBadge(targetUser.role)}
                      </td>
                      <td className="py-4 px-5 text-xs text-slate-400 font-mono">
                        {formatDate(targetUser.createdAt)}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <select
                          aria-label={`Change role for ${targetUser.name}`}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 outline-none cursor-pointer"
                          value={targetUser.role}
                          disabled={updatingId === targetUser._id}
                          onChange={(e) =>
                            handleRoleChange(targetUser._id, e.target.value, targetUser.name)
                          }
                        >
                          <option value="user">Member</option>
                          <option value="editor">Editor</option>
                          <option value="superadmin">SuperAdmin</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagementPage;
