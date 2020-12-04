class TextWithBackground {
    constructor(textContent, options) {
        this.text = svg.createElement("text");
        this.background = svg.createElement("rect");
        this.element = svg.createElement("svg");
        this.element.classList.add(options.className);
        // https://stackoverflow.com/questions/14900502/how-to-prevent-objects-inside-an-svg-drawing-to-be-clipped-at-the-bounds-of-the
        this.element.appendChild(this.background);
        this.element.appendChild(this.text);
        this.options = options;
        this.setPosition(options.position);
        this.setText(textContent);
    }

    setPosition(position) {
        this.position = position;
        this.element.setAttribute("x", position[0]);
        this.element.setAttribute("y", position[1]);
    }

    setText(textContent) {
        this.textContent = textContent;
        this.text.textContent = textContent;
    }

    update() {
		// If this element isn't in the document, then we can't update it
		if (!document.contains(this.element)) {
			console.log("Attempted to update element not in document.");
			return;
		}

        this.element.style.display = "inherit";
        this.bbox = this.text.getBBox();
        this.element.style.display = "";

        let roundedEndsMargin = 0;
        if (this.options.roundedEnds) {
            roundedEndsMargin = (this.bbox.height + 2 * this.options.margins[1]) / 2;
            this.background.setAttribute("rx", roundedEndsMargin);
        }
        const margins = [
            this.options.margins[0]
        ];
        this.background.setAttribute("x", this.bbox.x - this.options.margins[0] - roundedEndsMargin);
        this.background.setAttribute("y", this.bbox.y - this.options.margins[1]);
        this.background.setAttribute("width", this.bbox.width + roundedEndsMargin * 2 + this.options.margins[0] * 2);
        this.background.setAttribute("height", this.bbox.height + this.options.margins[1] * 2);
    }
}

export default TextWithBackground
