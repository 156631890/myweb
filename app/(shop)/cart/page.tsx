"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/badge";
import { useCartStore, useCartTotals } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const { subtotal, shipping, tax, total, amountForFreeShipping } = useCartTotals();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
      <div className="mb-10 space-y-4">
        <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">Cart</p>
        <h1 className="text-6xl sm:text-7xl">Your selected pieces.</h1>
        <p className="max-w-2xl text-base leading-8 text-text-muted">
          Review your retail order or continue into wholesale inquiry if you are building a larger buy.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[28px] border border-border bg-card px-8 py-16 text-center">
          <p className="text-lg text-text-muted">Your cart is empty.</p>
          <Link href="/products" className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[0.24em] uppercase text-gold">
            Browse products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-4 rounded-[28px] border border-border bg-card p-4 sm:p-5">
                <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden rounded-2xl">
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] tracking-[0.22em] uppercase text-text-muted">{item.product.brand}</p>
                      <Link href={`/products/${item.product.slug}`} className="mt-1 block text-2xl">
                        {item.product.name}
                      </Link>
                      <p className="mt-1 text-sm text-text-muted">{item.product.shortDescription}</p>
                    </div>
                    <Price price={item.product.price * item.quantity} />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="flex h-10 w-10 items-center justify-center">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="flex h-10 w-10 items-center justify-center">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.product.id)} className="inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-text-muted">
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="space-y-4 rounded-[28px] border border-border bg-card p-6">
            <h2 className="text-3xl">Order summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Subtotal</span>
                <Price price={subtotal} />
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Shipping</span>
                <Price price={shipping} />
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Tax</span>
                <Price price={tax} />
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base">
                <span>Total</span>
                <Price price={total} size="lg" />
              </div>
            </div>

            {amountForFreeShipping > 0 && (
              <p className="text-sm leading-7 text-text-muted">
                Add <span className="text-gold">{formatPrice(amountForFreeShipping)}</span> more to qualify for complimentary shipping.
              </p>
            )}

            <div className="space-y-3 pt-2">
              <Link href="/checkout" className="block">
                <Button size="lg" fullWidth>
                  Checkout
                </Button>
              </Link>
              <Link
                href="/wholesale"
                className="block rounded-full border border-gold/30 px-5 py-4 text-center text-[10px] tracking-[0.24em] uppercase text-gold"
              >
                Trade inquiry
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
