"use server";

import { getContactEmailHtml } from "@/email/contactEmailTemplate";
import { resend } from "@/lib/resend";

export async function submitContactForm(formData) {
  try {
    const { name, email, subject, message } = formData;

    if (!name || !email || !message) {
      return { success: false, error: "Please fill in all required fields." };
    }

    const data = await resend.emails.send({
      from: "RepoScribe Contact <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL,
      subject: `[Contact Us] ${subject || "General Inquiry"} - from ${name}`,
      html: getContactEmailHtml({
        name,
        email,
        subject,
        message,
      }),
    });

    if (data.error) {
      return {
        success: false,
        error: "Failed to send email. Try again later.",
      };
    }

    return {
      success: true,
      message: "Your message has been sent successfully!",
    };
  } catch (error) {
    console.error("Contact Form Error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
