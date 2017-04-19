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