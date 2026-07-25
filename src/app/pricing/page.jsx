"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import PricingTable from "@/components/PricingTable";
import {
  verifyAndUpgradePlan,
  getUserPlan,
  createCashfreeOrder,
} from "@/actions/cashfreeAction";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { Loader2, CheckCircle2, Sparkles, Rocket } from "lucide-react";
import Navbar from "@/components/Navbar";
import { load } from "@cashfreepayments/cashfree-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// 🎯 Success Popup Modal Component
function PaymentSuccessModal({ open }) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[420px] text-center border-orange-500/30 bg-neutral-950/90 text-white backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(249,115,22,0.35)] rounded-3xl p-8 outline-none">
        <DialogHeader className="flex flex-col items-center">
          <div className="relative flex items-center justify-center h-16 w-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-500 mb-4 animate-bounce">
            <CheckCircle2 className="w-9 h-9 text-orange-500" />
            <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
          </div>

          <DialogTitle className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            Welcome to Pro! <Rocket className="w-5 h-5 text-orange-500" />
          </DialogTitle>

          <DialogDescription className="text-center text-sm text-neutral-400 mt-2 leading-relaxed">
            Your Pro plan is now active! Enjoy unlimited AI generation, live
            editing, and direct GitHub commits.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-center gap-2 text-xs font-mono text-orange-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          Redirecting back to your workspace...
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  const redirectPath = searchParams.get("redirect") || "/";
  const returnOrderId = searchParams.get("order_id");

  const [userPlan, setUserPlan] = useState("FREE");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Reusable DB Upgrade & Redirect Function
  const completeUpgrade = useCallback(
    async (planType = "monthly") => {
      const verifyToastId = toast.loading("Verifying transaction...");

      const upgradeRes = await verifyAndUpgradePlan(planType);

      if (upgradeRes.success) {
        toast.dismiss(verifyToastId);
        setShowSuccessModal(true);

        const updatedPlanRes = await getUserPlan();
        if (updatedPlanRes.success) {
          setUserPlan(updatedPlanRes.plan);
        }

        setTimeout(() => {
          setShowSuccessModal(false);
          setIsRedirecting(true);
          router.refresh();
          router.push(redirectPath);
        }, 2500);
      } else {
        toast.error("Payment processed, but plan update failed.", {
          id: verifyToastId,
        });
      }
    },
    [redirectPath, router]
  );

  // Fetch initial plan
  useEffect(() => {
    async function fetchPlan() {
      const res = await getUserPlan();
      if (res.success && res.plan) {
        setUserPlan(res.plan);
      }
    }
    if (user) {
      fetchPlan();
    }
  }, [user]);

  // Fallback handler for full page redirects
  useEffect(() => {
    if (returnOrderId) {
      completeUpgrade("monthly");
    }
  }, [returnOrderId, completeUpgrade]);

  const handleUpgrade = async (billPlan) => {
    const toastId = toast.loading("Initializing secure checkout...");

    try {
      const selectedAmount = billPlan === "monthly" ? 199 : 1999;

      const res = await createCashfreeOrder(billPlan, selectedAmount);

      if (!res.success || !res.paymentSessionId) {
        toast.error(
          res.error || "Unable to initiate order. Please try again.",
          { id: toastId }
        );
        return;
      }

      toast.dismiss(toastId);

      const cashfree = await load({
        mode:
          process.env.NEXT_PUBLIC_CASHFREE_ENV === "PRODUCTION"
            ? "production"
            : "sandbox",
      });

      //  Modal Checkout Callback Handler
      cashfree.checkout({
        paymentSessionId: res.paymentSessionId,
        redirectTarget: "_modal",
      }).then((result) => {
        if (result.error) {
          toast.error(result.error.message || "Payment cancelled or failed.");
        }
        if (result.redirect) {
          // Hard redirect fallback by SDK
          console.log("Payment completed via redirect");
        }
        if (result.paymentDetails) {
          // Modal Success! Instant DB Upgrade Call
          completeUpgrade(billPlan);
        }
      });
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Something went wrong with payment. Please try again.", {
        id: toastId,
      });
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 dark:bg-black/50 backdrop-blur-xl">
        <Navbar />
      </div>

      <PaymentSuccessModal open={showSuccessModal} />

      {isRedirecting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border border-border shadow-2xl">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <div className="text-center">
              <h3 className="text-lg font-bold text-foreground">
                Payment Successful! 🎉
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Redirecting you back to your workspace...
              </p>
            </div>
          </div>
        </div>
      )}

      <PricingTable currentPlan={userPlan} onUpgrade={handleUpgrade} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 text-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-mono text-muted-foreground">
            Loading pricing options...
          </p>
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}