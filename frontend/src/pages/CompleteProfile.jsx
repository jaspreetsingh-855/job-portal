import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import { api, getLoggedInUser, updateStoredUser } from "../utils/api";
import "../styles/Dashboard.css";
import "../styles/Profile.css";

function CompleteProfile() {
  const navigate = useNavigate();
  const existing = getLoggedInUser() || {};
  const [form, setForm] = useState({
    name: existing.name || "",
    email: existing.email || "",
    phone: existing.phone || "",
    location: existing.location || "",
    experience: existing.experience || "",
    bio: existing.bio || "",
    skills: (existing.skills || []).join(", "),
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api("/auth/me")
      .then((data) => {
        const u = data.user || {};
        setForm({
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          location: u.location || "",
          experience: u.experience || "",
          bio: u.bio || "",
          skills: (u.skills || []).join(", "),
        });
        updateStoredUser(u);
      })
      .catch(() => {});
  }, []);

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          location: form.location,
          experience: form.experience,
          bio: form.bio,
          skills: form.skills,
        }),
      });
      updateStoredUser(data.user);
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout dashboard-layout--seeker">
      <Sidebar />
      <div className="dashboard-content">
        <TopNavbar />
        <div className="complete-profile">
          <div className="profile-box">
            <h1>Complete Your Profile</h1>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Full Name" value={form.name} onChange={update("name")} required />
              <input type="email" placeholder="Email" value={form.email} disabled />
              <input type="text" placeholder="Phone Number" value={form.phone} onChange={update("phone")} />
              <input type="text" placeholder="Location" value={form.location} onChange={update("location")} />
              <select value={form.experience} onChange={update("experience")}>
                <option value="">Select Experience</option>
                <option>Fresher</option>
                <option>1-2 Years</option>
                <option>3-5 Years</option>
                <option>5+ Years</option>
              </select>
              <input
                type="text"
                placeholder="Skills (comma separated)"
                value={form.skills}
                onChange={update("skills")}
              />
              <textarea rows="4" placeholder="About yourself" value={form.bio} onChange={update("bio")} />
              {error && <p className="jobs-status">{error}</p>}
              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompleteProfile;
