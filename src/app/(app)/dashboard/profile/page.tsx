import { SignOutButton } from "@/components/auth";
import { ensureUser } from "@/server/db/ensure-user";
import { getPlanName } from "@/lib/plans";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function formatDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "active":
      return "default";
    case "canceled":
    case "past_due":
      return "destructive";
    default:
      return "secondary";
  }
}

export default async function ProfilePage() {
  const user = await ensureUser();

  if (!user) {
    return null;
  }

  const subscription = user.subscription;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Profile
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage your account settings
        </p>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.imageUrl ?? undefined} alt={user.name ?? "User"} />
              <AvatarFallback className="text-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                {user.name ?? "No name"}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {user.email}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Member since
              </p>
              <p className="text-zinc-900 dark:text-zinc-50">
                {formatDate(user.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                User ID
              </p>
              <p className="font-mono text-sm text-zinc-900 dark:text-zinc-50">
                {user.id}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Card */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current plan and billing</CardDescription>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Plan
                  </p>
                  <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                    {getPlanName(subscription.priceId)}
                  </p>
                </div>
                <Badge
                  variant={getStatusBadgeVariant(subscription.status)}
                >
                  {subscription.status}
                </Badge>
              </div>
              {subscription.currentPeriodEnd && (
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    {subscription.status === "canceled" ? "Expires" : "Renews"}
                  </p>
                  <p className="text-zinc-900 dark:text-zinc-50">
                    {formatDate(subscription.currentPeriodEnd)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No active subscription. You&apos;re on the free plan.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card>
        <CardHeader>
          <CardTitle>Sign Out</CardTitle>
          <CardDescription>
            Sign out of your account on this device
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignOutButton>
            <Button variant="outline">Sign out</Button>
          </SignOutButton>
        </CardContent>
      </Card>
    </div>
  );
}
