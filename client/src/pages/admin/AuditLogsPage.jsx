import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Feedback from "../../components/ui/Feedback.jsx";
import { useApi } from "../../hooks/useApi.js";
import { formatDate } from "../../data/articles.js";

function getActionBadge(action) {
  const normalized = (action || "").toUpperCase();
  if (normalized.includes("APPROVE")) {
    return <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">{action}</span>;
  }
  if (normalized.includes("REJECT") || normalized.includes("LOCKDOWN")) {
    return <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">{action}</span>;
  }
  if (normalized.includes("ROLE") || normalized.includes("SECURITY")) {
    return <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-purple-50 text-purple-800 border border-purple-200">{action}</span>;
  }
  return <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">{action}</span>;
}

function AuditLogsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentAction = searchParams.get("action") || "all";
  const currentTarget = searchParams.get("targetType") || "all";

  const queryPath = useMemo(() => {
    const params = new URLSearchParams();
    if (currentAction && currentAction !== "all") params.set("action", currentAction);
    if (currentTarget && currentTarget !== "all") params.set("targetType", currentTarget);
    const qStr = params.toString();
    return `/admin/audit-logs${qStr ? `?${qStr}` : ""}`;
  }, [currentAction, currentTarget]);

  const { data, loading, error } = useApi(queryPath);
  const logs = data?.logs || [];

  function setActionFilter(act) {
    if (act === "all") searchParams.delete("action");
    else searchParams.set("action", act);
    setSearchParams(searchParams);
  }

  function setTargetFilter(target) {
    if (target === "all") searchParams.delete("targetType");
    else searchParams.set("targetType", target);
    setSearchParams(searchParams);
  }

  const actionTabs = [
    { key: "all", label: "All Actions" },
    { key: "ARTICLE_APPROVED", label: "Approvals" },
    { key: "CHANGES_REQUESTED", label: "Changes Requested" },
    { key: "ARTICLE_REJECTED", label: "Rejections" },
    { key: "USER_ROLE_CHANGED", label: "Role Changes" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Security &amp; Governance Audit Trail
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Chronological, immutable audit trail of content approvals, role modifications, and system configuration changes.
        </p>
      </div>

      {/* ─── FILTER BAR ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Action Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto">
          {actionTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                currentAction === tab.key
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setActionFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Target Select */}
        <div className="w-full md:w-56">
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 outline-none cursor-pointer"
            value={currentTarget}
            onChange={(e) => setTargetFilter(e.target.value)}
            aria-label="Filter by target type"
          >
            <option value="all">All Target Types</option>
            <option value="Article">Articles Only</option>
            <option value="User">Users Only</option>
            <option value="System">System Config Only</option>
          </select>
        </div>
      </div>

      {error && <Feedback tone="error">{error}</Feedback>}

      {/* ─── LOGS FEED ──────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-100 p-6 h-28 animate-pulse" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
          <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-100">
            🛡️
          </div>
          <h3 className="font-bold text-slate-800 text-base">No Audit Events Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            No administrative events match the selected criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-3 transition-all hover:border-slate-300"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  {getActionBadge(log.action)}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-100">
                    {log.targetType}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">{formatDate(log.createdAt)}</span>
              </div>

              {/* Body */}
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                <p>
                  <strong>Actor:</strong> {log.actor?.name || "SuperAdmin"}{" "}
                  <span className="text-slate-400 font-mono">({log.actor?.email || "system"})</span>
                </p>

                {log.details && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 font-mono">
                    {log.details.title && (
                      <div>
                        <strong className="text-slate-700 font-sans">Article Title:</strong> “{log.details.title}”
                      </div>
                    )}
                    {log.details.targetEmail && (
                      <div>
                        <strong className="text-slate-700 font-sans">Target User:</strong> {log.details.targetName} ({log.details.targetEmail})
                      </div>
                    )}
                    {log.details.newRole && (
                      <div>
                        <strong className="text-slate-700 font-sans">Role Transition:</strong> {log.details.previousRole} → <strong className="text-teal-800">{log.details.newRole}</strong>
                      </div>
                    )}
                    {log.details.notes && (
                      <div>
                        <strong className="text-slate-700 font-sans">Reviewer Notes:</strong> {log.details.notes}
                      </div>
                    )}
                    {log.details.reason && (
                      <div>
                        <strong className="text-slate-700 font-sans">Reason:</strong> {log.details.reason}
                      </div>
                    )}
                    {log.details.updatedKeys && (
                      <div>
                        <strong className="text-slate-700 font-sans">Config Keys Updated:</strong>{" "}
                        {log.details.updatedKeys.map((k) => k.key).join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Meta IP / UserAgent */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-100">
                <span>IP Address: {log.ip || "127.0.0.1"}</span>
                <span title={log.userAgent}>Agent: {log.userAgent ? log.userAgent.slice(0, 35) + "…" : "Direct API"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AuditLogsPage;
