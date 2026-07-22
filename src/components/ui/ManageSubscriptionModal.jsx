"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ShieldAlert, AlertCircle } from "lucide-react";
import { cancelSubscription, requestRefundAndRevoke } from "@/actions/razorpayAction";
 function ManageSubscriptionModal({
  open,
  onOpenChange,
  userPlanDetails,
}) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("manage"); // 'manage' | 'refund'
  const [refundReason, setRefundReason] = useState("");

  const handleCancel = async () => {
    setLoading(true);
    const toastId = toast.loading("Cancelling auto-renewal...");

    try {
      const res = await cancelSubscription();
      if (res.success) {
        toast.success(res.message, { id: toastId, duration: 5000 });
        onOpenChange(false);
      } else {
        toast.error(res.error, { id: toastId });
      }
    } catch (err) {
      toast.error("Something went wrong.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!refundReason.trim()) {
      toast.error("Please provide a reason for requesting a refund.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Submitting refund request...");

    try {
      const res = await requestRefundAndRevoke(refundReason);
      if (res.success) {
        toast.success(res.message, { id: toastId, duration: 6000 });
        onOpenChange(false);
        window.location.reload(); // Pro features lock karne ke liye page reload
      } else {
        toast.error(res.error, { id: toastId });
      }
    } catch (err) {
      toast.error("Failed to submit refund request.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };
  const formattedDate = userPlanDetails?.subscriptionEndDate
    ? new Date(userPlanDetails.subscriptionEndDate).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      )
    : "N/A";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="p-3 bg-primary/10 rounded-full mb-2 text-primary">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Manage Pro Subscription
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Pro Plan Active Until:{" "}
            <strong className="text-foreground">{formattedDate}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Tab Selection */}
        <div className="flex gap-2 p-1 bg-accent rounded-lg my-2">
          <button
            onClick={() => setActiveTab("manage")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeTab === "manage"
                ? "bg-background text-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Cancel Renewal
          </button>
          <button
            onClick={() => setActiveTab("refund")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeTab === "refund"
                ? "bg-background text-red-500 shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Request Refund
          </button>
        </div>

        {/* TAB 1: CANCELLATION */}
        {activeTab === "manage" && (
          <div className="space-y-4">
            <div className="p-3 bg-muted/50 rounded-lg border text-xs space-y-1">
              <p className="font-semibold text-foreground">
                Cancellation Rule:
              </p>
              <p className="text-muted-foreground">
                Cancelling will stop future billing. You will keep all Pro
                features until <strong>{formattedDate}</strong>.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={
                loading || userPlanDetails?.billingInterval === "CANCELLED"
              }
              className="w-full cursor-pointer text-amber-600 hover:text-amber-700 font-medium"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {userPlanDetails?.billingInterval === "CANCELLED"
                ? "Auto-Renewal Already Cancelled"
                : "Cancel Auto-Renewal"}
            </Button>
          </div>
        )}

        {/* TAB 2: REFUND WITH T&C */}
        {activeTab === "refund" && (
          <div className="space-y-3">
            <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-lg text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-red-400 font-semibold">
                <AlertCircle className="w-4 h-4" /> Terms & Refund Conditions:
              </div>
              <ul className="list-disc pl-4 text-muted-foreground space-y-0.5">
                <li>
                  Refund request must be within <strong>7 days</strong> of
                  purchase.
                </li>
                <li>
                  Pro features will be <strong>revoked immediately</strong>.
                </li>
                <li>
                  Refund credited to original UPI/Bank source in{" "}
                  <strong>5-7 working days</strong>.
                </li>
              </ul>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                Reason for Refund:
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Tell us why you want a refund..."
                className="w-full h-20 p-2 text-xs bg-accent border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <Button
              variant="destructive"
              onClick={handleRefund}
              disabled={loading}
              className="w-full cursor-pointer font-medium"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Refund Request & Revoke Pro
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ManageSubscriptionModal;
