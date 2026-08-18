import { Link } from "react-router-dom";
import { FaBriefcase } from "react-icons/fa";
import "../../styles/Landing.css";

function Navbar() {
  return (
    <nav className="landing-nav">
      <Link to="/" className="landing-brand">
        <span className="landing-brand__icon">
          <FaBriefcase />
        </span>
        JobPortal
      </Link>

      <ul className="landing-nav__links">
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/login" className="landing-nav__ghost">
            Sign in
          </Link>
        </li>
        <li>
          <Link to="/signup" className="landing-nav__cta">
            Create account
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
