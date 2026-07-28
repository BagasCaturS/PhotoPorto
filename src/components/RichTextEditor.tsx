"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Quote,
} from "lucide-react"

interface Props {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ["paragraph", "heading"] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert max-w-none min-h-[320px] px-4 py-3 outline-none font-mono text-sm leading-relaxed",
        placeholder: placeholder || "",
      },
    },
  })

  if (!editor) return null

  const ToolBtn = ({ onClick, active, label, children }: {
    onClick: () => void; active?: boolean; label: string; children: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`cursor-pointer rounded-lg p-1.5 transition-colors ${
        active
          ? "bg-foreground/10 text-foreground dark:bg-dark-foreground/10 dark:text-dark-foreground"
          : "text-secondary hover:bg-muted hover:text-foreground dark:text-dark-secondary dark:hover:bg-dark-muted dark:hover:text-dark-foreground"
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="overflow-hidden rounded-xl border border-border dark:border-dark-border">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/50 px-3 py-2 dark:border-dark-border dark:bg-dark-muted/50">
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="Bold">
          <Bold size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="Italic">
          <Italic size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} label="Underline">
          <UnderlineIcon size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} label="Strikethrough">
          <Strikethrough size={15} />
        </ToolBtn>

        <span className="mx-1 h-5 w-px bg-border dark:bg-dark-border" />

        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} label="Heading 1">
          <Heading1 size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} label="Heading 2">
          <Heading2 size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} label="Heading 3">
          <Heading3 size={15} />
        </ToolBtn>

        <span className="mx-1 h-5 w-px bg-border dark:bg-dark-border" />

        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} label="Bullet list">
          <List size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} label="Ordered list">
          <ListOrdered size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} label="Blockquote">
          <Quote size={15} />
        </ToolBtn>

        <span className="mx-1 h-5 w-px bg-border dark:bg-dark-border" />

        <ToolBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} label="Align left">
          <AlignLeft size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} label="Align center">
          <AlignCenter size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} label="Align right">
          <AlignRight size={15} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} label="Justify">
          <AlignJustify size={15} />
        </ToolBtn>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
