import { useState } from "react";
import { createResearch } from "../services/api";
import "./CompanySearch.css";

function CompanySearch() {
  const [company, setCompany] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("research");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!company.trim()) {
      setError("Please enter a company name");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await createResearch(company);

      setResult(response.data);
      setActiveTab("research");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to research company"
      );
    } finally {
      setLoading(false);
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

  return (
    <div className="app-layout">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">↗</div>

          <div className="brand-copy">
            <strong>IR</strong>
            <span>Investment Research</span>
          </div>
        </div>

        <nav className="topnav">
          <button type="button">Reports</button>
          <button type="button">About</button>

          <div className="avatar">
            U
          </div>
        </nav>
      </header>

      <aside className="sidebar">
        <nav className="sidebar-nav">
          <button
            type="button"
            className="nav-item active"
          >
            <span>⌂</span>
            New Research
          </button>

          <button
            type="button"
            className="nav-item"
          >
            <span>◷</span>
            History
          </button>

          <button
            type="button"
            className="nav-item"
          >
            <span>▢</span>
            Saved Reports
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
      </main>
    </div>
  );
}

export default CompanySearch;