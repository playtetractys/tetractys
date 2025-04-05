"use client";

import { ProductServiceForm } from "@/components/product-service-form";
import { useParams } from "next/navigation";

export default function NewServicePage() {
  const { serviceKey } = useParams();

  return <ProductServiceForm type="service" offeringKey={serviceKey as string} />;
}
