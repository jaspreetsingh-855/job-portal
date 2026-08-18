import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBriefcase,
  FaClipboardList,
  FaHeart,
  FaUser,
  FaBookOpen,
  FaCog,
  FaSignOutAlt,
  FaBriefcase as FaLogo,
} from "react-icons/fa";
import { clearAuth } from "../../utils/api";
import "../../styles/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="sidebar sidebar--seeker">
      <div>
        <h2 className="logo">
          <span className="logo-mark">
            <FaLogo />
          </span>
          JobPortal
        </h2>
        <ul>
          <li className={isActive("/dashboard") ? "active" : ""} onClick={() => navigate("/dashboard")}>
            <FaHome /> Dashboard
          </li>
          <li className={isActive("/jobs") ? "active" : ""} onClick={() => navigate("/jobs")}>
            <FaBriefcase /> Browse Jobs
          </li>
          <li className={isActive("/applied-jobs") ? "active" : ""} onClick={() => navigate("/applied-jobs")}>
            <FaClipboardList /> My Applications
          </li>
          <li className={isActive("/saved-jobs") ? "active" : ""} onClick={() => navigate("/saved-jobs")}>
            <FaHeart /> Saved Jobs
          </li>
          <li className={isActive("/profile") ? "active" : ""} onClick={() => navigate("/profile")}>
            <FaUser /> Profile
          </li>
          <li className={isActive("/complete-profile") ? "active" : ""} onClick={() => navigate("/complete-profile")}>
            <FaBookOpen /> Career Resources
          </li>
          <li className={isActive("/settings") ? "active" : ""} onClick={() => navigate("/settings")}>
            <FaCog /> Settings
          </li>
        </ul>
      </div>
      <button className="logout" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}

export default Sidebar;
