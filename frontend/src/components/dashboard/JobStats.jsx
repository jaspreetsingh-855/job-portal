import "../../styles/JobStats.css";

const stats = [
  { label: "Applications", className: "applications", value: "70%" },
  { label: "Profile Views", className: "views", value: "55%" },
  { label: "Resume Downloads", className: "resume", value: "85%" },
  { label: "Interview Rate", className: "interview", value: "40%" },
];

function JobStats() {
  return (
    <div className="job-stats">
      <h2>Job Stats</h2>

      {stats.map((stat) => (
        <div key={stat.label} className="stat-item">
          <div className="stat-text">
            <span>{stat.label}</span>
            <span>{stat.value}</span>
          </div>
          <div className="progress-bar">
            <div className={`progress ${stat.className}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobStats;
