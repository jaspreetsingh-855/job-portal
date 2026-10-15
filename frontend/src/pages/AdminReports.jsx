import { useEffect, useState } from "react";
import AdminSidebar from "../components/layout/AdminSidebar";
import { api } from "../utils/api";
import "../styles/Dashboard.css";

function AdminReports() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/admin/reports")
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  const stats = data?.stats || {};
  const statusCounts = data?.statusCounts || {};

  return (
    <div className="dashboard-layout dashboard-layout--admin">
      <AdminSidebar />
      <div className="dashboard-content">
        <div className="dash-top">
          <div>
            <h1>Reports & Analytics</h1>
            <p>Live counts from MongoDB</p>
          </div>
        </div>

        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        <div className="role-stats">
          <div className="role-stat role-stat--admin">
            <strong>{stats.users ?? "—"}</strong>
            <span>Users</span>
          </div>
          <div className="role-stat role-stat--admin">
            <strong>{stats.jobs ?? "—"}</strong>
            <span>Jobs ({stats.openJobs ?? 0} open)</span>
          </div>
          <div className="role-stat role-stat--admin">
            <strong>{stats.applications ?? "—"}</strong>
            <span>Applications</span>
          </div>
          <div className="role-stat role-stat--admin">
            <strong>{stats.recruiters ?? "—"}</strong>
            <span>Employers</span>
          </div>
        </div>

        <section className="dash-card">
          <h3>Application pipeline</h3>
          <ul className="dash-list">
            {Object.entries(statusCounts).map(([key, value]) => (
              <li key={key}>
                <div>
                  <strong>{key.replace("_", " ")}</strong>
                </div>
                <em>{value}</em>
              </li>
            ))}
          </ul>
        </section>

        <div className="dash-grid">
          <section className="dash-card">
            <h3>Recent users</h3>
            <ul className="dash-list">
              {(data?.recentUsers || []).map((u) => (
                <li key={u.id}>
                  <div>
                    <strong>{u.name}</strong>
                    <em>
                      {u.role} · {u.email}
                    </em>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section className="dash-card">
            <h3>Recent jobs</h3>
            <ul className="dash-list">
              {(data?.recentJobs || []).map((j) => (
                <li key={j.id}>
                  <div>
                    <strong>{j.title}</strong>
                    <em>
                      {j.company} · {j.status}
                    </em>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="dash-card">
          <h3>Recent applications</h3>
          <ul className="dash-list">
            {(data?.recentApplications || []).map((a) => (
              <li key={a.id}>
                <div>
                  <strong>{a.seeker}</strong>
                  <em>
                    {a.title} · {a.status}
                  </em>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default AdminReports;
