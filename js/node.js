function def() {
	// Takes any number of arguments and returns the first one that isn't undefined.
	// Similar to a series of (a || b || c), but treats (false, 0, "", [], {}) as valid return values.
	var i = 0,
		l = arguments.length,
		a;
	for (; i < l; i += 1) {
		a = arguments[i];
		if (a !== undefined) {
			return a;
		}
	}
}
function svgRoundedRect(x, y, w, h, r) {
	var d = [],
		radii = [
			[
				def(r[0][0], r[0], r),
				def(r[0][1], r[0], r)
			], [
				def(r[1][0], r[1], r),
				def(r[1][1], r[1], r)
			], [
				def(r[2][0], r[2], r),
				def(r[2][1], r[2], r)
			], [
				def(r[3][0], r[3], r),
				def(r[3][1], r[3], r)
			]
		],
		r = radii;
	
	d.push("M", x + r[0][0], y);
	d.push("h", w - r[0][0] - r[1][0]);
	if (r[1][0] && r[1][1]) { d.push("a", r[1][0], r[1][1], 0, 0, 1, r[1][0], r[1][1]); }
	d.push("v", h - r[1][1] - r[2][1]);
	if (r[2][0] && r[2][1]) { d.push("a", r[2][0], r[2][1], 0, 0, 1, -r[2][0], r[2][1]); }
	d.push("h", -(w - r[2][0] - r[3][0]));
	if (r[3][0] && r[3][1]) { d.push("a", r[3][0], r[3][1], 0, 0, 1, -r[3][0], -r[3][1]); }
	d.push("v", -(h - r[3][1] - r[0][1]));
	if (r[0][0] && r[0][1]) { d.push("a", r[0][0], r[0][1], 0, 0, 1, r[0][0], -r[0][1]); }
	
	return d.join(" ");
}
function sum(n, i, f) {
	var x = 0;
	for ( ; i <= n ; i++) {
		x += f(i);
	}
	return x;
}
function distance(p, q) {
	var l = p.length;
	if (l !== q.length) { throw new Error("Dimensional mismatch"); }
	return Math.pow(sum(l, 1, function (i) {
		i -= 1;
		return Math.pow(q[i] - p[i], 2);
	}), .5);
}
Element.prototype.setAttributes = function (attributes) {
	var element = this;
   Object.keys(attributes).forEach(function (attribute) {
     element.setAttribute(attribute, attributes[attribute]);
   });
}

var svgNS = "http://www.w3.org/2000/svg",
	xlinkNS = "http://www.w3.org/1999/xlink";

// Put Nøde, Søcket, Cønnectør inside NødeView, with methods like nødeView.createNøde()
(function () {
	function Nøde(view, titleText, søckets, position) {
		var margins = {
				outer: 20,
				title: 2
			},
			doc = view.getDocument(),
			titleObject = createTitleObject(titleText),
			boxDimensions = calculateBoxDimensions(titleObject.bbox, []),
			boxElement = createBoxElement(),
			nødeElement = createNødeElement(),
			cornerRadius = 3,
			viewOffset = [0, 0];
		
		// View
		function getView() {
			return view;
		}
		
		// Elements
		function getTextBBox(doc, textElement) {
			var tempSVG = doc.createElementNS(svgNS, "svg"),
				body = doc.body,
				bBox;
			body.appendChild(tempSVG);
			tempSVG.appendChild(textElement);
			bBox = textElement.getBBox();
			body.removeChild(tempSVG);
			tempSVG.removeChild(textElement);
			return bBox;
		}
		function createTitleObject(text) {
			var textNode = doc.createTextNode(text),
				textElement = doc.createElementNS(svgNS, "text"),
				backElement = doc.createElementNS(svgNS, "rect"),
				groupElement = doc.createElementNS(svgNS, "svg"),
				textElementBBox,
				backElementWidth,
				backElementHeight;
			textElement.appendChild(textNode);
			textElement.setAttributes({
				y: 13,
				"class": "titleText"
			});
			textElementBBox = getTextBBox(doc, textElement);
			backElementWidth = textElementBBox.width + (2 * margins.title); // - (ff ? 2 : 0);!!
			backElementHeight = textElementBBox.height - 1; // - (ff ? 2 : 0);!!
			backElement.setAttributes({
				width: backElementWidth,
				height: backElementHeight - 1,
				rx: 2,
				ry: 2,
				x: -backElementWidth / 2,
				"class": "titleBack"
			});
			groupElement.setAttributes({
				//x: backElementWidth / 2,
				y: -backElementHeight * .56 // *.56?? Is this a hack for font zoom? Probably obsolete!!
			});
			groupElement.appendChild(backElement);
			groupElement.appendChild(textElement);
			return {
				text: textElement,
				back: backElement,
				element: groupElement,
				bbox: textElementBBox
			};
		}
		function calculateBoxDimensions(titleBBox, søcketBBoxes) {
			var width = Math.ceil(titleBBox.width) + 24,
				height = 20;
				//(Math.max(søckets[0].length, søckets[1].length) - 1) * Søcket.margins.ea + Søcket.margins.top + Søcket.margins.bottom;
			return [width, height];
		}
		
		function createBoxElement() {
			var boxElement = doc.createElementNS(svgNS, "path");
			boxElement.setAttribute("class", "nødeBox");
			return boxElement;
		}
		function resizeBoxElement() {
			var width = boxDimensions[0],
				height = boxDimensions[1];
			boxElement.setAttribute("d", svgRoundedRect(0, 0, width, height, [0, 0, cornerRadius, cornerRadius]));
		}
		
		// Søckets
		function createSøcketsElement() {
			
		}
		function repositionSøckets() {
			var side,
				i;
			for (side = 0; side < søckets.length; side += 1) {
				for (i = 0; i < søckets[side].length; i += 1) {
					//søckets[side][i].update();
				}
			}
			if (view) {
				view.clear();
			}
		}
		
		// Main element
		function createNødeElement() {
			var nødeElement = doc.createElementNS(svgNS, "svg");
			nødeElement.appendChild(boxElement);
			nødeElement.appendChild(titleObject.element);
			titleObject.element.setAttribute("x", boxDimensions[0] / 2);
			//nødeElement.appendChild(søcketsElement);
			return nødeElement;
		}
		function getNødeElement() {
			return nødeElement;
		}
		resizeBoxElement();
	
		// Position, offset, and dimensions
		function setPosition(newX, newY) {
			position = [newX, newY];
			applyViewOffset();
		}
		function getPosition() {
			return position;
		}
		function setViewOffset(position) {
			viewOffset = position;
			applyViewOffset();
		}
		function applyViewOffset() {
			//var ratio = window.devicePixelRatio;
			//element.group.setAttribute('x', Math.round(xOff * ratio) / ratio + newX);
			//element.group.setAttribute('y', Math.round(yOff * ratio) / ratio + newY);
			
			nødeElement.setAttributes({
				x: position[0] + viewOffset[0],
				y: position[1] + viewOffset[1]
			});
			repositionSøckets();
		}
		function getBoundingBox(){
			return [position, boxDimensions];
			/*{
				x:x-Nøde.margins.outer,
				y:y-Nøde.margins.outer,
				w:w+2*Nøde.margins.outer,
				h:h+2*Nøde.margins.outer
			};*/
		}
		
		// Publications
		this.getView = getView;
		this.getNødeElement = getNødeElement;
		this.getPosition = getPosition;
		this.setViewOffset = setViewOffset;
		this.getBoundingBox = getBoundingBox;
		
		
		
		/*
		var el={};
		el.title=createTitleElements(title);
		var viewEl = doc.querySelector("svg");
		var titleG = el.title.g
		doc.appendChild(titleG);
		var bbox=el.title.text.getBBox();
		doc.removeChild(titleG);
		w = Math.ceil(bbox.width) + 24;
		h = (Math.max(søckets[0].length, søckets[1].length) - 1) * Søcket.margins.ea + Søcket.margins.top + Søcket.margins.bottom;
		el.box=createBoxElement(Nøde.margins.outer, Nøde.margins.outer, w, h);
		el.søcketsg=doc.createElementNS(svgNS, "svg");
		el.g.appendChild(el.box);
		el.g.appendChild(el.title.g);
		el.g.appendChild(el.søcketsg);
	// Public
		this.setSøckets=function(newSøckets){
			var topSøcket, side, i, currentSøcket;
		
			søckets=[[], []];
		//	el.søcketsg
			for(side=0;side<søckets.length;side++){
				topSøcket = new Søcket(doc, { name: "", type: title });
				el.søcketsg.appendChild(topSøcket.getEl());
				topSøcket._setParent(this);
				topSøcket._setX(side*(w));
				topSøcket._setY(Søcket.margins.top+Søcket.margins.ea*-1);
				topSøcket.setType(["in", "out"][side]);
				søckets[side][0] = topSøcket;
				for(i=0;i<newSøckets[side].length;i++){
					if(typeof newSøckets[side][i]=="string" || typeof newSøckets[side][i].name=="string")
						currentSøcket = new Søcket(doc, newSøckets[side][i]);
					else
						currentSøcket = newSøckets[side][i];
					//console.log(currentSøcket);
					currentSøcket._setParent(this);
					currentSøcket._setX(side*w);
					currentSøcket._setY(Søcket.margins.top+Søcket.margins.ea*i);
					currentSøcket.setType(["in", "out"][side]);
					søckets[side][i + 1] = currentSøcket;
					el.søcketsg.appendChild(currentSøcket.getEl());
				}
			}
		}
		this.getSøckets=function(){return søckets;}
		this.søck=function(side, i){return søckets[side][i];}
		this.moveTo=function(x, y){
			//console.log(x, y);
			setX(x);
			setY(y);
			//if(view)view.autoSize();
		}
		this.offset=function(x, y){
			//console.log(x, y);
			offsetX(x);
			offsetY(y);
			//if(view)view.autoSize();
		}
		this.getView=function(){return view;}
		this.getX=function(){return x;}
		this.getY=function(){return y;}
		this.getXOff=function(){return x + getOffset()[0];}
		this.getYOff=function(){return y + getOffset()[1];}
		this.bringToFront=function(){
			var v=this.getView();
			for(var side=0;side<søckets.length;side++)
				for(var i=0;i<søckets[side].length;i++)
					;//v.putOnTop(søckets[side][i].getCønnectør());
			v.bringToFront(this);
		}
		this.getBBox=function(){
			return{
				x:x-Nøde.margins.outer,
				y:y-Nøde.margins.outer,
				w:w+2*Nøde.margins.outer,
				h:h+2*Nøde.margins.outer
			};
		}
		this.setSøckets(søckets);
		this.moveTo(x, y);
		*/
	}
	NødeView.prototype.memberConstructors.Nøde = Nøde;
}());

