/* Chart Class 
 * ========================================================================= *
*/

function Chart() {
	this.numberOfDays = 140;
	this.minCountPerMinuteExponent = -3;
	this.maxCountPerMinuteExponent = 3;
	this.numberOfDecades = Math.abs(this.minCountPerMinuteExponent) + Math.abs(this.maxCountPerMinuteExponent);
	this.chartElement = $('#chart'); 
	this.init();
}

/* Setup a new Kinetic.js Stage (which can contain multiple HTML5 canvases) */
Chart.prototype.init = function() {
	this.paper = new Raphael(document.getElementById('chart'), 800, 800);
};

// draws the lines on the x axis of the chart
Chart.prototype.drawXAxis = function() {
	// for each decade, draw the lines within that decade on the log scale
	var i;

	// these variables define the x positions for the start and end of each line
	var lineStartX = 0;
	var lineEndX = this.paper.width;

	/* a decade is the section between two exponents of ten on the chart. For example,
	 * a decade would be from 1-10 or 0.001-0.01.
	 */
	for (i = 0; i < this.numberOfDecades; i++) {
		var decadeBaseValue = Math.pow(10, this.minCountPerMinuteExponent + i);
		var decadeHighValue = Math.pow(10, this.minCountPerMinuteExponent + i + 1);

		// calculate height of a decade in pixels by dividing the chart height by
		// the number of decades
		var decadeHeight = this.chartElement.height() / this.numberOfDecades;
		
		// just logging to check the values
		console.log('decade base value for decade ' + i + ' is ' + decadeBaseValue);
		console.log('decade high value for decade ' + i + ' is ' + decadeHighValue);

		// find the position for the base value of the decade. In the 1-10 decade, this value would be 1
		// we pass in the base value twice because the valueToYPosition always requires the decadeBaseValue
		var baseLineYPosition = this.paper.height - this.valueToYPosition(decadeHeight, decadeBaseValue, decadeBaseValue);
		
		// draw the baseValue line on the chart for this decade
		/* syntax (case-sensitive) for drawing a line in raphael is: 
		M = move to start point
		l = draw a line relative to this point
		*/
		var deltaY = 0; // zero because we don't want the line to be slanted
		var basePath = "M " + lineStartX + ' ' + baseLineYPosition + " l " + lineEndX + ' ' + deltaY;
		var drawBaseLine = this.paper.path(basePath);

		// draw the guide for the high value
		var highLineYPosition = this.paper.height - this.valueToYPosition(decadeHeight, decadeBaseValue, decadeBaseValue);
		var highPath = "M " + lineStartX + " " + highLineYPosition + " l " + lineEndX + " " + deltaY;
		var drawHighLine = this.paper.path(highPath);
		console.log(highLineYPosition);

		// get y positions for and draw lines for values in between the high and the low
		var intermediateLineYPosition;
		for (var j = 2; j < 10; j++) {
			// solve equation where value equals two to nine, then multiply by base of the decade
			intermediateLineYPosition = this.paper.height - this.valueToYPosition(decadeHeight, j, decadeBaseValue);
			console.log('y Position for intermediate line '+ j + ' : ' + intermediateLineYPosition);
			//draw each horizontal line
			var hpath = "M " + lineStartX + " " + intermediateLineYPosition + " l " + lineEndX + " " + deltaY;
			var drawHLine = this.paper.path(hpath);
		}
	}

	return 'done';
}

// takes a value and coverts it to a y position on the chart
Chart.prototype.valueToYPosition = function(decadeHeight, lineValue, decadeBaseValue) {
	// Multiply decadeBaseValue by 100 to avoid negative exponents
	var y = 10 + decadeHeight * (log10(lineValue/decadeBaseValue*100));
	return y;
}

// draw regularly spaced lines for the number of days in the chart
Chart.prototype.drawYAxis = function() {
	var spacing = this.paper.width/this.numberOfDays;
	console.log(spacing);
	for (var i = 0; i < this.numberOfDays; i++) {
		var vpath = "M " + i*spacing + " 0 l 0 " + this.paper.height;
		var drawVLine = this.paper.path(vpath); 
	}
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
Chart.prototype.pointToValue = function(decadeHeight, yPosition, decadeBaseValue) {
	// get the base position (we're talking pixels) by using the value to position funciton on the base position
	var decadeBasePosition = this.valueToYPosition(decadeHeight, decadeBaseValue, decadeBaseValue);
	var percentAwayFromVBase = (y - decadeBasePosition)/decadeHeight;
	var value = decadeBaseValue - pow(10, percentAwayFromVBase);
	return value;
}

// note: for sooming maybe only draw decades

// just a helper to do log10 of numbers (javascript doesn't let you specify the base) of a log normally
function log10(value) {
  return Math.log(value) / Math.LN10;
}
