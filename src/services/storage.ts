import { Store } from "@tauri-apps/plugin-store";

let store: Store | null = null;

async function getStore() {
  if (!store) {
    store = await Store.load("app-data-v2.json");
  }
  return store;
}

export const saveTldrawSnapshot = async (snapshot: any) => {
  try {
    const db = await getStore();
    await db.set("tldraw-data", snapshot);
    await db.save(); // Importante: força a escrita no disco
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
export const saveTiptapContent = async (htmlContent: string) => {
  const db = await getStore();
  await db.set("tiptap-data", htmlContent);
  await db.save();
};

export const getTiptapContent = async () => {
  const db = await getStore();
  return await db.get<string>("tiptap-data");
};
