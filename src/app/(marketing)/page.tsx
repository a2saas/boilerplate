import Link from "next/link";
import { ArrowRight, Zap, Shield, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";

// Terminal window wrapper for visual components
function TerminalWindow({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="hidden md:block w-56 shrink-0 self-start translate-y-4 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-xl dark:shadow-[0_8px_30px_rgba(180,140,50,0.15)]">
      <div className="flex items-center gap-1.5 border-b border-zinc-800 px-3 py-2">
        <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
        <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
        <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
        <span className="ml-2 text-xs text-zinc-500">{title}</span>
      </div>
      <div className="p-4 pb-8">{children}</div>
    </div>
  );
}

// Visual component for Card 1: Status lights
function StatusLightsVisual() {
  const services = ["Database", "Auth", "Payments", "Email"];
  return (
    <TerminalWindow title="status">
      <div className="flex flex-col gap-2">
        {services.map((service) => (
          <div
            key={service}
            className="flex items-center justify-between gap-4"
          >
            <span className="text-sm text-zinc-400">{service}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-green-500">Active</span>
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            </div>
          </div>
        ))}
      </div>
    </TerminalWindow>
  );
}

// Visual component for Card 2: API Routes
function ApiRoutesVisual() {
  return (
    <TerminalWindow title="api">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded bg-green-900/50 px-1.5 py-0.5 text-[11px] font-medium text-green-400">
            POST
          </span>
          <span className="text-sm text-zinc-400">/checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-blue-900/50 px-1.5 py-0.5 text-[11px] font-medium text-blue-400">
            GET
          </span>
          <span className="text-sm text-zinc-400">/users/me</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-purple-900/50 px-1.5 py-0.5 text-[11px] font-medium text-purple-400">
            WEBHOOK
          </span>
          <span className="text-sm text-zinc-400">/clerk</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-purple-900/50 px-1.5 py-0.5 text-[11px] font-medium text-purple-400">
            WEBHOOK
          </span>
          <span className="text-sm text-zinc-400">/stripe</span>
        </div>
      </div>
    </TerminalWindow>
  );
}

// Visual component for Card 3: File structure
function FileStructureVisual() {
  return (
    <TerminalWindow title="src/">
      <div className="flex flex-col gap-1 font-mono text-xs leading-relaxed text-zinc-300">
        <span>├─ app/</span>
        <span className="text-zinc-500">│&nbsp;&nbsp;├─ (auth)/</span>
        <span className="text-zinc-500">│&nbsp;&nbsp;├─ (marketing)/</span>
        <span className="text-zinc-500">│&nbsp;&nbsp;└─ (app)/</span>
        <span>├─ components/</span>
        <span>├─ server/db/</span>
        <span>└─ lib/</span>
      </div>
    </TerminalWindow>
  );
}

const featureBlocks = [
  {
    id: "saas-essentials",
    title: "Wired Up, Ready to Go",
    description:
      "Auth, payments, database, and email—configured and talking to each other. Webhooks keep everything in sync. Swap providers without rewriting your app.",
    icon: Zap,
    visual: StatusLightsVisual,
  },
  {
    id: "context-window",
    title: "Built for the Context Window Era",
    description:
      "We keep the file structure flat and the abstractions obvious. No hidden logic or magic imports means your AI assistant can read the whole project context and modify it accurately.",
    icon: Brain,
    visual: FileStructureVisual,
  },
  {
    id: "type-safe",
    title: "The Stack Your AI Already Knows",
    description:
      "The most widely adopted technologies optimized for AI performance. Next.Js with schema in code, and Zod validation. Tailwind + Shadcn + React Email = the largest ecosystem of proven & ready-to-deploy components, blocks & templates.",
    icon: Shield,
    visual: ApiRoutesVisual,
  },
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function LatestArticles() {
  const posts = getAllPosts().slice(0, 3);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-8 border-t border-foreground/10 pt-24">
      <div className="text-center">
        <h2 className="font-heading text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Latest Articles & Updates
        </h2>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="h-full transition-colors hover:border-zinc-400 dark:hover:border-zinc-600">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="text-base line-clamp-2">
                  {post.description}
                </CardDescription>
              </CardHeader>
              {post.tags.length > 0 && (
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </Link>
        ))}
      </div>
      <div className="text-center">
        <Button variant="outline" asChild size="lg">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            View all articles
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center space-y-8 text-center py-0 md:py-24 min-h-[calc(100dvh-5rem)]  md:min-h-[60vh] ">
        <Badge
          variant="secondary"
          className="text-xs font-medium uppercase tracking-wider"
        >
          Open Source SaaS Template
        </Badge>
        <h1 className="font-heading text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 lg:text-6xl">
          The SaaS Boilerplate{" "}
          <span className="whitespace-nowrap">AI Loves</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
          Auth, payments, data and email in a predictable, type-safe
          architecture designed for a clean context window and optimized AI
          performance.
        </p>
        <div className="flex w-full flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              Clone the Repo
            </a>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/features">
              Explore Features
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Everything You Need, Nothing You Don't */}
      <section
        id="features"
        className="space-y-8 border-t border-foreground/10 pt-24"
      >
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Everything You Need,{" "}
            <span className="whitespace-nowrap">Nothing You Don&apos;t</span>
          </h2>
        </div>
        <div className="grid gap-6">
          {featureBlocks.map((block) => (
            <Card
              key={block.id}
              className="sm:max-h-72 md:max-h-52 overflow-hidden "
            >
              <CardContent>
                <div className="flex items-start justify-between gap-8">
                  <div className="md:flex items-start gap-4">
                    <div className=" flex h-12 w-12 mb-2 shrink-0 items-center justify-center rounded-lg bg-muted dark:bg-zinc-800">
                      <block.icon className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-xl ">{block.title}</CardTitle>
                      <CardDescription className="text-base">
                        {block.description}
                      </CardDescription>
                    </div>
                  </div>
                  <block.visual />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Button variant="outline" asChild>
            <Link href="/features">
              Explore Features
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Blog Section */}
      <LatestArticles />

      {/* CTA Section */}
      <section className="space-y-6 border-t border-foreground/10 pt-24 text-center">
        <h2 className="font-heading text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Ready to Build?
        </h2>
        <p className="mx-auto max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Clone the repo and start building with a type-safe, AI-native
          foundation with auth, billing, database, and email.
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
          <Button variant="outline" asChild size="lg">
            <Link href="/features">
              Explore Features
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
