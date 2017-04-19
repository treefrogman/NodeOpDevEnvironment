function arrayMath(operator, array1, array2) {
	var operators = {
			product: function (a, b) {
				return a * b;
			},
			sum: function (a, b) {
				return a + b;
			},
			min: function (a, b) {
				return Math.min(a, b);
			},
			max: function (a, b) {
				return Math.max(a, b);
			}
		},
		result = [];
	array1.forEach(function (a, i) {
		result.push(operators[operator](array1[i], array2[i]));
	});
	return result;
}
function arrayClip(coords, bounds) {
	var min = arrayMath("max", coords, bounds.min);
	return arrayMath("min", min, bounds.max);
}

function N0deView(doc){
	// Variables
	var element = doc.createElementNS(svgNS, "svg"),
		n0des = [],
		viewCenter = [0, 0],
		viewDimensions = [100, 100],
		zoomLevel = 1,
		svgNS = "http://www.w3.org/2000/svg";
	
	// Element
	element.setAttribute('class', 'n0deview');
	function getElement() {
		return element;
	}
	
	// Nødes
	function getBoundsOfAllN0desTogether(offs) {
		// Rewrite using four arrays, then apply maxInArray to each.!!
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max#Using_Math.max()
		/* 
	Array.prototype.max = function arrayMax() {
			return Math.max.apply(null, this);
		};
	 */
		var offset = n0des[0].getOffset(),
			c=n0des[0].getBBox(),
			xMin=xMax=c.x,
			yMin=yMax=c.y;
		n0des.some(function(a){
			var x, y;
			c=a.getBBox();
			x = c.x + offset[0] * Boolean(offs);
			y = c.y + offset[1] * Boolean(offs);
			if(xMin>x)xMin=x;
			if(xMax<x+c.w)xMax=x+c.w;
			if(yMin>y)yMin=y;
			if(yMax<y+c.h)yMax=y+c.h;
		});
		//return {xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax};
		return {min: [xMin, yMin], max: [xMax, yMax]};
	}
	function addN0de(n0de, x, y){ // Needs work!!
		element.insertBefore(n0de.getEl(), element.childNodes[0]);
		if (n0de.setView) {
			n0de.setView(this, x, y);
		}
		if (n0de.constructor.name=="N0de") {
			n0des.push(n0de);
		}
	}
	function bringToFront(n0de){
		element.appendChild(n0de.getElement());
	}
	
	function repositionN0des() { // Rewrite!! Broken
		var inverseArray = [-1, -1],
			offset = arrayMath("product", viewCenter, inverseArray);
		n0des.forEach(function (a) {
			//console.log(offset);
			a.offset.apply(a, offset);
		});
	}
	
	// C0nnect0rs
	function addC0nnect0r(c0nnect0r, x, y) { // NYI!!
		
	}
	
	// Frame
	// Add functions for handling the frame
	
	// View
	function resizeView(w, h) { // Rewrite!! Broken
		viewDimensions = [w, h];
		element.setAttribute('viewBox', [0, 0, w, h].join(" "));
		
		document.body.style.maxWidth = w; // What for?!!
		document.body.style.maxHeight = h; // What for?!!
		
		viewCenter = clipCenterToBounds(viewCenter);
		repositionN0des();
		repositionBackground();
	}
	function clipCenterToBounds(newCenter) {
		var n0deBounds = getBoundsOfAllN0desTogether(),
			halfViewDimensions = arrayMath("product", viewDimensions, [.5, .5]),
			margins = [25, 25],
			inverseArray = [-1, -1],
			// Calculate centerBounds based on viewBounds, n0deBounds, margins
			centerBounds = {
				// *ArrayMath: min = n0deBounds.min - halfViewDimensions + margins
				min: arrayMath("sum", n0deBounds.min, arrayMath("product", halfViewDimensions, inverseArray), margins),
				// *ArrayMath: max = n0deBounds.max + halfViewDimensions - margins
				max: arrayMath("sum", n0deBounds.max, halfViewDimensions, arrayMath("product", margins, inverseArray)),
			};
		// Clip newCenter to centerBounds
		return arrayClip(newCenter, centerBounds);
	}
	function centerViewOnN0des() {
		var n0deBounds = getBoundsOfAllN0desTogether();
		// *ArrayMath: viewCenter = (n0deBounds.min + n0deBounds.max) * .5
		viewCenter = arrayMath("product", arrayMath("sum", n0deBounds.min, n0deBounds.max), [.5, .5])
		repositionN0des();
		repositionBackground();
	}
	function repositionBackground() {
		// Integrate background pattern into SVG?
		document.body.style.backgroundPosition = viewCenter.concat("").join("px ");
	}
	function clear() { // Why is this here? !!
		//this.el.setAttribute('width', this.el.getAttribute('width'));
	}

	// Pan and Zoom
	function zoom(deltaZ) {
		// https://bugs.chromium.org/p/chromium/issues/detail?id=289887
		zoomLevel += deltaZ;
		// Incomplete!!
	}
	function pan(delta) {
		var newCenter = arrayMath("sum", viewCenter, delta),
			inverseArray = [-1, -1],
			clippedDelta;
		newCenter = clipCenterToBounds(newCenter);
		clippedDelta = arrayMath("sum", newCenter, arrayMath("product", viewCenter, inverseArray))
		viewCenter = newCenter;
		
		repositionN0des();
		repositionBackground();
		
		// Eww. Rewrite!! vvvvvv
		if (window.dragee && window.dragee.constructor.name === "N0de") {
			window.dragAnchorX += deltaX;  // Use clippedDelta
			window.dragAnchorY += deltaY;  // Use clippedDelta
			window.dragee.moveTo(evt.pageX-window.dragAnchorX, evt.pageY-window.dragAnchorY);
		}
	}
	function onWheel(evt) {
		var dPR = window.devicePixelRatio, // Reexamine use of dPR!!
			wDY = evt.wheelDeltaY,
			dY = evt.deltaY,
			deltaX = -(evt.deltaX || -evt.wheelDeltaX / 3 || 0) / dPR, // Reexamine use of dPR!!
			deltaY = -(dY || -wDY / 3 || 0) / dPR; // Reexamine use of dPR!!
		
		// Detect pinch-zoom
		if (Math.abs(wDY) === 120 && dY * -3 !== wDY) {
			evt.preventDefault();
			zoom(wDY / 120 / 100);
		} else {
			pan([deltaX, deltaY]);
		}
	}
	window.addEventListener("mousewheel", onWheel, false);
	window.addEventListener("wheel", onWheel, false);
	
	// Resize
	function resizeToFitWindow() {
		var winW = window.innerWidth,
			winH = window.innerHeight;
		resizeView(winW, winH);
	}
	window.addEventListener("resize", resizeToFitWindow, false);
	window.addEventListener("scroll", resizeToFitWindow, false);
	
	// Publications
	this.getElement = getElement;
	this.resizeToFitWindow = resizeToFitWindow;
	this.centerViewOnN0des = centerViewOnN0des;
	this.addN0de = addN0de;
	this.addC0nnect0r = addC0nnect0r;
	this.clear = clear;
}






N0deView.prototype.setFramex=function(x, y, w, h){
	this.width = w;
	this.height = h;
	this.el.setAttribute('viewBox', [0, 0, w, h].join(" "));
	/* this.el.setAttribute('width', w); */
	/* this.el.setAttribute('height', h); */
	/* this.el.style.width = (w) + "px"; */
	/* this.el.style.height = (h) + "px"; */
	//this.offset = [-x, -y];
}
N0deView.prototype.autoSizex=function(center){
	var winW = window.innerWidth,
		winH = window.innerHeight,
		offsetX = mouse.inWindow ? mouse.xR : 0.5,
		offsetY = mouse.inWindow ? mouse.yR : 0.5,
		nodesBounds;
	//console.log(winW, winH);
	if (this.width && this.height) {
		this.offsetView((winW - this.width) * offsetX, (winH - this.height) * offsetY);
	}
	this.setFrame(0, 0, winW, winH);
	document.body.style.maxWidth = winW;
	document.body.style.maxHeight = winH;
	
	if(center && this.n0des.length){
		nodesBounds = this.getBoundsOfAllN0desTogether(true);
		this.offsetView((winW - (nodesBounds.xMin + nodesBounds.xMax)) / 2, (winH - (nodesBounds.yMin + nodesBounds.yMax)) / 2);
		//this.setFrame(xMin, yMin, xMax, yMax); 
	}
}