import Link from "next/link";
import { useCallback } from "react";

// Services
import { CURRENCY_SYMBOLS } from "@/services/constants";
import { removeData } from "@/soil/services/client-data";
import { toast } from "react-toastify";

// Types
import type { OfferingType } from "@/services/types";
import type { Data } from "@/soil/services/types";

export function ProductServiceGridItem({
  type,
  productOrService,
}: {
  type: OfferingType;
  productOrService: Mandate<Data<"userProduct"> | Data<"userService">, "key">;
}) {
  const handleDelete = useCallback(async (key: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await removeData({ dataType: "userProduct", dataKey: key });
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  }, []);

  return (
    <div className="flex flex-col gap-2 p-4 bg-zinc-900 border border-zinc-700 rounded-lg shadow-sm text-white">
      <div className="flex justify-between items-center gap-2 mb-2">
        <h3 className="grow text-lg font-semibold">{productOrService.name}</h3>
        <Link href={`/offering/${type}s/${productOrService.key}`} className="text-zinc-600 hover:text-red-400">
          <i className="ri-pencil-line" />
        </Link>
        <button onClick={() => handleDelete(productOrService.key)} className="text-zinc-600 hover:text-red-400">
          <i className="ri-delete-bin-line" />
        </button>
      </div>
      <p className="grow text-zinc-400 mb-4">{productOrService.description}</p>
      <div className="text-sm text-white">
        {Object.entries(productOrService.prices).map(([currency, price]) => (
          <span key={currency} className="mr-2">
            {CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS]}
            {price} {currency.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
}
