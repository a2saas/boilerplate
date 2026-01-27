"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileSidebar } from "./mobile-sidebar";
import { UserMenu } from "./user-menu";
import { siteConfig } from "@/lib/site";

interface HeaderProps {
  user: {
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex h-14 items-center gap-4 px-4">
        {/* Mobile menu trigger */}
        <MobileSidebar />

        {/* Logo (mobile only) */}
        <Link
          href="/"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 md:hidden"
        >
          {siteConfig.name}
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Theme toggle */}
        <ThemeToggle />

        {/* User menu */}
        <UserMenu user={user} />
      </div>
    </header>
  );
}
