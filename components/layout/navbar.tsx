"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store";

const navLinks = [
  { name: "Eyewear", href: "/products?category=sunglasses" },
  { name: "Women", href: "/products?category=women-clothes" },
  { name: "Men", href: "/products?category=men-clothes" },
  { name: "Bags", href: "/products?category=bags" },
  { name: "Trade", href: "/wholesale" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-[10px] tracking-[0.24em] uppercase text-text-muted sm:px-6">
          <span>Complimentary concierge support for retail and trade</span>
          <span className="hidden sm:inline">International shipping available</span>
        </div>
      </div>

      <nav
        className={`sticky top-0 z-50 border-b border-border transition-all ${
          scrolled ? "bg-background/90 backdrop-blur-xl" : "bg-background/75 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 bg-card">
              <span className="font-serif text-lg tracking-[0.16em] text-foreground">
                KU
              </span>
            </div>
            <div className="hidden sm:block">
              <div className="text-[10px] tracking-[0.34em] uppercase text-text-muted">
                KUANGTU
              </div>
              <div className="font-serif text-lg">Luxury Directory</div>
            </div>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname?.startsWith(link.href.split("?")[0]);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs tracking-[0.24em] uppercase transition-colors ${
                    isActive ? "text-gold" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-gold/30 hover:text-gold"
              aria-label="Search"
            >
              <Search className="h-4 w-4" strokeWidth={1.6} />
            </Link>
            <Link
              href="/cart"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-gold/30 hover:text-gold"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.6} />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-medium text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              href="/wholesale"
              className="hidden rounded-full border border-gold/30 px-4 py-2 text-[10px] tracking-[0.24em] uppercase text-gold transition-colors hover:bg-gold hover:text-primary-foreground sm:inline-flex"
            >
              Trade Inquiry
            </Link>
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-muted lg:hidden"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border bg-card px-4 py-6 sm:px-6 lg:hidden">
            <div className="grid gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm tracking-[0.2em] uppercase text-foreground/80"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/wholesale"
                onClick={() => setMobileOpen(false)}
                className="text-sm tracking-[0.2em] uppercase text-gold"
              >
                Trade Inquiry
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
