import { useNavigate } from "react-router-dom";
import "../../styles/ProfileStrength.css";

function ProfileStrength() {
  const navigate = useNavigate();
  const strength = 75;

  return (
    <div className="profile-strength">
      <h2>Profile Strength</h2>
      <h1>{strength}%</h1>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${strength}%` }} />
      </div>

      <p>
        Complete your profile to increase visibility and get better job
        recommendations.
      </p>

      <button onClick={() => navigate("/complete-profile")}>
        Complete Profile
      </button>
    </div>
  );
}

export default ProfileStrength;
