import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft } from "lucide-react";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | ${siteConfig.name}`,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      url: `${siteConfig.url}/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl space-y-8 pt-8 sm:pt-12">
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all articles
          </Link>
        </Button>

        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{post.readingTime}</span>
            <span>·</span>
            <span>{post.author}</span>
          </div>

          <h1 className="font-heading text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {post.title}
          </h1>

          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {post.description}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>
      </div>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-semibold prose-p:text-zinc-900 dark:prose-p:text-zinc-100 prose-li:text-zinc-900 dark:prose-li:text-zinc-100 prose-a:text-zinc-900 prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-zinc-600 dark:prose-a:text-zinc-50 dark:hover:prose-a:text-zinc-300 prose-code:rounded prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-zinc-100 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:bg-zinc-900 prose-pre:text-zinc-50 dark:prose-pre:bg-zinc-950 prose-table:border-collapse prose-th:border prose-th:border-zinc-300 prose-th:bg-zinc-100 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:text-zinc-900 prose-td:border prose-td:border-zinc-300 prose-td:px-4 prose-td:py-2 prose-td:text-zinc-900 dark:prose-th:border-zinc-700 dark:prose-th:bg-zinc-800 dark:prose-th:text-zinc-100 dark:prose-td:border-zinc-700 dark:prose-td:text-zinc-100">
        <MDXRemote source={post.content} />
      </div>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      <div className="flex justify-center pb-8">
        <Button variant="outline" asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all posts
          </Link>
        </Button>
      </div>
    </article>
  );
}
