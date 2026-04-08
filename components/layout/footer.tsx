import React from "react";
import Link from "next/link";
import { Instagram, Facebook, Mail, ArrowRight } from "lucide-react";

const footerColumns = {
  shop: [
    { name: "Sunglasses", href: "/products?category=sunglasses" },
    { name: "Women", href: "/products?category=women-clothes" },
    { name: "Men", href: "/products?category=men-clothes" },
    { name: "Bags", href: "/products?category=bags" },
  ],
  support: [
    { name: "Shipping", href: "#" },
    { name: "Returns", href: "#" },
    { name: "FAQs", href: "#" },
    { name: "Contact", href: "/about" },
  ],
  trade: [
    { name: "Wholesale Inquiry", href: "/wholesale" },
    { name: "Source List", href: "/products" },
    { name: "Product Search", href: "/search" },
    { name: "Directory Home", href: "/" },
  ],
};

const socialLinks = [
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Email", href: "mailto:trade@kuangtu.com", icon: Mail },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-12 grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="mb-4 text-[10px] tracking-[0.34em] uppercase text-text-muted">
              KUANGTU
            </p>
            <p className="max-w-md text-3xl leading-tight">
              An English-first luxury directory for retail discovery and trade inquiry.
            </p>
            <p className="mt-5 max-w-md text-sm leading-7 text-text-muted">
              Product pages are designed for sharing, indexing, and inquiry-led conversion across search and social channels.
            </p>

            <div className="mt-8 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-gold/30 hover:text-gold"
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.6} />
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-[10px] tracking-[0.28em] uppercase text-text-muted">
              Shop
            </h4>
            <ul className="space-y-4">
              {footerColumns.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/75 transition-colors hover:text-gold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-[10px] tracking-[0.28em] uppercase text-text-muted">
              Support
            </h4>
            <ul className="space-y-4">
              {footerColumns.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/75 transition-colors hover:text-gold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-[10px] tracking-[0.28em] uppercase text-text-muted">
              Trade
            </h4>
            <ul className="space-y-4">
              {footerColumns.trade.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/75 transition-colors hover:text-gold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] tracking-[0.28em] uppercase text-text-muted">
            © 2026 KUANGTU. All rights reserved.
          </p>
          <Link
            href="/wholesale"
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-gold transition-colors hover:text-foreground"
          >
            Start a trade inquiry
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
