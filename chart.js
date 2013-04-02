/* Chart Class 
 * ========================================================================= *
*/

function Chart() {
	this.numberOfDays = 140;
	this.minExponent = -3;
	this.maxExponent = 3;
	this.numberOfDecades = Math.abs(this.minExponent) + Math.abs(this.maxExponent);
	this.drawElement = $('#draw'); 
	// to be filled in when chart is drawn. should map exponents/decadeValues to yPositions
	this.init();
}


/* Initialize the chart */
Chart.prototype.init = function() {
	// get dimensions from jquery drawElement
	this.bottomMargin = this.drawElement.height() * 0.05;
	this.topMargin = this.drawElement.height() * 0.05;
	this.chartHeight = this.drawElement.height() - (this.bottomMargin + this.topMargin);
	
	console.log('chartHeight is ' + this.chartHeight);
	
	this.leftMargin = this.drawElement.width() * 0.05;
	this.rightMargin = this.drawElement.width() * 0.05;
	this.chartWidth = this.drawElement.width() - this.leftMargin - this.rightMargin;
	this.labelPadding = this.leftMargin * 0.33;

	// calculate height of a decade in pixels by dividing the chart height by
	// the number of decades
	this.decadeHeight = this.chartHeight * 0.95 / this.numberOfDecades;

	// store dom element
	var drawDOMElement = document.getElementById('draw');

	// create a raphael 'paper' drawing area
	this.paper = new Raphael(drawDOMElement, this.drawElement.width(), this.drawElement.height());

	// draw axes
	this.drawXAxis();
	this.drawYAxis();
};


// draws the lines on the x axis of the chart
Chart.prototype.drawXAxis = function() {
	// for each decade, draw the lines within that decade on the log scale
	var i;

	// these variables define the x positions for the start and end of each line
	var lineStartX = this.leftMargin;
	var lineEndX = this.chartWidth;

	/* a decade is the section between two exponents of ten on the chart. For example, a decade would be from 1-10 or 0.001-0.01. */
	for (i = 0; i < this.numberOfDecades; i++) {
		var decadeBaseValue = Math.pow(10, this.minExponent + i);

		// find the y position for the base value of the decade.
		var decadeNumber = i;
		var decadeBasePosition = this.chartHeight - (decadeNumber * this.decadeHeight);

		var numDigits = 3;
		var lineAttrs = {
			'weight': '1.5',
			'color' : '#0000ff',
			'dataName' : 'value',
			'dataValue' : decadeBaseValue.toFixed(numDigits) + '',
		};
		
		// draw the baseValue line on the chart for this decade
		this.drawHorizontalLine(lineStartX, lineEndX, decadeBasePosition, lineAttrs);
		// writes the number label for the grid line
		this.drawLabel(lineStartX - this.labelPadding, decadeBasePosition, decadeBaseValue);

		// if we're on the last decade, also draw the top line for the decade
		if (decadeNumber === (this.numberOfDecades - 1)) {
		    var topDecadePosition = decadeBasePosition - this.decadeHeight;
		    var topDecadeValue = Math.pow(10, this.minExponent + i + 1);
		    this.drawHorizontalLine(lineStartX, lineEndX, topDecadePosition, lineAttrs);
		    this.drawLabel(lineStartX - this.labelPadding, topDecadePosition, topDecadeValue);
		}

		// draw all the log lines for this decade
		this.drawIntermediateLines(decadeNumber, decadeBaseValue, decadeBasePosition, lineStartX, lineEndX)
	}
	return 'done';
}


// get y positions for and draw lines for values in between the high and the low
Chart.prototype.drawIntermediateLines = function(decadeNumber, decadeBaseValue, decadeBasePosition, lineStartX, lineEndX) {
	var intermediateLineYPosition;
	for (var j = 2; j < 10; j++) {
		// solve equation where value equals two to nine, then multiply by base of the decade
		var lineValue = j * decadeBaseValue;

		intermediateLineYPosition = this.valueToYPosition(decadeBasePosition, lineValue, decadeBaseValue);

		var numDigits = 3;
		
		lineAttrs = {
			'weight': '0.5',
			'color' : '#0000ff',
			'dataName' : 'value',
			'dataValue' : lineValue.toFixed(numDigits) + '',
			'decadeNumber': decadeNumber.toFixed(numDigits) + '',
		};

		this.drawHorizontalLine(lineStartX, lineEndX, intermediateLineYPosition, lineAttrs);

		// only draw labels on the fifth line in the decade (this is just how the chart is designed)
		if (j === 5) {
			this.drawLabel(lineStartX - this.labelPadding, intermediateLineYPosition, lineValue);
		}
	}
}


Chart.prototype.drawLabel = function(x, y, lineValue, textAnchor) {
	var label = this.paper.text(x, y, lineValue);
	label.attr({
		'font-size': 15,
		'fill': '#0000ff'
	});
	// default text align
	var textAlign = textAnchor || 'start';
	label.attr({'text-anchor': textAnchor});
}

// takes a value and coverts it to a y position on the chart
Chart.prototype.valueToYPosition = function(baseLineYPosition, lineValue, decadeBaseValue) {
	var decadeProportion = 1.0 * lineValue/decadeBaseValue;
	var logDecadeProportion = log10(decadeProportion);
	var offsetFromBase = this.decadeHeight * logDecadeProportion;
	var y = baseLineYPosition - offsetFromBase;
	return y;
}


Chart.prototype.drawHorizontalLine = function(x1, x2, y, params) {
	// console.log('drawing horizontal line at ' + y + 'from ' + x1 + ' to ' + x2);
	var deltaY = 0; // zero because we don't want the line to be slanted
	
	var basePath = "M " + x1 + ' ' + y + " l " + x2 + ' ' + deltaY;

	// add the line to the drawing area
	var line = this.paper.path(basePath);

	// get attrs to add to line. set to defaults if they're undefined
	var lineColor = params['color'] || '#000';
	var lineWeight = params['weight'] || '1';
	var dataName = params['dataName'] || '';
 	var dataValue = params['dataValue'] || '';
 	var decadeNumber = params['decadeNumber'] || 'julia says decade number not defined';

	line.attr({"stroke-width": lineWeight,
			   "stroke": lineColor})
		.data(dataName, dataValue)
		.data('decadeNumber', decadeNumber)
        .click(function () {
            alert(this.data(dataName));
         });
}

// draw regularly spaced lines for the number of days in the chart
Chart.prototype.drawYAxis = function() {
	var spacing = this.chartWidth/this.numberOfDays;
	var labelPadding = this.bottomMargin * 0.25;
	var roundingErrorRoom = (this.topMargin * 0.15);
	var lineStartY = this.topMargin - roundingErrorRoom;
	roundingErrorRoom = this.bottomMargin * 0.15;
	var lineEndY = (this.chartHeight - this.bottomMargin) + roundingErrorRoom;
	var startX = this.leftMargin;
	for (var i = 0; i <= this.numberOfDays; i++) {
		//var vpath = "M " + (this.leftMargin + i*spacing) + " 0 l 0 " + (this.paper.height - this.bottomMargin);
		//var line = this.paper.path(vpath); 
		var lineAttrs = {
			'weight': '1',
			'color' : '#0000ff',
			'dataName' : 'value',
			//'dataValue' : decadeBaseValue.toFixed(numDigits) + '',
		};

		var chart = this;
		if (i%14 === 0) {
			this.drawLabel(this.leftMargin + i*spacing, this.chartHeight + labelPadding, i);

			// draw extra-long line
			this.drawVerticalLine(startX + i*spacing, lineStartY, lineEndY + (labelPadding/2), lineAttrs);
		}
		else {
			// draw the baseValue line on the chart for this decade
			this.drawVerticalLine(startX + i*spacing, lineStartY, lineEndY, lineAttrs);
		}

		if (i%7 === 0) {
			//
		}
		/*line.click(function(event){
			var y = chart.chartHeight - event.y;
			console.log(event.y);
			console.log('y is ' + y);
			var value = chart.pointToValue(y);
		})*/
	}
}

Chart.prototype.drawVerticalLine = function(x, y1, y2, params) {
	// console.log('drawing horizontal line at ' + y + 'from ' + x1 + ' to ' + x2);
	var deltaX = 0; // zero because we don't want the line to be slanted
	
	var basePath = "M " + x + ' ' + y1 + " l " + deltaX + ' ' + y2;

	// add the line to the drawing area
	var line = this.paper.path(basePath);

	// get attrs to add to line. set to defaults if they're undefined
	var lineColor = params['color'] || '#000';
	var lineWeight = params['weight'] || '1';
	var dataName = params['dataName'] || '';
 	var dataValue = params['dataValue'] || '';
 	var decadeNumber = params['decadeNumber'] || 'julia says decade number not defined';

	line.attr({"stroke-width": lineWeight,
			   "stroke": lineColor});

	line.click(function(event){
		var y = chart.chartHeight - event.y;
		console.log(event.y);
		console.log('y is ' + y);
		var value = chart.pointToValue(y);
	});
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
Chart.prototype.pointToValue = function(yPosition) {
	// get the base position (we're talking pixels) by using the value to position funciton on the base position
	debugger;
	var decadeNumber = this.findDecade(yPosition);
	var decadeBasePosition = decadeNumber * this.decadeHeight;
	var percentAwayFromVBase = (yPosition - decadeBasePosition)/this.decadeHeight;
	var decadeBaseValue = Math.pow(10, decadeNumber + this.minExponent);
	var value = decadeBaseValue * Math.pow(10, percentAwayFromVBase);
	console.log('value ' + value);
	return value;
}

Chart.prototype.findDecade = function(point) {
	var decadeNumber = Math.floor(point/this.decadeHeight);
	// flip it
	decadeNumber = this.numberOfDecades - decadeNumber;
	return decadeNumber;
}

// note: for sooming maybe only draw decades

// just a helper to do log10 of numbers (javascript doesn't let you specify the base) of a log normally
function log10(value) {
  return Math.log(value) / Math.LN10;
}
