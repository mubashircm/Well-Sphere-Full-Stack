import { Link } from "react-router-dom";
import Feedback from "../../components/ui/Feedback.jsx";
import { useApi } from "../../hooks/useApi.js";

function EditorAnalyticsPage() {
  const { data: stats, loading, error } = useApi("/editor/analytics");

  const total = stats?.total || 0;
  const published = stats?.published || 0;
  const inReview = stats?.["pending-review"] || 0;
  const drafts = stats?.draft || 0;
  const changes = stats?.["changes-requested"] || 0;

  const publishedPercent = total > 0 ? Math.round((published / total) * 100) : 0;
  const inReviewPercent = total > 0 ? Math.round((inReview / total) * 100) : 0;
  const draftPercent = total > 0 ? Math.round((drafts / total) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* ─── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Editorial Velocity &amp; Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track publication throughput, review turnaround rates, and editorial framework compliance.
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

      {error && <Feedback tone="error">{error}</Feedback>}

      {loading ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-32 bg-white rounded-2xl border border-slate-100 p-6" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* ─── 1. KEY METRICS GRID ────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Articles */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Lifetime Contributions
              </span>
              <div className="text-3xl font-bold font-sans text-slate-900 tracking-tight my-2">
                {total}
              </div>
              <p className="text-xs text-slate-400 font-medium">All articles authored</p>
            </div>

            {/* Published Live */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Live Published
              </span>
              <div className="text-3xl font-bold font-sans text-emerald-800 tracking-tight my-2">
                {published}
              </div>
              <p className="text-xs text-emerald-700 font-medium">{publishedPercent}% publication rate</p>
            </div>

            {/* In Review */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Awaiting Approval
              </span>
              <div className="text-3xl font-bold font-sans text-amber-800 tracking-tight my-2">
                {inReview}
              </div>
              <p className="text-xs text-amber-700 font-medium">{inReviewPercent}% in review queue</p>
            </div>

            {/* Revisions */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Changes Requested
              </span>
              <div className="text-3xl font-bold font-sans text-rose-800 tracking-tight my-2">
                {changes}
              </div>
              <p className="text-xs text-rose-700 font-medium">Awaiting author revisions</p>
            </div>
          </div>

          {/* ─── 2. DISTRIBUTION PROGRESS BAR ───────────────────────────────── */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Content Pipeline Distribution
            </h2>

            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 transition-all duration-500"
                style={{ width: `${publishedPercent}%` }}
                title={`Published: ${publishedPercent}%`}
              />
              <div
                className="bg-amber-400 transition-all duration-500"
                style={{ width: `${inReviewPercent}%` }}
                title={`In Review: ${inReviewPercent}%`}
              />
              <div
                className="bg-slate-300 transition-all duration-500"
                style={{ width: `${draftPercent}%` }}
                title={`Drafts: ${draftPercent}%`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium pt-2">
              <span className="inline-flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Published ({published})</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>In Review ({inReview})</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span>Drafts ({drafts})</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span>Revisions ({changes})</span>
              </span>
            </div>
          </section>

          {/* ─── 3. CLINICAL & QUALITY STANDARDS ────────────────────────────── */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Editorial Quality Standards &amp; Principles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span>🩺</span>
                  <span>Responsible Communication</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Articles prioritize clarity, calming tone, and safety over alarmism. Never diagnose or promise absolute cures.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span>📚</span>
                  <span>Evidence-Aware Citations</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Always verify guidelines against established health agencies (WHO, NHS, CDC) and link authoritative references.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span>👁️</span>
                  <span>Accessible Language</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Maintain high readability, concise paragraphs, and structured callouts for public accessibility.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default EditorAnalyticsPage;
