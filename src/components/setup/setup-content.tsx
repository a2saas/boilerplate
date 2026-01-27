import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { type ConfigStatus, type DbConnectionResult } from "@/lib/config-status";

function ProductBadge({
  name,
  faviconUrl,
  href,
}: {
  name: string;
  faviconUrl: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
    >
      <Image
        src={faviconUrl}
        alt={name}
        width={14}
        height={14}
        className="rounded-sm"
      />
      {name}
    </a>
  );
}

function StatusIcon({ configured }: { configured: boolean }) {
  if (configured) {
    return <Check className="h-4 w-4 text-green-600 dark:text-green-400" />;
  }
  return <X className="h-4 w-4 text-red-600 dark:text-red-400" />;
}

function RequiredBadge({ required }: { required: boolean }) {
  if (required) {
    return (
      <Badge
        variant="outline"
        className="border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
      >
        Required
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-500"
    >
      Optional
    </Badge>
  );
}

function ConfigRow({
  label,
  required,
  configured,
}: {
  label: string;
  required: boolean;
  configured: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <StatusIcon configured={configured} />
        <span className="font-mono text-sm">{label}</span>
      </div>
      <RequiredBadge required={required} />
    </div>
  );
}

interface SetupContentProps {
  config: ConfigStatus;
  dbResult: DbConnectionResult;
}

export function SetupContent({ config, dbResult }: SetupContentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Setup Status
        </h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Verify your environment configuration
        </p>
      </div>

      {/* Database */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Database</CardTitle>
            <ProductBadge
              name="Neon"
              faviconUrl="https://www.google.com/s2/favicons?domain=neon.tech&sz=32"
              href="https://neon.tech"
            />
          </div>
          <CardDescription>
            Serverless PostgreSQL for data storage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            <ConfigRow
              label="DATABASE_URL"
              required={true}
              configured={config.database}
            />
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <StatusIcon configured={dbResult.connected} />
                <span className="text-sm">Connection Test</span>
              </div>
              <RequiredBadge required={true} />
            </div>
          </div>
          {!dbResult.connected && dbResult.error && (
            <div className="mt-3 rounded-md bg-red-50 p-3 dark:bg-red-950">
              <p className="text-sm text-red-700 dark:text-red-300">
                {dbResult.error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Authentication */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Authentication</CardTitle>
            <ProductBadge
              name="Clerk"
              faviconUrl="https://www.google.com/s2/favicons?domain=clerk.com&sz=32"
              href="https://clerk.com"
            />
          </div>
          <CardDescription>
            User sign-up, sign-in, and session management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            <ConfigRow
              label="CLERK_SECRET_KEY"
              required={true}
              configured={config.clerk}
            />
            <ConfigRow
              label="NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
              required={true}
              configured={config.clerkPublishable}
            />
            <ConfigRow
              label="CLERK_WEBHOOK_SECRET"
              required={false}
              configured={config.clerkWebhook}
            />
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Webhook is optional for development. Users are provisioned
            on-demand when they first authenticate.
          </p>
        </CardContent>
      </Card>

      {/* Payments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payments</CardTitle>
            <ProductBadge
              name="Stripe"
              faviconUrl="https://www.google.com/s2/favicons?domain=stripe.com&sz=32"
              href="https://stripe.com"
            />
          </div>
          <CardDescription>
            Subscriptions and payment processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            <ConfigRow
              label="STRIPE_SECRET_KEY"
              required={true}
              configured={config.stripe}
            />
            <ConfigRow
              label="STRIPE_WEBHOOK_SECRET"
              required={false}
              configured={config.stripeWebhook}
            />
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Webhook is required for production to sync subscription status.
          </p>
        </CardContent>
      </Card>

      {/* Email */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Email</CardTitle>
            <ProductBadge
              name="Resend"
              faviconUrl="https://www.google.com/s2/favicons?domain=resend.com&sz=32"
              href="https://resend.com"
            />
          </div>
          <CardDescription>Transactional email delivery</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            <ConfigRow
              label="RESEND_API_KEY"
              required={true}
              configured={config.resend}
            />
          </div>
        </CardContent>
      </Card>

      {/* App Config */}
      <Card>
        <CardHeader>
          <CardTitle>App Configuration</CardTitle>
          <CardDescription>General application settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            <ConfigRow
              label="NEXT_PUBLIC_APP_URL"
              required={true}
              configured={config.appUrl}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
