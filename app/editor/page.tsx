"use client";

import Editor from "@/components/editor";

export default function EditorPage() {
  return (
    <div className="max-w-4xl w-full mx-auto">
      <div className="bg-zinc-800 rounded-lg p-3 my-20">
        <Editor />
      </div>
    </div>
  );
}
