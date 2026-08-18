import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaSearch,
  FaBuilding,
  FaChartLine,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaCheck,
} from "react-icons/fa";
import { api, setAuth, ROLES, homePathForRole } from "../utils/api";
import "../styles/Signup.css";

const ROLES_UI = [
  {
    id: ROLES.JOBSEEKER,
    title: "Job Seeker",
    desc: "Looking for job opportunities and career growth.",
    Icon: FaUser,
    tone: "seeker",
  },
  {
    id: ROLES.EMPLOYER,
    title: "Recruiter",
    desc: "Hiring talent for my organization.",
    Icon: FaBuilding,
    tone: "recruiter",
  },
  {
    id: ROLES.ADMIN,
    title: "Admin",
    desc: "Managing the platform and users.",
    Icon: FaShieldAlt,
    tone: "admin",
  },
];

function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState(ROLES.JOBSEEKER);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRules = {
    length: password.length >= 8,
    number: /\d/.test(password),
    special: /[@#$%^&*!?\-_+=.,;:'"<>()[\]{}|\\/~`]/.test(password),
  };
  const isPasswordStrong =
    passwordRules.length && passwordRules.number && passwordRules.special;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isPasswordStrong) {
      setError(
        "Password must be at least 8 characters and include a number and a special character (@, #, etc.)."
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agree) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);
    try {
      const data = await api("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          role,
          companyName: role === ROLES.EMPLOYER ? companyName : "",
        }),
      });
      setAuth(data.token, data.user);
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
          <h1>Join thousands of professionals</h1>
          <p className="signup-aside__lead">
            Create your account and take the next step in your career journey.
          </p>

          <ul className="signup-benefits">
            <li>
              <span className="signup-benefits__icon">
                <FaSearch />
              </span>
              <div>
                <strong>Find the perfect job</strong>
                <span>Discover jobs that match your skills and interests.</span>
              </div>
            </li>
            <li>
              <span className="signup-benefits__icon">
                <FaBuilding />
              </span>
              <div>
                <strong>Connect with top companies</strong>
                <span>Get noticed by leading employers actively hiring.</span>
              </div>
            </li>
            <li>
              <span className="signup-benefits__icon">
                <FaChartLine />
              </span>
              <div>
                <strong>Grow your career</strong>
                <span>Access resources and opportunities to advance your career.</span>
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
          Already have an account? <Link to="/login">Sign in</Link>
        </div>

        <div className="signup-panel">
          <h2>Create your account</h2>
          <p className="signup-panel__sub">Choose your role and fill in your details</p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <p className="signup-label">Choose your role</p>
            <div className="signup-roles" role="radiogroup" aria-label="Account role">
              {ROLES_UI.map(({ id, title, desc, Icon, tone }) => (
                <button
                  key={id}
                  type="button"
                  className={`signup-role signup-role--${tone} ${role === id ? "active" : ""}`}
                  onClick={() => setRole(id)}
                  aria-pressed={role === id}
                >
                  <span className="signup-role__check" aria-hidden="true">
                    {role === id ? <FaCheck /> : null}
                  </span>
                  <span className="signup-role__icon">
                    <Icon />
                  </span>
                  <span className="signup-role__text">
                    <strong>{title}</strong>
                    <span>{desc}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="signup-grid">
              <label className="signup-field">
                <span>Full Name</span>
                <div className="signup-input">
                  <FaUser />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </label>

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
                  />
                </div>
              </label>

              <label className="signup-field">
                <span>
                  Password <abbr className="signup-required" title="required">*</abbr>
                </span>
                <div className="signup-input">
                  <FaLock />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
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
                <ul className="password-rules" aria-live="polite">
                  <li className={passwordRules.length ? "met" : ""}>
                    At least 8 characters
                  </li>
                  <li className={passwordRules.number ? "met" : ""}>
                    Includes a number
                  </li>
                  <li className={passwordRules.special ? "met" : ""}>
                    Includes a special character (@, #, etc.)
                  </li>
                </ul>
              </label>

              <label className="signup-field">
                <span>
                  Confirm Password{" "}
                  <abbr className="signup-required" title="required">*</abbr>
                </span>
                <div className="signup-input">
                  <FaLock />
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    className="signup-eye"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>
            </div>

            {role === ROLES.EMPLOYER && (
              <label className="signup-field">
                <span>Company Name</span>
                <div className="signup-input">
                  <FaBuilding />
                  <input
                    type="text"
                    placeholder="Enter your company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
              </label>
            )}

            <label className="signup-field">
              <span>
                Phone Number <em>(Optional)</em>
              </span>
              <div className="signup-input">
                <FaPhone />
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </label>

            <label className="signup-agree">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>
                I agree to the <a href="#terms">Terms of Service</a> and{" "}
                <a href="#privacy">Privacy Policy</a>
              </span>
            </label>

            {error && <p className="signup-error">{error}</p>}

            <button type="submit" className="signup-submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="signup-divider">
            <span>or sign up with</span>
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
            By creating an account, you agree to our{" "}
            <a href="#terms">Terms of Service</a> and{" "}
            <a href="#privacy">Privacy Policy</a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Signup;
