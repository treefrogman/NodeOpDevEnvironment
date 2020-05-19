// SVG namespace declarations
const svgNS = "http://www.w3.org/2000/svg";
const xlinkNS = "http://www.w3.org/1999/xlink";

class SVG {

	constructor(document) {
		this.document = document;
	}

	createElement(tagName) {
		return this.document.createElementNS(svgNS, tagName);
	}
}

export default SVG
