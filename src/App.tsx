import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Download,
  Gauge,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

type ResponseTime = "instant" | "same-day" | "next-day" | "slow";
type Coverage = "business-hours" | "extended" | "manual" | "none";
type Booking = "automated" | "calendar-link" | "manual" | "not-applicable";
type Tracking = "crm" | "spreadsheet" | "inbox" | "none";
type Priority =
  | "lead-response"
  | "customer-support"
  | "booking"
  | "lead-scoring"
  | "analytics";

type Intake = {
  businessName: string;
  businessType: string;
  monthlyLeads: number;
  responseTime: ResponseTime;
  supportCoverage: Coverage;
  repeatQuestions: number;
  bookingProcess: Booking;
  leadTracking: Tracking;
  currentTools: string;
  priorityArea: Priority;
};

type AuditResult = {
  automationReadiness: number;
  leadResponse: number;
  workflowRisk: number;
  customerIntelligence: number;
  overall: number;
  packageName: string;
  summary: string;
  strengths: string[];
  gaps: string[];
  roadmap: Array<{
    week: string;
    title: string;
    actions: string[];
  }>;
};

const defaultIntake: Intake = {
  businessName: "BrightPath Dental Studio",
  businessType: "Local service business",
  monthlyLeads: 85,
  responseTime: "same-day",
  supportCoverage: "business-hours",
  repeatQuestions: 45,
  bookingProcess: "manual",
  leadTracking: "spreadsheet",
  currentTools: "Website form, shared inbox, Google Calendar",
  priorityArea: "lead-response",
};

const responseOptions: Array<{ value: ResponseTime; label: string }> = [
  { value: "instant", label: "Under 5 minutes" },
  { value: "same-day", label: "Same business day" },
  { value: "next-day", label: "Next day" },
  { value: "slow", label: "2+ days or inconsistent" },
];

const coverageOptions: Array<{ value: Coverage; label: string }> = [
  { value: "extended", label: "Extended or near 24/7" },
  { value: "business-hours", label: "Business hours" },
  { value: "manual", label: "Manual when available" },
  { value: "none", label: "No reliable coverage" },
];

const bookingOptions: Array<{ value: Booking; label: string }> = [
  { value: "automated", label: "Automated booking" },
  { value: "calendar-link", label: "Calendar link" },
  { value: "manual", label: "Manual scheduling" },
  { value: "not-applicable", label: "Not appointment-based" },
];

const trackingOptions: Array<{ value: Tracking; label: string }> = [
  { value: "crm", label: "CRM" },
  { value: "spreadsheet", label: "Spreadsheet" },
  { value: "inbox", label: "Inbox/messages" },
  { value: "none", label: "No system" },
];

const priorityOptions: Array<{ value: Priority; label: string }> = [
  { value: "lead-response", label: "Lead response" },
  { value: "customer-support", label: "Customer support" },
  { value: "booking", label: "Appointment booking" },
  { value: "lead-scoring", label: "Lead scoring" },
  { value: "analytics", label: "Customer intelligence" },
];

function clamp(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateAudit(input: Intake): AuditResult {
  const responseMap: Record<ResponseTime, number> = {
    instant: 94,
    "same-day": 72,
    "next-day": 48,
    slow: 26,
  };
  const coverageMap: Record<Coverage, number> = {
    extended: 92,
    "business-hours": 70,
    manual: 42,
    none: 18,
  };
  const bookingMap: Record<Booking, number> = {
    automated: 92,
    "calendar-link": 74,
    manual: 38,
    "not-applicable": 70,
  };
  const trackingMap: Record<Tracking, number> = {
    crm: 90,
    spreadsheet: 62,
    inbox: 38,
    none: 18,
  };

  const leadVolumeScore = input.monthlyLeads >= 100 ? 92 : input.monthlyLeads >= 40 ? 78 : 58;
  const repeatedQuestionOpportunity = clamp(input.repeatQuestions * 1.7);
  const toolMaturity = input.currentTools.trim().length > 20 ? 74 : 48;

  const leadResponse = clamp(responseMap[input.responseTime] * 0.62 + coverageMap[input.supportCoverage] * 0.38);
  const automationReadiness = clamp(
    toolMaturity * 0.22 +
      bookingMap[input.bookingProcess] * 0.24 +
      trackingMap[input.leadTracking] * 0.24 +
      leadVolumeScore * 0.3
  );
  const customerIntelligence = clamp(trackingMap[input.leadTracking] * 0.58 + toolMaturity * 0.22 + leadVolumeScore * 0.2);
  const workflowRisk = clamp(100 - (leadResponse * 0.45 + bookingMap[input.bookingProcess] * 0.25 + trackingMap[input.leadTracking] * 0.3));
  const overall = clamp(
    automationReadiness * 0.32 +
      leadResponse * 0.3 +
      customerIntelligence * 0.22 +
      repeatedQuestionOpportunity * 0.16
  );

  const packageName =
    input.priorityArea === "booking"
      ? "Appointment Automation Starter"
      : input.priorityArea === "lead-scoring"
        ? "Lead Qualification Intelligence"
        : input.priorityArea === "customer-support"
          ? "AI Support Assistant"
          : input.priorityArea === "analytics"
            ? "Customer Intelligence Dashboard"
            : "Lead Response Automation Starter";

  const strengths = [
    leadVolumeScore >= 75 ? "Strong lead volume makes automation impact measurable." : "Focused lead volume is suitable for a lightweight pilot.",
    toolMaturity >= 70 ? "Existing tools provide a useful starting point for integration planning." : "A simple tool stack can be standardized before automation expands.",
    repeatedQuestionOpportunity >= 60
      ? "High repeat-question volume creates a strong chatbot or WhatsApp automation opportunity."
      : "FAQ automation can start small and grow with real customer patterns.",
  ];

  const gaps = [
    leadResponse < 70 ? "Lead response speed should improve before high-intent prospects cool down." : "Lead response is functional but can become more consistent.",
    input.bookingProcess === "manual"
      ? "Manual scheduling creates friction and should be moved into a guided booking flow."
      : "Booking flow should be connected to lead qualification and follow-up.",
    input.leadTracking !== "crm"
      ? "Lead tracking needs a structured system for ownership, status, and follow-up history."
      : "CRM data should be enriched with AI summaries and priority signals.",
  ];

  const roadmap = [
    {
      week: "Days 1-7",
      title: "Map the lead journey",
      actions: [
        "List every lead source and current response owner.",
        "Document top repeated questions and booking objections.",
        "Define the minimum lead fields needed for follow-up.",
      ],
    },
    {
      week: "Days 8-14",
      title: "Install response automation",
      actions: [
        `Prototype the ${packageName.toLowerCase()} workflow.`,
        "Create a safe FAQ and lead qualification script.",
        "Add handoff rules for urgent, complex, or high-value conversations.",
      ],
    },
    {
      week: "Days 15-21",
      title: "Organize leads and follow-up",
      actions: [
        "Move captured leads into one structured tracker or CRM.",
        "Add lead status, source, urgency, and next action fields.",
        "Create follow-up templates for warm and high-intent prospects.",
      ],
    },
    {
      week: "Days 22-30",
      title: "Measure and improve",
      actions: [
        "Review response time, booked appointments, and lead quality weekly.",
        "Add AI summaries for conversations and missed opportunities.",
        "Decide whether to expand into website chatbot, WhatsApp agent, or lead scoring.",
      ],
    },
  ];

  return {
    automationReadiness,
    leadResponse,
    workflowRisk,
    customerIntelligence,
    overall,
    packageName,
    summary: `${input.businessName || "This business"} is ready for a focused ${packageName.toLowerCase()} pilot. The strongest near-term value is reducing manual follow-up while creating cleaner lead records and a repeatable 30-day automation plan.`,
    strengths,
    gaps,
    roadmap,
  };
}

function ScoreCard({
  label,
  score,
  icon: Icon,
}: {
  label: string;
  score: number;
  icon: typeof Gauge;
}) {
  return (
    <section className="score-card" aria-label={`${label} score`}>
      <div className="score-card__top">
        <Icon aria-hidden="true" size={18} />
        <span>{label}</span>
      </div>
      <div className="score-card__value">{score}</div>
      <div className="meter" aria-hidden="true">
        <span style={{ width: `${score}%` }} />
      </div>
    </section>
  );
}

function App() {
  const [intake, setIntake] = useState<Intake>(defaultIntake);
  const result = useMemo(() => calculateAudit(intake), [intake]);

  const update = <K extends keyof Intake>(key: K, value: Intake[K]) => {
    setIntake((current) => ({ ...current, [key]: value }));
  };

  const exportReport = () => {
    window.print();
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand-mark">
            <Sparkles aria-hidden="true" size={18} />
            <span>Lead.AI Business Audit</span>
          </div>
          <h1>Automation readiness and 30-day roadmap generator</h1>
        </div>
        <div className="topbar__actions">
          <span className="status-pill">MVP demo</span>
          <button className="icon-button" type="button" onClick={exportReport} title="Print or save report">
            <Download aria-hidden="true" size={18} />
            <span>Report</span>
          </button>
        </div>
      </header>

      <section className="workspace">
        <form className="intake-panel" aria-label="Business audit intake">
          <div className="section-heading">
            <ClipboardList aria-hidden="true" size={20} />
            <div>
              <h2>Business Intake</h2>
              <p>Use safe sample data or enter a client scenario.</p>
            </div>
          </div>

          <label>
            Business name
            <input
              value={intake.businessName}
              onChange={(event) => update("businessName", event.target.value)}
              placeholder="Example business"
            />
          </label>

          <label>
            Business type
            <input
              value={intake.businessType}
              onChange={(event) => update("businessType", event.target.value)}
              placeholder="Local service, e-commerce, retail..."
            />
          </label>

          <label>
            Monthly inbound leads
            <input
              min="0"
              max="1000"
              type="number"
              value={intake.monthlyLeads}
              onChange={(event) => update("monthlyLeads", Number(event.target.value))}
            />
          </label>

          <label>
            Repeated customer questions per month
            <input
              min="0"
              max="500"
              type="number"
              value={intake.repeatQuestions}
              onChange={(event) => update("repeatQuestions", Number(event.target.value))}
            />
          </label>

          <div className="field-grid">
            <label>
              Response speed
              <select value={intake.responseTime} onChange={(event) => update("responseTime", event.target.value as ResponseTime)}>
                {responseOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Support coverage
              <select value={intake.supportCoverage} onChange={(event) => update("supportCoverage", event.target.value as Coverage)}>
                {coverageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Booking process
              <select value={intake.bookingProcess} onChange={(event) => update("bookingProcess", event.target.value as Booking)}>
                {bookingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Lead tracking
              <select value={intake.leadTracking} onChange={(event) => update("leadTracking", event.target.value as Tracking)}>
                {trackingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
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
                  onClick={() => update("priorityArea", option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
        </form>

        <section className="report-panel" aria-label="Automation audit report">
          <div className="report-hero">
            <div>
              <p className="eyebrow">{intake.businessType || "Business audit"}</p>
              <h2>{intake.businessName || "Business"} audit report</h2>
              <p>{result.summary}</p>
            </div>
            <div className="overall-score">
              <span>{result.overall}</span>
              <small>overall score</small>
            </div>
          </div>

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
            <button className="primary-button" type="button">
              <CalendarClock aria-hidden="true" size={18} />
              <span>Plan consultation</span>
              <ArrowRight aria-hidden="true" size={18} />
            </button>
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
        </section>
      </section>
    </main>
  );
}

export { App };
