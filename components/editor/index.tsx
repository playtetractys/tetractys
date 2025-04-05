"use client";

import { useEffect, useCallback, useState, useRef } from "react";

// Services
import { useSoilContext } from "@/soil/context";
import { getDataKeyFieldValue, updateData } from "@/soil/services/client-data";

// Components
import { Content, EditorContent, useEditor } from "@tiptap/react";
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import StarterKit from "@tiptap/starter-kit";
import { MenuBar } from "./menu-bar";

import "./styles.css";

export default function Editor({ content }: { content?: Content }) {
  const { user } = useSoilContext();
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedContent = useRef<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure(),
      Highlight,
      TaskList,
      TaskItem,
      CharacterCount.configure({
        limit: 1_000,
      }),
    ],
  });

  useEffect(() => {
    if (editor && content) editor.commands.setContent(content);
  }, [editor, content]);

  const saveContent = useCallback(async () => {
    if (editor && user?.uid) {
      const currentContent = JSON.stringify(editor.getJSON());

      // Only save if content has changed
      if (currentContent !== lastSavedContent.current) {
        setIsSaving(true);
        try {
          const value = JSON.parse(currentContent);
          await updateData({ dataType: "editorState", dataKey: user.uid, data: { value } });
          lastSavedContent.current = currentContent;
        } finally {
          setTimeout(() => setIsSaving(false), 2000);
        }
      }
    }
  }, [editor, user?.uid]);

  useEffect(() => {
    if (editor && user?.uid) {
      getDataKeyFieldValue({ dataType: "editorState", dataKey: user.uid, field: "value" }).then((editorState) => {
        editor.commands.setContent(editorState);
        lastSavedContent.current = JSON.stringify(editorState);
      });
    }
  }, [editor, user?.uid]);

  useEffect(() => {
    if (editor && user?.uid) {
      const interval = setInterval(saveContent, 10000); // Save every 10 seconds
      return () => clearInterval(interval);
    }
  }, [editor, user?.uid, saveContent]);

  if (!editor) return null;

  return (
    <div className="tiptap-editor">
      {editor && <MenuBar editor={editor} onSave={saveContent} isSaving={isSaving} />}
      <EditorContent className="flex-1 overflow-x-hidden overflow-y-auto p-2" editor={editor} />
    </div>
  );
}

// flex: 1 1 auto;
// overflow-x: hidden;
// overflow-y: auto;
// padding: 0.5rem;
// -webkit-overflow-scrolling: touch;
