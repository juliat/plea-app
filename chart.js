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

Chart.prototype.drawXAxis = function() {
	// for each decade, draw the lines within that decade on the log scale
	var i;
	for (i = 0; i < this.numberOfDecades; i++) {
		var decadeBaseValue = Math.pow(10, this.minCountPerMinuteExponent + i);
		var decadeHighValue = Math.pow(10, this.minCountPerMinuteExponent + i + 1);
		var decadeHeight = this.chartElement.height() / this.numberOfDecades;
		// draw lines for the decade high value and the decade low value
		// [call line drawing function here]
		console.log('decade base value for decade ' + i + ' is ' + decadeBaseValue);
		console.log('decade high value for decade ' + i + ' is ' + decadeHighValue);

		// draw the guide for the base value
		var baseLine = this.paper.height - this.valueToYPosition(decadeHeight, 1, decadeBaseValue);
		var basePath = "M 0 " + baseLine + " l " + this.paper.width + " 0";
		var drawBaseLine = this.paper.path(basePath);

		// draw the guide for the high value
		var highLine = this.paper.height - this.valueToYPosition(decadeHeight, 10, decadeBaseValue);
		var highPath = "M 0 " + highLine + " l " + this.paper.width + " 10";
		var drawHighLine = this.paper.path(highPath);
		console.log(highLine);

		// get y positions for and draw lines for values in between the high and the low
		var yPosition;
		for (var j = 2; j < 10; j++) {
			// solve equation where value equals two to nine, then multiply by base of the decade
			//I'm confused
			yPosition = this.paper.height - this.valueToYPosition(decadeHeight, j, decadeBaseValue);
			console.log('y Position for intermediate line '+ j + ' : ' + yPosition);
			//draw each horizontal line
			var hpath = "M 0 " + yPosition + " l " + this.paper.width + " 0";
			var drawHLine = this.paper.path(hpath);
		}
	}

	return 'done';
}

// takes a value and coverts it to a y position on the chart
Chart.prototype.valueToYPosition = function(decadeHeight, lineValue, decadeBaseValue) {
	//Multiply decadeBaseValue by 100 to avoid negative exponents
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
