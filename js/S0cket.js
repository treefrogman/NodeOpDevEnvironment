/** @module S0cket */

import margins from './margins.js'

// TODO: remove
let svg = null;

/**The S0cket class creates and manages all the graphical elements associated with a søcket */
class S0cket {

	/**
	 * @param {SVG} svgArg - 
	 * @param {AbstractN0de} n0de - Unused parameter: the parent nøde.
	 * @param {string} innerOuter - Either <code>"inner"</code> or <code>"outer"</code>. Specifies whether the søcket belongs to an InnerN0de or an OuterN0de.
	 * @todo Possible to refactor so innerOuter is not required? It just seems clunky...
	 * @param {string} inOut - Either <code>"in"</code> or <code>"out"</code>. Specifies whether the søcket is an input or an output.
	 * @param {integer} index - Unused parameter: Where in the list of input or output søckets this søcket resides.
	 * @param {string} label - Human readable name of the søcket's role in the context of the parent nøde.
	 * @param {string} type - Human readable name of the søcket's type.
	 * @param {string} id - Unused parameter: UUID of the søcket's type.
	 */
	constructor(svgArg, n0de, innerOuter, inOut, index, label, type, id) {
		svg = svgArg;

		this.n0de = n0de; // Unused property
		this.inOut = inOut; // Unused property
		this.index = index; // Unused property
		this.id = id; // Unused property

		// SVG element to contain all the visual components of the søcket
		this.element = svg.createElement("svg");
		this.position = [0, 0];

		// The graphical core of a søcket
		this.circle = drawCircle();
		this.element.appendChild(this.circle);

		// LABEL
		this.label = label;
		this.labelText = drawLabel(label, inOut, innerOuter);
		this.element.appendChild(this.labelText);

		// TYPE
		this.type = type;
		this.typeText = drawType(type, inOut, innerOuter);
		this.element.appendChild(this.typeText);

		// CLICK HITBOX
		this.clickZone = drawClickZone();
		this.element.appendChild(this.clickZone);
	}

	/** Return the root SVG element of the S0cket object.
	 * @deprecated Will likely switch to referencing the element property directly.
	 * @returns {SVGSVGElement} The root SVG element.
	 * @memberof S0cket
	 */
	getElement() {
		return this.element;
	}

	// 
	/** Set the position of the søcket.
	 * @param {array} position - X and Y coordinates of the søcket, as an array.
	 * @memberof S0cket
	 */
	setPosition(position) {
		this.position = position;
		this.element.setAttribute("x", position[0] - margins.offset);
		this.element.setAttribute("y", position[1] - margins.offset);
	}
	/** Return the width of the søcket label.
	 * @returns {number} The width of the søcket label.
	 * @memberof S0cket
	 */
	getLabelWidth() {
		return svg.getBBox(this.labelText).width;
	}
}

// Define rendering parameters for left-side and right-side søcket text
const margin = margins.s0ckets.labelMargin;
const leftRight = [
	{
		anchor: "end",
		offset: -margin
	},
	{
		anchor: "start",
		offset: margin
	}
];

// Choose correct rendering parameters given information about the context
// @param {string} labelType - Either "label" or "type", specifying which kind of søcket text we're working with.
// @param {string} inOut - Either "in" or "out", specifying whether this is an input or output søcket.
// @param {string} innerOuter - Either "inner" or "outer", specifying whether this søcket belongs to an InnerN0de or an OuterN0de.
// @returns {object} - 

function s0cketTextSide(labelType, inOut, innerOuter) {

	// Use bitwise XOR to flip-flop on each of three booleans:
	// When all three are true, or when one is true, the result is 1,
	//   which is the index of the right-side søcket text rendering parameters.
	// When two are true, or when all three are false, the result is 0,
	//   which is the index of the left-side søcket text rendering parameters.
	return leftRight[(labelType == "label") ^ (inOut == "in") ^ (innerOuter == "inner")];
}

// Test s0cketTextSide
console.log(s0cketTextSide("label", "out", "outer"));

// Draw the circle element
// TODO: This doesn't really need to be in a function, so its content could be moved to the constructor
function drawCircle() {
	let s0cketCircle = svg.createElement("circle");
	s0cketCircle.setAttribute("cx", margins.offset);
	s0cketCircle.setAttribute("cy", margins.offset);
	s0cketCircle.classList.add("s0cketCircle");
	return s0cketCircle;
}

// Draw the label text
function drawLabel(label, inOut, innerOuter) {
	let labelText = svg.createElement("text");
	labelText.textContent = label;
	// TODO: refactor to use s0cketTextSide only once and store value.
	labelText.setAttribute("text-anchor", s0cketTextSide("label", inOut, innerOuter).anchor);
	labelText.setAttribute("x", margins.offset + s0cketTextSide("label", inOut, innerOuter).offset);
	labelText.setAttribute("y", margins.offset);
	labelText.classList.add("s0cketLabel");
	return labelText;
}

// Draw the type text
// TODO: This is identical to drawLabel, save for select few differences which could be toggled by a parameter
function drawType(type, inOut, innerOuter) {
	let typeText = svg.createElement("text");
	typeText.textContent = type;
	// TODO: refactor to use s0cketTextSide only once and store value.
	typeText.setAttribute("text-anchor", s0cketTextSide("type", inOut, innerOuter).anchor);
	typeText.setAttribute("x", margins.offset + s0cketTextSide("type", inOut, innerOuter).offset);
	typeText.setAttribute("y", margins.offset);
	typeText.classList.add("s0cketType");
	return typeText;
}

// Draw the invisible box that receives mouse events
function drawClickZone() {
	let clickZone = svg.createElement("rect");
	let widthHeight = margins.s0ckets.verticalSpacing;
	let topLeft = margins.offset - widthHeight / 2;
	clickZone.setAttribute("x", topLeft);
	clickZone.setAttribute("y", topLeft);
	clickZone.setAttribute("width", widthHeight);
	clickZone.setAttribute("height", widthHeight);
	clickZone.classList.add("s0cketClickZone");
	return clickZone;
}

// Unused function: delete??? 🤔🤔
function drawS0cketLabel() { }

export default S0cket
