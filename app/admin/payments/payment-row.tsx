import { toast } from "react-toastify";
import { useCallback } from "react";

// Services
import { removeData } from "@/soil/services/client-data";

// Types
import type { Data } from "@/soil/services/types";

export function PaymentRow({ paymentData: [key, payment] }: { paymentData: [string, Data<"stripePayment">] }) {
  const handleDelete = useCallback(async (dataKey: string) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      await removeData({ dataType: "stripePayment", dataKey });
      toast.success("Payment deleted successfully");
    }
  }, []);

  return (
    <tr key={key} className="border-b hover:bg-zinc-50">
      <td className="p-4">{payment.checkoutSession?.customer_details?.email || ""}</td>
      <td className="p-4">{payment.checkoutSession?.customer_details?.name || ""}</td>
      <td className="p-4">{payment.checkoutSession?.customer_details?.phone || ""}</td>
      <td className="p-4">${(payment.checkoutSession?.amount_total || 0) / 100}</td>
      <td className="p-4">{new Date(payment.createdAt).toLocaleDateString()}</td>
      <td className="p-4">
        <a href={payment.charge?.receipt_url || ""} target="_blank" rel="noopener noreferrer">
          Receipt
        </a>
      </td>
      <td className="p-4">
        <button
          onClick={() => handleDelete(key)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
