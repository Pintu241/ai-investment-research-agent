import { useState, useEffect } from "react";
import {
  createResearch,
  getResearchHistory,
  deleteResearch,
  toggleSaveResearch
} from "../services/api";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Search,
  Building2,
  DollarSign,
  Newspaper,
  ShieldAlert,
  Bookmark,
  Trash2,
  Printer,
  Copy,
  Check,
  ChevronRight,
  LogOut,
  Info,
  BarChart3,
  RefreshCw,
  FileText,
  Briefcase,
  SlidersHorizontal,
  CheckCircle2,
  HelpCircle,
  ExternalLink
} from "lucide-react";
import "./CompanySearch.css";

const COVERAGE_UNIVERSE = [
  "Tata Motors",
  "NVIDIA",
  "Apple",
  "Tesla",
  "Microsoft",
  "Reliance",
  "Infosys"
];

const ANALYSIS_PHASES = [
  { name: "Business Model", desc: "Evaluating market position, industry moat & pricing power" },
  { name: "Financial Profile", desc: "Examining margins, cash flows & balance sheet health" },
  { name: "Market Catalysts", desc: "Assessing recent headlines, product cycles & industry trends" },
  { name: "Risk Matrix", desc: "Screening macro headwinds, regulatory exposure & competitive threats" },
  { name: "Investment Thesis", desc: "Synthesizing target rating and multi-factor conviction score" }
];

function CompanySearch({ currentUser, onLogout }) {
  const [company, setCompany] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("research");

  const [historyList, setHistoryList] = useState([]);
  const [activeSidebar, setActiveSidebar] = useState("new");
  const [showMethodology, setShowMethodology] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  // Progress through analytical phases during report compilation
  useEffect(() => {
    let interval;
    if (loading) {
      setActivePhaseIndex(0);
      interval = setInterval(() => {
        setActivePhaseIndex((prev) => (prev < ANALYSIS_PHASES.length - 1 ? prev + 1 : prev));
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  async function fetchHistory() {
    try {
      const response = await getResearchHistory();
      if (response && response.success) {
        setHistoryList(response.data);
      }
    } catch (err) {
      console.error("Error loading coverage archive:", err);
    }
  }

  const runAnalysis = async (targetCompany) => {
    const query = (targetCompany || company).trim();
    if (!query) {
      setError("Please specify a company name or ticker symbol.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await createResearch(query);

      if (response && response.success) {
        setResult(response.data);
        setActiveTab("research");
        setActiveSidebar("new");
        fetchHistory();
        showToast(`Research report compiled for ${query}`);
      } else {
        setError("Failed to generate research report. Please verify your query.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to compile report. Please verify connection to the research API."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runAnalysis();
  };

  const handleChipClick = (c) => {
    setCompany(c);
    runAnalysis(c);
  };

  const handleToggleSave = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const response = await toggleSaveResearch(id);
      if (response && response.success) {
        setHistoryList((prev) =>
          prev.map((item) => (item._id === id ? { ...item, saved: response.data.saved } : item))
        );
        if (result && result._id === id) {
          setResult((prev) => ({ ...prev, saved: response.data.saved }));
        }
        showToast(response.data.saved ? "Added to Watchlist" : "Removed from Watchlist");
      }
    } catch (err) {
      console.error("Error updating watchlist:", err);
    }
  };

  const handleDeleteReport = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const response = await deleteResearch(id);
      if (response && response.success) {
        setHistoryList((prev) => prev.filter((item) => item._id !== id));
        if (result && result._id === id) {
          setResult(null);
        }
        setDeleteConfirmId(null);
        showToast("Report deleted from archive");
      }
    } catch (err) {
      console.error("Error removing report:", err);
    }
  };

  const handleCopySummary = () => {
    if (!result) return;
    const summaryText = `APEX EQUITY RESEARCH: ${result.company.toUpperCase()}\nRating: ${getRatingLabel(result.decision)} (${result.confidence}% Conviction Score)\n\nEXECUTIVE THESIS:\n${result.reasoning}\n\nBUSINESS MODEL & MOAT:\n${result.research}\n\nFINANCIAL PROFILE:\n${result.financialAnalysis}\n\nRISK FACTORS:\n${result.riskAnalysis}\n\n---\nReport Source: Apex Institutional Equity Intelligence`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    showToast("Report copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const getRatingLabel = (decision) => {
    if (decision === "INVEST") return "BUY / OUTPERFORM";
    if (decision === "WATCH") return "HOLD / NEUTRAL";
    if (decision === "PASS") return "UNDERWEIGHT / SELL";
    return decision || "NOT RATED";
  };

  const tabs = {
    research: {
      label: "Business & Moat",
      icon: <Building2 size={16} />,
      title: "Business Model & Competitive Moat",
      content: result?.research
    },
    financial: {
      label: "Financial Profile",
      icon: <DollarSign size={16} />,
      title: "Fundamental Financial & Margin Analysis",
      content: result?.financialAnalysis
    },
    news: {
      label: "Market Catalysts",
      icon: <Newspaper size={16} />,
      title: "Recent Industry Developments & Sentiment",
      content: result?.newsAnalysis
    },
    risk: {
      label: "Risk Factors",
      icon: <ShieldAlert size={16} />,
      title: "Downside Risks & Sensitivity Assessment",
      content: result?.riskAnalysis
    }
  };

  const currentTab = tabs[activeTab];

  const computeScores = (res) => {
    const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));
    if (!res) return { businessScore: 50, financialScore: 50, newsScore: 50, riskScore: 50 };

    let business = typeof res.businessScore === "number" ? res.businessScore : 74;
    let financial = typeof res.financialScore === "number" ? res.financialScore : 70;
    let news = typeof res.newsScore === "number" ? res.newsScore : 65;
    let risk = typeof res.riskScore === "number" ? res.riskScore : 32;

    return {
      businessScore: clamp(business),
      financialScore: clamp(financial),
      newsScore: clamp(news),
      riskScore: clamp(risk)
    };
  };

  const computedScores = computeScores(result);

  const displayList =
    activeSidebar === "saved"
      ? historyList.filter((item) => item.saved)
      : historyList;

  return (
    <div className="terminal-shell">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="terminal-toast">
          <CheckCircle2 size={16} className="toast-check" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <header className="terminal-topbar">
        <div className="topbar-left-zone">
          <div
            className="corporate-logo"
            onClick={() => {
              setResult(null);
              setCompany("");
              setActiveSidebar("new");
              setError("");
            }}
          >
            <div className="logo-crest">
              <TrendingUp size={19} strokeWidth={2.5} />
            </div>
            <div className="logo-text-block">
              <span className="logo-firm-name">APEX RESEARCH</span>
              <span className="logo-division-tag">GLOBAL EQUITY INTELLIGENCE</span>
            </div>
          </div>

          <div className="market-status-badge">
            <span className="market-dot" />
            <span className="market-text">MARKETS: ACTIVE • GLOBAL COVERAGE</span>
          </div>
        </div>

        <div className="topbar-right-zone">
          <button
            type="button"
            className="terminal-nav-link"
            onClick={() => {
              setActiveSidebar("history");
              fetchHistory();
            }}
          >
            <Clock size={15} />
            <span>Archive ({historyList.length})</span>
          </button>

          <button
            type="button"
            className="terminal-nav-link"
            onClick={() => setShowMethodology(true)}
          >
            <HelpCircle size={15} />
            <span>Coverage Framework</span>
          </button>

          {/* User Account Popover */}
          <div className="user-profile-anchor">
            <button
              type="button"
              className="user-btn-trigger"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <div className="user-initials-badge">
                {currentUser?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="user-info-preview">
                <span className="user-display-name">{currentUser?.name || "Analyst"}</span>
                <span className="user-role-tag">Portfolio Analyst</span>
              </div>
            </button>

            {showUserDropdown && (
              <div className="user-popover-menu" onClick={(e) => e.stopPropagation()}>
                <div className="popover-header">
                  <strong>{currentUser?.name || "Analyst"}</strong>
                  <span>{currentUser?.email || ""}</span>
                </div>
                <div className="popover-divider" />
                <button
                  type="button"
                  className="popover-action"
                  onClick={() => {
                    setActiveSidebar("saved");
                    setShowUserDropdown(false);
                  }}
                >
                  <Bookmark size={14} />
                  <span>Watchlist ({historyList.filter((i) => i.saved).length})</span>
                </button>
                <button
                  type="button"
                  className="popover-action"
                  onClick={() => {
                    setActiveSidebar("history");
                    setShowUserDropdown(false);
                  }}
                >
                  <Clock size={14} />
                  <span>Coverage Archive ({historyList.length})</span>
                </button>
                <div className="popover-divider" />
                <button
                  type="button"
                  className="popover-action danger-action"
                  onClick={() => {
                    onLogout();
                    setShowUserDropdown(false);
                  }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="terminal-main-layout">
        {/* SIDEBAR NAVIGATION */}
        <aside className="terminal-sidebar">
          <div className="sidebar-section">
            <span className="sidebar-heading">EQUITY COVERAGE</span>
            <button
              type="button"
              className={`sidebar-link ${activeSidebar === "new" ? "active" : ""}`}
              onClick={() => setActiveSidebar("new")}
            >
              <Search size={16} />
              <span>Company Research</span>
            </button>

            <button
              type="button"
              className={`sidebar-link ${activeSidebar === "history" ? "active" : ""}`}
              onClick={() => {
                setActiveSidebar("history");
                fetchHistory();
              }}
            >
              <Clock size={16} />
              <span>Coverage Archive</span>
              <span className="sidebar-counter">{historyList.length}</span>
            </button>

            <button
              type="button"
              className={`sidebar-link ${activeSidebar === "saved" ? "active" : ""}`}
              onClick={() => {
                setActiveSidebar("saved");
                fetchHistory();
              }}
            >
              <Bookmark size={16} />
              <span>Target Watchlist</span>
              <span className="sidebar-counter highlight">
                {historyList.filter((i) => i.saved).length}
              </span>
            </button>
          </div>

          <div className="sidebar-info-box">
            <div className="info-box-header">
              <Briefcase size={15} color="#1d4ed8" />
              <strong>Institutional Standard</strong>
            </div>
            <p>
              Reports incorporate 4 core pillars: moat durability, balance sheet health, catalyst
              sentiment, and downside scenario analysis.
            </p>
            <button
              type="button"
              className="text-sublink"
              onClick={() => setShowMethodology(true)}
            >
              Methodology Details →
            </button>
          </div>
        </aside>

        {/* WORKSPACE AREA */}
        <main className="terminal-content">
          {activeSidebar === "new" && (
            <div className="content-stack">
              {/* RESEARCH SEARCH CARD */}
              <section className="search-deck-card">
                <div className="search-intro">
                  <span className="search-kicker">INSTITUTIONAL EQUITY INTELLIGENCE</span>
                  <h1>Company Research & Valuation Analysis</h1>
                  <p>
                    Enter any publicly listed company or ticker to evaluate fundamental valuation,
                    competitive moat, balance sheet margins, and institutional consensus.
                  </p>
                </div>

                <form className="search-bar-form" onSubmit={handleSubmit}>
                  <div className="search-bar-input-box">
                    <Search size={18} className="search-lens" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Enter company name or ticker (e.g. Tata Motors, NVIDIA, Apple, Microsoft, Tesla)..."
                      disabled={loading}
                    />
                    {company && !loading && (
                      <button
                        type="button"
                        className="search-clear-btn"
                        onClick={() => setCompany("")}
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <button
                    className="execute-search-btn"
                    type="submit"
                    disabled={loading || !company.trim()}
                  >
                    {loading ? (
                      <span>Analyzing...</span>
                    ) : (
                      <>
                        <span>Generate Report</span>
                        <ChevronRight size={17} />
                      </>
                    )}
                  </button>
                </form>

                {/* Popular coverage suggestions */}
                <div className="coverage-chips-row">
                  <span className="chips-title">Active Universe:</span>
                  <div className="chips-wrapper">
                    {COVERAGE_UNIVERSE.map((c) => (
                      <button
                        type="button"
                        key={c}
                        className="coverage-chip"
                        onClick={() => handleChipClick(c)}
                        disabled={loading}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="error-callout">
                    <ShieldAlert size={17} />
                    <span>{error}</span>
                  </div>
                )}
              </section>

              {/* LOADING INDICATOR */}
              {loading && (
                <section className="compilation-stepper-card">
                  <div className="compilation-header">
                    <div className="compilation-title-group">
                      <RefreshCw size={17} className="rotate-icon" />
                      <strong>Compiling Institutional Equity Coverage</strong>
                    </div>
                    <span className="phase-indicator">
                      Phase {activePhaseIndex + 1} of {ANALYSIS_PHASES.length}
                    </span>
                  </div>

                  <p className="compilation-description">
                    {ANALYSIS_PHASES[activePhaseIndex].desc} for <strong>{company}</strong>...
                  </p>

                  <div className="compilation-bar-track">
                    <div
                      className="compilation-bar-fill"
                      style={{
                        width: `${((activePhaseIndex + 1) / ANALYSIS_PHASES.length) * 100}%`
                      }}
                    />
                  </div>

                  <div className="compilation-nodes">
                    {ANALYSIS_PHASES.map((ph, idx) => {
                      const isComplete = idx < activePhaseIndex;
                      const isCurrent = idx === activePhaseIndex;
                      return (
                        <div
                          key={ph.name}
                          className={`phase-node ${isComplete ? "done" : isCurrent ? "active" : ""}`}
                        >
                          <div className="phase-index-circle">
                            {isComplete ? <Check size={13} strokeWidth={3} /> : idx + 1}
                          </div>
                          <span className="phase-label">{ph.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* REPORT DASHBOARD DISPLAY */}
              {result && !loading && (
                <div className="report-canvas">
                  {/* COMPANY REPORT HEADER */}
                  <section className="report-deck-card">
                    <div className="report-deck-top">
                      <div className="company-summary-unit">
                        <div className="company-ticker-avatar">
                          {result.company?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="company-name-row">
                            <h2>{result.company?.toUpperCase()}</h2>
                            <span className="verified-report-tag">EQUITY RESEARCH</span>
                          </div>
                          <p className="company-meta-details">
                            Published on {new Date(result.createdAt || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} •
                            Institutional Valuation Coverage
                          </p>
                        </div>
                      </div>

                      {/* Action buttons toolbar */}
                      <div className="report-toolbar">
                        <button
                          type="button"
                          className={`toolbar-btn ${result.saved ? "bookmarked" : ""}`}
                          onClick={() => handleToggleSave(result._id)}
                          title={result.saved ? "Remove from watchlist" : "Add to watchlist"}
                        >
                          <Bookmark size={15} fill={result.saved ? "currentColor" : "none"} />
                          <span>{result.saved ? "In Watchlist" : "Add to Watchlist"}</span>
                        </button>

                        <button
                          type="button"
                          className="toolbar-btn"
                          onClick={handleCopySummary}
                          title="Copy executive summary"
                        >
                          {copied ? <Check size={15} /> : <Copy size={15} />}
                          <span>{copied ? "Copied" : "Copy Summary"}</span>
                        </button>

                        <button
                          type="button"
                          className="toolbar-btn"
                          onClick={() => window.print()}
                          title="Print or export PDF report"
                        >
                          <Printer size={15} />
                          <span>Print / Export PDF</span>
                        </button>

                        <button
                          type="button"
                          className="toolbar-btn danger"
                          onClick={() => setDeleteConfirmId(result._id)}
                          title="Delete report"
                        >
                          <Trash2 size={15} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* RECOMMENDATION CALLOUT */}
                    <div className={`recommendation-banner ${result.decision?.toLowerCase()}`}>
                      <div className="recommendation-content">
                        <span className="rating-eyebrow">ANALYST TARGET RATING</span>
                        <div className="rating-headline-row">
                          {result.decision === "INVEST" ? (
                            <TrendingUp size={26} className="rating-icon" />
                          ) : result.decision === "PASS" ? (
                            <TrendingDown size={26} className="rating-icon" />
                          ) : (
                            <Clock size={26} className="rating-icon" />
                          )}
                          <strong className="rating-verdict">
                            {getRatingLabel(result.decision)}
                          </strong>
                        </div>
                        <p className="thesis-summary">{result.reasoning}</p>
                      </div>

                      <div className="conviction-badge-box">
                        <div className="conviction-score-dial">
                          <span className="score-val">{result.confidence}%</span>
                          <span className="score-caption">Conviction Score</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 4 QUANTITATIVE SCORE CARDS */}
                  <section className="metrics-quad-grid">
                    <div className="metric-tile">
                      <div className="metric-tile-header">
                        <span className="metric-label">Business Moat & Position</span>
                        <span className="metric-val text-blue">{computedScores.businessScore}%</span>
                      </div>
                      <div className="metric-track">
                        <div
                          className="metric-fill fill-blue"
                          style={{ width: `${computedScores.businessScore}%` }}
                        />
                      </div>
                      <span className="metric-caption">Market share defensibility & pricing leverage</span>
                    </div>

                    <div className="metric-tile">
                      <div className="metric-tile-header">
                        <span className="metric-label">Financial Solvency & Margins</span>
                        <span className="metric-val text-green">{computedScores.financialScore}%</span>
                      </div>
                      <div className="metric-track">
                        <div
                          className="metric-fill fill-green"
                          style={{ width: `${computedScores.financialScore}%` }}
                        />
                      </div>
                      <span className="metric-caption">Earnings quality, cash flow & debt coverage</span>
                    </div>

                    <div className="metric-tile">
                      <div className="metric-tile-header">
                        <span className="metric-label">Catalyst & Sentiment Index</span>
                        <span className="metric-val text-amber">{computedScores.newsScore}%</span>
                      </div>
                      <div className="metric-track">
                        <div
                          className="metric-fill fill-amber"
                          style={{ width: `${computedScores.newsScore}%` }}
                        />
                      </div>
                      <span className="metric-caption">Industry developments, product cycles & tone</span>
                    </div>

                    <div className="metric-tile">
                      <div className="metric-tile-header">
                        <span className="metric-label">Downside Risk Exposure</span>
                        <span className="metric-val text-rose">{computedScores.riskScore}%</span>
                      </div>
                      <div className="metric-track">
                        <div
                          className="metric-fill fill-rose"
                          style={{ width: `${computedScores.riskScore}%` }}
                        />
                      </div>
                      <span className="metric-caption">Regulatory exposure, macro volatility & threats</span>
                    </div>
                  </section>

                  {/* DETAILED RESEARCH TABS */}
                  <section className="coverage-tabs-deck">
                    <div className="tabs-header-bar">
                      {Object.entries(tabs).map(([key, tab]) => (
                        <button
                          type="button"
                          key={key}
                          className={`tab-selector-btn ${activeTab === key ? "active" : ""}`}
                          onClick={() => setActiveTab(key)}
                        >
                          {tab.icon}
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="tab-body-pane">
                      <div className="tab-pane-title-row">
                        <h3>{currentTab.title}</h3>
                        <span className="company-tag-pill">{result.company?.toUpperCase()}</span>
                      </div>

                      <div className="tab-pane-text">
                        <p>{currentTab.content || "No analysis available for this section."}</p>
                      </div>

                      <div className="compliance-disclaimer-box">
                        <Info size={15} />
                        <span>
                          <strong>Regulatory Notice:</strong> This research note is prepared by Apex
                          Equity Intelligence for institutional review. Cross-reference company 10-K,
                          10-Q, and statutory filings prior to investment execution.
                        </span>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>
          )}

          {/* COVERAGE ARCHIVE & WATCHLIST VIEW */}
          {(activeSidebar === "history" || activeSidebar === "saved") && (
            <div className="archive-deck">
              <div className="archive-header-row">
                <div>
                  <h2>{activeSidebar === "history" ? "Equity Coverage Archive" : "Target Watchlist"}</h2>
                  <p>
                    {activeSidebar === "history"
                      ? "Search and review institutional equity notes compiled across prior coverage cycles."
                      : "Direct access to your bookmarked target companies and active ratings."}
                  </p>
                </div>
                <div className="archive-counter-pill">
                  {displayList.length} {displayList.length === 1 ? "Company" : "Companies"}
                </div>
              </div>

              {displayList.length === 0 ? (
                <div className="archive-empty-box">
                  <div className="empty-state-icon">
                    <FileText size={32} />
                  </div>
                  <h3>No Reports in Archive</h3>
                  <p>
                    {activeSidebar === "history"
                      ? "You have not published any company coverage reports yet."
                      : "Your target watchlist is currently empty."}
                  </p>
                  <button
                    type="button"
                    className="start-coverage-btn"
                    onClick={() => setActiveSidebar("new")}
                  >
                    Start New Company Research
                  </button>
                </div>
              ) : (
                <div className="archive-grid">
                  {displayList.map((item) => (
                    <div
                      key={item._id}
                      className="archive-card"
                      onClick={() => {
                        setResult(item);
                        setActiveSidebar("new");
                        setActiveTab("research");
                      }}
                    >
                      <div className="archive-card-top">
                        <div className="archive-company-info">
                          <div className="archive-avatar">
                            {item.company?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="archive-title">{item.company}</h3>
                            <span className="archive-timestamp">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className={`archive-rating-badge ${item.decision?.toLowerCase()}`}>
                          {item.decision}
                        </div>
                      </div>

                      <p className="archive-reasoning-preview">
                        {item.reasoning
                          ? item.reasoning.substring(0, 115) + "..."
                          : "No executive reasoning recorded."}
                      </p>

                      <div className="archive-card-bottom">
                        <div className="archive-conviction-stat">
                          <span>{item.confidence}% Conviction Score</span>
                        </div>

                        <div className="archive-actions-row" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className={`archive-icon-btn ${item.saved ? "saved" : ""}`}
                            onClick={(e) => handleToggleSave(item._id, e)}
                            title={item.saved ? "Remove from Watchlist" : "Add to Watchlist"}
                          >
                            <Bookmark size={15} fill={item.saved ? "currentColor" : "none"} />
                          </button>

                          <button
                            type="button"
                            className="archive-icon-btn delete"
                            onClick={() => setDeleteConfirmId(item._id)}
                            title="Delete Report"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-alert-icon">
              <Trash2 size={22} />
            </div>
            <h3>Delete Coverage Report?</h3>
            <p>
              This report will be permanently removed from your firm's research archive and
              watchlist.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn-secondary"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-btn-danger"
                onClick={() => handleDeleteReport(deleteConfirmId)}
              >
                Delete Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* METHODOLOGY & COVERAGE MODAL */}
      {showMethodology && (
        <div className="modal-overlay" onClick={() => setShowMethodology(false)}>
          <div className="modal-dialog methodology-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-title-lockup">
                <BarChart3 size={19} color="#1d4ed8" />
                <h3>Equity Coverage & Valuation Framework</h3>
              </div>
              <button
                type="button"
                className="dialog-close-btn"
                onClick={() => setShowMethodology(false)}
              >
                ×
              </button>
            </div>

            <div className="methodology-content-body">
              <p>
                <strong>Apex Equity Research</strong> employs a disciplined fundamental equity
                framework designed to evaluate publicly traded corporations on business defensibility,
                capital efficiency, and risk-adjusted return potential.
              </p>

              <div className="framework-flow-steps">
                <div className="flow-step-box">1. Moat & Scope</div>
                <div className="flow-arrow">→</div>
                <div className="flow-step-box">2. Financials</div>
                <div className="flow-arrow">→</div>
                <div className="flow-step-box">3. Catalysts</div>
                <div className="flow-arrow">→</div>
                <div className="flow-step-box">4. Risk Matrix</div>
                <div className="flow-arrow">→</div>
                <div className="flow-step-box target">5. Target Rating</div>
              </div>

              <div className="framework-breakdown-list">
                <div className="framework-item">
                  <strong>1. Business Model & Competitive Advantage</strong>
                  <p>Evaluates pricing power, network effects, customer retention, and industry positioning.</p>
                </div>
                <div className="framework-item">
                  <strong>2. Financial Statement Analysis</strong>
                  <p>Assesses operating margins, ROIC, debt serviceability, free cash flow conversion, and balance sheet strength.</p>
                </div>
                <div className="framework-item">
                  <strong>3. Market Catalysts & Recent Events</strong>
                  <p>Synthesizes quarterly performance disclosures, executive commentary, and market sentiment vectors.</p>
                </div>
                <div className="framework-item">
                  <strong>4. Downside Risk & Scenario Stress-Testing</strong>
                  <p>Screens for regulatory scrutiny, supply chain bottlenecks, and competitive disruption.</p>
                </div>
                <div className="framework-item">
                  <strong>5. Conviction Scoring & Coverage Verdict</strong>
                  <p>Outputs an explicit BUY, HOLD, or UNDERWEIGHT rating with a quantified conviction percentage.</p>
                </div>
              </div>
            </div>

            <div className="modal-dialog-footer">
              <button
                type="button"
                className="modal-btn-secondary"
                onClick={() => setShowMethodology(false)}
              >
                Close Framework
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanySearch;
