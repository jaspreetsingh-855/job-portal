import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmployerSidebar from "../components/layout/EmployerSidebar";
import { api } from "../utils/api";
import "../styles/Dashboard.css";
import "../styles/Jobs.css";

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api("/employer/my-jobs");
        if (!cancelled) setJobs(data.jobs || []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await api(`/employer/jobs/${id}`, { method: "DELETE" });
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-layout dashboard-layout--recruiter">
      <EmployerSidebar />
      <div className="dashboard-content">
        <div className="jobs-container">
          <div className="jobs-header-row">
            <h1>My Posted Jobs</h1>
            <Link className="employer-btn" to="/employer/post-job">
              Post a Job
            </Link>
          </div>
          {loading && <p className="jobs-status">Loading...</p>}
          {error && <p className="jobs-status">{error}</p>}
          {!loading && !error && jobs.length === 0 && (
            <p className="jobs-status">
              No jobs yet. <Link to="/employer/post-job">Post your first job</Link>
            </p>
          )}
          <div className="jobs-list">
            {jobs.map((job) => (
              <div key={job.id} className="job-card">
                <h2>{job.title}</h2>
                <p>{job.company}</p>
                <p>{job.location}</p>
                <button type="button" className="secondary" onClick={() => handleDelete(job.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyJobs;
