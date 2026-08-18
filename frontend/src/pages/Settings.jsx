import Sidebar from "../components/layout/Sidebar";
import EmployerSidebar from "../components/layout/EmployerSidebar";
import AdminSidebar from "../components/layout/AdminSidebar";
import { getLoggedInUser, getUserRole, ROLES } from "../utils/api";
import "../styles/Dashboard.css";

function Settings() {
  const user = getLoggedInUser();
  const role = getUserRole();

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
            <li>
              <div>
                <strong>Notifications</strong>
                <em>Email alerts enabled (demo)</em>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Settings;
