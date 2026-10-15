import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import JobCard from "../components/jobs/JobCard";
import { mockJobs } from "../data/mockJobs";
import { api, getToken, jobsFromResponse } from "../utils/api";
import "../styles/Dashboard.css";
import "../styles/Jobs.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState("");
  const [savedIds, setSavedIds] = useState(new Set());
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchParams] = useSearchParams();

  const filters = {
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "All",
    jobType: searchParams.get("jobType") || "All",
  };

  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.location, filters.jobType]);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    let cancelled = false;

    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "12",
          search: filters.search,
          location: filters.location,
          jobType: filters.jobType,
        });
        const response = await fetch(`http://localhost:5000/api/jobs?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (cancelled) return;

        const list = jobsFromResponse(data);
        if (list.length > 0 || data.total === 0) {
          setJobs(list);
          setTotal(data.total ?? list.length);
          setPages(data.pages || 1);
          setDataSource("api");
        } else {
          setJobs(mockJobs);
          setDataSource("mock");
        }
      } catch (error) {
        if (cancelled || error.name === "AbortError") return;
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
  }, [page, filters.search, filters.location, filters.jobType]);

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
        setSavedIds(new Set((savedRes.jobs || []).map((j) => String(j.id))));
        setAppliedIds(new Set((appliedRes.jobs || []).map((j) => String(j.id))));
      } catch {
        // ignore
      }
    }

    loadUserJobs();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="dashboard-layout dashboard-layout--seeker">
      <Sidebar />
      <div className="dashboard-content">
        <TopNavbar />
        <div className="jobs-container">
          <h1>Available Jobs</h1>
          {!loading && dataSource === "api" && (
            <p className="jobs-status">
              Loaded from API ({total} jobs)
            </p>
          )}
          {!loading && dataSource === "mock" && (
            <p className="jobs-status">
              Backend offline — showing mock jobs. Start backend on port 5000.
            </p>
          )}

          {loading ? (
            <p className="jobs-status">Loading jobs...</p>
          ) : jobs.length > 0 ? (
            <>
              <div className="jobs-list">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    initiallySaved={savedIds.has(String(job.id))}
                    initiallyApplied={appliedIds.has(String(job.id))}
                  />
                ))}
              </div>
              {pages > 1 && (
                <div className="job-card-actions" style={{ justifyContent: "center", marginTop: 24 }}>
                  <button type="button" className="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    Previous
                  </button>
                  <span className="jobs-status">
                    Page {page} of {pages}
                  </span>
                  <button type="button" className="secondary" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <h2 className="jobs-status">No Jobs Found</h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default Jobs;
