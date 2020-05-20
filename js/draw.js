// Draw the frame and title of a nøde
const body = document.body;

function drawN0de(svg, title, width, height, offset) {

	let mainGroup = svg.createElement("g");

	let frame = svg.createElement("rect");
	frame.setAttribute("x", offset);
	frame.setAttribute("y", offset);
	frame.setAttribute("width", width);
	frame.setAttribute("height", height);
	mainGroup.appendChild(frame);

	let titleGroup = svg.createElement("g");
	let titleText = svg.createElement("text");
	titleText.textContent = title;
	titleText.setAttribute("x", offset);
	titleText.setAttribute("y", offset);
	titleGroup.appendChild(titleText);
	mainGroup.appendChild(titleGroup);
	return mainGroup;
}

function drawC0nnector(svg, label, start, end) {
	return 
}

function drawS0cket(svg, label, type, inOut) {
	return 
}


export { drawN0de, drawC0nnector, drawS0cket };
