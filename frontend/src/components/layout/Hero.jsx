import { useNavigate } from "react-router-dom";
import { FaSearch, FaBuilding, FaChartLine, FaUser } from "react-icons/fa";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="landing-hero">
      <div className="landing-hero__inner">
        <p className="landing-hero__brand">JobPortal</p>
        <h1>Your next career move starts here</h1>
        <p className="landing-hero__lead">
          Join thousands of professionals — find roles or hire talent on one
          trusted platform.
        </p>

        <div className="landing-hero__actions">
          <button
            type="button"
            className="landing-btn landing-btn--primary"
            onClick={() => navigate("/signup")}
          >
            Get started
          </button>
          <button
            type="button"
            className="landing-btn landing-btn--ghost"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>
      </div>

      <div className="landing-hero__visual" aria-hidden="true">
        <div className="landing-desk">
          <div className="landing-desk__person" />
          <div className="landing-desk__laptop" />
          <div className="landing-desk__bubble">
            <FaUser />
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingFeatures() {
  return (
    <section className="landing-features">
      <div className="landing-features__inner">
        <h2>Built for every role</h2>
        <p className="landing-features__sub">
          The same experience you see on sign up — clear paths for seekers,
          recruiters, and admins.
        </p>

        <ul className="landing-benefits">
          <li>
            <span className="landing-benefits__icon">
              <FaSearch />
            </span>
            <div>
              <strong>Find the perfect job</strong>
              <span>Discover openings that match your skills and goals.</span>
            </div>
          </li>
          <li>
            <span className="landing-benefits__icon">
              <FaBuilding />
            </span>
            <div>
              <strong>Hire with confidence</strong>
              <span>Post roles and manage applicants as a recruiter.</span>
            </div>
          </li>
          <li>
            <span className="landing-benefits__icon">
              <FaChartLine />
            </span>
            <div>
              <strong>Grow your career</strong>
              <span>Track applications and strengthen your profile.</span>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Hero;
