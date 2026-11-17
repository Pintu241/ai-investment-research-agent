import { useState, useEffect } from "react";
import CompanySearch from "./components/CompanySearch";
import Auth from "./components/Auth";
import { getCurrentUser } from "./services/api";
import "./components/CompanySearch.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        if (response && response.success) {
          setUser(response.data);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = (authData) => {
    setUser({
      _id: authData._id,
      name: authData.name,
      email: authData.email
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f8fafc",
        fontFamily: "'Inter', sans-serif",
        color: "#334155"
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
          <div className="portal-spinner" style={{ width: "28px", height: "28px", borderWidth: "3px", borderColor: "#cbd5e1", borderTopColor: "#1d4ed8" }} />
          <p style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Loading Research Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      {user ? (
        <CompanySearch currentUser={user} onLogout={handleLogout} />
      ) : (
        <Auth onAuthSuccess={handleAuthSuccess} />
      )}
    </main>
  );
}

export default App;
