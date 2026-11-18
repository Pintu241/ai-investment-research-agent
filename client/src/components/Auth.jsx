import { useState } from "react";
import { loginUser, signupUser } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
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
  BarChart3,
  Building2,
  DollarSign,
  ChevronRight,
  Activity,
  Zap,
  Sparkles
} from "lucide-react";

const TICKER_DATA = [
  { symbol: "S&P 500", price: "5,892.40", change: "+0.82%", up: true },
  { symbol: "NASDAQ", price: "18,945.20", change: "+1.41%", up: true },
  { symbol: "DOW JONES", price: "43,870.10", change: "+0.45%", up: true },
  { symbol: "NVIDIA (NVDA)", price: "$141.50", change: "+3.24%", up: true },
  { symbol: "APPLE (AAPL)", price: "$232.80", change: "+1.12%", up: true },
  { symbol: "GOLD", price: "$2,694.10", change: "+0.62%", up: true },
  { symbol: "BRENT CRUDE", price: "$74.20", change: "-0.38%", up: false },
  { symbol: "US 10Y", price: "4.38%", change: "-0.04%", up: false },
  { symbol: "EUR/USD", price: "1.0542", change: "+0.15%", up: true },
  { symbol: "FTSE 100", price: "8,420.15", change: "+0.35%", up: true }
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
    <div className="premium-auth-viewport">
      {/* Dynamic Animated Ambient Gradients */}
      <motion.div 
        className="ambient-orb orb-primary"
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.08, 0.95, 1]
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="ambient-orb orb-secondary"
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -20, 0],
          scale: [1, 0.92, 1.1, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <div className="ambient-grid-overlay" />

      {/* TOP LIVE FINANCIAL TICKER */}
      <div className="premium-ticker-ribbon">
        <div className="ticker-label-chip">
          <span className="live-pulsar" />
          <span>GLOBAL MARKETS</span>
        </div>
        <div className="ticker-infinite-track">
          {[...TICKER_DATA, ...TICKER_DATA].map((t, idx) => (
            <div key={idx} className="ticker-capsule">
              <span className="capsule-sym">{t.symbol}</span>
              <span className="capsule-val">{t.price}</span>
              <span className={`capsule-delta ${t.up ? "bull" : "bear"}`}>
                {t.change} {t.up ? "▲" : "▼"}
              </span>
              <span className="capsule-sep">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* EXPANSIVE 2-COLUMN LUXURY STAGE */}
      <div className="premium-auth-stage">
        {/* LEFT COLUMN: INTERACTIVE INSTITUTIONAL SHOWCASE */}
        <motion.div 
          className="stage-left-showcase"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="showcase-brand-lockup">
            <div className="brand-crest-emblem">
              <TrendingUp size={24} strokeWidth={2.5} />
            </div>
            <div>
              <div className="brand-firm-title">APEX RESEARCH</div>
              <div className="brand-firm-division">INSTITUTIONAL EQUITY INTELLIGENCE</div>
            </div>
          </div>

          <div className="showcase-hero-copy">
            <h2>Next-Generation Equity Research & Valuation</h2>
            <p>
              Autonomous fundamental coverage, moat durability analytics, and institutional consensus ratings compiled across 1,800+ global assets.
            </p>
          </div>

          {/* FLOATING INTERACTIVE CARDS */}
          <div className="floating-cards-stack">
            {/* Asset Focus Card */}
            <motion.div 
              className="glass-preview-card"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="card-top-row">
                <div className="ticker-avatar">NVDA</div>
                <div>
                  <strong>NVIDIA Corporation</strong>
                  <span>NASDAQ: NVDA • Semiconductor & AI</span>
                </div>
                <div className="rating-pill-outperform">OUTPERFORM</div>
              </div>
              <div className="card-metrics-row">
                <div>
                  <small>ANALYST TARGET</small>
                  <strong>$168.00</strong>
                </div>
                <div>
                  <small>CONVICTION</small>
                  <strong className="text-emerald">94%</strong>
                </div>
                <div>
                  <small>MOAT INDEX</small>
                  <strong>92 / 100</strong>
                </div>
              </div>
              {/* Mini SVG Sparkline */}
              <div className="sparkline-wrapper">
                <svg viewBox="0 0 280 40" className="sparkline-svg">
                  <path
                    d="M 0 35 Q 40 25, 70 28 T 140 18 T 210 12 T 280 5"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M 0 35 Q 40 25, 70 28 T 140 18 T 210 12 T 280 5 L 280 40 L 0 40 Z"
                    fill="url(#sparkline-grad)"
                    opacity="0.2"
                  />
                  <defs>
                    <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </motion.div>

            {/* Quick Stats Pill */}
            <motion.div 
              className="glass-preview-pill"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="pill-icon-box">
                <Activity size={16} color="#3b82f6" />
              </div>
              <div>
                <strong>$48.6B Coverage Monitored</strong>
                <span>Continuous 10-K & earnings sentiment tracking</span>
              </div>
            </motion.div>
          </div>

          <div className="showcase-footer-proof">
            <div className="proof-tag">
              <Shield size={14} color="#10b981" />
              <span>Enterprise Grade 256-Bit Financial Encryption</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: THE ULTRA-SLEEK TERMINAL CARD */}
        <motion.div 
          className="stage-right-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
        >
          <div className="terminal-card-glass">
            {/* Header */}
            <div className="terminal-card-header">
              <div className="mobile-brand-crest">
                <TrendingUp size={20} strokeWidth={2.5} />
              </div>
              <h2>{isLogin ? "Terminal Sign In" : "Register Analyst Profile"}</h2>
              <p>
                {isLogin
                  ? "Access your firm's private research models and coverage watchlists."
                  : "Begin evaluating company valuations with institutional consensus."}
              </p>
            </div>

            {/* FRAMER MOTION SLIDING PILL SWITCHER */}
            <div className="framer-segmented-track">
              <button
                type="button"
                className={`framer-tab-btn ${isLogin ? "selected" : ""}`}
                onClick={() => handleTabChange(true)}
              >
                {isLogin && (
                  <motion.div
                    className="framer-active-pill"
                    layoutId="activeTabPill"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="tab-btn-text">Sign In</span>
              </button>

              <button
                type="button"
                className={`framer-tab-btn ${!isLogin ? "selected" : ""}`}
                onClick={() => handleTabChange(false)}
              >
                {!isLogin && (
                  <motion.div
                    className="framer-active-pill"
                    layoutId="activeTabPill"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="tab-btn-text">Create Account</span>
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="terminal-form">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    className="form-alert-banner"
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dynamic Name Input for Signup */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div 
                    className="form-input-block"
                    initial={{ opacity: 0, height: 0, y: -12 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label>FULL LEGAL NAME</label>
                    <div className="input-glass-wrap">
                      <User size={16} className="input-lead-icon" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Jordan Belfort"
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="form-input-block">
                <label>INSTITUTIONAL EMAIL</label>
                <div className="input-glass-wrap">
                  <Mail size={16} className="input-lead-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@firm.com"
                    required
                  />
                </div>
              </div>

              <div className="form-input-block">
                <div className="input-label-row">
                  <label>PASSWORD</label>
                  {isLogin && (
                    <span className="forgot-text-link">Forgot password?</span>
                  )}
                </div>
                <div className="input-glass-wrap">
                  <Lock size={16} className="input-lead-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="eye-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password for Signup */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div 
                    className="form-input-block"
                    initial={{ opacity: 0, height: 0, y: -12 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label>CONFIRM PASSWORD</label>
                    <div className="input-glass-wrap">
                      <Lock size={16} className="input-lead-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isLogin && (
                <div className="remember-row">
                  <label className="checkbox-custom-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember terminal authentication</span>
                  </label>
                </div>
              )}

              {/* ACTION SUBMIT BUTTON WITH FRAMER MOTION PHYSICS */}
              <motion.button 
                type="submit" 
                className="framer-action-btn" 
                disabled={loading}
                whileHover={{ scale: 1.015, boxShadow: "0 8px 30px rgba(37, 99, 235, 0.45)" }}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.15 }}
              >
                {loading ? (
                  <div className="action-spinner" />
                ) : (
                  <>
                    <span>{isLogin ? "Sign In to Terminal" : "Complete Registration"}</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Bottom Compliance row */}
            <div className="terminal-card-footer">
              <div className="trust-pill">
                <CheckCircle2 size={13} color="#10b981" />
                <span>FINRA Standard Format</span>
              </div>
              <span className="trust-dot">•</span>
              <div className="trust-pill">
                <Shield size={13} color="#3b82f6" />
                <span>SOC2 Certified</span>
              </div>
              <span className="trust-dot">•</span>
              <div className="trust-pill">
                <Award size={13} color="#94a3b8" />
                <span>256-Bit TLS</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Auth;
