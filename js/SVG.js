// SVG namespace declarations
const svgNS = "http://www.w3.org/2000/svg";
const xlinkNS = "http://www.w3.org/1999/xlink";

class SVG {

	constructor(document) {
		this.prerenderingSVG = this.createElement("svg");
	}

	createElement(tagName) {
		return document.createElementNS(svgNS, tagName);
	}

	getBBox(element) {
		document.body.appendChild(this.prerenderingSVG);
		this.prerenderingSVG.appendChild(element);
		let bbox = element.getBBox();
		this.prerenderingSVG.removeChild(element);
		document.body.removeChild(this.prerenderingSVG);
		return bbox;
	}
}

export default SVG
