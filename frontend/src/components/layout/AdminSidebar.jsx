import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaBriefcase,
  FaClipboardList,
  FaChartBar,
  FaCog,
  FaServer,
  FaSignOutAlt,
} from "react-icons/fa";
import { logout } from "../../utils/api";
import "../../styles/Sidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar sidebar--admin">
      <div>
        <h2 className="logo">
          <span className="logo-mark">
            <FaBriefcase />
          </span>
          JobPortal
        </h2>
        <p className="sidebar-role">Admin</p>
        <ul>
          <li
            className={isActive("/admin/dashboard") ? "active" : ""}
            onClick={() => navigate("/admin/dashboard")}
          >
            <FaHome /> Dashboard
          </li>
          <li
            className={isActive("/admin/users") ? "active" : ""}
            onClick={() => navigate("/admin/users")}
          >
            <FaUsers /> Users
          </li>
          <li>
            <FaBuilding /> Companies
          </li>
          <li>
            <FaBriefcase /> Jobs
          </li>
          <li>
            <FaClipboardList /> Applications
          </li>
          <li
            className={isActive("/admin/reports") ? "active" : ""}
            onClick={() => navigate("/admin/reports")}
          >
            <FaChartBar /> Reports & Analytics
          </li>
          <li className={isActive("/settings") ? "active" : ""} onClick={() => navigate("/settings")}>
            <FaCog /> Settings
          </li>
          <li>
            <FaServer /> System Logs
          </li>
        </ul>
      </div>
      <button
        className="logout"
        onClick={async () => {
          await logout();
          navigate("/login");
        }}
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}

export default AdminSidebar;
