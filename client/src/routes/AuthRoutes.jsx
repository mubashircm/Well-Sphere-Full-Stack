import { Route } from "react-router-dom";
import AuthPage from "../pages/auth/AuthPage.jsx";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage.jsx";

export const authRoutes = (
  <>
    <Route path="login" element={<AuthPage mode="login" />} />
    <Route path="register" element={<AuthPage mode="signup" />} />
    <Route path="forgot-password" element={<ForgotPasswordPage />} />
    <Route path="reset-password" element={<AuthPage mode="reset" />} />
  </>
);

export default authRoutes;
