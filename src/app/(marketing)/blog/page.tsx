import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Blog | ${siteConfig.name}`,
  description:
    "Thoughts on building SaaS products, AI-assisted development, and the modern web stack.",
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description:
      "Thoughts on building SaaS products, AI-assisted development, and the modern web stack.",
    type: "website",
    url: `${siteConfig.url}/blog`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog | ${siteConfig.name}`,
    description:
      "Thoughts on building SaaS products, AI-assisted development, and the modern web stack.",
  },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="space-y-12">
      <section className="space-y-4 pt-12 text-center sm:pt-16">
        <Badge variant="secondary" className="text-xs font-medium uppercase tracking-wider">
          Open Source SaaS Template
        </Badge>
        <h1 className="font-heading text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 lg:text-5xl">
          Latest Articles &amp; Updates
        </h1>
      </section>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-muted px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-zinc-600 dark:text-zinc-400">
            No posts yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="transition-colors hover:border-zinc-400 dark:hover:border-zinc-600">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span>·</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                {post.tags.length > 0 && (
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
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
      )}
    </div>
  );
}
