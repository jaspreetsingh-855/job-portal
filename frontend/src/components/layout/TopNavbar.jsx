import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import SearchBar from "../jobs/SearchBar";
import "../../styles/TopNavbar.css";
import { FaBell, FaEnvelope } from "react-icons/fa";
import { getLoggedInUser, ROLES } from "../../utils/api";

function TopNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = getLoggedInUser();
  const roleLabel =
    user?.role === ROLES.EMPLOYER
      ? "Recruiter"
      : user?.role === ROLES.ADMIN
        ? "Admin"
        : "Job Seeker";

  const initialFilters = {
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "All",
    jobType: searchParams.get("jobType") || "All",
  };

  const handleSearch = (filters) => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.location !== "All") params.set("location", filters.location);
    if (filters.jobType !== "All") params.set("jobType", filters.jobType);

    if (location.pathname === "/jobs") {
      setSearchParams(params);
    } else {
      navigate(`/jobs?${params.toString()}`);
    }
  };

  return (
    <div className="top-navbar">
      <SearchBar
        key={`${initialFilters.search}-${initialFilters.location}-${initialFilters.jobType}`}
        onSearch={handleSearch}
        initialFilters={initialFilters}
      />

      <div className="top-right">
        <FaBell className="icon" />
        <FaEnvelope className="icon" />

        <div className="profile">
          <div className="avatar">{user?.name?.charAt(0).toUpperCase() || "U"}</div>
          <div>
            <h4>{user?.name || "User"}</h4>
            <p>{roleLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopNavbar;
