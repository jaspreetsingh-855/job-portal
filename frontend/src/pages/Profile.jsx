import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import "../styles/Dashboard.css";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <TopNavbar />
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-image">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h1>{user?.name || "User"}</h1>
                <p>{user?.email || "No email provided"}</p>
              </div>
            </div>

            <div className="profile-section">
              <h2>About</h2>
              <p>Passionate job seeker looking for new opportunities.</p>
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
