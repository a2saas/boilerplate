import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";
import { ensureUser } from "@/server/db/ensure-user";
import { getConfigStatus } from "@/lib/config-status";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await ensureUser();
  const config = getConfigStatus();

  const categories = [
    { name: "Database", configured: config.database },
    { name: "Authentication", configured: config.clerk && config.clerkPublishable },
    { name: "Payments", configured: config.stripe },
    { name: "Email", configured: config.resend },
    { name: "App Config", configured: config.appUrl },
  ];

  const configuredCount = categories.filter((c) => c.configured).length;
  const allConfigured = configuredCount === categories.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
        </p>
      </div>

      {/* Setup Progress */}
      {!allConfigured && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Setup Progress</CardTitle>
            <CardDescription>
              {configuredCount} of {categories.length} services configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name} className="flex items-center gap-2 text-sm">
                  {category.configured ? (
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <X className="h-4 w-4 text-zinc-400" />
                  )}
                  <span
                    className={
                      category.configured
                        ? "text-zinc-600 dark:text-zinc-400"
                        : "text-zinc-900 dark:text-zinc-50"
                    }
                  >
                    {category.name}
                  </span>
                </li>
              ))}
            </ul>
            <Button variant="outline" asChild className="mt-4 w-full">
              <Link href="/setup" className="flex items-center gap-2">
                Complete Setup
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Placeholder Card */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            This is your dashboard home page. Customize it to fit your needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            This is a placeholder page. Replace this content with your
            application&apos;s dashboard features like stats, recent activity,
            quick actions, or anything else your users need.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
