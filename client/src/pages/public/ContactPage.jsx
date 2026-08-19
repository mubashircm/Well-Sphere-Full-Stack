import { useState, useEffect } from "react";
import Button from "../../components/ui/Button.jsx";
import Feedback from "../../components/ui/Feedback.jsx";
import TextField from "../../components/ui/TextField.jsx";
import Breadcrumb from "../../components/ui/Breadcrumb.jsx";
import { apiClient } from "../../services/api/client.js";

const SUBJECT_OPTIONS = [
  "Editorial Feedback",
  "Article Suggestion",
  "General Inquiry",
  "Bug Report",
  "Partnership",
];

function ContactPage() {
  useEffect(() => {
    document.title = "Contact Us | WellSphere";
    window.scrollTo(0, 0);
    return () => {
      document.title = "WellSphere";
    };
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFeedback({
        tone: "error",
        message: "Please fill out all required fields.",
      });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      await apiClient("/contact", {
        method: "POST",
        body: {
          name: name.trim(),
          email: email.trim(),
          subject,
          message: message.trim(),
        },
      });

      setFeedback({
        tone: "success",
        message: "Thank you for reaching out! Your message has been sent to our editorial and support team.",
      });

      // Clear form
      setName("");
      setEmail("");
      setSubject(SUBJECT_OPTIONS[0]);
      setMessage("");
    } catch (err) {
      setFeedback({
        tone: "error",
        message: err.message || "Failed to submit inquiry. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-slate-800">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Contact" }]} />

      <header className="border-b border-slate-200 pb-8 mb-12">
        <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
          Contact the WellSphere Team
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          Have an editorial tip, content feedback, partnership inquiry, or technical question? We value thoughtful input from our community.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Context & Guidelines */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-3">Direct Editorial Desk</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              For official correspondence, editorial corrections, or partnership proposals, you may also reach us directly via email:
            </p>
            <a
              href="mailto:wellsphere.official@gmail.com"
              className="inline-flex items-center text-teal-700 font-semibold hover:underline text-base"
            >
              ✉️ wellsphere.official@gmail.com
            </a>
          </div>

          <div className="bg-teal-50/60 p-6 rounded-xl border border-teal-200/80">
            <h3 className="font-semibold text-teal-950 mb-2 flex items-center gap-2">
              <span>⏱️</span> Response Window
            </h3>
            <p className="text-sm text-teal-900 leading-relaxed">
              Our editorial and support team reviews incoming inquiries Monday through Friday. We strive to reply within <strong>24 to 48 hours</strong>.
            </p>
          </div>

          <div className="bg-amber-50/70 p-6 rounded-xl border border-amber-200/80">
            <h3 className="font-semibold text-amber-950 mb-2 flex items-center gap-2">
              <span>⚠️</span> Medical Emergency Notice
            </h3>
            <p className="text-sm text-amber-900/90 leading-relaxed">
              WellSphere is an educational publication and cannot provide individual medical diagnoses, prescription advice, or emergency care. In case of emergency, please contact local medical emergency services immediately.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200/90 shadow-xs">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Send a Message</h2>
          <p className="text-slate-500 text-sm mb-6">
            Fill out the form below and our team will route your inquiry to the appropriate department.
          </p>

          {feedback && (
            <div className="mb-6">
              <Feedback tone={feedback.tone} role="status">
                {feedback.message}
              </Feedback>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <TextField
              id="contact-name"
              label="Your Full Name"
              placeholder="e.g. Eleanor Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <TextField
              id="contact-email"
              label="Your Email Address"
              type="email"
              placeholder="e.g. eleanor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="ui-field">
              <label htmlFor="contact-subject" className="block text-sm font-medium text-slate-700 mb-1">
                Inquiry Topic / Category
              </label>
              <select
                id="contact-subject"
                className="ui-select w-full"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              >
                {SUBJECT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="ui-field">
              <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 mb-1">
                Your Message
              </label>
              <textarea
                id="contact-message"
                className="ui-textarea w-full"
                rows={6}
                placeholder="Share your thoughts, suggestions, or inquiry details here…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="w-full sm:w-auto px-8"
            >
              {submitting ? "Sending message…" : "Send Inquiry"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
