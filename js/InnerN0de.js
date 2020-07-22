import AbstractN0de from './AbstractN0de.js'
import margins from './margins.js'

/** The InnerN0de class is used by the {@link N0deView} class to display all the nødes within the current view.
 * @extends AbstractN0de
 */
class InnerN0de extends AbstractN0de {

	/**
	 * @todo Remove the n0deView parameter. It isn't used anywhere.
	 * @param {SVG} svg - SVG object shared among all components. See {@link SVG} for details.
	 * @param {string} id - UUID of the nøde.
	 * @param {string} type - Human-readable name of the nøde.
	 * @param {array} position - X and Y coordinates of the nøde, as an array.
	 * @param {object} s0ckets - JSON object containing arrays of input and output søckets.
	 */
	constructor(svg, id, type, position, s0ckets) {

		// Run the AbstractN0de constructor.
		super(svg, id, type, s0ckets);
		
		// Add the frame element to the root element of the nøde as the first child so that it's behind all the søckets and the title.
		this.element.prepend(this.frame);
		this.frame.classList.add("innerN0deFrame");
		// Offset the frame. See margins.js for complete explanation of offset.
		this.frame.setAttribute("x", margins.offset);
		this.frame.setAttribute("y", margins.offset);

		// Set the root element position based on position parameter and offset. See margins.js for complete explanation of offset.
		this.position = [position[0] - margins.offset, position[1] - margins.offset];
		this.element.setAttribute("x", this.position[0]);
		this.element.setAttribute("y", this.position[1]);
		this.element.classList.add("innerN0de");

		// Size the nøde to fit its components.
		this.shrinkWrap();
	}

	/** Add an input or output søcket to the nøde.
	 * @param {object} s0cketSpec - Object with three properties: <code>label</code>, <code>type</code>, and <code>id</code>. See {@link N0deApp} for details.
	 * @param {string} inOut - Either <code>"in"</code> or <code>"out"</code>. Specifies whether the søcket is an input or an output.
	 * @param {integer} index - Where in the list of input or output søckets this søcket resides.
	 * @memberof InnerN0de
	 */
	addS0cket(s0cketSpec, inOut, index) {
		super.addS0cket(s0cketSpec, "inner", inOut, index);
	}
	
	/** Automatically resize the nøde frame to just fit the title and søckets.
	 * @memberof InnerN0de
	 */
	shrinkWrap() {

		// CALCULATE NEW WIDTH
		// Make an array of the total widths of each row by iterating over ALL the søckets (both input and output)
		// and adding their widths to their respective rows.
		let s0cketWidths = [];
		[...this.s0ckets.in, ...this.s0ckets.out].forEach(function (s0cket) {
			s0cketWidths[s0cket.index] = (s0cketWidths[s0cket.index] || 0) + s0cket.getLabelWidth();
		});
		// Find the widest out of all the rows and the title.
		let maxWidth = Math.max(...s0cketWidths, this.titleObject.bbox.width);
		// Round up to an integer and add space.
		let newWidth = Math.ceil(maxWidth) + margins.s0ckets.horizontalSpacing;

		// CALCULATE NEW HEIGHT
		// How many rows of søckets are there?
		let maxHeight = Math.max(this.s0ckets.in.length, this.s0ckets.out.length);
		// Multiply rows by preset spacing and round up to an integer.
		let newHeight = Math.ceil(maxHeight * margins.s0ckets.verticalSpacing);

		// Apply the new width and height.
		this.resize([newWidth, newHeight]);
	}
}


export default InnerN0de
