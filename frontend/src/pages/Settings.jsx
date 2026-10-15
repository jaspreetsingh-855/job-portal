import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import EmployerSidebar from "../components/layout/EmployerSidebar";
import AdminSidebar from "../components/layout/AdminSidebar";
import { api, getLoggedInUser, getUserRole, ROLES } from "../utils/api";
import "../styles/Dashboard.css";
import "../styles/Auth.css";

function Settings() {
  const user = getLoggedInUser();
  const role = getUserRole();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const layoutClass =
    role === ROLES.EMPLOYER
      ? "dashboard-layout--recruiter"
      : role === ROLES.ADMIN
        ? "dashboard-layout--admin"
        : "dashboard-layout--seeker";

  const sidebar =
    role === ROLES.EMPLOYER ? (
      <EmployerSidebar />
    ) : role === ROLES.ADMIN ? (
      <AdminSidebar />
    ) : (
      <Sidebar />
    );

  const handlePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const data = await api("/auth/password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setMessage(data.message || "Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`dashboard-layout ${layoutClass}`}>
      {sidebar}
      <div className="dashboard-content">
        <div className="dash-card" style={{ maxWidth: 640 }}>
          <h3>Settings</h3>
          <p style={{ color: "#64748b", marginBottom: 16 }}>
            Account preferences for {user?.name || "your account"}.
          </p>
          <ul className="dash-list">
            <li>
              <div>
                <strong>Email</strong>
                <em>{user?.email}</em>
              </div>
            </li>
            <li>
              <div>
                <strong>Role</strong>
                <em>{role}</em>
              </div>
            </li>
            {user?.companyName && (
              <li>
                <div>
                  <strong>Company</strong>
                  <em>{user.companyName}</em>
                </div>
              </li>
            )}
          </ul>

          <h3 style={{ marginTop: 24 }}>Change password</h3>
          <form onSubmit={handlePassword} className="auth-container" style={{ boxShadow: "none", padding: 0 }}>
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New password (8+ chars, number, special)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {error && <p className="auth-error">{error}</p>}
            {message && <p className="jobs-status">{message}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
