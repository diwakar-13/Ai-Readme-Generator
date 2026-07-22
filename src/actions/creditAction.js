"use server"
import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function checkAndDeductCredit() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { allowed: false, error: "Please log in first." };
    }
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!dbUser || dbUser.length === 0) {
      return { allowed: false, error: "User record not found." };
    }
    const userData = dbUser[0];
    const now = new Date();

    //   check pro subscription expire or not
    if (
      userData.plan === "PRO" &&
      userData.subscriptionEndDate &&
      new Date(userData.subscriptionEndDate) < now
    ) {
      await db
        .update(users)
        .set({
          plan: "FREE",
          credits: 0,
          billingInterval: null,
        })
        .where(eq(users.id, userId));
      return {
        allowed: false,
        error:
          "Your Pro Subscription has expired. Please upgrade to continue generating READMEs.",
      };
    }
    //   Check: Active Pro User -> Full Access

    if (userData.plan === "PRO") {
      return { allowed: true, creditsLeft: 9999 };
    }

    // Check: Free User have crdits or not
    if (userData.credits <= 0) {
      return {
        allowed: false,
        error:
          "You have used all 3 free generations! Upgrade to Pro for unlimited generations.",
      };
    }
    const newCredits = userData.credits - 1;
    await db
      .update(users)
      .set({ credits: newCredits })
      .where(eq(users.id, userId));

    return { allowed: true, creditsLeft: newCredits };
  } catch (error) {
    console.error("Credit Check Error:", error);
    return { allowed: false, error: "Failed to verify generation credits." };
  }
}
