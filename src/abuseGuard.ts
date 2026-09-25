// Client-side throttling only. This is a UX-layer deterrent against
// accidental or naive repeat submissions from the same browser tab — it is
// trivially bypassed by clearing sessionStorage or scripting a direct
// Firestore SDK/API call, so it is not a security control. The real
// abuse boundary for the public create path is Firebase App Check
// (see auditAppCheck.ts) plus the field validation in firestore.rules.
const SESSION_KEY = "lead_ai_audit_submissions_v1";
const SESSION_LIMIT = 3;

export function sessionSubmissionsRemaining(): number {
  try {
    const count = Number(window.sessionStorage.getItem(SESSION_KEY) ?? "0");
    return Math.max(0, SESSION_LIMIT - count);
  } catch {
    return SESSION_LIMIT;
  }
}

export function recordSessionSubmission() {
  try {
    const count = Number(window.sessionStorage.getItem(SESSION_KEY) ?? "0");
    window.sessionStorage.setItem(SESSION_KEY, String(count + 1));
  } catch {
    // sessionStorage unavailable (private browsing, disabled storage) —
    // nothing to record, so the limit simply doesn't apply this session.
  }
}
