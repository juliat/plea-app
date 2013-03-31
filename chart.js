/* Chart Class 
 * ========================================================================= *
*/

function Chart() {
	this.numberOfDays = 140;
	this.minExponent = -3;
	this.maxExponent = 3;
	this.numberOfDecades = Math.abs(this.minExponent) + Math.abs(this.maxExponent);
	this.chartElement = $('#chart'); 
	this.init();
}

/* Setup a new Kinetic.js Stage (which can contain multiple HTML5 canvases) */
Chart.prototype.init = function() {
	var chartHeight = this.chartElement.height();
	var chartWidth = this.chartElement.width() * 0.9;
	this.leftMargin = this.chartElement.width() * 0.1;
	var chartDOMElement = document.getElementById('chart');
	this.paper = new Raphael(chartDOMElement, chartWidth, chartHeight);
};

// draws the lines on the x axis of the chart
Chart.prototype.drawXAxis = function() {
	// for each decade, draw the lines within that decade on the log scale
	var i;

	// these variables define the x positions for the start and end of each line
	var lineStartX = this.leftMargin;
	var lineEndX = this.paper.width;

	// calculate height of a decade in pixels by dividing the chart height by
	// the number of decades
	var decadeHeight = this.chartElement.height() / this.numberOfDecades;

	/* a decade is the section between two exponents of ten on the chart. For example, a decade would be from 1-10 or 0.001-0.01. */
	for (i = 0; i < this.numberOfDecades; i++) {
		var decadeBaseValue = Math.pow(10, this.minExponent + i);

		// find the y position for the base value of the decade.
		var decadeNumber = this.numberOfDecades - i;
		var baseLineYPosition = (decadeNumber*decadeHeight);

		var lineAttrs = {
			'weight': '1.5',
			'color' : '#0000ff',
			'dataName' : 'value',
			'dataValue' : decadeBaseValue.toFixed(numDigits) + '',
		};
		
		// draw the baseValue line on the chart for this decade
		this.drawHorizontalLine(lineStartX, lineEndX, baseLineYPosition, lineAttrs);
		
		// get y positions for and draw lines for values in between the high and the low
		var intermediateLineYPosition;
		for (var j = 2; j < 10; j++) {
			// solve equation where value equals two to nine, then multiply by base of the decade
			lineValue = j * decadeBaseValue;

			intermediateLineYPosition = this.paper.height - this.valueToYPosition(baseLineYPosition, decadeHeight, lineValue, decadeBaseValue);

			var numDigits = 3;
			lineAttrs = {
				'weight': '0.5',
				'color' : '#0000ff',
				'dataName' : 'value',
				'dataValue' : lineValue.toFixed(numDigits) + '',
				'decadeNumber': decadeNumber
			};

			this.drawHorizontalLine(lineStartX, lineEndX, intermediateLineYPosition, lineAttrs);

			this.paper.text(lineStartX - 20, intermediateLineYPosition, j * decadeBaseValue)
		}
	}
	return 'done';
}


Chart.prototype.drawLabel = function(x, y, lineValue) {
	this.paper.text(x, y, lineValue);
}

// takes a value and coverts it to a y position on the chart
Chart.prototype.valueToYPosition = function(baseLineYPosition, decadeHeight, lineValue, decadeBaseValue) {
	
	var decadeProportion = 1.0 * lineValue/decadeBaseValue;
	var logDecadeProportion = log10(decadeProportion);
	var offsetFromBase = decadeHeight * logDecadeProportion;
	var y = baseLineYPosition + offsetFromBase;

	return y;
}

Chart.prototype.drawHorizontalLine = function(x1, x2, y, params) {
	// console.log('drawing horizontal line at ' + y + 'from ' + x1 + ' to ' + x2);
	var deltaY = 0; // zero because we don't want the line to be slanted
	
	var basePath = "M " + x1 + ' ' + y + " l " + x2 + ' ' + deltaY;

	// debugger;
	// add the line to the drawing area
	var line = this.paper.path(basePath);

	// get attrs to add to line. set to defaults if they're undefined
	console.log(params);
	var lineColor = params['color'] || '#000';
	var lineWeight = params['weight'] || '1';
	var dataName = params['dataName'] || '';
 	var dataValue = params['dataValue'] || '';
 	var decadeNumber = params['decadeNumber'] || 'decade number not defined';

	line.attr({"stroke-width": lineWeight,
			   "stroke": lineColor})
		.data({dataName: dataValue,
			   'decadeNumber' : decadeNumber,
		})
        .click(function () {
            alert(this.data(dataName));
         });
}

// draw regularly spaced lines for the number of days in the chart
Chart.prototype.drawYAxis = function() {
	var spacing = this.paper.width/this.numberOfDays;
	for (var i = 0; i < this.numberOfDays; i++) {
		var vpath = "M " + (this.leftMargin + i*spacing) + " 0 l 0 " + this.paper.height;
		var drawVLine = this.paper.path(vpath); 
	}
}

// plot historical data on the chart (should call helper methods for plotting data points on each day)
Chart.prototype.drawHistoricalData = function() {

}

// takes a point on the chart and converts it to a semantic numeric value
Chart.prototype.pointToValue = function(decadeHeight, yPosition, decadeBaseValue) {
	// get the base position (we're talking pixels) by using the value to position funciton on the base position
	var decadeBasePosition = this.valueToYPosition(decadeHeight, decadeBaseValue, decadeBaseValue);
	var percentAwayFromVBase = (y - decadeBasePosition)/decadeHeight;
	var value = decadeBaseValue - pow(10, percentAwayFromVBase);
	return value;
}

Chart.prototype.readPoint = function() {
	// find decade
	// find percent up decade
	// do 10^percent up that decade
	// multiply that by base value in the decade
}

// note: for sooming maybe only draw decades

// just a helper to do log10 of numbers (javascript doesn't let you specify the base) of a log normally
function log10(value) {
  return Math.log(value) / Math.LN10;
}
