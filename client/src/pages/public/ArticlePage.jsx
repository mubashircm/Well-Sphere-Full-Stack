import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import ArticleCard from "../../components/article/ArticleCard.jsx";
import HealthInformationBlocks from "../../components/article/HealthInformationBlocks.jsx";
import ListenToArticle from "../../components/article/ListenToArticle.jsx";
import ReadingProgress from "../../components/article/ReadingProgress.jsx";
import OptimizedImage from "../../components/media/OptimizedImage.jsx";
import Button from "../../components/ui/Button.jsx";
import Feedback from "../../components/ui/Feedback.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import { apiClient } from "../../services/api/client.js";
import { formatDate } from "../../data/articles.js";
import { useApi } from "../../hooks/useApi.js";
import Breadcrumb from "../../components/ui/Breadcrumb.jsx";

function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error } = useApi(`/articles/${slug}`);
  const [shared, setShared] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savePending, setSavePending] = useState(false);

  const article = data?.article ?? null;
  const related = data?.related ?? [];

  const text = useMemo(() => {
    if (!article) return "";
    return [
      article.title,
      article.excerpt,
      ...article.sections.flatMap((s) => [s.heading, s.body]),
      article.homeCare,
      article.lifestyle,
      article.exercise,
      article.seekCare,
    ]
      .filter(Boolean)
      .join(". ");
  }, [article]);

  useEffect(() => {
    if (article) document.title = `${article.title} | WellSphere`;
    return () => { document.title = "WellSphere"; };
  }, [article]);

  // After load, if article not found (404 error), redirect to search
  useEffect(() => {
    if (error && !loading) navigate("/search", { replace: true });
  }, [error, loading, navigate]);

  async function share() {
    const shareData = { title: article.title, text: article.excerpt, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(window.location.href);
      else return;
      setShared(true);
    } catch (err) {
      if (err.name !== "AbortError") setShared(false);
    }
  }

  async function toggleSave() {
    if (!user) return;
    setSavePending(true);
    try {
      const method = saved ? "DELETE" : "POST";
      await apiClient(`/articles/${slug}/save`, { method });
      setSaved((prev) => !prev);
    } catch {
      // silently ignore — button reverts to current state
    } finally {
      setSavePending(false);
    }
  }

  if (loading) {
    return (
      <div className="article-page">
        <div className="skeleton-line" aria-hidden="true" style={{ height: "1rem", maxWidth: "18rem", marginBottom: "0.5rem" }} />
        <div className="skeleton-line" aria-hidden="true" style={{ height: "2.5rem", maxWidth: "36rem", marginBottom: "1rem" }} />
        <div className="skeleton-block" aria-hidden="true" style={{ height: "18rem", marginBottom: "2rem" }} />
        {[1, 2, 3].map((n) => (
          <div key={n} style={{ marginBottom: "1.5rem" }}>
            <div className="skeleton-line skeleton-line--short" aria-hidden="true" style={{ height: "1.25rem", maxWidth: "14rem", marginBottom: "0.5rem" }} />
            <div className="skeleton-line skeleton-line--long" aria-hidden="true" />
            <div className="skeleton-line" aria-hidden="true" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <section className="page-section page-section--narrow">
        <Feedback tone="error">{error}</Feedback>
      </section>
    );
  }

  if (!article) return null;

  const topicName = article.topic?.name ?? "";
  const topicSlug = article.topic?.slug ?? "";
  const publishedAt = article.publishedAt ?? article.createdAt;

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: topicName || "Explore", to: topicSlug ? `/topics/${topicSlug}` : "/topics" },
    { label: article.title },
  ];

  return (
    <>
      <ReadingProgress />
      <article className="article-page">
        <Breadcrumb items={breadcrumbItems} />
        <header className="article-header">
          <NavLink className="article-card__topic" to={`/topics/${topicSlug}`}>{topicName}</NavLink>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
          <div className="article-meta">
            <span>WellSphere Editorial Team</span>
            <span>{formatDate(publishedAt)}</span>
            <span>{article.readingTime} min read</span>
          </div>
          <div className="article-actions">
            <ListenToArticle text={text} />
            <Button variant="ghost" type="button" onClick={share}>
              {shared ? "Link copied" : "Share article"}
            </Button>
            {user && (
              <Button variant="ghost" type="button" onClick={toggleSave} disabled={savePending}
                aria-pressed={saved}>
                {savePending ? "…" : saved ? "Saved ✓" : "Save article"}
              </Button>
            )}
          </div>
        </header>
        {article.featuredImage?.secureUrl || article.featuredImage?.url ? (
          <div className="article-hero-container" style={{ margin: "1.5rem 0", borderRadius: "12px", overflow: "hidden", maxHeight: "420px" }}>
            <OptimizedImage
              src={article.featuredImage.secureUrl || article.featuredImage.url}
              alt={article.featuredImage.alt || article.title}
              priority={true}
              style={{ maxHeight: "420px" }}
            />
          </div>
        ) : (
          <div className={`article-hero article-card__image--${article.accent}`} aria-hidden="true">
            <span>{topicName}</span>
          </div>
        )}
        <div className="article-content">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          <HealthInformationBlocks article={article} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="page-section related-articles">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Continue reading</p>
              <h2>More on {topicName}</h2>
            </div>
          </div>
          <div className="article-grid">
            {related.map((item) => <ArticleCard article={item} key={item.slug} />)}
          </div>
        </section>
      )}
    </>
  );
}

export default ArticlePage;
