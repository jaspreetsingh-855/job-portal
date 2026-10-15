import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmployerSidebar from "../components/layout/EmployerSidebar";
import { api, getLoggedInUser } from "../utils/api";
import "../styles/Dashboard.css";

function EmployerDashboard() {
  const user = getLoggedInUser();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/employer/dashboard")
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  const stats = data?.stats || {};

  return (
    <div className="dashboard-layout dashboard-layout--recruiter">
      <EmployerSidebar />
      <div className="dashboard-content">
        <div className="dash-top">
          <div>
            <h1>Recruiter Dashboard</h1>
            <p>
              Hiring for <strong>{user?.companyName || "your company"}</strong>
            </p>
          </div>
          <div className="dash-user">
            <div className="dash-user__avatar recruiter">
              {user?.name?.charAt(0).toUpperCase() || "R"}
            </div>
            <div>
              <strong>{user?.name || "Recruiter"}</strong>
              <span>Recruiter</span>
            </div>
          </div>
        </div>

        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        <div className="role-stats">
          <div className="role-stat role-stat--recruiter">
            <strong>{stats.activeJobs ?? "—"}</strong>
            <span>Active Jobs</span>
          </div>
          <div className="role-stat role-stat--recruiter">
            <strong>{stats.totalApplicants ?? "—"}</strong>
            <span>Total Applicants</span>
          </div>
          <div className="role-stat role-stat--recruiter">
            <strong>{stats.interviews ?? "—"}</strong>
            <span>Interviews</span>
          </div>
          <div className="role-stat role-stat--recruiter">
            <strong>{stats.hired ?? "—"}</strong>
            <span>Offers</span>
          </div>
        </div>

        <div className="dash-grid">
          <section className="dash-card">
            <h3>Recent Applicants</h3>
            <ul className="dash-list">
              {(data?.recentApplicants || []).length === 0 && (
                <li>
                  <div>
                    <strong>No applicants yet</strong>
                    <em>Post a job and wait for applications</em>
                  </div>
                </li>
              )}
              {(data?.recentApplicants || []).map((app) => (
                <li key={app.id}>
                  <div>
                    <strong>{app.name}</strong>
                    <em>
                      {app.title} · {app.status}
                    </em>
                  </div>
                  <Link to={`/employer/jobs/${app.jobId}/applicants`}>View</Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="dash-card">
            <h3>Quick actions</h3>
            <div className="employer-actions">
              <Link className="employer-btn btn-recruiter" to="/employer/post-job">
                Post a Job
              </Link>
              <Link className="employer-btn btn-ghost-recruiter" to="/employer/my-jobs">
                My Jobs
              </Link>
            </div>
          </section>
        </div>

        <section className="dash-card">
          <h3>Active Job Listings</h3>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Location</th>
                <th>Applicants</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(data?.jobs || []).length === 0 && (
                <tr>
                  <td colSpan={4}>No jobs posted yet</td>
                </tr>
              )}
              {(data?.jobs || []).map((job) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.location}</td>
                  <td>{job.applicantCount ?? 0}</td>
                  <td>
                    <span className="badge badge--green">{job.status || "open"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default EmployerDashboard;
