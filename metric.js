/* Metric Class */

function Metric(chart, type, day, y) {
	this.chart = chart;
	this.type = type;
	this.marker = chart.getMarkerForMetric(type);
	this.day = day;

	if (type === 'trials') this.decadeNumber = 0; 
	else this.decadeNumber = 3;

	this.x = chart.dayToXPosition(day);
	this.y = y;
	this.radius = 5;

	this.touchedValue = this.getTouchedValue(); 
	this.logarithmicValue = this.getLogarithmicValue();// this is necessary to store the logarithmic value for floors
	this.value = this.getValue();
	this.paperObject = this.drawMarker();
}

Metric.prototype.getTouchedValue = function() {
	var decadeBasePosition = this.decadeNumber * this.chart.decadeHeight;
	var percentAwayFromVBase = (this.y - decadeBasePosition)/this.chart.decadeHeight;
	var decadeBaseValue = Math.pow(10, this.decadeNumber + this.chart.minExponent);
	var value = decadeBaseValue * Math.pow(10, percentAwayFromVBase);
	var roundedValue = this.getRoundedValue(value);
	if (this.type === 'trials') {
		return roundedValue*1000;
	}
	else {
		return roundedValue;
	}
}

Metric.prototype.getValue = function() {
	if (this.type === 'floor') {
		return this.getFloorValue();
	}
	else {
		return this.getLogarithmicValue();
	}
}

Metric.prototype.getFloorValue = function() {
	// gets value in seconds
	var snappedLogarithmicValue = this.getSnappedValue();
	var floorValue = Math.round(60/snappedLogarithmicValue);
	return floorValue;
}

Metric.prototype.getLogarithmicValue = function() {
	var logarithmicValue = this.touchedValue;
	var snappedLogarithmicValue = this.getSnappedValue();
	if (this.type === 'corrects' || this.type === 'errors') {
		if (logarithmicValue > 10) return logarithmicValue;
		if (logarithmicValue <= 10) return snappedLogarithmicValue;
	}
	if (this.type === 'floor' || this.type === 'trials') {
		return snappedLogarithmicValue;
	}
}

Metric.prototype.getRoundedValue = function(value) {
	if (value >= 1) return Math.round(value);
	if (value >= 0.1 && value < 1) return Math.round(value*100)/100;
	if (value >= 0.01 && value < 0.1) return Math.round(value*1000)/1000;
	if (value >= 0.001 && value < 0.01) return Math.round(value*10000)/10000;
}

Metric.prototype.getSnappedValue = function() {
	var snapFactor;
	if (this.touchedValue >= 0 && this.touchedValue < 0.01) snapFactor = 1000; 
	if (this.touchedValue >= 0.01 && this.touchedValue < 0.1) snapFactor = 100;
	if (this.touchedValue >= .1 && this.touchedValue < 1) snapFactor = 10;
	if (this.touchedValue >= 1 && this.touchedValue < 10) snapFactor = 1;
	if (this.touchedValue >= 10 && this.touchedValue < 100) snapFactor = .1;
	if (this.touchedValue >= 100 && this.touchedValue < 1000) snapFactor = .01;
	snappedLogarithmicValue = Math.round(this.touchedValue*snapFactor) / snapFactor;
	return snappedLogarithmicValue;
}

Metric.prototype.drawMarker = function() {
	var y = this.getMarkerYPosition(this.logarithmicValue);
	
	if (this.marker === 'filled-circle') return this.drawCircle(y, true);
	if (this.marker === 'line') return this.drawLine(y);
	if (this.marker === 'cross') return this.drawCross(y);
	if (this.marker === 'empty-circle') return this.drawCircle(y, false);
}

Metric.prototype.getMarkerYPosition = function(value) {
	var decadeBasePosition = this.chart.getDecadeBasePosition(this.decadeNumber);
	var decadeBaseValue = this.chart.getDecadeBaseValue(this.decadeNumber);	
	var markerY = this.chart.valueToYPosition(decadeBasePosition, value * decadeBaseValue, decadeBaseValue);
	return markerY;
}

Metric.prototype.drawCircle = function(y, isFilled) {
	// draw circle on chart
	var newCircle = this.chart.paper.circle(this.x, y, this.radius);

	// set corrects attributes onto circle
	if (isFilled === true) {
		var correctMetricStyles = this.chart.metricStyles[this.marker];
		newCircle.attr(correctMetricStyles);
	}

	// set trials attributes onto circle
	else {
		var trialMetricStyles = this.chart.metricStyles[this.marker];
		newCircle.attr(trialMetricStyles);
	}

	return newCircle;
}

Metric.prototype.drawLine = function(y) {
	// draw line on chart
	var linePath = 'M '+(this.x-this.radius)+' '+y+' L '+(this.x+this.radius)+' '+y;
	var newLine = this.chart.paper.path(linePath);
	// set floor attributes onto line
	var floorMetricStyles = this.chart.metricStyles[this.marker];
	newLine.attr(floorMetricStyles);

	return newLine;
}

Metric.prototype.drawCross = function(y) {
	// draw cross on chart, cross is drawn as two lines
	var crossPathOne = 'M '+(this.x-this.radius)+' '+(y-this.radius)+' L '+(this.x+this.radius)+' '+(y+this.radius);
	var crossPathTwo = 'M '+(this.x-this.radius)+' '+(y+this.radius)+' L '+(this.x+this.radius)+' '+(y-this.radius);
	var crossLineOne = this.chart.paper.path(crossPathOne);
	var crossLineTwo = this.chart.paper.path(crossPathTwo);

	// set error attributes onto cross
	var errorMetricStyles = this.chart.metricStyles[this.marker];
	crossLineOne.attr(errorMetricStyles);
	crossLineTwo.attr(errorMetricStyles);

	// create an array (Raphael set) that contains the error marker (two separate lines)
	var errorSet = this.chart.paper.set();
	errorSet.push(crossLineOne);
	errorSet.push(crossLineTwo);

	return errorSet;
}

Metric.prototype.changeMarkerValue = function(delta) {
	if (this.type === 'floor') {
		this.prevLogarithmicValue = this.logarithmicValue;
		this.logarithmicValue += delta;
		this.value = 60/(this.logarithmicValue);
	}
	else {
		this.prevLogarithmicValue = this.logarithmicValue;
		this.logarithmicValue += delta;
		this.value += delta;
	}
}

Metric.prototype.changeMarkerPosition = function() {
	this.y = this.getMarkerYPosition(this.prevLogarithmicValue);
	console.log('previous y: ' + this.y);
	var newYPos = this.calculateNewYPosition();
	var moveDistance = -(this.y - newYPos);
	console.log('new y: ' + newYPos);
	// the errors marker is an array of two Raphael lines and must do transformation on each line individually
	if (this.type === 'errors') {
		this.paperObject[0].transform('...t0,' + moveDistance);
		this.paperObject[1].transform('...t0,' + moveDistance);
	}
	else {
		this.paperObject.transform('...t0,' + moveDistance);
	}
}

Metric.prototype.calculateNewYPosition = function() {
	var decadeBasePosition = this.chart.getDecadeBasePosition(this.decadeNumber);
	var decadeBaseValue = this.chart.getDecadeBaseValue(this.decadeNumber);
	var markerY = this.chart.valueToYPosition(decadeBasePosition, this.logarithmicValue * decadeBaseValue, decadeBaseValue);
	if (this.type === "floors") {
		return markerY + this.radius;
	}
	else {
		return markerY;
	}
}

Metric.prototype.changeValueAndMarker = function(delta) {
	if (this !== null) {
		this.changeMarkerValue(delta);
		$('#'+this.type).html(this.value);
		this.changeMarkerPosition();
	}
}

Metric.prototype.highlight = function() {
	// ...
}