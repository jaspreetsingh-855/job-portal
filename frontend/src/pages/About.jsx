import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../styles/Landing.css";
import "../styles/About.css";

function About() {
  return (
    <div className="public-page">
      <Navbar />
      <section className="about">
        <div className="about-container">
          <h2>About Job Portal</h2>
          <p className="about-text">
            Job Portal helps job seekers discover opportunities and connect with
            top employers. Our mission is to make job hunting simple, fast, and
            effective for everyone.
          </p>

          <div className="about-cards">
            <div className="about-card">
              <h3>For Job Seekers</h3>
              <p>
                Search jobs by preference, location, and job type. Track
                applications and build your profile.
              </p>
            </div>
            <div className="about-card">
              <h3>For Employers</h3>
              <p>
                Post jobs and reach qualified candidates quickly with our
                easy-to-use platform.
              </p>
            </div>
            <div className="about-card">
              <h3>Smart Matching</h3>
              <p>
                Get personalized job recommendations based on your skills and
                preferences.
              </p>
            </div>
          </div>

          <div className="about-stats">
            <div className="stat-box">
              <h2>10K+</h2>
              <p>Jobs Listed</p>
            </div>
            <div className="stat-box">
              <h2>5K+</h2>
              <p>Companies</p>
            </div>
            <div className="stat-box">
              <h2>50K+</h2>
              <p>Job Seekers</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default About;
