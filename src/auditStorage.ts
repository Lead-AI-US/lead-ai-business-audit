import { initializeApp, getApps } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type { AuditReport, AuditStatus, Intake } from "./types";
import { calculateAudit } from "./auditModel";

const COLLECTION_NAME = "auditReports";
const LOCAL_STORAGE_KEY = "lead_ai_audit_reports_v2";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirestoreConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

function getDb() {
  if (!isFirestoreConfigured) {
    return null;
  }

  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  return getFirestore(app);
}

function readLocalReports() {
  try {
    const rawReports = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return rawReports ? (JSON.parse(rawReports) as AuditReport[]) : [];
  } catch {
    return [];
  }
}

function writeLocalReports(reports: AuditReport[]) {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reports));
}

export function generateReportId() {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replaceAll("-", "");
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `LA-${datePart}-${randomPart}`;
}

export function createAuditReport(input: Intake, entryPage = window.location.pathname): AuditReport {
  const auditResult = calculateAudit(input);

  return {
    reportId: generateReportId(),
    createdAt: new Date().toISOString(),
    status: "new",
    owner: {
      name: input.ownerName.trim(),
      email: input.ownerEmail.trim().toLowerCase(),
      phone: input.ownerPhone.trim(),
    },
    business: {
      name: input.businessName.trim(),
      website: input.businessWebsite.trim(),
      type: input.businessType.trim(),
      location: input.businessLocation.trim(),
    },
    auditInput: {
      majorProblem: input.majorProblem.trim(),
      automationNeeds: input.automationNeeds,
      monthlyBudget: input.monthlyBudget,
      monthlyLeads: input.monthlyLeads,
      responseTime: input.responseTime,
      supportCoverage: input.supportCoverage,
      repeatQuestions: input.repeatQuestions,
      bookingProcess: input.bookingProcess,
      leadTracking: input.leadTracking,
      currentTools: input.currentTools.trim(),
      priorityArea: input.priorityArea,
    },
    auditResult,
    source: {
      utmSource: "lead-ai.us",
      entryPage,
    },
  };
}

export async function saveAuditReport(report: AuditReport) {
  const db = getDb();

  if (db) {
    await setDoc(doc(db, COLLECTION_NAME, report.reportId), report);
    return { mode: "firestore" as const, report };
  }

  const reports = readLocalReports().filter((item) => item.reportId !== report.reportId);
  writeLocalReports([report, ...reports]);
  return { mode: "local" as const, report };
}

export async function getAuditReport(reportId: string) {
  const db = getDb();

  if (db) {
    const snapshot = await getDoc(doc(db, COLLECTION_NAME, reportId));
    return snapshot.exists() ? (snapshot.data() as AuditReport) : null;
  }

  return readLocalReports().find((report) => report.reportId === reportId) ?? null;
}

export async function listAuditReports() {
  const db = getDb();

  if (db) {
    const snapshot = await getDocs(query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc")));
    return snapshot.docs.map((item) => item.data() as AuditReport);
  }

  return readLocalReports().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateAuditReportStatus(reportId: string, status: AuditStatus) {
  const db = getDb();

  if (db) {
    await updateDoc(doc(db, COLLECTION_NAME, reportId), { status });
    return;
  }

  const reports = readLocalReports().map((report) =>
    report.reportId === reportId ? { ...report, status } : report
  );
  writeLocalReports(reports);
}
