import { useState } from "react";
import Feedback from "../../components/ui/Feedback.jsx";
import { useApi } from "../../hooks/useApi.js";
import { apiClient } from "../../services/api/client.js";

function SettingsForm({ initialSettings }) {
  const [emergencyMaintenance, setEmergencyMaintenance] = useState(
    Boolean(initialSettings?.emergencyMaintenance)
  );
  const [publicRegistration, setPublicRegistration] = useState(
    initialSettings?.publicRegistration !== false
  );
  const [autoApproveComments, setAutoApproveComments] = useState(
    initialSettings?.autoApproveComments !== false
  );
  const [siteName, setSiteName] = useState(initialSettings?.siteName || "WellSphere");
  const [announcementBanner, setAnnouncementBanner] = useState(
    initialSettings?.announcementBanner || ""
  );

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const updated = await apiClient("/admin/settings", {
        method: "PATCH",
        body: {
          emergencyMaintenance,
          publicRegistration,
          autoApproveComments,
          siteName: siteName.trim(),
          announcementBanner: announcementBanner.trim(),
        },
      });

      setFeedback({
        tone: "info",
        message: "System configuration updated and synchronized across platform clusters.",
      });

      if (updated) {
        setEmergencyMaintenance(Boolean(updated.emergencyMaintenance));
        setPublicRegistration(updated.publicRegistration !== false);
        setAutoApproveComments(updated.autoApproveComments !== false);
        setSiteName(updated.siteName || "WellSphere");
        setAnnouncementBanner(updated.announcementBanner || "");
      }
    } catch (err) {
      setFeedback({ tone: "error", message: err.message || "Failed to update settings." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <Feedback tone={feedback.tone} role="status">
          {feedback.message}
        </Feedback>
      )}

      {emergencyMaintenance && (
        <div className="border border-rose-300 bg-rose-50 text-rose-900 rounded-2xl p-5 shadow-xs flex items-start gap-4">
          <span className="text-2xl">⚠️</span>
          <div>
            <strong className="font-bold text-sm block">Emergency Lockdown Mode is Active</strong>
            <p className="text-xs text-rose-700 mt-0.5">
              Public article browsing and non-administrative write operations are constrained.
            </p>
          </div>
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSave}>
        {/* ─── 1. EMERGENCY & LOCKDOWN ZONE ───────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-rose-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="border-b border-rose-100 pb-3">
            <h3 className="text-base font-bold text-rose-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Emergency & Maintenance Lockdown
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Use in the event of platform maintenance, critical security reviews, or content database audits.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <div>
              <strong className="text-sm font-semibold text-slate-900 block">
                Enable Emergency Platform Lockdown
              </strong>
              <p className="text-xs text-slate-500">
                Temporarily locks editing workflows and presents a global maintenance banner to visitors.
              </p>
            </div>

            {/* iOS-Style Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={emergencyMaintenance}
                onChange={(e) => setEmergencyMaintenance(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600" />
            </label>
          </div>
        </div>

        {/* ─── 2. ACCESS & REGISTRATION POLICIES ────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Registration & Moderation Policies
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Control member onboarding and community interaction boundaries.
            </p>
          </div>

          {/* Toggle 1: Public Registration */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <strong className="text-sm font-semibold text-slate-900 block">
                Allow Public Account Registration
              </strong>
              <p className="text-xs text-slate-500">
                When disabled, new visitors cannot create user accounts (/register is disabled).
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={publicRegistration}
                onChange={(e) => setPublicRegistration(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

          {/* Toggle 2: Comment Auto-Approval */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div>
              <strong className="text-sm font-semibold text-slate-900 block">
                Auto-Approve Reader Comments
              </strong>
              <p className="text-xs text-slate-500">
                Comments post live immediately unless flagged. When disabled, all comments require manual review.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={autoApproveComments}
                onChange={(e) => setAutoApproveComments(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>
        </div>

        {/* ─── 3. BRAND IDENTITY & ANNOUNCEMENTS ───────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Platform Identity & System Announcements
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Global platform title and broadcast banner controls.
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="settings-site-name" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Platform Title Name
            </label>
            <input
              id="settings-site-name"
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 text-sm transition-all bg-white"
            />
          </div>

          <div className="space-y-1.5 pt-2">
            <label htmlFor="settings-announcement" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Global Header Announcement Banner (Optional)
            </label>
            <textarea
              id="settings-announcement"
              rows={2}
              placeholder="e.g. Seasonal wellness and clinical review updates for August 2026."
              value={announcementBanner}
              onChange={(e) => setAnnouncementBanner(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 text-sm transition-all bg-white"
            />
          </div>
        </div>

        {/* Form Action Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-md transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Saving Configuration…</span>
              </>
            ) : (
              "Save Configuration"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function SystemSettingsPage() {
  const { data: initialSettings, loading, error } = useApi("/admin/settings");

  return (
    <div className="space-y-8 animate-fade-in-up max-w-3xl">
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Global System Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure platform defaults, user registration flags, comment moderation, and emergency controls.
        </p>
      </div>

      {error && <Feedback tone="error">{error}</Feedback>}

      {loading ? (
        <div className="h-64 bg-white rounded-2xl border border-slate-100 p-8 animate-pulse" />
      ) : (
        <SettingsForm initialSettings={initialSettings} />
      )}
    </div>
  );
}

export default SystemSettingsPage;
