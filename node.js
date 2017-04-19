// Split this file into individual class files.
// Rewrite each one independently.
// Change interfaces when necessary.




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

NodeList.prototype.some=Array.prototype.some;
Node.prototype.getBounds=function(){
	var l=this.offsetLeft,
		t=this.offsetTop;
	if(this.offsetParent){
		var o=this.offsetParent;
		do{
			l+=(o.offsetLeft-(o.scrollLeft||0));
			t += (o.offsetTop - (o.scrollTop || 0));
		}while(o = o.offsetParent);
	}
	return new Rectangle(l, t, this.offsetWidth, this.offsetHeight);
};
var svgNS = "http://www.w3.org/2000/svg";
var xlinkNS = "http://www.w3.org/1999/xlink";

var ff = navigator.userAgent.match("Firefox");

var idStepper = 0;
function newID() {
	return idStepper++;
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


window.mouse = {
	inWindow: false,
	x: 0,
	y: 0,
	xR: 0,
	yR: 0
};

function mouseOverWindow(evt) {
	window.mouse.inWindow = true;
	window.mouse.x = evt.pageX;
	window.mouse.y = evt.pageY;
	mouse.xR = evt.pageX / window.innerWidth;
	mouse.yR = evt.pageY / window.innerHeight;
}
function mouseLeaveWindow(evt) {
	window.mouse.inWindow = false;
	window.mouse.x = evt.pageX;
	window.mouse.y = evt.pageY;
}
window.addEventListener("mousemove", mouseOverWindow, false);
window.addEventListener("mouseover", mouseOverWindow, false);
window.addEventListener("mouseout", mouseLeaveWindow, false);


function N0de(doc, title, s0ckets){
// Private
	var x=10;
	var y=10;
	var w=100;
	var h=50;
	var cornerRadius = 3;
	var xOff=0;
	var yOff=0;
	var view=null;
	var makeBox=function(w, h, x, y){
		var box=doc.createElementNS(svgNS, "path");
		//box.setAttribute("width", w);
		//box.setAttribute("height", h);
		//box.setAttribute("rx", 3);
		//box.setAttribute("ry", 3);
		//box.setAttribute("x", x);
		//box.setAttribute("y", y);
		
		box.setAttribute("d", svgRoundedRect(x, y, w, h, [0, 0, cornerRadius, cornerRadius]));
		box.setAttribute("class", "n0de draggable");
		return box;
	};
	var makeTitle=function(t){
		var title={};
		title.text=doc.createElementNS(svgNS, "text");
		title.text.appendChild(doc.createTextNode(t));
		title.text.setAttribute("class", "titleText");
		title.text.setAttribute("y", 20);
		title.back=doc.createElementNS(svgNS, "rect");
		title.back.setAttribute("class", "titleBack");
		title.g=doc.createElementNS(svgNS, "svg");
		title.g.appendChild(title.back);
		title.g.appendChild(title.text);
		title.g.setAttribute("overflow", "initial");
		title.g.setAttribute("x", 0);//N0de.margins.outer);
		title.g.setAttribute("y", 0);//N0de.margins.outer);
		return title;
	};
	var setX=function(newX){
		//console.log(x, newX, xOff);
		x=newX;
		var ratio = window.devicePixelRatio;
		el.g.setAttribute('x', Math.round(xOff * ratio) / ratio + x - N0de.margins.outer);
		updateS0ckets();
	}
	var setY=function(newY){
		//console.log(y, newY, yOff);
		y=newY;
		var ratio = window.devicePixelRatio;
		el.g.setAttribute('y', Math.round(yOff * ratio) / ratio + y - N0de.margins.outer);
		updateS0ckets();
	}
	var offsetX=function(newX){
		xOff=newX;
		setX(x);
	}
	var offsetY=function(newY){
		yOff=newY;
		setY(y);
	}
	var getOffset = this.getOffset = function getOffset() {
		return [xOff, yOff];
	}
	var updateS0ckets=function(){
		for(var side=0;side<s0ckets.length;side++)
			for(var i=0;i<s0ckets[side].length;i++)
				s0ckets[side][i].update();
		if(view)view.clear();
	}
	var el={};
	el.title=makeTitle(title);
	var viewEl = doc.querySelector("svg");
	var titleG = el.title.g
	viewEl.appendChild(titleG);
	var bbox=el.title.text.getBBox();
	viewEl.removeChild(titleG);
	w = Math.ceil(bbox.width) + 24;
	h = (Math.max(s0ckets[0].length, s0ckets[1].length) - 1) * S0cket.margins.ea + S0cket.margins.top + S0cket.margins.bottom;
	el.box=makeBox(w, h, N0de.margins.outer, N0de.margins.outer);
	el.s0cketsg=doc.createElementNS(svgNS, "svg");
	el.g=doc.createElementNS(svgNS, "svg");
	el.g.appendChild(el.box);
	el.g.appendChild(el.title.g);
	el.g.appendChild(el.s0cketsg);
// Public
	this.setS0ckets=function(newS0ckets){
		var topS0cket, side, i, currentS0cket;
		
		s0ckets=[[], []];
	//	el.s0cketsg
		for(side=0;side<s0ckets.length;side++){
			topS0cket = new S0cket(doc, { name: "", type: title });
			el.s0cketsg.appendChild(topS0cket.getEl());
			topS0cket._setParent(this);
			topS0cket._setX(side*(w));
			topS0cket._setY(S0cket.margins.top+S0cket.margins.ea*-1);
			topS0cket.setType(["in", "out"][side]);
			s0ckets[side][0] = topS0cket;
			for(i=0;i<newS0ckets[side].length;i++){
				if(typeof newS0ckets[side][i]=="string" || typeof newS0ckets[side][i].name=="string")
					currentS0cket = new S0cket(doc, newS0ckets[side][i]);
				else
					currentS0cket = newS0ckets[side][i];
				//console.log(currentS0cket);
				currentS0cket._setParent(this);
				currentS0cket._setX(side*w);
				currentS0cket._setY(S0cket.margins.top+S0cket.margins.ea*i);
				currentS0cket.setType(["in", "out"][side]);
				s0ckets[side][i + 1] = currentS0cket;
				el.s0cketsg.appendChild(currentS0cket.getEl());
			}
		}
	}
	this.getS0ckets=function(){return s0ckets;}
	this.s0ck=function(side, i){return s0ckets[side][i];}
	this.getEl=function(){return el.g;}
	this.setView=function(v, x, y){
		view=v;
		this.moveTo(x, y);
		var bbox=el.title.text.getBBox();
		var totalWidth=bbox.width+2*N0de.margins.title - (ff ? 2 : 0);
		var totalHeight=bbox.height-1 - (ff ? 2 : 0);
		el.title.back.setAttribute("width", totalWidth);
		el.title.back.setAttribute("height", totalHeight-1);
		el.title.back.setAttribute("rx", 2);
		el.title.back.setAttribute("ry", 2);
		el.title.text.setAttribute("x", N0de.margins.title);
		el.title.text.setAttribute("y", N0de.margins.title + 11 - (ff ? 2 : 0));
		el.title.g.setAttribute("x", N0de.margins.outer+(w-totalWidth)/2);
		el.title.g.setAttribute("y", N0de.margins.outer-totalHeight*.56);
		updateS0ckets();
	}
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
		for(var side=0;side<s0ckets.length;side++)
			for(var i=0;i<s0ckets[side].length;i++)
				;//v.putOnTop(s0ckets[side][i].getC0nnector());
		v.bringToFront(this);
	}
	this.getBBox=function(){
		return{
			x:x-N0de.margins.outer,
			y:y-N0de.margins.outer,
			w:w+2*N0de.margins.outer,
			h:h+2*N0de.margins.outer
		};
	}
	this.setS0ckets(s0ckets);
	this.moveTo(x, y);
}
N0de.margins={
	outer:20,
	title:2
};

function S0cket(doc, object){
	this.parentN0de;
	this.title=object.name;
	this.el=doc.createElementNS(svgNS, "circle");
	this.el.setAttribute('r', '3');
	this.el.setAttribute('class', 's0cket');
	this.x=0;
	this.y=0;
	this.c0nnector={};
	this.dataType = object.type;
	this.type = "none";
}
S0cket.margins={
	top:13,
	ea:13,
	bottom:9 //8
};
S0cket.prototype.getEl=function(){return this.el;}
S0cket.prototype.update=function(){
	if(this.c0nnector.update)this.c0nnector.update();
}
S0cket.prototype.setType=function(t){
	if (t && t.match && t.match(/in|out/)) {
		this.type = t;
	} else {
		throw new Error("Invalid søcket type");
	}
}
S0cket.prototype._setParent=function(n0de){this.parentN0de=n0de;}
S0cket.prototype._setX=function(x){
	this.x=x;
	this.el.setAttribute('cx', x+N0de.margins.outer);
}
S0cket.prototype._setY=function(y){
	this.y=y;
	this.el.setAttribute('cy', y+N0de.margins.outer);
}
S0cket.prototype.getType=function(){return this.type;}
S0cket.prototype.getParent=function(){return this.parentN0de;}
S0cket.prototype.getX=function(){
	return this.x + this.parentN0de.getXOff();
}
S0cket.prototype.getY=function(){
	return this.y + this.parentN0de.getYOff();
}
S0cket.prototype.putC0nnector=function(c){
	this.c0nnector=c;
}
S0cket.prototype.getC0nnector=function(){
	return this.c0nnector;
}
S0cket.prototype.c0nnectTo=function(s0cket){
	var myC0nn=new C0nnector(this.getEl().ownerDocument, this, s0cket);
	this.c0nnector = myC0nn;
	s0cket.c0nnector = myC0nn;
	this.parentN0de.getView().addC0nnect0r(myC0nn);
}

function C0nnector(doc, s0cket1, s0cket2){
	this.ends=s0cket1.getType() === "out" ? [s0cket1, s0cket2] : [s0cket2, s0cket1];
	this.id='c0nn'+newID();
	for(var i=0;i<2;i++)
		if(this.ends[i].putC0nnector)
			this.ends[i].putC0nnector(this);
	this.el={};
	this.el.g=doc.createElementNS(svgNS, "svg");
	this.el.path=doc.createElementNS(svgNS, "path");
	this.el.front=doc.createElementNS(svgNS, "use");
	this.el.back=doc.createElementNS(svgNS, "use");
	this.el.text=doc.createElementNS(svgNS, "text");
	this.el.textPath=doc.createElementNS(svgNS, "textPath");
	this.el.textPath2=doc.createElementNS(svgNS, "textPath");
	this.el.textBack=doc.createElementNS(svgNS, "use");
	this.el.path.setAttribute('id', this.id);
	this.el.path.style.fill = "none";
	this.el.front.setAttribute('class', 'c0nn');
	this.el.front.setAttributeNS(xlinkNS, 'href', '#'+this.id);
	this.el.back.setAttribute('class', 'c0nnBack');
	this.el.back.setAttributeNS(xlinkNS, 'href', '#'+this.id);
	this.el.text.setAttribute('class', 'c0nnText');
	this.el.text.setAttribute('x', '-40');
	this.el.text.setAttribute('y', '-40');
	this.el.textPath.setAttributeNS(xlinkNS, 'href', '#'+this.id);
	this.el.textPath2.setAttributeNS(xlinkNS, 'href', '#'+this.id);
	this.el.textBack.setAttribute('class', 'c0nnTextBack');
	this.el.textBack.setAttributeNS(xlinkNS, 'href', '#'+this.id);
	this.el.g.appendChild(this.el.path);
	this.el.g.appendChild(this.el.back);
	this.el.g.appendChild(this.el.front);
	this.el.g.appendChild(this.el.textBack);
	this.el.g.appendChild(this.el.text);
	this.el.text.textContent = ".";
	this.el.text.appendChild(this.el.textPath);
	this.el.text.appendChild(this.el.textPath2);
	this.el.textPath.textContent = "Number";
	this.el.textPath2.textContent = "Number";
	this.curveArray=[];
	this.update();
}
C0nnector.prototype.update=function(){
	var ratio = window.devicePixelRatio,
		e = this.ends,
		a = e[0],
		b = e[1],
		xA = Math.round(a.getX() * ratio) / ratio,
		yA = Math.round(a.getY() * ratio) / ratio,
		xB = Math.round(b.getX() * ratio) / ratio,
		yB = Math.round(b.getY() * ratio) / ratio,
		antiKink = Math.abs(distance([xB, yB], [xA, yA])) * .2,
		curveLength,
		textBackEndMargin = 10,
		textBackLength = 120,
		textBackOffset,
		textBackDashArray;
	/* 
this.curveArray=[[xA+3, yA],
					[xA+Math.abs((xB-xA)/2)+20, yA+(yB-yA)/10],
					[xB-Math.abs((xB-xA)/2)-20, yB-(yB-yA)/10],
					[xB-3, yB]];
 */

	this.curveArray=[[xA+3.3, yA],
					[xA+3.5 + antiKink, yA+(yB-yA)/5],
					[xB-3.5 - antiKink, yB-(yB-yA)/5],
					[xB-3.3, yB]];
	var curveString="M"+this.curveArray[0].join(",")+" C"+this.curveArray.slice(1).map(function(a){return a.join(",");}).join(" ");
	this.el.path.setAttribute("d", curveString);
	//this.el.back.setAttribute("d", curveString);
	textBackLength = this.el.textPath.getComputedTextLength();
	//this.el.text. //textpath.getComputedTextLength()
	//this.el.textBack.setAttribute("d", curveString);
	curveLength = this.el.path.getTotalLength();
	if (curveLength > (textBackLength * 2 + textBackEndMargin * 4)) {
		textBackOffset = (curveLength - (textBackLength + textBackEndMargin) * 2);
		textBackDashArray = [0, textBackEndMargin + 1, textBackLength, textBackOffset, textBackLength, textBackEndMargin * 2];
		this.el.textPath.setAttribute("text-anchor", "start");
		this.el.textPath2.setAttribute("text-anchor", "end");
		this.el.textPath.setAttribute("startOffset", textBackEndMargin);
		this.el.textPath2.setAttribute("startOffset", curveLength-textBackEndMargin);
		this.el.textPath.style.visibility = "visible";
		this.el.textPath2.style.visibility = "visible";
	} else if (curveLength > textBackLength + 2 * textBackEndMargin) {
		textBackOffset = (curveLength - textBackLength) / 2;
		textBackDashArray = [0, textBackOffset + 1, textBackLength, textBackOffset * 2];
		this.el.textPath.setAttribute("startOffset", "50%");
		this.el.textPath.setAttribute("text-anchor", "middle");
		this.el.textPath.style.visibility = "visible";
		this.el.textPath2.style.visibility = "hidden";
	} else {
		textBackDashArray = [0, curveLength * 2];
		this.el.textPath.style.visibility = "hidden";
		this.el.textPath2.style.visibility = "hidden";
	}
	//this.el.text.
	this.el.textBack.style["stroke-dasharray"] = textBackDashArray.join(" ");
	this.el.textBack.style["stroke-dashoffset"] = 1;
}
C0nnector.prototype.getEl=function(){return this.el.g;}

function Curs0r(x, y) {
	var x = x || 0,
		y = y || 0,
		dropped = false,
		connector,
		mousemove = function mousemove(evt) {
			if (dropped) return;
			x = evt.x;
			y = evt.y;
			connector && connector.update();
		},
		that = {
			putC0nnector: function putC0nnector(c) {
				connector = c;
			},
			getX: function getX() {
				return x;
			},
			getY: function getY() {
				return y;
			},
			drop: function drop() {
				dropped = true;
			}
		};
	window.addEventListener("mousemove", mousemove, false);
	return that;
}