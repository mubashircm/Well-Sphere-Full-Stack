import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Feedback from "../../components/ui/Feedback.jsx";
import { useApi } from "../../hooks/useApi.js";
import { apiClient } from "../../services/api/client.js";
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

function EditorArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") || "all";
  const [search, setSearch] = useState("");
  const [submittingId, setSubmittingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);

  const queryPath = useMemo(() => {
    const params = new URLSearchParams();
    if (currentStatus && currentStatus !== "all") params.set("status", currentStatus);
    if (search.trim()) params.set("search", search.trim());
    const qStr = params.toString();
    return `/editor/articles${qStr ? `?${qStr}` : ""}`;
  }, [currentStatus, search]);

  const { data, loading, error } = useApi(queryPath);
  const [localArticles, setLocalArticles] = useState(null);

  // Use local overrides if items were modified/deleted in-session
  const articles = localArticles ?? data?.articles ?? [];

  function setFilter(status) {
    setLocalArticles(null);
    if (status === "all") {
      searchParams.delete("status");
    } else {
      searchParams.set("status", status);
    }
    setSearchParams(searchParams);
  }

  async function submitArticle(article) {
    setSubmittingId(article._id);
    setActionFeedback(null);
    try {
      await apiClient(`/editor/articles/${article._id}/submit`, { method: "POST" });
      setActionFeedback({
        tone: "info",
        message: `“${article.title}” was submitted for editorial review.`,
      });
      // Update local state
      setLocalArticles((prev) =>
        (prev ?? articles).map((a) => (a._id === article._id ? { ...a, status: "pending-review" } : a))
      );
    } catch (err) {
      setActionFeedback({ tone: "error", message: err.message || "Could not submit article." });
    } finally {
      setSubmittingId(null);
    }
  }

  async function deleteArticle(article) {
    if (!window.confirm(`Are you sure you want to delete "${article.title}"?`)) return;
    setDeletingId(article._id);
    setActionFeedback(null);
    try {
      await apiClient(`/editor/articles/${article._id}`, { method: "DELETE" });
      setActionFeedback({
        tone: "info",
        message: `“${article.title}” was deleted.`,
      });
      setLocalArticles((prev) => (prev ?? articles).filter((a) => a._id !== article._id));
    } catch (err) {
      setActionFeedback({ tone: "error", message: err.message || "Could not delete article." });
    } finally {
      setDeletingId(null);
    }
  }

  const statusTabs = [
    { key: "all", label: "All Articles" },
    { key: "draft", label: "Drafts" },
    { key: "pending-review", label: "In Review" },
    { key: "published", label: "Published" },
    { key: "changes-requested", label: "Changes Requested" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* ─── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            My Health Articles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, revise, and manage submissions across the clinical publishing lifecycle.
          </p>
        </div>

        <Link
          to="/editor/articles/create"
          className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 inline-flex items-center gap-2 w-fit shrink-0"
        >
          <span>✍️</span>
          <span>Write New Article</span>
        </Link>
      </div>

      {actionFeedback && (
        <Feedback tone={actionFeedback.tone} role="status">
          {actionFeedback.message}
        </Feedback>
      )}

      {/* ─── FILTER TABS & SEARCH BAR ───────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                currentStatus === tab.key
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="w-full md:w-80">
          <input
            type="search"
            placeholder="Filter by title or keyword…"
            value={search}
            onChange={(e) => {
              setLocalArticles(null);
              setSearch(e.target.value);
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 bg-white"
          />
        </div>
      </div>

      {error && <Feedback tone="error">{error}</Feedback>}

      {/* ─── ARTICLES TABLE ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-12 bg-slate-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 m-8 rounded-2xl p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-3">
              📝
            </div>
            <h3 className="font-bold text-slate-800 text-base">No Articles Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {search || currentStatus !== "all"
                ? "Try adjusting your search query or status filter."
                : "You haven't written any health guides yet. Start contributing today."}
            </p>
            <div className="mt-4">
              <Link
                to="/editor/articles/create"
                className="bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs px-4 py-2 rounded-xl transition-colors inline-block"
              >
                Write First Article
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">Title</th>
                  <th className="py-3.5 px-5">Topic</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Reading Time</th>
                  <th className="py-3.5 px-5">Last Modified</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((article) => (
                  <tr key={article._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <Link
                        to={`/editor/articles/${article._id}/edit`}
                        className="font-semibold text-slate-900 hover:text-teal-800 block line-clamp-1"
                      >
                        {article.title}
                      </Link>
                      {article.reviewNotes && article.status === "changes-requested" && (
                        <p className="text-xs text-rose-700 mt-1 bg-rose-50 p-2 rounded-lg border border-rose-100">
                          <strong>Reviewer Note:</strong> {article.reviewNotes}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100">
                        {article.topic?.name || "General"}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      {getStatusBadge(article.status)}
                    </td>
                    <td className="py-4 px-5 text-xs text-slate-600 font-mono">
                      {article.readingTime || 1} min
                    </td>
                    <td className="py-4 px-5 text-xs text-slate-400 font-mono">
                      {formatDate(article.updatedAt || article.createdAt)}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/editor/articles/${article._id}/edit`}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
                        </Link>

                        {(article.status === "draft" || article.status === "changes-requested") && (
                          <button
                            type="button"
                            disabled={submittingId === article._id}
                            onClick={() => submitArticle(article)}
                            className="bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {submittingId === article._id ? "Submitting…" : "Submit"}
                          </button>
                        )}

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

                        <button
                          type="button"
                          disabled={deletingId === article._id}
                          onClick={() => deleteArticle(article)}
                          className="text-rose-600 hover:text-rose-800 text-xs px-2 py-1.5 font-medium transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {deletingId === article._id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditorArticlesPage;
