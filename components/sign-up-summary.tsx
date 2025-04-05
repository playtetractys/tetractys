import type { Data } from "@/soil/services/types";
import { useMemo } from "react";

export function SignUpSummary({ userEntries }: { userEntries: [string, Data<"user">][] }) {
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: userEntries.length,
      today: userEntries.filter(([, user]) => new Date(user.createdAt) >= today).length,
      thisWeek: userEntries.filter(([, user]) => new Date(user.createdAt) >= thisWeek).length,
      thisMonth: userEntries.filter(([, user]) => new Date(user.createdAt) >= thisMonth).length,
    };
  }, [userEntries]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
        <div className="text-sm text-zinc-500">Total Users</div>
        <div className="text-3xl font-bold">{stats.total}</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
        <div className="text-sm text-zinc-500">New Today</div>
        <div className="text-3xl font-bold">{stats.today}</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
        <div className="text-sm text-zinc-500">This Week</div>
        <div className="text-3xl font-bold">{stats.thisWeek}</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
        <div className="text-sm text-zinc-500">This Month</div>
        <div className="text-3xl font-bold">{stats.thisMonth}</div>
      </div>
    </div>
  );
}
