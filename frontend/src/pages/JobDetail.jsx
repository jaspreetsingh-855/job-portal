import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import { api, getToken } from "../utils/api";
import "../styles/Dashboard.css";
import "../styles/Jobs.css";
import "../styles/Auth.css";

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api(`/jobs/${id}`);
        if (!cancelled) setJob(data);
        if (getToken()) {
          const [savedRes, appliedRes] = await Promise.all([
            api("/user-jobs/saved"),
            api("/user-jobs/applied"),
          ]);
          if (cancelled) return;
          setSaved((savedRes.jobs || []).some((j) => String(j.id) === String(id)));
          setApplied((appliedRes.jobs || []).some((j) => String(j.id) === String(id)));
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

  const handleSave = async () => {
    setBusy(true);
    setError("");
    try {
      if (saved) {
        await api(`/user-jobs/saved/${id}`, { method: "DELETE" });
        setSaved(false);
        setMessage("Removed from saved jobs");
      } else {
        await api("/user-jobs/saved", {
          method: "POST",
          body: JSON.stringify(job),
        });
        setSaved(true);
        setMessage("Job saved");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!getToken()) {
      setError("Please login to apply.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const data = await api("/user-jobs/applied", {
        method: "POST",
        body: JSON.stringify({ ...job, coverLetter }),
      });
      setApplied(true);
      setMessage(data.message || "Applied successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="dashboard-layout dashboard-layout--seeker">
      <Sidebar />
      <div className="dashboard-content">
        <TopNavbar />
        <div className="jobs-container">
          <Link to="/jobs">← Back to jobs</Link>
          {loading && <p className="jobs-status">Loading...</p>}
          {error && <p className="jobs-status">{error}</p>}
          {job && (
            <div className="job-card" style={{ maxWidth: 720, marginTop: 16 }}>
              <h1>{job.title}</h1>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Type:</strong> {job.employment_type || job.jobType}</p>
              {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
              {job.status === "closed" && <p><strong>Status:</strong> Closed</p>}
              <p style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>
                {job.description || "No description provided."}
              </p>
              {message && <p className="jobs-status">{message}</p>}
              <div className="job-card-actions" style={{ marginTop: 16 }}>
                <button type="button" className="secondary" onClick={handleSave} disabled={busy}>
                  {saved ? "Unsave" : "Save"}
                </button>
              </div>
              {!applied && job.status !== "closed" && (
                <form onSubmit={handleApply} style={{ marginTop: 20 }}>
                  <textarea
                    rows={5}
                    placeholder="Cover letter (optional)"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                  <button type="submit" disabled={busy}>
                    {busy ? "Applying..." : "Apply now"}
                  </button>
                </form>
              )}
              {applied && <p className="jobs-status">You have applied for this job.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDetail;
