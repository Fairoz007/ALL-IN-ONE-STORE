"use client"
import Link from "next/link"
import { useCart } from "@/components/store/cart"
import { Button } from "@/components/ui/button"
import useSWR from "swr"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { open } = useCart()
  const { data: categories } = useSWR("/api/categories", (u: string) => fetch(u).then((r) => r.json()))
  const men = categories?.find((c: any) => c?.name?.toLowerCase() === "men")
  const women = categories?.find((c: any) => c?.name?.toLowerCase() === "women")
  const menHref = men ? `/products?categoryId=${men.id}` : "/products"
  const womenHref = women ? `/products?categoryId=${women.id}` : "/products"

  return (
    <header className="flex items-center justify-between py-4 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link href="/" className="font-serif text-2xl" aria-label="ALL In One">
        ALL In One
      </Link>
      <nav className="flex items-center gap-2 md:gap-4" aria-label="Primary">
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
    </header>
  )
}
