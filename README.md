# 🎨 Draw & Write (Tauri App)

Este é um aplicativo desktop híbrido desenvolvido com **Tauri**, que une o poder de um **Quadro Branco Infinito** (visual) com um **Editor de Texto Rico** (documental).

O objetivo é permitir que o usuário organize ideias visualmente e, quando necessário, mergulhe na escrita de documentos longos sem sair do contexto.

## 🚀 O que esse App faz?

1.  **Quadro Branco Infinito (Canvas):**
    *   Baseado no **tldraw**.
    *   Permite desenhar, criar formas, notas adesivas e setas livremente.
    *   Interface limpa e ferramentas personalizadas.

2.  **Editor de Texto Focado:**
    *   Baseado no **Tiptap**.
    *   Um ambiente de escrita limpo (estilo Notion/Word) para textos longos.
    *   Suporta formatação (negrito, títulos, listas, etc).

3.  **Conexão Inteligente (Ferramenta Livro):**
    *   Uma ferramenta personalizada na barra de tarefas (ícone de livro).
    *   Cria "atalhos" no canvas que levam para o editor de texto.

4.  **Persistência Automática:**
    *   Tudo o que você desenha ou escreve é salvo automaticamente no disco local do computador (`app-data.json`).
    *   Você pode fechar o app e abrir novamente que seus dados estarão lá.

---

## 🎮 Como Usar

### No Canvas (Tldraw)
*   **Ferramentas Padrão:** Use lápis, borracha e formas geométricas normalmente.
*   **Ferramenta "Editor" (Ícone de Livro 📖):**
    1.  Selecione a ferramenta de livro na barra inferior.
    2.  Clique em qualquer lugar da tela para carimbar um ícone de livro.
    3.  **Clique Simples:** Seleciona o ícone (permite mover e redimensionar).
    4.  **Clique Longo (Segurar) ou Duplo Clique:** Abre o modo de Editor de Texto (Tiptap).

### No Editor (Tiptap)
*   Escreva seu documento livremente.
*   O conteúdo é salvo enquanto você digita.
*   Clique no botão **"Voltar"** para retornar ao quadro branco.

---

## 🛠️ Tecnologias Utilizadas

*   **Core:** [Tauri v2](https://tauri.app/) (Rust + WebView)
*   **Frontend:** React + TypeScript + Vite
*   **Estilização:** TailwindCSS
*   **Canvas Engine:** [tldraw](https://tldraw.dev/)
*   **Text Engine:** [Tiptap](https://tiptap.dev/)
*   **Persistência:** `tauri-plugin-store`

## ▶️ Como Rodar

1.  Instale as dependências:
    ```bash
    pnpm install
    # ou
    npm install
    ```

2.  Rode em modo de desenvolvimento:
    ```bash
    pnpm tauri dev
    # ou
    npm run tauri dev
    ```