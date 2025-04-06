"use client";

import { useCallback, useMemo, useState } from "react";
import { removeData } from "@/soil/services/client-data";
import { toast } from "react-toastify";
import { useDataType } from "@/soil/hooks/useDataType";
import { PATHS } from "@/soil/services/paths";
import { remove } from "@/soil/services/firebase";
import { useSoilContext } from "@/soil/context";

export default function Tetractyses() {
  const { user } = useSoilContext();
  const [searchTerm, setSearchTerm] = useState("");

  const tetractyses = useDataType("tetractys");
  const tetractysesEntries = useMemo(() => Object.entries(tetractyses || {}), [tetractyses]);

  const filteredTetractysEntries = useMemo(() => {
    if (!searchTerm) return tetractysesEntries;
    const searchTermLower = searchTerm.toLowerCase();
    return tetractysesEntries.filter(([, tetractys]) => {
      const result = (tetractys.ten?.prompt || "").toLowerCase();
      return result.includes(searchTermLower);
    });
  }, [searchTerm, tetractysesEntries]);

  const handleDeleteTetractys = useCallback(
    async (tetractysKey: string) => {
      if (!user?.uid) return;
      if (!confirm("Are you sure you want to delete this tetractys?")) return;

      try {
        await remove(PATHS.dataKeyFieldKey("user", user.uid, "tetractysHistory", tetractysKey));
        await removeData({
          dataType: "tetractys",
          dataKey: tetractysKey,
        });

        toast.success("Tetractys deleted successfully");
      } catch (error) {
        console.error("Error deleting tetractys:", error);
        toast.error("Failed to delete tetractys");
      }
    },
    [user?.uid]
  );

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search tetractys by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-full flex-grow"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-zinc-900">
              <th className="text-left p-4 border-b">Title</th>
              <th className="text-left p-4 border-b">Created Date</th>
              <th className="text-right p-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTetractysEntries.map(([key, tetractys]) => (
              <tr key={key} className="border-b hover:bg-zinc-800">
                <td className="p-4">{tetractys.ten?.prompt?.slice(0, 100) || ""}</td>
                <td className="p-4">{new Date(tetractys.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDeleteTetractys(key)}
                    className="px-3 py-1 text-red-500 hover:text-red-600 transition-colors text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
