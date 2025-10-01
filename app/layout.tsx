import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Playfair_Display } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "All in One Store",
  description: "Your one-stop shop for everything you need. We sell a wide variety of products, from electronics to clothing, all in one place.",
  keywords: "ecommerce, online shopping, electronics, clothing, all in one, store",
}

import { Toaster } from "@/components/ui/sonner"
import Footer from "@/components/footer"  // ✅ no curly braces

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${playfair.variable} antialiased`}>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Footer />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
