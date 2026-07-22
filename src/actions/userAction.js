"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function syncUserToDb() {
  const user = await currentUser();

  if (!user) {
    return { success: false, error: "User not Authenticated" };
  }
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users?.id, user?.id));

    if (existingUser.length > 0) {
      return {
        success: true,
        message: "User already exists",
        user: existingUser[0],
      };
    }

    const result = await db
      .insert(users)
      .values({
        id: user?.id,
        email: user?.emailAddresses[0]?.emailAddress,
        name: user?.fullName,
      })
      .returning();

    return {
      success: true,
      message: "user synced successfully",
      user: result[0],
    };
  } catch (error) {
    console.error("User action pipeline failure:", error);
    return { success: false, error: "Authentication data sync error." };
  }
}

export async function getUserSubscription() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, plan: "FREE", credits: 0 };
    }

    const userData = await db
      .select({
        plan: users.plan,
        credits: users.credits,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userData || userData.length === 0) {
      return { success: false, plan: "FREE", credits: 0 };
    }

    return {
      success: true,
      plan: userData[0].plan,
      credits: userData[0].credits,
    };
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return { success: false, plan: "FREE", credits: 0 };
  }
}
