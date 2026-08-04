import { useNavigate } from "react-router-dom";
import "../../styles/RecommendedJobs.css";

const jobs = [
  { id: 1, title: "Frontend Developer", company: "Google", location: "Remote", salary: "$80k" },
  { id: 2, title: "React Developer", company: "Microsoft", location: "Delhi", salary: "$70k" },
  { id: 3, title: "Full Stack Developer", company: "Amazon", location: "Bangalore", salary: "$90k" },
];

function RecommendedJobs() {
  const navigate = useNavigate();

  return (
    <div className="recommended">
      <div className="recommended-header">
        <h2>Recommended Jobs</h2>
        <button onClick={() => navigate("/jobs")}>View All</button>
      </div>

      {jobs.map((job) => (
        <div key={job.id} className="recommended-card">
          <div>
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <span>{job.location}</span>
          </div>
          <div className="job-right">
            <h4>{job.salary}</h4>
            <button onClick={() => navigate("/jobs")}>Apply Now</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecommendedJobs;
