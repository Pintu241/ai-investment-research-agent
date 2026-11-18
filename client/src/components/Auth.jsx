import { useState } from "react";
import { loginUser, signupUser } from "../services/api";
import { 
  TrendingUp, 
  TrendingDown,
  Shield, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Globe,
  Award,
  Building2,
  Check
} from "lucide-react";

const TICKER_DATA = [
  { symbol: "S&P 500", price: "5,892.40", change: "+0.82%", up: true },
  { symbol: "NASDAQ", price: "18,945.20", change: "+1.41%", up: true },
  { symbol: "DOW JONES", price: "43,870.10", change: "+0.45%", up: true },
  { symbol: "GOLD", price: "$2,694.10", change: "+0.62%", up: true },
  { symbol: "BRENT CRUDE", price: "$74.20", change: "-0.38%", up: false },
  { symbol: "US 10Y", price: "4.38%", change: "-0.04%", up: false },
  { symbol: "EUR/USD", price: "1.0542", change: "+0.15%", up: true },
  { symbol: "FTSE 100", price: "8,420.15", change: "+0.35%", up: true },
  { symbol: "NIKKEI 225", price: "38,720.50", change: "+0.94%", up: true }
];

function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
        "Authentication failed. Please check your network connection."
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
    <div className="luxury-auth-page">
      {/* Ambient background light gradients */}
      <div className="luxury-ambient-mesh luxury-mesh-top" />
      <div className="luxury-ambient-mesh luxury-mesh-bottom" />
      <div className="luxury-noise-overlay" />

      {/* TOP LIVE FINANCIAL TICKER MARQUEE */}
      <div className="luxury-ticker-bar">
        <div className="ticker-badge-live">
          <span className="ticker-live-dot" />
          <span>MARKET TICKER</span>
        </div>
        <div className="ticker-track">
          {[...TICKER_DATA, ...TICKER_DATA].map((t, idx) => (
            <div key={idx} className="ticker-item">
              <span className="ticker-symbol">{t.symbol}</span>
              <span className="ticker-price">{t.price}</span>
              <span className={`ticker-change ${t.up ? "positive" : "negative"}`}>
                {t.change} {t.up ? "▲" : "▼"}
              </span>
              <span className="ticker-separator">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* CENTERPIECE LUXURY AUTHENTICATION CARD */}
      <div className="luxury-auth-wrapper">
        <div className="luxury-card-container">
          {/* Card Brand Header */}
          <div className="luxury-brand-block">
            <div className="luxury-brand-crest">
              <div className="crest-inner-icon">
                <TrendingUp size={22} strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="luxury-brand-title">A P E X</h1>
            <span className="luxury-brand-subtitle">GLOBAL EQUITY RESEARCH & ASSET VALUATION</span>
          </div>

          <div className="luxury-welcome-text">
            <h2>{isLogin ? "Analyst Portal Access" : "Create Institutional Account"}</h2>
            <p>
              {isLogin
                ? "Sign in to access your firm's private equity coverage, company valuation models, and ratings."
                : "Register your analyst profile to access institutional equity research and custom watchlists."}
            </p>
          </div>

          {/* Classy Switcher Pill */}
          <div className="luxury-segmented-control">
            <button
              type="button"
              className={`segmented-btn ${isLogin ? "active" : ""}`}
              onClick={() => handleTabChange(true)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`segmented-btn ${!isLogin ? "active" : ""}`}
              onClick={() => handleTabChange(false)}
            >
              Register Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="luxury-form">
            {error && (
              <div className="luxury-alert-box">
                <span>{error}</span>
              </div>
            )}

            {!isLogin && (
              <div className="luxury-input-group">
                <label className="luxury-label">FULL NAME</label>
                <div className="luxury-input-wrap">
                  <User size={17} className="luxury-field-icon" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alexander Vance"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="luxury-input-group">
              <label className="luxury-label">WORK EMAIL ADDRESS</label>
              <div className="luxury-input-wrap">
                <Mail size={17} className="luxury-field-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@firm.com"
                  required
                />
              </div>
            </div>

            <div className="luxury-input-group">
              <div className="luxury-label-split">
                <label className="luxury-label">SECURITY PASSWORD</label>
                {isLogin && (
                  <span className="luxury-forgot-link">Forgot password?</span>
                )}
              </div>
              <div className="luxury-input-wrap">
                <Lock size={17} className="luxury-field-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  className="luxury-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="luxury-input-group">
                <label className="luxury-label">CONFIRM SECURITY PASSWORD</label>
                <div className="luxury-input-wrap">
                  <Lock size={17} className="luxury-field-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="luxury-remember-row">
                <label className="luxury-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember this authorized terminal</span>
                </label>
              </div>
            )}

            <button type="submit" className="luxury-submit-btn" disabled={loading}>
              {loading ? (
                <div className="luxury-spinner" />
              ) : (
                <>
                  <span>{isLogin ? "Sign In to Terminal" : "Complete Registration"}</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Security & Credentials Proof */}
          <div className="luxury-footer-badges">
            <div className="badge-item">
              <Shield size={13} color="#10b981" />
              <span>256-Bit TLS Vault</span>
            </div>
            <span className="badge-dot">•</span>
            <div className="badge-item">
              <Award size={13} color="#3b82f6" />
              <span>SOC2 Type II</span>
            </div>
            <span className="badge-dot">•</span>
            <div className="badge-item">
              <Globe size={13} color="#94a3b8" />
              <span>FINRA Standard</span>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof Bar */}
        <div className="luxury-trust-bar">
          <p>
            Institutional intelligence platform tracking <strong>$48B+</strong> in asset coverage across 1,800+ global equities.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
