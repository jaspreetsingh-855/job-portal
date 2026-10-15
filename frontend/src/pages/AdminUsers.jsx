import { useEffect, useState } from "react";
import AdminSidebar from "../components/layout/AdminSidebar";
import { api } from "../utils/api";
import "../styles/Dashboard.css";
import "../styles/Jobs.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/admin/users")
      .then((data) => setUsers(data.users || []))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="dashboard-layout dashboard-layout--admin">
      <AdminSidebar />
      <div className="dashboard-content">
        <div className="jobs-container">
          <h1>Users</h1>
          {error && <p className="jobs-status">{error}</p>}
          <div className="jobs-list">
            {users.map((user) => (
              <div key={user.id} className="job-card">
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <p>Role: {user.role}</p>
                {user.companyName && <p>Company: {user.companyName}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
