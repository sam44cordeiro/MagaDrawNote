import { useState } from "react";
import ToolInToolbarExample from "@/components/ToolInToolbarExample";
import TiptapEditor from "@/components/TiptapEditor";
import "./App.css";

type ViewMode = "canvas" | "editor";

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>("canvas");

  return (
    <div className="app-container">
      {currentView === "canvas" && (
        <ToolInToolbarExample onOpenEditor={() => setCurrentView("editor")} />
      )}

      {currentView === "editor" && (
        <TiptapEditor onBack={() => setCurrentView("canvas")} />
      )}
    </div>
  );
}

export default App;
