import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Feedback from "../../components/ui/Feedback.jsx";
import { useApi } from "../../hooks/useApi.js";
import { apiClient } from "../../services/api/client.js";
import { formatDate } from "../../data/articles.js";

function getCommentStatusBadge(status) {
  switch (status) {
    case "approved":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
          Approved
        </span>
      );
    case "flagged":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
          Flagged
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-600">
          {status}
        </span>
      );
  }
}

function CommentModerationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") || "all";
  const [search, setSearch] = useState("");
  const [actionFeedback, setActionFeedback] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const queryPath = useMemo(() => {
    const params = new URLSearchParams();
    if (currentStatus && currentStatus !== "all") params.set("status", currentStatus);
    if (search.trim()) params.set("search", search.trim());
    const qStr = params.toString();
    return `/editor/comments${qStr ? `?${qStr}` : ""}`;
  }, [currentStatus, search]);

  const { data, loading, error } = useApi(queryPath);
  const [localComments, setLocalComments] = useState(null);

  const comments = localComments ?? data?.comments ?? [];

  function setFilter(status) {
    setLocalComments(null);
    if (status === "all") {
      searchParams.delete("status");
    } else {
      searchParams.set("status", status);
    }
    setSearchParams(searchParams);
  }

  async function updateStatus(commentId, newStatus) {
    setProcessingId(commentId);
    setActionFeedback(null);
    try {
      await apiClient(`/editor/comments/${commentId}`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      setActionFeedback({ tone: "info", message: `Comment marked as ${newStatus}.` });
      setLocalComments((prev) =>
        (prev ?? comments).map((c) => (c._id === commentId ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      setActionFeedback({ tone: "error", message: err.message || "Failed to update comment." });
    } finally {
      setProcessingId(null);
    }
  }

  async function deleteComment(commentId) {
    if (!window.confirm("Are you sure you want to permanently delete this comment?")) return;
    setProcessingId(commentId);
    setActionFeedback(null);
    try {
      await apiClient(`/editor/comments/${commentId}`, { method: "DELETE" });
      setActionFeedback({ tone: "info", message: "Comment permanently removed." });
      setLocalComments((prev) => (prev ?? comments).filter((c) => c._id !== commentId));
    } catch (err) {
      setActionFeedback({ tone: "error", message: err.message || "Failed to delete comment." });
    } finally {
      setProcessingId(null);
    }
  }

  const tabs = [
    { key: "all", label: "All Comments" },
    { key: "flagged", label: "Flagged" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Community Comment Moderation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review reader comments, resolve user flags, and enforce health communication guidelines.
        </p>
      </div>

      {actionFeedback && (
        <Feedback tone={actionFeedback.tone} role="status">
          {actionFeedback.message}
        </Feedback>
      )}

      {/* ─── FILTER TABS & SEARCH BAR ───────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto">
          {tabs.map((tab) => (
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

        <div className="w-full md:w-80">
          <input
            type="search"
            placeholder="Search comment text…"
            value={search}
            onChange={(e) => {
              setLocalComments(null);
              setSearch(e.target.value);
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 bg-white"
          />
        </div>
      </div>

      {error && <Feedback tone="error">{error}</Feedback>}

      {/* ─── COMMENTS LIST ─────────────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-100 p-6 h-36 animate-pulse" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
          <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-100">
            💬
          </div>
          <h3 className="font-bold text-slate-800 text-base">No Comments Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            All comments in this category have been reviewed or none exist.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4 transition-all hover:border-slate-300"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <strong className="text-sm font-bold text-slate-900">
                    {comment.user?.name || "Community Member"}
                  </strong>
                  <span className="text-xs text-slate-400 font-mono">
                    ({comment.user?.email || "anonymous"})
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-400 font-mono">{formatDate(comment.createdAt)}</span>
                </div>
                <div>{getCommentStatusBadge(comment.status)}</div>
              </div>

              <p className="text-sm text-slate-800 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                "{comment.text}"
              </p>

              {comment.article && (
                <div className="text-xs text-slate-500">
                  <span>Article Context: </span>
                  <Link
                    to={`/article/${comment.article.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-teal-700 hover:underline"
                  >
                    {comment.article.title} →
                  </Link>
                </div>
              )}

              {comment.reports && comment.reports.length > 0 && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
                  <strong className="text-amber-900 block">⚠️ Reported by Readers ({comment.reports.length}):</strong>
                  <ul className="list-disc list-inside text-amber-800">
                    {comment.reports.map((r, i) => (
                      <li key={i}>{r.reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Controls */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                {comment.status !== "approved" && (
                  <button
                    type="button"
                    disabled={processingId === comment._id}
                    onClick={() => updateStatus(comment._id, "approved")}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer"
                  >
                    ✓ Approve
                  </button>
                )}

                {comment.status !== "flagged" && (
                  <button
                    type="button"
                    disabled={processingId === comment._id}
                    onClick={() => updateStatus(comment._id, "flagged")}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
                  >
                    🚩 Flag
                  </button>
                )}

                {comment.status !== "rejected" && (
                  <button
                    type="button"
                    disabled={processingId === comment._id}
                    onClick={() => updateStatus(comment._id, "rejected")}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    ✕ Reject
                  </button>
                )}

                <button
                  type="button"
                  disabled={processingId === comment._id}
                  onClick={() => deleteComment(comment._id)}
                  className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-800 transition-colors cursor-pointer ml-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentModerationPage;
