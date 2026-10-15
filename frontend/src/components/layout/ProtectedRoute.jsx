import { Navigate } from "react-router-dom";
import { isLoggedIn, getUserRole, homePathForRole } from "../../utils/api";

function ProtectedRoute({ children, roles }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (roles?.length) {
    const role = getUserRole();
    if (!roles.includes(role)) {
      return <Navigate to={homePathForRole(role)} replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
