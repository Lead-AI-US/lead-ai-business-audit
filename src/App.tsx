import {
  BarChart3,
  Bot,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Database,
  Download,
  FileText,
  Info,
  LayoutDashboard,
  Loader2,
  Mail,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  automationNeedOptions,
  bookingOptions,
  budgetOptions,
  calculateAudit,
  coverageOptions,
  defaultIntake,
  getScoreBand,
  priorityOptions,
  responseOptions,
  scoringNotes,
  trackingOptions,
} from "./auditModel";
import {
  createAuditReport,
  getAuditReport,
  isFirestoreConfigured,
  listAuditReports,
  saveAuditReport,
  updateAuditReportStatus,
} from "./auditStorage";
import type {
  AuditReport,
  AuditStatus,
  Booking,
  Coverage,
  Intake,
  Priority,
  ResponseTime,
  Tracking,
} from "./types";

const statusOptions: AuditStatus[] = [
  "new",
  "reviewed",
  "contacted",
  "proposal_sent",
  "converted",
  "not_ready",
  "closed",
];

function parseRoute(pathname: string) {
  if (pathname.startsWith("/report/")) {
    return { type: "report" as const, reportId: pathname.replace("/report/", "") };
  }

  if (pathname === "/admin/audits") {
    return { type: "admin" as const, reportId: "" };
  }

  return { type: "home" as const, reportId: "" };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function normalizeWebsite(value: string) {
  if (!value.trim()) {
    return "";
  }

  return /^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`;
}

function validateIntake(input: Intake) {
  const errors: Partial<Record<keyof Intake, string>> = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[+()\-\s0-9]{7,}$/;

  if (!input.ownerName.trim()) errors.ownerName = "Owner name is required.";
  if (!emailPattern.test(input.ownerEmail.trim())) errors.ownerEmail = "Enter a valid business email.";
  if (!phonePattern.test(input.ownerPhone.trim())) errors.ownerPhone = "Enter a valid phone number.";
  if (!input.businessName.trim()) errors.businessName = "Business name is required.";
  if (!input.businessType.trim()) errors.businessType = "Business type is required.";
  if (!input.majorProblem.trim()) errors.majorProblem = "Describe the main business problem.";
  if (!input.monthlyBudget.trim()) errors.monthlyBudget = "Select a monthly budget range.";
  if (input.automationNeeds.length === 0) errors.automationNeeds = "Select at least one automation need.";

  try {
    new URL(normalizeWebsite(input.businessWebsite));
  } catch {
    errors.businessWebsite = "Enter a valid website URL.";
  }

  return errors;
}

function ScoreCard({
  label,
  score,
  icon: Icon,
}: {
  label: string;
  score: number;
  icon: LucideIcon;
}) {
  const band = getScoreBand(score);

  return (
    <section className="score-card" aria-label={`${label} score`}>
      <div className="score-card__top">
        <Icon aria-hidden="true" size={18} />
        <span>{label}</span>
      </div>
      <div className="score-card__value">{score}</div>
      <span className={`score-band score-band--${band.tone}`}>{band.label}</span>
      <div className="meter" aria-hidden="true">
        <span style={{ width: `${score}%` }} />
      </div>
    </section>
  );
}

function ReportSummary({ report, showPrivate }: { report: AuditReport; showPrivate?: boolean }) {
  const result = report.auditResult;
  const overallBand = getScoreBand(result.overall);

  return (
    <section className="report-panel" aria-label="Automation audit report">
      <div className="report-hero">
        <div>
          <p className="eyebrow">{report.business.type || "Business audit"}</p>
          <h2>{report.business.name || "Business"} audit report</h2>
          <p>{result.summary}</p>
          <dl className="report-meta">
            <div>
              <dt>Report ID</dt>
              <dd>{report.reportId}</dd>
            </div>
            <div>
              <dt>Date generated</dt>
              <dd>{formatDate(report.createdAt)}</dd>
            </div>
            <div>
              <dt>Recommended package</dt>
              <dd>{result.packageName}</dd>
            </div>
          </dl>
        </div>
        <div className="overall-score">
          <span>{result.overall}</span>
          <small>overall score</small>
          <em>{overallBand.label}</em>
        </div>
      </div>

      {showPrivate && (
        <section className="private-details">
          <div>
            <strong>{report.owner.name}</strong>
            <span>{report.owner.email}</span>
            <span>{report.owner.phone}</span>
          </div>
          <div>
            <strong>{report.business.website}</strong>
            <span>{report.business.location || "Location not provided"}</span>
            <span>Status: {report.status.replaceAll("_", " ")}</span>
          </div>
        </section>
      )}

      <section className="score-explainer">
        <div className="section-heading">
          <Info aria-hidden="true" size={20} />
          <div>
            <h3>Scoring model transparency</h3>
            <p>This MVP uses deterministic business rules, not AI-generated scoring.</p>
          </div>
        </div>
        <div className="band-grid" aria-label="Score bands">
          <span>0-39 High Risk</span>
          <span>40-59 Needs Improvement</span>
          <span>60-79 Good Opportunity</span>
          <span>80-100 Strong Fit</span>
        </div>
        <ul className="compact-list">
          {scoringNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <div className="score-grid">
        <ScoreCard label="Automation readiness" score={result.automationReadiness} icon={Bot} />
        <ScoreCard label="Lead response" score={result.leadResponse} icon={MessageSquareText} />
        <ScoreCard label="Customer intelligence" score={result.customerIntelligence} icon={BarChart3} />
        <ScoreCard label="Workflow risk" score={result.workflowRisk} icon={ShieldCheck} />
      </div>

      <section className="recommendation">
        <div className="section-heading">
          <CheckCircle2 aria-hidden="true" size={20} />
          <div>
            <h3>Recommended package</h3>
            <p>{result.packageName}</p>
          </div>
        </div>
        <a className="primary-button" href="mailto:arun_w@proton.me?subject=Lead.AI%20Proposal%20Request">
          <Mail aria-hidden="true" size={18} />
          <span>Request proposal</span>
        </a>
      </section>

      <section className="priority-panel">
        <div className="section-heading">
          <Target aria-hidden="true" size={20} />
          <div>
            <h3>Top 3 automation priorities</h3>
            <p>Use these as the first implementation scope.</p>
          </div>
        </div>
        <ol>
          {result.topPriorities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <div className="insight-grid">
        <section>
          <h3>Strengths</h3>
          <ul>
            {result.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Workflow gaps</h3>
          <ul>
            {result.gaps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="roadmap">
        <div className="section-heading">
          <CalendarClock aria-hidden="true" size={20} />
          <div>
            <h3>30-day roadmap</h3>
            <p>Practical steps for a first automation pilot.</p>
          </div>
        </div>
        <div className="timeline">
          {result.roadmap.map((phase) => (
            <article key={phase.week}>
              <span>{phase.week}</span>
              <h4>{phase.title}</h4>
              <ul>
                {phase.actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="implementation-notes">
        <div className="section-heading">
          <ShieldCheck aria-hidden="true" size={20} />
          <div>
            <h3>Implementation notes</h3>
            <p>Responsible AI and client delivery guidance.</p>
          </div>
        </div>
        <ul>
          {result.implementationNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </section>
  );
}

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [intake, setIntake] = useState<Intake>(defaultIntake);
  const [errors, setErrors] = useState<Partial<Record<keyof Intake, string>>>({});
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [report, setReport] = useState<AuditReport | null>(null);
  const [reports, setReports] = useState<AuditReport[]>([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminFilters, setAdminFilters] = useState({
    search: "",
    status: "all",
    businessType: "",
    budget: "all",
    minimumScore: "",
  });

  const route = useMemo(() => parseRoute(path), [path]);
  const result = useMemo(() => calculateAudit(intake), [intake]);
  const previewReport = useMemo(() => createAuditReport(intake, "/free-ai-audit"), [intake]);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (route.type !== "report") {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingReport(true);
    getAuditReport(route.reportId)
      .then(setReport)
      .finally(() => setLoadingReport(false));
  }, [route]);

  useEffect(() => {
    if (route.type !== "admin") {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAdminLoading(true);
    listAuditReports()
      .then(setReports)
      .finally(() => setAdminLoading(false));
  }, [route]);

  const navigate = (nextPath: string) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const update = <K extends keyof Intake>(key: K, value: Intake[K]) => {
    setIntake((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const toggleAutomationNeed = (need: string) => {
    setIntake((current) => ({
      ...current,
      automationNeeds: current.automationNeeds.includes(need)
        ? current.automationNeeds.filter((item) => item !== need)
        : [...current.automationNeeds, need],
    }));
    setErrors((current) => ({ ...current, automationNeeds: undefined }));
  };

  const exportReport = () => {
    window.print();
  };

  const submitAudit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateIntake(intake);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSaveState("error");
      setSaveMessage("Please fix the highlighted fields before saving the report.");
      return;
    }

    const normalizedInput = {
      ...intake,
      businessWebsite: normalizeWebsite(intake.businessWebsite),
    };
    const nextReport = createAuditReport(normalizedInput, "/free-ai-audit");

    try {
      setSaveState("saving");
      const saved = await saveAuditReport(nextReport);
      setReport(saved.report);
      setSaveState("saved");
      setSaveMessage(
        saved.mode === "firestore"
          ? `Report ${saved.report.reportId} saved to Firestore.`
          : `Report ${saved.report.reportId} saved locally. Add Firebase env vars for Firestore.`
      );
      navigate(`/report/${saved.report.reportId}`);
    } catch (error) {
      console.error(error);
      setSaveState("error");
      setSaveMessage("The report could not be saved. Check Firebase configuration or browser storage.");
    }
  };

  const updateStatus = async (reportId: string, status: AuditStatus) => {
    await updateAuditReportStatus(reportId, status);
    setReports((current) =>
      current.map((item) => (item.reportId === reportId ? { ...item, status } : item))
    );
  };

  const filteredReports = reports.filter((item) => {
    const search = adminFilters.search.toLowerCase().trim();
    const matchesSearch =
      !search ||
      item.reportId.toLowerCase().includes(search) ||
      item.owner.name.toLowerCase().includes(search) ||
      item.owner.email.toLowerCase().includes(search) ||
      item.business.name.toLowerCase().includes(search);
    const matchesStatus = adminFilters.status === "all" || item.status === adminFilters.status;
    const matchesBusinessType =
      !adminFilters.businessType ||
      item.business.type.toLowerCase().includes(adminFilters.businessType.toLowerCase());
    const matchesBudget =
      adminFilters.budget === "all" || item.auditInput.monthlyBudget === adminFilters.budget;
    const matchesScore =
      !adminFilters.minimumScore ||
      item.auditResult.overall >= Number(adminFilters.minimumScore);

    return matchesSearch && matchesStatus && matchesBusinessType && matchesBudget && matchesScore;
  });

  const renderTopbar = () => (
    <nav className="topbar" aria-label="Lead.AI Business Audit">
      <button className="brand-mark brand-mark--button" type="button" onClick={() => navigate("/")}>
        <Sparkles aria-hidden="true" size={18} />
        <span>Lead.AI Business Audit</span>
      </button>
      <div className="topbar__actions">
        <span className="status-pill">v0.2 intake system</span>
        <span className="status-pill">{isFirestoreConfigured ? "Firestore ready" : "Local demo storage"}</span>
        <button className="icon-button" type="button" onClick={() => navigate("/admin/audits")}>
          <LayoutDashboard aria-hidden="true" size={18} />
          <span>Admin</span>
        </button>
        <button className="icon-button" type="button" onClick={exportReport} title="Print or save report">
          <Download aria-hidden="true" size={18} />
          <span>Export</span>
        </button>
      </div>
    </nav>
  );

  if (route.type === "report") {
    return (
      <main className="app-shell">
        <header className="hero hero--compact">{renderTopbar()}</header>
        {loadingReport ? (
          <section className="empty-state">
            <Loader2 className="spin" aria-hidden="true" size={22} />
            <h1>Loading report...</h1>
          </section>
        ) : report ? (
          <>
            <ReportSummary report={report} />
            <section className="final-cta">
              <div>
                <h3>Need implementation help?</h3>
                <p>Use this report as the starting point for a Lead.AI proposal or consultation.</p>
              </div>
              <div className="button-row">
                <button className="icon-button" type="button" onClick={exportReport}>
                  <FileText aria-hidden="true" size={18} />
                  <span>Export PDF</span>
                </button>
                <a className="primary-button" href="mailto:arun_w@proton.me?subject=Lead.AI%20Audit%20Proposal">
                  <CalendarClock aria-hidden="true" size={18} />
                  <span>Book consultation</span>
                </a>
              </div>
            </section>
          </>
        ) : (
          <section className="empty-state">
            <h1>Report not found</h1>
            <p>The report may be stored in another browser or Firestore project.</p>
            <button className="primary-button" type="button" onClick={() => navigate("/")}>
              Start a new audit
            </button>
          </section>
        )}
      </main>
    );
  }

  if (route.type === "admin") {
    return (
      <main className="app-shell">
        <header className="hero hero--compact">{renderTopbar()}</header>
        <section className="admin-shell">
          <div className="section-heading admin-heading">
            <Database aria-hidden="true" size={22} />
            <div>
              <h1>Submitted audits</h1>
              <p>
                Demo admin workflow for v0.2. Protect this route with authentication and
                Firestore rules before production use.
              </p>
            </div>
          </div>

          <div className="admin-filters">
            <label>
              Search
              <span className="input-with-icon">
                <Search aria-hidden="true" size={16} />
                <input
                  value={adminFilters.search}
                  onChange={(event) =>
                    setAdminFilters((current) => ({ ...current, search: event.target.value }))
                  }
                  placeholder="Name, email, business, report ID"
                />
              </span>
            </label>
            <label>
              Status
              <select
                value={adminFilters.status}
                onChange={(event) =>
                  setAdminFilters((current) => ({ ...current, status: event.target.value }))
                }
              >
                <option value="all">All statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Business type
              <input
                value={adminFilters.businessType}
                onChange={(event) =>
                  setAdminFilters((current) => ({ ...current, businessType: event.target.value }))
                }
                placeholder="Local service, retail..."
              />
            </label>
            <label>
              Budget
              <select
                value={adminFilters.budget}
                onChange={(event) =>
                  setAdminFilters((current) => ({ ...current, budget: event.target.value }))
                }
              >
                <option value="all">All budgets</option>
                {budgetOptions.map((budget) => (
                  <option key={budget} value={budget}>
                    {budget}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Minimum score
              <input
                min="0"
                max="100"
                type="number"
                value={adminFilters.minimumScore}
                onChange={(event) =>
                  setAdminFilters((current) => ({ ...current, minimumScore: event.target.value }))
                }
                placeholder="60"
              />
            </label>
          </div>

          {adminLoading ? (
            <div className="empty-state">
              <Loader2 className="spin" aria-hidden="true" size={22} />
              <h2>Loading audits...</h2>
            </div>
          ) : (
            <div className="audit-table">
              {filteredReports.map((item) => (
                <article key={item.reportId} className="audit-row">
                  <div>
                    <strong>{item.business.name}</strong>
                    <span>{item.owner.name} - {item.owner.email}</span>
                    <span>{item.reportId} - {formatDate(item.createdAt)}</span>
                  </div>
                  <div>
                    <strong>{item.auditResult.overall}</strong>
                    <span>{item.auditResult.packageName}</span>
                    <span>{item.auditInput.monthlyBudget}</span>
                  </div>
                  <select
                    value={item.status}
                    onChange={(event) => updateStatus(item.reportId, event.target.value as AuditStatus)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                  <button className="icon-button" type="button" onClick={() => navigate(`/report/${item.reportId}`)}>
                    View report
                  </button>
                </article>
              ))}
              {filteredReports.length === 0 && (
                <div className="empty-state">
                  <h2>No audits found</h2>
                  <p>Submit an audit first, then return to this admin view.</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="hero">
        {renderTopbar()}

        <section className="hero__content">
          <div>
            <p className="eyebrow">Client lead magnet for small business automation</p>
            <h1>Generate and save a Lead.AI automation audit.</h1>
            <p>
              Capture owner details, score lead response and workflow gaps, store the
              report, then use the admin dashboard to follow up like a simple CRM.
            </p>
            <div className="hero__actions">
              <a className="primary-button" href="#business-intake">
                <ClipboardList aria-hidden="true" size={18} />
                <span>Generate My AI Automation Audit</span>
              </a>
              <button className="icon-button icon-button--light" type="button" onClick={() => navigate("/admin/audits")}>
                <LayoutDashboard aria-hidden="true" size={18} />
                <span>Open Admin</span>
              </button>
            </div>
          </div>
          <aside className="hero-card" aria-label="Audit model summary">
            <span>{result.overall}</span>
            <strong>Live readiness score</strong>
            <p>Firestore-ready v0.2 intake with local demo storage fallback.</p>
          </aside>
        </section>
      </header>

      <section className="workspace">
        <form className="intake-panel" id="business-intake" aria-label="Business audit intake" onSubmit={submitAudit}>
          <div className="section-heading">
            <ClipboardList aria-hidden="true" size={20} />
            <div>
              <h2>Business Intake</h2>
              <p>Capture the lead, score the report, and save the submission.</p>
            </div>
          </div>

          <div className="field-grid">
            <label>
              Owner name
              <input value={intake.ownerName} onChange={(event) => update("ownerName", event.target.value)} />
              {errors.ownerName && <small>{errors.ownerName}</small>}
            </label>
            <label>
              Business email
              <input type="email" value={intake.ownerEmail} onChange={(event) => update("ownerEmail", event.target.value)} />
              {errors.ownerEmail && <small>{errors.ownerEmail}</small>}
            </label>
            <label>
              Phone number
              <input type="tel" value={intake.ownerPhone} onChange={(event) => update("ownerPhone", event.target.value)} />
              {errors.ownerPhone && <small>{errors.ownerPhone}</small>}
            </label>
            <label>
              Business name
              <input value={intake.businessName} onChange={(event) => update("businessName", event.target.value)} />
              {errors.businessName && <small>{errors.businessName}</small>}
            </label>
            <label>
              Website URL
              <input value={intake.businessWebsite} onChange={(event) => update("businessWebsite", event.target.value)} />
              {errors.businessWebsite && <small>{errors.businessWebsite}</small>}
            </label>
            <label>
              Business type
              <input value={intake.businessType} onChange={(event) => update("businessType", event.target.value)} />
              {errors.businessType && <small>{errors.businessType}</small>}
            </label>
          </div>

          <label>
            Business location
            <input value={intake.businessLocation} onChange={(event) => update("businessLocation", event.target.value)} placeholder="City, state, or service area" />
          </label>

          <label>
            Main problem
            <textarea
              value={intake.majorProblem}
              onChange={(event) => update("majorProblem", event.target.value)}
              rows={3}
              placeholder="Example: leads are not followed up quickly enough"
            />
            {errors.majorProblem && <small>{errors.majorProblem}</small>}
          </label>

          <fieldset>
            <legend>Automation needs</legend>
            <div className="chip-grid">
              {automationNeedOptions.map((need) => (
                <button
                  className={intake.automationNeeds.includes(need) ? "is-active" : ""}
                  key={need}
                  type="button"
                  onClick={() => toggleAutomationNeed(need)}
                >
                  {need}
                </button>
              ))}
            </div>
            {errors.automationNeeds && <small>{errors.automationNeeds}</small>}
          </fieldset>

          <label>
            Monthly budget
            <select value={intake.monthlyBudget} onChange={(event) => update("monthlyBudget", event.target.value)}>
              {budgetOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.monthlyBudget && <small>{errors.monthlyBudget}</small>}
          </label>

          <div className="field-grid">
            <label>
              Monthly inbound leads
              <input min="0" max="1000" type="number" value={intake.monthlyLeads} onChange={(event) => update("monthlyLeads", Number(event.target.value))} />
            </label>
            <label>
              Repeated questions per month
              <input min="0" max="500" type="number" value={intake.repeatQuestions} onChange={(event) => update("repeatQuestions", Number(event.target.value))} />
            </label>
            <label>
              Response speed
              <select value={intake.responseTime} onChange={(event) => update("responseTime", event.target.value as ResponseTime)}>
                {responseOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label>
              Support coverage
              <select value={intake.supportCoverage} onChange={(event) => update("supportCoverage", event.target.value as Coverage)}>
                {coverageOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label>
              Booking process
              <select value={intake.bookingProcess} onChange={(event) => update("bookingProcess", event.target.value as Booking)}>
                {bookingOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label>
              Lead tracking
              <select value={intake.leadTracking} onChange={(event) => update("leadTracking", event.target.value as Tracking)}>
                {trackingOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Current tools
            <textarea
              value={intake.currentTools}
              onChange={(event) => update("currentTools", event.target.value)}
              rows={3}
              placeholder="Website form, inbox, CRM, calendar..."
            />
          </label>

          <fieldset>
            <legend>Priority automation area</legend>
            <div className="segmented">
              {priorityOptions.map((option) => (
                <button
                  className={intake.priorityArea === option.value ? "is-active" : ""}
                  key={option.value}
                  type="button"
                  onClick={() => update("priorityArea", option.value as Priority)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          {saveMessage && <p className={`form-message form-message--${saveState}`}>{saveMessage}</p>}

          <button className="primary-button form-submit" type="submit" disabled={saveState === "saving"}>
            {saveState === "saving" ? <Loader2 className="spin" aria-hidden="true" size={18} /> : <Database aria-hidden="true" size={18} />}
            <span>{saveState === "saving" ? "Saving report..." : "Save Audit Report"}</span>
          </button>
        </form>

        <ReportSummary report={previewReport} showPrivate />
      </section>
    </main>
  );
}

export { App };
