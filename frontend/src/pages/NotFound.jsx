import { Link } from "react-router-dom";
import "../styles/Landing.css";

function NotFound() {
  return (
    <div className="landing-page" style={{ padding: 48, textAlign: "center" }}>
      <h1>Page not found</h1>
      <p>This page does not exist.</p>
      <Link to="/">Go to home</Link>
    </div>
  );
}

export default NotFound;
