"use client";

import { useSoilContext } from "@/soil/context";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, initiallyLoading } = useSoilContext();
  const pathname = usePathname();

  if (initiallyLoading || !isAdmin) return null;

  return (
    <div className="p-4 w-full mx-auto">
      <nav className="flex gap-4 my-4 overflow-x-auto">
        <a href="/admin/users" className={pathname === "/admin/users" ? "underline" : "hover:underline"}>
          Users
        </a>
        <a href="/admin/admins" className={pathname === "/admin/admins" ? "underline" : "hover:underline"}>
          Admins
        </a>
        <a href="/admin/payments" className={pathname === "/admin/payments" ? "underline" : "hover:underline"}>
          Payments
        </a>
        <a href="/admin/tetractyses" className={pathname === "/admin/tetractyses" ? "underline" : "hover:underline"}>
          Tetractyses
        </a>
      </nav>
      <div className="min-h-[calc(100vh-10rem)]">{children}</div>
    </div>
  );
}
