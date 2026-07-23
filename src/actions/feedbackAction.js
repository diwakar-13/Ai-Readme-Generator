"use server";

import { getFeedbackEmailHtml } from "@/email/feedbackEmailTemplate";
import { resend } from "@/lib/resend";
import { currentUser } from "@clerk/nextjs/server";

export async function submitDashboardFeedback({
  rating,
  category,
  feedbackText,
}) {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "Unauthorized! Please sign in." };
    }

    const userName = user.fullName || "Logged-in User";
    const userEmail = user.emailAddresses[0]?.emailAddress || "N/A";

    if (!feedbackText || feedbackText.trim() === "") {
      return { success: false, error: "Feedback text cannot be empty." };
    }

    // 📩 Send Email to Admin
    await resend.emails.send({
      from: "RepoScribe Feedback <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL ,
      subject: `[App Feedback ⭐${rating}] ${category} from ${userName}`,
      html: getFeedbackEmailHtml({
        userName,
        userEmail,
        userId: user.id,
        rating,
        category,
        feedbackText,
      }),
    });

    return {
      success: true,
      message: "Feedback submitted! Thank you for helping us improve.",
    };
  } catch (error) {
    console.error("Feedback Action Error:", error);
    return { success: false, error: "Failed to submit feedback." };
  }
}
