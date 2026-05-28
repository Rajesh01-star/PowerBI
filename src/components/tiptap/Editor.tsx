import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect, useCallback, useRef, useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  FileCode,
  ImageIcon,
  Underline as UnderlineIcon,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Unlink,
  Minus,
  Undo,
  Redo,
  IndentIncrease,
  IndentDecrease,
} from "lucide-react";

interface EditorProps {
  content?: string | null;
  onChange: (content: string) => void;
}

// Floating toolbar that appears on text selection
const FloatingToolbar = ({ editor }: { editor: any }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  const setLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter URL:");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const updateToolbar = () => {
      const { from, to, empty } = editor.state.selection;

      if (empty || from === to) {
        setIsVisible(false);
        return;
      }

      // Get selection coordinates
      const { view } = editor;
      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);

      const left = (start.left + end.left) / 2;
      const top = start.top - 50; // Position above selection

      setPosition({ top, left });
      setIsVisible(true);
    };

    editor.on("selectionUpdate", updateToolbar);
    editor.on("blur", () => setIsVisible(false));

    return () => {
      editor.off("selectionUpdate", updateToolbar);
      editor.off("blur", () => setIsVisible(false));
    };
  }, [editor]);

  if (!isVisible || !editor) return null;

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 flex items-center gap-1 p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 shadow-xl animate-in fade-in duration-100"
      style={{
        top: position.top,
        left: position.left,
        transform: "translateX(-50%)",
      }}
    >
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={`p-1.5 rounded transition-colors hover:bg-zinc-700 ${
          editor.isActive("bold") ? "text-primary bg-zinc-700" : "text-zinc-300"
        }`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={`p-1.5 rounded transition-colors hover:bg-zinc-700 ${
          editor.isActive("italic")
            ? "text-primary bg-zinc-700"
            : "text-zinc-300"
        }`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        className={`p-1.5 rounded transition-colors hover:bg-zinc-700 ${
          editor.isActive("underline")
            ? "text-primary bg-zinc-700"
            : "text-zinc-300"
        }`}
        title="Underline"
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleStrike().run();
        }}
        className={`p-1.5 rounded transition-colors hover:bg-zinc-700 ${
          editor.isActive("strike")
            ? "text-primary bg-zinc-700"
            : "text-zinc-300"
        }`}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      <div className="w-px h-5 bg-zinc-600 mx-1" />
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHighlight().run();
        }}
        className={`p-1.5 rounded transition-colors hover:bg-zinc-700 ${
          editor.isActive("highlight")
            ? "text-yellow-400 bg-zinc-700"
            : "text-zinc-300"
        }`}
        title="Highlight"
      >
        <Highlighter className="w-4 h-4" />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleCode().run();
        }}
        className={`p-1.5 rounded transition-colors hover:bg-zinc-700 ${
          editor.isActive("code") ? "text-primary bg-zinc-700" : "text-zinc-300"
        }`}
        title="Code"
      >
        <Code className="w-4 h-4" />
      </button>
      <div className="w-px h-5 bg-zinc-600 mx-1" />
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          setLink();
        }}
        className={`p-1.5 rounded transition-colors hover:bg-zinc-700 ${
          editor.isActive("link")
            ? "text-blue-400 bg-zinc-700"
            : "text-zinc-300"
        }`}
        title="Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
      {editor.isActive("link") && (
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().unsetLink().run();
          }}
          className="p-1.5 rounded transition-colors hover:bg-zinc-700 text-zinc-300"
          title="Remove Link"
        >
          <Unlink className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

const MenuBar = ({ editor }: { editor: any }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && editor) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          editor.chain().focus().setImage({ src: base64 }).run();
        };
        reader.readAsDataURL(file);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [editor]
  );

  const triggerImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const buttons = [
    // Undo/Redo
    {
      icon: <Undo className="w-4 h-4" />,
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
      disabled: !editor.can().undo(),
      title: "Undo",
    },
    {
      icon: <Redo className="w-4 h-4" />,
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
      disabled: !editor.can().redo(),
      title: "Redo",
    },
    { type: "separator" },
    // Headings
    {
      icon: <Heading1 className="w-4 h-4" />,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive("heading", { level: 1 }),
      title: "Heading 1",
    },
    {
      icon: <Heading2 className="w-4 h-4" />,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
      title: "Heading 2",
    },
    {
      icon: <Heading3 className="w-4 h-4" />,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
      title: "Heading 3",
    },
    { type: "separator" },
    // Text formatting
    {
      icon: <Bold className="w-4 h-4" />,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      title: "Bold",
    },
    {
      icon: <Italic className="w-4 h-4" />,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      title: "Italic",
    },
    {
      icon: <UnderlineIcon className="w-4 h-4" />,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
      title: "Underline",
    },
    {
      icon: <Strikethrough className="w-4 h-4" />,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
      title: "Strikethrough",
    },
    {
      icon: <Highlighter className="w-4 h-4" />,
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: editor.isActive("highlight"),
      title: "Highlight",
    },
    {
      icon: <Code className="w-4 h-4" />,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive("code"),
      title: "Inline Code",
    },
    { type: "separator" },
    // Alignment
    {
      icon: <AlignLeft className="w-4 h-4" />,
      action: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: editor.isActive({ textAlign: "left" }),
      title: "Align Left",
    },
    {
      icon: <AlignCenter className="w-4 h-4" />,
      action: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: editor.isActive({ textAlign: "center" }),
      title: "Align Center",
    },
    {
      icon: <AlignRight className="w-4 h-4" />,
      action: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: editor.isActive({ textAlign: "right" }),
      title: "Align Right",
    },
    { type: "separator" },
    // Indentation
    {
      icon: <IndentDecrease className="w-4 h-4" />,
      action: () => editor.chain().focus().liftListItem("listItem").run(),
      isActive: false,
      disabled: !editor.can().liftListItem("listItem"),
      title: "Decrease Indent (Shift+Tab)",
    },
    {
      icon: <IndentIncrease className="w-4 h-4" />,
      action: () => editor.chain().focus().sinkListItem("listItem").run(),
      isActive: false,
      disabled: !editor.can().sinkListItem("listItem"),
      title: "Increase Indent (Tab)",
    },
    { type: "separator" },
    // Lists & Blocks
    {
      icon: <List className="w-4 h-4" />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      title: "Bullet List (type - or *)",
    },
    {
      icon: <ListOrdered className="w-4 h-4" />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      title: "Ordered List (type 1.)",
    },
    {
      icon: <Quote className="w-4 h-4" />,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
      title: "Quote (type >)",
    },
    {
      icon: <FileCode className="w-4 h-4" />,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive("codeBlock"),
      title: "Code Block (type ```)",
    },
    {
      icon: <Minus className="w-4 h-4" />,
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: false,
      title: "Horizontal Rule (type ---)",
    },
    { type: "separator" },
    // Links & Media
    {
      icon: <LinkIcon className="w-4 h-4" />,
      action: setLink,
      isActive: editor.isActive("link"),
      title: "Add Link",
    },
    {
      icon: <Unlink className="w-4 h-4" />,
      action: () => editor.chain().focus().unsetLink().run(),
      isActive: false,
      disabled: !editor.isActive("link"),
      title: "Remove Link",
    },
    {
      icon: <ImageIcon className="w-4 h-4" />,
      action: triggerImageUpload,
      isActive: false,
      title: "Upload Image",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-sidebar-border bg-background dark:bg-[#0c0c0c] sticky top-0 z-10">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      {buttons.map((btn, index) =>
        btn.type === "separator" ? (
          <div key={index} className="w-px h-6 bg-sidebar-border mx-1" />
        ) : (
          <button
            key={index}
            onClick={btn.action}
            disabled={btn.disabled}
            className={`p-1.5 rounded-md transition-colors duration-200 hover:bg-sidebar-accent disabled:opacity-30 disabled:cursor-not-allowed ${
              btn.isActive
                ? "text-primary bg-sidebar-accent"
                : "text-sidebar-foreground/70"
            }`}
            title={btn.title}
            type="button"
          >
            {btn.icon}
          </button>
        )
      )}
    </div>
  );
};

export const Editor = ({ content, onChange }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: "list-disc pl-6 my-2",
            style: "list-style-type: disc;",
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: "list-decimal pl-6 my-2 text-xs",
            style: "list-style-type: decimal;",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "my-1 text-xs",
            style: "display: list-item; ",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class:
              "bg-zinc-900 text-zinc-100 rounded-lg p-4 font-mono text-sm overflow-x-auto border border-zinc-700",
          },
        },
        code: {
          HTMLAttributes: {
            class:
              "bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono",
          },
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4",
        },
        allowBase64: true,
      }),
      Underline,
      Highlight.configure({
        multicolor: false,
        HTMLAttributes: {
          class: "bg-yellow-200 dark:bg-yellow-500/30 rounded px-0.5",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer hover:text-blue-600",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[500px] p-8 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1",
      },
      handleKeyDown: (view, event) => {
        // Handle Tab for indentation in lists
        if (event.key === "Tab") {
          const { editor } = view.state as any;
          if (editor) {
            if (event.shiftKey) {
              editor.chain().focus().liftListItem("listItem").run();
            } else {
              editor.chain().focus().sinkListItem("listItem").run();
            }
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Sync content updates from parent (e.g. loading a post)
  useEffect(() => {
    if (editor) {
      const safeContent = content || "";
      if (editor.getHTML() !== safeContent) {
        editor.commands.setContent(safeContent);
      }
    }
  }, [content, editor]);

  return (
    <div className="w-full h-full flex flex-col bg-background dark:bg-[#161616]">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto relative">
        <FloatingToolbar editor={editor} />
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
};
