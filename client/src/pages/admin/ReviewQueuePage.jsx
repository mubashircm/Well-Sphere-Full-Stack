import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Feedback from "../../components/ui/Feedback.jsx";
import HealthInformationBlocks from "../../components/article/HealthInformationBlocks.jsx";
import { useApi } from "../../hooks/useApi.js";
import { apiClient } from "../../services/api/client.js";
import { formatDate } from "../../data/articles.js";

function ReviewQueuePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedArticleId = searchParams.get("article") || "";
  const [search, setSearch] = useState("");

  const [reviewNotes, setReviewNotes] = useState("");
  const [processingAction, setProcessingAction] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  const queryPath = `/admin/review-queue${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}`;
  const { data, loading, error } = useApi(queryPath);
  const { data: activeArticle, loading: loadingActive } = useApi(
    selectedArticleId ? `/admin/articles/${selectedArticleId}` : null
  );

  const [localQueue, setLocalQueue] = useState(null);
  const queue = localQueue ?? data?.articles ?? [];

  function selectArticle(id) {
    if (id) {
      searchParams.set("article", id);
    } else {
      searchParams.delete("article");
    }
    setSearchParams(searchParams);
  }

  async function handleApprove() {
    if (!activeArticle) return;
    setProcessingAction(true);
    setActionFeedback(null);
    try {
      await apiClient(`/admin/articles/${activeArticle._id}/approve`, { method: "POST" });
      setActionFeedback({
        tone: "info",
        message: `“${activeArticle.title}” has been approved and published live on the platform.`,
      });
      // Remove from queue
      setLocalQueue((prev) => (prev ?? queue).filter((a) => a._id !== activeArticle._id));
      selectArticle("");
    } catch (err) {
      setActionFeedback({ tone: "error", message: err.message || "Approval failed." });
    } finally {
      setProcessingAction(false);
    }
  }

  async function handleRequestChanges() {
    if (!activeArticle) return;
    if (!reviewNotes.trim()) {
      setActionFeedback({ tone: "error", message: "Please provide revision notes for the author." });
      return;
    }
    setProcessingAction(true);
    setActionFeedback(null);
    try {
      await apiClient(`/admin/articles/${activeArticle._id}/request-changes`, {
        method: "POST",
        body: { notes: reviewNotes.trim() },
      });
      setActionFeedback({
        tone: "info",
        message: `Changes requested for “${activeArticle.title}”. Returned to editor.`,
      });
      setLocalQueue((prev) => (prev ?? queue).filter((a) => a._id !== activeArticle._id));
      selectArticle("");
    } catch (err) {
      setActionFeedback({ tone: "error", message: err.message || "Failed to request changes." });
    } finally {
      setProcessingAction(false);
    }
  }

  async function handleReject() {
    if (!activeArticle) return;
    if (!window.confirm(`Are you sure you want to reject "${activeArticle.title}"?`)) return;
    setProcessingAction(true);
    setActionFeedback(null);
    try {
      await apiClient(`/admin/articles/${activeArticle._id}/reject`, {
        method: "POST",
        body: { reason: reviewNotes.trim() || "Rejected by editorial administration." },
      });
      setActionFeedback({
        tone: "info",
        message: `“${activeArticle.title}” has been rejected and moved back to draft.`,
      });
      setLocalQueue((prev) => (prev ?? queue).filter((a) => a._id !== activeArticle._id));
      selectArticle("");
    } catch (err) {
      setActionFeedback({ tone: "error", message: err.message || "Rejection failed." });
    } finally {
      setProcessingAction(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Editorial Review Queue
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Carefully assess submitted articles for medical accuracy, clarity, clinical sources, and responsible health communication.
        </p>
      </div>

      {actionFeedback && (
        <Feedback tone={actionFeedback.tone} role="status">
          {actionFeedback.message}
        </Feedback>
      )}

      {/* ─── REVIEW DRAWER / MODAL ─────────────────────────────────────────── */}
      {selectedArticleId && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => selectArticle("")}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  Reviewing Submission
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-2">
                  {activeArticle?.title || "Loading Article…"}
                </h2>
              </div>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
                onClick={() => selectArticle("")}
                aria-label="Close review modal"
              >
                ✕
              </button>
            </div>

            {loadingActive ? (
              <div className="h-64 bg-slate-50 rounded-2xl animate-pulse" />
            ) : activeArticle ? (
              <div className="space-y-6">
                {/* Meta details bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block">Author</span>
                    <strong className="text-slate-800">{activeArticle.author?.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Topic</span>
                    <strong className="text-teal-800">{activeArticle.topic?.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Reading Time</span>
                    <strong className="text-slate-800">{activeArticle.readingTime} min</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Submitted</span>
                    <strong className="text-slate-800">{formatDate(activeArticle.updatedAt)}</strong>
                  </div>
                </div>

                {/* Article Content Preview */}
                <div className="space-y-4 max-h-96 overflow-y-auto p-4 rounded-2xl bg-slate-50/50 border border-slate-100 text-sm">
                  <p className="text-base text-slate-600 font-serif italic">
                    "{activeArticle.excerpt}"
                  </p>

                  <div className="space-y-4 pt-2">
                    {activeArticle.sections?.map((sec, idx) => (
                      <div key={idx} className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-sm">{sec.heading}</h4>
                        <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">{sec.body}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3">
                    <HealthInformationBlocks article={activeArticle} />
                  </div>
                </div>

                {/* Reviewer Decision Panel */}
                <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400">
                    Decision &amp; Editorial Action
                  </h3>
                  <div className="space-y-1.5">
                    <label htmlFor="admin-review-notes" className="text-xs text-slate-300 block">
                      Revision Notes / Rejection Reason (Required if requesting changes)
                    </label>
                    <textarea
                      id="admin-review-notes"
                      rows={3}
                      placeholder="e.g. Please clarify home care section and verify sources with clinical guidelines…"
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      disabled={processingAction}
                      onClick={handleApprove}
                      className="bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      {processingAction ? "Processing…" : "✓ Approve & Publish Live"}
                    </button>

                    <button
                      type="button"
                      disabled={processingAction}
                      onClick={handleRequestChanges}
                      className="bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-600 transition-all cursor-pointer disabled:opacity-50"
                    >
                      Request Changes
                    </button>

                    <button
                      type="button"
                      disabled={processingAction}
                      onClick={handleReject}
                      className="text-rose-400 hover:text-rose-300 text-xs sm:text-sm font-medium px-3 py-2 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Reject Submission
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ─── SEARCH BAR ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <input
          type="search"
          placeholder="Search pending submissions by title or author…"
          value={search}
          onChange={(e) => {
            setLocalQueue(null);
            setSearch(e.target.value);
          }}
          className="w-full md:w-96 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 bg-white"
        />
      </div>

      {error && <Feedback tone="error">{error}</Feedback>}

      {/* ─── QUEUE TABLE ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-12 bg-slate-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : queue.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 m-8 rounded-2xl p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              ✓
            </div>
            <h3 className="font-bold text-slate-800 text-base">Review Queue is Clear</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {search
                ? "No pending submissions match your search criteria."
                : "There are currently no articles awaiting review. Editors will submit drafts here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">Article</th>
                  <th className="py-3.5 px-5">Author</th>
                  <th className="py-3.5 px-5">Topic</th>
                  <th className="py-3.5 px-5">Submitted On</th>
                  <th className="py-3.5 px-5 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queue.map((article) => (
                  <tr key={article._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <strong className="font-semibold text-slate-900 block line-clamp-1">{article.title}</strong>
                      <span className="text-xs text-slate-500 line-clamp-1">{article.excerpt}</span>
                    </td>
                    <td className="py-4 px-5 text-xs">
                      <strong className="font-medium text-slate-800 block">{article.author?.name || "Editor"}</strong>
                      <span className="text-slate-400 font-mono">{article.author?.email}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100">
                        {article.topic?.name || "General"}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-xs text-slate-400 font-mono">
                      {formatDate(article.updatedAt || article.createdAt)}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => selectArticle(article._id)}
                        className="bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shadow-xs hover:-translate-y-0.5 cursor-pointer"
                      >
                        Review &amp; Approve →
                      </button>
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

export default ReviewQueuePage;
