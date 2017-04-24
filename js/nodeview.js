var ff = navigator.userAgent.match("Firefox");
if (ff) {
	alert("Nøde is only tested in Chrome, and uses some fancy features, so it probably won't work in Firefox.");
}

function clipCoordinatesToBounds(coords, bounds) {
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
		nødesElement.appendChild(nøde.getElement());
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
		nødesElement.appendChild(nøde.getElement());
	}
	
	function repositionNødes() {
		var inverseArray = [-1, -1],
			viewOffset = [
				viewCenterOffset[0] + viewDimensions[0] / 2,
				viewCenterOffset[1] + viewDimensions[1] / 2
			];
		nødes.forEach(function (a) {
			a.setViewOffset(viewOffset);
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
	function setViewCenterOffset(newCenterOffset) {
		viewCenterOffset = clipCenterToBounds(newCenterOffset);
		repositionNødes();
		repositionBackground();
	}
	function resizeView(w, h) { // Rewrite!! Broken
		viewDimensions = [w, h];
		element.setAttribute('viewBox', [0, 0, w, h].join(" "));
		
		document.body.style.maxWidth = w; // What for?!!
		document.body.style.maxHeight = h; // What for?!!
		
		setViewCenterOffset(viewCenterOffset);
	}
	function clipCenterToBounds(newCenterOffset) {
		var nødeBounds = getBoundsOfAllNødesTogether(),
			margin = 10,
			inverseArray = [-1, -1],
			// Calculate centerBounds based on viewBounds, nødeBounds, margins
			centerBounds = {
				max: [
					-(nødeBounds.min[0] - viewDimensions[0] / 2 + margin),
					-(nødeBounds.min[1] - viewDimensions[1] / 2 + margin)
				],
				min: [
					-(nødeBounds.max[0] + viewDimensions[0] / 2 - margin),
					-(nødeBounds.max[1] + viewDimensions[1] / 2 - margin)
				]
			};
		// Clip newCenterOffset to centerBounds
		return clipCoordinatesToBounds(newCenterOffset, centerBounds);
	}
	function centerViewOnNødes() {
		var nødeBounds = getBoundsOfAllNødesTogether(),
			newCenterOffset = [
				-(nødeBounds.min[0] + nødeBounds.max[0]) / 2,
				-(nødeBounds.min[1] + nødeBounds.max[1]) / 2
			];
		setViewCenterOffset(newCenterOffset);
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
			inverseArray = [-1, -1];
		setViewCenterOffset(newCenterOffset);
		
		// Eww. Rewrite!! vvvvvv
		/*
		if (window.dragee && window.dragee.constructor.name === "Nøde") {
			window.dragAnchorX += deltaX;  // Use clippedDelta
			window.dragAnchorY += deltaY;  // Use clippedDelta
			window.dragee.moveTo(evt.pageX-window.dragAnchorX, evt.pageY-window.dragAnchorY);
		}
		*/
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