import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { 
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-dvh grid md:grid-cols-[240px_1fr]">
      <aside className="hidden md:block bg-sidebar border-r border-sidebar-border p-6">
        <Link className="font-serif text-2xl tracking-tight" href="/admin">
          All In One
        </Link>
        <Separator className="my-6" />
        <nav className="grid gap-2 text-sm">
          <Link href="/admin/products" className="hover:underline">
            Products
          </Link>
          <Link href="/admin/categories" className="hover:underline">
            Categories
          </Link>
        </nav>
      </aside>
      <main className={cn("p-6 md:p-10")}>{children}</main>
    </div>
  );
}
