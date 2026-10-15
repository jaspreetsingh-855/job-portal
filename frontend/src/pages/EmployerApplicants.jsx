import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmployerSidebar from "../components/layout/EmployerSidebar";
import { api, fileUrl } from "../utils/api";
import "../styles/Dashboard.css";
import "../styles/Jobs.css";

const STATUSES = ["applied", "under_review", "interview", "offer", "rejected"];

function EmployerApplicants() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api(`/employer/jobs/${id}/applications`);
        if (!cancelled) {
          setJob(data.job);
          setApplications(data.applications || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const changeStatus = async (appId, status) => {
    setError("");
    try {
      await api(`/employer/applications/${appId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status } : app))
      );
      setMessage("Status updated");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-layout dashboard-layout--recruiter">
      <EmployerSidebar />
      <div className="dashboard-content">
        <div className="jobs-container">
          <Link to="/employer/my-jobs">← My jobs</Link>
          <h1>Applicants{job ? ` · ${job.title}` : ""}</h1>
          {loading && <p className="jobs-status">Loading...</p>}
          {error && <p className="jobs-status">{error}</p>}
          {message && <p className="jobs-status">{message}</p>}
          {!loading && applications.length === 0 && (
            <p className="jobs-status">No applicants yet.</p>
          )}
          <div className="jobs-list">
            {applications.map((app) => (
              <div key={app.id} className="job-card">
                <h2>{app.seeker?.name}</h2>
                <p>{app.seeker?.email}</p>
                {app.seeker?.phone && <p>{app.seeker.phone}</p>}
                {app.seeker?.experience && <p>{app.seeker.experience}</p>}
                {app.coverLetter && <p>{app.coverLetter}</p>}
                {app.seeker?.resumeUrl && (
                  <p>
                    <a href={fileUrl(app.seeker.resumeUrl)} target="_blank" rel="noreferrer">
                      Download resume
                    </a>
                  </p>
                )}
                <label>
                  Status{" "}
                  <select
                    value={app.status}
                    onChange={(e) => changeStatus(app.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployerApplicants;
