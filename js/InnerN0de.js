import AbstractN0de from './AbstractN0de.js'
import margins from './margins.js'

class InnerN0de extends AbstractN0de {
	constructor(svgArg, n0deView, id, type, position, s0ckets) {
		super(svgArg, n0deView, id, type, s0ckets);
		
		this.element.prepend(this.frame);
		this.frame.classList.add("innerN0deFrame");
		this.frame.setAttribute("x", margins.offset);
		this.frame.setAttribute("y", margins.offset);

		this.position = [position[0] - margins.offset, position[1] - margins.offset];
		this.element.setAttribute("x", this.position[0]);
		this.element.setAttribute("y", this.position[1]);
		this.element.classList.add("innerN0de");
		this.shrinkWrap();
	}
	addS0cket(s0cketSpec, inOut, index) {
		super.addS0cket(s0cketSpec, "inner", inOut, index);
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
