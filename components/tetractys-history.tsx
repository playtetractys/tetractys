"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSoilContext } from "@/soil/context";

type TetractysItem = {
  key: string;
  createdAt: number;
};

interface TetractysSectionProps {
  title: string;
  items: TetractysItem[];
  formatDate: (date: number) => string;
  tetractysKey: string | undefined;
  onItemClick: () => void;
}

function TetractysSection({ title, items, formatDate, tetractysKey, onItemClick }: TetractysSectionProps) {
  if (items.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg mb-2">{title}</h2>
      <div className="flex flex-col gap-2">
        {items.map(({ key, createdAt }) => (
          <Link
            key={key}
            href={`/t/${key}`}
            className={`p-2 hover:bg-zinc-700 rounded ${tetractysKey === key ? "bg-zinc-800" : ""}`}
            onClick={onItemClick}
          >
            {formatDate(createdAt)}
          </Link>
        ))}
      </div>
    </div>
  );
}

interface TetractysHistoryProps {
  onItemClick: () => void;
}

export function TetractysHistory({ onItemClick }: TetractysHistoryProps) {
  const { tetractyses, tetractysKey } = useSoilContext();

  const todayTetractyses = useMemo(() => {
    if (!tetractyses) return { hasItems: false, items: [] };
    const today = new Date();
    const filtered = tetractyses
      .filter(({ createdAt }) => {
        const date = new Date(createdAt);
        return date.toDateString() === today.toDateString();
      })
      .sort((a, b) => b.createdAt - a.createdAt);
    return { hasItems: filtered.length > 0, items: filtered };
  }, [tetractyses]);

  const last7DaysTetractyses = useMemo(() => {
    if (!tetractyses) return { hasItems: false, items: [] };
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime());
    sevenDaysAgo.setDate(today.getDate() - 7);

    const filtered = tetractyses
      .filter(({ createdAt }) => {
        const date = new Date(createdAt);
        return date > sevenDaysAgo && date.toDateString() !== today.toDateString();
      })
      .sort((a, b) => b.createdAt - a.createdAt);
    return { hasItems: filtered.length > 0, items: filtered };
  }, [tetractyses]);

  const last30DaysTetractyses = useMemo(() => {
    if (!tetractyses) return { hasItems: false, items: [] };
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime());
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const sevenDaysAgo = new Date(today.getTime());
    sevenDaysAgo.setDate(today.getDate() - 7);

    const filtered = tetractyses
      .filter(({ createdAt }) => {
        const date = new Date(createdAt);
        return date > thirtyDaysAgo && date < sevenDaysAgo;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
    return { hasItems: filtered.length > 0, items: filtered };
  }, [tetractyses]);

  const earlierMonthsTetractyses = useMemo(() => {
    if (!tetractyses) return { hasItems: false, groupedByMonth: [] };
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime());
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const filtered = tetractyses
      .filter(({ createdAt }) => {
        const date = new Date(createdAt);
        return date < thirtyDaysAgo;
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    if (filtered.length === 0) return { hasItems: false, groupedByMonth: [] };

    const grouped = Object.entries(
      filtered.reduce((acc, tetractys) => {
        const month = new Date(tetractys.createdAt).toLocaleDateString([], { month: "long" });
        if (!acc[month]) acc[month] = [];
        acc[month].push(tetractys);
        return acc;
      }, {} as Record<string, typeof tetractyses>)
    );

    return { hasItems: true, groupedByMonth: grouped };
  }, [tetractyses]);

  const formatters = useMemo(
    () => ({
      time: (date: number) => new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      weekday: (date: number) => new Date(date).toLocaleDateString([], { weekday: "long" }),
      monthDay: (date: number) => new Date(date).toLocaleDateString([], { month: "long", day: "numeric" }),
    }),
    []
  );

  return (
    <div className="flex flex-col gap-4 overflow-y-auto whitespace-pre-line">
      <TetractysSection
        title="Today"
        items={todayTetractyses.items}
        formatDate={formatters.time}
        tetractysKey={tetractysKey}
        onItemClick={onItemClick}
      />

      <TetractysSection
        title="Previous 7 Days"
        items={last7DaysTetractyses.items}
        formatDate={formatters.weekday}
        tetractysKey={tetractysKey}
        onItemClick={onItemClick}
      />

      <TetractysSection
        title="Previous 30 Days"
        items={last30DaysTetractyses.items}
        formatDate={formatters.monthDay}
        tetractysKey={tetractysKey}
        onItemClick={onItemClick}
      />

      {earlierMonthsTetractyses.groupedByMonth.map(([month, items]) => (
        <TetractysSection
          key={month}
          title={month}
          items={items}
          formatDate={formatters.monthDay}
          tetractysKey={tetractysKey}
          onItemClick={onItemClick}
        />
      ))}
    </div>
  );
}
