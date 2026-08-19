import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

/**
 * Route guard enforcing role-based access.
 * Checks whether user.role is included in the allowed roles.
 */
export function RequireRole({ children, roles = [] }) {
  const { ready, user } = useAuth();
  const location = useLocation();

  if (!ready) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}

export default RequireRole;
