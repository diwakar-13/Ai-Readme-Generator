"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation"; // 👈 1. Hook Imported

const Navbar = () => {
  const { user, isLoaded } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); // 👈 2. Current path read kiya

  // 🎯 Dynamic redirect URL helper
  const pricingHref = `/pricing?redirect=${encodeURIComponent(pathname)}`;

  return (
    <header className="relative z-50 w-full">
      {/* Navbar Container */}
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="relative z-50 flex shrink-0 items-center"
          onClick={() => setIsMenuOpen(false)}
        >
          <h2 className="font-game text-2xl font-bold tracking-wide sm:text-3xl">
            RepoScribe
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          <Link
            href={pricingHref}
            className="text-base font-medium transition-colors dark:hover:text-primary hover:text-black transition-all"
          >
            Pricing
          </Link>

          <Link
            href="/contact-us"
            className="text-base font-medium transition-colors dark:hover:text-primary hover:text-black transition-all"
          >
            Contact us
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 lg:flex">
          <AnimatedThemeToggler />

          {isLoaded && !user && (
            <Link href="/sign-up">
              <Button className="cursor-pointer rounded-full px-6">
                Sign up
              </Button>
            </Link>
          )}

          {isLoaded && user && (
            <>
              <UserButton />
            </>
          )}
        </div>

        {/* Mobile / Tablet Actions */}
        <div className="relative z-50 flex items-center gap-3 lg:hidden">
          <AnimatedThemeToggler />

          {isLoaded && user && <UserButton />}

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-background/60 backdrop-blur-md transition-colors hover:bg-accent"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile + Tablet Menu */}
      {isMenuOpen && (
        <div className="absolute left-4 right-4 top-20 z-40 lg:hidden">
          <div className="mx-auto flex max-w-2xl flex-col gap-2 rounded-2xl border bg-background/90 p-4 shadow-xl backdrop-blur-xl">
            <Link
              href={pricingHref}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-accent"
            >
              Pricing
            </Link>

            <Link
              href="/contact-us"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-accent"
            >
              Contact us
            </Link>

            <div className="my-1 h-px bg-border" />

            {isLoaded && !user && (
              <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full cursor-pointer rounded-xl">
                  Sign up
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
