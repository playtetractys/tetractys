"use client";

import { useMemo } from "react";

// Helpers
import { getContentFromText } from "@/services/writing";

// Components
import Editor from "@/components/editor";

// Types
import type { Data } from "@/soil/services/types";

export function TetractysComplete({ tetractys }: { tetractys: Data<"tetractys"> }) {
  const tetractysTitle = useMemo(() => {
    return new Date(tetractys.createdAt).toLocaleDateString();
  }, [tetractys]);

  if (!tetractys?.result) return null;

  return (
    <div className="grow flex flex-col justify-center items-center gap-y-8 py-20">
      <h1 className="text-2xl font-bold animate__animated animate__zoomIn">{tetractysTitle}</h1>
      <div className="max-w-2xl text-lg font-serif animate__animated animate__zoomIn rounded-lg p-2 bg-zinc-800 leading-snug prose prose-invert">
        <Editor content={getContentFromText(tetractys.result)} />
      </div>
    </div>
  );
}
