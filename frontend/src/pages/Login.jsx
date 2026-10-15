import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaSearch,
  FaBuilding,
  FaChartLine,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
} from "react-icons/fa";
import { api, setAuth, homePathForRole } from "../utils/api";
import "../styles/Signup.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAuth(data.user);
      navigate(data.redirectTo || homePathForRole(data.user.role));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <aside className="signup-aside">
        <div className="signup-brand">
          <span className="signup-brand__icon">
            <FaBriefcase />
          </span>
          <span>JobPortal</span>
        </div>

        <div className="signup-aside__content">
          <h1>Welcome back</h1>
          <p className="signup-aside__lead">
            Sign in to continue your career journey — whether you&apos;re hiring
            or looking for your next role.
          </p>

          <ul className="signup-benefits">
            <li>
              <span className="signup-benefits__icon">
                <FaSearch />
              </span>
              <div>
                <strong>Pick up where you left off</strong>
                <span>Access saved jobs, applications, and your dashboard.</span>
              </div>
            </li>
            <li>
              <span className="signup-benefits__icon">
                <FaBuilding />
              </span>
              <div>
                <strong>Recruiter tools ready</strong>
                <span>Manage openings and hire talent for your company.</span>
              </div>
            </li>
            <li>
              <span className="signup-benefits__icon">
                <FaChartLine />
              </span>
              <div>
                <strong>Stay on track</strong>
                <span>Your role-based workspace loads automatically after login.</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="signup-aside__art" aria-hidden="true">
          <div className="signup-desk">
            <div className="signup-desk__person" />
            <div className="signup-desk__laptop" />
            <div className="signup-desk__bubble">
              <FaUser />
            </div>
          </div>
        </div>
      </aside>

      <main className="signup-main">
        <div className="signup-main__top">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </div>

        <div className="signup-panel signup-panel--login">
          <h2>Sign in to your account</h2>
          <p className="signup-panel__sub">
            Enter your email and password to continue
          </p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <label className="signup-field">
              <span>Email Address</span>
              <div className="signup-input">
                <FaEnvelope />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </label>

            <label className="signup-field">
              <span>Password</span>
              <div className="signup-input">
                <FaLock />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="signup-eye"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </label>

            {error && <p className="signup-error">{error}</p>}

            <button type="submit" className="signup-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="signup-divider">
            <span>or continue with</span>
          </div>

          <div className="signup-social">
            <button type="button" disabled title="Coming soon">
              Google
            </button>
            <button type="button" disabled title="Coming soon">
              LinkedIn
            </button>
            <button type="button" disabled title="Coming soon">
              GitHub
            </button>
          </div>

          <p className="signup-footnote">
            New here? <Link to="/signup">Create an account</Link> as a Job
            Seeker, Recruiter, or Admin.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
