import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  plan: text("plan").default("FREE").notNull(),
  credits: integer("credits").default(3).notNull(),
  billingInterval: text("billing_interval"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  repoName: text("repo_name").notNull(),
  repoUrl: text("repo_url").notNull().unique(),
  techStack: jsonb("tech_stack").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const readmeVersions = pgTable("readme_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  markdownContent: text("markdown_content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
