import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ArticleCard from "../../components/article/ArticleCard.jsx";
import Feedback from "../../components/ui/Feedback.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import { apiClient } from "../../services/api/client.js";
import { useApi } from "../../hooks/useApi.js";
import { formatDate } from "../../data/articles.js";
import Breadcrumb from "../../components/ui/Breadcrumb.jsx";

// ─── 1. SAVED ARTICLES VIEW ───────────────────────────────────────────────────

function SavedView() {
  const { data: articles, loading, error } = useApi("/profile/saved");
  const [localArticles, setLocalArticles] = useState(null);
  const [removingSlug, setRemovingSlug] = useState(null);

  const displayedArticles = localArticles ?? articles;

  async function handleRemove(slug) {
    setRemovingSlug(slug);
    try {
      await apiClient(`/articles/${slug}/save`, { method: "DELETE" });
      setLocalArticles((prev) => (prev ?? articles ?? []).filter((a) => a.slug !== slug));
    } catch {
      // ignore
    } finally {
      setRemovingSlug(null);
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((n) => (
          <div key={n} className="bg-white rounded-2xl border border-slate-100 p-6 h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) return <Feedback tone="error" role="alert">{error}</Feedback>;

  if (!displayedArticles || displayedArticles.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-100/60">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">
          Your Reading Library is Empty
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
          Save helpful guides, nutrition tips, and home care practices while browsing to access them quickly here anytime.
        </p>
        <Link
          to="/topics"
          className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-medium px-6 py-3 rounded-full text-sm shadow-md transition-all hover:-translate-y-0.5"
        >
          <span>Explore Health Topics</span>
          <span>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {displayedArticles.length} Saved {displayedArticles.length === 1 ? "Guide" : "Guides"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedArticles.map((article) => (
          <div key={article.slug || article._id} className="relative group">
            <ArticleCard article={article} />
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => handleRemove(article.slug)}
                disabled={removingSlug === article.slug}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>{removingSlug === article.slug ? "Removing…" : "✕ Remove from Saved"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 2. FOLLOWING TOPICS VIEW ─────────────────────────────────────────────────

function FollowingView() {
  const { data: topics, loading, error } = useApi("/profile/following");
  const [unfollowing, setUnfollowing] = useState(null);
  const [localTopics, setLocalTopics] = useState(null);

  const displayed = localTopics ?? topics;

  async function unfollow(slug) {
    setUnfollowing(slug);
    try {
      await apiClient(`/topics/${slug}/follow`, { method: "DELETE" });
      setLocalTopics((prev) => (prev ?? topics ?? []).filter((t) => t.slug !== slug));
    } catch {
      // silently ignore
    } finally {
      setUnfollowing(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((n) => (
          <div key={n} className="bg-white rounded-2xl border border-slate-100 p-5 h-20 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) return <Feedback tone="error" role="alert">{error}</Feedback>;

  if (!displayed || displayed.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100/60">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
        </div>
        <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">
          Not Following Any Topics Yet
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
          Follow health topics you are interested in (like Sleep, Nutrition, or Mental Wellness) to tailor your reading feed.
        </p>
        <Link
          to="/topics"
          className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-medium px-6 py-3 rounded-full text-sm shadow-md transition-all hover:-translate-y-0.5"
        >
          <span>Browse Health Categories</span>
          <span>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayed.map((topic) => (
        <div
          key={topic.slug}
          className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-200"
        >
          <div>
            <Link
              to={`/topics/${topic.slug}`}
              className="text-base font-bold text-slate-900 hover:text-teal-800 transition-colors"
            >
              {topic.name}
            </Link>
            {topic.description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                {topic.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to={`/topics/${topic.slug}`}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900"
            >
              Explore →
            </Link>
            <button
              type="button"
              disabled={unfollowing === topic.slug}
              onClick={() => unfollow(topic.slug)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-600 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
            >
              {unfollowing === topic.slug ? "Unfollowing…" : "Unfollow"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── 3. NOTIFICATIONS VIEW ────────────────────────────────────────────────────

function NotificationsView() {
  const { data: notifications, loading, error } = useApi("/profile/notifications");
  const [markedRead, setMarkedRead] = useState(false);
  const [marking, setMarking] = useState(false);

  async function markAllRead() {
    setMarking(true);
    try {
      await apiClient("/profile/notifications/read", { method: "PATCH" });
      setMarkedRead(true);
    } catch {
      // ignore
    } finally {
      setMarking(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-2xl border border-slate-100 p-5 h-20 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) return <Feedback tone="error" role="alert">{error}</Feedback>;

  const unreadCount = (notifications ?? []).filter((n) => !n.read && !markedRead).length;

  if (!notifications || notifications.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </div>
        <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">
          No Notifications
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          You are all caught up! Updates regarding your saved articles, topic releases, and discussions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && !markedRead && (
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
            {unreadCount} new {unreadCount === 1 ? "notice" : "notices"}
          </span>
          <button
            type="button"
            disabled={marking}
            onClick={markAllRead}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
          >
            {marking ? "Marking…" : "Mark all as read"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((n) => {
          const isRead = n.read || markedRead;
          return (
            <div
              key={n._id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isRead
                  ? "bg-white border-slate-100 text-slate-600"
                  : "bg-teal-50/40 border-teal-100 text-slate-900 shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-relaxed">{n.message}</p>
                  <p className="text-[11px] text-slate-400">{formatDate(n.createdAt)}</p>
                </div>
                {n.link && (
                  <Link
                    to={n.link}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900 shrink-0"
                  >
                    View →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 4. COMMENTS VIEW ─────────────────────────────────────────────────────────

function CommentsView() {
  const { data: comments, loading, error } = useApi("/profile/comments");

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((n) => (
          <div key={n} className="bg-white rounded-2xl border border-slate-100 p-5 h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) return <Feedback tone="error" role="alert">{error}</Feedback>;

  if (!comments || comments.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
        <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-sky-100/60">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v5.018z" />
          </svg>
        </div>
        <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">
          No Discussions Yet
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Share thoughtful questions or insights on any article to join the WellSphere community conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((c) => (
        <div key={c._id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <Link
              to={`/article/${c.article?.slug}`}
              className="text-sm font-bold text-slate-900 hover:text-teal-800 transition-colors"
            >
              {c.article?.title || "Article Discussion"}
            </Link>
            <span className="text-[11px] text-slate-400">{formatDate(c.createdAt)}</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100/60">
            "{c.text}"
          </p>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>❤️ {c.likes || 0} {c.likes === 1 ? "like" : "likes"}</span>
            <Link to={`/article/${c.article?.slug}`} className="text-teal-700 font-semibold hover:underline">
              View thread →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── 5. SETTINGS VIEW ─────────────────────────────────────────────────────────

function SettingsView() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [digestEnabled, setDigestEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const result = await apiClient("/profile", {
        method: "PATCH",
        body: { name: name.trim() },
      });
      setUser((prev) => ({ ...prev, name: result.name }));
      setMessage("Your account profile preferences have been successfully updated.");
    } catch (err) {
      setError(err.message || "Could not save preferences.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Profile Header Snippet */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-700 to-emerald-800 text-white font-serif font-bold text-2xl flex items-center justify-center shadow-md shadow-teal-900/10 shrink-0">
          {userInitial}
        </div>
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900">{user?.name}</h2>
          <p className="text-xs text-slate-500">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-100">
              {user?.role || "Member"}
            </span>
            <span className="text-[11px] text-slate-400">
              Active Member
            </span>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={submit} className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
        {message && <Feedback tone="info" role="status">{message}</Feedback>}
        {error && <Feedback tone="error" role="alert">{error}</Feedback>}

        {/* Section 1: Personal Info */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Personal Information
          </h3>

          <div className="space-y-1.5">
            <label htmlFor="settings-name" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Display Name
            </label>
            <input
              id="settings-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 text-sm transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="settings-email" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Email Address
            </label>
            <input
              id="settings-email"
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
            />
            <p className="text-[11px] text-slate-400">
              Account email is verified and cannot be changed directly.
            </p>
          </div>
        </div>

        {/* Section 2: Notification Preferences */}
        <div className="space-y-4 pt-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Notification Preferences
          </h3>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={digestEnabled}
              onChange={(e) => setDigestEnabled(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
            />
            <div>
              <strong className="text-sm font-semibold text-slate-800">Weekly Health Digest</strong>
              <p className="text-xs text-slate-500">Curated weekend digest of newly published lifestyle guides.</p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={alertsEnabled}
              onChange={(e) => setAlertsEnabled(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
            />
            <div>
              <strong className="text-sm font-semibold text-slate-800">Topic Release Alerts</strong>
              <p className="text-xs text-slate-500">Receive alerts when new articles are added to your followed topics.</p>
            </div>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-6 py-3 rounded-full text-sm shadow-md transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            {saving ? "Saving Changes…" : "Save Preferences"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── ROUTE MAP & VIEW CONTAINER ──────────────────────────────────────────────

const VIEWS = {
  "/profile/saved": ["Saved Library", SavedView, "Articles and home care guides you've bookmarked."],
  "/profile/following": ["Followed Topics", FollowingView, "Categories you receive tailored updates for."],
  "/profile/notifications": ["Notifications", NotificationsView, "System notices, updates, and discussions."],
  "/profile/comments": ["Community Discussions", CommentsView, "Your shared insights and questions on articles."],
  "/profile/settings": ["Account Settings", SettingsView, "Update your profile and notification preferences."],
};

function ProfilePage() {
  const { pathname } = useLocation();
  const [title, View, subtitle] = VIEWS[pathname] ?? ["Account Settings", SettingsView, ""];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Dashboard", to: "/dashboard" },
          { label: title },
        ]}
      />

      <div className="border-b border-slate-200/70 pb-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <View />
    </div>
  );
}

export default ProfilePage;
