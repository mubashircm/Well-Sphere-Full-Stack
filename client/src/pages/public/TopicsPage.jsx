import { NavLink } from "react-router-dom";
import Feedback from "../../components/ui/Feedback.jsx";
import { useApi } from "../../hooks/useApi.js";

function TopicsPage() {
  const { data: topics, loading, error } = useApi("/topics");

  return (
    <section className="page-section">
      <p className="eyebrow">Explore</p>
      <h1>Health topics</h1>
      <p>Browse focused, understandable information for everyday life.</p>

      {error && <Feedback tone="error">{error}</Feedback>}

      {loading && (
        <div className="topic-grid topic-grid--full">
          {[1, 2, 3, 4].map((n) => (
            <div className="topic-card skeleton-block" key={n} aria-hidden="true" style={{ minHeight: "9rem" }} />
          ))}
        </div>
      )}

      {!loading && topics && (
        <div className="topic-grid topic-grid--full">
          {topics.map((topic) => (
            <NavLink className="topic-card" to={`/topics/${topic.slug}`} key={topic.slug}>
              <h2>{topic.name}</h2>
              <p>{topic.description}</p>
              <span>Explore topic →</span>
            </NavLink>
          ))}
        </div>
      )}
    </section>
  );
}

export default TopicsPage;
