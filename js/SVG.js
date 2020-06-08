// SVG namespace declarations
const svgNS = "http://www.w3.org/2000/svg";
const xlinkNS = "http://www.w3.org/1999/xlink";

class SVG {
	constructor(document) {

		// Create the main SVG element. This will be the root element for all view components.
		this.mainSVG = this.createElement("svg");

		// Create an extra SVG element for use by the getBBox method.
		this.prerenderingSVG = this.createElement("svg");

		// Add a defs element to the main SVG.
		this.defsElement = this.createElement("defs");
		this.mainSVG.appendChild(this.defsElement);
	}

	// Add the provided element to the defs element.
	// Elements in defs are not rendered, but may be referenced by other elements.
	addDef(def) {
		this.defsElement.appendChild(def);
	}

	// Return the main SVG element.
	getElement() {
		return this.mainSVG;
	}

	// Create a new SVG element. This is a wrapper for document.createElementNS.
	createElement(tagName) {
		return document.createElementNS(svgNS, tagName);
	}

	// Calculate the bounding box of the provided element.
	// This requires adding it to an SVG element that is in the DOM.
	getBBox(element) {

		// Make a clone of the element so that when it is added to the prerenderingSVG
		// it doesn't get removed from wherever it might already have been placed.
		let clone = element.cloneNode(true);

		// Add the prerenderingSVG element to the DOM, then add the cloned element to the prerenderingSVG.
		document.body.appendChild(this.prerenderingSVG);
		this.prerenderingSVG.appendChild(clone);

		// Get the bounding box.
		let bbox = clone.getBBox();

		// Remove everything.
		this.prerenderingSVG.removeChild(clone);
		document.body.removeChild(this.prerenderingSVG);

		// Return the bounding box.
		return bbox;
	}
}

export default SVG
