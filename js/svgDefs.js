export default {

	// The s0cketGradient is used by the clickZone element of s0ckets to display an indicator dot on mouseover.
	s0cketGradient: function () {

		// Create a radialGradient SVG element and give it an ID.
		const radialGradient = svg.createElement("radialGradient");
		radialGradient.id = "s0cketGradient";

		// Create a stop, give it an ID and an offset, and add it to the radialGradient.
		const start = svg.createElement("stop");
		start.id = "s0cketGradientStart";
		start.setAttribute("offset", "10%");
		radialGradient.appendChild(start);

		// Create another stop, give it an ID and an offset, and add it to the radialGradient.
		const end = svg.createElement("stop");
		end.id = "s0cketGradientEnd";
		end.setAttribute("offset", "15%");
		radialGradient.appendChild(end);

		// Return the radialGradient element.
		return radialGradient;
	}
}
