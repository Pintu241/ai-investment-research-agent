import { useState } from "react";
import { loginUser, signupUser } from "../services/api";

function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill out email and password fields");
      return;
    }

    if (!isLogin) {
      if (!name.trim()) {
        setError("Please enter your name");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
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
        "Something went wrong. Please check your connection."
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
    <div style={{
      minHeight: "100vh",
      background: "#f7f9fc",
      display: "grid",
      placeItems: "center",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{
        width: "min(400px, calc(100% - 32px))",
        background: "#ffffff",
        border: "1px solid #e2e7ee",
        borderRadius: "10px",
        padding: "32px",
        boxShadow: "0 4px 16px rgba(31, 45, 61, 0.05)"
      }}>
        {/* Brand/Logo Header */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          marginBottom: "24px"
        }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "7px",
            background: "#2468d8",
            color: "#ffffff",
            display: "grid",
            placeItems: "center",
            fontWeight: "800",
            fontSize: "18px"
          }}>↗</div>
          <strong style={{ fontSize: "20px", color: "#172033", letterSpacing: "-0.02em" }}>Investment Research</strong>
        </div>

        {/* Tab switchers */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid #e7ebf0",
          marginBottom: "24px"
        }}>
          <button
            type="button"
            onClick={() => handleTabChange(true)}
            style={{
              flex: "1",
              padding: "10px 0",
              background: "transparent",
              border: "0",
              borderBottom: isLogin ? "2px solid #2468d8" : "2px solid transparent",
              color: isLogin ? "#2468d8" : "#68758a",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer"
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => handleTabChange(false)}
            style={{
              flex: "1",
              padding: "10px 0",
              background: "transparent",
              border: "0",
              borderBottom: !isLogin ? "2px solid #2468d8" : "2px solid transparent",
              color: !isLogin ? "#2468d8" : "#68758a",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer"
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {!isLogin && (
            <div>
              <label htmlFor="auth-name" style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#68758a", textTransform: "uppercase", marginBottom: "6px" }}>Full Name</label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d7dee8",
                  borderRadius: "6px",
                  fontSize: "13px",
                  outline: "none",
                  background: "#ffffff",
                  color: "#1d2738"
                }}
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#68758a", textTransform: "uppercase", marginBottom: "6px" }}>Email Address</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d7dee8",
                borderRadius: "6px",
                fontSize: "13px",
                outline: "none",
                background: "#ffffff",
                color: "#1d2738"
              }}
            />
          </div>

          <div>
            <label htmlFor="auth-password" style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#68758a", textTransform: "uppercase", marginBottom: "6px" }}>Password</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d7dee8",
                borderRadius: "6px",
                fontSize: "13px",
                outline: "none",
                background: "#ffffff",
                color: "#1d2738"
              }}
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="auth-confirm-password" style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#68758a", textTransform: "uppercase", marginBottom: "6px" }}>Confirm Password</label>
              <input
                id="auth-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d7dee8",
                  borderRadius: "6px",
                  fontSize: "13px",
                  outline: "none",
                  background: "#ffffff",
                  color: "#1d2738"
                }}
              />
            </div>
          )}

          {error && (
            <p style={{
              margin: "0",
              color: "#b42318",
              fontSize: "12px",
              background: "#fff7f6",
              border: "1px solid #f1d0ce",
              padding: "8px 12px",
              borderRadius: "5px"
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "11px 0",
              border: "0",
              borderRadius: "6px",
              background: "#2468d8",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "13px",
              cursor: "pointer",
              marginTop: "8px",
              opacity: loading ? "0.75" : "1"
            }}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;
