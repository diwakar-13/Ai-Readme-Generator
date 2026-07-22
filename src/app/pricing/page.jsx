"use client";

import PricingTable from "@/components/PricingTable";
import {
  createRazorpayOrder,
  verifyAndUpgradePlan,
  getUserPlan,
} from "@/actions/razorpayAction";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react"; // 👈 Loading Spinner Icon

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { resolvedTheme } = useTheme();

  // User dynamic URL (/dashboard/proj_123) se aaya hai toh wahi wapas bhejega
  const redirectPath = searchParams.get("redirect") || "/";

  const [userPlan, setUserPlan] = useState("FREE");
  const [isRedirecting, setIsRedirecting] = useState(false); // 👈 Redirect Loading State

  // Database se live plan status fetch karna
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

  const handleUpgrade = async (billPlan) => {
    const toastId = toast.loading("Initializing secure checkout...");

    try {
      const selectedAmount = billPlan === "monthly" ? 199 : 1999;
      const res = await createRazorpayOrder(selectedAmount);

      if (!res.success) {
        toast.error("Unable to initiate order. Please try again.", {
          id: toastId,
        });
        return;
      }

      toast.dismiss(toastId);

      const primaryBrandColor =
        resolvedTheme === "dark" ? "#e06138" : "#d9532f";

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: res.amount,
        currency: res.currency,
        name: "RepoScribe",
        description: `Pro Plan Subscription (${billPlan === "monthly" ? "Monthly" : "Annual"})`,
        order_id: res.orderId,

        prefill: {
          name: user?.fullName || user?.firstName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
          contact: user?.primaryPhoneNumber?.phoneNumber || "",
        },

        theme: {
          color: primaryBrandColor,
        },

        handler: async function (response) {
          const verifyToastId = toast.loading("Verifying transaction...");

          // 🎯 Pass `billPlan` ("monthly" ya "annually") to server action
          const upgradeRes = await verifyAndUpgradePlan(billPlan);

          if (upgradeRes.success) {
            toast.success(
              "Welcome to Pro! Your account has been upgraded successfully.",
              {
                id: verifyToastId,
                duration: 4000,
              },
            );

            // 🚀 Start full-screen loading state
            setIsRedirecting(true);

            // Re-fetch latest plan from DB
            const updatedPlanRes = await getUserPlan();
            if (updatedPlanRes.success) {
              setUserPlan(updatedPlanRes.plan);
            }

            // Exact project URL (/dashboard/[projectId]) ya Home par redirect
            router.refresh();
            router.push(redirectPath);
          } else {
            toast.error(
              "Payment processed, but plan update failed. Support team has been notified.",
              {
                id: verifyToastId,
              },
            );
          }
        },

        modal: {
          ondismiss: function () {
            toast.info("Checkout cancelled.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(
        "Something went wrong with the payment gateway. Please try again.",
        {
          id: toastId,
        },
      );
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* 🚀 Redirection Overlay Loader */}
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
