"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function OfferingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProducts = pathname.includes("/offering/products");
  const isServices = pathname.includes("/offering/services");

  return (
    <div className="grow flex flex-col items-center w-full max-w-3xl mx-auto">
      <div className="w-full flex not-md:flex-col not-md:gap-4 justify-between items-center mb-8">
        <Link href="/offering">
          <h1 className="text-2xl font-bold">Offerings</h1>
        </Link>
        <div className="flex gap-4">
          <Link href="/offering/products" className={isProducts ? "btn bg-zinc-800" : "btn-ghost"}>
            Products
          </Link>
          <Link href="/offering/services" className={isServices ? "btn bg-zinc-800" : "btn-ghost"}>
            Services
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
