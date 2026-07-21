import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-6 text-center">
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-border bg-muted/50">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>

      {/* Heading */}
      <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        404 - Page Not Found
      </h1>

      {/* Message */}
      <p className="mb-8 max-w-md text-sm text-muted-foreground sm:text-base">
        Opps! Jis page ko aap dhoondhne ki koshish kar rahe hain wo exist nahi
        karta ya URL galat hai.
      </p>

      {/* Back to Home Button */}
      <Link href="/">
        <Button className="gap-2 font-medium cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
