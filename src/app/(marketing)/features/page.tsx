import Link from "next/link";
import {
  Zap,
  Shield,
  Database,
  CreditCard,
  Mail,
  ArrowRight,
  ExternalLink,
  Check,
  X,
  FileCode,
} from "lucide-react";
import { getConfigStatus } from "@/lib/config-status";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const technologies = [
  {
    id: "framework",
    title: "Framework",
    provider: "Next.js 16 + Zod",
    icon: Zap,
    tagline:
      "App Router, Server Actions, Turbopack. End-to-end type safety with runtime validation.",
    swappable: false,
    docsUrl: "https://nextjs.org/docs",
  },
  {
    id: "ui",
    title: "UI",
    provider: "Tailwind + shadcn",
    icon: FileCode,
    tagline:
      "Compose beautiful interfaces with the building blocks your AI was trained on.",
    swappable: false,
    docsUrl: "https://ui.shadcn.com/docs",
  },
  {
    id: "data",
    title: "Data",
    provider: "Drizzle + Neon",
    icon: Database,
    tagline:
      "Type-safe ORM and serverless PostgreSQL. Schema defined in one code file, so agents understand data immediately.",
    swappable: true,
    docsUrl: "https://orm.drizzle.team/docs/overview",
  },
  {
    id: "auth",
    title: "Auth",
    provider: "Clerk",
    icon: Shield,
    tagline:
      "Vendor-lock removed. We wrap Clerk in a clean abstraction layer, keeping business logic decoupled.",
    swappable: true,
    docsUrl: "https://clerk.com/docs",
  },

  {
    id: "payments",
    title: "Payments",
    provider: "Stripe",
    icon: CreditCard,
    tagline: "Webhooks wired, subscriptions synced. Just set your prices.",
    swappable: true,
    docsUrl: "https://stripe.com/docs",
  },
  {
    id: "email",
    title: "Email",
    provider: "Resend",
    icon: Mail,
    tagline:
      "Email with high deliverability. No SMTP config or ugly HTML strings—just clean React components.",
    swappable: true,
    docsUrl: "https://resend.com/docs",
  },
];

const faqs = [
  {
    question: `Is ${siteConfig.name} free?`,
    answer: `Yes, completely free and open source under MIT. Clone it, modify it, ship it. The only costs are the services you use (Clerk, Stripe, Neon, Resend)—and most have generous free tiers.`,
  },
  {
    question: "Can I swap out services?",
    answer: `Yes. Auth is already abstracted—swap Clerk for Auth.js by changing one adapter. Want Supabase instead of Neon? The Drizzle schema is portable. We chose these services for developer experience, but you're not locked in.`,
  },
  {
    question: "How do I deploy this?",
    answer:
      "Push to GitHub, connect to Vercel. Neon is serverless, so no database configuration needed. Set your environment variables, configure webhooks, and you're live. The /setup page shows you what's configured.",
  },
  {
    question: "What's included vs what do I add?",
    answer: `Included: Auth flow, user sync, subscription management, email templates, dashboard layout, protected routes, and CLAUDE.md for your AI assistant. You add: Your product features and business logic. We handle the infrastructure.`,
  },
  {
    question: "Why these specific technologies?",
    answer:
      "Type safety and AI compatibility. Next.js 16 for Server Actions. Drizzle for TypeScript-first schemas. Zod for runtime validation. The whole codebase is structured so AI assistants can read it once and build with confidence.",
  },
];

function SetupStatusSection() {
  const config = getConfigStatus();

  const categories = [
    { name: "Database", configured: config.database },
    {
      name: "Authentication",
      configured: config.clerk && config.clerkPublishable,
    },
    { name: "Payments", configured: config.stripe },
    { name: "Email", configured: config.resend },
    { name: "App Config", configured: config.appUrl },
  ];

  const configuredCount = categories.filter((c) => c.configured).length;

  return (
    <section className="space-y-8 border-t border-foreground/10 pt-24">
      <div className="text-center">
        <h2 className="font-heading text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Setup Status
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Includes a Setup Status Widget, whowing the services configured and
          active.
        </p>
      </div>
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6">
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {categories.map((category) => (
              <li
                key={category.name}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <span className="text-zinc-900 dark:text-zinc-50">
                  {category.name}
                </span>
                {category.configured ? (
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Button variant="outline" asChild className="w-full">
              <Link href="/setup" className="flex items-center gap-2">
                View Full Setup Status
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default function FeaturesPage() {
  return (
    <div className="space-y-24 py-0 md:py-12">
      {/* Hero */}
      <section className="flex  flex-col items-center justify-center space-y-6 text-center md:min-h-[60vh] min-h-[70vh]">
        <Badge
          variant="secondary"
          className="text-xs font-medium uppercase tracking-wider"
        >
          Open Source SaaS Template
        </Badge>
        <h1 className="font-heading mx-auto max-w-2xl text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Built for AI Agents{" "}
          <span className="text-muted-foreground">and Discerning Humans</span>
        </h1>
        <p className="hidden mx-auto max-w-2xl text-xl text-zinc-600 dark:text-zinc-400">
          Type-safe and context efficient. No bloat.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              Clone the Repo
            </a>
          </Button>
        </div>
      </section>

      {/* Architecture */}
      <section className="space-y-8 border-t border-foreground/10 pt-24">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Agent-Scannable Architecture
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Three route groups. Two database tables. Zero magic.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">(marketing)</CardTitle>
              <CardDescription>Public pages</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
              Landing, pricing, features. Shared header and footer layout. No
              auth required.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">(auth)</CardTitle>
              <CardDescription>Sign in & sign up</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
              Minimal layout with just a logo. Clerk handles the forms.
              Redirects to dashboard on success.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">(app)</CardTitle>
              <CardDescription>Protected dashboard</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
              Sidebar navigation layout. Auth required via middleware. Your
              product lives here.
            </CardContent>
          </Card>
        </div>
        <Card className="border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
          <CardContent className="pt-0">
            <div className="text-center">
              <p className="text-zinc-600 dark:text-zinc-400">
                <strong className="text-zinc-900 dark:text-zinc-50">
                  Database:
                </strong>{" "}
                Two tables —{" "}
                <code className="rounded bg-muted px-1 ">users</code> and{" "}
                <code className="rounded  px-1 bg-muted">subscriptions</code>.
                That&apos;s it. Add your own tables as you build.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Technology Deep Dives */}
      <section className="space-y-6 border-t border-foreground/10 pt-24">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            The Stack
          </h2>
          <p className="mt-2 max-w-4xl mx-auto text-zinc-600 dark:text-zinc-400">
            A collection of the industries most widely adopted technologies,
            implemented for developer and AI agent experience. Popular data,
            auth, email and payments - wired and working, but easily swappable
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {technologies.map((tech) => (
            <Card key={tech.id} id={tech.id} className="scroll-mt-24">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center bg-muted justify-center rounded-lg">
                      <tech.icon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tech.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {tech.provider}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={tech.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-muted-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {tech.tagline}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Folder Structure */}
      <section className="space-y-8 border-t border-foreground/10 pt-24">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Optimized Project Structure
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Designed for context window efficiency. Logic is colocated,
            distinct, and predictable.
          </p>
        </div>
        <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-2 text-sm text-zinc-400">src/</span>
          </div>
          <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-zinc-300">
            <code>{`src/
├── app/
│   ├── (auth)/                   # Auth routes (minimal layout)
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (marketing)/              # Public routes (landing, pricing)
│   │   ├── layout.tsx            # Shared header/footer
│   │   ├── page.tsx              # Landing page
│   │   └── pricing/page.tsx      # Pricing page
│   ├── (app)/                    # Protected routes (dashboard)
│   │   ├── layout.tsx            # Sidebar layout
│   │   └── dashboard/
│   │       ├── page.tsx          # Dashboard home
│   │       └── profile/page.tsx  # User profile
│   ├── setup/page.tsx            # Setup status page
│   └── api/
│       ├── v1/                   # Versioned API routes
│       └── webhooks/             # Clerk & Stripe webhooks
├── components/
│   ├── auth/                     # Auth abstraction components
│   ├── dashboard/                # Dashboard layout components
│   └── ui/                       # Shadcn components
├── server/db/
│   ├── index.ts                  # Drizzle client
│   ├── schema.ts                 # Table definitions
│   └── ensure-user.ts            # User provisioning helper
├── lib/
│   ├── auth/                     # Auth abstraction layer
│   ├── api.ts                    # API response helpers
│   ├── plans.ts                  # Subscription plans
│   ├── stripe.ts                 # Stripe client
│   └── resend.ts                 # Email client
├── env.ts                        # Type-safe env validation
└── proxy.ts                      # Auth middleware`}</code>
          </pre>
        </div>
      </section>

      {/* Environment Variables */}
      <section className="space-y-8 border-t border-foreground/10 pt-24">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Environment Variables
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Copy <code className="rounded bg-muted px-1">.env.example</code> to{" "}
            <code className="rounded bg-muted px-1">.env.local</code> and fill
            these in
          </p>
        </div>
        <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-2 text-sm text-zinc-400">.env.local</span>
          </div>
          <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-zinc-300">
            <code>{`# Database
DATABASE_URL=                    # Neon PostgreSQL connection string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=   # Clerk publishable key
CLERK_SECRET_KEY=                # Clerk secret key
CLERK_WEBHOOK_SECRET=            # Clerk webhook signing secret

# Stripe Payments
STRIPE_SECRET_KEY=               # Stripe secret key
STRIPE_WEBHOOK_SECRET=           # Stripe webhook signing secret

# Email
RESEND_API_KEY=                  # Resend API key

# App Config
NEXT_PUBLIC_APP_URL=             # Your app URL (e.g., http://localhost:3000)`}</code>
          </pre>
        </div>
      </section>

      {/* Scripts */}
      <section className="space-y-8 border-t border-foreground/10 pt-24">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Scripts
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Common commands you&apos;ll use
          </p>
        </div>
        <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-2 text-sm text-zinc-400">terminal</span>
          </div>
          <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-zinc-300">
            <code>{`npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run typecheck    # Run TypeScript type checking
npm run lint         # Run ESLint
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio`}</code>
          </pre>
        </div>
      </section>

      {/* API Routes */}
      <section className="space-y-8 border-t border-foreground/10 pt-24">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            API Routes
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            What&apos;s already wired up
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">REST API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <code className="shrink-0 rounded bg-green-100 px-1.5 py-0.5 text-green-800 dark:bg-green-900 dark:text-green-200">
                    POST
                  </code>
                  <div>
                    <code className="text-zinc-900 dark:text-zinc-50">
                      /api/v1/checkout
                    </code>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Create Stripe checkout session
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <code className="shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    GET
                  </code>
                  <div>
                    <code className="text-zinc-900 dark:text-zinc-50">
                      /api/v1/users/me
                    </code>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Get current user with subscription
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <code className="shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    GET
                  </code>
                  <div>
                    <code className="text-zinc-900 dark:text-zinc-50">
                      /api/v1/debug/health
                    </code>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Health check with env status
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Webhooks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <code className="shrink-0 rounded bg-purple-100 px-1.5 py-0.5 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    POST
                  </code>
                  <div>
                    <code className="text-zinc-900 dark:text-zinc-50">
                      /api/webhooks/clerk
                    </code>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Syncs Clerk users to database
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <code className="shrink-0 rounded bg-purple-100 px-1.5 py-0.5 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    POST
                  </code>
                  <div>
                    <code className="text-zinc-900 dark:text-zinc-50">
                      /api/webhooks/stripe
                    </code>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Handles subscription lifecycle
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Files */}
      <section className="space-y-8 border-t border-foreground/10 pt-24">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Key Files
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            The files you&apos;ll work with most often
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
                <FileCode className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" />
                <div>
                  <code className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    src/server/db/schema.ts
                  </code>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Database table definitions (users, subscriptions)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
                <FileCode className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" />
                <div>
                  <code className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    src/server/db/ensure-user.ts
                  </code>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    User provisioning helper for protected pages
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
                <FileCode className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" />
                <div>
                  <code className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    src/lib/auth/
                  </code>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Auth abstraction layer (swappable providers)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
                <FileCode className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" />
                <div>
                  <code className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    src/lib/api.ts
                  </code>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    API response helpers (success, error, handleApiError)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileCode className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" />
                <div>
                  <code className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    src/app/api/webhooks/
                  </code>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Clerk and Stripe webhook handlers
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Setup Status */}
      <SetupStatusSection />

      {/* FAQ */}
      <section className="space-y-8 border-t border-foreground/10 pt-24">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Frequently Asked Questions
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-lg border-none bg-muted px-6"
            >
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-zinc-600 dark:text-zinc-400">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="space-y-6 border-t border-foreground/10 pt-24 text-center">
        <h2 className="font-heading text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Start Building
        </h2>
        <p className="mx-auto max-w-xl text-zinc-600 dark:text-zinc-400">
          Clone the repo and start building from a production-ready SaaS
          starting point with auth, billing, database, and email.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              Clone the Repo
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
