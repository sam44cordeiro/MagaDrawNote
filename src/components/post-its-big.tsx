import { StateNode, createShapeId } from 'tldraw'

export class PostItBig extends StateNode {
	static override id = 'postitbig'

	override onEnter() {
		this.editor.setCursor({ type: 'cross', rotation: 0 })
	}

	override onPointerDown() {
		const { currentPagePoint } = this.editor.inputs
		
		const id = createShapeId()
		// Tamanho do ícone (quadrado)
		const SIZE = 64 

		this.editor.createShape({
			id,
			type: 'button-shape', 
			x: currentPagePoint.x - (SIZE / 2), // Centraliza
			y: currentPagePoint.y - (SIZE / 2),
			props: {
				w: SIZE,
				h: SIZE,
                // Removemos o 'text' pois não usamos mais
			},
		})

		this.editor.setCurrentTool('select')
	}
}