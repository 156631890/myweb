import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-16 sm:px-6">
      <div className="w-full rounded-[32px] border border-border bg-card px-6 py-12 text-center sm:px-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
          <Check className="h-10 w-10 text-gold" />
        </div>
        <p className="mt-6 text-[10px] tracking-[0.34em] uppercase text-text-muted">Order confirmed</p>
        <h1 className="mt-3 text-5xl sm:text-6xl">Thank you for your order.</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-text-muted">
          Your retail order has been received. A confirmation email and fulfillment update will follow shortly.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/products">
            <Button variant="secondary" size="lg">
              Continue shopping
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg">
              Back home
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
