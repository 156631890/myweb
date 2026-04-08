"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Price } from "@/components/ui/badge";
import { useCartStore, useCartTotals } from "@/lib/store";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const { subtotal, shipping, tax, total } = useCartTotals();
  const [processing, setProcessing] = useState(false);
  const [notes, setNotes] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    clearCart();
    router.push("/checkout/success");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
      <div className="mb-10 space-y-4">
        <p className="text-[10px] tracking-[0.34em] uppercase text-text-muted">Checkout</p>
        <h1 className="text-6xl sm:text-7xl">Secure retail checkout.</h1>
        <p className="max-w-2xl text-base leading-8 text-text-muted">
          This flow is for retail orders only. Wholesale buyers should use the inquiry form so trade pricing and quantities can be handled correctly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 rounded-[32px] border border-border bg-card p-6 sm:p-8">
          <div>
            <h2 className="text-3xl">Contact and shipping</h2>
            <p className="mt-2 text-sm text-text-muted">All fields are required for retail fulfillment.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First name" value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} required />
            <Input label="Last name" value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            <Input label="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required />
          </div>
          <Input label="Address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} required />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} required />
            <Input label="State" value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} required />
            <Input label="Postal code" value={form.postalCode} onChange={(event) => setForm({ ...form, postalCode: event.target.value })} required />
          </div>
          <Input label="Country" value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} required />
          <Textarea label="Order notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} placeholder="Delivery instructions or special requests" />

          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Lock className="h-4 w-4" />
            Secure checkout flow for retail orders.
          </div>
        </div>

        <aside className="space-y-6 rounded-[32px] border border-border bg-card p-6 sm:p-8">
          <h2 className="text-3xl">Order summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-4">
                <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-2xl">
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-text-muted">{item.product.brand}</p>
                  <h3 className="text-lg">{item.product.name}</h3>
                  <p className="text-sm text-text-muted">Qty: {item.quantity}</p>
                </div>
                <Price price={item.product.price * item.quantity} />
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-border pt-4 text-sm">
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

          <Button size="lg" fullWidth type="submit" loading={processing}>
            Place order
          </Button>
        </aside>
      </form>
    </div>
  );
}
