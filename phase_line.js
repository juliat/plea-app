/* Phase Line Class */

function PhaseLine(chart, day, type, note, floor) {
	this.value = null;
	this.chart = chart;
	this.day = day;
	this.type = type;
	this.note = note;
	this.floor = floor;
	this.x = chart.dayToXPosition(day);
	this.phaselineRadius = chart.drawElement.height()*.0625;
	this.phaselineTopLength = chart.drawElement.height()*.65;
	this.phaselineBottomLength = chart.drawElement.height()*.125;
	this.phaselineStartY = chart.drawElement.height()*.09375;
	this.paperObject = this.create();
}

PhaseLine.prototype.create = function() {
	var phaselineSet = this.chart.paper.set();
	phaselineSet.push(this.drawPhaseline());
	phaselineSet.push(this.drawFloor());
	phaselineSet.push(this.drawType());
	phaselineSet.push(this.drawNote());
	return phaselineSet;
}

PhaseLine.prototype.drawPhaseline = function() {
	var x = this.x;
	var r = this.phaselineRadius;
	var y = this.phaselineStartY;
	var l = this.phaselineTopLength;
	var z = this.phaselineBottomLength;
	var linePath = 'M '+(x-r)+' '+y+' C '+(x-r)+' '+y+' '+(x-(r-35))+' '+y+' '+x+' '+(y+(r-20))+' '+' L '+(x)+' '+(y+r+l)+' L '+(x-(r-30))+' '+(y+r+l+z);
	var newPhaseline = this.chart.paper.path(linePath);
	newPhaseline.attr(this.chart.phaselineStyles['phaseline']);
	return newPhaseline;
}

PhaseLine.prototype.drawFloor = function() {
	var x = this.x;
	var r = this.phaselineRadius;
	var y = this.phaselineStartY;
	var floor = this.chart.paper.text(x-r, y+10, this.floor);
	floor.attr(this.chart.phaselineStyles['phaseline-floor']);
	return floor;
}

PhaseLine.prototype.drawType = function() {
	var x = this.x;
	var y = this.chart.drawElement.height() * .5;
	//if (this.type === null) this.type = 'hi';
	//alert(this.type);
	var type = this.chart.paper.text(x, y, this.type);
	type.transform('T -10 0 R -90');
	return type;
}

PhaseLine.prototype.drawNote = function() {
	var x = this.x;
	var y = this.chart.drawElement.height() * .94;
	var note = this.chart.paper.text(x, y, this.note);
	note.attr(this.chart.phaselineStyles['phaseline-note']);
	return note;
}