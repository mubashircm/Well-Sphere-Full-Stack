import { Link } from "react-router-dom";
import Feedback from "../../components/ui/Feedback.jsx";
import { useApi } from "../../hooks/useApi.js";
import { formatDate } from "../../data/articles.js";

function getStatusBadge(status) {
  switch (status) {
    case "published":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
          Published
        </span>
      );
    case "pending-review":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
          In Review
        </span>
      );
    case "changes-requested":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">
          Changes Requested
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-600">
          Draft
        </span>
      );
  }
}

function EditorDashboardPage() {
  const { data: analytics, loading: statsLoading, error: statsError } = useApi("/editor/analytics");
  const { data: articlesData, loading: articlesLoading, error: articlesError } = useApi("/editor/articles?limit=5");

  const recentArticles = articlesData?.articles || [];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* ─── 1. HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200/60 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
            <span>Author Workspace</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Editorial Studio
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Monitor your health guides, track review submissions, and manage clinical evidence drafts.
          </p>
        </div>

        <Link
          to="/editor/articles/create"
          className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 inline-flex items-center gap-2 w-fit shrink-0"
        >
          <span>✍️</span>
          <span>Create New Article</span>
        </Link>
      </div>

      {statsError && <Feedback tone="error">{statsError}</Feedback>}

      {/* ─── 2. METRICS CARDS GRID ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Drafts */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              In Draft
            </span>
            <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </span>
          </div>
          <div className="text-3xl font-bold font-sans text-slate-900 tracking-tight my-2">
            {statsLoading ? "…" : analytics?.draft ?? 0}
          </div>
          <p className="text-xs text-slate-400 font-medium">Work in progress</p>
        </div>

        {/* Pending Review */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              In Review
            </span>
            <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="text-3xl font-bold font-sans text-amber-900 tracking-tight my-2">
            {statsLoading ? "…" : analytics?.["pending-review"] ?? 0}
          </div>
          <p className="text-xs text-amber-700 font-medium">Awaiting approval</p>
        </div>

        {/* Published */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Published
            </span>
            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="text-3xl font-bold font-sans text-emerald-900 tracking-tight my-2">
            {statsLoading ? "…" : analytics?.published ?? 0}
          </div>
          <p className="text-xs text-emerald-700 font-medium">Live on platform</p>
        </div>

        {/* Changes Requested */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Needs Revision
            </span>
            <span className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </span>
          </div>
          <div className="text-3xl font-bold font-sans text-rose-900 tracking-tight my-2">
            {statsLoading ? "…" : analytics?.["changes-requested"] ?? 0}
          </div>
          <p className="text-xs text-rose-700 font-medium">Reviewer notes returned</p>
        </div>
      </div>

      {/* ─── 3. QUICK ACTION STUDIO TILES ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/editor/articles/create"
          className="bg-white rounded-2xl border border-slate-200/80 p-6 hover:border-teal-500/40 hover:shadow-md transition-all group block"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-800 transition-colors">
            Write Health Article
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Create structured, evidence-aware articles following our clinical framework and citations.
          </p>
        </Link>

        <Link
          to="/editor/articles?status=changes-requested"
          className="bg-white rounded-2xl border border-slate-200/80 p-6 hover:border-teal-500/40 hover:shadow-md transition-all group block"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-800 transition-colors">
            Revision Queue
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Review editorial reviewer notes on returned drafts and re-submit updated versions.
          </p>
        </Link>

        <Link
          to="/editor/comments"
          className="bg-white rounded-2xl border border-slate-200/80 p-6 hover:border-teal-500/40 hover:shadow-md transition-all group block"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v5.018z" />
            </svg>
          </div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-sky-800 transition-colors">
            Community Moderation
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Review, approve, and moderate reader comments to ensure supportive and safe discussions.
          </p>
        </Link>
      </div>

      {/* ─── 4. RECENT ARTICLES TABLE ───────────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Recent Articles
            </h2>
            <p className="text-xs text-slate-500">
              Your most recently created or updated health guides.
            </p>
          </div>
          <Link
            to="/editor/articles"
            className="text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-900"
          >
            View All ({articlesData?.total ?? 0}) →
          </Link>
        </div>

        {articlesError && <Feedback tone="error">{articlesError}</Feedback>}

        {articlesLoading ? (
          <div className="h-32 bg-slate-50 rounded-xl animate-pulse" />
        ) : recentArticles.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
            <p className="text-sm text-slate-600">You haven't written any health articles yet.</p>
            <Link
              to="/editor/articles/create"
              className="mt-3 inline-block bg-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-lg"
            >
              Write First Article
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Title</th>
                  <th className="py-3 px-4">Topic</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Modified</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentArticles.map((article) => (
                  <tr key={article._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <Link
                        to={`/editor/articles/${article._id}/edit`}
                        className="font-semibold text-slate-900 hover:text-teal-800 block line-clamp-1"
                      >
                        {article.title}
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100">
                        {article.topic?.name || "General"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(article.status)}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400 font-mono">
                      {formatDate(article.updatedAt || article.createdAt)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/editor/articles/${article._id}/edit`}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                        {article.status === "published" && (
                          <Link
                            to={`/article/${article.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-teal-700 hover:text-teal-900 font-semibold text-xs px-2 py-1.5"
                          >
                            View ↗
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default EditorDashboardPage;
