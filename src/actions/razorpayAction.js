"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { razorpay } from "@/lib/razorpay";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function getUserPlan() {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, plan: "FREE", credits: 3 };

    const dbUser = await db
      .select({
        plan: users.plan,
        credits: users.credits,
        billingInterval: users.billingInterval,
        subscriptionEndDate: users.subscriptionEndDate,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (dbUser.length > 0) {
      return {
        success: true,
        plan: dbUser[0].plan || "FREE",
        credits: dbUser[0].credits ?? 3,
        billingInterval: dbUser[0].billingInterval,
        subscriptionEndDate: dbUser[0].subscriptionEndDate,
      };
    }

    return { success: true, plan: "FREE", credits: 3 };
  } catch (error) {
    console.error("Fetch User Plan Error:", error);
    return { success: false, plan: "FREE", credits: 3 };
  }
}
export async function createRazorpayOrder(amountInRupees = 199) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const options = {
      amount: amountInRupees * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: userId,
      },
    };

    const order = await razorpay.orders.create(options);
    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    return { success: false, error: "Order create nahi ho paaya." };
  }
}

export async function verifyAndUpgradePlan(billingInterval = "monthly") {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Calculate Expiry Date
    const now = new Date();
    let expiryDate = new Date();

    if (billingInterval === "monthly") {
      expiryDate.setMonth(now.getMonth() + 1); // Exact +1 Month
    } else if (billingInterval === "annually") {
      expiryDate.setFullYear(now.getFullYear() + 1); // Exact +1 Year
    }

    await db
      .update(users)
      .set({
        plan: "PRO",
        credits: 9999,
        billingInterval: billingInterval,
        subscriptionEndDate: expiryDate,
      })
      .where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error("Plan Upgrade Error:", error);
    return { success: false, error: "Plan update failed" };
  }
}

// suscribtion cancel function
export async function cancelSubscription() {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    // Interval ko CANCELLED mark karenge, taaki auto-renew na ho
    // Access subscriptionEndDate tak active hi rahegi
    await db
      .update(users)
      .set({
        billingInterval: "CANCELLED",
      })
      .where(eq(users.id, userId));

    return {
      success: true,
      message:
        "Subscription auto-renewal cancelled. Your access remains active until the subscription end date.",
    };
  } catch (error) {
    console.error("Cancellation Error:", error);
    return { success: false, error: "Failed to cancel subscription." };
  }
}
