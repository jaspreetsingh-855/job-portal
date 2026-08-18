import { Link } from "react-router-dom";
import { FaBriefcase } from "react-icons/fa";
import "../../styles/Footer.css";

function Footer() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer__inner">
        <div className="landing-footer__brand">
          <div className="landing-brand">
            <span className="landing-brand__icon">
              <FaBriefcase />
            </span>
            JobPortal
          </div>
          <p>
            Create your account and take the next step — whether you are looking
            for a job or hiring for your company.
          </p>
        </div>

        <div className="landing-footer__col">
          <h3>For Job Seekers</h3>
          <ul>
            <li>
              <Link to="/signup">Create account</Link>
            </li>
            <li>
              <Link to="/login">Sign in</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>

        <div className="landing-footer__col">
          <h3>For Recruiters</h3>
          <ul>
            <li>
              <Link to="/signup">Hire talent</Link>
            </li>
            <li>
              <Link to="/login">Recruiter login</Link>
            </li>
          </ul>
        </div>

        <div className="landing-footer__col">
          <h3>Contact</h3>
          <p>support@jobportal.com</p>
          <p>+91 98765 43210</p>
        </div>
      </div>

      <p className="landing-footer__copy">
        © 2026 JobPortal. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
