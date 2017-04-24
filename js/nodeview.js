var ff = navigator.userAgent.match("Firefox");
if (ff) {
	alert("Nøde is only tested in Chrome, and uses some fancy features, so it probably won't work in Firefox.");
}

function arrayMath(operator, array1, array2, array3) {
	var operators = {
			product: function (a, b, c) {
				return a * b + c;
			},
			sum: function (a, b, c) {
				return a + b + c;
			},
			min: function (a, b, c) {
				return Math.min(a, b, c);
			},
			max: function (a, b, c) {
				return Math.max(a, b, c);
			}
		},
		result = [];
	array1.forEach(function (a, i) {
		var thisResult = operators[operator].apply(Array.prototype.map.call(arguments, function (a) {
			return a[i];
		}));
		result.push(thisResult);
	});
	return result;
}
function arrayClip(coords, bounds) {
	//var min = arrayMath("max", coords, bounds.min);
	//return arrayMath("min", min, bounds.max);
	var xmin = Math.max(coords[0], bounds.min[0]),
		ymin = Math.max(coords[1], bounds.min[1]);
	return [
		Math.min(xmin, bounds.max[0]),
		Math.min(ymin, bounds.max[1])
	];
}

var svgNS = "http://www.w3.org/2000/svg",
	xlinkNS = "http://www.w3.org/1999/xlink";

function NødeView(doc){
	// Variables
	var element = doc.createElementNS(svgNS, "svg"),
		nødesElement = doc.createElementNS(svgNS, "g"),
		cønnectørsElement = doc.createElementNS(svgNS, "g"),
		nødes = [],
		cønnectørs = [],
		viewCenterOffset = [0, 0],
		viewDimensions = [100, 100],
		zoomLevel = 1;
	
	// Document
	function getDocument() {
		return doc;
	}
	
	// Elements
	element.setAttribute('class', 'nødeview');
	element.appendChild(nødesElement);
	element.appendChild(cønnectørsElement);
	function getElement() {
		return element;
	}
	
	// Nødes
	function createNøde(title, søckets, position) {
		var nøde = new this.memberConstructors.Nøde(this, title, søckets, position);
		nødes.push(nøde);
		nødesElement.appendChild(nøde.getNødeElement());
		return nøde;
	}
	function getBoundsOfAllNødesTogether(offs) {
		var xs = [],
			ys = [],
			xmin, xmax, ymin, ymax;
		nødes.forEach(function (a, i) {
			var bbox = a.getBoundingBox(),
				x = bbox[0][0],
				y = bbox[0][1],
				w = bbox[1][0],
				h = bbox[1][1];
			xs.push(x);
			xs.push(x + w);
			ys.push(y);
			ys.push(y + h);
		});
		xmin = Math.min.apply(null, xs);
		xmax = Math.max.apply(null, xs);
		ymin = Math.min.apply(null, ys);
		ymax = Math.max.apply(null, ys);
		return {min: [xmin, ymin], max: [xmax, ymax]};
		
		
		// Rewrite using four arrays, then apply maxInArray to each.!!
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max#Using_Math.max()
		/* 
	Array.prototype.max = function arrayMax() {
			return Math.max.apply(null, this);
		};
	 *//*
		var offset = nødes[0].getPosition(),
			c=nødes[0].getBBox(),
			xMin=xMax=c.x,
			yMin=yMax=c.y;
		nødes.some(function(a){
			var x, y;
			c=a.getBBox();
			x = c.x + offset[0] * Boolean(offs);
			y = c.y + offset[1] * Boolean(offs);
			if(xMin>x)xMin=x;
			if(xMax<x+c.w)xMax=x+c.w;
			if(yMin>y)yMin=y;
			if(yMax<y+c.h)yMax=y+c.h;
		});*/
		//return {xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax};
	}
	/*function addNøde(nøde, x, y){ // Needs work!!
		nødesElement.insertBefore(nøde.getNødeElement(), element.childNodes[0]);
		if (nøde.setView) {
			nøde.setView(this, x, y);
		}
		if (nøde.constructor.name=="Nøde") {
			nødes.push(nøde);
		}
	}*/
	function bringToFront(nøde){
		nødesElement.appendChild(nøde.getNødeElement());
	}
	
	function repositionNødes() { // Rewrite!! Broken
		var inverseArray = [-1, -1],
			halfViewDimensions = [
				viewDimensions[0] / 2,
				viewDimensions[1] / 2
			],
			//arrayMath("product", viewDimensions, [.5, .5]),
			viewOffset = [
				viewCenterOffset[0] + halfViewDimensions[0],
				viewCenterOffset[1] + halfViewDimensions[1]
			];
			//arrayMath("sum", viewCenterOffset, halfViewDimensions);
		nødes.forEach(function (a) {
			a.setViewOffset(viewOffset);
			//console.log(viewCenterOffset);
			//a.offset.apply(a, viewCenterOffset);
		});
	}
	
	// Cønnectørs
	function createCønnectør(søckets) {
		return new this.memberConstructors.Cønnectør(this, søckets);
	}
	/* 
function addCønnectør(cønnectør, x, y) { // NYI!!
		element.insertBefore(cønnectør.getEl(), element.childNodes[0]);
	}
 */
	
	// Frame
	// Add functions for handling the frame
	
	// View
	function resizeView(w, h) { // Rewrite!! Broken
		viewDimensions = [w, h];
		element.setAttribute('viewBox', [0, 0, w, h].join(" "));
		
		document.body.style.maxWidth = w; // What for?!!
		document.body.style.maxHeight = h; // What for?!!
		
		viewCenterOffset = clipCenterToBounds(viewCenterOffset);
		repositionNødes();
		repositionBackground();
	}
	function clipCenterToBounds(newCenterOffset) {
		var nødeBounds = getBoundsOfAllNødesTogether(),
			halfViewDimensions = [
				viewDimensions[0] / 2,
				viewDimensions[1] / 2
			],
			//arrayMath("product", viewDimensions, [.5, .5]),
			margin = 10,
			inverseArray = [-1, -1],
			// Calculate centerBounds based on viewBounds, nødeBounds, margins
			centerBounds = {
				// *ArrayMath: min = -(nødeBounds.min - halfViewDimensions + margins)
				/*min: arrayMath("product",
					arrayMath("sum",
						nødeBounds.max,
						halfViewDimensions,
						arrayMath("product",
							margins,
							inverseArray
						)
					),
					inverseArray
				),
				// *ArrayMath: max = -(nødeBounds.min + halfViewDimensions - margins)
				max: arrayMath("product",
					arrayMath("sum",
						nødeBounds.min,
						arrayMath("product",
							halfViewDimensions,
							inverseArray
						),
						margins
					),
					inverseArray
				)*/
				
				max: [
					-(nødeBounds.min[0] - halfViewDimensions[0] + margin),
					-(nødeBounds.min[1] - halfViewDimensions[1] + margin)
				],
				min: [
					-(nødeBounds.max[0] + halfViewDimensions[0] - margin),
					-(nødeBounds.max[1] + halfViewDimensions[1] - margin)
				]
			};
			//console.log(centerBounds);
		// Clip newCenterOffset to centerBounds
		console.log(nødeBounds);
		return arrayClip(newCenterOffset, centerBounds);
	}
	function centerViewOnNødes() {
		var nødeBounds = getBoundsOfAllNødesTogether();
		// *ArrayMath: viewCenterOffset = (nødeBounds.min + nødeBounds.max) * .5
		viewCenterOffset = [
			(nødeBounds.min[0] + nødeBounds.max[0]) / 2,
			(nødeBounds.min[1] + nødeBounds.max[1]) / 2
		];
		//arrayMath("product", arrayMath("sum", nødeBounds.min, nødeBounds.max), [.5, .5])
		repositionNødes();
		repositionBackground();
	}
	function repositionBackground() {
		// Integrate background pattern into SVG?
		document.body.style.backgroundPosition = viewCenterOffset.concat("").join("px ");
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
		var newCenterOffset = [
				viewCenterOffset[0] + delta[0],
				viewCenterOffset[1] + delta[1]
			],
		//arrayMath("sum", viewCenterOffset, delta),
			inverseArray = [-1, -1],
			clippedDelta;
		newCenterOffset = clipCenterToBounds(newCenterOffset);
		clippedDelta = [
			newCenterOffset[0] - viewCenterOffset[0],
			newCenterOffset[1] - viewCenterOffset[1]
		];
		//arrayMath("sum", newCenterOffset, arrayMath("product", viewCenterOffset, inverseArray))
		viewCenterOffset = newCenterOffset;
		
		repositionNødes();
		repositionBackground();
		
		// Eww. Rewrite!! vvvvvv
		if (window.dragee && window.dragee.constructor.name === "Nøde") {
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
	this.centerViewOnNødes = centerViewOnNødes;
	//this.addNøde = addNøde;
	this.clear = clear;
	this.createNøde = createNøde;
	this.createCønnectør = createCønnectør;
	this.getDocument = getDocument;
}
NødeView.prototype.memberConstructors = {};



NødeView.prototype.setFramex=function(x, y, w, h){
	this.width = w;
	this.height = h;
	this.el.setAttribute('viewBox', [0, 0, w, h].join(" "));
	/* this.el.setAttribute('width', w); */
	/* this.el.setAttribute('height', h); */
	/* this.el.style.width = (w) + "px"; */
	/* this.el.style.height = (h) + "px"; */
	//this.offset = [-x, -y];
}
NødeView.prototype.autoSizex=function(center){
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
	
	if(center && this.nødes.length){
		nodesBounds = this.getBoundsOfAllNødesTogether(true);
		this.offsetView((winW - (nodesBounds.xMin + nodesBounds.xMax)) / 2, (winH - (nodesBounds.yMin + nodesBounds.yMax)) / 2);
		//this.setFrame(xMin, yMin, xMax, yMax); 
	}
}