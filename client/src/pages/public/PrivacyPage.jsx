import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Breadcrumb from "../../components/ui/Breadcrumb.jsx";

function PrivacyPage() {
  useEffect(() => {
    document.title = "Privacy Policy | WellSphere";
    window.scrollTo(0, 0);
    return () => {
      document.title = "WellSphere";
    };
  }, []);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-slate-800">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Privacy Policy" }]} />

      {/* Header */}
      <header className="border-b border-slate-200 pb-8 mb-10">
        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
          Data Protection &amp; Security
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
          Privacy Policy
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
            Introduction
          </h2>
          <p>
            Welcome to WellSphere (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our website, register an account, read our editorial content, or interact with our community features.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">2</span>
            Information We Collect
          </h2>
          <p className="mb-4">
            We only collect data that is strictly necessary to provide a personalized, secure wellness reading experience:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-slate-700">
            <li>
              <strong>Account Information:</strong> When you register, we collect your name, email address, and securely hashed passwords (encrypted via standard cryptographic algorithms). We do not permit automated or disposable email registrations.
            </li>
            <li>
              <strong>Activity &amp; Engagement Data:</strong> Information regarding the articles you bookmark/save, topics you follow, comments you post, and reading preferences on your user dashboard.
            </li>
            <li>
              <strong>Technical &amp; Security Logs:</strong> Standard server logs including IP addresses, browser types, device identifiers, and login timestamps. For editors and administrators, device information is used solely to issue email OTP challenges for new-device logins.
            </li>
            <li>
              <strong>What We DO NOT Collect:</strong> WellSphere is an editorial wellness publication. We do not collect, store, or process electronic health records (EHR), medical prescriptions, clinical diagnosis histories, or sensitive health insurance data.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">3</span>
            How We Use Your Information
          </h2>
          <p className="mb-4">
            We use the collected information for the following specific purposes:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-slate-700">
            <li>
              <strong>Account Management:</strong> Authenticating your identity, managing your sessions, and enabling profile features.
            </li>
            <li>
              <strong>Personalized Experience:</strong> Organizing your saved articles, topic feeds, and notification preferences.
            </li>
            <li>
              <strong>Communication &amp; Security:</strong> Sending essential transactional emails (e.g., OTP verification codes, password reset links, and security alerts). We do not send unsolicited marketing spam.
            </li>
            <li>
              <strong>Content Moderation &amp; Auditing:</strong> Monitoring comment sections against abuse and maintaining administrative audit logs for sensitive actions.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">4</span>
            Cookies &amp; Session Storage Policy
          </h2>
          <p className="mb-4">
            WellSphere adheres to strict, security-first session management:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-slate-700">
            <li>
              <strong>Authentication Cookies:</strong> We use short-lived access and refresh tokens stored securely in HttpOnly, Secure, and SameSite cookies to protect against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF).
            </li>
            <li>
              <strong>Zero LocalStorage for Tokens:</strong> We strictly never store authentication tokens or passwords in your browser’s localStorage.
            </li>
            <li>
              <strong>Essential Cookies Only:</strong> Cookies are used strictly for session integrity, CSRF prevention, and basic UI preferences (such as theme or reading progress). We do not use intrusive third-party cross-site advertising trackers.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">5</span>
            Third-Party Services &amp; Data Sharing
          </h2>
          <p className="mb-4">
            We do not sell, rent, or trade your personal information to third parties. We only share metadata with trusted infrastructure providers required to operate the platform:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-slate-700">
            <li>
              <strong>Cloud Object Storage:</strong> Media assets, user avatars, and article images are hosted via external secure cloud storage (e.g., Cloudinary). Only media metadata and URLs are referenced in our database.
            </li>
            <li>
              <strong>Transactional Email Services:</strong> Reliable SMTP providers utilized exclusively for delivering account verification and password reset emails.
            </li>
            <li>
              <strong>Legal Compliance:</strong> We may disclose data if required to do so by applicable law, subpoena, or to protect the vital security of our platform and users.
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">6</span>
            Data Retention &amp; Your Rights
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-slate-700">
            <li>
              <strong>Access &amp; Updates:</strong> You can review, update, or edit your profile information and notification settings directly within your User Dashboard at any time.
            </li>
            <li>
              <strong>Data Deletion:</strong> You may request account deletion, upon which your personal identifiers, saved libraries, and session records will be permanently removed or anonymized from our active database.
            </li>
            <li>
              <strong>Retention Policy:</strong> Security audit logs and session histories are retained only as long as necessary for platform integrity and dispute resolution before scheduled purging.
            </li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">7</span>
            Data Security Measures
          </h2>
          <p className="mb-4">
            We implement industry-standard technical and organizational security protocols:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Encrypted HTTPS/TLS transmission across all network requests.</li>
            <li>Strict Role-Based Access Control (RBAC) separating User, Editor, and SuperAdmin workspaces.</li>
            <li>Rate limiting on authentication routes and automatic refresh token rotation.</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">8</span>
            Contact &amp; Updates
          </h2>
          <p>
            We may update this Privacy Policy periodically to reflect enhancements in our architecture or legal compliance. Any changes will be posted on this page with an updated revision date. For questions regarding your data privacy, please contact the WellSphere administrative team through our official contact channels.
          </p>
        </section>
      </div>

      {/* Footer Navigation Back Link */}
      <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between items-center text-sm text-slate-600">
        <NavLink to="/" className="text-teal-700 font-semibold hover:underline flex items-center gap-1">
          ← Return to Home
        </NavLink>
        <div className="flex gap-4">
          <NavLink to="/terms" className="hover:text-slate-900 transition-colors">
            Terms and Conditions
          </NavLink>
          <NavLink to="/disclaimer" className="hover:text-slate-900 transition-colors">
            Medical Disclaimer
          </NavLink>
        </div>
      </div>
    </article>
  );
}

export default PrivacyPage;
