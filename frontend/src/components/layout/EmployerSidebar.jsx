import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBriefcase,
  FaUsers,
  FaPlusCircle,
  FaBuilding,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { clearAuth, getLoggedInUser } from "../../utils/api";
import "../../styles/Sidebar.css";

function EmployerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getLoggedInUser();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar sidebar--recruiter">
      <div>
        <h2 className="logo">
          <span className="logo-mark">
            <FaBriefcase />
          </span>
          JobPortal
        </h2>
        <p className="sidebar-role">Recruiter</p>
        {user?.companyName && <p className="sidebar-company">{user.companyName}</p>}
        <ul>
          <li
            className={isActive("/employer/dashboard") ? "active" : ""}
            onClick={() => navigate("/employer/dashboard")}
          >
            <FaHome /> Dashboard
          </li>
          <li
            className={isActive("/employer/my-jobs") ? "active" : ""}
            onClick={() => navigate("/employer/my-jobs")}
          >
            <FaBriefcase /> My Jobs
          </li>
          <li onClick={() => navigate("/employer/my-jobs")}>
            <FaUsers /> Applicants
          </li>
          <li
            className={isActive("/employer/post-job") ? "active" : ""}
            onClick={() => navigate("/employer/post-job")}
          >
            <FaPlusCircle /> Post a Job
          </li>
          <li className={isActive("/profile") ? "active" : ""} onClick={() => navigate("/profile")}>
            <FaBuilding /> Company Profile
          </li>
          <li>
            <FaChartBar /> Reports
          </li>
          <li className={isActive("/settings") ? "active" : ""} onClick={() => navigate("/settings")}>
            <FaCog /> Settings
          </li>
        </ul>
      </div>
      <button
        className="logout"
        onClick={() => {
          clearAuth();
          navigate("/login");
        }}
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}

export default EmployerSidebar;
