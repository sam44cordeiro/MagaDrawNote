import { Store } from "@tauri-apps/plugin-store";
import { documentDir, join } from "@tauri-apps/api/path";

let store: Store | null = null;

async function getStore() {
  if (!store) {
    try {
      // 1. Pega o caminho da pasta Documentos do usuário
      const docsPath = await documentDir();
      
      // 2. Cria o caminho completo: Documentos/MagaDrawNote/app-data-v2.json
      const fullPath = await join(docsPath, 'MagaDrawNote', 'app-data-v2.json');
      
      console.log("📂 Tentando salvar em:", fullPath);

      // 3. Carrega o Store nesse caminho específico
      store = await Store.load(fullPath);
      
    } catch (err) {
      console.error("Erro ao definir caminho do arquivo:", err);
      // Fallback: se der erro, salva no padrão (AppData)
      store = await Store.load("app-data-v2.json");
    }
  }
  return store;
}


export const saveTldrawUiState = async (uiState: any) => {
  try {
    const db = await getStore();
    await db.set("tldraw-ui-state", uiState);
    await db.save();
  } catch (err) {
    console.error("❌ Erro ao salvar UI State:", err);
  }
};

export const getTldrawUiState = async () => {
  try {
    const db = await getStore();
    return await db.get<any>("tldraw-ui-state");
  } catch (err) {
    return null;
  }
};

export const saveTldrawSnapshot = async (snapshot: any) => {
  try {
    const db = await getStore();
    await db.set("tldraw-data", snapshot);
    await db.save(); 
    console.log("💾 Tldraw: Snapshot salvo no disco.");
  } catch (err) {
    console.error("❌ Erro ao salvar Tldraw:", err);
  }
};

export const getTldrawSnapshot = async () => {
  try {
    const db = await getStore();
    const data = await db.get("tldraw-data");
    console.log(
      data
        ? "📂 Tldraw: Dados encontrados."
        : "📂 Tldraw: Nenhum dado salvo ainda."
    );
    return data;
  } catch (err) {
    console.error("❌ Erro ao carregar Tldraw:", err);
    return null;
  }
};
export const saveTiptapContent = async (docId: string, htmlContent: string) => {
  const db = await getStore();
  await db.set(`tiptap-data-${docId}`, htmlContent);
  await db.save();
};

export const getTiptapContent = async (docId: string) => {
  const db = await getStore();
  return await db.get<string>(`tiptap-data-${docId}`);
};

export const saveTiptapTitle = async (docId: string, title: string) => {
  const db = await getStore();
  await db.set(`tiptap-title-${docId}`, title);
  await db.save();
};

export const getTiptapTitle = async (docId: string) => {
  const db = await getStore();
  return await db.get<string>(`tiptap-title-${docId}`);
};
