import { initializeApp, getApps } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { firebaseConfig, isFirestoreConfigured } from "./auditStorage";

// Real bot/abuse protection for the public audit-intake write path.
// Inactive unless VITE_RECAPTCHA_SITE_KEY is set, so this is a no-op today
// and does not change current behavior. To activate:
//   1. Firebase Console -> App Check -> register this app with the
//      reCAPTCHA v3 provider (creates a Google reCAPTCHA v3 site key).
//   2. Set VITE_RECAPTCHA_SITE_KEY in Vercel env vars to that site key.
//   3. Firebase Console -> App Check -> APIs -> Cloud Firestore -> Enforce.
// Steps 1 and 3 require Firebase/Google console access this environment
// does not have.
export function initAppCheckIfConfigured() {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  if (!isFirestoreConfigured || !siteKey) {
    return;
  }

  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
}
