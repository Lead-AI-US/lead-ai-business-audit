export type ResponseTime = "instant" | "same-day" | "next-day" | "slow";
export type Coverage = "business-hours" | "extended" | "manual" | "none";
export type Booking = "automated" | "calendar-link" | "manual" | "not-applicable";
export type Tracking = "crm" | "spreadsheet" | "inbox" | "none";
export type Priority =
  | "lead-response"
  | "customer-support"
  | "booking"
  | "lead-scoring"
  | "analytics";

export type AuditStatus =
  | "new"
  | "reviewed"
  | "contacted"
  | "proposal_sent"
  | "converted"
  | "not_ready"
  | "closed";

export type Intake = {
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  businessName: string;
  businessWebsite: string;
  businessType: string;
  businessLocation: string;
  monthlyLeads: number;
  responseTime: ResponseTime;
  supportCoverage: Coverage;
  repeatQuestions: number;
  bookingProcess: Booking;
  leadTracking: Tracking;
  currentTools: string;
  priorityArea: Priority;
  majorProblem: string;
  automationNeeds: string[];
  monthlyBudget: string;
};

export type AuditResult = {
  automationReadiness: number;
  leadResponse: number;
  workflowRisk: number;
  customerIntelligence: number;
  overall: number;
  riskLevel: string;
  packageName: string;
  summary: string;
  strengths: string[];
  gaps: string[];
  topPriorities: string[];
  implementationNotes: string[];
  roadmap: Array<{
    week: string;
    title: string;
    actions: string[];
  }>;
};

export type AuditReport = {
  reportId: string;
  createdAt: string;
  status: AuditStatus;
  owner: {
    name: string;
    email: string;
    phone: string;
  };
  business: {
    name: string;
    website: string;
    type: string;
    location: string;
  };
  auditInput: {
    majorProblem: string;
    automationNeeds: string[];
    monthlyBudget: string;
    monthlyLeads: number;
    responseTime: ResponseTime;
    supportCoverage: Coverage;
    repeatQuestions: number;
    bookingProcess: Booking;
    leadTracking: Tracking;
    currentTools: string;
    priorityArea: Priority;
  };
  auditResult: AuditResult;
  source: {
    utmSource: string;
    entryPage: string;
  };
};
