console.log("👉 DEBUG APP ID:", process.env.NEXT_PUBLIC_CASHFREE_APP_ID);
console.log(
  "👉 DEBUG SECRET:",
  process.env.CASHFREE_SECRET_KEY ? "EXISTS" : "MISSING",
);
import { Cashfree, CFEnvironment } from "cashfree-pg";

// Trim whitespaces to prevent header formatting issues
const appId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID?.trim();
const secretKey = process.env.CASHFREE_SECRET_KEY?.trim();

if (!appId || !secretKey) {
  console.error("❌ CRITICAL: Cashfree Credentials missing in process.env!");
}

export const cashfree = new Cashfree(
  process.env.CASHFREE_ENV === "PRODUCTION"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX,
  "2023-08-01",
  appId,
  secretKey,
);
