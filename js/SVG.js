// SVG elements (not just <svg>, but <circle>, <rect>, etc.) need to be declared using the SVG namespace.
const svgNS = "http://www.w3.org/2000/svg";


/** The SVG object handles certain management tasks for the main SVG element, and provides helper functions for SVG elements. */
class SVG {
	constructor() {

		// The mainSVG will be the root element for all view components.
		this.mainSVG = this.createElement("svg");

		// The prerenderingSVG spends most of its time empty and unrendered.
		// It will only be added to the document briefly whenever a bounding box needs to be calculated.
		// See the getBBox method for details on how this works.
		this.prerenderingSVG = this.createElement("svg");

		// The defsElement is a container for elements such as gradients and shapes that are not meant to be rendered directly.
		// Like abstract classes, these elements are then instanced by other elements which don't then need to rearticulate their details.
		this.defsElement = this.createElement("defs");
		this.mainSVG.appendChild(this.defsElement);
	}

	/** Add the provided element to the defs element. Elements in defs are not rendered, but may be referenced by other elements.
	 * @param {SVGElement} def - The element to add to the defs element.
	 * @memberof SVG
	 */
	addDef(def) {
		this.defsElement.appendChild(def);
	}

	/** Create a new SVG element. This is a wrapper for document.createElementNS().
	 * @param {string} tagName - The type of SVG element to create.
	 * @returns {SVGElement} The newly created SVG element.
	 * @memberof SVG
	 */
	createElement(tagName) {
		return document.createElementNS(svgNS, tagName);
	}
}

export default SVG
