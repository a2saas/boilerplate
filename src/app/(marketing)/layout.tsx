import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site";

// Lazy-load mobile menu - code-split for smaller initial bundle
const MobileMenu = dynamic(() =>
  import("@/components/marketing/mobile-menu").then((mod) => mod.MobileMenu)
);

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
        <Link
          href="/"
          className="font-heading text-2xl font-semibold text-zinc-900 dark:text-zinc-50"
        >
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-2">
          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 sm:flex">
            {navLinks.map((link) => (
              <Button key={link.href} variant="ghost" size="sm" asChild>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </nav>

          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/sign-in">Sign in</Link>
          </Button>

          <ThemeToggle />

          {/* Mobile menu - client component */}
          <MobileMenu siteName={siteConfig.name} navLinks={navLinks} />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16">{children}</main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <span className="font-heading text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {siteConfig.name}
            </span>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                href="/features"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Features
              </Link>

              <Link
                href="/pricing"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Blog
              </Link>
              <Link
                href="/setup"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Setup
              </Link>
              <Link
                href="/sign-in"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
