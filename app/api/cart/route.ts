import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

async function getOrCreateCart(supabase: ReturnType<typeof getSupabaseServerClient>, userId: string) {
  const { data: existing } = await supabase.from("carts").select("*").eq("user_id", userId).maybeSingle()
  if (existing) return existing
  const { data, error } = await supabase.from("carts").insert({ user_id: userId }).select("*").single()
  if (error) throw new Error(error.message)
  return data
}

export async function GET() {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ items: [], total_cents: 0, currency: "USD" })
  const cart = await getOrCreateCart(supabase, user.id)
  const { data: items, error } = await supabase
    .from("cart_items")
    .select("id, quantity, product:products(id,title,price_cents,currency,main_image_url)")
    .eq("cart_id", cart.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const total = (items ?? []).reduce((sum, it: any) => sum + it.product.price_cents * it.quantity, 0)
  const currency = items?.[0]?.product?.currency ?? "USD"
  return NextResponse.json({ items: items ?? [], total_cents: total, currency })
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const cart = await getOrCreateCart(supabase, user.id)

  // upsert item
  const { data: existing } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cart.id)
    .eq("product_id", body.productId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + (body.quantity ?? 1) })
      .eq("id", existing.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  } else {
    const { error } = await supabase
      .from("cart_items")
      .insert({ cart_id: cart.id, product_id: body.productId, quantity: body.quantity ?? 1 })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest) {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const { error } = await supabase.from("cart_items").update({ quantity: body.quantity }).eq("id", body.itemId)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { data: cart } = await supabase.from("carts").select("*").eq("user_id", user.id).maybeSingle()
  if (!cart) return NextResponse.json({ ok: true })
  const { error } = await supabase.from("cart_items").delete().eq("cart_id", cart.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
