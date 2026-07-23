"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { submitContactForm } from "@/actions/contactAction";
import {
  Send,
  CheckCircle2,
  ShieldAlert,
  Terminal,
  Loader2,
} from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ success: null, message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ success: null, message: "" });

    const res = await submitContactForm(formData);

    if (res.success) {
      setStatus({ success: true, message: res.message });
      setFormData({ name: "", email: "", message: "" });
    } else {
      setStatus({ success: false, message: res.error });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground dark:bg-black dark:text-white selection:bg-orange-500/30 selection:text-orange-200">
      {/* Navbar */}
      <div className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 dark:bg-black/50 backdrop-blur-xl">
        <Navbar />
      </div>

      {/* Main Split Grid Section */}
      <div className="pt-20 min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
        {/* ─── LEFT SIDE: HERO IMAGE & TESTIMONIAL ─── */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-border bg-muted/30 dark:bg-neutral-950">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/contact.jpg"
              alt="Mountain Landscape"
              fill
              priority
              className="object-cover opacity-90 dark:opacity-80 filter contrast-110 grayscale-[10%] dark:grayscale-[20%]"
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 " />
          </div>

          {/* Top Brand Logo */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/30 dark:bg-white/10 border border-white/20 backdrop-blur-md">
              <Terminal className="h-5 w-5 text-foreground dark:text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-foreground dark:text-white">
              RepoScribe
            </span>
          </div>

          {/* Bottom Floating Testimonial Card */}
          <div className="relative z-10 max-w-md rounded-2xl border border-white/20 dark:border-white/15 bg-background/70 dark:bg-black/60 p-6 backdrop-blur-xl shadow-2xl">
            <p className="text-base font-medium leading-relaxed text-foreground/90 dark:text-neutral-200">
              “RepoScribe turned our messy repository codebases into clean,
              professional architecture documentation in seconds. A must-have
              tool for dev teams.”
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-300 p-[1.5px]">
                <div className="h-full w-full rounded-full bg-muted dark:bg-neutral-900 flex items-center justify-center text-xs font-bold text-foreground dark:text-white">
                  DP
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground dark:text-white">
                  Diwakar Pandey
                </h4>
                <p className="text-xs text-muted-foreground dark:text-neutral-400">
                  Full-Stack Engineer
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT SIDE: CONTACT FORM ─── */}
        <div className="flex flex-col justify-center px-6 sm:px-12 md:px-20 py-16 bg-background  dark:bg-black z-10">
          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-black  text-foreground dark:text-white">
                Contact us
              </h1>
              <p className="mt-2 text-sm text-muted-foreground dark:text-neutral-400">
                We're here to help with any questions. Email us at{" "}
                <a
                  href="mailto:diwakarpandey410@gmail.com"
                  className="font-medium text-foreground dark:text-white hover:underline transition-all"
                >
                  diwakarpandey410@gmail.com
                </a>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Name Field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 dark:text-neutral-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-muted/40 dark:bg-neutral-900/90 px-4 py-3.5 text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder-neutral-500 focus:border-foreground dark:focus:border-white focus:outline-none transition-all shadow-inner"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 dark:text-neutral-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-muted/40 dark:bg-neutral-900/90 px-4 py-3.5 text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder-neutral-500 focus:border-foreground dark:focus:border-white focus:outline-none transition-all shadow-inner"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 dark:text-neutral-300 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-muted/40 dark:bg-neutral-900/90 p-4 text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder-neutral-500 focus:border-foreground dark:focus:border-white focus:outline-none transition-all resize-none shadow-inner"
                />
              </div>

              {/* Feedback Alert */}
              {status.message && (
                <div
                  className={`flex items-center gap-2.5 text-xs font-semibold p-4 rounded-xl border backdrop-blur-md ${
                    status.success
                      ? "bg-emerald-950/20 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border-emerald-800/40 dark:border-emerald-800/60"
                      : "bg-red-950/20 dark:bg-red-950/40 text-red-600 dark:text-red-300 border-red-800/40 dark:border-red-800/60"
                  }`}
                >
                  {status.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 shrink-0 text-red-500 dark:text-red-400" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              {/* Aceternity Style Pill Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-foreground hover:bg-foreground/90 text-background dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-bold py-3.5 text-sm transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-background dark:text-black" />
                    Sending...
                  </>
                ) : (
                  "Send"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
