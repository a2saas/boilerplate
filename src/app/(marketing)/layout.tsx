import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site";

// Lazy-load mobile menu - code-split for smaller initial bundle
const MobileMenu = dynamic(() =>
  import("@/components/marketing/mobile-menu").then((mod) => mod.MobileMenu),
);

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: siteConfig.github, label: "Repository", external: true },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-black">
      {/* Subtle top gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0  h-[50vh]"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 0%, var(--muted) 0%, transparent 70%)",
        }}
      />
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 relative z-10">
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
                {link.external ? (
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href}>{link.label}</Link>
                )}
              </Button>
            ))}
          </nav>

          <ThemeToggle />

          {/* Mobile menu - client component */}
          <MobileMenu siteName={siteConfig.name} navLinks={navLinks} />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16 relative z-10">
        {children}
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="text-center sm:text-left">
              <span className="font-heading text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {siteConfig.name}
              </span>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                Open source SaaS template. Clone, customize, and launch.
              </p>
            </div>
            <nav className="flex flex-wrap justify-center gap-6 text-sm">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
