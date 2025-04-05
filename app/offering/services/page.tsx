"use client";

import Link from "next/link";

// Services
import { useSoilContext } from "@/soil/context";
import { useUserData } from "@/soil/hooks/useUserData";

// Components
import { ProductServiceGridItem } from "@/components/product-service-grid-item";

export default function ServicesPage() {
  const { userUid } = useSoilContext();

  const { dataArray: serviceArray } = useUserData({
    uid: userUid,
    dataType: "userService",
    fetchData: true,
    includeArray: true,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {serviceArray.map((service) => (
        <ProductServiceGridItem key={service.key} type="service" productOrService={service} />
      ))}
      <Link
        href="/offering/services/new"
        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg hover:bg-zinc-900 transition-colors h-full min-h-[200px]"
      >
        <i className="ri-add-line text-3xl mb-2"></i>
        <span className="text-center">Add New Service</span>
      </Link>
    </div>
  );
}
