import { useState } from "react";
import Feedback from "../../components/ui/Feedback.jsx";
import { useApi } from "../../hooks/useApi.js";
import { apiClient } from "../../services/api/client.js";

const SUBJECT_OPTIONS = [
  { value: "all", label: "All Subjects" },
  { value: "Editorial Feedback", label: "Editorial Feedback" },
  { value: "Article Suggestion", label: "Article Suggestion" },
  { value: "General Inquiry", label: "General Inquiry" },
  { value: "Bug Report", label: "Bug Report" },
  { value: "Partnership", label: "Partnership" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "unread", label: "Unread" },
  { value: "in-review", label: "In Review" },
  { value: "resolved", label: "Resolved" },
];

function InquiriesManagerPage({ role = "editor" }) {
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);

  // Build query string
  const queryParams = new URLSearchParams();
  if (selectedSubject !== "all") queryParams.set("subject", selectedSubject);
  if (selectedStatus !== "all") queryParams.set("status", selectedStatus);

  const endpoint = `/contact/inquiries?${queryParams.toString()}`;
  const { data, loading, error, refetch } = useApi(endpoint);

  const inquiries = data?.inquiries || [];
  const total = data?.total || 0;

  async function handleStatusChange(id, newStatus) {
    setUpdatingId(id);
    setActionFeedback(null);
    try {
      await apiClient(`/contact/inquiries/${id}/status`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      setActionFeedback({
        tone: "info",
        message: `Inquiry marked as ${newStatus}.`,
      });
      refetch();
    } catch (err) {
      setActionFeedback({
        tone: "error",
        message: err.message || "Failed to update inquiry status.",
      });
    } finally {
      setUpdatingId(null);
    }
  }

  function formatDate(isoStr) {
    if (!isoStr) return "";
    return new Date(isoStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Reader Inquiries &amp; Editorial Feedback
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {role === "superadmin"
            ? "Administrative oversight for reader suggestions, editorial feedback, and support inquiries."
            : "Review reader article suggestions, editorial feedback, and general audience correspondence."}
        </p>
      </div>

      {actionFeedback && (
        <Feedback tone={actionFeedback.tone} role="status">
          {actionFeedback.message}
        </Feedback>
      )}

      {error && <Feedback tone="error">{error}</Feedback>}

      {/* ─── CUSTOM FILTER BAR ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] space-y-1">
          <label htmlFor="filter-subject" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Filter by Subject
          </label>
          <select
            id="filter-subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 outline-none transition-all cursor-pointer"
          >
            {SUBJECT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[180px] space-y-1">
          <label htmlFor="filter-status" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Filter by Status
          </label>
          <select
            id="filter-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 outline-none transition-all cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="self-end pb-1 text-xs text-slate-500 font-semibold">
          Showing {inquiries.length} of {total} items
        </div>
      </div>

      {/* ─── INQUIRIES LIST ─────────────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-100 p-6 h-36 animate-pulse" />
          ))}
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
          <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-100">
            ✉️
          </div>
          <h3 className="font-bold text-slate-800 text-base">No Inquiries Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            No reader inquiries match the selected filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((item) => {
            const isResolved = item.status === "resolved";
            const isInReview = item.status === "in-review";

            return (
              <div
                key={item._id || item.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs transition-all hover:border-slate-300 hover:shadow-md space-y-4"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                        isResolved
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : isInReview
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="font-bold text-slate-900 text-base">{item.subject}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{formatDate(item.createdAt)}</span>
                </div>

                {/* Message Body */}
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
                  {item.message}
                </p>

                {/* Footer Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs">
                  <div className="text-slate-600">
                    From: <strong className="text-slate-900">{item.name}</strong> (
                    <a
                      href={`mailto:${item.email}`}
                      className="text-teal-700 font-semibold hover:underline"
                    >
                      {item.email}
                    </a>
                    )
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status !== "in-review" && item.status !== "resolved" && (
                      <button
                        type="button"
                        disabled={updatingId === (item._id || item.id)}
                        onClick={() => handleStatusChange(item._id || item.id, "in-review")}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
                      >
                        Mark In Review
                      </button>
                    )}
                    {item.status !== "resolved" && (
                      <button
                        type="button"
                        disabled={updatingId === (item._id || item.id)}
                        onClick={() => handleStatusChange(item._id || item.id, "resolved")}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-700 text-white hover:bg-teal-800 shadow-xs transition-colors cursor-pointer"
                      >
                        ✓ Mark Resolved
                      </button>
                    )}
                    {item.status === "resolved" && (
                      <button
                        type="button"
                        disabled={updatingId === (item._id || item.id)}
                        onClick={() => handleStatusChange(item._id || item.id, "unread")}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default InquiriesManagerPage;
