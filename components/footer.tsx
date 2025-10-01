"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="font-serif text-2xl inline-flex items-center gap-2">
              ALL In One
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your destination for curated fashion and lifestyle essentials.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide">Shop</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                All Products
              </Link>
              <Link
                href="/products?categoryId=men"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Men
              </Link>
              <Link
                href="/products?categoryId=women"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Women
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide">Support</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
              <Link href="/shipping" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Shipping Info
              </Link>
              <Link href="/returns" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Returns
              </Link>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide">Connect</h3>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              Questions? Reach us at{" "}
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}`}
                className="underline hover:text-foreground transition-colors"
              >
                WhatsApp
              </a>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ALL In One. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
