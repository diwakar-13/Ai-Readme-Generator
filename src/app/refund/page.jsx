import Navbar from "@/components/Navbar";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <Navbar />
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-orange-500 mb-2">
          Cancellation & Refund Policy
        </h1>
        <p className="text-xs text-muted-foreground mb-8">
          Last updated: July 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">
              1. Subscription Cancellation
            </h2>
            <p>
              Users can cancel their RepoScribe Pro subscription at any time
              directly through their account settings page or by reaching out to
              our support team. Upon cancellation, your subscription will remain
              active until the end of your current billing cycle, after which
              your account will revert to the Free tier without additional
              charges.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">
              2. Refund Eligibility Window
            </h2>
            <p>
              We offer a <strong>7-day money-back guarantee</strong> for new Pro
              plan subscriptions. If you are unsatisfied with our AI generation
              features or experience technical disruptions, you can request a
              full refund within 7 calendar days of your transaction.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">
              3. Refund Request Process
            </h2>
            <p>
              To initiate a refund, please send an email to{" "}
              <strong className="text-foreground">
                diwakarpandey673@gmail.com
              </strong>{" "}
              with your registered account email, Razorpay payment reference ID,
              and a brief reason for the cancellation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">
              4. Refund Processing Time
            </h2>
            <p>
              Once approved, refunds are initiated immediately. The refunded
              amount will be credited back to your original payment method (Bank
              Account, UPI, Credit/Debit Card) within{" "}
              <strong>5 to 7 business days</strong> as per banking network
              standards.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
