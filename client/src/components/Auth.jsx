import { useState } from "react";
import { loginUser, signupUser } from "../services/api";
import { 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  BarChart3,
  Briefcase,
  FileText
} from "lucide-react";

function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please provide both email and password.");
      return;
    }

    if (!isLogin) {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
    }

    try {
      setLoading(true);
      let response;
      if (isLogin) {
        response = await loginUser({ email, password });
      } else {
        response = await signupUser({ name, email, password });
      }

      if (response && response.success) {
        localStorage.setItem("token", response.data.token);
        onAuthSuccess(response.data);
      } else {
        setError(response.message || "Authentication failed");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Authentication failed. Please verify your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (loginTab) => {
    setIsLogin(loginTab);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="portal-auth-wrapper">
      <div className="portal-auth-container">
        {/* Left Side: Institutional Overview */}
        <div className="portal-showcase-pane">
          <div className="portal-header-brand">
            <div className="portal-logo-square">
              <TrendingUp size={22} strokeWidth={2.5} />
            </div>
            <div>
              <div className="portal-brand-title">APEX RESEARCH</div>
              <div className="portal-brand-tag">GLOBAL EQUITY INTELLIGENCE</div>
            </div>
          </div>

          <div className="portal-showcase-body">
            <h1 className="portal-headline">
              Institutional Equity Research & Company Valuation
            </h1>
            <p className="portal-description">
              Access comprehensive fundamental research, competitive moat analysis, balance sheet ratios, and structured investment recommendations across global equities.
            </p>

            <div className="portal-feature-list">
              <div className="portal-feature-item">
                <div className="portal-feature-icon">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <strong>Fundamental & Financial Statement Analysis</strong>
                  <p>In-depth evaluation of earnings quality, margin trajectory, and solvency ratios.</p>
                </div>
              </div>

              <div className="portal-feature-item">
                <div className="portal-feature-icon">
                  <Briefcase size={18} />
                </div>
                <div>
                  <strong>Disciplined Coverage Framework</strong>
                  <p>Systematic BUY, HOLD, and SELL ratings backed by qualitative thesis and conviction scoring.</p>
                </div>
              </div>

              <div className="portal-feature-item">
                <div className="portal-feature-icon">
                  <FileText size={18} />
                </div>
                <div>
                  <strong>Proprietary Research Archive</strong>
                  <p>Maintain your custom watchlists, export publication-ready reports, and track coverage changes.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="portal-showcase-footer">
            <div className="portal-compliance-tag">
              <ShieldCheck size={14} />
              <span>Standard Institutional Compliance & Privacy</span>
            </div>
          </div>
        </div>

        {/* Right Side: Account Form */}
        <div className="portal-form-pane">
          <div className="portal-form-header">
            <h2>{isLogin ? "Analyst Portal Sign In" : "Register Analyst Account"}</h2>
            <p>
              {isLogin 
                ? "Enter your credentials to access company coverage and research reports." 
                : "Create an analyst profile to begin reviewing company fundamentals."}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="portal-tabs">
            <button
              type="button"
              className={`portal-tab-btn ${isLogin ? "active" : ""}`}
              onClick={() => handleTabChange(true)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`portal-tab-btn ${!isLogin ? "active" : ""}`}
              onClick={() => handleTabChange(false)}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="portal-form">
            {error && (
              <div className="portal-error-banner">
                <span>{error}</span>
              </div>
            )}

            {!isLogin && (
              <div className="portal-field">
                <label>Full Name</label>
                <div className="portal-input-wrap">
                  <User size={18} className="portal-field-icon" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Michael Chen"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="portal-field">
              <label>Work Email</label>
              <div className="portal-input-wrap">
                <Mail size={18} className="portal-field-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@firm.com"
                  required
                />
              </div>
            </div>

            <div className="portal-field">
              <label>Password</label>
              <div className="portal-input-wrap">
                <Lock size={18} className="portal-field-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="portal-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="portal-field">
                <label>Confirm Password</label>
                <div className="portal-input-wrap">
                  <Lock size={18} className="portal-field-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <button type="submit" className="portal-submit-btn" disabled={loading}>
              {loading ? (
                <div className="portal-spinner" />
              ) : (
                <>
                  <span>{isLogin ? "Sign In to Research Platform" : "Complete Registration"}</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="portal-footer-note">
            <CheckCircle2 size={13} color="#059669" />
            <span>Encrypted Session • SEC & FINRA Formatted Research</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
