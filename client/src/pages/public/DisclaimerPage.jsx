import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Breadcrumb from "../../components/ui/Breadcrumb.jsx";

function DisclaimerPage() {
  useEffect(() => {
    document.title = "Medical & Wellness Disclaimer | WellSphere";
    window.scrollTo(0, 0);
    return () => {
      document.title = "WellSphere";
    };
  }, []);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-slate-800">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Disclaimer" }]} />

      {/* Header */}
      <header className="border-b border-slate-200 pb-8 mb-10">
        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
          Legal & Safety Notice
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
          Medical &amp; Wellness Disclaimer
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium">
          Last Updated: August 2026
        </p>
      </header>

      {/* Emergency Notice Callout */}
      <div className="bg-rose-50 border-l-4 border-rose-500 p-5 rounded-r-lg mb-10 shadow-xs">
        <div className="flex items-start">
          <div className="shrink-0 text-rose-500 text-xl font-bold mr-3">⚠️</div>
          <div>
            <h2 className="text-base font-semibold text-rose-900 mb-1">Medical Emergency Warning</h2>
            <p className="text-sm text-rose-800 leading-relaxed">
              If you believe you are experiencing a medical emergency, acute symptoms, or severe pain, please contact your local emergency services or visit the nearest hospital or healthcare facility immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-10 text-base sm:text-lg leading-relaxed text-slate-700">
        {/* Section 1 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">1</span>
            Purpose of WellSphere
          </h2>
          <p>
            The content published on WellSphere—including articles, guides, wellness tips, home remedies, exercise routines, and dietary suggestions—is created solely for general informational and educational purposes. Our mission is to promote healthy living, encourage preventive wellness habits, and share practical insights on managing everyday minor health concerns through sustainable lifestyle adjustments.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">2</span>
            Not Medical Advice or Clinical Diagnosis
          </h2>
          <p className="mb-4">
            WellSphere is an editorial wellness publication. We are not a healthcare provider, medical clinic, or telemedicine platform.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              The information provided on this platform is not intended to be a substitute for professional medical advice, clinical diagnosis, or prescribed treatment.
            </li>
            <li>
              We do not diagnose acute, chronic, or severe medical conditions, nor do we claim to cure any illness or disease.
            </li>
            <li>
              We do not recommend, prescribe, or endorse specific pharmaceutical medications, drugs, or clinical treatments.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">3</span>
            Focus on Everyday Wellness &amp; Prevention
          </h2>
          <p className="mb-4">
            Our content focuses primarily on holistic, drug-free approaches to everyday health, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Practical home remedies for routine, minor discomforts.</li>
            <li>Balanced nutrition, dietary improvements, and identifying unhealthy habits.</li>
            <li>Physical exercise, stretching, and daily active routines.</li>
            <li>Preventive lifestyle practices designed to support long-term vitality and reduce future health risks.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">4</span>
            Individual Responsibility &amp; Consultation
          </h2>
          <p className="mb-4">
            Every individual’s body, medical history, and nutritional tolerance are unique. What works as a safe home remedy or routine for one person may not be suitable for another.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              Always consult a qualified doctor, physician, or certified healthcare specialist before starting any new fitness routine, making significant dietary changes, or trying home remedies—especially if you have pre-existing health conditions, are taking prescription medication, or are pregnant.
            </li>
            <li>
              Never disregard or delay seeking professional medical advice because of something you have read on WellSphere.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">5</span>
            Emergencies
          </h2>
          <p>
            If you believe you are experiencing a medical emergency, acute symptoms, or severe pain, please contact your local emergency services or visit the nearest hospital or healthcare facility immediately.
          </p>
        </section>
      </div>

      {/* Footer Navigation Back Link */}
      <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between items-center text-sm text-slate-600">
        <NavLink to="/" className="text-teal-700 font-semibold hover:underline flex items-center gap-1">
          ← Return to Home
        </NavLink>
        <NavLink to="/contact" className="hover:text-slate-900 transition-colors">
          Contact Editorial Team
        </NavLink>
      </div>
    </article>
  );
}

export default DisclaimerPage;
