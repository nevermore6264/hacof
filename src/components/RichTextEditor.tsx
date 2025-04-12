// src/components/RichTextEditor.tsx
"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-2 p-2 border-b border-gray-200">
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("bold") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        Bold
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("italic") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        Italic
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("bulletList") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        Bullet List
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("orderedList") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        Ordered List
      </Button>
      <Button
        type="button"
        size="sm"
        variant={
          editor.isActive("heading", { level: 2 }) ? "default" : "outline"
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        Heading
      </Button>
      <Button
        type="button"
        size="sm"
        variant={editor.isActive("blockquote") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        Quote
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => editor.chain().focus().setHardBreak().run()}
      >
        Break
      </Button>
    </div>
  );
};

export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border border-gray-200 rounded-md">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose max-w-none p-3 min-h-[150px] focus:outline-none"
      />
    </div>
  );
}
