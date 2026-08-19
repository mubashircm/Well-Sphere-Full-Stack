import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Breadcrumb from "../../components/ui/Breadcrumb.jsx";

function AboutPage() {
  useEffect(() => {
    document.title = "About Us | WellSphere";
    window.scrollTo(0, 0);
    return () => {
      document.title = "WellSphere";
    };
  }, []);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-slate-800">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "About" }]} />

      {/* Hero Header */}
      <header className="border-b border-slate-200 pb-8 mb-10">
        <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
          Our Story &amp; Philosophy
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
          About WellSphere
        </h1>
        <p className="text-lg sm:text-xl text-teal-800 font-medium leading-relaxed">
          Empowering everyday wellness through clear, actionable, and sustainable lifestyle insights.
        </p>
      </header>

      {/* Content Sections */}
      <div className="space-y-10 text-base sm:text-lg leading-relaxed text-slate-700">
        {/* Section 1 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">1</span>
            Our Mission: Making Everyday Wellness Simple &amp; Accessible
          </h2>
          <p className="mb-4">
            At WellSphere, we believe that true well-being is not built on complicated medical jargon, extreme quick fixes, or unnecessary medication. It is built through small, consistent, and sustainable daily habits.
          </p>
          <p>
            Our mission is to empower individuals to take control of their everyday vitality through practical nutrition, mindful lifestyle routines, natural home remedies, and preventive wellness education.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">2</span>
            Why We Started
          </h2>
          <p className="mb-4">
            The digital world is flooded with conflicting health trends, fear-driven headlines, and confusing clinical advice. Finding clear, grounded, and drug-free solutions for everyday discomforts shouldn&apos;t feel like a chore.
          </p>
          <p>
            WellSphere was created as an approachable, trustworthy editorial publication—a digital sanctuary where health knowledge is translated into actionable steps anyone can integrate into their daily routine.
          </p>
        </section>

        {/* Section 3 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">3</span>
            What We Focus On
          </h2>
          <p className="mb-4">
            We specialize in non-clinical, lifestyle-first health topics designed to prevent future complications and enhance daily energy:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-1">🥑 Balanced Nutrition &amp; Diet</h3>
              <p className="text-sm text-slate-600">Practical eating habits, identifying hidden processed foods, and wholesome nutrition tips tailored for real life.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-1">🌿 Routine Discomforts &amp; Home Remedies</h3>
              <p className="text-sm text-slate-600">Time-tested, drug-free approaches for managing everyday concerns like digestion, sleep troubles, fatigue, and posture strain.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-1">🏃 Active Living &amp; Movement</h3>
              <p className="text-sm text-slate-600">Functional stretching, daily mobility, and beginner-friendly workout principles to keep your body agile.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-1">☀️ Preventive Lifestyle Habits</h3>
              <p className="text-sm text-slate-600">Practical routines designed to support immune resilience and long-term physical wellness.</p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-sm font-bold">4</span>
            Our Editorial Principles
          </h2>
          <ul className="space-y-4 text-slate-700">
            <li className="flex items-start gap-3">
              <span className="text-teal-600 font-bold text-lg">✓</span>
              <div>
                <strong>Clarity Over Jargon:</strong> We write in simple, digestible human language so you spend less time decoding and more time living healthy.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-teal-600 font-bold text-lg">✓</span>
              <div>
                <strong>Education, Not Prescriptions:</strong> We do not diagnose illnesses or recommend synthetic pharmaceuticals. We respect the boundary between daily wellness habits and clinical medicine.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-teal-600 font-bold text-lg">✓</span>
              <div>
                <strong>Reader-First Trust:</strong> We do not publish clickbait or unverified health fads. Every guide is structured to offer safe, actionable, and sensible information.
              </div>
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="bg-amber-50/70 p-6 sm:p-8 rounded-xl border border-amber-200/80 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-950 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-sm font-bold">5</span>
            A Note on Medical Care
          </h2>
          <p className="text-amber-900/90 leading-relaxed">
            While we are passionate about natural wellness and preventive health, we firmly advocate for professional medicine when needed. WellSphere is an educational publication and does not replace your doctor. For severe illnesses, acute symptoms, or prescription therapies, always consult a certified healthcare specialist.
          </p>
        </section>
      </div>

      {/* Footer Navigation Back Link */}
      <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between items-center text-sm text-slate-600">
        <NavLink to="/" className="text-teal-700 font-semibold hover:underline flex items-center gap-1">
          ← Return to Home
        </NavLink>
        <div className="flex gap-4">
          <NavLink to="/topics" className="hover:text-slate-900 transition-colors">
            Explore Topics
          </NavLink>
          <NavLink to="/disclaimer" className="hover:text-slate-900 transition-colors">
            Medical Disclaimer
          </NavLink>
        </div>
      </div>
    </article>
  );
}

export default AboutPage;
