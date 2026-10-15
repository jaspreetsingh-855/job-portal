import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../components/layout/AdminSidebar";
import { api, getLoggedInUser } from "../utils/api";
import "../styles/Dashboard.css";

function AdminDashboard() {
  const user = getLoggedInUser();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/admin/stats")
      .then((data) => setStats(data.stats))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="dashboard-layout dashboard-layout--admin">
      <AdminSidebar />
      <div className="dashboard-content">
        <div className="dash-top">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Platform overview and quick controls</p>
          </div>
          <div className="dash-user">
            <div className="dash-user__avatar admin">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <strong>{user?.name || "Admin"}</strong>
              <span>Admin</span>
            </div>
          </div>
        </div>

        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        <div className="role-stats">
          <div className="role-stat role-stat--admin">
            <strong>{stats?.users ?? "—"}</strong>
            <span>Total Users</span>
          </div>
          <div className="role-stat role-stat--admin">
            <strong>{stats?.recruiters ?? "—"}</strong>
            <span>Companies</span>
          </div>
          <div className="role-stat role-stat--admin">
            <strong>{stats?.jobs ?? "—"}</strong>
            <span>Jobs Posted</span>
          </div>
          <div className="role-stat role-stat--admin">
            <strong>{stats?.seekers ?? "—"}</strong>
            <span>Job Seekers</span>
          </div>
          <div className="role-stat role-stat--admin">
            <strong>{stats?.applications ?? "—"}</strong>
            <span>Applications</span>
          </div>
        </div>

        <div className="dash-grid dash-grid--3">
          <section className="dash-card">
            <h3>Platform Overview</h3>
            <div className="line-chart" style={{ background: "linear-gradient(180deg, transparent, rgba(124,58,237,0.08))" }}>
              <svg viewBox="0 0 320 120" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="3"
                  points="0,95 40,80 80,85 120,50 160,60 200,35 240,42 280,18 320,28"
                />
              </svg>
            </div>
          </section>

          <section className="dash-card">
            <h3>User Distribution</h3>
            <div className="chart-ring chart-ring--admin">
              <div className="chart-ring__hole">
                Roles
              </div>
            </div>
            <ul className="dash-list">
              <li>
                <em>Job Seekers</em>
                <strong>85%</strong>
              </li>
              <li>
                <em>Recruiters</em>
                <strong>10%</strong>
              </li>
              <li>
                <em>Admins</em>
                <strong>5%</strong>
              </li>
            </ul>
          </section>

          <section className="dash-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <Link className="employer-btn btn-admin" to="/admin/users">
                Manage Users
              </Link>
              <button type="button" className="employer-btn btn-admin">
                Add New Admin
              </button>
              <button type="button" className="employer-btn" style={{ background: "#fff", color: "#7c3aed", border: "1px solid #7c3aed" }}>
                View System Logs
              </button>
            </div>
          </section>
        </div>

        <section className="dash-card">
          <h3>Recent Activities</h3>
          <ul className="dash-list">
            <li>
              <div>
                <strong>New user registered</strong>
                <em>Job seeker account created</em>
              </div>
              <span className="badge badge--purple">Users</span>
            </li>
            <li>
              <div>
                <strong>Recruiter posted a job</strong>
                <em>React Developer · Remote</em>
              </div>
              <span className="badge badge--purple">Jobs</span>
            </li>
            <li>
              <div>
                <strong>Application submitted</strong>
                <em>Candidate applied to Frontend role</em>
              </div>
              <span className="badge badge--purple">Apps</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
