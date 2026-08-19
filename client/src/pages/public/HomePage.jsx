import { Link } from "react-router-dom";
import ArticleCard from "../../components/article/ArticleCard.jsx";
import Feedback from "../../components/ui/Feedback.jsx";
import { useApi } from "../../hooks/useApi.js";

function ArticleSkeleton({ featured = false }) {
  if (featured) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 bg-slate-200 min-h-[300px]" />
          <div className="lg:col-span-5 p-8 space-y-4">
            <div className="h-4 bg-slate-200 rounded-full w-24" />
            <div className="h-8 bg-slate-200 rounded-lg w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
            <div className="h-10 bg-slate-200 rounded-full w-32 mt-6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse flex flex-col">
      <div className="aspect-[16/10] bg-slate-200 w-full" />
      <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="h-3 bg-slate-200 rounded-full w-20" />
          <div className="h-6 bg-slate-200 rounded-lg w-4/5" />
          <div className="h-3.5 bg-slate-200 rounded w-full" />
          <div className="h-3.5 bg-slate-200 rounded w-2/3" />
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <div className="h-4 bg-slate-200 rounded-full w-24" />
          <div className="h-4 bg-slate-200 rounded-full w-12" />
        </div>
      </div>
    </div>
  );
}

const DEFAULT_TOPIC_CATEGORIES = [
  {
    slug: "nutrition",
    name: "Nutrition & Diet",
    desc: "Whole foods, balanced energy & hydration",
    icon: (
      <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    bg: "bg-emerald-50 text-emerald-900 border-emerald-100",
  },
  {
    slug: "sleep",
    name: "Sleep & Recovery",
    desc: "Restful circadian habits & sleep hygiene",
    icon: (
      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    bg: "bg-indigo-50 text-indigo-900 border-indigo-100",
  },
  {
    slug: "mental-wellness",
    name: "Mental Wellness",
    desc: "Stress reduction, focus & calm routines",
    icon: (
      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    bg: "bg-purple-50 text-purple-900 border-purple-100",
  },
  {
    slug: "movement",
    name: "Active Living",
    desc: "Daily mobility, posture & safe exercise",
    icon: (
      <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    bg: "bg-teal-50 text-teal-900 border-teal-100",
  },
  {
    slug: "daily-habits",
    name: "Preventive Care",
    desc: "Evidence-aware habits for long-term health",
    icon: (
      <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    bg: "bg-rose-50 text-rose-900 border-rose-100",
  },
];

function HomePage() {
  const { data: articles, loading: articlesLoading, error: articlesError } = useApi("/articles?limit=7");
  const { data: topics, loading: topicsLoading, error: topicsError } = useApi("/topics");

  const featured = articles?.[0] ?? null;
  const latest = articles?.slice(1) ?? [];

  // Match or fallback topic categories
  const categories = (topics && topics.length > 0)
    ? topics.slice(0, 5).map((t, idx) => ({
        slug: t.slug,
        name: t.name,
        desc: t.description || DEFAULT_TOPIC_CATEGORIES[idx % DEFAULT_TOPIC_CATEGORIES.length].desc,
        icon: DEFAULT_TOPIC_CATEGORIES[idx % DEFAULT_TOPIC_CATEGORIES.length].icon,
        bg: DEFAULT_TOPIC_CATEGORIES[idx % DEFAULT_TOPIC_CATEGORIES.length].bg,
      }))
    : DEFAULT_TOPIC_CATEGORIES;

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12 animate-fade-in-up">
      {/* ─── 1. HERO SECTION (SPLIT GRID WITH INTERACTIVE CARD) ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline & Action CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200/60">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span>Evidence-Aware Health Insights</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
              Clear guidance for everyday health decisions.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl font-sans">
              Trusted, evidence-aware health education for everyday life—without diagnosis, prescriptions, or exaggerated claims.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/topics"
                className="bg-teal-700 hover:bg-teal-800 text-white font-medium px-7 py-3.5 rounded-full shadow-lg shadow-teal-700/20 hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <span>Explore Health Topics</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              <Link
                to="/health-disclaimer"
                className="bg-white hover:bg-slate-50 text-slate-700 font-medium px-6 py-3.5 rounded-full border border-slate-200 shadow-xs transition-all duration-300 hover:border-slate-300 text-sm sm:text-base"
              >
                Our Health Approach
              </Link>
            </div>
          </div>

          {/* Right Column: Glassmorphic Today's Wellness Focus Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-teal-50/90 via-emerald-50/60 to-white backdrop-blur-md border border-teal-100 rounded-3xl p-7 sm:p-8 shadow-xl shadow-teal-900/5 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
              {/* Background ambient glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-200/40 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-teal-900 bg-white/90 shadow-xs border border-teal-100">
                    <span className="text-teal-600">🌿</span>
                    <span>Daily Focus</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Editorial Standard</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                    Sustainable daily habits outperform extreme quick fixes.
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Consistent rest, nutrient-dense meals, and daily mobility create compounded resilience over time without aggressive regimens.
                  </p>
                </div>

                {/* 3 Quick Pillars */}
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <div className="bg-white/80 p-3 rounded-2xl border border-teal-50 text-center">
                    <span className="text-lg">💧</span>
                    <p className="text-xs font-bold text-slate-800 mt-1">Hydrate</p>
                    <p className="text-[10px] text-slate-500">Regular sips</p>
                  </div>
                  <div className="bg-white/80 p-3 rounded-2xl border border-teal-50 text-center">
                    <span className="text-lg">🌙</span>
                    <p className="text-xs font-bold text-slate-800 mt-1">7–8h Rest</p>
                    <p className="text-[10px] text-slate-500">Circadian flow</p>
                  </div>
                  <div className="bg-white/80 p-3 rounded-2xl border border-teal-50 text-center">
                    <span className="text-lg">🚶</span>
                    <p className="text-xs font-bold text-slate-800 mt-1">Movement</p>
                    <p className="text-[10px] text-slate-500">Daily walk</p>
                  </div>
                </div>

                {/* Clinical Disclaimer Tag */}
                <div className="pt-4 border-t border-teal-100/80 flex items-start gap-2.5 text-xs text-slate-500">
                  <span className="text-teal-700 font-bold shrink-0 mt-0.5">ℹ️</span>
                  <span>
                    Educational health content only. Always consult a qualified physician for specific clinical advice.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. HEALTH TOPICS & CATEGORIES SECTION ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold text-teal-800 uppercase tracking-widest mb-1.5">
              Explore by Focus
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Health Topics & Categories
            </h2>
          </div>
          <Link
            to="/topics"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-900 transition-colors"
          >
            <span>View all categories</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {topicsError && <Feedback tone="error">{topicsError}</Feedback>}

        {topicsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-100 p-5 h-36 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/topics/${cat.slug}`}
                className="bg-white hover:bg-teal-50/50 border border-slate-100 hover:border-teal-200/80 rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 shadow-xs hover:shadow-md flex flex-col items-center justify-center gap-2.5 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-white flex items-center justify-center border border-slate-100 group-hover:border-teal-100 shadow-2xs transition-colors">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-teal-900 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ─── 3. FEATURED SPOTLIGHT ARTICLE ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-bold text-teal-800 uppercase tracking-widest mb-1.5">
            Spotlight
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Featured Editorial Story
          </h2>
        </div>

        {articlesError && <Feedback tone="error">{articlesError}</Feedback>}

        {articlesLoading ? (
          <ArticleSkeleton featured={true} />
        ) : featured ? (
          <ArticleCard article={featured} featured={true} />
        ) : null}
      </section>

      {/* ─── 4. LATEST ARTICLES (3-COLUMN RESPONSIVE CARDS) ───────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold text-teal-800 uppercase tracking-widest mb-1.5">
              Fresh Insights
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Reliable reading for real life
            </h2>
          </div>

          <Link
            to="/search"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:text-teal-800 hover:border-teal-300 hover:bg-slate-50 transition-all self-start sm:self-auto"
          >
            <span>Search all articles</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {articlesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <ArticleSkeleton key={n} />
            ))}
          </div>
        ) : latest.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latest.map((article) => (
              <ArticleCard article={article} key={article.slug || article._id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-6 bg-slate-50 rounded-3xl border border-slate-200/70">
            <p className="text-base font-semibold text-slate-700">No additional articles published yet.</p>
            <p className="text-xs text-slate-500 mt-1">Check back soon as our editorial team publishes new research-backed guides.</p>
          </div>
        )}
      </section>

      {/* ─── 5. CALL TO ACTION & HEALTH TRUST BANNER ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-teal-950/20 relative overflow-hidden">
          {/* Ambient decorative blur */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-teal-200 bg-white/10 backdrop-blur-md border border-white/10">
              <span>A Responsible Starting Point</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Good information helps you ask better questions.
            </h2>

            <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
              Use our editorial articles to understand everyday health fundamentals, then seek individual clinical care when you need personal evaluation.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                to="/health-disclaimer"
                className="bg-white hover:bg-slate-100 text-teal-900 font-semibold px-6 py-3 rounded-full text-sm shadow-md transition-all hover:-translate-y-0.5"
              >
                Read Full Disclaimer
              </Link>
              <Link
                to="/contact"
                className="bg-teal-800/80 hover:bg-teal-800 text-white font-medium px-6 py-3 rounded-full text-sm border border-teal-700 transition-colors"
              >
                Editorial Inquiries
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
