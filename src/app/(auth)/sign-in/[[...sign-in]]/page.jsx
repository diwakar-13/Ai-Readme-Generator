import { SignIn } from "@clerk/nextjs";
import AnoAI from "@/components/AnoAIBackground";
import { Sparkles, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground dark:bg-black dark:text-white selection:bg-orange-500/30">
      {/* 🌟 3D WebGL Background */}
      <AnoAI />

      {/* Grid Container */}
      <div className="relative z-10 min-h-screen w-full grid grid-cols-1 lg:grid-cols-12">
        {/* ─── LEFT HERO BRANDING (Hidden on Mobile) ─── */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-12 border-r border-border bg-muted/20 dark:bg-neutral-950/40 backdrop-blur-md">
          {/* Logo */}
          <Link href={"/"} className="cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl">
                <Image
                  src="/logo.png"
                  alt="logo"
                  height={50}
                  width={50}
                  priority
                />
              </div>
              <span className="text-xl font-black text-foreground dark:text-white">
                Repo<span className="text-orange-500">Scribe</span>
              </span>
            </div>
          </Link>

          {/* Center Showcase Content */}
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-semibold text-orange-500 dark:text-orange-400">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Welcome Back, Developer</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] text-foreground dark:text-white">
              Ready to generate your next{" "}
              <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-700 dark:from-orange-400 dark:via-orange-500 dark:to-orange-900 bg-clip-text text-transparent">
                README?
              </span>
            </h1>

            <p className="text-md text-muted-foreground dark:text-neutral-400 leading-relaxed">
              Sign in to access your saved repository projects, custom markdown
              editor workspace, and direct GitHub commit integrations.
            </p>

            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-xs text-foreground/80 dark:text-neutral-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                <span>Instant Markdown Copy & Direct Repository Commit</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground/80 dark:text-neutral-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                <span>Custom Section Customization & Live Previews</span>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <p className="text-xs text-muted-foreground dark:text-neutral-600 font-mono">
            © {new Date().getFullYear()} RepoScribe Inc. All rights reserved.
          </p>
        </div>

        {/* ─── RIGHT SIDE: CUSTOM CLERK FORM ─── */}
        <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <SignIn
              appearance={{
                elements: {
                  devModeBadge: "hidden",

                  // Ultra-Modern Glass Card
                  card: "bg-card/90 dark:bg-neutral-900/80 border border-border dark:border-neutral-800 shadow-[0_0_50px_-12px_rgba(249,115,22,0.15)] rounded-2xl backdrop-blur-2xl p-6 sm:p-8 text-card-foreground",

                  // Typography
                  headerTitle: "text-foreground dark:text-white font-black text-2xl tracking-tight",
                  headerSubtitle: "text-muted-foreground dark:text-neutral-400 text-xs mt-1",

                  // Social Login Buttons
                  socialButtonsBlockButton:
                    "bg-muted/60 dark:bg-neutral-800/80 hover:bg-muted dark:hover:bg-neutral-800 border-border dark:border-neutral-700/80 text-foreground dark:text-white font-semibold text-xs py-2.5 rounded-xl transition-all active:scale-[0.98]",
                  socialButtonsBlockButtonText:
                    "text-foreground dark:text-neutral-200 font-medium text-xs",

                  dividerRow: "my-5",
                  dividerLine: "bg-border dark:bg-neutral-800",
                  dividerText:
                    "text-muted-foreground dark:text-neutral-500 font-mono text-[10px] uppercase",

                  // Form Elements
                  formFieldLabel:
                    "text-foreground/80 dark:text-neutral-300 font-mono text-[11px] uppercase tracking-wider mb-1.5",
                  formFieldInput:
                    "bg-background/90 dark:bg-black/90 border-border dark:border-neutral-800 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-neutral-600 focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/50 rounded-xl px-4 py-3 text-sm transition-all shadow-inner",

                  // Primary CTA Button
                  formButtonPrimary:
                    "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-extrabold text-sm py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-[0.99] cursor-pointer mt-2",

                  // Links
                  footerActionLink:
                    "text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 font-semibold text-xs underline-offset-4 hover:underline",
                  footerActionText: "text-muted-foreground dark:text-neutral-400 text-xs",
                  identityPreviewText: "text-foreground dark:text-white font-semibold",
                  identityPreviewEditButton:
                    "text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 text-xs",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}