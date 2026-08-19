import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ArticleCard from "../../components/article/ArticleCard.jsx";
import Feedback from "../../components/ui/Feedback.jsx";
import { useApi } from "../../hooks/useApi.js";

const POPULAR_TAGS = [
  "Sleep Hygiene",
  "Mindful Nutrition",
  "Stress & Anxiety",
  "Daily Mobility",
  "Gut Health",
  "Morning Routine",
];

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [sortBy, setSortBy] = useState("relevant");

  // Fetch topics for filter dropdown
  const { data: topicsData } = useApi("/topics");
  const topics = topicsData || [];

  // Default browse articles
  const { data: defaultData, loading: defaultLoading } = useApi("/articles?limit=12");

  // Dynamic search path
  const searchPath = submittedQuery.trim().length >= 2
    ? `/search?q=${encodeURIComponent(submittedQuery.trim())}`
    : null;
  const { data: searchResults, loading: searchLoading, error: searchError } = useApi(searchPath);

  function executeSearch(searchVal) {
    const clean = searchVal.trim();
    setSubmittedQuery(clean);
    if (clean) {
      setSearchParams({ q: clean });
    } else {
      setSearchParams({});
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    executeSearch(query);
  }

  function handleTagClick(tag) {
    setQuery(tag);
    executeSearch(tag);
  }

  function clearSearch() {
    setQuery("");
    executeSearch("");
  }

  const isSearching = Boolean(submittedQuery.trim());
  const loading = isSearching ? searchLoading : defaultLoading;

  // Filter and sort client-side results
  const filteredAndSortedResults = useMemo(() => {
    const base = isSearching ? searchResults ?? [] : defaultData ?? [];
    let list = [...base];

    // Filter by topic
    if (selectedTopic !== "all") {
      list = list.filter((article) => {
        const tId = article.topic?._id || article.topic;
        const tSlug = article.topic?.slug;
        return tId === selectedTopic || tSlug === selectedTopic;
      });
    }

    // Sort by criteria
    if (sortBy === "latest") {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === "reading-time") {
      list.sort((a, b) => (a.readingTime || 0) - (b.readingTime || 0));
    }

    return list;
  }, [isSearching, searchResults, defaultData, selectedTopic, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 animate-fade-in-up">
      {/* ─── 1. HERO SECTION & SEARCH BAR ───────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200/60 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
          <span>Evidence-Based Health Library</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-[1.15]">
          Find Trustworthy Health Guidance
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Explore evidence-aware guides, practical lifestyle steps, and wellness topics curated by health editors.
        </p>

        {/* Interactive Search Bar Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl w-full mx-auto relative mt-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>

          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symptoms, habits, sleep, nutrition, mobility…"
            className="w-full pl-12 pr-28 py-4 bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-100/70 text-slate-800 placeholder-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 outline-none text-sm sm:text-base transition-all font-medium"
          />

          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all active:scale-95 shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {/* ─── 2. TRENDING / POPULAR TAGS ──────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs font-semibold text-slate-400 mr-1">Popular:</span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-teal-50 text-slate-600 hover:text-teal-800 border border-slate-200 hover:border-teal-200 transition-all cursor-pointer shadow-2xs hover:-translate-y-0.5"
            >
              <span>🔍</span>
              <span>{tag}</span>
            </button>
          ))}
        </div>
      </div>

      {searchError && (
        <div className="max-w-2xl mx-auto">
          <Feedback tone="error" role="alert">
            {searchError}
          </Feedback>
        </div>
      )}

      {/* ─── 3. FACETED FILTERS & SORT CONTROLS ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-slate-900">
            {isSearching ? (
              <>
                Showing {filteredAndSortedResults.length} {filteredAndSortedResults.length === 1 ? "result" : "results"} for{" "}
                <span className="text-teal-800 font-serif italic">“{submittedQuery}”</span>
              </>
            ) : (
              `Curated Health Guides (${filteredAndSortedResults.length})`
            )}
          </span>
          {isSearching && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 ml-2 cursor-pointer bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100 transition-colors"
            >
              ✕ Clear Query
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Topic Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <label htmlFor="search-topic-filter" className="shrink-0 font-bold uppercase tracking-wider text-[11px] text-slate-400">
              Topic:
            </label>
            <select
              id="search-topic-filter"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 outline-none cursor-pointer"
            >
              <option value="all">All Topics</option>
              {topics.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <label htmlFor="search-sort-filter" className="shrink-0 font-bold uppercase tracking-wider text-[11px] text-slate-400">
              Sort:
            </label>
            <select
              id="search-sort-filter"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 outline-none cursor-pointer"
            >
              <option value="relevant">Most Relevant</option>
              <option value="latest">Latest Published</option>
              <option value="reading-time">Shortest Read</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── 4. SEARCH RESULTS GRID ─────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-xs">
              <div className="h-44 bg-slate-100 rounded-2xl" />
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="h-6 bg-slate-200 rounded w-5/6" />
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredAndSortedResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedResults.map((article) => (
            <ArticleCard article={article} key={article.slug || article._id} />
          ))}
        </div>
      ) : (
        /* ─── 5. EMPTY STATE & FALLBACK ───────────────────────────────────── */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-xs space-y-4">
          <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mx-auto text-2xl border border-teal-100">
            🔍
          </div>
          <h3 className="font-serif text-2xl font-bold text-slate-900">
            No exact matches found for “{submittedQuery}”
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            We couldn't find guides matching your exact search terms. Try searching broader keywords like <strong className="text-slate-700">“sleep”</strong>, <strong className="text-slate-700">“stress”</strong>, or browse our categorized topic directory.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={clearSearch}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Show All Guides
            </button>
            <Link
              to="/topics"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-700 text-white hover:bg-teal-800 shadow-md transition-all hover:-translate-y-0.5"
            >
              Browse All Topics →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
