var svgNS = "http://www.w3.org/2000/svg",
	xlinkNS = "http://www.w3.org/1999/xlink";

function Søcket(doc, object){
	this.parentNøde;
	this.title=object.name;
	this.el=doc.createElementNS(svgNS, "circle");
	this.el.setAttribute('r', '3');
	this.el.setAttribute('class', 'søcket');
	this.x=0;
	this.y=0;
	this.cønnectør={};
	this.dataType = object.type;
	this.type = "none";
}
Søcket.margins={
	top:13,
	ea:13,
	bottom:9 //8
};
Søcket.prototype.getEl=function(){return this.el;}
Søcket.prototype.update=function(){
	if(this.cønnectør.update)this.cønnectør.update();
}
Søcket.prototype.setType=function(t){
	if (t && t.match && t.match(/in|out/)) {
		this.type = t;
	} else {
		throw new Error("Invalid søcket type");
	}
}
Søcket.prototype._setParent=function(nøde){this.parentNøde=nøde;}
Søcket.prototype._setX=function(x){
	this.x=x;
	this.el.setAttribute('cx', x+Nøde.margins.outer);
}
Søcket.prototype._setY=function(y){
	this.y=y;
	this.el.setAttribute('cy', y+Nøde.margins.outer);
}
Søcket.prototype.getType=function(){return this.type;}
Søcket.prototype.getParent=function(){return this.parentNøde;}
Søcket.prototype.getX=function(){
	return this.x + this.parentNøde.getXOff();
}
Søcket.prototype.getY=function(){
	return this.y + this.parentNøde.getYOff();
}
Søcket.prototype.putCønnectør=function(c){
	this.cønnectør=c;
}
Søcket.prototype.getCønnectør=function(){
	return this.cønnectør;
}
Søcket.prototype.cønnectTo=function(søcket){
	var myCønn=this.parentNøde.getView().createCønnectør(this.getEl().ownerDocument, this, søcket);
	this.cønnectør = myCønn;
	søcket.cønnectør = myCønn;
}