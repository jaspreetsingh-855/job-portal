import { useEffect, useState } from "react";
import { api, getToken } from "../../utils/api";
import "../../styles/JobCard.css";

function JobCard({ job, initiallySaved = false, initiallyApplied = false }) {
  const [saved, setSaved] = useState(initiallySaved);
  const [applied, setApplied] = useState(initiallyApplied);
  const [busy, setBusy] = useState(false);

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
    try {
      await api("/user-jobs/saved", {
        method: "POST",
        body: JSON.stringify(job),
      });
      setSaved(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleApply = async () => {
    if (!getToken()) {
      alert("Please login to apply.");
      return;
    }
    setBusy(true);
    try {
      await api("/user-jobs/applied", {
        method: "POST",
        body: JSON.stringify(job),
      });
      setApplied(true);
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
      <div className="job-card-actions">
        <button type="button" onClick={handleApply} disabled={applied || busy}>
          {applied ? "Applied" : "Apply"}
        </button>
        <button
          type="button"
          className="secondary"
          onClick={handleSave}
          disabled={saved || busy}
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}

export default JobCard;
