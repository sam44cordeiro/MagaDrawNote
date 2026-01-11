import { useEffect, useRef } from "react";
import {
  DefaultKeyboardShortcutsDialog,
  DefaultKeyboardShortcutsDialogContent,
  DefaultToolbar,
  DefaultToolbarContent,
  TLComponents,
  TLUiAssetUrlOverrides,
  TLUiOverrides,
  Tldraw,
  TldrawUiMenuItem,
  useIsToolSelected,
  useTools,
  Editor,
  TLStoreSnapshot,
} from "tldraw";
import "tldraw/tldraw.css";
import { PostItBig } from "./post-its-big";
import { ButtonShapeUtil } from "./ButtonShape";

import { getTldrawSnapshot, saveTldrawSnapshot } from "@/services/storage";

const BOOK_ICON_URL = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M37.848 44.496c2.55-.219 4.477-2.198 4.664-4.75C42.75 36.516 43 31.365 43 24s-.25-12.517-.488-15.745c-.188-2.554-2.113-4.532-4.664-4.75C34.908 3.252 30.37 3 24 3s-10.909.253-13.848.504c-2.55.219-4.476 2.197-4.664 4.75C5.25 11.484 5 16.635 5 24s.25 12.517.488 15.745c.188 2.554 2.113 4.533 4.664 4.75C13.092 44.748 17.63 45 24 45s10.909-.253 13.848-.504M14 3.242v41.516M22 12h12m-12 7h6"/>
</svg>
`)}`;

export const customAssetUrls: TLUiAssetUrlOverrides = {
  icons: {
    "book-icon": BOOK_ICON_URL,
  },
};

const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    tools.postitbig = {
      id: "postitbig",
      icon: "book-icon",
      label: "Criar Botão Tiptap",
      kbd: "s",
      onSelect: () => {
        editor.setCurrentTool("postitbig");
      },
    };
    return tools;
  },
};

const components: TLComponents = {
  Toolbar: (props) => {
    const tools = useTools();
    const isStickerSelected = useIsToolSelected(tools["postitbig"]);
    return (
      <DefaultToolbar {...props}>
        <TldrawUiMenuItem
          {...tools["postitbig"]}
          isSelected={isStickerSelected}
        />
        <DefaultToolbarContent />
      </DefaultToolbar>
    );
  },
  KeyboardShortcutsDialog: (props) => {
    const tools = useTools();
    return (
      <DefaultKeyboardShortcutsDialog {...props}>
        <DefaultKeyboardShortcutsDialogContent />
        <TldrawUiMenuItem {...tools["postitbig"]} />
      </DefaultKeyboardShortcutsDialog>
    );
  },
};

const customTools = [PostItBig];
const customShapeUtils = [ButtonShapeUtil];

interface ToolProps {
  onOpenEditor: () => void;
}

export default function ToolInToolbarExample({ onOpenEditor }: ToolProps) {
  const saveTimeoutRef = useRef<any>(null);
  const editorRef = useRef<Editor | null>(null);

  // 1. CARREGAR DADOS AO INICIAR
  const handleMount = (editor: Editor) => {
    editorRef.current = editor;

    void (async () => {
      try {
        const snapshot = await getTldrawSnapshot();
        if (snapshot) {
          editor.loadSnapshot(snapshot as TLStoreSnapshot);
          console.log("✅ Tldraw carregado.");
        }
      } catch (e) {
        console.error("Erro ao carregar", e);
      }

      editor.store.listen(() => {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
          const snapshot = editor.getSnapshot();
          saveTldrawSnapshot(snapshot);
        }, 200);
      });
    })();
  };

  useEffect(() => {
    const handleOpenEditor = () => {
      onOpenEditor();
    };
    window.addEventListener("open-tiptap-editor", handleOpenEditor);
    return () => {
      window.removeEventListener("open-tiptap-editor", handleOpenEditor);
    };
  }, [onOpenEditor]);

  return (
    <div className="tldraw__editor" style={{ width: "100%", height: "100vh" }}>
      <Tldraw
        tools={customTools}
        shapeUtils={customShapeUtils}
        initialState="select"
        overrides={uiOverrides}
        components={components}
        assetUrls={customAssetUrls}
        onMount={handleMount}
      />
    </div>
  );
}
