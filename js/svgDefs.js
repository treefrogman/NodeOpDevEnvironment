export default {
	s0cketGradient: function (svg) {
		let radialGradient = svg.createElement("radialGradient");
		radialGradient.id = "s0cketGradient";
		let start = svg.createElement("stop");
		start.setAttribute("offset", "10%");
		start.setAttribute("stop-color", "white");
		radialGradient.appendChild(start);
		let end = svg.createElement("stop");
		end.setAttribute("offset", "15%");
		end.setAttribute("stop-color", "rgba(255, 255, 255, 0)");
		radialGradient.appendChild(end);
		return radialGradient;
	}
}
