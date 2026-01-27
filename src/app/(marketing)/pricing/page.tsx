import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { plans } from "@/lib/plans";
import { siteConfig } from "@/lib/site";

const faqs = [
  {
    question: `Is ${siteConfig.name} really free?`,
    answer:
      "Yes. Clone the repo and build whatever you want. Full source code under MIT license. No catch, no hidden fees.",
  },
  {
    question: "What is Insights & Automation?",
    answer:
      "A separate add-on we're building—not part of the boilerplate. An AI-powered dashboard for SaaS metrics, insights, and automated workflows like churn prevention and trial conversion.",
  },
  {
    question: `Do I need the paid tier to use ${siteConfig.name}?`,
    answer:
      "No. The boilerplate is complete on its own. Insights & Automation is for after you've launched—when you want help growing your business.",
  },
  {
    question: `Do I need to credit ${siteConfig.name}?`,
    answer:
      "No. MIT license means you own your code. Use it for client projects, startups, side projects—whatever you want.",
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-24 py-12">
      {/* Hero */}
      <section className="space-y-6 text-center">
        <Badge variant="secondary" className="text-xs font-medium uppercase tracking-wider">
          Open Source SaaS Template
        </Badge>
        <h1 className="font-heading text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Free and Open Source
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          {siteConfig.name} is free and open source. This page serves as a
          template. Change your pricing tiers and product descriptions after
          cloning the repo.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="space-y-8">
        <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
          {plans.map((plan) => {
            const isComingSoon = plan.price === "Coming Soon";
            const isFreeTier = plan.id === "boilerplate";

            return (
              <Card
                key={plan.id}
                className={
                  plan.highlighted
                    ? "border border-zinc-900 dark:border-zinc-50 relative"
                    : "border border-border"
                }
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Start Here</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {plan.period}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                        <span className="text-zinc-600 dark:text-zinc-400">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isFreeTier ? (
                    <Button asChild className="w-full">
                      <Link href={siteConfig.github}>Clone the Repo</Link>
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant="outline"
                      disabled={isComingSoon}
                    >
                      Coming Soon
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-8">
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
      <section className="space-y-6 text-center">
        <h2 className="font-heading text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Start Building
        </h2>
        <p className="mx-auto max-w-xl text-zinc-600 dark:text-zinc-400">
          Clone the repo and start building from a production-ready SaaS
          starting point with auth, billing, database, and email.
        </p>
        <Button asChild size="lg">
          <Link href={siteConfig.github}>Clone the Repo</Link>
        </Button>
      </section>
    </div>
  );
}
