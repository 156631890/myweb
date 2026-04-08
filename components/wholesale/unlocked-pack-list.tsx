import Link from "next/link";
import { catalogPacks } from "@/lib/catalog-packs";

interface UnlockedPackListProps {
  unlockedPackIds: string[];
}

export function UnlockedPackList({ unlockedPackIds }: UnlockedPackListProps) {
  const unlockedPacks = catalogPacks.filter((pack) => unlockedPackIds.includes(pack.id));

  if (unlockedPacks.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[32px] border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">Unlocked after inquiry</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">Additional catalog packs</h2>
        </div>
        <Link href="/products" className="text-sm text-gold transition-colors hover:text-foreground">
          Browse the public directory
        </Link>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {unlockedPacks.map((pack) => (
          <article key={pack.id} className="rounded-[24px] border border-border bg-background p-5">
            <p className="text-[10px] tracking-[0.26em] uppercase text-text-muted">
              {pack.id} / {pack.itemCount} items
            </p>
            <h3 className="mt-3 text-2xl">{pack.title}</h3>
            <p className="mt-2 text-sm leading-7 text-text-muted">{pack.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
