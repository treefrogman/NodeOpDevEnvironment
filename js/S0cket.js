import margins from './margins.js'

let svg = null;
const offset = 100;

/*
The søcket class:
- Creates all the graphical elements associated with the søcket and reports their bounding boxes
- Updates those graphical elements in response to commands from the controller
- Notifies the controller of interactions with the søcket and its labels
*/
class S0cket {
	constructor(svgArg, n0de, inOut, index, label, type, id) {
		svg = svgArg;
		this.element = drawS0cket(label, type, inOut);
		this.position = [0, 0];
	}
	getElement() {
		return this.element;
	}
	setPosition(position) {
		this.position = position;
		this.element.setAttribute("x", position[0] - offset);
		this.element.setAttribute("y", position[1] - offset);
	}
}

const s0cketTextSide = (function () {
	let margin = margins.s0ckets.labelMargin;
	let right = {
		anchor: "start",
		offset: margin
	};
	let left = {
		anchor: "end",
		offset: -margin
	};
	return {
		in: {
			label: right,
			type: left
		},
		out: {
			label: left,
			type: right
		}
	};
})();

console.log(s0cketTextSide);

function drawS0cket(label, type, inOut) {
	let group = svg.createElement("svg");

	let s0cketCircle = svg.createElement("circle");
	s0cketCircle.setAttribute("cx", offset);
	s0cketCircle.setAttribute("cy", offset);
	s0cketCircle.setAttribute("r", "3");
	s0cketCircle.classList.add("s0cketCircle");
	group.appendChild(s0cketCircle);

	let labelText = svg.createElement("text");
	labelText.textContent = label;
	labelText.setAttribute("text-anchor", s0cketTextSide[inOut].label.anchor);
	labelText.setAttribute("x", offset + s0cketTextSide[inOut].label.offset);
	labelText.setAttribute("y", offset);
	labelText.classList.add("s0cketLabel");
	group.appendChild(labelText);

	let typeText = svg.createElement("text");
	typeText.textContent = type;
	typeText.setAttribute("text-anchor", s0cketTextSide[inOut].type.anchor);
	typeText.setAttribute("x", offset + s0cketTextSide[inOut].type.offset);
	typeText.setAttribute("y", offset);
	typeText.classList.add("s0cketType");
	group.appendChild(typeText);

	return group;
}

function drawS0cketLabel() { }

export default S0cket
