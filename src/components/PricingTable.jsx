"use client";

import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

// 🚀 REPOSCRIBE SPECIFIC PLANS DATA
export const PLANS = [
  {
    id: "free",
    title: "Free",
    desc: "Perfect for getting started with basic AI README generation for individual projects.",
    monthlyPrice: 0,
    annuallyPrice: 0,
    buttonText: "Current Plan",
    isFree: true,
    features: [
      "5 Free AI README Generations",
      "Standard Markdown Export",
      "Basic Tech Stack Detection",
      "Community Support",
    ],
    disabledFeatures: [
      "Live Markdown Preview Tab",
      "Interactive Live Editor Tab",
      "Direct GitHub Commit Integration",
    ],
  },
  {
    id: "pro",
    title: "Pro",
    desc: "For developers and teams who want full access to live editing, previewing, and unlimited AI generation.",
    monthlyPrice: 199,
    annuallyPrice: 1999,
    badge: "Best Value",
    buttonText: "Upgrade to Pro",
    isFree: false,
    features: [
      "Unlimited AI README Generations",
      "Full Live Preview Mode (Unlocked)",
      "Interactive Live Editor (Unlocked)",
      "Direct One-Click GitHub Commit",
      "Priority Support & Updates",
    ],
  },
];

export default function PricingTable({ currentPlan = "FREE", onUpgrade }) {
  const [billPlan, setBillPlan] = useState("monthly");

  const handleSwitch = () => {
    setBillPlan((prev) => (prev === "monthly" ? "annually" : "monthly"));
  };

  return (
    <div className="relative flex flex-col items-center justify-center max-w-5xl py-12 mx-auto px-4 bg-background text-foreground">
      <div className="flex flex-col items-center justify-center max-w-2xl mx-auto">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Flexible Pricing for Developers
            </h2>
            <AnimatedThemeToggler />
          </div>

          <p className="text-base md:text-lg text-center text-muted-foreground mt-4">
            Supercharge your GitHub repositories with AI-powered READMEs.
            Upgrade anytime to unlock full editing features.
          </p>
        </div>

        {/* Monthly / Annually Toggle */}
        <div className="flex items-center justify-center space-x-4 mt-8">
          <span
            className={cn(
              "text-base font-medium transition-colors",
              billPlan === "monthly"
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            Monthly
          </span>

          <button
            onClick={handleSwitch}
            className="relative rounded-full focus:outline-none p-0.5 bg-muted border border-border cursor-pointer"
          >
            <div className="w-12 h-6 transition rounded-full shadow-xs outline-none bg-primary"></div>

            <div
              className={cn(
                "absolute inline-flex items-center justify-center w-4 h-4 transition-all duration-300 ease-in-out top-1.5 left-1.5 rounded-full bg-primary-foreground shadow-xs",
                billPlan === "annually" ? "translate-x-6" : "translate-x-0",
              )}
            />
          </button>

          <span
            className={cn(
              "text-base font-medium flex items-center gap-1.5 transition-colors",
              billPlan === "annually"
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            Annually
            <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-semibold">
              Save ~16.2%
            </span>
          </span>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid w-full grid-cols-1 lg:grid-cols-2 pt-8 lg:pt-12 gap-6 max-w-4xl mx-auto">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billPlan={billPlan}
            currentPlan={currentPlan}
            onUpgrade={onUpgrade}
          />
        ))}
      </div>
    </div>
  );
}

function PlanCard({ plan, billPlan, currentPlan, onUpgrade }) {
  const isPro = plan.title === "Pro";
  const isUserOnThisPlan =
    currentPlan?.toUpperCase() === plan.title.toUpperCase();

  return (
    <div
      className={cn(
        "flex flex-col relative rounded-2xl lg:rounded-3xl transition-all bg-card text-card-foreground items-start w-full border border-border overflow-hidden p-1 shadow-sm",
        isPro && "border-primary shadow-md",
      )}
    >
      {/* Subtle Background Glow for Pro */}
      {isPro && (
        <div className="absolute top-0 right-0 left-0 mx-auto h-24 w-full bg-primary/10 rounded-2xl blur-2xl -z-10" />
      )}

      <div className="p-6 md:p-8 flex rounded-t-2xl lg:rounded-t-3xl flex-col items-start w-full relative">
        {/* Badge */}
        {isPro && (
          <div className="absolute top-6 right-6 bg-primary text-primary-foreground font-semibold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
            <Sparkles className="h-3 w-3" /> Best Value
          </div>
        )}

        <h2 className="font-semibold text-xl text-foreground">{plan.title}</h2>

        <h3 className="mt-4 text-3xl font-bold md:text-5xl flex items-baseline gap-1 text-foreground">
          <NumberFlow
            value={
              billPlan === "monthly" ? plan.monthlyPrice : plan.annuallyPrice
            }
            format={{
              currency: "INR",
              style: "currency",
              currencySign: "standard",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              currencyDisplay: "narrowSymbol",
            }}
          />
          <span className="text-sm font-normal text-muted-foreground">
            {plan.isFree
              ? "/forever"
              : billPlan === "monthly"
                ? "/month"
                : "/year"}
          </span>
        </h3>

        <p className="text-sm text-muted-foreground mt-3 min-h-[40px]">
          {plan.desc}
        </p>
      </div>

      <div className="flex flex-col items-start w-full px-6 py-2">
        <Button
          size="lg"
          disabled={isUserOnThisPlan || plan.isFree}
          onClick={() => !plan.isFree && onUpgrade && onUpgrade(billPlan)}
          className={cn(
            "w-full font-semibold cursor-pointer transition-all",
            isPro
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          )}
        >
          {isUserOnThisPlan ? "Current Plan" : plan.buttonText}
        </Button>

        <div className="h-8 overflow-hidden w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.span
              key={billPlan}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="text-xs text-center text-muted-foreground mt-3 mx-auto block"
            >
              {plan.isFree
                ? "No credit card required"
                : billPlan === "monthly"
                  ? "Billed monthly"
                  : "Billed in one annual payment"}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Features List */}
      <div className="flex flex-col items-start w-full p-6 pt-2 gap-y-3">
        <span className="text-sm font-medium text-foreground">Includes:</span>

        {/* Enabled Features */}
        {plan.features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center justify-start gap-2.5 text-sm"
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-full p-0.5",
                isPro ? "text-primary" : "text-primary/80",
              )}
            >
              <CheckIcon className="size-4" />
            </div>
            <span className="text-foreground/90">{feature}</span>
          </div>
        ))}

        {/* Disabled Features for Free Plan */}
        {plan.disabledFeatures?.map((feature, index) => (
          <div
            key={index}
            className="flex items-center justify-start gap-2.5 text-sm text-muted-foreground/50 line-through"
          >
            <div className="flex items-center justify-center p-0.5">
              <div className="size-1.5 rounded-full bg-muted-foreground/40 ml-1 mr-1" />
            </div>
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
