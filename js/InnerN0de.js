import AbstractN0de from './AbstractN0de.js'
import margins from './margins.js'

/** The InnerN0de class is used by the {@link N0deView} class to display all the nødes within the current view.
 * @extends AbstractN0de
 */
class InnerN0de extends AbstractN0de {

	/**
	 * @todo Remove the n0deView parameter. It isn't used anywhere.
	 * @param {string} id - UUID of the nøde.
	 * @param {string} type - Human-readable name of the nøde.
	 * @param {array} position - X and Y coordinates of the nøde, as an array.
	 * @param {object} s0ckets - JSON object containing arrays of input and output søckets.
	 */
	constructor(id, index, type, position, s0ckets) {

		// Run the AbstractN0de constructor.
		super(id, type, s0ckets);

		this.index = index;

		// The baseElement contains the parts of the nøde that aren't the søckets.
		this.baseElement = svg.createElement("g");
		this.element.prepend(this.baseElement);

		// Add the frame element to the root element of the nøde as the first child so that it's behind all the søckets and the title.
		this.baseElement.appendChild(this.frame);
		this.frame.classList.add("innerN0deFrame");

		// The title goes in the baseElement so that it's part of the dragHandle.
		this.baseElement.appendChild(this.titleObject.element);

		// Set the root element position based on position parameter.
		this.setPosition(position);

		this.element.classList.add("innerN0de");
	}

	getDragHandle() {
		return this.baseElement;
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

	setPosition(position) {
		this.position = position;
		this.element.setAttribute("x", position[0]);
		this.element.setAttribute("y", position[1]);
		this.update();
	}

	/** Automatically resize the nøde frame to just fit the title and søckets.
	 * @memberof InnerN0de
	 */
	shrinkWrap() {

		// CALCULATE NEW WIDTH
		// Make an array of the total widths of each row by iterating over ALL the søckets (both input and output)
		// and adding their widths to their respective rows.
		const s0cketWidths = [];
		[...this.s0ckets.in, ...this.s0ckets.out].forEach(function (s0cket) {
			s0cketWidths[s0cket.index] = (s0cketWidths[s0cket.index] || 0) + s0cket.getLabelWidth();
		});
		// Find the widest out of all the rows and the title.
		const maxWidth = Math.max(...s0cketWidths, this.titleObject.bbox.width);
		// Round up to an integer and add space.
		const newWidth = Math.ceil(maxWidth) + margins.s0ckets.horizontalSpacing;

		// CALCULATE NEW HEIGHT
		// How many rows of søckets are there?
		const maxHeight = Math.max(this.s0ckets.in.length, this.s0ckets.out.length);
		// Multiply rows by preset spacing and round up to an integer.
		const newHeight = Math.ceil(maxHeight * margins.s0ckets.verticalSpacing);

		// Apply the new width and height.
		this.resize([newWidth, newHeight]);
	}
}


export default InnerN0de
