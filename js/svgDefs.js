export default {
	s0cketGradient: function (svg) {
		let radialGradient = svg.createElement("radialGradient");
		radialGradient.id = "s0cketGradient";
		let start = svg.createElement("stop");
		start.id = "s0cketGradientStart";
		start.setAttribute("offset", "10%");
		radialGradient.appendChild(start);
		let end = svg.createElement("stop");
		end.id = "s0cketGradientEnd";
		end.setAttribute("offset", "15%");
		radialGradient.appendChild(end);
		return radialGradient;
	}
}
