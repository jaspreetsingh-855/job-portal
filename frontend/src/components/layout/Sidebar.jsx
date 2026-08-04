import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBriefcase,
  FaClipboardList,
  FaHeart,
  FaBuilding,
  FaEnvelope,
  FaUser,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { clearAuth } from "../../utils/api";
import "../../styles/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    clearAuth();
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div>
        <h2 className="logo">💼 Job Portal</h2>

        <ul>
          <li
            className={isActive("/dashboard") ? "active" : ""}
            onClick={() => navigate("/dashboard")}
          >
            <FaHome />
            Dashboard
          </li>
          <li
            className={isActive("/jobs") ? "active" : ""}
            onClick={() => navigate("/jobs")}
            title="Opens Jobs page (Jobs.jsx)"
          >
            <FaBriefcase />
            Find Jobs
          </li>
          <li
            className={isActive("/applied-jobs") ? "active" : ""}
            onClick={() => navigate("/applied-jobs")}
          >
            <FaClipboardList />
            Applications
          </li>
          <li
            className={isActive("/saved-jobs") ? "active" : ""}
            onClick={() => navigate("/saved-jobs")}
          >
            <FaHeart />
            Saved Jobs
          </li>
          <li>
            <FaBuilding />
            Companies
          </li>
          <li>
            <FaEnvelope />
            Messages
          </li>
          <li
            className={isActive("/profile") ? "active" : ""}
            onClick={() => navigate("/profile")}
          >
            <FaUser />
            Profile
          </li>
          <li
            className={isActive("/complete-profile") ? "active" : ""}
            onClick={() => navigate("/complete-profile")}
          >
            <FaFileAlt />
            Resume
          </li>
          <li>
            <FaCog />
            Settings
          </li>
        </ul>
      </div>

      <button className="logout" onClick={handleLogout}>
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
