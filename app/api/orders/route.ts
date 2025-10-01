import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json([], { status: 200 })
  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*, product:products(title))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(_: NextRequest) {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: cart } = await supabase.from("carts").select("*").eq("user_id", user.id).maybeSingle()
  if (!cart) return NextResponse.json({ error: "No cart" }, { status: 400 })
  const { data: items } = await supabase
    .from("cart_items")
    .select("id, quantity, product:products(id,title,price_cents,currency)")
    .eq("cart_id", cart.id)

  const list = items ?? []
  if (list.length === 0) return NextResponse.json({ error: "Cart empty" }, { status: 400 })
  const currency = list[0].product.currency ?? "USD"
  const total = list.reduce((sum: number, it: any) => sum + it.product.price_cents * it.quantity, 0)

  const { data: order, error } = await supabase
    .from("orders")
    .insert({ user_id: user.id, total_cents: total, currency, status: "pending" })
    .select("*")
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const orderItems = list.map((it: any) => ({
    order_id: order.id,
    product_id: it.product.id,
    quantity: it.quantity,
    unit_price_cents: it.product.price_cents,
  }))
  const { error: oiErr } = await supabase.from("order_items").insert(orderItems)
  if (oiErr) return NextResponse.json({ error: oiErr.message }, { status: 400 })

  // clear cart
  await supabase.from("cart_items").delete().eq("cart_id", cart.id)

  return NextResponse.json(order)
}
