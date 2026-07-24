import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <Navbar />
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-orange-500 mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-muted-foreground mb-8">
          Last updated: July 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">
              1. Data We Collect
            </h2>
            <p>
              We collect minimal user data required to operate RepoScribe
              effectively:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Account Data:</strong> Name and email address
                authenticated via Clerk Auth.
              </li>
              <li>
                <strong>Repository Metadata:</strong> Public GitHub repository
                structures submitted for documentation generation.
              </li>
              <li>
                <strong>Transaction Records:</strong> Order IDs and subscription
                plan statuses processed securely through Razorpay.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">
              2. Payment Security
            </h2>
            <p>
              We do not store, process, or transmit your credit/debit card
              numbers, UPI PINs, or bank credentials. All financial transactions
              are handled end-to-end by Razorpay under PCI-DSS Level 1
              compliance standards.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">
              3. How We Use Data
            </h2>
            <p>
              Your data is strictly utilized to deliver AI documentation
              generation, process plan upgrades, prevent fraud, and send
              transaction alerts via Resend Email. We never sell your personal
              data to third-party advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">4. Contact Us</h2>
            <p>
              If you have any questions regarding your privacy or want your user
              data removed from our databases, contact us at{" "}
              <strong className="text-foreground">
                diwakarpandey410@gmail.com
              </strong>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
