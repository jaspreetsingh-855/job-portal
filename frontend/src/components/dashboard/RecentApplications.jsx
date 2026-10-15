import { useNavigate } from "react-router-dom";
import "../../styles/RecentApplications.css";

const applications = [
  { id: 1, title: "React Developer", company: "Google", date: "Mar 10", status: "Applied" },
  { id: 2, title: "UI Designer", company: "Microsoft", date: "Mar 8", status: "Interview" },
  { id: 3, title: "Node Developer", company: "Amazon", date: "Mar 5", status: "Rejected" },
];

function RecentApplications() {
  const navigate = useNavigate();

  return (
    <div className="applications-card">
      <div className="card-header">
        <h2>Recent Applications</h2>
        <button onClick={() => navigate("/applied-jobs")}>View All</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Company</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>{app.title}</td>
              <td>{app.company}</td>
              <td>{app.date}</td>
              <td>
                <span className={`status ${app.status.toLowerCase()}`}>
                  {app.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentApplications;
