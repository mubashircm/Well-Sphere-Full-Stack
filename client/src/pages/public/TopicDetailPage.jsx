import { useState } from "react";
import { useParams } from "react-router-dom";
import ArticleCard from "../../components/article/ArticleCard.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Feedback from "../../components/ui/Feedback.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import { apiClient } from "../../services/api/client.js";
import { useApi } from "../../hooks/useApi.js";
import Breadcrumb from "../../components/ui/Breadcrumb.jsx";

function TopicDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { data, loading, error } = useApi(`/topics/${slug}`);
  const [following, setFollowing] = useState(false);
  const [followPending, setFollowPending] = useState(false);

  const topic = data?.topic ?? null;
  const articles = data?.articles ?? [];

  async function toggleFollow() {
    if (!user) return;
    setFollowPending(true);
    try {
      const method = following ? "DELETE" : "POST";
      await apiClient(`/topics/${slug}/follow`, { method });
      setFollowing((prev) => !prev);
    } catch {
      // silently ignore — button reverts to current state
    } finally {
      setFollowPending(false);
    }
  }

  if (error) {
    return (
      <section className="page-section">
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Explore Topics", to: "/topics" }, { label: "Topic Error" }]} />
        <p className="eyebrow">Topic</p>
        <Feedback tone="error">{error}</Feedback>
      </section>
    );
  }

  return (
    <section className="page-section">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Explore Topics", to: "/topics" },
          { label: topic?.name || "Topic" },
        ]}
      />
      {loading ? (
        <>
          <div className="skeleton-line skeleton-line--short" aria-hidden="true" style={{ height: "1rem", marginBottom: "0.5rem" }} />
          <div className="skeleton-line" aria-hidden="true" style={{ height: "2.25rem", maxWidth: "22rem", marginBottom: "1rem" }} />
          <div className="article-grid topic-articles">
            {[1, 2, 3].map((n) => (
              <div className="article-card skeleton-block" key={n} aria-hidden="true" style={{ minHeight: "14rem" }} />
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="eyebrow">Topic</p>
          <div className="topic-header">
            <h1>{topic?.name}</h1>
            {user && (
              <Button
                variant={following ? "secondary" : "primary"}
                type="button"
                disabled={followPending}
                onClick={toggleFollow}
                aria-pressed={following}
              >
                {followPending ? "…" : following ? "Following ✓" : "Follow topic"}
              </Button>
            )}
          </div>
          {topic?.description && <p>{topic.description}</p>}
          {articles.length === 0 ? (
            <EmptyState title="No articles yet">
              <p>We are working on adding articles to this topic.</p>
            </EmptyState>
          ) : (
            <div className="article-grid topic-articles">
              {articles.map((article) => (
                <ArticleCard article={article} key={article.slug} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default TopicDetailPage;
