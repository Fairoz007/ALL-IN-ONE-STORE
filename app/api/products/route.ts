import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

function generateSKU() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  const part = Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("")
  return `SKU-${part}`
}

export async function GET(req: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const categoryId = searchParams.get("categoryId")
  let query = supabase.from("products").select("*").order("created_at", { ascending: false })
  if (categoryId) query = query.eq("category_id", categoryId)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { data: isAdmin, error: isAdminError } = await supabase.rpc('is_admin', { uid: user.id })
  if (isAdminError || !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const body = await req.json()
  const { name, description, price, category_id, image_url } = body as {
    name: string
    description?: string
    price: number
    category_id: string
    image_url?: string
  }
  if (!name || !price || !category_id) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  let unique_code = generateSKU()
  // Try a couple of times in case of collision
  for (let i = 0; i < 3; i++) {
    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        description,
        price,
        category_id,
        image_url,
        unique_code,
      })
      .select()
      .single()
    if (!error) return NextResponse.json(data, { status: 201 })
    if (error.message.includes("unique")) {
      unique_code = generateSKU()
      continue
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ error: "Could not generate unique SKU" }, { status: 500 })
}
