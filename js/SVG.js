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

		// To calculate the bounding box of an element it must first be added to the DOM so that it visually "exists".
		// It can't be directly added to the DOM---it needs to be wrapped in an <svg> element, hence the prerenderingSVG.
		// This method is sometimes used on elements that have already been placed somewhere in the mainSVG,
		// and appending the element to the prerenderingSVG would cause it to be removed from where it belongs.
		// Instead, we make a clone of the element and calculate the bounding box of the clone.
		let clone = element.cloneNode(true);
		document.body.appendChild(this.prerenderingSVG);
		this.prerenderingSVG.appendChild(clone);
		let bbox = clone.getBBox();

		// Before we return our measurements let's clean up our little measuring station.
		this.prerenderingSVG.removeChild(clone);
		document.body.removeChild(this.prerenderingSVG);

		return bbox;
	}
}

export default SVG
