"use client";

import { toast } from "react-toastify";
import { useState, useEffect, useCallback, useMemo } from "react";

// Services
import { useSoilContext } from "@/soil/context";
import { useDataKeyValue } from "@/soil/hooks/useDataKeyValue";
import { createData, updateData } from "@/soil/services/client-data";

// Helpers
import { pushKey } from "@/soil/services/firebase";
import { CURRENCIES, DEFAULT_PRICES } from "@/services/constants";

// Types
import type { UserProduct, UserService } from "@/services/types";

export function ProductServiceForm({ type, offeringKey }: { type: "product" | "service"; offeringKey?: string }) {
  const { userUid } = useSoilContext();
  const [newOffering, setNewOffering] = useState<Partial<UserProduct | UserService>>({
    name: "",
    description: "",
    prices: DEFAULT_PRICES,
  });
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");

  // Get available currencies (ones that haven't been selected yet)
  const availableCurrencies = useMemo(
    () => CURRENCIES.filter((currency) => !Object.keys(newOffering.prices || {}).includes(currency)),
    [newOffering.prices]
  );

  const productOrService = useDataKeyValue(type === "product" ? "userProduct" : "userService", offeringKey);
  useEffect(() => {
    if (productOrService) {
      setNewOffering(productOrService);
    }
  }, [productOrService]);

  // Set initial selected currency to first available one
  useEffect(() => {
    if (availableCurrencies.length > 0 && !selectedCurrency) {
      setSelectedCurrency(availableCurrencies[0]);
    }
  }, [availableCurrencies, selectedCurrency]);

  const handleAddPrice = useCallback(() => {
    if (!selectedCurrency) return;

    setNewOffering({
      ...newOffering,
      prices: {
        ...(newOffering.prices || DEFAULT_PRICES),
        [selectedCurrency]: 0,
      },
    });
    setSelectedCurrency("");
  }, [newOffering, selectedCurrency]);

  const handleRemovePrice = useCallback(
    (currency: (typeof CURRENCIES)[number]) => {
      const newPrices = { ...newOffering.prices };
      delete newPrices[currency];
      setNewOffering({
        ...newOffering,
        prices: newPrices,
      });
    },
    [newOffering]
  );

  const handleSubmit = useCallback(async () => {
    if (!newOffering.name || !newOffering.description || !userUid) {
      toast.error("Please fill in all required fields");
      return;
    }

    const offering = {
      ...newOffering,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      prices: newOffering.prices || DEFAULT_PRICES,
    } as UserProduct | UserService;

    try {
      if (offeringKey) {
        await updateData({
          dataType: type === "product" ? "userProduct" : "userService",
          dataKey: offeringKey,
          data: offering,
        });
      } else {
        await createData({
          dataType: type === "product" ? "userProduct" : "userService",
          dataKey: pushKey(type),
          data: offering,
          owners: [userUid],
        });
      }
      toast.success(`${type === "product" ? "Product" : "Service"} created successfully`);
      setNewOffering({ name: "", description: "", prices: DEFAULT_PRICES });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create offering");
    }
  }, [newOffering, userUid, offeringKey, type]);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="max-w-lg mx-auto">
        <h2 className="text-xl font-semibold text-white text-center mb-4">Create New Offering</h2>

        <div className="p-3 bg-zinc-900 border border-white rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Name</label>
              <input
                type="text"
                value={newOffering.name}
                onChange={(e) => setNewOffering({ ...newOffering, name: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-white text-white rounded-lg placeholder-zinc-400"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Description</label>
              <textarea
                value={newOffering.description}
                onChange={(e) => setNewOffering({ ...newOffering, description: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-white text-white rounded-lg placeholder-zinc-400"
                rows={4}
                placeholder="Enter description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Prices</label>
              <div className="space-y-4">
                {/* List of existing prices */}
                {Object.entries(newOffering.prices || {}).map(([currency, amount]) => (
                  <div key={currency} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-12 text-sm font-medium uppercase text-white">{currency}</div>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) =>
                            setNewOffering({
                              ...newOffering,
                              prices: {
                                ...(newOffering.prices || DEFAULT_PRICES),
                                [currency]: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full px-2 py-1 bg-zinc-800 border border-white text-white rounded placeholder-zinc-400"
                          min="0"
                          step="0.01"
                        />
                        <button
                          onClick={() => handleRemovePrice(currency as (typeof CURRENCIES)[number])}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <i className="ri-delete-bin-line" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add new price section */}
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1 text-white">Add New Price</div>
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="w-full px-2 py-1 bg-zinc-800 border border-white text-white rounded"
                      disabled={availableCurrencies.length === 0}
                    >
                      <option value="">Select currency</option>
                      {availableCurrencies.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleAddPrice}
                    disabled={!selectedCurrency}
                    className="px-4 py-2 bg-black text-white border border-white rounded-full hover:bg-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Price
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white border border-white rounded-full hover:bg-zinc-900 transition-colors"
              >
                Create {type === "product" ? "Product" : "Service"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
