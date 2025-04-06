"use client";

import { getCreditSessionUrl } from "@/services/api";
import { useState } from "react";
import { useSoilContext } from "@/soil/context";

type CreditsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
};

export function CreditsModal({ isOpen, onClose, pathname }: CreditsModalProps) {
  const [customAmount, setCustomAmount] = useState("");
  const [error, setError] = useState("");
  const { userState } = useSoilContext();

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(customAmount);

    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    getCreditSessionUrl(amount, pathname);
    setCustomAmount("");
    setError("");
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-2">
      <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center" onClick={onClose} />
      <div className="bg-zinc-900 p-6 rounded-lg w-full max-w-md z-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Purchase Tetractys Credits</h2>
          <button onClick={onClose} className="p-1 hover:bg-zinc-700 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} className="fill-white">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <h3 className="text-lg text-zinc-50 mb-2">Current credits: {userState?.aiCredits ?? 0}</h3>

        <p className="text-sm text-zinc-400 mb-6">
          Each dollar is worth 10 Tetractys Credits and each Tetractys costs 1 credit.
        </p>

        <div className="flex flex-col gap-3">
          <button className="btn" onClick={() => getCreditSessionUrl(1, pathname)}>
            Buy 10 Credits ($1)
          </button>
          <button className="btn" onClick={() => getCreditSessionUrl(5, pathname)}>
            Buy 50 Credits ($5)
          </button>
          <button className="btn" onClick={() => getCreditSessionUrl(10, pathname)}>
            Buy 100 Credits ($10)
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-zinc-900 text-zinc-400">Or enter custom amount</span>
            </div>
          </div>

          <form onSubmit={handleCustomSubmit} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
                min="1"
                step="1"
              />
              <button type="submit" className="btn whitespace-nowrap">
                Buy
              </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <p className="text-sm text-zinc-400">
              {customAmount ? `${Math.floor(parseFloat(customAmount) * 10)} credits` : "$1 = 10 credits"}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
