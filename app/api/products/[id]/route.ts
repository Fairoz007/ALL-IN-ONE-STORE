import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("products").select("*").eq("id", params.id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { data: isAdmin, error: isAdminError } = await supabase.rpc('is_admin', { uid: user.id })
  if (isAdminError || !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const body = await req.json()
  const { name, description, price, category_id, image_url } = body as {
    name?: string
    description?: string
    price?: number
    category_id?: string
    image_url?: string
  }
  const { data, error } = await supabase
    .from("products")
    .update({ name, description, price, category_id, image_url })
    .eq("id", params.id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { data: isAdmin, error: isAdminError } = await supabase.rpc('is_admin', { uid: user.id })
  if (isAdminError || !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { error } = await supabase.from("products").delete().eq("id", params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
