import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import EmployerSidebar from "../components/layout/EmployerSidebar";
import AdminSidebar from "../components/layout/AdminSidebar";
import TopNavbar from "../components/layout/TopNavbar";
import {
  api,
  fileUrl,
  getLoggedInUser,
  ROLES,
  updateStoredUser,
} from "../utils/api";
import "../styles/Dashboard.css";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getLoggedInUser() || {});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const role = user.role || ROLES.JOBSEEKER;

  useEffect(() => {
    api("/auth/me")
      .then((data) => {
        setUser(data.user);
        updateStoredUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleResume = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    const body = new FormData();
    body.append("resume", file);
    try {
      const data = await api("/auth/resume", { method: "POST", body });
      setUser(data.user);
      updateStoredUser(data.user);
      setMessage("Resume uploaded");
    } catch (err) {
      setError(err.message);
    }
  };

  const sidebar =
    role === ROLES.EMPLOYER ? (
      <EmployerSidebar />
    ) : role === ROLES.ADMIN ? (
      <AdminSidebar />
    ) : (
      <Sidebar />
    );

  const roleLabel =
    role === ROLES.EMPLOYER
      ? `Recruiter${user.companyName ? ` · ${user.companyName}` : ""}`
      : role === ROLES.ADMIN
        ? "Admin"
        : "Job Seeker";

  const layoutClass =
    role === ROLES.EMPLOYER
      ? "dashboard-layout--recruiter"
      : role === ROLES.ADMIN
        ? "dashboard-layout--admin"
        : "dashboard-layout--seeker";

  return (
    <div className={`dashboard-layout ${layoutClass}`}>
      {sidebar}
      <div className="dashboard-content">
        {role === ROLES.JOBSEEKER && <TopNavbar />}
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-image">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h1>{user?.name || "User"}</h1>
                <p>{user?.email || "No email provided"}</p>
                <p>{roleLabel}</p>
                {user.location && <p>{user.location}</p>}
                {user.experience && <p>{user.experience}</p>}
              </div>
            </div>

            <div className="profile-section">
              <h2>About</h2>
              <p>
                {user.bio ||
                  (role === ROLES.EMPLOYER
                    ? "Recruiter account for posting and managing job openings."
                    : role === ROLES.ADMIN
                      ? "Administrator account for managing the platform."
                      : "Add a short bio from Edit Profile.")}
              </p>
            </div>

            {role === ROLES.JOBSEEKER && (
              <>
                <div className="profile-section">
                  <h2>Skills</h2>
                  <div className="skills">
                    {(user.skills || []).length
                      ? user.skills.map((skill) => <span key={skill}>{skill}</span>)
                      : <p>No skills added yet.</p>}
                  </div>
                </div>
                {message && <p className="jobs-status">{message}</p>}
                {error && <p className="jobs-status">{error}</p>}
                {user.resumeUrl ? (
                  <a className="resume-btn" href={fileUrl(user.resumeUrl)} target="_blank" rel="noreferrer">
                    Download Resume
                  </a>
                ) : (
                  <p>No resume uploaded.</p>
                )}
                <label className="resume-btn" style={{ display: "inline-block", cursor: "pointer" }}>
                  Upload Resume
                  <input type="file" accept=".pdf,.doc,.docx" hidden onChange={handleResume} />
                </label>
                <div className="profile-buttons">
                  <button className="edit-btn" onClick={() => navigate("/complete-profile")}>
                    Edit Profile
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
