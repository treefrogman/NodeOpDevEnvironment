function svgRoundedRect(x, y, w, h, r) {
	var d = [];
	d.push("M", x + r[0], y);
	d.push("h", w - r[0] - r[1]);
	if (r[1]) { d.push("a", r[1], r[1], 0, 0, 1, r[1], r[1]); }
	d.push("v", h - r[1] - r[2]);
	if (r[2]) { d.push("a", r[2], r[2], 0, 0, 1, -r[2], r[2]); }
	d.push("h", -(w - r[2] - r[3]));
	if (r[3]) { d.push("a", r[3], r[3], 0, 0, 1, -r[3], -r[3]); }
	d.push("v", -(h - r[3] - r[0]));
	if (r[0]) { d.push("a", r[0], r[0], 0, 0, 1, r[0], -r[0]); }
	
	return d.join(" ");
}
/* 
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
 */
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
	function Nøde(view, titleText, søcketList, position) {
		var margins = {
				outer: 20,
				title: 2
			},
			doc = view.getDocument(),
			title = new TitleObject(titleText),
			søckets = new SøcketsObject(søcketList),
			box = new BoxObject(title, søckets),
			groupElement = createGroupElement(title, søckets, box),
			viewOffset = [0, 0];
		
		// View
		function getView() {
			return view;
		}
		
		// Title Object
		function TitleObject(text) {
			var groupElement = doc.createElementNS(svgNS, "svg"),
				backElement = doc.createElementNS(svgNS, "rect"),
				textElement = doc.createElementNS(svgNS, "text"),
				textElementBBox,
				backElementBBox;
			
			function initializeElements() {
				textElement.setAttributes({
					y: 13,
					"class": "titleText"
				});
				backElement.setAttributes({
					rx: 2,
					ry: 2,
					"class": "titleBack"
				});
			}
			function retitle(text) {
				textElement.textContent = text;
				textElementBBox = getTextBBox(doc, textElement);
				backElementBBox = [textElementBBox.width + (2 * margins.title), textElementBBox.height - 2];
				backElement.setAttributes({
					width: backElementBBox[0],
					height: backElementBBox[1],
					x: -backElementBBox[0] / 2
				});
				groupElement.setAttributes({
					y: -backElementBBox[1] * .56
				});
				this.bbox = backElementBBox;
				groupElement.appendChild(backElement);
				groupElement.appendChild(textElement);
			}
			
			initializeElements();
			retitle(text);
			
			this.retitle = retitle;
			this.element = groupElement;
			this.bbox = backElementBBox;
		}
		
		// Søckets Element
		function SøcketsObject() {
			var groupElement = doc.createElementNS(svgNS, "svg");
			return {
				element: groupElement
			};
		}
		function updateCønnectørs() {
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
		
		// Box Element
		function BoxObject(title, søckets) {
			var boxElement = doc.createElementNS(svgNS, "path"),
				boxDimensions;
			
			function resizeToFitTitleAndSøckets(title, søckets) {
				var width = Math.ceil(title.bbox[0]) + 24, // This will need to be updated to include combined widths of (adjacent / longest) søcket names
					height = 20;
					// vv This should be kept as reference until rewritten (søcket height calculator)
					//(Math.max(søckets[0].length, søckets[1].length) - 1) * Søcket.margins.ea + Søcket.margins.top + Søcket.margins.bottom;
				resize([width, height]);
			}
			function resize(dimensions) {
				var width = dimensions[0],
					height = dimensions[1],
					cornerRadius = 3;
				boxDimensions = dimensions;
				boxElement.setAttribute("d", svgRoundedRect(0, 0, width, height, [0, 0, cornerRadius, cornerRadius]));
				title.element.setAttribute("x", boxDimensions[0] / 2); // Don't like how this works!!
			}
			function getDimensions() {
				return boxDimensions;
			}
			
			resizeToFitTitleAndSøckets(title, søckets);
			boxElement.setAttribute("class", "nødeBox");
			
			this.resizeToFitTitleAndSøckets = resizeToFitTitleAndSøckets;
			this.element = boxElement;
			this.dimensions = getDimensions;
		}
		
		// Main element
		function createGroupElement(title, søckets, box) {
			var groupElement = doc.createElementNS(svgNS, "svg");
			groupElement.appendChild(box.element);
			groupElement.appendChild(title.element);
			groupElement.appendChild(søckets.element);
			return groupElement;
		}
		function getGroupElement() {
			return groupElement;
		}
	
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
			
			groupElement.setAttributes({
				x: Math.floor(position[0] + viewOffset[0]),
				y: Math.floor(position[1] + viewOffset[1])
			});
			updateCønnectørs();
		}
		function getBoundingBox(){
			return [position, box.dimensions()];
			/*{
				x:x-Nøde.margins.outer,
				y:y-Nøde.margins.outer,
				w:w+2*Nøde.margins.outer,
				h:h+2*Nøde.margins.outer
			};*/
		}
		
		// Modification
		function rename(newName) {
			title.retitle(newName);
			box.resizeToFitTitleAndSøckets(title, søckets);
		}
		thistle = this;
		
		// Publications
		this.getView = getView;
		this.getElement = getGroupElement;
		this.getPosition = getPosition;
		this.setViewOffset = setViewOffset;
		this.getBoundingBox = getBoundingBox;
		this.rename = rename;
		
		
		
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

