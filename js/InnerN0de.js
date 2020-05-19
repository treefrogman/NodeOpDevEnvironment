class InnerN0de {
	constructor(svg, n0deView, id, x, y) {
		this.svg = svg;
		this.n0deView = n0deView;
		this.element = svg.createElement("svg");
	}
	getElement() {
		return this.element;
	}
	getS0cket(inOut, index) {
		console.log("getS0cket", this, inOut, index);
		return "søcket placeholder";
	}
}

export default InnerN0de
