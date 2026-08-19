import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Breadcrumb from "../../components/ui/Breadcrumb.jsx";

function AccessibilityPage() {
  useEffect(() => {
    document.title = "Accessibility Statement | WellSphere";
    window.scrollTo(0, 0);
    return () => {
      document.title = "WellSphere";
    };
  }, []);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-slate-800">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Accessibility Statement" }]} />

      {/* Header */}
      <header className="border-b border-slate-200 pb-8 mb-10">
        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
          Inclusive Design &amp; Standards
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
          Accessibility Statement
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium">
          Last Updated: August 2026
        </p>
      </header>

      {/* Content Sections */}
      <div className="space-y-10 text-base sm:text-lg leading-relaxed text-slate-700">
        {/* Section 1 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">1</span>
            Our Commitment
          </h2>
          <p className="mb-4">
            At WellSphere, we are dedicated to ensuring digital accessibility for everyone, including individuals with visual, auditory, cognitive, or motor disabilities. We believe wellness knowledge should be accessible, readable, and easy to navigate for all readers across the globe.
          </p>
          <p>
            We continuously optimize our user experience by applying relevant accessibility standards, guided by the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">2</span>
            Accessibility Features on WellSphere
          </h2>
          <p className="mb-4">
            To provide an inclusive reading experience, our platform incorporates several core accessibility enhancements:
          </p>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start gap-3">
              <span className="text-teal-600 font-bold">🔊</span>
              <div>
                <strong>Audio Article Reader (&quot;Listen to Article&quot;):</strong> Many of our editorial guides and health articles include built-in audio playback options, allowing users to listen to content hands-free.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-teal-600 font-bold">🏷️</span>
              <div>
                <strong>Semantic HTML Structure:</strong> Our pages use clean, standard semantic HTML tags, logical heading hierarchies, and descriptive landmark regions for smooth screen reader navigation.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-teal-600 font-bold">👁️</span>
              <div>
                <strong>High Contrast &amp; Readability:</strong> Color combinations, typography, and background contrasts are designed to maintain optimal legibility and reduce visual strain.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-teal-600 font-bold">⌨️</span>
              <div>
                <strong>Keyboard Navigation:</strong> All interactive elements, including navigation links, article filters, search bars, and forms, can be accessed and operated using a standard keyboard.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-teal-600 font-bold">🖼️</span>
              <div>
                <strong>Descriptive Alternative Text:</strong> Non-text media, illustrations, and health diagrams include descriptive alt attributes to provide context for visually impaired users.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-teal-600 font-bold">📱</span>
              <div>
                <strong>Responsive Scaling:</strong> The platform adapts seamlessly across devices and supports browser zoom levels up to 200% without loss of content or breaking layout structure.
              </div>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">3</span>
            Ongoing Efforts &amp; Compatibility
          </h2>
          <p>
            We regularly evaluate our code and user flows to detect and resolve accessibility barriers. WellSphere is designed to be compatible with major modern browsers (Chrome, Firefox, Safari, Edge) and standard assistive technologies.
          </p>
        </section>

        {/* Section 4 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">4</span>
            Feedback &amp; Assistance
          </h2>
          <p className="mb-4">
            We welcome your feedback on the accessibility of WellSphere. If you encounter any accessibility barrier, find certain sections difficult to navigate, or have suggestions for improvement, please contact us:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4 text-slate-700">
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:wellsphere.official@gmail.com" className="text-teal-700 font-semibold hover:underline">
                wellsphere.official@gmail.com
              </a>
            </li>
            <li>
              <strong>Contact Form:</strong> Submit feedback via our official{" "}
              <NavLink to="/contact" className="text-teal-700 font-semibold hover:underline">
                Contact Us
              </NavLink>{" "}
              page.
            </li>
          </ul>
          <p className="text-sm text-slate-600 italic">
            Please provide the specific page URL and a brief description of the issue so our engineering and editorial teams can review and address it promptly.
          </p>
        </section>
      </div>

      {/* Footer Navigation Back Link */}
      <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between items-center text-sm text-slate-600">
        <NavLink to="/" className="text-teal-700 font-semibold hover:underline flex items-center gap-1">
          ← Return to Home
        </NavLink>
        <div className="flex gap-4">
          <NavLink to="/disclaimer" className="hover:text-slate-900 transition-colors">
            Medical Disclaimer
          </NavLink>
          <NavLink to="/privacy" className="hover:text-slate-900 transition-colors">
            Privacy Policy
          </NavLink>
        </div>
      </div>
    </article>
  );
}

export default AccessibilityPage;
