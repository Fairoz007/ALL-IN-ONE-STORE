"use client"
import Link from "next/link"
import { useCart } from "@/components/store/cart"
import { Button } from "@/components/ui/button"
import useSWR from "swr"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Menu, ShoppingBag } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Navbar() {
  const { open } = useCart()
  const { data: categories } = useSWR("/api/categories", (u: string) => fetch(u).then((r) => r.json()))
  const men = categories?.find((c: any) => c?.name?.toLowerCase() === "men")
  const women = categories?.find((c: any) => c?.name?.toLowerCase() === "women")
  const menHref = men ? `/products?categoryId=${men.id}` : "/products"
  const womenHref = women ? `/products?categoryId=${women.id}` : "/products"
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="flex items-center justify-between py-4 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
      <Link href="/" className="font-serif text-xl sm:text-2xl" aria-label="ALL In One">
        ALL In One
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-2 md:gap-4" aria-label="Primary">
        <Link href="/products" className="text-sm underline-offset-4 hover:underline">
          Products
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-sm">
              Men
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Link href={menHref}>Shop Men</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-sm">
              Women
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Link href={womenHref}>Shop Women</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" onClick={open} aria-label="Open shopping bag">
          Bag
        </Button>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={open} aria-label="Open shopping bag">
          <ShoppingBag className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </Button>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 gap-0">
            <SheetHeader className="border-b px-6 py-5 bg-muted/30">
              <SheetTitle className="font-serif text-2xl">Menu</SheetTitle>
            </SheetHeader>

            <nav className="flex-1 flex flex-col p-6 space-y-1" aria-label="Mobile navigation">
              <Link
                href="/products"
                className="text-lg font-medium py-4 px-4 rounded-lg hover:bg-muted/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Products
              </Link>

              <Separator className="my-2" />

              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2">
                  Categories
                </p>
                <Link
                  href={menHref}
                  className="text-lg font-medium py-4 px-4 rounded-lg hover:bg-muted/50 transition-colors block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Men
                </Link>
                <Link
                  href={womenHref}
                  className="text-lg font-medium py-4 px-4 rounded-lg hover:bg-muted/50 transition-colors block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Women
                </Link>
              </div>

              <Separator className="my-2" />

              <div className="pt-4 px-4">
                <Button
                  variant="outline"
                  className="w-full rounded-full h-12 text-base font-semibold bg-transparent"
                  onClick={() => {
                    open()
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  View Bag
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
