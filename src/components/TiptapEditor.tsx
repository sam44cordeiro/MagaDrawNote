import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import {
  getTiptapContent,
  saveTiptapContent,
  getTiptapTitle,
  saveTiptapTitle,
} from "@/services/storage";
import TextAlign from "@tiptap/extension-text-align";
import { Extension, textInputRule } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";

// --- COMPONENTE DA BARRA LATERAL (SIDEBAR) ---
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [lastColor, setLastColor] = useState(() => {
    return localStorage.getItem("last-highlight-color") || "#ffff00";
  });

  const [, forceUpdate] = useState({});
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => forceUpdate({});

    // Escuta eventos de transação (digitar) e mudança de seleção (clicar/mover cursor)
    editor.on("transaction", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);

    return () => {
      editor.off("transaction", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setLastColor(newColor); // Atualiza visual
    localStorage.setItem("last-highlight-color", newColor); // Salva para sempre
    editor.chain().focus().setHighlight({ color: newColor }).run();
  };

  const currentColorValue =
    editor.getAttributes("highlight").color || lastColor;

  const btnBase =
    "px-3 py-2 rounded text-sm font-medium transition-colors border text-left flex items-center justify-center";

  const btnClass = (isActive: boolean) =>
    `${btnBase} ${
      isActive
        ? "bg-gray-900 text-white border-gray-900 shadow-sm dark:bg-blue-600 dark:border-blue-600 dark:text-white"
        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
    }`;

  const actionBtnClass = `${btnBase} bg-gray-50 text-gray-700 border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700`;

  const sectionTitleClass =
    "text-xs font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500";

  return (
    <div className="w-40 bg-gray-50 border-r border-gray-200 flex flex-col gap-6 p-4 overflow-y-auto h-full shrink-0 dark:bg-gray-900 dark:border-gray-700">
      <div className="flex flex-col gap-2">
        <span className={sectionTitleClass}>Histórico</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().undo().run();
            }}
            disabled={!editor.can().undo()}
            className={actionBtnClass}
            title="Desfazer CTRL+Z"
          >
            ↶
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().redo().run();
            }}
            disabled={!editor.can().redo()}
            className={actionBtnClass}
            title="Refazer CTRL+Y"
          >
            ↷
          </button>
        </div>
      </div>

      <hr className="border-gray-200" />

      <div className="flex flex-col gap-2">
        <span className={sectionTitleClass}>Alinhamento</span>
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().setTextAlign("left").run();
            }}
            className={btnClass(editor.isActive({ textAlign: "left" }))}
            title="Esquerda"
          >
            《
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().setTextAlign("center").run();
            }}
            className={btnClass(editor.isActive({ textAlign: "center" }))}
            title="Centro"
          >
            ☰
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().setTextAlign("right").run();
            }}
            className={btnClass(editor.isActive({ textAlign: "right" }))}
            title="Direita"
          >
            》
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().setTextAlign("justify").run();
            }}
            className={btnClass(editor.isActive({ textAlign: "justify" }))}
            title="Justificado"
          >
            《》
          </button>
        </div>
      </div>

      <hr className="border-gray-200" />

      <div className="flex flex-col gap-2">
        <span className={sectionTitleClass}>Estrutura</span>

        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={btnClass(editor.isActive("heading", { level: 1 }))}
          >
            H1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={btnClass(editor.isActive("heading", { level: 2 }))}
          >
            H2
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={btnClass(editor.isActive("heading", { level: 3 }))}
          >
            H3
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className={btnClass(editor.isActive("heading", { level: 4 }))}
          >
            H4
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            className={btnClass(editor.isActive("heading", { level: 5 }))}
          >
            H5
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            className={btnClass(editor.isActive("heading", { level: 6 }))}
          >
            H6
          </button>
        </div>

        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`w-full ${btnClass(editor.isActive("paragraph"))}`}
        >
          Paragraph
        </button>
      </div>

      <hr className="border-gray-200" />

      <div className="flex flex-col gap-2">
        <span className={sectionTitleClass}>Estilo</span>
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBold().run();
            }}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={btnClass(editor.isActive("bold"))}
          >
            <strong>B</strong>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleItalic().run();
            }}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={btnClass(editor.isActive("italic"))}
          >
            <em>i</em>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleStrike().run();
            }}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={btnClass(editor.isActive("strike"))}
          >
            <s>S</s>
          </button>
        </div>
      </div>

      <hr className="border-gray-200" />

      <div className="flex flex-col gap-2">
        <span className={sectionTitleClass}>Código & Cor</span>

        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-300 shadow-sm cursor-pointer hover:scale-110 transition-transform">
            <input
              type="color"
              value={currentColorValue}
              onChange={handleColorChange}
              onClick={() => {
                editor
                  .chain()
                  .focus()
                  .setHighlight({ color: currentColorValue })
                  .run();
              }}
              className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer p-0 border-0"
              title="Escolher cor do fundo"
            />
          </div>

          <button
            onClick={() => editor.chain().focus().unsetHighlight().run()}
            disabled={!editor.isActive("highlight")}
            className="text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors"
            title="Remover cor"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`mt-2 ${btnClass(editor.isActive("codeBlock"))}`}
        >
          Code Block
        </button>

        <button
          onClick={() => editor.chain().focus().clearNodes().run()}
          className="text-red-600 hover:bg-red-50 border border-transparent px-3 py-2 rounded text-sm text-left transition-colors"
        >
          ⨯ Clear nodes
        </button>
      </div>
    </div>
  );
};

const AutoTravessao = Extension.create({
  name: "autoTravessao",

  addInputRules() {
    return [
      textInputRule({
        find: /--\s$/,
        replace: "— ",
      }),
    ];
  },
});

interface TiptapEditorProps {
  onBack: () => void;
  docId: string;
}

const TiptapEditor = ({ onBack, docId }: TiptapEditorProps) => {
  const [contentLoaded, setContentLoaded] = useState(false);
  const [initialContent, setInitialContent] = useState("");
  const [title, setTitle] = useState("Documento Sem Nome");

  useEffect(() => {
    setContentLoaded(false);
    const load = async () => {
      const saved = await getTiptapContent(docId);
      if (saved) {
        setInitialContent(saved);
      } else {
        setInitialContent(
          `<h1>Novo Documento</h1><p>Comece a escrever aqui...</p>`
        );
      }

      const savedTitle = await getTiptapTitle(docId);
      if (savedTitle) {
        setTitle(savedTitle);
      }

      setContentLoaded(true);
    };
    load();
  }, [docId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    saveTiptapTitle(docId, newTitle);
  };

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        AutoTravessao,
        Highlight.configure({ multicolor: true }),
      ],
      content: initialContent,
      editable: contentLoaded,
      onUpdate: ({ editor }) => {
        saveTiptapContent(docId, editor.getHTML());
      },
      editorProps: {
        attributes: {
          class: `
            outline-none text-black leading-relaxed min-h-[800px]
            dark:text-gray-200
            
            [&_p]:my-4 [&_p]:leading-4
            
            [&_h1]:text-7xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mb-4 [&_h1]:leading-tight
            [&_h2]:text-6xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mb-4 [&_h2]:leading-tight
            [&_h3]:text-5xl [&_h3]:font-bold [&_h3]:mb-4 [&_h3]:mb-4 [&_h3]:leading-tight
            [&_h4]:text-4xl [&_h4]:font-bold [&_h4]:mb-4 [&_h4]:mb-4 [&_h4]:leading-tight
            [&_h5]:text-3xl [&_h5]:font-bold [&_h5]:mb-4 [&_h5]:mb-4 [&_h5]:leading-tight
            [&_h6]:text-2xl [&_h6]:font-bold [&_h6]:mb-4 [&_h6]:mb-4 [&_h6]:leading-tight

            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4
            
            [&_code]:bg-purple-100 [&_code]:text-purple-800 [&_code]:rounded-md [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm
            dark:[&_code]:bg-purple-900 dark:[&_code]:text-purple-200
            
            [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:my-6 [&_pre]:font-mono [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-gray-800
            dark:[&_pre]:bg-gray-800 dark:[&_pre]:text-gray-200
            
            [&_pre_code]:bg-transparent [&_pre_code]:text-inherit [&_pre_code]:p-0
            
            [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-6
            dark:[&_blockquote]:border-gray-600 dark:[&_blockquote]:text-gray-400
            
            [&_hr]:border-t [&_hr]:border-gray-300 [&_hr]:my-8
            dark:[&_hr]:border-gray-700
        `.replace(/\s+/g, " "),
        },
      },
    },
    [contentLoaded, docId]
  );

  if (!contentLoaded)
    return (
      <div className="flex h-screen items-center justify-center text-gray-500 dark:text-gray-400 dark:bg-gray-900">
        Carregando...
      </div>
    );

  return (
    <div className="flex flex-col w-full h-screen bg-gray-100 font-sans overflow-hidden dark:bg-gray-950">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm z-20 shrink-0 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1 text-sm hover:bg-gray-100 px-3 py-1.5 rounded transition-colors dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
          >
            ← Voltar
          </button>
          <div className="h-5 w-px bg-gray-300 dark:bg-gray-700"></div>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Nome do Documento"
            className="bg-transparent border-none outline-none text-sm font-semibold text-gray-500 uppercase tracking-wide w-248 placeholder-gray-300 transition-colors focus:text-gray-800 dark:text-gray-400 dark:focus:text-gray-200"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <MenuBar editor={editor} />

        <div
          className="flex-1 overflow-y-auto bg-gray-100/50 p-8 dark:bg-gray-950"
          onClick={() => editor?.commands.focus()}
        >
          <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl border border-gray-200 p-12 min-h-[calc(100vh-100px)] cursor-text dark:bg-gray-900 dark:border-gray-800 dark:shadow-black/50">
            <EditorContent editor={editor} />
          </div>

          <div className="h-20"></div>
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;
