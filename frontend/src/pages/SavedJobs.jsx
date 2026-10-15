import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import { api } from "../utils/api";
import "../styles/Dashboard.css";
import "../styles/Jobs.css";

function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await api("/user-jobs/saved");
        if (!cancelled) setJobs(data.jobs || []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const unsave = async (id) => {
    try {
      await api(`/user-jobs/saved/${id}`, { method: "DELETE" });
      setJobs((prev) => prev.filter((job) => String(job.id) !== String(id)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-layout dashboard-layout--seeker">
      <Sidebar />
      <div className="dashboard-content">
        <TopNavbar />
        <div className="jobs-container">
          <h1>Saved Jobs</h1>

          {loading && <p className="jobs-status">Loading...</p>}
          {error && <p className="jobs-status">{error}</p>}
          {!loading && !error && jobs.length === 0 && (
            <p className="jobs-status">No saved jobs yet.</p>
          )}
          {!loading && jobs.length > 0 && (
            <div className="jobs-list">
              {jobs.map((job) => (
                <div key={job.id} className="job-card">
                  <h2>{job.title}</h2>
                  <p>{job.company}</p>
                  <p>{job.location}</p>
                  <div className="job-card-actions">
                    <Link to={`/jobs/${job.id}`}>View</Link>
                    <button type="button" className="secondary" onClick={() => unsave(job.id)}>
                      Unsave
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SavedJobs;
