import margins from './margins.js'

class TextWithBackground {
    constructor(textContent, position, textClass, backgroundClass, textMargins, svg) {
        this.svg = svg;
        this.text = svg.createElement("text");
        this.text.classList.add(textClass);
        this.background = svg.createElement("rect");
        this.background.classList.add(backgroundClass);
        this.element = svg.createElement("svg");
        // https://stackoverflow.com/questions/14900502/how-to-prevent-objects-inside-an-svg-drawing-to-be-clipped-at-the-bounds-of-the
        this.element.setAttribute("overflow", "visible");
        this.element.appendChild(this.background);
        this.element.appendChild(this.text);
        this.textMargins = textMargins;
        this.setPosition(position);
        this.setText(textContent);
    }

    setPosition(position) {
        this.position = position;
        this.element.setAttribute("x", position[0] + margins.offset);
        this.element.setAttribute("y", position[1] + margins.offset);
    }

    setText(textContent) {
        this.textContent = textContent;
        this.text.textContent = textContent;
    }

    update() {
        this.bbox = this.text.getBBox();

        this.background.setAttribute("x", this.bbox.x - this.textMargins[0]);
        this.background.setAttribute("y", this.bbox.y - this.textMargins[1]);
        this.background.setAttribute("width", this.bbox.width + this.textMargins[0] * 2);
        this.background.setAttribute("height", this.bbox.height + this.textMargins[1] * 2);
    }
}

export default TextWithBackground
