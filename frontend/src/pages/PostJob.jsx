import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployerSidebar from "../components/layout/EmployerSidebar";
import { api, getLoggedInUser } from "../utils/api";
import "../styles/Dashboard.css";
import "../styles/Auth.css";

function PostJob() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const user = getLoggedInUser();
  const [form, setForm] = useState({
    title: "",
    company: user?.companyName || "",
    location: "",
    jobType: "Full Time",
    employment_type: "full-time",
    job_category: "",
    salary: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const jobTypeMap = {
    "Full Time": "full-time",
    "Part Time": "part-time",
    Internship: "internship",
    Remote: "remote",
    Contract: "contract",
  };

  useEffect(() => {
    if (!isEdit) return;
    api("/employer/my-jobs")
      .then((data) => {
        const job = (data.jobs || []).find((j) => String(j.id) === String(id));
        if (!job) {
          setError("Job not found.");
          return;
        }
        setForm({
          title: job.title || "",
          company: job.company || "",
          location: job.location || "",
          jobType: job.jobType || "Full Time",
          employment_type: job.employment_type || "full-time",
          job_category: job.job_category || "",
          salary: job.salary || "",
          description: job.description || "",
        });
      })
      .catch((err) => setError(err.message));
  }, [id, isEdit]);

  const update = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) =>
      key === "jobType"
        ? {
            ...prev,
            jobType: value,
            employment_type: jobTypeMap[value] || value.toLowerCase(),
          }
        : { ...prev, [key]: value }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isEdit) {
        await api(`/employer/jobs/${id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await api("/employer/jobs", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      navigate("/employer/my-jobs");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout dashboard-layout--recruiter">
      <EmployerSidebar />
      <div className="dashboard-content">
        <div className="auth-container auth-container--wide employer-form">
          <h1>{isEdit ? "Edit Job" : "Post a Job"}</h1>
          <form onSubmit={handleSubmit}>
            <input placeholder="Job title" value={form.title} onChange={update("title")} required />
            <input placeholder="Company" value={form.company} onChange={update("company")} required />
            <input placeholder="Location" value={form.location} onChange={update("location")} required />
            <select value={form.jobType} onChange={update("jobType")}>
              <option>Full Time</option>
              <option>Part Time</option>
              <option>Internship</option>
              <option>Remote</option>
              <option>Contract</option>
            </select>
            <input placeholder="Category" value={form.job_category} onChange={update("job_category")} />
            <input placeholder="Salary (optional)" value={form.salary} onChange={update("salary")} />
            <textarea placeholder="Description" rows={5} value={form.description} onChange={update("description")} />
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Save changes" : "Publish Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostJob;
