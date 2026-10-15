import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, getToken } from "../../utils/api";
import "../../styles/JobCard.css";

function JobCard({ job, initiallySaved = false, initiallyApplied = false }) {
  const [saved, setSaved] = useState(initiallySaved);
  const [applied, setApplied] = useState(initiallyApplied);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    setSaved(initiallySaved);
    setApplied(initiallyApplied);
  }, [initiallySaved, initiallyApplied]);

  const handleSave = async () => {
    if (!getToken()) {
      alert("Please login to save jobs.");
      return;
    }
    setBusy(true);
    setNote("");
    try {
      if (saved) {
        await api(`/user-jobs/saved/${job.id}`, { method: "DELETE" });
        setSaved(false);
        setNote("Removed from saved");
      } else {
        await api("/user-jobs/saved", {
          method: "POST",
          body: JSON.stringify(job),
        });
        setSaved(true);
        setNote("Job saved");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="job-card">
      <h2>{job.title}</h2>
      <p>
        <strong>Company:</strong> {job.company}
      </p>
      <p>
        <strong>Location:</strong> {job.location}
      </p>
      <p>
        <strong>Type:</strong> {job.employment_type || job.jobType || "N/A"}
      </p>
      {job.job_category && (
        <p>
          <strong>Category:</strong> {job.job_category}
        </p>
      )}
      {note && <p className="jobs-status" style={{ marginTop: 8 }}>{note}</p>}
      <div className="job-card-actions">
        <Link className="job-card-link" to={`/jobs/${job.id}`}>
          View details
        </Link>
        <button
          type="button"
          className="secondary"
          onClick={handleSave}
          disabled={busy}
        >
          {saved ? "Unsave" : "Save"}
        </button>
        <Link to={`/jobs/${job.id}`}>
          <button type="button" disabled={applied || busy}>
            {applied ? "Applied" : "Apply"}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default JobCard;
