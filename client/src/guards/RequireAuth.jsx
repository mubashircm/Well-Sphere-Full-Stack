import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

/**
 * Route guard requiring an authenticated user.
 * Redirects unauthenticated visitors to /login with return location.
 */
export function RequireAuth({ children }) {
  const { ready, user } = useAuth();
  const location = useLocation();

  if (!ready) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireAuth;
