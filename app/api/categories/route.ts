import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })
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
  const { name, image_url } = body as { name: string; image_url?: string }
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 })
  const { data, error } = await supabase.from("categories").insert({ name, image_url }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
