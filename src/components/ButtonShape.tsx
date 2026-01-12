import {
  HTMLContainer,
  ShapeUtil,
  TLBaseShape,
  T,
  Rectangle2d,
  TLResizeInfo,
  StateNode,
  createShapeId,
} from "tldraw";
import { useRef } from "react";

// ---------------------------------------------------------
// 1. DEFINIÇÃO DO TIPO DA FORMA
// ---------------------------------------------------------
export type IButtonShape = TLBaseShape<
  "button-shape",
  {
    w: number;
    h: number;
  }
>;

// ---------------------------------------------------------
// 2. COMPONENTE REACT (LÓGICA DE INTERAÇÃO/RENDERIZAÇÃO)
// ---------------------------------------------------------
const ButtonComponent = ({ shape }: { shape: IButtonShape }) => {
  // Refs para controlar o tempo e posição
  const longPressTimerRef = useRef<any>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  // 1. PRESSIONOU O MOUSE
  const handlePointerDown = (e: React.PointerEvent) => {
    // Deixamos o Tldraw selecionar, mover e redimensionar nativamente.

    // Guardamos a posição inicial para verificar se o mouse moveu depois
    startPosRef.current = { x: e.clientX, y: e.clientY };

    // Iniciamos o timer do Clique Longo (500ms)
    longPressTimerRef.current = setTimeout(() => {
      console.log("Clique longo detectado: Abrindo editor...");

      // AÇÃO DO CLIQUE LONGO: ABRIR EDITOR
      window.dispatchEvent(
        new CustomEvent("open-tiptap-editor", {
          detail: { id: shape.id },
        })
      );

      // Feedback tátil (vibrar) se possível
      if (navigator.vibrate) navigator.vibrate(50);

      // Limpa o timer para não disparar de novo
      longPressTimerRef.current = null;
    }, 500);
  };

  // 2. MOVEU O MOUSE
  const handlePointerMove = (e: React.PointerEvent) => {
    // Se o usuário mover o mouse significativamente (> 5px), é porque está tentando
    // ARRASTAR ou REDIMENSIONAR o objeto.
    if (startPosRef.current) {
      const dist = Math.hypot(
        e.clientX - startPosRef.current.x,
        e.clientY - startPosRef.current.y
      );

      if (dist > 5) {
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
        console.log("Clique simples/Movimento: Abrindo...", shape.id);
        window.dispatchEvent(
          new CustomEvent("open-tiptap-editor", {
            detail: { id: shape.id },
          })
        );
      }
    }
  };

  // 3. SOLTOU O MOUSE OU SAIU DE CIMA
  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    startPosRef.current = null;
  };

  return (
    <HTMLContainer style={{ pointerEvents: "all" }}>
      <div
        data-shape-id={shape.id}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={cancelLongPress}
        onPointerLeave={cancelLongPress}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-text)",
          transition: "transform 0.1s, color 0.1s",
          cursor: "pointer",
          userSelect: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.color = "#2563eb";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.color = "var(--color-text)";
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M37.848 44.496c2.55-.219 4.477-2.198 4.664-4.75C42.75 36.516 43 31.365 43 24s-.25-12.517-.488-15.745c-.188-2.554-2.113-4.532-4.664-4.75C34.908 3.252 30.37 3 24 3s-10.909.253-13.848.504c-2.55.219-4.476 2.197-4.664 4.75C5.25 11.484 5 16.635 5 24s.25 12.517.488 15.745c.188 2.554 2.113 4.533 4.664 4.75C13.092 44.748 17.63 45 24 45s10.909-.253 13.848-.504M14 3.242v41.516M22 12h12m-12 7h6" />
        </svg>
      </div>
    </HTMLContainer>
  );
};

// ---------------------------------------------------------
// 3. CLASSE UTILITÁRIA DA FORMA (SHAPE UTIL)
// ---------------------------------------------------------
export class ButtonShapeUtil extends ShapeUtil<IButtonShape> {
  static override type = "button-shape" as const;

  override canResize = () => true;
  override isAspectRatioLocked = () => true;

  static override props = {
    w: T.number,
    h: T.number,
  };

  override getDefaultProps(): IButtonShape["props"] {
    return {
      w: 64,
      h: 64,
    };
  }

  override getGeometry(shape: IButtonShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  override onResize(_shape: IButtonShape, info: TLResizeInfo<IButtonShape>) {
    return {
      props: {
        w: Math.max(32, info.initialShape.props.w * info.scaleX),
        h: Math.max(32, info.initialShape.props.h * info.scaleY),
      },
    };
  }

  override component(shape: IButtonShape) {
    return <ButtonComponent shape={shape} />;
  }

  override indicator(shape: IButtonShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}

// ---------------------------------------------------------
// 4. A FERRAMENTA (TOOL)
// ---------------------------------------------------------
export class PostItBig extends StateNode {
  static override id = "postitbig";

  override onEnter() {
    this.editor.setCursor({ type: "cross", rotation: 0 });
  }

  override onPointerDown() {
    const { currentPagePoint } = this.editor.inputs;

    const id = createShapeId();
    // Tamanho do ícone (quadrado)
    const SIZE = 64;

    this.editor.createShape({
      id,
      type: "button-shape",
      x: currentPagePoint.x - SIZE / 2,
      y: currentPagePoint.y - SIZE / 2,
      props: {
        w: SIZE,
        h: SIZE,
      },
    });

    this.editor.setCurrentTool("select");
  }
}
