import { Link } from "react-router-dom";
import Logo from "../common/Logo.jsx";

function Footer() {
  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200/80" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* 4-Column Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4">
            <Logo className="h-8 w-auto" />
            <p className="text-sm text-slate-500 leading-relaxed">
              Empowering everyday wellness with clear, practical, and accessible lifestyle insights.
            </p>
            <div className="pt-2">
              <a
                href="mailto:wellsphere.official@gmail.com"
                className="text-xs font-medium text-teal-700 hover:text-teal-800 hover:underline inline-flex items-center gap-1.5 transition-colors"
              >
                <span>✉️</span> wellsphere.official@gmail.com
              </a>
            </div>
          </div>

          {/* Column 2: Explore & Topics */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-600 hover:text-teal-700 transition-colors duration-150">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/topics" className="text-slate-600 hover:text-teal-700 transition-colors duration-150">
                  Health Topics
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-slate-600 hover:text-teal-700 transition-colors duration-150">
                  Search Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Editorial & Platform */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="text-slate-600 hover:text-teal-700 transition-colors duration-150">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-600 hover:text-teal-700 transition-colors duration-150">
                  Editorial Inquiries
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-slate-600 hover:text-teal-700 transition-colors duration-150">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-600 hover:text-teal-700 transition-colors duration-150">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Transparency */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/disclaimer" className="text-slate-600 hover:text-teal-700 transition-colors duration-150">
                  Medical Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-600 hover:text-teal-700 transition-colors duration-150">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-600 hover:text-teal-700 transition-colors duration-150">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Separated Bottom Bar */}
        <div className="border-t border-slate-200/70 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center sm:text-left">
          <p className="m-0">
            &copy; 2026 WellSphere. All rights reserved.
          </p>
          <p className="m-0 max-w-md text-slate-400 leading-relaxed">
            WellSphere provides educational wellness content and does not substitute professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
