import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import JobCard from "../components/jobs/JobCard";
import { mockJobs } from "../data/mockJobs";
import { api, getToken } from "../utils/api";
import "../styles/Dashboard.css";
import "../styles/Jobs.css";

function matchesJobType(job, jobType) {
  if (jobType === "All") return true;

  const type = (job.employment_type || job.jobType || "").toLowerCase();
  const map = {
    "Full Time": "full-time",
    "Part Time": "part-time",
    Internship: "intern",
    Remote: "remote",
    Contract: "contract",
    Freelance: "freelance",
  };

  const needle = map[jobType] || jobType.toLowerCase();

  if (jobType === "Remote" && (job.is_remote_work === 1 || job.is_remote_work === true)) {
    return true;
  }

  return type.includes(needle);
}

function matchesLocation(job, location) {
  if (location === "All") return true;
  const loc = (job.location || "").toLowerCase();
  if (location === "Remote") {
    return (
      loc.includes("remote") ||
      job.is_remote_work === 1 ||
      job.is_remote_work === true
    );
  }
  return loc.includes(location.toLowerCase());
}

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState("");
  const [savedIds, setSavedIds] = useState(new Set());
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [searchParams] = useSearchParams();

  const filters = {
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "All",
    jobType: searchParams.get("jobType") || "All",
  };

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    let cancelled = false;

    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/jobs", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        if (cancelled) return;

        if (Array.isArray(data) && data.length > 0) {
          setJobs(data);
          setDataSource("api");
        } else {
          setJobs(mockJobs);
          setDataSource("mock");
        }
      } catch (error) {
        if (cancelled || error.name === "AbortError") return;

        console.warn("Jobs API unavailable, using mock data:", error.message);
        setJobs(mockJobs);
        setDataSource("mock");
      } finally {
        clearTimeout(timeoutId);
        if (!cancelled) setLoading(false);
      }
    };

    fetchJobs();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;

    async function loadUserJobs() {
      try {
        const [savedRes, appliedRes] = await Promise.all([
          api("/user-jobs/saved"),
          api("/user-jobs/applied"),
        ]);
        if (cancelled) return;
        setSavedIds(new Set((savedRes.jobs || []).map((j) => j.id)));
        setAppliedIds(new Set((appliedRes.jobs || []).map((j) => j.id)));
      } catch {
        // ignore
      }
    }

    loadUserJobs();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const q = filters.search.toLowerCase();
    const matchSearch =
      !q ||
      (job.title || "").toLowerCase().includes(q) ||
      (job.company || "").toLowerCase().includes(q) ||
      (job.job_category || "").toLowerCase().includes(q);

    return (
      matchSearch &&
      matchesLocation(job, filters.location) &&
      matchesJobType(job, filters.jobType)
    );
  });

  return (
    <div className="dashboard-layout dashboard-layout--seeker">
      <Sidebar />
      <div className="dashboard-content">
        <TopNavbar />
        <div className="jobs-container">
          <h1>Available Jobs</h1>
          {!loading && dataSource === "api" && (
            <p className="jobs-status">Loaded from API (backend)</p>
          )}
          {!loading && dataSource === "mock" && (
            <p className="jobs-status">
              Backend offline — showing mock jobs. Start backend on port 5000.
            </p>
          )}

          {loading ? (
            <p className="jobs-status">Loading jobs...</p>
          ) : filteredJobs.length > 0 ? (
            <div className="jobs-list">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  initiallySaved={savedIds.has(job.id)}
                  initiallyApplied={appliedIds.has(job.id)}
                />
              ))}
            </div>
          ) : (
            <h2 className="jobs-status">No Jobs Found</h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default Jobs;
