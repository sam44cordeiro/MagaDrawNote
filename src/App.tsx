import { useState } from "react";
import ToolInToolbarExample from "./components/ToolInToolbarExample";
import TiptapEditor from "./components/TiptapEditor";
import "./App.css";

type ViewMode = "canvas" | "editor";

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>("canvas");
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  // Função para abrir um documento específico
  const handleOpenEditor = (docId: string) => {
      setActiveDocId(docId); // Guarda o ID
      setCurrentView('editor'); // Troca a tela
  };

  return (
    <div className="app-container">
      {/* MODO O CANVAS */}
      {currentView === "canvas" && (
        <ToolInToolbarExample onOpenEditor={handleOpenEditor} />
      )}

      {/* MODO O TIPTAP */}
      {currentView === 'editor' && activeDocId && (
        <TiptapEditor 
          docId={activeDocId} 
          onBack={() => {
              setCurrentView('canvas');
              setActiveDocId(null);
          }} 
        />
      )}
    </div>
  );
}

export default App;
