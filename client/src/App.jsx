import { useState, useEffect } from "react";
import CompanySearch from "./components/CompanySearch";
import Auth from "./components/Auth";
import { getCurrentUser } from "./services/api";

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
        background: "#f7f9fc",
        fontFamily: "Inter, sans-serif",
        color: "#647084"
      }}>
        <p>Loading application session...</p>
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