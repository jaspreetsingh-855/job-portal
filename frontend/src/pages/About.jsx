import { Link } from "react-router-dom";
import {
  FaSearch,
  FaBuilding,
  FaShieldAlt,
  FaBriefcase,
  FaUserCheck,
  FaLock,
} from "react-icons/fa";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../styles/Landing.css";
import "../styles/About.css";

function About() {
  return (
    <div className="landing-page">
      <Navbar />

      <section className="about-hero">
        <p className="about-hero__brand">JobPortal</p>
        <h1>About our platform</h1>
        <p className="about-hero__lead">
          JobPortal connects people looking for work with companies hiring
          talent — with clear roles for job seekers, recruiters, and admins.
        </p>
        <div className="about-hero__actions">
          <Link to="/signup" className="landing-btn landing-btn--primary">
            Create account
          </Link>
          <Link to="/login" className="landing-btn landing-btn--ghost">
            Sign in
          </Link>
        </div>
      </section>

      <section className="about-section">
        <div className="about-section__inner">
          <h2>Our mission</h2>
          <p>
            Make career moves and hiring simpler. Whether you are applying for
            your next role or posting openings for your company, JobPortal gives
            you a focused workspace after you sign up.
          </p>
        </div>
      </section>

      <section className="about-section about-section--muted">
        <div className="about-section__inner">
          <h2>Built for three roles</h2>
          <p className="about-section__sub">
            Choose your path at signup — the same role-based experience used
            across login and dashboards.
          </p>

          <div className="about-roles">
            <article className="about-role about-role--seeker">
              <span className="about-role__icon">
                <FaSearch />
              </span>
              <h3>Job Seeker</h3>
              <p>
                Browse jobs, save openings, apply, track applications, and
                strengthen your profile from a blue-themed dashboard.
              </p>
            </article>

            <article className="about-role about-role--recruiter">
              <span className="about-role__icon">
                <FaBuilding />
              </span>
              <h3>Recruiter</h3>
              <p>
                HR and managers post jobs, manage listings, and hire for their
                company from a dedicated recruiter workspace.
              </p>
            </article>

            <article className="about-role about-role--admin">
              <span className="about-role__icon">
                <FaShieldAlt />
              </span>
              <h3>Admin</h3>
              <p>
                Platform admins oversee users, jobs, and activity with tools to
                keep JobPortal running smoothly.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-section__inner">
          <h2>What you can do</h2>
          <ul className="about-points">
            <li>
              <FaBriefcase />
              <div>
                <strong>Discover real opportunities</strong>
                <span>
                  Explore remote and employer-posted jobs in one place.
                </span>
              </div>
            </li>
            <li>
              <FaUserCheck />
              <div>
                <strong>Secure accounts</strong>
                <span>
                  Sign up with strong passwords and JWT-protected access for each
                  role.
                </span>
              </div>
            </li>
            <li>
              <FaLock />
              <div>
                <strong>Role-based access</strong>
                <span>
                  Seekers apply and save; recruiters post; admins manage — each
                  with the right permissions.
                </span>
              </div>
            </li>
          </ul>

          <div className="about-cta">
            <h2>Ready to get started?</h2>
            <p>Create a JobPortal account and choose your role in minutes.</p>
            <Link to="/signup" className="landing-btn landing-btn--primary">
              Join JobPortal
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;
