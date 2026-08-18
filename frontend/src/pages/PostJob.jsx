import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployerSidebar from "../components/layout/EmployerSidebar";
import { api, getLoggedInUser } from "../utils/api";
import "../styles/Dashboard.css";
import "../styles/Auth.css";

function PostJob() {
  const navigate = useNavigate();
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
      await api("/employer/jobs", {
        method: "POST",
        body: JSON.stringify(form),
      });
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
          <h1>Post a Job</h1>
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
              {loading ? "Posting..." : "Publish Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostJob;
