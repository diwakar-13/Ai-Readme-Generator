"use client";

import { useState } from "react";
import { submitDashboardFeedback } from "@/actions/feedbackAction";
import { Star, X, CheckCircle2, ShieldAlert } from "lucide-react";

export default function FeedbackModal({ isOpen, onClose }) {
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState("Feature Suggestion");
  const [feedbackText, setFeedbackText] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ success: null, message: "" });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ success: null, message: "" });

    const res = await submitDashboardFeedback({
      rating,
      category,
      feedbackText,
    });

    if (res.success) {
      setStatus({ success: true, message: res.message });
      setFeedbackText("");
      setTimeout(() => {
        onClose();
        setStatus({ success: null, message: "" });
      }, 1800);
    } else {
      setStatus({ success: false, message: res.error });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl text-card-foreground">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-foreground">Share Your Feedback</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Help us make RepoScribe better for developers.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          {/* Star Rating */}
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-1">
              Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? "text-orange-400 fill-orange-400"
                        : "text-muted border-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/40 dark:bg-neutral-900/90 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-orange-500/50"
            >
              <option value="Feature Suggestion" className="bg-card text-card-foreground">💡 Feature Suggestion</option>
              <option value="Bug Report" className="bg-card text-card-foreground">🐛 Bug Report</option>
              <option value="UI/UX Experience" className="bg-card text-card-foreground">🎨 UI/UX Experience</option>
              <option value="Other" className="bg-card text-card-foreground">💬 Other</option>
            </select>
          </div>

          {/* Textarea */}
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-1">
              Your Feedback
            </label>
            <textarea
              rows={4}
              required
              placeholder="What did you like or what can we improve?"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/40 dark:bg-neutral-900/90 p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50 resize-none"
            />
          </div>

          {/* Status Alert */}
          {status.message && (
            <div
              className={`flex items-center gap-2 text-xs font-medium p-3 rounded-lg border ${
                status.success
                  ? "bg-green-950/20 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-800/40 dark:border-green-800/50"
                  : "bg-red-950/20 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-800/40 dark:border-red-800/50"
              }`}
            >
              {status.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
              ) : (
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}