"use client";

import { useDataType } from "@/soil/hooks/useDataType";
import { useCallback, useMemo, useState } from "react";
import { SignUpSummary } from "@/components/sign-up-summary";
import { UserRow } from "./user-row";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");

  const users = useDataType("user");
  const userEntries = useMemo(() => Object.entries(users ?? {}), [users]);

  const filteredUserEntries = useMemo(() => {
    let filtered = userEntries;

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(([, usr]) => {
        const email = (usr.email || "").toLowerCase();
        return email.includes(searchTermLower);
      });
    }

    return filtered;
  }, [userEntries, searchTerm]);

  const downloadCsv = useCallback(() => {
    const headers = ["Email", "Created Date"];
    const csvData = userEntries.map(([, usr]) => {
      return [usr.email || "", new Date(usr.createdAt).toLocaleDateString()];
    });

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }, [userEntries]);

  return (
    <div>
      <SignUpSummary userEntries={userEntries} />
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search users by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-full flex-grow"
        />
        <button
          onClick={downloadCsv}
          className="px-4 py-2 bg-foreground text-background rounded-full hover:bg-zinc-400 transition-colors text-sm"
        >
          Download CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-zinc-50">
              <th className="p-4 text-left border">Email</th>
              <th className="p-4 text-left border">Name</th>
              <th className="p-4 text-left border">Phone</th>
              <th className="p-4 text-left border">Event Location</th>
              <th className="p-4 text-left border">Team</th>
              <th className="p-4 text-left border">UID</th>
              <th className="p-4 text-left border">Created Date</th>
              <th className="p-4 text-left border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUserEntries.map((userData) => (
              <UserRow key={userData[0]} userData={userData} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
