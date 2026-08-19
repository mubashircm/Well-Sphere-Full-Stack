import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import ArticleCard from "../../components/article/ArticleCard.jsx";
import { useApi } from "../../hooks/useApi.js";
import Breadcrumb from "../../components/ui/Breadcrumb.jsx";

function UserDashboardPage() {
  const { user } = useAuth();
  const { data: savedArticles } = useApi("/profile/saved");
  const { data: followedTopics } = useApi("/profile/following");
  const { data: userComments } = useApi("/profile/comments");
  const { data: recommendedArticles, loading: recLoading } = useApi("/articles?limit=3");

  const savedCount = savedArticles?.length ?? 0;
  const followingCount = followedTopics?.length ?? 0;
  const commentsCount = userComments?.length ?? 0;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "User Workspace", to: "/dashboard" },
          { label: "Overview" },
        ]}
      />

      {/* ─── 1. WELCOME HERO BANNER ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-teal-950/20 relative overflow-hidden">
        {/* Ambient decorative glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-teal-200 bg-white/10 backdrop-blur-md border border-white/10">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>Personal Wellness Hub</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Welcome back, {user?.name || "Reader"} 👋
          </h1>

          <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
            Your personal reading library and account hub. Access bookmarked evidence-aware guides, manage followed topics, and engage in thoughtful community health discussions.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/topics"
              className="bg-white hover:bg-teal-50 text-teal-900 font-semibold px-5 py-2.5 rounded-full text-xs sm:text-sm shadow-md transition-all hover:-translate-y-0.5"
            >
              Explore Health Topics
            </Link>
            <Link
              to="/profile/saved"
              className="bg-teal-700/80 hover:bg-teal-700 text-white font-medium px-5 py-2.5 rounded-full text-xs sm:text-sm border border-teal-600 transition-colors"
            >
              View Saved Articles ({savedCount})
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 2. QUICK STATS COUNTER CARDS ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1: Saved Articles */}
        <Link
          to="/profile/saved"
          className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </span>
            <span className="text-2xl font-serif font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              {savedCount}
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-800">Saved Articles</h3>
          <p className="text-xs text-slate-500 mt-0.5">Quick access library</p>
        </Link>

        {/* Card 2: Followed Topics */}
        <Link
          to="/profile/following"
          className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </span>
            <span className="text-2xl font-serif font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
              {followingCount}
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-800">Topics Followed</h3>
          <p className="text-xs text-slate-500 mt-0.5">Categories you track</p>
        </Link>

        {/* Card 3: Community Discussions */}
        <Link
          to="/profile/comments"
          className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v5.018z" />
              </svg>
            </span>
            <span className="text-2xl font-serif font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
              {commentsCount}
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-800">My Comments</h3>
          <p className="text-xs text-slate-500 mt-0.5">Community discussions</p>
        </Link>
      </div>

      {/* ─── 3. RECOMMENDED READING SECTION ───────────────────────────────────── */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              Recommended for your wellness
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Handpicked evidence-aware guides based on clinical research fundamentals.
            </p>
          </div>

          <Link
            to="/search"
            className="text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
          >
            <span>Search library</span>
            <span>→</span>
          </Link>
        </div>

        {recLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-100 p-6 h-64 animate-pulse" />
            ))}
          </div>
        ) : (recommendedArticles ?? []).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedArticles.map((article) => (
              <ArticleCard article={article} key={article.slug || article._id} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-100">
            <p className="text-sm text-slate-500">Explore our health topics to discover more guides.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default UserDashboardPage;
