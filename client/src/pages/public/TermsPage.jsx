import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Breadcrumb from "../../components/ui/Breadcrumb.jsx";

function TermsPage() {
  useEffect(() => {
    document.title = "Terms and Conditions | WellSphere";
    window.scrollTo(0, 0);
    return () => {
      document.title = "WellSphere";
    };
  }, []);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-slate-800">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Terms and Conditions" }]} />

      {/* Header */}
      <header className="border-b border-slate-200 pb-8 mb-10">
        <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
          Legal Agreement
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
          Terms and Conditions
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
            Acceptance of Terms
          </h2>
          <p>
            By accessing, browsing, or creating an account on WellSphere (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, please do not use our platform.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">2</span>
            Platform Purpose &amp; Health Content Scope
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-slate-700">
            <li>
              <strong>Educational &amp; Editorial Only:</strong> WellSphere is an online wellness publication providing general informational content on nutrition, healthy habits, minor home remedies, and exercise routines.
            </li>
            <li>
              <strong>No Medical Services:</strong> We do not provide clinical medical diagnosis, telemedicine, prescriptions, or emergency healthcare services. Your use of the content is solely at your own discretion. Always consult a certified healthcare professional before making health-related changes.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">3</span>
            User Accounts &amp; Security
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-slate-700">
            <li>
              <strong>Eligibility:</strong> You must be at least 16 years of age (or the legal age of majority in your jurisdiction) to register an account.
            </li>
            <li>
              <strong>Account Integrity:</strong> You agree to provide accurate registration information. The use of temporary/disposable email services for spam or automated signups is strictly prohibited.
            </li>
            <li>
              <strong>Credential Protection:</strong> You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized access or security breach.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">4</span>
            Community Guidelines &amp; User Conduct
          </h2>
          <p className="mb-4">
            When interacting with WellSphere (posting comments, engaging in discussions, or saving content), you agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Post abusive, hateful, defamatory, misleading, or promotional/spam content.</li>
            <li>Disseminate dangerous medical misinformation or unverified prescription advice in comment sections.</li>
            <li>Attempt to bypass authentication, reverse-engineer, scrape, or disrupt the platform’s infrastructure.</li>
            <li>Impersonate any individual, editor, or administrator.</li>
          </ul>
          <p className="mt-4 text-sm text-slate-600 italic">
            We reserve the full right to moderate, hide, or delete any comment and suspend accounts that violate these standards.
          </p>
        </section>

        {/* Section 5 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">5</span>
            Intellectual Property Rights
          </h2>
          <p>
            All original articles, editorial designs, illustrations, brand assets, logos, and UI code on WellSphere are the intellectual property of WellSphere and protected by applicable copyright and trademark laws. You may not republish, distribute, or exploit our content commercially without prior written consent.
          </p>
        </section>

        {/* Section 6 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">6</span>
            Limitation of Liability
          </h2>
          <p>
            WellSphere and its contributors provide the platform on an &quot;as is&quot; and &quot;as available&quot; basis. To the fullest extent permitted by law, WellSphere shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of, or inability to use, any advice, remedy, or routine published on the platform.
          </p>
        </section>

        {/* Section 7 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">7</span>
            Account Termination &amp; Modifications
          </h2>
          <p>
            We reserve the right to suspend or terminate user accounts, restrict access to features, or modify these terms at any time to reflect updates in our services or legal obligations. Continued use of the platform following any modifications constitutes acceptance of the updated terms.
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

export default TermsPage;
