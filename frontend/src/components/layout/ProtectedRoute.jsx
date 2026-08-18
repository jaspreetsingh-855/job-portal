import { Navigate } from "react-router-dom";
import { getToken, getUserRole, homePathForRole } from "../../utils/api";

function ProtectedRoute({ children, roles }) {
  if (!getToken()) {
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
