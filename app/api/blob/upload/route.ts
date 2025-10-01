import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const filePath = `public/${file.name}`;

    const { error } = await supabase.storage
      .from("shop.fairoz.in")
      .upload(filePath, file);

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { error: `Supabase upload error: ${error.message}` },
        { status: 500 }
      );
    }

    const { data } = supabase.storage
      .from("shop.fairoz.in")
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: data.publicUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}