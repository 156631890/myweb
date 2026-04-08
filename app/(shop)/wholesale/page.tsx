"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { sourceFeeds } from "@/lib/catalog-sources";
import { UnlockedPackList } from "@/components/wholesale/unlocked-pack-list";

const UNLOCK_STORAGE_KEY = "kuangtu-wholesale-unlocked-pack-ids";

export default function WholesalePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    country: "",
    items: "",
    quantity: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState("");
  const [unlockedPackIds, setUnlockedPackIds] = useState<string[]>([]);

  const sourceCount = useMemo(() => sourceFeeds.length, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(UNLOCK_STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setUnlockedPackIds(parsed.filter((value) => typeof value === "string"));
      }
    } catch {
      // Ignore malformed local storage and start fresh.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(UNLOCK_STORAGE_KEY, JSON.stringify(unlockedPackIds));
  }, [unlockedPackIds]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/wholesale-inquiries", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          sourceUrl: sourceFeeds.map((feed) => feed.url).join(", "),
        }),
      });

      const result = (await response.json()) as {
        message?: string;
        inquiryId?: string;
        unlock?: { token?: string; packIds?: string[] };
      };

      if (!response.ok) {
        throw new Error(result.message || "Unable to send inquiry.");
      }

      setStatus("success");
      setMessage(`Inquiry submitted successfully${result.inquiryId ? ` (${result.inquiryId})` : ""}.`);
      setUnlockedPackIds(result.unlock?.packIds ?? []);
      setForm({
        name: "",
        email: "",
        company: "",
        country: "",
        items: "",
        quantity: "",
        notes: "",
      });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to send inquiry.");
    }
  };

  const handleRefreshSources = async () => {
    setRefreshing(true);
    setRefreshMessage("");

    try {
      const response = await fetch("/api/catalog/refresh", { method: "POST" });
      const result = (await response.json()) as {
        refreshedAt?: string;
        count?: number;
        importedCount?: number;
        message?: string;
        lockedFeeds?: string[];
      };

      if (!response.ok) {
        throw new Error(result.message || "Unable to import catalog.");
      }

      setRefreshMessage(
        `Imported ${result.importedCount ?? 0} products from ${result.count ?? sourceCount} source feeds${
          result.refreshedAt ? ` at ${new Date(result.refreshedAt).toLocaleString()}` : ""
        }${result.lockedFeeds?.length ? `; locked feeds: ${result.lockedFeeds.join(", ")}` : ""}.`
      );
    } catch (error) {
      setRefreshMessage(error instanceof Error ? error.message : "Unable to import catalog.");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
      <section className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          <Badge variant="outline">Wholesale inquiry</Badge>
          <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">
            Retail-friendly, trade-ready, and shareable
          </p>
          <h1 className="max-w-xl text-5xl sm:text-6xl">Request trade pricing and unlock additional catalog packs.</h1>
          <p className="max-w-xl text-base leading-8 text-text-muted">
            Use this form to submit a trade inquiry for bags, shoes, jewelry, eyewear, menswear, or womenswear.
            Minimum order quantities, source guidance, and extra catalog packs can be shared in follow-up.
          </p>

          <div className="rounded-[28px] border border-border bg-card p-6 text-sm leading-7 text-text-muted">
            <p className="text-[10px] tracking-[0.24em] uppercase text-text-muted">Trade benefits</p>
            <ul className="mt-4 space-y-3">
              <li>- Trade-focused pricing preview on product pages</li>
              <li>- MOQ support for multi-item orders</li>
              <li>- Inquiry unlock reveals additional catalog packs</li>
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/30 px-5 py-4 text-[10px] tracking-[0.24em] uppercase text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
            >
              Browse catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={handleRefreshSources}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-4 text-[10px] tracking-[0.24em] uppercase text-foreground transition-colors hover:border-gold/30 hover:text-gold"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Import catalog
            </button>
          </div>

          <div className="rounded-[28px] border border-border bg-card p-6 text-sm leading-7 text-text-muted">
            <p className="text-[10px] tracking-[0.24em] uppercase text-text-muted">Connected feeds</p>
            <p className="mt-2">{sourceCount} supplier sources are registered for import and normalization.</p>
          </div>

          {refreshMessage && (
            <div className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text-muted">
              {refreshMessage}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 rounded-[32px] border border-border bg-card p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Company"
                value={form.company}
                onChange={(event) => setForm({ ...form, company: event.target.value })}
              />
              <Input
                label="Country"
                value={form.country}
                onChange={(event) => setForm({ ...form, country: event.target.value })}
              />
            </div>
            <Input
              label="Items of interest"
              value={form.items}
              onChange={(event) => setForm({ ...form, items: event.target.value })}
              placeholder="Sunglasses, bags, shoes..."
              required
            />
            <Input
              label="Estimated quantity"
              value={form.quantity}
              onChange={(event) => setForm({ ...form, quantity: event.target.value })}
              placeholder="Example: 20 units"
            />
            <Textarea
              label="Additional notes"
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              rows={5}
            />

            {message && (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  status === "success"
                    ? "border-gold/25 bg-gold/10 text-foreground"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <Button size="lg" fullWidth type="submit" loading={status === "submitting"}>
              <Mail className="h-4 w-4" />
              Send inquiry
            </Button>
          </form>

          <UnlockedPackList unlockedPackIds={unlockedPackIds} />
        </div>
      </section>
    </div>
  );
}
