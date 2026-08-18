import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaBookmark,
  FaSearch,
  FaBriefcase,
  FaComments,
  FaHeart,
  FaTrophy,
} from "react-icons/fa";
import Sidebar from "../components/layout/Sidebar";
import { api, getLoggedInUser } from "../utils/api";
import "../styles/Dashboard.css";
import "../styles/SeekerDashboard.css";

const LOGO_COLORS = ["#2563eb", "#0d9488", "#7c3aed", "#ea580c", "#db2777"];

function statusLabel(status) {
  const map = {
    applied: "Applied",
    under_review: "Under Review",
    interview: "Interview",
    offer: "Offer",
    rejected: "Rejected",
  };
  return map[status] || "Applied";
}

function statusTone(status) {
  const map = {
    applied: "gray",
    under_review: "blue",
    interview: "green",
    offer: "green",
    rejected: "gray",
  };
  return map[status] || "gray";
}

function logoLetters(company = "") {
  return company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "JB";
}

function Dashboard() {
  const user = getLoggedInUser();
  const navigate = useNavigate();
  const firstName = user?.name?.split(" ")[0] || "there";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    savedJobs: 0,
    offers: 0,
    underReview: 0,
    rejected: 0,
    appliedOnly: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [profileStrength, setProfileStrength] = useState(0);
  const [appliedIds, setAppliedIds] = useState(new Set());

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [dash, jobsRes] = await Promise.all([
          api("/user-jobs/dashboard"),
          fetch("http://localhost:5000/api/jobs").then((r) => r.json()),
        ]);

        if (cancelled) return;

        setStats(dash.stats || {});
        setRecentApplications(dash.recentApplications || []);
        setProfileStrength(dash.profileStrength || 0);

        const appliedFull = await api("/user-jobs/applied");
        if (cancelled) return;
        const ids = new Set((appliedFull.jobs || []).map((j) => String(j.id)));
        setAppliedIds(ids);

        const allJobs = Array.isArray(jobsRes) ? jobsRes : [];
        const recommended = allJobs
          .filter((job) => !ids.has(String(job.id)))
          .slice(0, 3)
          .map((job, index) => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location || "Remote",
            salary: job.salary || "Not disclosed",
            type: job.jobType || job.employment_type || "Full Time",
            logo: logoLetters(job.company),
            logoColor: LOGO_COLORS[index % LOGO_COLORS.length],
            isNew: index === 0,
            raw: job,
          }));
        setRecommendedJobs(recommended);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveRecommended = async (job) => {
    try {
      await api("/user-jobs/saved", {
        method: "POST",
        body: JSON.stringify(job.raw || job),
      });
      setStats((prev) => ({
        ...prev,
        savedJobs: (prev.savedJobs || 0) + 1,
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const totalForChart = Math.max(
    1,
    (stats.appliedOnly || 0) +
      (stats.interviews || 0) +
      (stats.underReview || 0) +
      (stats.rejected || 0) +
      (stats.offers || 0)
  );

  const pct = (n) => Math.round(((n || 0) / totalForChart) * 100);
  const pApplied = pct(stats.appliedOnly);
  const pInterview = pct(stats.interviews) + pct(stats.offers);
  const pReview = pct(stats.underReview);
  const pRejected = pct(stats.rejected);
  const donutStyle = {
    background: `conic-gradient(
      #2563eb 0 ${pApplied}%,
      #059669 ${pApplied}% ${pApplied + pInterview}%,
      #f59e0b ${pApplied + pInterview}% ${pApplied + pInterview + pReview}%,
      #f43f5e ${pApplied + pInterview + pReview}% 100%
    )`,
  };

  return (
    <div className="dashboard-layout dashboard-layout--seeker">
      <Sidebar />
      <div className="dashboard-content seeker-dash">
        <header className="seeker-topbar">
          <div className="seeker-search">
            <FaSearch />
            <input
              type="search"
              placeholder="Search for jobs, companies..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const q = e.currentTarget.value.trim();
                  navigate(q ? `/jobs?search=${encodeURIComponent(q)}` : "/jobs");
                }
              }}
            />
          </div>
          <div className="seeker-topbar__right">
            <button type="button" className="seeker-bell" aria-label="Notifications">
              <FaBell />
            </button>
            <div className="seeker-user">
              <div className="seeker-user__avatar">
                {user?.name?.charAt(0).toUpperCase() || "J"}
              </div>
              <div>
                <strong>{user?.name || "Job Seeker"}</strong>
                <span>Job Seeker</span>
              </div>
            </div>
          </div>
        </header>

        <section className="seeker-hero">
          <h1>Welcome back, {firstName}!</h1>
          <p>Find the best opportunities and grow your career.</p>
        </section>

        {error && <p className="seeker-dash-error">{error}</p>}
        {loading && <p className="seeker-dash-status">Loading your dashboard...</p>}

        <section className="seeker-stats">
          <article className="seeker-stat seeker-stat--blue">
            <div className="seeker-stat__icon">
              <FaBriefcase />
            </div>
            <div>
              <strong>{stats.applications || 0}</strong>
              <span>Applications</span>
            </div>
          </article>
          <article className="seeker-stat seeker-stat--green">
            <div className="seeker-stat__icon">
              <FaComments />
            </div>
            <div>
              <strong>{stats.interviews || 0}</strong>
              <span>Interviews</span>
            </div>
          </article>
          <article className="seeker-stat seeker-stat--purple">
            <div className="seeker-stat__icon">
              <FaHeart />
            </div>
            <div>
              <strong>{stats.savedJobs || 0}</strong>
              <span>Saved Jobs</span>
            </div>
          </article>
          <article className="seeker-stat seeker-stat--orange">
            <div className="seeker-stat__icon">
              <FaTrophy />
            </div>
            <div>
              <strong>{stats.offers || 0}</strong>
              <span>Offers</span>
            </div>
          </article>
        </section>

        <div className="seeker-main-grid">
          <section className="seeker-card">
            <div className="seeker-card__head">
              <h2>Recommended Jobs</h2>
              <Link to="/jobs">View all</Link>
            </div>
            <div className="seeker-jobs">
              {!loading && recommendedJobs.length === 0 && (
                <p className="seeker-empty">No recommendations yet. Browse jobs to get started.</p>
              )}
              {recommendedJobs.map((job) => (
                <article key={job.id} className="seeker-job">
                  <div
                    className="seeker-job__logo"
                    style={{ background: job.logoColor }}
                  >
                    {job.logo}
                  </div>
                  <div className="seeker-job__body">
                    <div className="seeker-job__title-row">
                      <h3>{job.title}</h3>
                      {job.isNew && <span className="seeker-new">New</span>}
                    </div>
                    <p>
                      {job.company} · {job.location}
                    </p>
                    <p className="seeker-job__meta">
                      {job.salary} · {job.type}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="seeker-bookmark"
                    aria-label="Save job"
                    onClick={() => handleSaveRecommended(job)}
                    disabled={appliedIds.has(String(job.id))}
                  >
                    <FaBookmark />
                  </button>
                </article>
              ))}
            </div>
          </section>

          <aside className="seeker-side-col">
            <section className="seeker-card">
              <h2>Application Status</h2>
              <div className="seeker-status">
                <div className="seeker-donut" style={donutStyle} aria-hidden="true">
                  <div className="seeker-donut__hole">{stats.applications || 0}</div>
                </div>
                <ul className="seeker-legend">
                  <li>
                    <i className="dot dot--blue" /> Applied{" "}
                    <b>{stats.appliedOnly || 0}</b>
                  </li>
                  <li>
                    <i className="dot dot--green" /> Interview{" "}
                    <b>{stats.interviews || 0}</b>
                  </li>
                  <li>
                    <i className="dot dot--amber" /> Under Review{" "}
                    <b>{stats.underReview || 0}</b>
                  </li>
                  <li>
                    <i className="dot dot--rose" /> Rejected{" "}
                    <b>{stats.rejected || 0}</b>
                  </li>
                </ul>
              </div>
            </section>

            <section className="seeker-card">
              <h2>Profile Strength</h2>
              <div className="seeker-strength">
                <strong>{profileStrength}%</strong>
                <div className="seeker-strength__bar">
                  <span style={{ width: `${profileStrength}%` }} />
                </div>
                <p>
                  {profileStrength >= 80
                    ? "Great profile — keep applying to matching roles."
                    : "Complete your profile to get better job recommendations."}
                </p>
                <Link to="/complete-profile" className="seeker-strength__link">
                  Complete profile
                </Link>
              </div>
            </section>
          </aside>
        </div>

        <section className="seeker-card seeker-recent">
          <div className="seeker-card__head">
            <h2>Recent Applications</h2>
            <Link to="/applied-jobs">View all</Link>
          </div>
          <div className="seeker-apps">
            {!loading && recentApplications.length === 0 && (
              <p className="seeker-empty">
                No applications yet.{" "}
                <Link to="/jobs">Browse jobs</Link> and apply.
              </p>
            )}
            {recentApplications.map((app) => (
              <article key={`${app.id}-${app.title}`} className="seeker-app">
                <div>
                  <h3>{app.title}</h3>
                  <p>{app.company}</p>
                </div>
                <span className={`seeker-pill seeker-pill--${statusTone(app.status)}`}>
                  {statusLabel(app.status)}
                </span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
