import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import "../styles/Dashboard.css";
import "../styles/Profile.css";

function CompleteProfile() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/profile");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <TopNavbar />
        <div className="complete-profile">
          <div className="profile-box">
            <h1>Complete Your Profile</h1>

            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Full Name" required />
              <input type="email" placeholder="Email" required />
              <input type="text" placeholder="Phone Number" />
              <input type="text" placeholder="Location" />
              <select defaultValue="">
                <option value="" disabled>
                  Select Experience
                </option>
                <option>Fresher</option>
                <option>1-2 Years</option>
                <option>3-5 Years</option>
                <option>5+ Years</option>
              </select>
              <textarea rows="4" placeholder="About yourself" />
              <button type="submit">Save Profile</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompleteProfile;
