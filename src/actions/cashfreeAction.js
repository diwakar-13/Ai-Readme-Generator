"use server";

import { db } from "@/db";
import { refundRequests, users } from "@/db/schema";
import { getRefundEmailHTML } from "@/email/refundEmailTemplate";
import { resend } from "@/lib/resend";
import { auth, currentUser } from "@clerk/nextjs/server";
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
export async function createCashfreeOrder(
  billPlan = "monthly",
  amountInRupees = 199,
) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const orderId = `order_${Date.now()}_${userId.slice(-5)}`;

    // 🎯 Phone number fallback logic
    const userPhone = user?.primaryPhoneNumber?.phoneNumber
      ? user.primaryPhoneNumber.phoneNumber.replace("+91", "").trim()
      : "9999999999"; // Fallback dummy number for Cashfree API validation

    const isProd = process.env.CASHFREE_ENV === "PRODUCTION";
    const apiUrl = isProd
      ? "https://api.cashfree.com/pg/orders"
      : "https://sandbox.cashfree.com/pg/orders";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "x-client-id": process.env.NEXT_PUBLIC_CASHFREE_APP_ID?.trim(),
        "x-client-secret": process.env.CASHFREE_SECRET_KEY?.trim(),
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_amount: Number(amountInRupees),
        order_currency: "INR",
        order_id: orderId,
        customer_details: {
          customer_id: userId,
          customer_name: user?.fullName || user?.firstName || "Developer User",
          customer_email:
            user?.primaryEmailAddress?.emailAddress || "user@example.com",
          customer_phone: userPhone, // Safe Dynamic + Fallback Phone
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?order_id={order_id}`,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ CASHFREE API RESPONSE ERROR:", data);
      return {
        success: false,
        error: data.message || "Order creation failed at gateway.",
      };
    }

    return {
      success: true,
      paymentSessionId: data.payment_session_id,
      orderId: data.order_id,
    };
  } catch (error) {
    console.error("❌ SERVER FETCH EXCEPTION:", error);
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

export async function requestRefundAndRevoke(reason) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    // 1. fetch user
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!dbUser || dbUser.length === 0) {
      return { success: false, error: "User record not found." };
    }

    const userData = dbUser[0];

    if (userData?.plan !== "PRO") {
      return {
        success: false,
        error: "You don't have an active Pro plan to refund.",
      };
    }
    // set data in db
    await db.insert(refundRequests).values({
      userId: userId,
      userEmail: userData.email,
      reason: reason,
      status: "PENDING",
    });

    // Database Update: Revoke Pro Access Instantly
    await db
      .update(users)
      .set({
        plan: "FREE",
        credits: 0,
        billingInterval: "REFUND_REQUESTED",
      })
      .where(eq(users.id, userId));
    try {
      const emailHtml = getRefundEmailHTML({
        userEmail: userData.email,
        userId: userId,
        reason: reason,
        requestDate: new Date(),
      });

      const emailResponse = await resend.emails.send({
        from: "RepoScribe <onboarding@resend.dev>",
        to: [process.env.ADMIN_EMAIL],
        subject: `🚨 Refund Requested by ${userData.email}`,
        html: emailHtml,
      });

      if (emailResponse.error) {
        console.error("❌ Resend Error:", emailResponse.error);
      } else {
        console.log("✅ Custom Refund Email Sent! ID:", emailResponse.data?.id);
      }
    } catch (emailErr) {
      console.error("❌ Email Exception:", emailErr);
    }
    return {
      success: true,
      message:
        "Refund request submitted! Pro access has been revoked. Refund will be processed in 5-7 working days.",
    };
  } catch (error) {
    console.error("Refund Process Error:", error);
    return { success: false, error: "Failed to submit refund request." };
  }
}
