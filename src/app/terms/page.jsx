import Navbar from "@/components/Navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <Navbar />
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-orange-500 mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-muted-foreground mb-8">
          Last updated: July 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">
              1. Acceptance of Terms
            </h2>
            <p>
              By creating an account or accessing RepoScribe, you agree to
              comply with these Terms of Service. If you do not agree to these
              terms, please do not access or use our services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">
              2. Description of Service
            </h2>
            <p>
              RepoScribe provides developers with automated AI-assisted
              documentation tools, direct GitHub integration, live README
              previewing, and workspace management tools.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">
              3. Account & Content Responsibilities
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              Clerk authentication credentials and for any activity that occurs
              under your account. You retain ownership of all code repositories
              and content submitted for README generation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">
              4. Pro Subscription & Payments
            </h2>
            <p>
              Paid plans are billed in advance on a recurring monthly or annual
              basis via Razorpay. All fees are exclusive of applicable taxes
              unless stated otherwise.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">
              5. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate
              system usage bounds, perform unauthorized scraping, or misuse our
              AI infrastructure.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
