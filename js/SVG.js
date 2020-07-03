// SVG namespace declarations
const svgNS = "http://www.w3.org/2000/svg";


/** The SVG object handles certain management tasks for the main SVG element, and provides helper functions for SVG elements. */
class SVG {
	/**
	 * @param {HTMLDocument} document - The HTML document that will contain all the graphical elements.
	 */
	constructor(document) {

		// Create the main SVG element. This will be the root element for all view components.
		this.mainSVG = this.createElement("svg");

		// Create an extra SVG element for use by the getBBox method.
		this.prerenderingSVG = this.createElement("svg");

		// Add a defs element to the main SVG.
		this.defsElement = this.createElement("defs");
		this.mainSVG.appendChild(this.defsElement);
	}

	/** Add the provided element to the defs element. Note: Elements in defs are not rendered, but may be referenced by other elements.
	 * @param {SVGElement} def - The element to add to the defs element.
	 * @memberof SVG
	 */
	addDef(def) {
		this.defsElement.appendChild(def);
	}

	/** Return the main SVG element.
	 * @returns {SVGSVGElement} The root SVG element.
	 * @memberof SVG
	 */
	getElement() {
		return this.mainSVG;
	}

	/** Create a new SVG element. This is a wrapper for document.createElementNS().
	 * @param {string} tagName - The type of SVG element to create.
	 * @returns {SVGElement} The newly created SVG element.
	 * @memberof SVG
	 */
	createElement(tagName) {
		return document.createElementNS(svgNS, tagName);
	}

	/** Calculate the bounding box of the provided element. To do this, getBBox adds a clone of the element to a temporary SVG root element in the DOM and then queries the element for its bounding box.
	 * @param {SVGElement} element - The element whose bounding box should be calculated.
	 * @returns {SVGRect} An object containing x, y, width, and height properties.
	 * @memberof SVG
	 */
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
