import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: files, error } = await supabase.storage
      .from("shop.fairoz.in")
      .list("public", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error("Supabase list error:", error);
      return NextResponse.json(
        { error: `Supabase list error: ${error.message}` },
        { status: 500 }
      );
    }

    const urls = files.map((file) => {
      const { data } = supabase.storage
        .from("shop.fairoz.in")
        .getPublicUrl(`public/${file.name}`);
      return {
        url: data.publicUrl,
        name: file.name,
        id: file.id,
        created_at: file.created_at,
      };
    });

    return NextResponse.json(urls);
  } catch (error) {
    console.error("List images error:", error);
    return NextResponse.json({ error: "Failed to list images" }, { status: 500 });
  }
}
