"use client";

import Link from "next/link";

export default function OfferingPage() {
  return (
    <div className="grow w-full h-full flex flex-col items-center justify-center gap-6 pb-28">
      <h1 className="text-2xl font-bold">Select an offering type</h1>
      <div className="flex items-center justify-center gap-4">
        <Link href="/offering/products/new" className="btn btn-xl">
          Product
        </Link>
        <Link href="/offering/services/new" className="btn btn-xl">
          Service
        </Link>
      </div>
    </div>
  );
}
