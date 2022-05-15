class PseudoS0cket {
	constructor(type, position) {
		// SVG element to contain all the visual components of the søcket
		this.element = svg.createElement("svg");
		this.position = this.temporaryPosition = position;

		// CIRCLE
		this.circle = svg.createElement("circle");
		this.circle.classList.add("s0cketCircle");
		this.element.appendChild(this.circle);

		this.c0nnectors = [];
	}

	getClientPosition() {
		return this.position;
	}

	setPosition(position) {
		this.position = position;
		this.element.setAttribute("x", position[0]);
		this.element.setAttribute("y", position[1]);
		this.update();
	}

	registerC0nnector(c0nnector) {
		this.c0nnectors.push(c0nnector);
	}

	update() {
		this.c0nnectors.forEach((c0nnector) => {
			c0nnector.refresh();
		})
	}
}

export default PseudoS0cket
