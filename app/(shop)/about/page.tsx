import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";

const principles = [
  {
    icon: Sparkles,
    title: "Editorial merchandising",
    text: "Collections are arranged like an online magazine: clear hierarchy, strong whitespace, and product stories that do not fight the layout.",
  },
  {
    icon: ShieldCheck,
    title: "Authenticity and sourcing",
    text: "Every product page carries origin, material, and source metadata so buyers can review the item before they enquire or share it.",
  },
  {
    icon: Truck,
    title: "Retail and wholesale",
    text: "Retail customers can shop directly while trade buyers use a clean inquiry flow for pricing, minimum order quantities, and follow-up.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
      <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div className="space-y-6">
          <Badge variant="outline">About KUANGTU</Badge>
          <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">A luxury directory designed for discovery</p>
          <h1 className="text-6xl sm:text-7xl">A directory-style platform for retail and trade buyers.</h1>
          <p className="max-w-2xl text-base leading-8 text-text-muted">
            The site is built to behave like a high-end resale directory: products are easy to scan, easy to share, and easy to index for search and generative discovery.
          </p>
          <Link
            href="/wholesale"
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-5 py-3 text-[10px] tracking-[0.24em] uppercase text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
          >
            Start a trade inquiry
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-[32px] border border-border bg-card p-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { value: "6", label: "Categories" },
              { value: "12", label: "Hero products" },
              { value: "2", label: "Buying modes" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-background p-5">
                <div className="text-3xl">{item.value}</div>
                <p className="mt-2 text-[10px] tracking-[0.22em] uppercase text-text-muted">{item.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm leading-7 text-text-muted">
            Content is written to support SEO, GEO, and social sharing. Product pages can travel into Instagram, WhatsApp, and private buyer channels without losing context.
          </p>
        </div>
      </section>

      <section className="mt-16 grid gap-4 lg:grid-cols-3">
        {principles.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-[28px] border border-border bg-card p-6">
              <Icon className="h-5 w-5 text-gold" strokeWidth={1.6} />
              <h2 className="mt-4 text-2xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-text-muted">{item.text}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
