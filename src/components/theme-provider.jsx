"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { syncUserToDb } from "@/actions/userAction";

export function ThemeProvider({ children, ...props }) {
  const { isSignedIn } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn) {
        await syncUserToDb();
      }
    };
    syncUser();
  }, [isSignedIn]);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
