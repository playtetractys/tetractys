"use client";

// Services
import { useCallback, useEffect, useState } from "react";

import { getDataKeyValue } from "@/soil/services/client-data";
import { Data } from "@/soil/services/types";
import { onValue, remove, set } from "@/soil/services/firebase";

export default function Admin() {
  const [admins, setAdmins] = useState<Record<string, boolean> | null>();

  useEffect(() => {
    onValue("admins", setAdmins);
  }, []);

  const [adminsData, setAdminsData] = useState<(Data<"user"> & { key: string })[]>([]);
  useEffect(() => {
    if (admins) {
      Promise.all(
        Object.entries(admins)
          .filter(([, val]) => val)
          .map(([uid]) =>
            getDataKeyValue({ dataType: "user", dataKey: uid }).then((user) => (user ? { ...user, key: uid } : null))
          )
      ).then((admins) => setAdminsData(admins.filter((admin) => admin !== null)));
    }
  }, [admins]);

  const handleAddAdmin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const uid = formData.get("uid") as string;
    if (uid) {
      await set(`admins/${uid}`, true);
      (e.target as HTMLFormElement).reset();
    }
  }, []);

  const handleRemoveAdmin = useCallback(async (uid: string) => {
    await remove(`admins/${uid}`);
  }, []);

  return (
    <div>
      <form onSubmit={handleAddAdmin} className="flex gap-2 mb-4">
        <input type="text" name="uid" placeholder="Enter user ID" className="border p-2 rounded" required />
        <button type="submit" className="bg-foreground text-white py-2 px-4 rounded hover:bg-foreground/80">
          Add Admin
        </button>
      </form>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">User ID</th>
            <th className="text-left py-2">Name</th>
            <th className="text-left py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {adminsData.map((admin) => (
            <tr key={admin.key} className="border-b">
              <td className="py-2">{admin.key}</td>
              <td className="py-2">{admin.email}</td>
              <td className="py-2">
                <button onClick={() => handleRemoveAdmin(admin.key)} className="text-red-600 hover:text-red-800">
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
