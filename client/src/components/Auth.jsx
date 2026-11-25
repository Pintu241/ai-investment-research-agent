import { useState } from "react";
import { loginUser, signupUser } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  AlertCircle
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
      setError("Please provide email and password.");
      return;
    }

    if (!isLogin) {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
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
        setError(typeof response.message === "string" ? response.message : "Authentication failed");
      }
    } catch (err) {
      console.error("Auth error:", err);
      const responseError = err.response?.data?.error;
      const errorMessage =
        err.response?.data?.message ||
        (typeof responseError === "string" ? responseError : responseError?.message);
      setError(
        typeof errorMessage === "string"
          ? errorMessage
          : "Something went wrong. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = (loginMode) => {
    setIsLogin(loginMode);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="dribbble-auth-canvas">
      <motion.div 
        className="dribbble-card-deck"
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
                <div className="dribbble-left-pane">
                    <div className="dribbble-brand-row">
            <div className="dribbble-brand-icon">
              <span>IR</span>
            </div>
            <div className="dribbble-brand-copy">
              <strong>Investment Research</strong>
              <span>Your Partner In Finance</span>
            </div>
          </div>

                    <div className="dribbble-illustration-wrapper">
            <svg
              viewBox="0 0 460 320"
              className="dribbble-finance-svg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
                            <circle cx="230" cy="160" r="130" fill="#38bdf8" fillOpacity="0.08" />

                            <circle cx="230" cy="155" r="88" fill="#e0f2fe" />
                            <path
                d="M 185 130 Q 200 115, 220 125 T 255 145 T 240 180 T 205 195 T 180 170 Z"
                fill="#38bdf8"
              />
              <path
                d="M 235 110 Q 260 100, 275 120 T 295 145 T 280 165 T 255 155 Z"
                fill="#0284c7"
              />
              <path
                d="M 175 150 Q 190 145, 195 160 T 175 185 Z"
                fill="#0284c7"
              />

                                          <circle cx="170" cy="95" r="16" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
              <text x="170" y="101" textAnchor="middle" fill="#78350f" fontSize="15" fontWeight="bold" fontFamily="Arial">$</text>

                            <circle cx="285" cy="85" r="14" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
              <text x="285" y="90" textAnchor="middle" fill="#78350f" fontSize="13" fontWeight="bold" fontFamily="Arial">%</text>

                            <circle cx="340" cy="130" r="8" stroke="#ffffff" strokeWidth="2" strokeDasharray="2 2" />
              <circle cx="125" cy="120" r="7" stroke="#ffffff" strokeWidth="2" />

                            <rect x="115" y="145" width="22" height="4" rx="2" fill="#bae6fd" />
              <rect x="110" y="153" width="32" height="4" rx="2" fill="#38bdf8" />
              <rect x="118" y="161" width="18" height="4" rx="2" fill="#bae6fd" />

                            <path
                d="M 315 120 Q 330 105, 345 115 T 375 108"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 315 130 Q 330 118, 345 125 T 375 118"
                stroke="#bae6fd"
                strokeWidth="2"
                strokeLinecap="round"
              />

                            <path
                d="M 160 215 L 225 145 L 255 175 L 320 95"
                stroke="#f59e0b"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polygon
                points="320,80 338,105 308,102"
                fill="#f59e0b"
              />
                            <path
                d="M 164 212 L 225 147 L 255 177 L 316 102"
                stroke="#fde047"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

                                          <circle cx="165" cy="215" r="9" fill="#0f172a" />
              <path d="M 152 250 C 152 230, 178 230, 178 250 Z" fill="#0284c7" />
              <rect x="156" y="250" width="8" height="32" fill="#1e293b" />
              <rect x="166" y="250" width="8" height="32" fill="#1e293b" />
              <circle cx="160" cy="245" r="11" fill="#f8fafc" opacity="0.3" />

                            <circle cx="218" cy="205" r="10" fill="#0f172a" />
              <path d="M 202 245 C 202 222, 234 222, 234 245 Z" fill="#0369a1" />
              <rect x="207" y="245" width="9" height="38" fill="#0f172a" />
              <rect x="219" y="245" width="9" height="38" fill="#0f172a" />

                            <circle cx="265" cy="215" r="9" fill="#0f172a" />
              <path d="M 252 250 C 252 230, 278 230, 278 250 Z" fill="#0f172a" />
              <rect x="256" y="250" width="8" height="32" fill="#334155" />
              <rect x="266" y="250" width="8" height="32" fill="#334155" />
                            <rect x="270" y="232" width="14" height="18" rx="2" fill="#38bdf8" />

                            <circle cx="300" cy="222" r="9" fill="#d97706" />
              <path d="M 290 252 C 290 234, 310 234, 310 252 Z" fill="#0284c7" />
              <rect x="293" y="252" width="6" height="30" fill="#0f172a" />
              <rect x="301" y="252" width="6" height="30" fill="#0f172a" />
            </svg>
          </div>

                    <div className="dribbble-bottom-headline">
            <h3>
              New way to <span className="highlight-gold">Invest with Research</span>
            </h3>
          </div>
        </div>

                <div className="dribbble-right-pane">
          <motion.div 
            className="dribbble-auth-card"
            layout
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <div className="card-greeting-block">
              <h2>{isLogin ? "Welcome" : "Create Account"}</h2>
              <p>{isLogin ? "Sign in to continue" : "Register to get started"}</p>
            </div>

            {error && (
              <motion.div 
                className="dribbble-error-alert"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle size={14} />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="dribbble-login-form">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div 
                    className="dribbble-input-row"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <label>FULL NAME</label>
                    <div className="dribbble-input-field">
                      <User size={15} className="dribbble-field-icon" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter full name"
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="dribbble-input-row">
                <label>{isLogin ? "CLIENT CODE / EMAIL" : "EMAIL ADDRESS"}</label>
                <div className="dribbble-input-field">
                  <Mail size={15} className="dribbble-field-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter registered email"
                    required
                  />
                </div>
              </div>

              <div className="dribbble-input-row">
                <label>PASSWORD</label>
                <div className="dribbble-input-field">
                  <Lock size={15} className="dribbble-field-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="dribbble-pw-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div 
                    className="dribbble-input-row"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <label>CONFIRM PASSWORD</label>
                    <div className="dribbble-input-field">
                      <Lock size={15} className="dribbble-field-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isLogin && (
                <div className="dribbble-aux-links">
                  <span className="dribbble-forgot-link">Forgot password?</span>
                </div>
              )}

              <motion.button 
                type="submit" 
                className="dribbble-primary-submit-btn" 
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="dribbble-loading-spinner" />
                ) : (
                  <span>{isLogin ? "LOGIN" : "SIGN UP"}</span>
                )}
              </motion.button>
            </form>

                        <div className="dribbble-switch-mode">
              {isLogin ? (
                <p>
                  New user ?{" "}
                  <button
                    type="button"
                    className="switch-action-link"
                    onClick={() => handleToggleMode(false)}
                  >
                    Sign Up
                  </button>
                </p>
              ) : (
                <p>
                  Existing user ?{" "}
                  <button
                    type="button"
                    className="switch-action-link"
                    onClick={() => handleToggleMode(true)}
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Auth;
