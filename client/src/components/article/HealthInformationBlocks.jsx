function HealthInformationBlocks({ article }) {
  const blocks = [["Safe home care", article.homeCare], ["Lifestyle guidance", article.lifestyle], ["Healthy movement", article.exercise], ["When to seek medical help", article.seekCare]];
  return <section className="health-blocks" aria-label="Health guidance">{blocks.map(([title, body], index) => <section className={`health-block health-block--${index}`} key={title}><h2>{title}</h2><p>{body}</p></section>)}<section className="health-block health-block--disclaimer"><h2>Medical disclaimer</h2><p>This article provides general health education. It cannot diagnose, treat, or replace advice from a qualified healthcare professional.</p></section><section className="article-sources"><h2>Sources and references</h2><ul>{article.sources.map((source) => <li key={source}>{source}</li>)}</ul></section></section>;
}

export default HealthInformationBlocks;
