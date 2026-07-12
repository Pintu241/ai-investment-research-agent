import { useState, useEffect } from "react";
import {
  createResearch,
  getResearchHistory,
  deleteResearch,
  toggleSaveResearch
} from "../services/api";
import "./CompanySearch.css";

function CompanySearch({ currentUser, onLogout }) {
  const [company, setCompany] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("research");

  // New state variables for buttons/navigation
  const [historyList, setHistoryList] = useState([]);
  const [activeSidebar, setActiveSidebar] = useState("new"); // "new", "history", "saved"
  const [showAbout, setShowAbout] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Load history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await getResearchHistory();
      if (response && response.success) {
        setHistoryList(response.data);
      }
    } catch (err) {
      console.error("Error loading history:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!company.trim()) {
      setError("Please enter a company name");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await createResearch(company);

      if (response && response.success) {
        setResult(response.data);
        setActiveTab("research");
        setActiveSidebar("new");
        fetchHistory(); // Refresh history
      } else {
        setError("Failed to compile research report");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to research company. Make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const response = await toggleSaveResearch(id);
      if (response && response.success) {
        // Update local history
        setHistoryList(prev =>
          prev.map(item => item._id === id ? { ...item, saved: response.data.saved } : item)
        );
        // If current report is this one, update its saved status
        if (result && result._id === id) {
          setResult(prev => ({ ...prev, saved: response.data.saved }));
        }
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    }
  };

  const handleDeleteReport = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const response = await deleteResearch(id);
      if (response && response.success) {
        setHistoryList(prev => prev.filter(item => item._id !== id));
        if (result && result._id === id) {
          setResult(null);
        }
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error("Error deleting report:", err);
    }
  };

  const tabs = {
    research: {
      label: "Business",
      title: "Business research",
      content: result?.research
    },
    financial: {
      label: "Financials",
      title: "Financial analysis",
      content: result?.financialAnalysis
    },
    news: {
      label: "Developments",
      title: "News and developments",
      content: result?.newsAnalysis
    },
    risk: {
      label: "Risk",
      title: "Risk assessment",
      content: result?.riskAnalysis
    }
  };

  const stages = [
    "Research",
    "Financials",
    "News",
    "Risk",
    "Decision"
  ];

  const currentTab = tabs[activeTab];

  // Filter lists
  const displayList = activeSidebar === "saved" 
    ? historyList.filter(item => item.saved) 
    : historyList;

  return (
    <div className="app-layout">
      <header className="topbar">
        <div 
          className="brand" 
          onClick={() => { setResult(null); setCompany(""); setActiveSidebar("new"); setError(""); }} 
          style={{ cursor: "pointer" }}
        >
          <div className="brand-mark">↗</div>

          <div className="brand-copy">
            <strong>IR</strong>
            <span>Investment Research</span>
          </div>
        </div>

        <nav className="topnav">
          <button 
            type="button" 
            onClick={() => { setActiveSidebar("history"); fetchHistory(); }}
            style={{ color: activeSidebar === "history" ? "#1858bd" : "#253047" }}
          >
            Reports
          </button>
          <button 
            type="button" 
            onClick={() => setShowAbout(true)}
          >
            About
          </button>

          <div 
            className="avatar" 
            onClick={() => setShowUserDropdown(!showUserDropdown)} 
            style={{ cursor: "pointer", position: "relative" }}
          >
            {currentUser?.name?.charAt(0).toUpperCase() || "U"}
            {showUserDropdown && (
              <div 
                style={{
                  position: "absolute",
                  top: "44px",
                  right: "0",
                  background: "#ffffff",
                  border: "1px solid #e3e8ef",
                  borderRadius: "8px",
                  padding: "16px",
                  width: "220px",
                  boxShadow: "0 6px 20px rgba(31, 45, 61, 0.1)",
                  textAlign: "left",
                  zIndex: "100"
                }} 
                onClick={(e) => e.stopPropagation()}
              >
                <strong style={{ display: "block", fontSize: "14px", color: "#172033" }}>{currentUser?.name || "User Account"}</strong>
                <span style={{ display: "block", fontSize: "11px", color: "#748197", marginTop: "2px" }}>{currentUser?.email || ""}</span>
                <div style={{ height: "1px", background: "#e7ebf0", margin: "10px 0" }} />
                <span 
                  style={{ fontSize: "12px", color: "#1858bd", cursor: "pointer", fontWeight: "600", display: "block" }} 
                  onClick={() => { setActiveSidebar("saved"); setShowUserDropdown(false); }}
                >
                  Saved Reports ({historyList.filter(i => i.saved).length})
                </span>
                <span 
                  style={{ fontSize: "12px", color: "#253047", cursor: "pointer", fontWeight: "600", display: "block", marginTop: "8px" }} 
                  onClick={() => { setActiveSidebar("history"); setShowUserDropdown(false); }}
                >
                  View History ({historyList.length})
                </span>
                <div style={{ height: "1px", background: "#e7ebf0", margin: "10px 0" }} />
                <span 
                  style={{ fontSize: "12px", color: "#b13b34", cursor: "pointer", fontWeight: "600", display: "block" }} 
                  onClick={() => { onLogout(); setShowUserDropdown(false); }}
                >
                  Logout
                </span>
              </div>
            )}
          </div>
        </nav>
      </header>

      <aside className="sidebar">
        <nav className="sidebar-nav">
          <button
            type="button"
            className={`nav-item ${activeSidebar === "new" ? "active" : ""}`}
            onClick={() => setActiveSidebar("new")}
          >
            <span>⌂</span>
            New Research
          </button>

          <button
            type="button"
            className={`nav-item ${activeSidebar === "history" ? "active" : ""}`}
            onClick={() => { setActiveSidebar("history"); fetchHistory(); }}
          >
            <span>◷</span>
            History ({historyList.length})
          </button>

          <button
            type="button"
            className={`nav-item ${activeSidebar === "saved" ? "active" : ""}`}
            onClick={() => { setActiveSidebar("saved"); fetchHistory(); }}
          >
            <span>▢</span>
            Saved Reports ({historyList.filter(i => i.saved).length})
          </button>
        </nav>

        <div className="sidebar-divider" />

        <div className="workflow-note">
          <span className="workflow-icon">i</span>

          <strong>How it works</strong>

          <p>
            The research workflow analyzes business,
            financial context, developments and risk
            before producing a final view.
          </p>
        </div>
      </aside>

      <main className="workspace">
        {activeSidebar === "new" && (
          <>
            <section className="search-panel">
              <div>
                <h1>Company research</h1>

                <p>
                  Build an investment view from business,
                  financial, development and risk analysis.
                </p>
              </div>

              <form
                className="search-form"
                onSubmit={handleSubmit}
              >
                <div className="search-input-wrap">
                  <span className="search-icon">⌕</span>

                  <input
                    type="text"
                    value={company}
                    onChange={(e) =>
                      setCompany(e.target.value)
                    }
                    placeholder="Search for a company (e.g. Tata Motors, Infosys)"
                  />
                </div>

                <button
                  className="research-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Researching..."
                    : "Research"}
                </button>
              </form>

              {error && (
                <p className="error-message">
                  {error}
                </p>
              )}
            </section>

            {loading && (
              <section className="loading-panel">
                <div className="loading-top">
                  <div>
                    <strong>
                      Building research report
                    </strong>

                    <p>
                      The workflow is running each
                      analysis stage.
                    </p>
                  </div>

                  <span>In progress</span>
                </div>

                <div className="loading-track">
                  <div className="loading-bar" />
                </div>

                <div className="loading-stages">
                  {stages.map((stage, index) => (
                    <span key={stage}>
                      {index + 1}. {stage}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {result && !loading && (
              <>
                <section className="company-panel">
                  <div className="company-main">
                    <div className="company-symbol">
                      {result.company
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <h2>
                        {result.company?.toUpperCase()}
                      </h2>

                      <p>
                        Research report
                        <span>•</span>
                        5-stage analysis completed
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                      type="button" 
                      onClick={() => handleToggleSave(result._id)} 
                      className={`original-action-btn ${result.saved ? "saved" : ""}`}
                      style={{
                        padding: "8px 12px",
                        border: "1px solid #d7dee8",
                        borderRadius: "6px",
                        background: result.saved ? "#edf4ff" : "#ffffff",
                        color: result.saved ? "#1858bd" : "#3d485b",
                        fontWeight: "600",
                        fontSize: "13px",
                        cursor: "pointer"
                      }}
                    >
                      {result.saved ? "★ Bookmarked" : "☆ Bookmark"}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setDeleteConfirmId(result._id)} 
                      className="original-action-btn"
                      style={{
                        padding: "8px 12px",
                        border: "1px solid #f1d0ce",
                        borderRadius: "6px",
                        background: "#fff7f6",
                        color: "#b13b34",
                        fontWeight: "600",
                        fontSize: "13px",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </div>

                  <div
                    className={`recommendation ${result.decision?.toLowerCase()}`}
                  >
                    <div>
                      <span>RECOMMENDATION</span>

                      <strong>
                        {result.decision}
                      </strong>

                      <p>
                        {result.confidence}% confidence
                      </p>
                    </div>

                    <div
                      className="confidence-ring"
                      style={{
                        "--confidence":
                          `${result.confidence * 3.6}deg`
                      }}
                    >
                      <span>
                        {result.confidence}%
                      </span>
                    </div>
                  </div>
                </section>

                <section className="stage-panel">
                  {stages.map((stage, index) => (
                    <div
                      className="stage-item"
                      key={stage}
                    >
                      <div className="stage-circle">
                        ✓
                      </div>

                      <div>
                        <span>
                          0{index + 1}
                        </span>

                        <strong>
                          {stage}
                        </strong>

                        <small>
                          Completed
                        </small>
                      </div>
                    </div>
                  ))}
                </section>

                <section className="report-grid">
                  <article className="investment-card">
                    <div className="card-title">
                      <span className="title-icon">
                        ↗
                      </span>

                      <h3>Investment view</h3>
                    </div>

                    <p className="investment-reasoning">
                      {result.reasoning}
                    </p>

                    <div className="signal-grid">
                      <div className="signal-box positive">
                        <span>BUSINESS VIEW</span>

                        <p>
                          {result.research
                            ? result.research
                                .split(".")
                                .slice(0, 2)
                                .join(".") + "."
                            : "No research available."}
                        </p>
                      </div>

                      <div className="signal-box concern">
                        <span>RISK VIEW</span>

                        <p>
                          {result.riskAnalysis
                            ? result.riskAnalysis
                                .split(".")
                                .slice(0, 2)
                                .join(".") + "."
                            : "No risk analysis available."}
                        </p>
                      </div>
                    </div>
                  </article>

                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <aside className="facts-card">
                      <div className="card-title">
                        <span className="title-icon">
                          ▦
                        </span>

                        <h3>Report facts</h3>
                      </div>

                      <dl>
                        <div>
                          <dt>Company</dt>
                          <dd>{result.company}</dd>
                        </div>

                        <div>
                          <dt>Decision</dt>
                          <dd>{result.decision}</dd>
                        </div>

                        <div>
                          <dt>Confidence</dt>
                          <dd>
                            {result.confidence}%
                          </dd>
                        </div>

                        <div>
                          <dt>Workflow</dt>
                          <dd>LangGraph</dd>
                        </div>

                        <div>
                          <dt>Stages</dt>
                          <dd>5 analysis stages</dd>
                        </div>

                        <div>
                          <dt>Status</dt>
                          <dd>{result.status}</dd>
                        </div>
                      </dl>
                    </aside>

                    <aside className="facts-card">
                      <div className="card-title">
                        <span className="title-icon">
                          📊
                        </span>

                        <h3>Graph analysis</h3>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "16px" }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px", fontWeight: "600" }}>
                            <span>Business Strength</span>
                            <strong>{result.businessScore || 50}%</strong>
                          </div>
                          <div style={{ height: "6px", background: "#eef1f5", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ width: `${result.businessScore || 50}%`, height: "100%", background: "#2468d8", borderRadius: "3px" }} />
                          </div>
                        </div>
                        
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px", fontWeight: "600" }}>
                            <span>Financial Health</span>
                            <strong>{result.financialScore || 50}%</strong>
                          </div>
                          <div style={{ height: "6px", background: "#eef1f5", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ width: `${result.financialScore || 50}%`, height: "100%", background: "#267747", borderRadius: "3px" }} />
                          </div>
                        </div>
                        
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px", fontWeight: "600" }}>
                            <span>News Sentiment</span>
                            <strong>{result.newsScore || 50}%</strong>
                          </div>
                          <div style={{ height: "6px", background: "#eef1f5", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ width: `${result.newsScore || 50}%`, height: "100%", background: "#b47700", borderRadius: "3px" }} />
                          </div>
                        </div>
                        
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px", fontWeight: "600" }}>
                            <span>Risk exposure (lower is better)</span>
                            <strong>{result.riskScore || 50}%</strong>
                          </div>
                          <div style={{ height: "6px", background: "#eef1f5", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ width: `${result.riskScore || 50}%`, height: "100%", background: "#b13b34", borderRadius: "3px" }} />
                          </div>
                        </div>
                      </div>
                    </aside>
                  </div>
                </section>

                <section className="analysis-panel">
                  <div className="analysis-heading">
                    <h3>Detailed analysis</h3>
                  </div>

                  <div className="tabs">
                    {Object.entries(tabs).map(
                      ([key, tab]) => (
                        <button
                          type="button"
                          key={key}
                          className={
                            activeTab === key
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            setActiveTab(key)
                          }
                        >
                          {tab.label}
                        </button>
                      )
                    )}
                  </div>

                  <div className="analysis-body">
                    <div className="analysis-copy">
                      <h4>
                        {currentTab.title}
                      </h4>

                      <p>
                        {currentTab.content ||
                          "No analysis available."}
                      </p>
                    </div>

                    <aside className="summary-note">
                      <span>REPORT NOTE</span>

                      <p>
                        This report is generated from a
                        multi-stage research workflow.
                        Review primary sources before
                        making investment decisions.
                      </p>
                    </aside>
                  </div>
                </section>
              </>
            )}
          </>
        )}

        {(activeSidebar === "history" || activeSidebar === "saved") && (
          <section className="history-panel" style={{ padding: "24px", background: "#ffffff", border: "1px solid #e2e7ee", borderRadius: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #e7ebf0", paddingBottom: "12px" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#172033", margin: "0" }}>
                  {activeSidebar === "history" ? "Research History" : "Saved Reports"}
                </h2>
                <p style={{ fontSize: "13px", color: "#647084", margin: "4px 0 0" }}>
                  {activeSidebar === "history" 
                    ? "Access past institutional research reviews here." 
                    : "Review your saved investment reports."}
                </p>
              </div>
              <span style={{ background: "#edf4ff", color: "#1858bd", fontSize: "12px", fontWeight: "700", padding: "6px 12px", borderRadius: "20px" }}>
                {displayList.length} Reports
              </span>
            </div>

            {displayList.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlignment: "center", color: "#647084" }}>
                <p style={{ fontSize: "14px", margin: "0 0 12px" }}>No reports found.</p>
                <button 
                  type="button" 
                  onClick={() => setActiveSidebar("new")}
                  style={{
                    padding: "8px 16px",
                    border: "0",
                    borderRadius: "6px",
                    background: "#2468d8",
                    color: "#ffffff",
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer"
                  }}
                >
                  Start New Research
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {displayList.map((item) => (
                  <div 
                    key={item._id} 
                    onClick={() => { setResult(item); setActiveSidebar("new"); setActiveTab("research"); }}
                    className="history-list-item"
                    style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center", 
                      padding: "16px", 
                      border: "1px solid #e2e7ee", 
                      borderRadius: "8px", 
                      cursor: "pointer",
                      background: "#ffffff"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ 
                        width: "40px", 
                        height: "40px", 
                        borderRadius: "50%", 
                        background: "#f7faff", 
                        border: "1px solid #dce3ec",
                        color: "#2468d8", 
                        display: "grid", 
                        placeItems: "center", 
                        fontWeight: "800",
                        fontSize: "16px"
                      }}>
                        {item.company?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <h3 style={{ margin: "0", fontSize: "15px", fontWeight: "750", color: "#172033", textTransform: "uppercase" }}>{item.company}</h3>
                          <span style={{ 
                            fontSize: "9px", 
                            fontWeight: "800", 
                            padding: "2px 6px", 
                            borderRadius: "4px",
                            background: item.decision === "INVEST" ? "#f4fbf6" : item.decision === "PASS" ? "#fff7f6" : "#fffaf0",
                            color: item.decision === "INVEST" ? "#267747" : item.decision === "PASS" ? "#b13b34" : "#b47700",
                            border: `1px solid ${item.decision === "INVEST" ? "#cce8d6" : item.decision === "PASS" ? "#f1d0ce" : "#f1dfaa"}`
                          }}>
                            {item.decision}
                          </span>
                        </div>
                        <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#647084" }}>
                          Confidence: {item.confidence}% • Compiled on {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }} onClick={(e) => e.stopPropagation()}>
                      <button 
                        type="button"
                        onClick={(e) => handleToggleSave(item._id, e)}
                        style={{ background: "transparent", border: "0", fontSize: "18px", cursor: "pointer", color: item.saved ? "#f59e0b" : "#748197" }}
                        title={item.saved ? "Unsave Report" : "Save Report"}
                      >
                        {item.saved ? "★" : "☆"}
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setResult(item); setActiveSidebar("new"); setActiveTab("research"); }}
                        style={{ padding: "6px 12px", border: "1px solid #d7dee8", background: "#ffffff", borderRadius: "5px", color: "#3d485b", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                      >
                        Load
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => setDeleteConfirmId(item._id)}
                        style={{ padding: "6px 12px", border: "1px solid #f1d0ce", background: "#fff7f6", borderRadius: "5px", color: "#b13b34", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* CONFIRM DELETE DIALOG */}
      {deleteConfirmId && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: "rgba(23, 32, 51, 0.4)",
          backdropFilter: "blur(4px)",
          display: "grid",
          placeItems: "center",
          zIndex: "1000"
        }}>
          <div style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "10px",
            border: "1px solid #e2e7ee",
            width: "360px",
            boxShadow: "0 10px 30px rgba(31, 45, 61, 0.15)",
            textAlign: "center"
          }}>
            <h3 style={{ margin: "0 0 10px", fontSize: "16px", fontWeight: "700", color: "#172033" }}>Delete Research Report?</h3>
            <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#647084" }}>This action is permanent and cannot be undone.</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <button 
                type="button" 
                onClick={() => setDeleteConfirmId(null)}
                style={{ padding: "8px 16px", border: "1px solid #d7dee8", background: "#ffffff", borderRadius: "6px", color: "#3d485b", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => handleDeleteReport(deleteConfirmId)}
                style={{ padding: "8px 16px", border: "0", background: "#b13b34", color: "#ffffff", borderRadius: "6px", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ABOUT APP DIALOG */}
      {showAbout && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: "rgba(23, 32, 51, 0.4)",
          backdropFilter: "blur(4px)",
          display: "grid",
          placeItems: "center",
          zIndex: "1000"
        }}>
          <div style={{
            background: "#ffffff",
            padding: "28px",
            borderRadius: "10px",
            border: "1px solid #e2e7ee",
            width: "500px",
            boxShadow: "0 10px 30px rgba(31, 45, 61, 0.15)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #e7ebf0", paddingBottom: "10px" }}>
              <h3 style={{ margin: "0", fontSize: "18px", fontWeight: "700", color: "#172033" }}>About Investment Research Agent</h3>
              <button type="button" onClick={() => setShowAbout(false)} style={{ background: "transparent", border: "0", fontSize: "22px", cursor: "pointer", color: "#748197", padding: "0 5px" }}>×</button>
            </div>
            <div style={{ fontSize: "13.5px", color: "#3d485b", lineHeight: "1.6" }}>
              <p style={{ margin: "0 0 12px" }}>
                The <strong>AI Investment Research Agent</strong> aggregates and evaluates market parameters, financial sheets, and sentiment vectors through a multi-agent LangGraph workflow.
              </p>
              <h4 style={{ margin: "14px 0 6px", fontSize: "14px", fontWeight: "700", color: "#172033" }}>5-Stage Pipeline Core:</h4>
              <ul style={{ margin: "0 0 20px", paddingLeft: "20px", color: "#5d687a" }}>
                <li style={{ marginBottom: "4px" }}><strong>1. Business Scope</strong>: Analyzes market positioning and product fit.</li>
                <li style={{ marginBottom: "4px" }}><strong>2. Financial Ratios</strong>: Assesses earnings, margins, and valuation sheets.</li>
                <li style={{ marginBottom: "4px" }}><strong>3. Developments & News</strong>: Captures recent headlines and public feedback.</li>
                <li style={{ marginBottom: "4px" }}><strong>4. Risk Matrix</strong>: Highlights operational and regulatory headwinds.</li>
                <li style={{ marginBottom: "4px" }}><strong>5. Final Recommendation Synthesis</strong>: Yields Buy/Watch/Pass views.</li>
              </ul>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #e7ebf0", paddingTop: "12px", marginTop: "12px" }}>
              <button 
                type="button" 
                onClick={() => setShowAbout(false)}
                style={{ padding: "8px 16px", border: "1px solid #d7dee8", background: "#ffffff", borderRadius: "6px", color: "#3d485b", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanySearch;