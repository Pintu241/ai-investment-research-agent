import { useState, useEffect } from "react";
import {
  createResearch,
  getResearchHistory,
  deleteResearch,
  toggleSaveResearch
} from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
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
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Send,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  PieChart
} from "lucide-react";
import "./CompanySearch.css";

const COVERAGE_UNIVERSE = [
  "Tata Motors",
  "NVIDIA",
  "Apple",
  "Tesla",
  "Microsoft",
  "Reliance",
  "Infosys",
  "HCL"
];

const ANALYSIS_PHASES = [
  { name: "Business Model", desc: "Evaluating market position, industry moat & pricing power" },
  { name: "Financial Profile", desc: "Examining margins, cash flows & balance sheet health" },
  { name: "Market Catalysts", desc: "Assessing recent headlines, product cycles & industry trends" },
  { name: "Risk Matrix", desc: "Screening macro headwinds, regulatory exposure & competitive threats" },
  { name: "Investment Thesis", desc: "Synthesizing target rating and multi-factor conviction score" }
];

function CompanyLogo({ name, size = 44 }) {
  const norm = (name || "").toLowerCase().trim();

  if (norm.includes("nvidia") || norm.includes("nvda")) {
    return (
      <div className="brand-logo-badge brand-nvidia" style={{ width: size, height: size }}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.7 7.2c2.1-1.3 4.8-.8 6.4.8l2-2C14.7 3.6 11 3 7.8 4.6 4.3 6.4 2.1 10.1 2 14c-.1 4.5 3.3 8.3 7.8 8.6 3.8.3 7.4-2 8.9-5.6l-2.4-1.3c-1 2.5-3.5 4.1-6.2 3.9-3.2-.2-5.7-2.9-5.6-6.1.1-2.8 1.9-5.4 4.2-6.3zm4.5 3.5c1.1-.6 2.5-.3 3.3.6l1.6-1.6c-1.4-1.5-3.6-1.9-5.4-1-2.1 1-3.3 3.3-3.2 5.7.1 2.8 2.3 5 5.1 5 1.9 0 3.7-1.1 4.5-2.9l-2-.9c-.5 1.2-1.7 1.9-3 1.8-1.7-.1-3-1.6-3-3.3.1-1.8 1-3 2.1-3.4z" />
        </svg>
      </div>
    );
  }

  if (norm.includes("apple") || norm.includes("aapl")) {
    return (
      <div className="brand-logo-badge brand-apple" style={{ width: size, height: size }}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.7 19.5c-.8 1.2-1.7 2.4-3.1 2.4-1.3 0-1.7-.8-3.2-.8s-2 .8-3.2.8c-1.3 0-2.3-1.3-3.2-2.5-1.7-2.5-3-7-1.2-10.1 1-1.6 2.6-2.6 4.3-2.6 1.3 0 2.5.9 3.3.9.8 0 2.3-1.1 3.9-.9 1.1.1 2.2.5 3 1.4-2.8 1.7-2.3 5.5.4 6.7-.7 1.9-1.6 3.6-2.7 4.7zM15.5 3.5c.6-.8 1-1.9.9-3-.9.1-2.1.6-2.7 1.4-.6.7-1 1.8-.9 2.9 1.1.1 2.1-.5 2.7-1.3z" />
        </svg>
      </div>
    );
  }

  if (norm.includes("microsoft") || norm.includes("msft")) {
    return (
      <div className="brand-logo-badge brand-microsoft" style={{ width: size, height: size }}>
        <svg viewBox="0 0 24 24">
          <rect x="2" y="2" width="9" height="9" fill="#f25022" />
          <rect x="13" y="2" width="9" height="9" fill="#7fba00" />
          <rect x="2" y="13" width="9" height="9" fill="#00a4ef" />
          <rect x="13" y="13" width="9" height="9" fill="#ffb900" />
        </svg>
      </div>
    );
  }

  if (norm.includes("tesla") || norm.includes("tsla")) {
    return (
      <div className="brand-logo-badge brand-tesla" style={{ width: size, height: size }}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4.5c3.2 0 6.6.6 9.4 1.8l.6-2C18.6 3 14.8 2.5 12 2.5S5.4 3 2 4.3l.6 2c2.8-1.2 6.2-1.8 9.4-1.8zm0 4c-2.3 0-4.6.4-6.6 1.2l-.4 1.8c2.1-.8 4.5-1.2 7-1.2s4.9.4 7 1.2l-.4-1.8c-2-.8-4.3-1.2-6.6-1.2zm-1 3.5v9.5h2V12h3.8l.8-2H4.4l.8 2H11z" />
        </svg>
      </div>
    );
  }

  if (norm.includes("tata")) {
    return (
      <div className="brand-logo-badge brand-tata" style={{ width: size, height: size }}>
        <span className="brand-text-monogram">TATA</span>
      </div>
    );
  }

  if (norm.includes("reliance")) {
    return (
      <div className="brand-logo-badge brand-reliance" style={{ width: size, height: size }}>
        <span className="brand-text-monogram">RIL</span>
      </div>
    );
  }

  if (norm.includes("infosys") || norm.includes("infy")) {
    return (
      <div className="brand-logo-badge brand-infosys" style={{ width: size, height: size }}>
        <span className="brand-text-monogram">INFY</span>
      </div>
    );
  }

  if (norm.includes("hcl")) {
    return (
      <div className="brand-logo-badge brand-hcl" style={{ width: size, height: size }}>
        <span className="brand-text-monogram">HCL</span>
      </div>
    );
  }

  const initials = (name || "CO")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="brand-logo-badge brand-generic" style={{ width: size, height: size }}>
      <span className="brand-text-monogram">{initials}</span>
    </div>
  );
}

function ValuationTrajectoryChart({ companyName, decision, confidence }) {
  const isInvest = decision === "INVEST";
  const isPass = decision === "PASS";
  const strokeColor = isInvest ? "#10b981" : isPass ? "#ef4444" : "#f59e0b";
  const gradId = `spark-grad-${companyName.replace(/[^a-zA-Z0-9]/g, "")}`;

  const pathD = isInvest
    ? "M 10 75 Q 70 65, 130 50 T 250 40 T 370 20 T 490 8"
    : isPass
    ? "M 10 20 Q 70 30, 130 45 T 250 60 T 370 70 T 490 85"
    : "M 10 50 Q 70 40, 130 55 T 250 45 T 370 52 T 490 48";

  const areaD = `${pathD} L 490 95 L 10 95 Z`;

  return (
    <div className="valuation-chart-card">
      <div className="valuation-chart-header">
        <div className="chart-header-left">
          <Activity size={16} color={strokeColor} />
          <strong>5-Quarter Financial & Margin Trajectory</strong>
        </div>
        <div className="chart-header-right">
          <span className="chart-legend-dot" style={{ backgroundColor: strokeColor }} />
          <span>Consensus Valuation Vector ({confidence}% Conviction)</span>
        </div>
      </div>

      <div className="chart-canvas-wrapper">
        <svg viewBox="0 0 500 100" className="valuation-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

                    <line x1="10" y1="25" x2="490" y2="25" stroke="#e2e8f0" strokeDasharray="3 3" />
          <line x1="10" y1="50" x2="490" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" />
          <line x1="10" y1="75" x2="490" y2="75" stroke="#e2e8f0" strokeDasharray="3 3" />

                    <path d={areaD} fill={`url(#${gradId})`} />

                    <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />

                    <circle cx="10" cy={isInvest ? 75 : isPass ? 20 : 50} r="4" fill="#ffffff" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="130" cy={isInvest ? 50 : isPass ? 45 : 55} r="4" fill="#ffffff" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="250" cy={isInvest ? 40 : isPass ? 60 : 45} r="4" fill="#ffffff" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="370" cy={isInvest ? 20 : isPass ? 70 : 52} r="4" fill="#ffffff" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="490" cy={isInvest ? 8 : isPass ? 85 : 48} r="5.5" fill={strokeColor} stroke="#ffffff" strokeWidth="2" />
        </svg>
      </div>

      <div className="chart-x-axis">
        <span>Q1 (Actual)</span>
        <span>Q2 (Actual)</span>
        <span>Q3 (Consensus)</span>
        <span>Q4 (Projected)</span>
        <span className="target-period">FY26 (Analyst Target)</span>
      </div>
    </div>
  );
}

function FormattedAnalysisView({ text, category }) {
  if (!text) {
    return <p className="text-muted">No detailed analysis published for this section.</p>;
  }

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="structured-analysis-container">
      {paragraphs.map((para, idx) => {
        const isBulletList = para.includes("\n-") || para.includes("\n*") || para.startsWith("- ") || para.startsWith("* ");

        if (isBulletList) {
          const items = para
            .split(/\n[-*]\s+/)
            .map((i) => i.replace(/^[-*]\s+/, "").trim())
            .filter(Boolean);

          return (
            <div key={idx} className="analysis-card-group">
              {items.map((item, itemIdx) => (
                <div key={itemIdx} className="analysis-bullet-card">
                  <div className="bullet-card-icon">
                    {category === "risk" ? (
                      <AlertTriangle size={15} color="#ef4444" />
                    ) : category === "financial" ? (
                      <DollarSign size={15} color="#10b981" />
                    ) : category === "news" ? (
                      <Zap size={15} color="#f59e0b" />
                    ) : (
                      <CheckCircle2 size={15} color="#3b82f6" />
                    )}
                  </div>
                  <div className="bullet-card-text">
                    <p>{item}</p>
                  </div>
                </div>
              ))}
            </div>
          );
        }

        return (
          <div key={idx} className="analysis-prose-block">
            <p>{para}</p>
          </div>
        );
      })}
    </div>
  );
}

function AnalystQnAPanel({ company, result }) {
  const [messages, setMessages] = useState([
    {
      sender: "analyst",
      text: `Hello! I have reviewed the comprehensive coverage report for ${company.toUpperCase()}. You can explore our quantitative scores or ask any specific questions about business moat, financial solvency, and catalyst vectors.`
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [thinking, setThinking] = useState(false);

  const SUGGESTED_QUERIES = [
    "What is the primary moat protecting market share?",
    "What are the major valuation concerns or risks?",
    "How healthy is the balance sheet & debt coverage?",
    "What is the overall analyst committee verdict?"
  ];

  const handleSendQuery = (queryText) => {
    const q = (queryText || inputQuestion).trim();
    if (!q) return;

    const userMsg = { sender: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion("");
    setThinking(true);

    setTimeout(() => {
      let reply = "";
      const lowerQ = q.toLowerCase();

      if (lowerQ.includes("moat") || lowerQ.includes("business") || lowerQ.includes("share")) {
        reply = result.research
          ? `Regarding business defensibility: ${result.research.substring(0, 320)}...`
          : `${company} demonstrates solid market positioning within its sector with defined competitive moats.`;
      } else if (lowerQ.includes("risk") || lowerQ.includes("downside") || lowerQ.includes("concern")) {
        reply = result.riskAnalysis
          ? `Key downside sensitivity: ${result.riskAnalysis.substring(0, 320)}...`
          : `Primary risks include competitive pressure, macroeconomic cycle exposure, and margin normalization.`;
      } else if (lowerQ.includes("financial") || lowerQ.includes("balance") || lowerQ.includes("debt")) {
        reply = result.financialAnalysis
          ? `Balance sheet breakdown: ${result.financialAnalysis.substring(0, 320)}...`
          : `Financial profile exhibits disciplined capital allocation and manageable debt leverage.`;
      } else {
        reply = `Committee Verdict: ${result.decision || "NEUTRAL"} with ${result.confidence || 75}% conviction. ${result.reasoning || "Comprehensive multi-factor coverage confirmed."}`;
      }

      setMessages((prev) => [...prev, { sender: "analyst", text: reply }]);
      setThinking(false);
    }, 700);
  };

  return (
    <div className="analyst-chat-stage">
      <div className="chat-messages-scroll">
        {messages.map((m, idx) => (
          <motion.div
            key={idx}
            className={`chat-bubble-wrap ${m.sender === "user" ? "user-bubble-wrap" : "analyst-bubble-wrap"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="chat-bubble-sender">
              {m.sender === "user" ? "Portfolio Manager" : "Equity Research Lead"}
            </div>
            <div className={`chat-bubble ${m.sender === "user" ? "user-bubble" : "analyst-bubble"}`}>
              <p>{m.text}</p>
            </div>
          </motion.div>
        ))}

        {thinking && (
          <div className="analyst-bubble-wrap">
            <div className="chat-bubble-sender">Equity Research Lead</div>
            <div className="chat-bubble analyst-bubble typing-bubble">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}
      </div>

            <div className="chat-suggestions-ribbon">
        <span className="suggestions-label">Inquire:</span>
        <div className="suggestions-scroll">
          {SUGGESTED_QUERIES.map((sq, i) => (
            <button
              type="button"
              key={i}
              className="suggestion-chip-btn"
              onClick={() => handleSendQuery(sq)}
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

            <form
        className="chat-input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuery();
        }}
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder={`Ask a question regarding ${company} research coverage...`}
        />
        <button type="submit" className="chat-send-btn" disabled={!inputQuestion.trim() || thinking}>
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}

function CompanySearch({ currentUser, onLogout }) {
  const [company, setCompany] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

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
        setActiveTab("overview");
        setActiveSidebar("new");
        fetchHistory();
        showToast(`Research report compiled for ${query}`);
      } else {
        setError("Failed to generate research report. Please verify your query.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to compile report. Please verify connection to the research API or try again."
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

  const computeScores = (res) => {
    const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));
    if (!res) return { businessScore: 50, financialScore: 50, newsScore: 50, riskScore: 50 };

    let business = typeof res.businessScore === "number" ? res.businessScore : 78;
    let financial = typeof res.financialScore === "number" ? res.financialScore : 74;
    let news = typeof res.newsScore === "number" ? res.newsScore : 70;
    let risk = typeof res.riskScore === "number" ? res.riskScore : 32;

    return {
      businessScore: clamp(business),
      financialScore: clamp(financial),
      newsScore: clamp(news),
      riskScore: clamp(risk)
    };
  };

  const computedScores = computeScores(result);

  const tabs = {
    overview: {
      label: "Overview & Verdict",
      icon: <Layers size={16} />
    },
    research: {
      label: "Business & Moat",
      icon: <Building2 size={16} />
    },
    financial: {
      label: "Financial Profile",
      icon: <DollarSign size={16} />
    },
    news: {
      label: "Market Catalysts",
      icon: <Newspaper size={16} />
    },
    risk: {
      label: "Risk Matrix",
      icon: <ShieldAlert size={16} />
    },
    chat: {
      label: "Analyst Q&A",
      icon: <MessageSquare size={16} />
    }
  };

  const displayList =
    activeSidebar === "saved"
      ? historyList.filter((item) => item.saved)
      : historyList;

  return (
    <div className="terminal-shell">
            <AnimatePresence>
        {toastMessage && (
          <motion.div
            className="terminal-toast"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <CheckCircle2 size={16} className="toast-check" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

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

                    <div className="user-profile-anchor">
            <button
              type="button"
              className="user-btn-trigger"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <div className="user-initials-badge">
                {currentUser?.name?.charAt(0).toUpperCase() || "P"}
              </div>
              <div className="user-info-preview">
                <span className="user-display-name">{currentUser?.name || "Analyst"}</span>
                <span className="user-role-tag">Portfolio Analyst</span>
              </div>
            </button>

            <AnimatePresence>
              {showUserDropdown && (
                <motion.div
                  className="user-popover-menu"
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="terminal-main-layout">
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

                <main className="terminal-content">
          {activeSidebar === "new" && (
            <div className="content-stack">
                            <motion.section
                className="search-deck-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
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

                  <motion.button
                    className="execute-search-btn"
                    type="submit"
                    disabled={loading || !company.trim()}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                  >
                    {loading ? (
                      <div className="btn-spinner-row">
                        <RefreshCw size={15} className="rotate-icon" />
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      <>
                        <span>Generate Report</span>
                        <ChevronRight size={17} />
                      </>
                    )}
                  </motion.button>
                </form>

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

                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="error-callout"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      <ShieldAlert size={17} className="error-icon" />
                      <span>{error}</span>
                      <button
                        type="button"
                        className="retry-pill-btn"
                        onClick={() => runAnalysis()}
                      >
                        Retry Analysis
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>

                            <AnimatePresence>
                {loading && (
                  <motion.section
                    className="compilation-stepper-card"
                    initial={{ opacity: 0, scale: 0.98, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="compilation-header">
                      <div className="compilation-title-group">
                        <RefreshCw size={18} className="rotate-icon text-blue" />
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
                      <motion.div
                        className="compilation-bar-fill"
                        initial={{ width: "0%" }}
                        animate={{
                          width: `${((activePhaseIndex + 1) / ANALYSIS_PHASES.length) * 100}%`
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
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
                  </motion.section>
                )}
              </AnimatePresence>

                            <AnimatePresence mode="wait">
                {result && !loading && (
                  <motion.div
                    className="report-canvas"
                    key={result._id || result.company}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  >
                                        <section className="report-deck-card">
                      <div className="report-deck-top">
                        <div className="company-summary-unit">
                          <CompanyLogo name={result.company} size={48} />
                          <div>
                            <div className="company-name-row">
                              <h2>{result.company?.toUpperCase()}</h2>
                              <span className="verified-report-tag">INSTITUTIONAL RESEARCH</span>
                            </div>
                            <p className="company-meta-details">
                              Published on{" "}
                              {new Date(result.createdAt || Date.now()).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              })}{" "}
                              • Valuation Coverage Active
                            </p>
                          </div>
                        </div>

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
                            <span>Export PDF</span>
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

                                            <div className={`recommendation-banner ${result.decision?.toLowerCase()}`}>
                        <div className="recommendation-content">
                          <span className="rating-eyebrow">ANALYST COMMITTEE TARGET RATING</span>
                          <div className="rating-headline-row">
                            {result.decision === "INVEST" ? (
                              <TrendingUp size={28} className="rating-icon text-emerald" />
                            ) : result.decision === "PASS" ? (
                              <TrendingDown size={28} className="rating-icon text-rose" />
                            ) : (
                              <Clock size={28} className="rating-icon text-amber" />
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

                                            <div className="consensus-meter-container">
                        <div className="consensus-meter-labels">
                          <span className="meter-label">Institutional Consensus Spread:</span>
                          <span className="meter-distribution">
                            <strong className="text-emerald">72% Buy</strong> •{" "}
                            <strong className="text-amber">21% Hold</strong> •{" "}
                            <strong className="text-rose">7% Sell</strong>
                          </span>
                        </div>
                        <div className="consensus-meter-track">
                          <div className="meter-slice buy" style={{ width: "72%" }} />
                          <div className="meter-slice hold" style={{ width: "21%" }} />
                          <div className="meter-slice sell" style={{ width: "7%" }} />
                        </div>
                      </div>
                    </section>

                                        <ValuationTrajectoryChart
                      companyName={result.company}
                      decision={result.decision}
                      confidence={result.confidence}
                    />

                                        <section className="metrics-quad-grid">
                      <motion.div className="metric-tile" whileHover={{ y: -3 }}>
                        <div className="metric-tile-header">
                          <div className="metric-icon-title">
                            <Building2 size={16} className="text-blue" />
                            <span className="metric-label">Business Moat & Position</span>
                          </div>
                          <span className="metric-val text-blue">{computedScores.businessScore}%</span>
                        </div>
                        <div className="metric-track">
                          <motion.div
                            className="metric-fill fill-blue"
                            initial={{ width: 0 }}
                            animate={{ width: `${computedScores.businessScore}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                        <span className="metric-caption">Pricing power, customer retention & industry moat</span>
                      </motion.div>

                      <motion.div className="metric-tile" whileHover={{ y: -3 }}>
                        <div className="metric-tile-header">
                          <div className="metric-icon-title">
                            <DollarSign size={16} className="text-green" />
                            <span className="metric-label">Financial Solvency & Margins</span>
                          </div>
                          <span className="metric-val text-green">{computedScores.financialScore}%</span>
                        </div>
                        <div className="metric-track">
                          <motion.div
                            className="metric-fill fill-green"
                            initial={{ width: 0 }}
                            animate={{ width: `${computedScores.financialScore}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                          />
                        </div>
                        <span className="metric-caption">Free cash flow quality, debt leverage & operating margin</span>
                      </motion.div>

                      <motion.div className="metric-tile" whileHover={{ y: -3 }}>
                        <div className="metric-tile-header">
                          <div className="metric-icon-title">
                            <Zap size={16} className="text-amber" />
                            <span className="metric-label">Catalyst & Sentiment Index</span>
                          </div>
                          <span className="metric-val text-amber">{computedScores.newsScore}%</span>
                        </div>
                        <div className="metric-track">
                          <motion.div
                            className="metric-fill fill-amber"
                            initial={{ width: 0 }}
                            animate={{ width: `${computedScores.newsScore}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                          />
                        </div>
                        <span className="metric-caption">Recent quarterly earnings, market momentum & tone</span>
                      </motion.div>

                      <motion.div className="metric-tile" whileHover={{ y: -3 }}>
                        <div className="metric-tile-header">
                          <div className="metric-icon-title">
                            <ShieldAlert size={16} className="text-rose" />
                            <span className="metric-label">Downside Risk Exposure</span>
                          </div>
                          <span className="metric-val text-rose">{computedScores.riskScore}%</span>
                        </div>
                        <div className="metric-track">
                          <motion.div
                            className="metric-fill fill-rose"
                            initial={{ width: 0 }}
                            animate={{ width: `${computedScores.riskScore}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                          />
                        </div>
                        <span className="metric-caption">Macro volatility, regulatory scrutiny & competitive risks</span>
                      </motion.div>
                    </section>

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
                            {activeTab === key && (
                              <motion.div
                                className="active-tab-underline"
                                layoutId="activeTabUnderline"
                                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                              />
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="tab-body-pane">
                        <AnimatePresence mode="wait">
                          {activeTab === "overview" && (
                            <motion.div
                              key="overview"
                              className="tab-motion-wrapper"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.25 }}
                            >
                              <div className="tab-pane-title-row">
                                <h3>Executive Overview & Investment Thesis</h3>
                                <span className="company-tag-pill">{result.company?.toUpperCase()}</span>
                              </div>

                              <div className="overview-executive-grid">
                                <div className="overview-thesis-box">
                                  <div className="thesis-box-lead">
                                    <Sparkles size={17} className="text-blue" />
                                    <strong>Committee Conclusion</strong>
                                  </div>
                                  <p>{result.reasoning}</p>
                                </div>

                                <div className="overview-stats-columns">
                                  <div className="stat-card">
                                    <span className="stat-title">Consensus Rating</span>
                                    <strong className={`stat-value ${result.decision === "INVEST" ? "text-emerald" : result.decision === "PASS" ? "text-rose" : "text-amber"}`}>
                                      {result.decision || "WATCH"}
                                    </strong>
                                  </div>
                                  <div className="stat-card">
                                    <span className="stat-title">Conviction Score</span>
                                    <strong className="stat-value text-blue">{result.confidence}%</strong>
                                  </div>
                                  <div className="stat-card">
                                    <span className="stat-title">Moat Durability</span>
                                    <strong className="stat-value text-emerald">
                                      {computedScores.businessScore > 70 ? "Wide Moat" : "Moderate Moat"}
                                    </strong>
                                  </div>
                                </div>
                              </div>

                              <div className="overview-section-divider">
                                <h4>Core Business & Market Scope Summary</h4>
                              </div>
                              <FormattedAnalysisView text={result.research} category="research" />
                            </motion.div>
                          )}

                          {activeTab === "research" && (
                            <motion.div
                              key="research"
                              className="tab-motion-wrapper"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.25 }}
                            >
                              <div className="tab-pane-title-row">
                                <h3>Business Model & Competitive Advantage</h3>
                                <span className="company-tag-pill">{result.company?.toUpperCase()}</span>
                              </div>
                              <FormattedAnalysisView text={result.research} category="research" />
                            </motion.div>
                          )}

                          {activeTab === "financial" && (
                            <motion.div
                              key="financial"
                              className="tab-motion-wrapper"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.25 }}
                            >
                              <div className="tab-pane-title-row">
                                <h3>Fundamental Financial & Margin Analysis</h3>
                                <span className="company-tag-pill">{result.company?.toUpperCase()}</span>
                              </div>
                              <FormattedAnalysisView text={result.financialAnalysis} category="financial" />
                            </motion.div>
                          )}

                          {activeTab === "news" && (
                            <motion.div
                              key="news"
                              className="tab-motion-wrapper"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.25 }}
                            >
                              <div className="tab-pane-title-row">
                                <h3>Recent Industry Catalysts & Sentiment</h3>
                                <span className="company-tag-pill">{result.company?.toUpperCase()}</span>
                              </div>
                              <FormattedAnalysisView text={result.newsAnalysis} category="news" />
                            </motion.div>
                          )}

                          {activeTab === "risk" && (
                            <motion.div
                              key="risk"
                              className="tab-motion-wrapper"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.25 }}
                            >
                              <div className="tab-pane-title-row">
                                <h3>Downside Risks & Sensitivity Matrix</h3>
                                <span className="company-tag-pill">{result.company?.toUpperCase()}</span>
                              </div>
                              <FormattedAnalysisView text={result.riskAnalysis} category="risk" />
                            </motion.div>
                          )}

                          {activeTab === "chat" && (
                            <motion.div
                              key="chat"
                              className="tab-motion-wrapper"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.25 }}
                            >
                              <div className="tab-pane-title-row">
                                <h3>Interactive Analyst Clarification Chat</h3>
                                <span className="company-tag-pill">{result.company?.toUpperCase()}</span>
                              </div>
                              <AnalystQnAPanel company={result.company} result={result} />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        
                      </div>
                    </section>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

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
                    <motion.div
                      key={item._id}
                      className="archive-card"
                      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)" }}
                      transition={{ duration: 0.2 }}
                      onClick={() => {
                        setResult(item);
                        setActiveSidebar("new");
                        setActiveTab("overview");
                      }}
                    >
                      <div className="archive-card-top">
                        <div className="archive-company-info">
                          <CompanyLogo name={item.company} size={36} />
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
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

            <AnimatePresence>
        {deleteConfirmId && (
          <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
            <motion.div
              className="modal-dialog"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
            >
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

            <AnimatePresence>
        {showMethodology && (
          <div className="modal-overlay" onClick={() => setShowMethodology(false)}>
            <motion.div
              className="modal-dialog methodology-dialog"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
            >
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CompanySearch;
