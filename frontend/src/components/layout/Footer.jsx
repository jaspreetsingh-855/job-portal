import "../../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>Job Portal</h2>
          <p>
            Find your dream job with our easy-to-use platform connecting job
            seekers with top employers.
          </p>
          <div className="social-icons">
            <span>f</span>
            <span>in</span>
            <span>x</span>
          </div>
        </div>

        <div className="footer-section">
          <h3>For Job Seekers</h3>
          <ul>
            <li>Browse Jobs</li>
            <li>Career Advice</li>
            <li>Resume Tips</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>For Employers</h3>
          <ul>
            <li>Post a Job</li>
            <li>Pricing</li>
            <li>Recruitment Solutions</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: support@jobportal.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>
      </div>

      <hr />
      <p className="copyright">© 2026 Job Portal. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
