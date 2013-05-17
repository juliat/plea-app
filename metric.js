/* Metric Class */

function Metric(chart, type, y) {
	this.marker = chart.getMarkerForMetric(type);
	this.x = x;
	this.y = y;
	this.value = getValue(y);
}

Metric.prototype.getValue = function() {
	if (this.type === 'floor') {
		this.getValueForFloor();
	}
	else if (this.type === 'corrects' || this.type === 'incorrects') {
		this.getValueLogarithmically();
	}
}

Metric.prototype.getValueForFloor = function() {

}

Metric.prototype.drawMarker = function() {

}

Metric.prototype.changeMarkerValue = function(delta) {
	this.value = this.value + delta;
}

Metric.prototype.highlight = function() {
	// ...
}
