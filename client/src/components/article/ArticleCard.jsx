import { Link } from "react-router-dom";
import { formatDate } from "../../data/articles.js";
import OptimizedImage from "../media/OptimizedImage.jsx";

function ArticleCard({ article, featured = false }) {
  if (!article) return null;

  const topicName = article.topic?.name ?? (typeof article.topic === "string" ? article.topic : "Wellness");
  const topicSlug = article.topic?.slug ?? "";
  const imageUrl = article.featuredImage?.secureUrl || article.featuredImage?.url;
  const authorName = article.author?.name || "WellSphere Editorial";

  // Accent gradient fallback when no image is uploaded
  const accentGradients = {
    sleep: "from-indigo-900 via-slate-800 to-slate-900",
    movement: "from-teal-900 via-emerald-800 to-slate-900",
    hydration: "from-sky-900 via-cyan-800 to-slate-900",
    nutrition: "from-emerald-900 via-teal-800 to-slate-900",
    headache: "from-amber-900 via-rose-900 to-slate-900",
    default: "from-teal-950 via-slate-900 to-stone-900",
  };
  const gradientClass = accentGradients[article.accent] || accentGradients.default;

  // Featured 2-Column Wide Spotlight Card
  if (featured) {
    return (
      <article className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Image / Visual Column */}
          <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[340px] lg:min-h-[420px] overflow-hidden bg-slate-900">
            <Link
              to={`/article/${article.slug}`}
              className="block w-full h-full"
              aria-label={`Read ${article.title}`}
            >
              {imageUrl ? (
                <div className="w-full h-full overflow-hidden">
                  <OptimizedImage
                    src={imageUrl}
                    alt={article.featuredImage?.alt || article.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    className="group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex flex-col justify-end p-8 text-white group-hover:scale-105 transition-transform duration-700`}>
                  <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal-300 mb-2">
                    {topicName}
                  </span>
                  <p className="text-2xl sm:text-3xl font-serif font-bold text-white leading-snug">
                    {article.title}
                  </p>
                </div>
              )}
            </Link>
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-teal-900 bg-white/95 backdrop-blur-md shadow-sm">
                ⭐ Featured Story
              </span>
            </div>
          </div>

          {/* Editorial Content Column */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Link
                  to={topicSlug ? `/topics/${topicSlug}` : "/topics"}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200/60 hover:bg-teal-100 transition-colors"
                >
                  {topicName}
                </Link>
                <span className="text-xs font-medium text-slate-400">
                  {article.readingTime || 4} min read
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 group-hover:text-teal-800 transition-colors leading-tight mb-4">
                <Link to={`/article/${article.slug}`}>
                  {article.title}
                </Link>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                {article.excerpt}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center border border-teal-200">
                  {authorName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">{authorName}</p>
                  <p className="text-[11px] text-slate-400">
                    {formatDate(article.publishedAt ?? article.createdAt)}
                  </p>
                </div>
              </div>

              <Link
                to={`/article/${article.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 group-hover:text-teal-900 transition-colors"
              >
                <span>Read Story</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard 3-Column Editorial Grid Card
  return (
    <article className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col overflow-hidden group h-full">
      {/* 16:9 Aspect Ratio Media Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <Link
          to={`/article/${article.slug}`}
          className="block w-full h-full"
          aria-label={`Read ${article.title}`}
        >
          {imageUrl ? (
            <OptimizedImage
              src={imageUrl}
              alt={article.featuredImage?.alt || article.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              className="group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex flex-col justify-end p-5 text-white group-hover:scale-105 transition-transform duration-500`}>
              <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
                {topicName}
              </span>
            </div>
          )}
        </Link>
        <div className="absolute top-3.5 left-3.5">
          <Link
            to={topicSlug ? `/topics/${topicSlug}` : "/topics"}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-teal-900 bg-white/95 backdrop-blur-md shadow-xs hover:bg-teal-50 transition-colors"
          >
            {topicName}
          </Link>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2.5">
            <span>{formatDate(article.publishedAt ?? article.createdAt)}</span>
            <span>•</span>
            <span>{article.readingTime || 4} min read</span>
          </div>

          <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 group-hover:text-teal-800 transition-colors leading-snug line-clamp-2 mb-2.5">
            <Link to={`/article/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {article.excerpt}
          </p>
        </div>

        {/* Card Footer with Author & Arrow */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center border border-teal-100">
              {authorName.charAt(0)}
            </div>
            <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">
              {authorName}
            </span>
          </div>

          <Link
            to={`/article/${article.slug}`}
            className="text-xs font-bold text-teal-700 group-hover:text-teal-900 inline-flex items-center gap-1 transition-colors"
            aria-label={`Read ${article.title}`}
          >
            <span>Read</span>
            <svg
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;
