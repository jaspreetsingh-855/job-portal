import { Link } from "react-router-dom";
import "../../styles/Landing.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div>
        <h2 className="logo">Job Portal</h2>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
