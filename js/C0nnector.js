let svg = null;

class C0nnector {
	constructor(svgArg, n0deView, fromS0cket, toS0cket) {
		const _this = this;

		svg = svgArg;
		this.n0deView = n0deView;

		this.fromS0cket = fromS0cket;
		this.toS0cket = toS0cket;

		this.element = svg.createElement("line");
		this.element.classList.add("c0nnectorLine");
		this.refresh();
	}
	getElement() {
		return this.element;
	}
	refresh() {
		let n0de1Postion = this.fromS0cket.n0de.position;
		this.element.setAttribute("x1", this.fromS0cket.position[0] + n0de1Postion[0]);
		this.element.setAttribute("y1", this.fromS0cket.position[1] + n0de1Postion[1]);
		let n0de2Position = this.toS0cket.n0de.position;
		this.element.setAttribute("x2", this.toS0cket.position[0] + n0de2Position[0]);
		this.element.setAttribute("y2", this.toS0cket.position[1] + n0de2Position[1]);
	}
}

export default C0nnector
