"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SignOutButton, useClerk, useUser } from "@clerk/nextjs";
import {
  BadgeCheckIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LogOutIcon,
  SparklesIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getUserPlan } from "@/actions/razorpayAction";
import ManageSubscriptionModal from "./ui/ManageSubscriptionModal";

export function NavUser() {
  const { user, isLoaded } = useUser();
  const { openUserProfile } = useClerk();
  const { isMobile } = useSidebar();
  const router = useRouter();

  const [planDetails, setPlanDetails] = useState({ plan: "FREE" });
  const [showSubModal, setShowSubModal] = useState(false);

  // 🔄 Fetch current DB Plan status for the user
  useEffect(() => {
    async function fetchPlan() {
      const res = await getUserPlan();
      if (res.success) {
        setPlanDetails(res);
      }
    }
    if (user) fetchPlan();
  }, [user]);

  if (!isLoaded || !user) return null;

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="aria-expanded:bg-muted"
                />
              }
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user.imageUrl}
                  alt={user.fullName ?? "User"}
                />
                <AvatarFallback>
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.fullName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
              </div>

              <ChevronsUpDownIcon className="ml-auto size-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <div className="flex items-center gap-2 px-3 py-3">
                <Avatar className="h-9 w-9 rounded-lg">
                  <AvatarImage
                    src={user.imageUrl}
                    alt={user.fullName ?? "User"}
                  />
                  <AvatarFallback>
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1">
                  <span className="truncate font-medium">{user.fullName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                {/* 🎯 Condition: Pro User -> Manage Subscription | Free User -> Upgrade */}
                {planDetails.plan === "PRO" ? (
                  <DropdownMenuItem
                    onClick={() => setShowSubModal(true)}
                    className="cursor-pointer text-blue-500 font-medium focus:text-blue-600"
                  >
                    <CreditCardIcon className="mr-2 h-4 w-4" />
                    Manage Subscription
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => router.push("/pricing")}
                    className="cursor-pointer text-amber-500 font-medium focus:text-amber-600"
                  >
                    <SparklesIcon className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() => openUserProfile()}
                  className="cursor-pointer"
                >
                  <BadgeCheckIcon className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <SignOutButton>
                <DropdownMenuItem className="cursor-pointer">
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </SignOutButton>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Subscription & Refund Modal */}
      <ManageSubscriptionModal
        open={showSubModal}
        onOpenChange={setShowSubModal}
        userPlanDetails={planDetails}
      />
    </>
  );
}
