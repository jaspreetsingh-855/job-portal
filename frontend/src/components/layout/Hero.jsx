import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <h1>Find Your Dream Job</h1>
      <p>Explore thousands of job opportunities from top companies</p>

      <div className="hero-buttons">
        <button className="primary-btn" onClick={() => navigate("/login")}>
          Find Jobs
        </button>
        <button className="secondary-btn" onClick={() => navigate("/about")}>
          Learn More
        </button>
      </div>
    </section>
  );
}

export default Hero;
