import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { getTiptapContent, saveTiptapContent } from "@/services/storage";

interface TiptapEditorProps {
  onBack: () => void;
}

const TiptapEditor = ({ onBack }: TiptapEditorProps) => {
  const [contentLoaded, setContentLoaded] = useState(false);
  const [initialContent, setInitialContent] = useState("");

  // 1. CARREGAR ANTES DE INICIAR O EDITOR
  useEffect(() => {
    const load = async () => {
      const saved = await getTiptapContent();
      if (saved) {
        setInitialContent(saved);
      } else {
        setInitialContent(`<h2>Olá! 👋</h2><p>Comece a escrever...</p>`);
      }
      setContentLoaded(true);
    };
    load();
  }, []);

  const editor = useEditor(
    {
      extensions: [StarterKit],
      content: initialContent,
      editable: contentLoaded,

      // 2. SALVAR AO DIGITAR
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        saveTiptapContent(html);
      },
      editorProps: {
        attributes: {
          class: `outline-none min-h-[500px] text-gray-800 ... (suas classes tailwind) ...`,
        },
      },
    },
    [contentLoaded]
  );

  if (!contentLoaded) return <div>Carregando...</div>;

  return (
    <div className="flex flex-col w-full h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Header / Barra Superior */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-sm"
          >
            <span>⬅</span> Voltar
          </button>
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <span className="text-xl font-bold text-gray-700">
            Editor de Livro
          </span>
        </div>

        <div className="text-sm text-gray-500">Salvando automaticamente...</div>
      </div>
      <div className="max-w-4xl mx-auto ...">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
