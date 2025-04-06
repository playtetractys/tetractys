"use client";

import { useMemo, useState } from "react";

// Services
import { useDataType } from "@/soil/hooks/useDataType";

// Components
import { PaymentRow } from "./payment-row";

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("");

  const payments = useDataType("stripePayment");
  const paymentEntries = useMemo(() => Object.entries(payments || {}), [payments]);

  const filteredPaymentEntries = useMemo(() => {
    if (!searchTerm) return paymentEntries;
    const searchTermLower = searchTerm.toLowerCase();
    return paymentEntries.filter(([, payment]) => {
      const email = (payment.checkoutSession?.customer_details?.email || "").toLowerCase();
      return email.includes(searchTermLower);
    });
  }, [paymentEntries, searchTerm]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Stripe Payments</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search users by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-full flex-grow"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-100">
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Phone</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Team</th>
              <th className="text-left p-4">Receipt</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPaymentEntries.map((paymentData) => (
              <PaymentRow key={paymentData[0]} paymentData={paymentData} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
