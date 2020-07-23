import S0cket from './S0cket.js'
import margins from './margins.js'

// Declare the SVG variable for use by all functions in this module
// 		ToDo: remove this when the TextWithBackground class is factored out.
let svg = null;

/** The AbstractN0de class implements all the features that are common to InnerN0de and OuterN0de. */
class AbstractN0de {

	/**
	 * @param {SVG} svgArg - SVG object shared among all components. See {@link SVG} for details.
	 * @param {string} id - UUID of the nøde.
	 * @param {string} type - Human-readable name of the nøde.
	 * @param {object} s0ckets - JSON object containing arrays of input and output søckets.
	 */
	constructor(svgArg, id, type, s0ckets) {

		// Assign the SVG object received by the constructor to the SVG variable declared at the top of the module.
		// 		ToDo: remove this when the TextWithBackground class is factored out.
		svg = svgArg;

		// Initialize size and position properties.
		this.size = [0, 0];
		this.position = [0, 0];

		// This SVG will contain all the graphical components of the nøde.
		this.element = svg.createElement("svg");

		// The frame is the graphical base for the nøde.
		// Don't append it because InnerN0de and OuterN0de handle it differently.
		this.frame = svg.createElement("rect");
		this.frame.classList.add("n0deFrame");

		// Title is the text at the top of the nøde
		// 		Todo: Rewrite when the TextWithBackground class is factored out.
		this.title = type;
		this.titleObject = drawTitle(type);
		this.element.appendChild(this.titleObject.background);
		this.element.appendChild(this.titleObject.text);

		// THE REST OF THE CONSTRUCTOR DEALS WITH SØCKETS

		this.s0cketsGroup = svg.createElement("g");
		this.element.appendChild(this.s0cketsGroup);

		// The this.s0ckets object holds arrays of input and output søckets - the actual
		// s0cket objects, rather than the JSON objects received from the controller.
		this.s0ckets = {
			"in": [],
			"out": []
		};

		// The s0ckets array passed to the constructor does not contain a self søcket.
		// Create a self søcket based on known information about the nøde.
		// 		This was factored into the AbstractN0de class on the assumption that OuterN0des would need them too
		// 		but at this point I am doubting that assumption. I see no reason for the inner workings of a nøde
		// 		to have access to the self instance. I plan to refactor this soon.
		let selfS0cket = {
			"type": type,
			"id": id
		};
		this.addS0cket(selfS0cket, "in", 0);
		this.addS0cket(selfS0cket, "out", 0);

		// Iterate over the søcket arrays from the JSON and add those S0ckets.
		// Because there's no self søcket in the JSON array, we have to shift every index by 1.
		const thisAbstractN0de = this;
		s0ckets["in"].forEach(function (s0cket, index) {
			thisAbstractN0de.addS0cket(s0cket, "in", index + 1);
		});
		s0ckets["out"].forEach(function (s0cket, index) {
			thisAbstractN0de.addS0cket(s0cket, "out", index + 1);
		});
	}

	/** Add an input or output søcket to the nøde.
	 * @param {object} s0cketSpec - Object with three properties: <code>label</code>, <code>type</code>, and <code>id</code>. See {@link N0deApp} for details.
	 * @param {string} innerOuter - Either <code>"inner"</code> or <code>"outer"</code>. Specifies whether the søcket belongs to an InnerN0de or an OuterN0de.
	 * @param {string} inOut - Either <code>"in"</code> or <code>"out"</code>. Specifies whether the søcket is an input or an output.
	 * @param {integer} index - Where in the list of input or output søckets this søcket resides.
	 * @memberof AbstractN0de
	 */
	// This method takes one more argument than the call to it above.
	// This is because InnerN0de and OuterN0de each override this method
	//  with one that takes three arguments and just calls super.addS0cket
	//  with the arguments it received, plus a hard-coded innerOuter value.
	addS0cket(s0cketSpec, innerOuter, inOut, index) {

		// Create a new S0cket object.
		let s0cket = new S0cket(svg, this, innerOuter, inOut, index, s0cketSpec.label, s0cketSpec.type, s0cketSpec.id);

		// Add the S0cket's element to the søcket container element.
		this.s0cketsGroup.appendChild(s0cket.element);

		// Add the S0cket object to the appropriate list of søckets.
		this.s0ckets[inOut].splice(index, 0, s0cket);
	}

	/** Look up a s0cket by "address" and return it.
	 * @param {string} inOut - Either <code>"in"</code> or <code>"out"</code>. Specifies whether the søcket is an input or an output.
	 * @param {integer} index - The index of the søcket.
	 * @returns {S0cket} The søcket at the given address.
	 * @memberof AbstractN0de
	 */
	getS0cket(inOut, index) {
		return this.s0ckets[inOut][index];
	}

	/** Resize the nøde.
	 * @param {array} size - The new width and height for the nøde, as an array.
	 * @memberof AbstractN0de
	 */
	resize(size) {

		// Update the size property to the supplied value 
		this.size = size;

		// Resize the frame rectangle to the new size.
		this.frame.setAttribute("width", this.size[0]);
		this.frame.setAttribute("height", this.size[1]);

		// Resize the root element to the new size, plus margins.
		this.element.setAttribute("width", this.size[0] + margins.offset * 2);
		this.element.setAttribute("height", this.size[1] + margins.offset * 2);

		// Update the title without changing the text. This triggers the recentering of text and background.
		// 		This will likely be rewritten when the TextWithBackground class is factored out.
		this.retitle(this.title);

		// Iterate over all søckets and update their positions.
		let width = this.size[0];
		[...this.s0ckets.in, ...this.s0ckets.out].forEach(function (s0cket) {
			s0cket.setPosition([(s0cket.inOut == "in" ? 0 : width) + margins.offset, s0cket.index * margins.s0ckets.verticalSpacing + margins.offset]);
		});
	}

	// 		This will likely be rewritten when the TextWithBackground class is factored out.
	/** Retitle the nøde.
	 * @param {string} title - New title for the nøde.
	 * @memberof AbstractN0de
	 */
	retitle(title) {

		// Find center of nøde.
		let center = this.size[0] / 2;

		// Create a text element, populate it, and position it.
		let titleText = this.titleObject.text;
		titleText.textContent = title;
		titleText.setAttribute("x", center + margins.offset);
		titleText.setAttribute("y", margins.offset);
		
		// Resize the title background to match the title text.
		resizeTitleBackground(this.titleObject);
	}
}


// These two functions should be refactored into a TextWithBackground class, which can then be used for søcket labels also.
function drawTitle(title) {
	let titleText = svg.createElement("text");
	titleText.textContent = title;
	titleText.classList.add("n0deTitle");

	let background = svg.createElement("rect");
	background.classList.add("n0deTitleBackground");

	let titleObject = {
		text: titleText,
		background: background
	};

	resizeTitleBackground(titleObject)
	return titleObject;
}

function resizeTitleBackground(titleObject) {
	let titleText = titleObject.text;

	let background = titleObject.background;
	let bbox = svg.getBBox(titleText);
	let margin = margins.n0de.titleMargin;
	background.setAttribute("x", bbox.x - margin);
	background.setAttribute("y", bbox.y);
	background.setAttribute("width", bbox.width + margin * 2);
	background.setAttribute("height", bbox.height);
	titleObject.bbox = bbox;
}

export default AbstractN0de
