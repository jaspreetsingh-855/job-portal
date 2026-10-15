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
  const [message, setMessage] = useState("");

  const load = async () => {
    const data = await api("/employer/my-jobs");
    setJobs(data.jobs || []);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
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
      setMessage("Job deleted");
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleStatus = async (job) => {
    const next = job.status === "closed" ? "open" : "closed";
    try {
      await api(`/employer/jobs/${job.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: next }),
      });
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, status: next } : j))
      );
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
          {message && <p className="jobs-status">{message}</p>}
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
                <p>Applicants: {job.applicantCount ?? 0}</p>
                <p>Status: {job.status || "open"}</p>
                <div className="job-card-actions">
                  <Link to={`/employer/jobs/${job.id}/applicants`}>View applicants</Link>
                  <Link to={`/employer/jobs/${job.id}/edit`}>Edit</Link>
                  <button type="button" className="secondary" onClick={() => toggleStatus(job)}>
                    {job.status === "closed" ? "Reopen" : "Close"}
                  </button>
                  <button type="button" className="secondary" onClick={() => handleDelete(job.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyJobs;
