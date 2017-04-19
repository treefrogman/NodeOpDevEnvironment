var idStepper = 0;
function newID() {
	return idStepper++;
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