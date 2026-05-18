import type {
  AuditResult,
  Booking,
  Coverage,
  Intake,
  Priority,
  ResponseTime,
  Tracking,
} from "./types";

export const responseOptions: Array<{ value: ResponseTime; label: string }> = [
  { value: "instant", label: "Under 5 minutes" },
  { value: "same-day", label: "Same business day" },
  { value: "next-day", label: "Next day" },
  { value: "slow", label: "2+ days or inconsistent" },
];

export const coverageOptions: Array<{ value: Coverage; label: string }> = [
  { value: "extended", label: "Extended or near 24/7" },
  { value: "business-hours", label: "Business hours" },
  { value: "manual", label: "Manual when available" },
  { value: "none", label: "No reliable coverage" },
];

export const bookingOptions: Array<{ value: Booking; label: string }> = [
  { value: "automated", label: "Automated booking" },
  { value: "calendar-link", label: "Calendar link" },
  { value: "manual", label: "Manual scheduling" },
  { value: "not-applicable", label: "Not appointment-based" },
];

export const trackingOptions: Array<{ value: Tracking; label: string }> = [
  { value: "crm", label: "CRM" },
  { value: "spreadsheet", label: "Spreadsheet" },
  { value: "inbox", label: "Inbox/messages" },
  { value: "none", label: "No system" },
];

export const priorityOptions: Array<{ value: Priority; label: string }> = [
  { value: "lead-response", label: "Lead response" },
  { value: "customer-support", label: "Customer support" },
  { value: "booking", label: "Appointment booking" },
  { value: "lead-scoring", label: "Lead scoring" },
  { value: "analytics", label: "Customer intelligence" },
];

export const budgetOptions = [
  "$0-$100",
  "$100-$300",
  "$300-$500",
  "$500-$1,000",
  "$1,000+",
  "Not sure yet",
];

export const automationNeedOptions = [
  "lead capture",
  "chatbot",
  "booking",
  "follow-up",
  "WhatsApp",
  "analytics",
  "lead scoring",
];

export const scoringNotes = [
  "Automation readiness blends tool maturity, lead volume, lead tracking, and booking process.",
  "Lead response combines response speed and support coverage.",
  "Customer intelligence reflects whether lead details are organized enough for follow-up.",
  "Workflow risk is higher when response, tracking, and booking processes are mostly manual.",
];

export const defaultIntake: Intake = {
  ownerName: "Customer Name",
  ownerEmail: "customer@example.com",
  ownerPhone: "+1 000 000 0000",
  businessName: "BrightPath Dental Studio",
  businessWebsite: "https://example.com",
  businessType: "Local service business",
  businessLocation: "California",
  monthlyLeads: 85,
  responseTime: "same-day",
  supportCoverage: "business-hours",
  repeatQuestions: 45,
  bookingProcess: "manual",
  leadTracking: "spreadsheet",
  currentTools: "Website form, shared inbox, Google Calendar",
  priorityArea: "lead-response",
  majorProblem: "Missing follow-up system",
  automationNeeds: ["lead capture", "chatbot", "booking"],
  monthlyBudget: "$300-$500",
};

function clamp(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getScoreBand(score: number) {
  if (score >= 80) {
    return { label: "Strong Automation Fit", tone: "strong" };
  }

  if (score >= 60) {
    return { label: "Good Opportunity", tone: "good" };
  }

  if (score >= 40) {
    return { label: "Needs Improvement", tone: "needs-work" };
  }

  return { label: "High Risk / Low Automation Readiness", tone: "risk" };
}

function recommendPackage(input: Intake, overall: number) {
  if (input.priorityArea === "lead-scoring" || input.automationNeeds.includes("analytics")) {
    return "Growth Automation System";
  }

  if (overall >= 72 || input.monthlyBudget === "$1,000+") {
    return "Growth Automation System";
  }

  if (overall >= 50 || input.monthlyBudget === "$300-$500" || input.monthlyBudget === "$500-$1,000") {
    return "AI Automation Starter Setup";
  }

  return "Paid Strategy Call";
}

export function calculateAudit(input: Intake): AuditResult {
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
  const automationNeedScore = clamp(input.automationNeeds.length * 14 + 28);

  const leadResponse = clamp(responseMap[input.responseTime] * 0.62 + coverageMap[input.supportCoverage] * 0.38);
  const automationReadiness = clamp(
    toolMaturity * 0.18 +
      bookingMap[input.bookingProcess] * 0.2 +
      trackingMap[input.leadTracking] * 0.22 +
      leadVolumeScore * 0.26 +
      automationNeedScore * 0.14
  );
  const customerIntelligence = clamp(trackingMap[input.leadTracking] * 0.55 + toolMaturity * 0.2 + leadVolumeScore * 0.25);
  const workflowRisk = clamp(100 - (leadResponse * 0.45 + bookingMap[input.bookingProcess] * 0.25 + trackingMap[input.leadTracking] * 0.3));
  const overall = clamp(
    automationReadiness * 0.32 +
      leadResponse * 0.3 +
      customerIntelligence * 0.2 +
      repeatedQuestionOpportunity * 0.12 +
      automationNeedScore * 0.06
  );

  const packageName = recommendPackage(input, overall);
  const riskLevel = workflowRisk >= 65 ? "High" : workflowRisk >= 40 ? "Medium" : "Low";

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

  const topPriorities = [
    input.majorProblem || "Respond to new leads faster with a guided AI-assisted intake workflow.",
    input.bookingProcess === "manual"
      ? "Reduce manual scheduling by adding booking intent detection and a calendar path."
      : "Use booking behavior as a signal for lead urgency.",
    input.leadTracking !== "crm"
      ? "Move lead details into a structured tracker before adding advanced automation."
      : "Add AI summaries and next-action fields to CRM records.",
  ];

  const implementationNotes = [
    "This MVP uses deterministic scoring rules, not an AI model. The scores are a planning aid, not a final operational decision.",
    "Start with one automation pilot, measure lead response and booked appointments, then expand into chatbot or WhatsApp workflows.",
    "Keep human review for urgent, sensitive, or high-value customer conversations.",
    "PayPal Checkout remains disabled until backend create-order and capture-order endpoints are implemented.",
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
    riskLevel,
    packageName,
    summary: `${input.businessName || "This business"} is ready for a focused ${packageName.toLowerCase()} path. The strongest near-term value is reducing manual follow-up while creating cleaner lead records and a repeatable 30-day automation plan.`,
    strengths,
    gaps,
    topPriorities,
    implementationNotes,
    roadmap,
  };
}
