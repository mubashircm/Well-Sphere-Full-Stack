import { Link } from "react-router-dom";
import Feedback from "../../components/ui/Feedback.jsx";
import { useApi } from "../../hooks/useApi.js";
import { formatDate } from "../../data/articles.js";

function AdminDashboardPage() {
  const { data: stats, loading: statsLoading, error: statsError } = useApi("/admin/dashboard");
  const { data: queueData, loading: queueLoading, error: queueError } = useApi("/admin/review-queue?limit=5");
  const { data: logsData, loading: logsLoading } = useApi("/admin/audit-logs?limit=5");

  const pendingArticles = queueData?.articles || [];
  const recentLogs = logsData?.logs || [];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* ─── 1. EXECUTIVE HEADER ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200/60 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            <span>Governance & Platform Command</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Platform Command Center
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Real-time administrative metrics, editorial approvals, identity permissions, and security audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin/review-queue"
            className="bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            <span>Review Queue</span>
            <span className="px-2 py-0.5 rounded-full bg-teal-800 text-teal-100 text-xs">
              {stats?.articles?.["pending-review"] ?? 0}
            </span>
          </Link>
        </div>
      </div>

      {statsError && <Feedback tone="error">{statsError}</Feedback>}

      {/* ─── 2. EXECUTIVE KPI METRICS GRID ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Registered Users */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Users
            </span>
            <span className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </span>
          </div>
          <div className="text-3xl font-bold font-sans text-slate-900 tracking-tight my-2">
            {statsLoading ? "…" : stats?.users?.total ?? 0}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            <span className="text-sky-700 font-semibold">{stats?.users?.editor ?? 0}</span> Editors · <span className="text-rose-700 font-semibold">{stats?.users?.superadmin ?? 0}</span> SuperAdmins
          </p>
        </div>

        {/* Metric 2: Pending Approval */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Approval
            </span>
            <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="text-3xl font-bold font-sans text-amber-900 tracking-tight my-2">
            {statsLoading ? "…" : stats?.articles?.["pending-review"] ?? 0}
          </div>
          <p className="text-xs text-amber-700 font-medium">
            Awaiting editorial decisions
          </p>
        </div>

        {/* Metric 3: Live Published Articles */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Published Guides
            </span>
            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="text-3xl font-bold font-sans text-slate-900 tracking-tight my-2">
            {statsLoading ? "…" : stats?.articles?.published ?? 0}
          </div>
          <p className="text-xs text-emerald-700 font-medium">
            {stats?.articles?.total ?? 0} total created
          </p>
        </div>

        {/* Metric 4: Community Comments */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Community Comments
            </span>
            <span className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v5.018z" />
              </svg>
            </span>
          </div>
          <div className="text-3xl font-bold font-sans text-slate-900 tracking-tight my-2">
            {statsLoading ? "…" : stats?.comments?.total ?? 0}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            <span className="text-amber-700 font-semibold">{stats?.comments?.flagged ?? 0}</span> flagged for review
          </p>
        </div>
      </div>

      {/* ─── 3. GOVERNANCE SHORTCUT CARDS ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/review-queue"
          className="bg-white rounded-2xl border border-slate-200/80 p-6 hover:border-teal-500/40 hover:shadow-md transition-all group block"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-800 transition-colors">
            Article Review Queue
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Read submitted drafts, verify clinical evidence, request revisions, or approve articles for immediate publishing.
          </p>
        </Link>

        <Link
          to="/admin/users"
          className="bg-white rounded-2xl border border-slate-200/80 p-6 hover:border-teal-500/40 hover:shadow-md transition-all group block"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-sky-800 transition-colors">
            User & Role Administration
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Assign editorial roles, promote administrators, review accounts, and manage system access privileges.
          </p>
        </Link>

        <Link
          to="/admin/settings"
          className="bg-white rounded-2xl border border-slate-200/80 p-6 hover:border-teal-500/40 hover:shadow-md transition-all group block"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
          </div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-800 transition-colors">
            System & Maintenance Controls
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Toggle emergency lockdown mode, comment auto-approval, registration flags, and announcement banners.
          </p>
        </Link>
      </div>

      {/* ─── 4. PENDING REVIEW QUEUE TABLE ──────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Pending Review Submissions
            </h2>
            <p className="text-xs text-slate-500">
              Drafts submitted by editors awaiting administrative approval.
            </p>
          </div>
          <Link
            to="/admin/review-queue"
            className="text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-900"
          >
            View All ({queueData?.total ?? 0}) →
          </Link>
        </div>

        {queueError && <Feedback tone="error">{queueError}</Feedback>}

        {queueLoading ? (
          <div className="h-32 bg-slate-50 rounded-xl animate-pulse" />
        ) : pendingArticles.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              ✓
            </div>
            <h4 className="font-semibold text-slate-800 text-sm">Review Queue is Clear</h4>
            <p className="text-xs text-slate-400 mt-0.5">All submitted articles have been reviewed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Article</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Topic</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingArticles.map((article) => (
                  <tr key={article._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <strong className="font-semibold text-slate-900 block line-clamp-1">{article.title}</strong>
                      <span className="text-xs text-slate-500 line-clamp-1">{article.excerpt}</span>
                    </td>
                    <td className="py-4 px-4 text-xs">
                      <span className="font-medium text-slate-800 block">{article.author?.name || "Editor"}</span>
                      <span className="text-slate-400">{article.author?.email}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100">
                        {article.topic?.name || "General"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400">
                      {formatDate(article.updatedAt || article.createdAt)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={`/admin/review-queue?article=${article._id}`}
                        className="bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition-colors inline-block shadow-2xs"
                      >
                        Review Draft →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ─── 5. RECENT AUDIT TRAIL PREVIEW ─────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Recent Governance & Security Logs
            </h2>
            <p className="text-xs text-slate-500">
              Automated immutable audit records of administrative operations.
            </p>
          </div>
          <Link
            to="/admin/audit-logs"
            className="text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-900"
          >
            View Full Trail →
          </Link>
        </div>

        {logsLoading ? (
          <div className="h-32 bg-slate-50 rounded-xl animate-pulse" />
        ) : recentLogs.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
            <p className="text-xs text-slate-400">No administrative logs recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log._id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md font-mono font-bold uppercase tracking-wider text-[11px] bg-slate-200 text-slate-800">
                    {log.action}
                  </span>
                  <p className="text-slate-700">
                    <strong>{log.actor?.name || "SuperAdmin"}</strong> ({log.actor?.email || "system"})
                    {" on "}
                    <span className="font-semibold text-teal-800">{log.targetType}</span>
                    {log.details?.title && ` “${log.details.title}”`}
                    {log.details?.newRole && ` → ${log.details.newRole}`}
                  </p>
                </div>
                <div className="text-slate-400 font-mono text-[11px] shrink-0">
                  {formatDate(log.createdAt)} · IP: {log.ip || "127.0.0.1"}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboardPage;
