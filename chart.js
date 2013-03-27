/* Chart Class 
 * ========================================================================= *
*/

function Chart() {
	this.numberOfDays = 140;
	this.minCountPerMinuteExponent = -3;
	this.maxCountPerMinuteExponent = 3;
	this.decades = Math.abs(this.minCountPerMinuteExponent) + Math.abs(this.maxCountPerMinuteExponent);
	this.chartElement = $('#chart'); 
}

/* Setup a new Kinetic.js Stage (which can contain multiple HTML5 canvases) */
Chart.prototype.init = function() {
	this.stage = new Kinetic.Stage({
		container: 'chart',
		height: this.chartElement.height(),
		width: this.chartElement.width()
	})
};

Chart.prototype.drawXAxis = function() {
	// for each decade, draw the lines within that decade on the log scale
	var i;
	for (i = 0; i++; i < 6) {
		var decadeBaseValue = Math.pow(10, this.minCountPerMinuteExponent + i);
		var decadeHighValue = Math.pow(10, this.minCountPerMinuteExponent + i + 1);
		// draw lines for the decade high value and the decade low value
		// [call line drawing function here]
		console.log('decade base value for decade ' + i + ' is ' + decadeBaseValue);
		console.log('decade high value for decade ' + i + ' is ' + decadeHighValue);

		// get y positions for and draw lines for values in between the high and the low
		var yPosition;
		for (var j = 2; j++; j < 10) {
			// solve equation where value equals two to nine, then multiply by base of the decade
			yPosition = valueToYPosition(decadeHighValue, decadeBaseValue, j, decadeBaseValue);
			console.log('y Position for intermediate line '+ j + ' : ' + yPosition);
		}
	}
	return 'done';
}

// takes a value and coverts it to a y position on the chart
Chart.prototype.valueToYPosition = function(hi, lo, value, decadeBaseValue) {
	var decadeRange = hi-lo;
	var y = 10 + decadeRange * (log10(value/decadeBaseValue));
	return y;
}

// draw regularly spaced lines for the number of days in the chart
Chart.prototype.drawYAxis = function() {
	var spacing = this.width/this.numberOfDays;
	// ...
}

// plot historical data on the chart (should call helper methods for plotting data points on each day)
Chart.prototype.drawHistoricalData = function() {

}

Chart.prototype.readPoint = function() {
	// find decade
	// find percent up decade
	// do 10^percent up that decade
	// multiply that by base value in the decade
}

// takes a point on the chart and converts it to a semantic numeric value
Chart.prototype.pointToValue = function(hi, lo, yPosition, decadeBaseValue) {
	var decadeRange = hi - lo;
	var percentAwayFromVBase = (y - lo)/decadeRange;
	var value = decadeBaseValue - pow(10, percentAwayFromVBase);
	return value;
}

// note: for sooming maybe only draw decades

// just a helper to do log10 of numbers (javascript doesn't let you specify the base) of a log normally
function log10(value) {
  return Math.log(value) / Math.LN10;
}
