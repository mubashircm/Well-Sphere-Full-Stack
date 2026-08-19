import { lazy, Suspense } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authRoutes } from "./routes/AuthRoutes.jsx";
import { publicRoutes } from "./routes/PublicRoutes.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import RequireAuth from "./guards/RequireAuth.jsx";
import RequireRole from "./guards/RequireRole.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import { ToastContainer } from "./components/ui/Toast.jsx";

// Lazy-loaded User pages & layout
const UserLayout = lazy(() => import("./layouts/UserLayout/UserLayout.jsx"));
const UserDashboardPage = lazy(() => import("./pages/user/UserDashboardPage.jsx"));
const ProfilePage = lazy(() => import("./pages/user/ProfilePage.jsx"));

// Lazy-loaded Editor pages
const EditorLayout = lazy(() => import("./layouts/EditorLayout/EditorLayout.jsx"));
const EditorDashboardPage = lazy(() => import("./pages/editor/EditorDashboardPage.jsx"));
const EditorArticlesPage = lazy(() => import("./pages/editor/EditorArticlesPage.jsx"));
const ArticleEditorPage = lazy(() => import("./pages/editor/ArticleEditorPage.jsx"));
const CommentModerationPage = lazy(() => import("./pages/editor/CommentModerationPage.jsx"));
const EditorAnalyticsPage = lazy(() => import("./pages/editor/EditorAnalyticsPage.jsx"));
const EditorInquiriesPage = lazy(() => import("./pages/editor/InquiriesPage.jsx"));

// Lazy-loaded Admin pages
const AdminLayout = lazy(() => import("./layouts/AdminLayout/AdminLayout.jsx"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage.jsx"));
const ReviewQueuePage = lazy(() => import("./pages/admin/ReviewQueuePage.jsx"));
const UserManagementPage = lazy(() => import("./pages/admin/UserManagementPage.jsx"));
const AuditLogsPage = lazy(() => import("./pages/admin/AuditLogsPage.jsx"));
const SystemSettingsPage = lazy(() => import("./pages/admin/SystemSettingsPage.jsx"));
const AdminInquiriesPage = lazy(() => import("./pages/admin/InquiriesPage.jsx"));

function SuspenseWrapper({ children }) {
  return (
    <Suspense
      fallback={
        <div className="page-section page-section--narrow" style={{ minHeight: "40vh" }}>
          <div className="skeleton-line skeleton-line--title" aria-hidden="true" />
          <div className="skeleton-line skeleton-line--short" aria-hidden="true" style={{ marginTop: "1rem" }} />
          <div className="skeleton-block" aria-hidden="true" style={{ height: "12rem", marginTop: "1.5rem" }} />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

function PublicLayout() {
  return (
    <div className="site-shell min-h-screen w-full max-w-full overflow-x-hidden">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navbar />
      <main id="main-content" className="page-content w-full max-w-full"><Outlet /></main>
      <Footer />
    </div>
  );
}

function AuthLayout() {
  return <main id="main-content" className="auth-shell min-h-screen w-full max-w-full overflow-x-hidden"><Outlet /></main>;
}

function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
        <Route element={<PublicLayout />}>{publicRoutes}</Route>
        <Route element={<AuthLayout />}>{authRoutes}</Route>
        
        {/* User Dashboard & Profile Workspace */}
        <Route
          element={
            <RequireAuth>
              <SuspenseWrapper><UserLayout /></SuspenseWrapper>
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<SuspenseWrapper><UserDashboardPage /></SuspenseWrapper>} />
          <Route path="/profile/saved" element={<SuspenseWrapper><ProfilePage /></SuspenseWrapper>} />
          <Route path="/profile/following" element={<SuspenseWrapper><ProfilePage /></SuspenseWrapper>} />
          <Route path="/profile/notifications" element={<SuspenseWrapper><ProfilePage /></SuspenseWrapper>} />
          <Route path="/profile/comments" element={<SuspenseWrapper><ProfilePage /></SuspenseWrapper>} />
          <Route path="/profile/settings" element={<SuspenseWrapper><ProfilePage /></SuspenseWrapper>} />
        </Route>
        
        {/* Editor Workspace */}
        <Route
          path="/editor"
          element={
            <RequireRole roles={["editor", "superadmin"]}>
              <SuspenseWrapper><EditorLayout /></SuspenseWrapper>
            </RequireRole>
          }
        >
          <Route index element={<SuspenseWrapper><EditorDashboardPage /></SuspenseWrapper>} />
          <Route path="articles" element={<SuspenseWrapper><EditorArticlesPage /></SuspenseWrapper>} />
          <Route path="articles/create" element={<SuspenseWrapper><ArticleEditorPage /></SuspenseWrapper>} />
          <Route path="articles/:id/edit" element={<SuspenseWrapper><ArticleEditorPage /></SuspenseWrapper>} />
          <Route path="comments" element={<SuspenseWrapper><CommentModerationPage /></SuspenseWrapper>} />
          <Route path="inquiries" element={<SuspenseWrapper><EditorInquiriesPage /></SuspenseWrapper>} />
          <Route path="analytics" element={<SuspenseWrapper><EditorAnalyticsPage /></SuspenseWrapper>} />
        </Route>

        {/* SuperAdmin Workspace */}
        <Route
          path="/admin"
          element={
            <RequireRole roles={["superadmin"]}>
              <SuspenseWrapper><AdminLayout /></SuspenseWrapper>
            </RequireRole>
          }
        >
          <Route index element={<SuspenseWrapper><AdminDashboardPage /></SuspenseWrapper>} />
          <Route path="review-queue" element={<SuspenseWrapper><ReviewQueuePage /></SuspenseWrapper>} />
          <Route path="users" element={<SuspenseWrapper><UserManagementPage /></SuspenseWrapper>} />
          <Route path="inquiries" element={<SuspenseWrapper><AdminInquiriesPage /></SuspenseWrapper>} />
          <Route path="audit-logs" element={<SuspenseWrapper><AuditLogsPage /></SuspenseWrapper>} />
          <Route path="settings" element={<SuspenseWrapper><SystemSettingsPage /></SuspenseWrapper>} />
        </Route>

        <Route path="/forbidden" element={<Workspace title="Access denied" detail="You do not have permission to view this area." />} />
        <Route path="*" element={<Workspace title="Page not found" detail="The page you requested does not exist or has moved." />} />
      </Routes>
    </BrowserRouter></AuthProvider>
  );
}

function Workspace({ title, detail = "This protected workspace will be connected when authentication is implemented." }) {
  return <section className="page-section page-section--narrow"><p className="eyebrow">WellSphere</p><h1>{title}</h1><p>{detail}</p></section>;
}

export default App;
