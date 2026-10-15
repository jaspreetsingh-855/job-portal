import { FaBriefcase, FaClipboardList, FaHeart, FaUserTie } from "react-icons/fa";
import "../../styles/StatsCards.css";

function StatsCards() {
  const stats = [
    { icon: <FaBriefcase />, className: "jobs", count: 120, label: "Available Jobs" },
    { icon: <FaClipboardList />, className: "applied", count: 8, label: "Applied Jobs" },
    { icon: <FaHeart />, className: "saved", count: 5, label: "Saved Jobs" },
    { icon: <FaUserTie />, className: "interviews", count: 2, label: "Interviews" },
  ];

  return (
    <div className="stats-cards">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card">
          <div className={`icon ${stat.className}`}>{stat.icon}</div>
          <h2>{stat.count}</h2>
          <p>{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
