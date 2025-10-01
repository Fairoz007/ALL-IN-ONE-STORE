"use client"

import Link from "next/link"
import { CartDrawer } from "./cart-drawer"

export function StoreHeader() {
  return (
    <div className="border-b">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">
          Luxury Boutique
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm underline">
            Sign in
          </Link>
          <CartDrawer />
        </div>
      </div>
    </div>
  )
}
