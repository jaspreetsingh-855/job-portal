import { Navigate } from "react-router-dom";
import { getToken } from "../../utils/api";

function ProtectedRoute({ children }) {
  const isLoggedIn = Boolean(getToken());

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
