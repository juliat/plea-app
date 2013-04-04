/* Chart Class 
 * ========================================================================= *
*/

window.onload = function(){
	var chart = new Chart();
}

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
	// initialize width and height of chart based on window size
	var width = $(window).width() - 25;
	var height = $(window).height() - 25;
	$("#draw").width(width);
	$("#draw").height(height);

	// initialize 'draw' div as hammer touch area
	this.hammertime = $("#draw").hammer();
	/*hammertime.on("tap", function(e) {
		console.log("you have tapped!");
	});*/

	// define active day
	this.activeDay = 18;

	// get dimensions from jquery drawElement
	this.bottomMargin = this.drawElement.height() * 0.1;
	this.topMargin = this.drawElement.height() * 0.05;
	
	this.leftMargin = this.drawElement.width() * 0.05;
	this.rightMargin = this.drawElement.width() * 0.05;
	this.chartWidth = this.drawElement.width() - (this.leftMargin + this.rightMargin);
	
	this.labelPadding = this.leftMargin * 0.15;

	this.chartHeight = this.drawElement.height() - (this.bottomMargin + this.topMargin);
	

	// define length of tickers
	this.intermediateTickerLength = 5;
	this.baseTickerLength = 8;

	console.log('chartHeight is ' + this.chartHeight);

	// calculate height of a decade in pixels by dividing the chart height by
	// the number of decades
	this.decadeHeight = this.chartHeight / this.numberOfDecades;

	// store dom element
	var drawDOMElement = document.getElementById('draw');

	var chart = this;
	// create a raphael 'paper' drawing area
	this.paper = new Raphael(drawDOMElement, this.drawElement.width(), this.drawElement.height());
	this.rectangle = this.paper.rect(0, 0, this.drawElement.width(), this.drawElement.height());  
	this.rectangle.attr({
		'fill' : '#fff',
		'stroke' : '#fff'
	});
	this.rectangle.click(function(e){ 
		console.log('rectangle ' + e.y);
		var value = chart.pointToValue(e.y);
		console.log(value);
	});
	
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
	var chartBottomY = this.topMargin + this.chartHeight;
	var tickerStartX;
	var tickerEndX;

	/* a decade is the section between two exponents of ten on the chart. For example, a decade would be from 1-10 or 0.001-0.01. */
	for (i = 0; i < this.numberOfDecades; i++) {
		var decadeBaseValue = Math.pow(10, this.minExponent + i);

		// find the y position for the base value of the decade.
		var decadeNumber = i;
		var decadeBasePosition = chartBottomY - (decadeNumber * this.decadeHeight);

		var numDigits = 3;
		var lineAttrs = {
			'weight': '1',
			'color' : '#A6C5D3',
			'dataName' : 'value',
			'dataValue' : decadeBaseValue.toFixed(numDigits) + '',
		};
		
		var labelAttr = {
			'text-anchor': 'end',
		}
		// draw the baseValue line on the chart for this decade
		this.drawHorizontalLine(lineStartX, lineEndX, decadeBasePosition, lineAttrs);
		// writes the number label for the grid line
		this.drawLabel(lineStartX - this.labelPadding, decadeBasePosition, decadeBaseValue, labelAttr);
		// draw ticker on baseValue line
		tickerStartX = lineStartX - this.baseTickerLength;
		tickerEndX = lineStartX;
		this.drawHorizontalLine(tickerStartX, tickerEndX, decadeBasePosition, lineAttrs);

		// if we're on the last decade, also draw the top line and ticker for the decade
		if (decadeNumber === (this.numberOfDecades - 1)) {
		    var topDecadePosition = decadeBasePosition - this.decadeHeight;
		    var topDecadeValue = Math.pow(10, this.minExponent + i + 1);
		    this.drawHorizontalLine(lineStartX, lineEndX, topDecadePosition, lineAttrs);
		    this.drawHorizontalLine(tickerStartX, tickerEndX, topDecadePosition, lineAttrs);
		    this.drawLabel(lineStartX - this.labelPadding, topDecadePosition, topDecadeValue, labelAttr);
		}

		// draw all the log lines for this decade
		this.drawIntermediateLines(decadeNumber, decadeBaseValue, decadeBasePosition, lineStartX, lineEndX)
	}
	return 'done';
}


// get y positions for and draw lines for values in between the high and the low
Chart.prototype.drawIntermediateLines = function(decadeNumber, decadeBaseValue, decadeBasePosition, lineStartX, lineEndX) {
	var intermediateLineYPosition;
	var tickerStartX;
	var tickerEndX;
	for (var j = 2; j < 10; j++) {
		// solve equation where value equals two to nine, then multiply by base of the decade
		var lineValue = j * decadeBaseValue;
		intermediateLineYPosition = this.valueToYPosition(decadeBasePosition, lineValue, decadeBaseValue);

		var numDigits = 3;
		
		lineAttrs = {
			'weight': '0.4',
			'color' : '#A6C5D3',
			'dataName' : 'value',
			'dataValue' : lineValue.toFixed(numDigits) + '',
			'decadeNumber': decadeNumber.toFixed(numDigits) + '',
		};

		// only draw labels on the fifth line in the decade (this is just how the chart is designed)
		if (j === 5) {
			var labelAttr = {
				'font-size': 10,
				'text-anchor': 'end'
			}
			this.drawLabel(lineStartX - this.labelPadding, intermediateLineYPosition, lineValue, labelAttr);

			//draw ticker on intermediate lines
			lineAttrs.weight = '0.6';
			tickerStartX = lineStartX - this.intermediateTickerLength;
			tickerEndX = lineStartX;
			this.drawHorizontalLine(tickerStartX, tickerEndX, intermediateLineYPosition, lineAttrs);
		}

		this.drawHorizontalLine(lineStartX, lineEndX, intermediateLineYPosition, lineAttrs);
	}
}


Chart.prototype.drawLabel = function(x, y, lineValue, labelAttr) {
	var label = this.paper.text(x, y, lineValue);

	// default attributes for label
	var textAlign = labelAttr['text-anchor'] || 'start';
	var fontSize = labelAttr['font-size'] || 15;
	var fontColor = labelAttr['color'] || '#A6C5D3';

	label.attr({
		'font-size': fontSize,
		'fill': fontColor,
		'text-anchor': textAlign
	});
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
            //alert(this.data(dataName));
         });
}

// draw regularly spaced lines for the number of days in the chart
Chart.prototype.drawYAxis = function() {
	var spacing = this.chartWidth/this.numberOfDays;

	var lineStartY = this.topMargin; // - roundingErrorRoom;
	var lineEndY = lineStartY + this.chartHeight;

	var startX = this.leftMargin;
	var labelAttr;
	var lineAttrs;

	for (var i = 0; i <= this.numberOfDays; i++) {
		lineAttrs = {
			'weight': '0.4',
			'color' : '#A6C5D3',
			'dataName' : 'value'
			//'dataValue' : decadeBaseValue.toFixed(numDigits) + '',
		};

		labelAttr = {
			'font-size': 15,
			'color': '#A6C5D3',
			'text-anchor': 'middle'
		}

		//draw the blue line representing today's line
		if (i === this.activeDay) {
			lineAttrs.weight = '1';
			lineAttrs.color = '#0000FF';
			labelAttr = {
				'font-size': 8,
				'color': '#0000FF',
				'text-anchor': 'middle'
			}
			this.drawLabel(startX + i*spacing, lineStartY - this.labelPadding, 'TODAY', labelAttr);
			this.drawVerticalLine(startX + i*spacing, lineStartY, lineEndY, lineAttrs, true, i);
		}

		else {
			if (i%7 === 0) {
				lineAttrs.weight = '1';
				// draw extra-long line
				if (i%14 === 0) {
					this.drawLabel(startX + i*spacing, lineEndY + this.labelPadding, i, labelAttr);
					// draw extra-long line
					boldLineStartY = lineStartY - this.baseTickerLength;
					boldLineEndY = lineEndY + this.baseTickerLength;
					this.drawVerticalLine(startX + i*spacing, boldLineStartY, boldLineEndY, lineAttrs);
				}
				else {
					this.drawVerticalLine(startX + i*spacing, lineStartY, lineEndY, lineAttrs);
				}
			}

			else {
				// draw the baseValue line on the chart for this decade
				this.drawVerticalLine(startX + i*spacing, lineStartY, lineEndY, lineAttrs);
			}
		}
	}
}

Chart.prototype.drawVerticalLine = function(x, y1, y2, params, activeState, day) {
	// console.log('drawing horizontal line at ' + y + 'from ' + x1 + ' to ' + x2);
	var deltaX = 0; // zero because we don't want the line to be slanted
	
	var deltaY = y2 - y1;

	var basePath = "M " + x + ' ' + y1 + " l " + deltaX + ' ' + deltaY;

	var isActive = activeState || false;

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

	/*line.click(function(event){
		var y = (chart.chartHeight + chart.topMargin) - event.y;
		console.log(event.y);
		console.log('y from the bottom is ' + y);
		var value = chart.pointToValue(y);
		// drawpoint
	});*/

	// for drawing points where people touch on the chart
	if (isActive) {
		var chart = this;/*
		line.touchend(function(event){*/
		chart.hammertime.on("tap", function(e) {
			// draw point on active day line
			var chartBottomY = chart.chartHeight + chart.topMargin;
			var y = chartBottomY - event.y;
			var value = chart.pointToValue(y);
			var roundingFactor;
			if (value >= 0 && value < 0.01) roundingFactor = 1000; 
			if (value >= 0.01 && value < 0.1) roundingFactor = 100;
			if (value >= .1 && value < 1) roundingFactor = 10;
			if (value >= 1 && value < 10) roundingFactor = 1;
			if (value >= 10 && value < 100) roundingFactor = .1;
			if (value >= 100 && value < 1000) roundingFactor = .01;

			var roundedValue = Math.round(value*roundingFactor) / roundingFactor;

			// converting back from value to chart y-coordinate
			var decadeNumber = chart.findDecade(y);
			var decadeBasePosition = chartBottomY - (decadeNumber * chart.decadeHeight);
			var decadeBaseValue = Math.pow(10, decadeNumber + chart.minExponent);
			var objectY = chart.valueToYPosition(decadeBasePosition, roundedValue, decadeBaseValue);

			var objectX = chart.dayToXPosition(day);
			var circleRadius = 2;
			// draw circle
			var circle = chart.paper.circle(objectX,objectY, circleRadius);
			circle.attr("fill", "black");

		});
	}
}

// converts a day (in int form, between 0 and 140 and 
// returns the x coordinate of that day line on the chart)
Chart.prototype.dayToXPosition = function(day) {
	if ((day < 0) || (day > this.numberOfDays)) {
		return 'day out of range';
	}
	// compute based on margins and spacing. add variables from the drawYaxis function to the
	// chart object if need be
	else {
		var startX = this.leftMargin;
		var spacing = this.chartWidth/this.numberOfDays;
		var xValue = startX + day*spacing;
		return xValue;
	}
}

// plot historical data on the chart (should call helper methods for plotting data points on each day)
Chart.prototype.drawHistoricalData = function() {

}

// should take in a day as an int between 0 and 140 and use that to determine where to draw the point vertically
Chart.prototype.drawValue = function(day, value) {
	var cx = day;
	var cy = this.valueToYPosition(value);
	var radius = 1; //default
	var circle = paper.circle(cx, cy, radius);
}


// takes a point on the chart and converts it to a semantic numeric value
Chart.prototype.pointToValue = function(yPosition) {
	// get the base position (we're talking pixels) by using the value to position funciton on the base position
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
	return decadeNumber;
}

// note: for sooming maybe only draw decades

// just a helper to do log10 of numbers (javascript doesn't let you specify the base) of a log normally
function log10(value) {
  return Math.log(value) / Math.LN10;
}
