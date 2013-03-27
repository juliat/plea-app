/* Chart Class 
 * ========================================================================= *
*/

function Chart() {
	this.height = 1000px; //temp
	this.width = 1400px; //temp
	this.numberOfDays = 140;
	this.minCountPerMinuteExponent = -3;
	this.maxCountPerMinuteExponent = 3;
	this.chartDiv = $('chart'); 
}

Chart.prototype.drawXAxis = function() {
	// solve equation where value equals two to nine, then multiply by base of the decade
}

// takes a point on the chart and converts it to a semantic numeric value
Chart.prototype.pointToValue = function(hi, lo, yPosition, decadeBaseValue) {
	var decadeRange = hi - lo;
	var percentAwayFromVBase = (y - lo)/decadeRange;
	var value = decadeBaseValue - pow(10, percentAwayFromVBase);
	return value;
}

// takes a value and coverts it to a point for its y position on the chart
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

// maybe only draw decades

// just a helper to do log10 of numbers (javascript doesn't let you specify the base) of a log normally
function log10(value) {
  return Math.log(value) / Math.LN10;
}
