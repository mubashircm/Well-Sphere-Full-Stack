/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";

// Dynamic Code Splitting for Public Pages
const HomePage = lazy(() => import("../pages/public/HomePage.jsx"));
const ArticlePage = lazy(() => import("../pages/public/ArticlePage.jsx"));
const SearchPage = lazy(() => import("../pages/public/SearchPage.jsx"));
const TopicsPage = lazy(() => import("../pages/public/TopicsPage.jsx"));
const TopicDetailPage = lazy(() => import("../pages/public/TopicDetailPage.jsx"));
const AboutPage = lazy(() => import("../pages/public/AboutPage.jsx"));
const ContactPage = lazy(() => import("../pages/public/ContactPage.jsx"));
const PrivacyPage = lazy(() => import("../pages/public/PrivacyPage.jsx"));
const TermsPage = lazy(() => import("../pages/public/TermsPage.jsx"));
const DisclaimerPage = lazy(() => import("../pages/public/DisclaimerPage.jsx"));
const HealthDisclaimerPage = lazy(() => import("../pages/public/HealthDisclaimerPage.jsx"));
const AccessibilityPage = lazy(() => import("../pages/public/AccessibilityPage.jsx"));

function LazyRoute({ Component }) {
  return (
    <Suspense
      fallback={
        <div className="page-section" style={{ minHeight: "50vh" }}>
          <div className="skeleton-line skeleton-line--title" aria-hidden="true" />
          <div className="skeleton-line skeleton-line--short" aria-hidden="true" style={{ marginTop: "1rem" }} />
          <div className="skeleton-block" aria-hidden="true" style={{ height: "14rem", marginTop: "1.5rem" }} />
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}

export const publicRoutes = (
  <>
    <Route index element={<LazyRoute Component={HomePage} />} />
    <Route path="article/:slug" element={<LazyRoute Component={ArticlePage} />} />
    <Route path="search" element={<LazyRoute Component={SearchPage} />} />
    <Route path="topics" element={<LazyRoute Component={TopicsPage} />} />
    <Route path="topics/:slug" element={<LazyRoute Component={TopicDetailPage} />} />
    <Route path="about" element={<LazyRoute Component={AboutPage} />} />
    <Route path="contact" element={<LazyRoute Component={ContactPage} />} />
    <Route path="disclaimer" element={<LazyRoute Component={DisclaimerPage} />} />
    <Route path="privacy" element={<LazyRoute Component={PrivacyPage} />} />
    <Route path="terms" element={<LazyRoute Component={TermsPage} />} />
    <Route path="health-disclaimer" element={<LazyRoute Component={HealthDisclaimerPage} />} />
    <Route path="accessibility" element={<LazyRoute Component={AccessibilityPage} />} />
  </>
);

export default publicRoutes;
