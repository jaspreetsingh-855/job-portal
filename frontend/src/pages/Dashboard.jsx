import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import StatsCards from "../components/dashboard/StatsCards";
import RecentApplications from "../components/dashboard/RecentApplications";
import ProfileStrength from "../components/dashboard/ProfileStrength";
import RecommendedJobs from "../components/dashboard/RecommendedJobs";
import JobStats from "../components/dashboard/JobStats";
import "../styles/Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <TopNavbar />
        <StatsCards />

        <div className="dashboard-middle">
          <RecentApplications />
          <ProfileStrength />
        </div>

        <div className="dashboard-bottom">
          <RecommendedJobs />
          <JobStats />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
