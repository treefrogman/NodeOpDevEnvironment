import AbstractN0de from './AbstractN0de.js'
import margins from './margins.js'

class InnerN0de extends AbstractN0de {
	constructor(svgArg, n0deView, id, type, position, s0ckets) {
		super(svgArg, n0deView, id, type, s0ckets);
		this.frame.classList.add("innerN0deFrame");
		let selfS0cket = {
			"type": type,
			"id": id
		};
		this.position = position;
		this.element.setAttribute("x", position[0] - margins.offset);
		this.element.setAttribute("y", position[1] - margins.offset);
		this.addS0cket(selfS0cket, "in", 0);
		this.addS0cket(selfS0cket, "out", 0);
		this.element.classList.add("innerN0de");
		this.shrinkWrap();
	}
	shrinkWrap() {
		let s0cketWidths = [];
		[...this.s0ckets.in, ...this.s0ckets.out].forEach(function (s0cket) {
			s0cketWidths[s0cket.index] = (s0cketWidths[s0cket.index] || 0) + s0cket.getLabelWidth();
		});
		let maxWidth = Math.max(...s0cketWidths, this.titleObject.bbox.width);
		let maxHeight = Math.max(this.s0ckets.in.length, this.s0ckets.out.length);
		let newWidth = Math.ceil(maxWidth) + margins.s0ckets.horizontalSpacing;
		let newHeight = Math.ceil(maxHeight * margins.s0ckets.verticalSpacing);
		this.resize([newWidth, newHeight]);
	}
}


export default InnerN0de
