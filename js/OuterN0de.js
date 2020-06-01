import AbstractN0de from './AbstractN0de.js'
import margins from './margins.js'

class OuterN0de extends AbstractN0de {
	constructor(svgArg, n0deView, id, type, s0ckets) {
		super(svgArg, n0deView, id, type, s0ckets);
		
		this.position = [margins.outerN0de.sideMargin - margins.offset, margins.outerN0de.topMargin - margins.offset];
		this.element.setAttribute("x", this.position[0]);
		this.element.setAttribute("y", this.position[1]);
		this.element.classList.add("outerN0de");

		this.mask = svgArg.createElement("mask");
		this.mask.id = "outerN0deMask";

		this.maskBack = svgArg.createElement("use");
		this.maskBack.setAttribute("href", "#" + "fullScreenRect");
		this.maskBack.id = "outerN0deMaskBack"
		this.mask.appendChild(this.maskBack);

		let frameDefID = "outerN0deFrameDef";
		this.frame.id = frameDefID;
		svgArg.addDef(this.frame);

		this.maskFrame = svgArg.createElement("use");
		this.maskFrame.setAttribute("href", "#" + frameDefID);
		this.maskFrame.setAttribute("x", margins.outerN0de.sideMargin);
		this.maskFrame.setAttribute("y", margins.outerN0de.topMargin);
		this.mask.appendChild(this.maskFrame);

		this.frameLink = svgArg.createElement("use");
		this.frameLink.classList.add("outerN0deFrame");
		this.frameLink.setAttribute("href", "#" + frameDefID);
		this.frameLink.setAttribute("x", margins.offset);
		this.frameLink.setAttribute("y", margins.offset);
		this.element.prepend(this.frameLink);
	}
	getElement() {
		return this.element;
	}
	getMask() {
		return this.mask;
	}
	addS0cket(s0cketSpec, inOut, index) {
		super.addS0cket(s0cketSpec, "outer", inOut, index);
	}
	fitToWindow(sizeVector) {
		let newWidth = sizeVector[0] - margins.outerN0de.sideMargin * 2;
		let newHeight = sizeVector[1] - (margins.outerN0de.topMargin + margins.outerN0de.bottomMargin);
		this.resize([newWidth, newHeight]);
	}
}

export default OuterN0de
