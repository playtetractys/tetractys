"use client";

import { ProductServiceForm } from "@/components/product-service-form";
import { useParams } from "next/navigation";

export default function NewServicePage() {
  const { productKey } = useParams();

  return <ProductServiceForm type="product" offeringKey={productKey as string} />;
}
