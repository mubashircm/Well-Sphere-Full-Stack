import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Feedback from "../../components/ui/Feedback.jsx";
import HealthInformationBlocks from "../../components/article/HealthInformationBlocks.jsx";
import { useApi } from "../../hooks/useApi.js";
import { apiClient } from "../../services/api/client.js";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function calculateReadingTime(data) {
  let wordCount = 0;
  if (data.title) wordCount += data.title.split(/\s+/).length;
  if (data.excerpt) wordCount += data.excerpt.split(/\s+/).length;
  if (Array.isArray(data.sections)) {
    data.sections.forEach((s) => {
      if (s.heading) wordCount += s.heading.split(/\s+/).length;
      if (s.body) wordCount += s.body.split(/\s+/).length;
    });
  }
  if (data.homeCare) wordCount += data.homeCare.split(/\s+/).length;
  if (data.lifestyle) wordCount += data.lifestyle.split(/\s+/).length;
  if (data.exercise) wordCount += data.exercise.split(/\s+/).length;
  if (data.seekCare) wordCount += data.seekCare.split(/\s+/).length;

  return Math.max(1, Math.ceil(wordCount / 200));
}

function ArticleEditorPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  // Load available topics
  const { data: topicsData, loading: topicsLoading } = useApi("/topics");
  const topics = useMemo(() => topicsData || [], [topicsData]);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [topic, setTopic] = useState("");
  const [accent, setAccent] = useState("movement");
  const [excerpt, setExcerpt] = useState("");
  const [readingTime, setReadingTime] = useState(5);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [sections, setSections] = useState([
    { heading: "Understanding the condition", body: "" },
    { heading: "Practical daily steps", body: "" },
  ]);
  const [homeCare, setHomeCare] = useState("");
  const [lifestyle, setLifestyle] = useState("");
  const [exercise, setExercise] = useState("");
  const [seekCare, setSeekCare] = useState("");
  const [sources, setSources] = useState([""]);
  const [status, setStatus] = useState("draft");
  const [reviewNotes, setReviewNotes] = useState("");

  // UI state
  const [loadingInitial, setLoadingInitial] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Load existing article if editing
  useEffect(() => {
    if (!isEditing) return;
    let active = true;

    apiClient(`/editor/articles/${id}`)
      .then((article) => {
        if (!active) return;
        setTitle(article.title || "");
        setSlug(article.slug || "");
        setSlugManual(true);
        setTopic(article.topic?._id || article.topic || "");
        setAccent(article.accent || "movement");
        setExcerpt(article.excerpt || "");
        setReadingTime(article.readingTime || 5);
        if (article.featuredImage) {
          setFeaturedImage(article.featuredImage);
        }
        if (article.sections && article.sections.length > 0) {
          setSections(article.sections);
        }
        setHomeCare(article.homeCare || "");
        setLifestyle(article.lifestyle || "");
        setExercise(article.exercise || "");
        setSeekCare(article.seekCare || "");
        setSources(article.sources && article.sources.length > 0 ? article.sources : [""]);
        setStatus(article.status || "draft");
        setReviewNotes(article.reviewNotes || "");
      })
      .catch((err) => {
        if (active) setFeedback({ tone: "error", message: err.message || "Failed to load article." });
      })
      .finally(() => {
        if (active) setLoadingInitial(false);
      });

    return () => {
      active = false;
    };
  }, [id, isEditing]);

  const effectiveTopic = topic || topics[0]?._id || "";

  function handleTitleChange(e) {
    const val = e.target.value;
    setTitle(val);
    if (!slugManual) {
      setSlug(slugify(val));
    }
  }

  function handleSectionChange(index, field, value) {
    setSections((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function addSection() {
    setSections((prev) => [...prev, { heading: "", body: "" }]);
  }

  function removeSection(index) {
    if (sections.length <= 1) return;
    setSections((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSourceChange(index, value) {
    setSources((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }

  function addSource() {
    setSources((prev) => [...prev, ""]);
  }

  function removeSource(index) {
    if (sources.length <= 1) return;
    setSources((prev) => prev.filter((_, i) => i !== index));
  }

  function autoCalculateTime() {
    const calculated = calculateReadingTime({
      title,
      excerpt,
      sections,
      homeCare,
      lifestyle,
      exercise,
      seekCare,
    });
    setReadingTime(calculated);
    setFeedback({ tone: "info", message: `Calculated estimated reading time: ${calculated} min.` });
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFeedback({ tone: "error", message: "Please choose an image file (JPG, PNG, WebP, AVIF)." });
      return;
    }

    setUploadingImage(true);
    setFeedback(null);

    const reader = new FileReader();
    reader.onload = async (uploadEvent) => {
      try {
        const base64Data = uploadEvent.target?.result;
        const result = await apiClient("/editor/media/upload", {
          method: "POST",
          body: {
            file: base64Data,
            alt: title || "Article illustration",
          },
        });
        setFeaturedImage(result);
        setFeedback({ tone: "info", message: "Image uploaded to Cloudinary storage successfully." });
      } catch (err) {
        setFeedback({ tone: "error", message: err.message || "Failed to upload image." });
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleRemoveImage() {
    if (featuredImage?.publicId) {
      try {
        await apiClient(`/editor/media/${featuredImage.publicId}`, { method: "DELETE" });
      } catch (err) {
        console.error("Failed to delete media asset:", err);
      }
    }
    setFeaturedImage(null);
  }

  async function handleSave(submitForReviewAction = false) {
    setSaving(true);
    setFeedback(null);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      topic: effectiveTopic,
      accent,
      excerpt: excerpt.trim(),
      readingTime: Number(readingTime) || 1,
      featuredImage: featuredImage || undefined,
      sections: sections.filter((s) => s.heading.trim() && s.body.trim()),
      homeCare: homeCare.trim(),
      lifestyle: lifestyle.trim(),
      exercise: exercise.trim(),
      seekCare: seekCare.trim(),
      sources: sources.filter((s) => s.trim()),
    };

    if (!payload.title) {
      setFeedback({ tone: "error", message: "Please provide an article title." });
      setSaving(false);
      return;
    }

    if (!payload.topic) {
      setFeedback({ tone: "error", message: "Please select a health topic." });
      setSaving(false);
      return;
    }

    try {
      let savedArticle;
      if (isEditing) {
        savedArticle = await apiClient(`/editor/articles/${id}`, {
          method: "PATCH",
          body: payload,
        });
      } else {
        savedArticle = await apiClient("/editor/articles", {
          method: "POST",
          body: payload,
        });
      }

      const targetId = savedArticle._id || id;

      if (submitForReviewAction) {
        await apiClient(`/editor/articles/${targetId}/submit`, { method: "POST" });
        navigate("/editor/articles?status=pending-review");
        return;
      }

      setFeedback({
        tone: "info",
        message: isEditing ? "Article updated successfully." : "Draft created successfully.",
      });

      if (!isEditing && targetId) {
        navigate(`/editor/articles/${targetId}/edit`, { replace: true });
      }
    } catch (err) {
      setFeedback({ tone: "error", message: err.message || "Could not save article." });
    } finally {
      setSaving(false);
    }
  }

  if (loadingInitial) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-48" />
        <div className="h-64 bg-white rounded-2xl border border-slate-100 p-8" />
      </div>
    );
  }

  const selectedTopicName = topics.find((t) => t._id === effectiveTopic)?.name || "Health Topic";

  return (
    <div className="space-y-8 animate-fade-in-up pb-16">
      {/* ─── STICKY HEADER & ACTION CONTROLS ────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <Link
            to="/editor/articles"
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 mb-1.5"
          >
            <span>←</span>
            <span>Back to My Articles</span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {isEditing ? "Edit Health Article" : "Write Health Article"}
          </h1>
          <p className="text-xs text-slate-500">
            Draft structured, evidence-aware lifestyle and preventive health guides.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => setPreviewMode((prev) => !prev)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {previewMode ? "✕ Exit Preview" : "👁️ Preview Article"}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Draft"}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(true)}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-teal-700 text-white hover:bg-teal-800 shadow-md transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            Submit for Review →
          </button>
        </div>
      </div>

      {feedback && (
        <Feedback tone={feedback.tone} role="status">
          {feedback.message}
        </Feedback>
      )}

      {reviewNotes && status === "changes-requested" && (
        <div className="border border-rose-300 bg-rose-50 text-rose-900 rounded-2xl p-5 shadow-xs">
          <strong className="font-bold text-sm block">⚠️ Reviewer Feedback (Changes Requested):</strong>
          <p className="text-xs text-rose-800 mt-1 leading-relaxed">{reviewNotes}</p>
        </div>
      )}

      {/* ─── PREVIEW MODE ───────────────────────────────────────────────────── */}
      {previewMode ? (
        <div className="space-y-6 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
            <span>Interactive Reader Preview</span>
          </div>

          <article className="max-w-3xl mx-auto space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 inline-block mb-3">
                {selectedTopicName}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                {title || "Untitled Health Guide"}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed font-serif italic">
                {excerpt || "Plain-language summary will appear here."}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-4 pt-4 border-t border-slate-100">
                <span>WellSphere Editorial Desk</span>
                <span>•</span>
                <span>{readingTime} min read</span>
                <span>•</span>
                <span>Draft Preview</span>
              </div>
            </div>

            {featuredImage?.secureUrl && (
              <div className="rounded-2xl overflow-hidden shadow-md">
                <img
                  src={featuredImage.secureUrl}
                  alt={featuredImage.alt || title}
                  className="w-full h-72 object-cover"
                />
              </div>
            )}

            <div className="space-y-6 pt-4 text-slate-800 leading-relaxed text-sm sm:text-base">
              {sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                    {sec.heading || `Section ${idx + 1}`}
                  </h2>
                  <p className="text-slate-700 whitespace-pre-wrap">{sec.body || "Section content here…"}</p>
                </div>
              ))}

              <HealthInformationBlocks
                article={{
                  homeCare,
                  lifestyle,
                  exercise,
                  seekCare,
                  sources: sources.filter(Boolean),
                }}
              />
            </div>
          </article>
        </div>
      ) : (
        /* ─── EDIT MODE ─────────────────────────────────────────────────────── */
        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave(false);
          }}
        >
          {/* 1. Article Metadata Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                1. Article Core Metadata
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Primary title, URL permalink, category classification, and reading length.
              </p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="article-title" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Article Title
              </label>
              <input
                id="article-title"
                type="text"
                placeholder="e.g. Building a Restorative Sleep Routine: Evidence-Backed Practices"
                value={title}
                onChange={handleTitleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 text-sm transition-all bg-white font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="article-slug" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  URL Permalink Slug
                </label>
                <input
                  id="article-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlugManual(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="e.g. restorative-sleep-routine"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="article-topic" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Health Topic
                </label>
                <select
                  id="article-topic"
                  value={effectiveTopic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={topicsLoading}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 bg-white cursor-pointer"
                >
                  {topics.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="article-accent" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Color Accent
                </label>
                <select
                  id="article-accent"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 bg-white cursor-pointer"
                >
                  <option value="movement">Movement (Teal)</option>
                  <option value="sleep">Sleep (Deep Slate)</option>
                  <option value="hydration">Hydration (Sky Blue)</option>
                  <option value="headache">Headache (Amber)</option>
                </select>
              </div>
            </div>

            {/* Plain-Language Excerpt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="article-excerpt" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Plain-Language Summary (Excerpt)
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {excerpt.length}/500 chars
                </span>
              </div>
              <textarea
                id="article-excerpt"
                rows={3}
                placeholder="A clear, calm summary explaining what readers will learn in 2-3 accessible sentences."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                maxLength={500}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 text-sm transition-all bg-white leading-relaxed"
              />
            </div>

            {/* Reading Time Row with Auto-Calc */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="space-y-1 w-36">
                <label htmlFor="article-reading-time" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Reading Time
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="article-reading-time"
                    type="number"
                    min="1"
                    max="60"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    className="w-20 px-3 py-2 rounded-xl border border-slate-200 text-sm text-center font-bold font-mono focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                  />
                  <span className="text-xs text-slate-500">mins</span>
                </div>
              </div>

              <button
                type="button"
                onClick={autoCalculateTime}
                className="self-end px-4 py-2 rounded-xl text-xs font-semibold bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>⚡ Auto-Calculate Reading Time</span>
              </button>
            </div>
          </div>

          {/* 2. Featured Image Uploader Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                2. Featured Article Header Image
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Uploaded securely to Cloudinary object storage with automated responsive CDN delivery.
              </p>
            </div>

            {featuredImage?.secureUrl || featuredImage?.url ? (
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <img
                  src={featuredImage.secureUrl || featuredImage.url}
                  alt={featuredImage.alt || "Header"}
                  className="w-32 h-20 object-cover rounded-xl border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate font-mono">
                    {featuredImage.publicId || "Uploaded Image Asset"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Cloudinary storage verified and active.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-white border border-rose-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Remove Asset
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-teal-500 transition-colors">
                <input
                  id="article-image-file"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
                <label
                  htmlFor="article-image-file"
                  className="cursor-pointer inline-flex flex-col items-center gap-2"
                >
                  <span className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-xl">
                    📷
                  </span>
                  <span className="text-xs font-bold text-teal-800">
                    {uploadingImage ? "Uploading to Cloudinary CDN…" : "Click to select or drag header image"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    JPG, PNG, WebP, or AVIF (Up to 5MB)
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* 3. Core Content Sections Repeater */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                3. Core Content Sections
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Organize your clinical explanation into clear, focused paragraphs with informative subheadings.
              </p>
            </div>

            <div className="space-y-6">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4 relative"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-900 uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200">
                      Section {index + 1}
                    </span>
                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="text-xs text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                        aria-label="Remove section"
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor={`sec-heading-${index}`}
                      className="text-xs font-bold text-slate-700 uppercase tracking-wider"
                    >
                      Subheading
                    </label>
                    <input
                      id={`sec-heading-${index}`}
                      type="text"
                      placeholder="e.g. Why sleep quality impacts metabolic health"
                      value={section.heading}
                      onChange={(e) => handleSectionChange(index, "heading", e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor={`sec-body-${index}`}
                      className="text-xs font-bold text-slate-700 uppercase tracking-wider"
                    >
                      Section Body Content
                    </label>
                    <textarea
                      id={`sec-body-${index}`}
                      rows={5}
                      placeholder="Write factual, evidence-aware explanations in plain language…"
                      value={section.body}
                      onChange={(e) => handleSectionChange(index, "body", e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 bg-white leading-relaxed"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addSection}
                className="w-full border-2 border-dashed border-slate-300 hover:border-teal-500 hover:bg-teal-50/40 text-teal-700 rounded-2xl py-4 flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <span>+ Add Another Content Section</span>
              </button>
            </div>
          </div>

          {/* 4. Structured Clinical Health Framework */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                4. Structured Clinical Framework Blocks
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Standardized, evidence-based guidance blocks rendered in high-visibility callouts.
              </p>
            </div>

            {/* Safe Home Guidance */}
            <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-2">
              <label
                htmlFor="block-home-care"
                className="text-xs font-bold text-emerald-900 uppercase tracking-wider block"
              >
                🌱 Safe Home Care Guidance
              </label>
              <textarea
                id="block-home-care"
                rows={3}
                placeholder="Comfort measures, rest protocols, hydration, and safe home practices…"
                value={homeCare}
                onChange={(e) => setHomeCare(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-emerald-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 bg-white leading-relaxed"
              />
            </div>

            {/* Lifestyle Guidance */}
            <div className="p-5 rounded-2xl bg-teal-50/40 border border-teal-200/80 space-y-2">
              <label
                htmlFor="block-lifestyle"
                className="text-xs font-bold text-teal-900 uppercase tracking-wider block"
              >
                🧘 Healthy Lifestyle &amp; Habit Guidance
              </label>
              <textarea
                id="block-lifestyle"
                rows={3}
                placeholder="Daily routines, environmental tweaks, stress reduction, and healthy habits…"
                value={lifestyle}
                onChange={(e) => setLifestyle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-teal-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 bg-white leading-relaxed"
              />
            </div>

            {/* Exercise Guidance */}
            <div className="p-5 rounded-2xl bg-sky-50/40 border border-sky-200/80 space-y-2">
              <label
                htmlFor="block-exercise"
                className="text-xs font-bold text-sky-900 uppercase tracking-wider block"
              >
                🏃 Gentle Exercise &amp; Movement Advice
              </label>
              <textarea
                id="block-exercise"
                rows={3}
                placeholder="Low-impact activities, mobility tips, pacing, or gentle posture guidance…"
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600/20 bg-white leading-relaxed"
              />
            </div>

            {/* Red Flags / When to Seek Care */}
            <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-200/80 space-y-2">
              <label
                htmlFor="block-seek-care"
                className="text-xs font-bold text-rose-900 uppercase tracking-wider block"
              >
                🚨 When to Seek Professional Medical Care (Red Flags)
              </label>
              <textarea
                id="block-seek-care"
                rows={3}
                placeholder="Red flags, warning signs, acute symptoms, and emergency thresholds…"
                value={seekCare}
                onChange={(e) => setSeekCare(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-600/20 bg-white leading-relaxed"
              />
            </div>
          </div>

          {/* 5. Evidence & Citations */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                5. Evidence &amp; Medical Citations
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cite authoritative health agencies, clinical guidelines, and peer-reviewed studies (e.g. WHO, NHS, CDC).
              </p>
            </div>

            <div className="space-y-3">
              {sources.map((src, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. World Health Organization: Guidelines on Physical Activity and Sedentary Behaviour (2020)"
                    value={src}
                    onChange={(e) => handleSourceChange(index, e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 bg-white"
                  />
                  {sources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSource(index)}
                      className="text-xs text-slate-400 hover:text-rose-600 p-2 rounded-lg transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addSource}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>+ Add Citation Source</span>
              </button>
            </div>
          </div>

          {/* Bottom Action Row */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(false)}
              className="px-6 py-3 rounded-xl text-sm font-semibold bg-slate-100 border border-slate-200 text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save as Draft"}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(true)}
              className="px-8 py-3 rounded-xl text-sm font-semibold bg-teal-700 text-white hover:bg-teal-800 shadow-md transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
            >
              Submit for Review →
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ArticleEditorPage;
