"use client";

import { Sparkles } from "lucide-react";
import { useRouter, usePathname } from "next/navigation"; // 👈 usePathname add kiya
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function UpgradeModal({ open, onOpenChange }) {
  const router = useRouter();
  const pathname = usePathname(); //  Exact current page URL (e.g. /dashboard/proj_123)

  const handleUpgrade = () => {
    onOpenChange(false);
    //  Dynamic path pass kar diya query string me
    router.push(`/pricing?redirect=${encodeURIComponent(pathname)}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] text-center">
        <DialogHeader className="flex flex-col items-center">
          <div className="p-3 bg-primary/10 rounded-full mb-3 text-primary">
            <Sparkles className="w-8 h-8" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Unlock Pro Features
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground mt-2">
            Interactive Live Editing and One-Click GitHub Commits are exclusive
            to <strong>Pro Plan</strong> users.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-col gap-2 mt-4">
          <Button
            onClick={handleUpgrade}
            className="w-full bg-primary text-primary-foreground font-semibold cursor-pointer"
          >
            Upgrade to Pro
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full cursor-pointer"
          >
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
