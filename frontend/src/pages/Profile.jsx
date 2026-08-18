import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import EmployerSidebar from "../components/layout/EmployerSidebar";
import AdminSidebar from "../components/layout/AdminSidebar";
import TopNavbar from "../components/layout/TopNavbar";
import { getLoggedInUser, ROLES } from "../utils/api";
import "../styles/Dashboard.css";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();
  const user = getLoggedInUser() || {};
  const role = user.role || ROLES.JOBSEEKER;

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
              </div>
            </div>

            <div className="profile-section">
              <h2>About</h2>
              <p>
                {role === ROLES.EMPLOYER
                  ? "Recruiter account for posting and managing job openings."
                  : role === ROLES.ADMIN
                    ? "Administrator account for managing the platform."
                    : "Passionate job seeker looking for new opportunities."}
              </p>
            </div>

            {role === ROLES.JOBSEEKER && (
              <>
                <div className="profile-section">
                  <h2>Skills</h2>
                  <div className="skills">
                    <span>React</span>
                    <span>JavaScript</span>
                    <span>HTML/CSS</span>
                    <span>Node.js</span>
                  </div>
                </div>
                <button className="resume-btn">Download Resume</button>
                <div className="profile-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => navigate("/complete-profile")}
                  >
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
