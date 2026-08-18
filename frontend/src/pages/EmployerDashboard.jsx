import { Link } from "react-router-dom";
import EmployerSidebar from "../components/layout/EmployerSidebar";
import { getLoggedInUser } from "../utils/api";
import "../styles/Dashboard.css";

function EmployerDashboard() {
  const user = getLoggedInUser();

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

        <div className="role-stats">
          <div className="role-stat role-stat--recruiter">
            <strong>15</strong>
            <span>Active Jobs</span>
          </div>
          <div className="role-stat role-stat--recruiter">
            <strong>128</strong>
            <span>Total Applicants</span>
          </div>
          <div className="role-stat role-stat--recruiter">
            <strong>45</strong>
            <span>Interviews</span>
          </div>
          <div className="role-stat role-stat--recruiter">
            <strong>12</strong>
            <span>Hired</span>
          </div>
        </div>

        <div className="dash-grid">
          <section className="dash-card">
            <h3>Recent Applicants</h3>
            <ul className="dash-list">
              <li>
                <div>
                  <strong>Aisha Khan</strong>
                  <em>Frontend Developer · Applied today</em>
                </div>
                <span className="badge badge--green">New</span>
              </li>
              <li>
                <div>
                  <strong>Rohan Mehta</strong>
                  <em>Backend Engineer · 2 days ago</em>
                </div>
                <span className="badge badge--green">Review</span>
              </li>
              <li>
                <div>
                  <strong>Neha Patel</strong>
                  <em>UI Designer · 3 days ago</em>
                </div>
                <span className="badge badge--green">Shortlist</span>
              </li>
            </ul>
          </section>

          <section className="dash-card">
            <h3>Job Performance</h3>
            <div className="line-chart">
              <svg viewBox="0 0 320 120" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3"
                  points="0,90 40,70 80,78 120,40 160,55 200,30 240,48 280,22 320,35"
                />
              </svg>
            </div>
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
              <tr>
                <td>React Developer</td>
                <td>Remote</td>
                <td>34</td>
                <td>
                  <span className="badge badge--green">Open</span>
                </td>
              </tr>
              <tr>
                <td>Product Designer</td>
                <td>Delhi</td>
                <td>21</td>
                <td>
                  <span className="badge badge--green">Open</span>
                </td>
              </tr>
              <tr>
                <td>Node.js Engineer</td>
                <td>Bangalore</td>
                <td>18</td>
                <td>
                  <span className="badge badge--green">Interviewing</span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default EmployerDashboard;
