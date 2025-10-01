"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/store/cart"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingBag, Plus, Minus, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(price)
}

function buildWhatsAppMessage(items: ReturnType<typeof useCart>["items"]) {
  const lines = items.map(
    (i) => `• *${i.name}* (Code: ${i.sku}) - ${i.qty} × ${formatPrice(i.price)} = ${formatPrice(i.qty * i.price)}`,
  )
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  return encodeURIComponent(
    `🛍️ *New Order* 🛍️\n\nItems: ${items.length}\n\n${lines.join("\n")}\n\n*Total: ${formatPrice(
      total,
    )}*\n\nPlease confirm availability and payment options.`,
  )
}

function CartItem({
  id,
  name,
  sku,
  price,
  qty,
  image_url,
  remove,
  setQty,
}: {
  id: string
  name: string
  sku: string
  price: number
  qty: number
  image_url?: string
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="overflow-hidden border-border/50 hover:border-border transition-colors">
        <CardContent className="p-3 sm:p-4">
          <div className="flex gap-3 sm:gap-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
              {image_url ? (
                <img
                  src={image_url || "/placeholder.svg"}
                  alt={name}
                  className="w-full h-full rounded-md object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-md bg-muted flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/40" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-sm sm:text-base leading-tight line-clamp-2 text-balance">{name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">SKU: {sku}</p>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-md bg-transparent"
                  onClick={() => setQty(id, Math.max(1, qty - 1))}
                  disabled={qty <= 1}
                >
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <span className="w-8 sm:w-10 text-center font-semibold text-sm sm:text-base">{qty}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-md bg-transparent"
                  onClick={() => setQty(id, qty + 1)}
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors -mr-2 -mt-1"
                onClick={() => remove(id)}
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="text-right">
                <p className="text-xs sm:text-sm text-muted-foreground">{formatPrice(price)}</p>
                <p className="font-bold text-sm sm:text-base mt-0.5">{formatPrice(price * qty)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function CartDrawer() {
  const { isOpen, close, items, remove, setQty, clear } = useCart()
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0)
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && close()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="border-b px-4 sm:px-6 py-4 sm:py-5 bg-muted/30">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-serif text-xl sm:text-2xl flex items-center gap-2 sm:gap-3">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Shopping Bag</span>
            </SheetTitle>
            {items.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-semibold">{itemCount}</span>
                <span className="hidden sm:inline">{itemCount === 1 ? "item" : "items"}</span>
              </div>
            )}
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-6 text-center p-6 sm:p-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl" />
              <ShoppingBag className="relative w-20 h-20 sm:w-24 sm:h-24 text-muted-foreground/30" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-lg sm:text-xl font-semibold">Your bag is empty</h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xs text-pretty">
                Add items to your bag to get started with your order
              </p>
            </div>
            <Button onClick={close} className="mt-2 rounded-full px-6 sm:px-8 h-10 sm:h-11">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-4 sm:px-6 py-4">
              <AnimatePresence mode="popLayout">
                <div className="space-y-3">
                  {items.map((i) => (
                    <CartItem key={i.id} {...i} remove={remove} setQty={setQty} />
                  ))}
                </div>
              </AnimatePresence>
            </ScrollArea>

            <SheetFooter className="border-t mt-auto">
              <div className="w-full space-y-4 p-4 sm:p-6">
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-green-600 dark:text-green-500">Free</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-base sm:text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <Button
                    disabled={!items.length || !number}
                    className="w-full rounded-full h-11 sm:h-12 text-base font-semibold bg-green-600 hover:bg-green-700 text-white shadow-sm"
                    asChild
                  >
                    <a
                      href={`https://wa.me/${number}?text=${buildWhatsAppMessage(items)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Order via WhatsApp
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clear}
                    className="w-full rounded-full h-10 sm:h-11 text-sm font-medium border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive bg-transparent"
                  >
                    Clear Cart
                  </Button>
                </div>

                {!number && (
                  <p className="text-xs text-center text-muted-foreground pt-1">
                    WhatsApp ordering is currently unavailable
                  </p>
                )}
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
