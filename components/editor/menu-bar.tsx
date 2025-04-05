"use client";

import { useMemo } from "react";

import { MenuItem } from "./menu-item";

// Types
import type { Editor } from "@tiptap/react";
import { Spinner } from "../spinner";

type MenuBarProps = {
  editor: Editor;
  onSave: () => Promise<void>;
  isSaving: boolean;
};

type MenuButton = {
  icon: string | React.ReactNode;
  title: string;
  action: () => void;
  isActive?: () => boolean;
  className?: string;
};

export function MenuBar({ editor, onSave, isSaving }: MenuBarProps) {
  const items: MenuButton[] = useMemo(
    () => [
      {
        icon: "bold",
        title: "Bold",
        action: () => editor.chain().focus().toggleBold().run(),
        isActive: () => editor.isActive("bold"),
      },
      {
        icon: "italic",
        title: "Italic",
        action: () => editor.chain().focus().toggleItalic().run(),
        isActive: () => editor.isActive("italic"),
      },
      {
        icon: "strikethrough",
        title: "Strike",
        action: () => editor.chain().focus().toggleStrike().run(),
        isActive: () => editor.isActive("strike"),
      },
      {
        icon: "code-view",
        title: "Code",
        action: () => editor.chain().focus().toggleCode().run(),
        isActive: () => editor.isActive("code"),
      },
      {
        icon: "h-1",
        title: "Heading 1",
        action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: () => editor.isActive("heading", { level: 1 }),
      },
      {
        icon: "h-2",
        title: "Heading 2",
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => editor.isActive("heading", { level: 2 }),
      },
      {
        icon: "paragraph",
        title: "Paragraph",
        action: () => editor.chain().focus().setParagraph().run(),
        isActive: () => editor.isActive("paragraph"),
      },
      {
        icon: "list-unordered",
        title: "Bullet List",
        action: () => editor.chain().focus().toggleBulletList().run(),
        isActive: () => editor.isActive("bulletList"),
      },
      {
        icon: "list-ordered",
        title: "Ordered List",
        action: () => editor.chain().focus().toggleOrderedList().run(),
        isActive: () => editor.isActive("orderedList"),
      },
      {
        icon: "list-check-2",
        title: "Task List",
        action: () => editor.chain().focus().toggleTaskList().run(),
        isActive: () => editor.isActive("taskList"),
      },
      {
        icon: "code-box-line",
        title: "Code Block",
        action: () => editor.chain().focus().toggleCodeBlock().run(),
        isActive: () => editor.isActive("codeBlock"),
      },
      {
        icon: "double-quotes-l",
        title: "Blockquote",
        action: () => editor.chain().focus().toggleBlockquote().run(),
        isActive: () => editor.isActive("blockquote"),
      },
      {
        icon: "separator",
        title: "Horizontal Rule",
        action: () => editor.chain().focus().setHorizontalRule().run(),
      },
      {
        icon: "format-clear",
        title: "Clear Format",
        action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
      },
      {
        icon: "arrow-go-back-line",
        title: "Undo",
        action: () => editor.chain().focus().undo().run(),
      },
      {
        icon: "arrow-go-forward-line",
        title: "Redo",
        action: () => editor.chain().focus().redo().run(),
      },
      {
        icon: isSaving ? <Spinner /> : "save-line",
        title: isSaving ? "Saved!" : "Save",
        action: onSave,
        isActive: () => false,
        className: isSaving ? "saved" : "",
      },
    ],
    [editor, isSaving, onSave]
  );

  return (
    <div className="flex flex-wrap items-center bg-zinc-900 rounded-lg p-1 w-full">
      {items.map((item, index) => (
        <MenuItem key={`${index}-${item.title}`} {...item} />
      ))}
    </div>
  );
}
