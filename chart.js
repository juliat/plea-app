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
	// init adjustment div
	this.adjustmentsInit();
}

Chart.prototype.adjustmentsInit = function() {
	var chart = this;
	var chartBottomY = chart.topMargin + chart.chartHeight;
	var decadeNumber;
	var decadeBasePosition;
	var decadeBaseValue;
	var objectY; // Q: what is an object in this context? is an object a point?
	var objectX = chart.dayToXPosition(chart.activeDay);
	var objectRadius = 3;
	$('#adjustments').height($(window).height());

	// bind click events to the adjustment buttons
	$('.add').bind('click', function(e){
		var numberPlusOne = parseInt($(this).prev().html()) + 1;
		$(this).prev().html(numberPlusOne);
		var label = $(this).attr('id');

		// There's a cleaner way to do this using a case statement, or you can break it up into different functions
		// if you increment correct
		if (label === "add-correct") {
			// only do something if a circle is in the set, circle is in position index 2 in aray
			if (chart.set.length >= 3) {
				decadeNumber = 3;
				decadeBasePosition = chartBottomY - (decadeNumber * chart.decadeHeight);
				decadeBaseValue = Math.pow(10, decadeNumber + chart.minExponent);
				console.log('decade base value is ' + decadeBaseValue);
				console.log('decade base position is ' + decadeBasePosition);
				console.log('decade number is ' + decadeNumber);
				objectY = chart.valueToYPosition(decadeBasePosition, numberPlusOne * decadeBaseValue, decadeBaseValue);
				console.log('y position is ' + objectY);
				newCircle = chart.paper.circle(objectX, objectY, objectRadius);
				newCircle.attr({
					'fill-opacity': 1,
					'fill': '#000'
				})
				chart.set[2].remove();
				chart.set[2] = newCircle;
			}
		}

		if (label === "add-floor") {
			// only do something if a floor is in the set, floor is in position index 0 in aray
			if (chart.set.length >= 1) {
				decadeNumber = 3;
				decadeBasePosition = chartBottomY - (decadeNumber * chart.decadeHeight);
				decadeBaseValue = Math.pow(10, decadeNumber + chart.minExponent);
				console.log('decade base value is ' + decadeBaseValue);
				console.log('decade base position is ' + decadeBasePosition);
				console.log('decade number is ' + decadeNumber);
				objectY = chart.valueToYPosition(decadeBasePosition, numberPlusOne * decadeBaseValue, decadeBaseValue);
				console.log('y position is ' + objectY);
				floorPath = "M " + (objectX - objectRadius) + ' ' + objectY + " l " + (2*objectRadius) + ' 0';
				floor = chart.paper.path(floorPath);
				floor.attr({
					"stroke-width": "1",
					"stroke": "#000000"
				});
				chart.set[0].remove();
				chart.set[0] = floor;
			}
		}

		if (label === "add-error") {
			if (chart.set.length >= 4) {
				decadeNumber = 3;
				decadeBasePosition = chartBottomY - (decadeNumber * chart.decadeHeight);
				decadeBaseValue = Math.pow(10, decadeNumber + chart.minExponent);
				console.log('decade base value is ' + decadeBaseValue);
				console.log('decade base position is ' + decadeBasePosition);
				console.log('decade number is ' + decadeNumber);
				objectY = chart.valueToYPosition(decadeBasePosition, numberPlusOne * decadeBaseValue, decadeBaseValue);
				console.log('y position is ' + objectY);
				var mistakesPathOne = "M " + (objectX - objectRadius)+ ' ' + (objectY - objectRadius) + " l " + (2*objectRadius) +' ' + (2*objectRadius);
				var mistakesPathTwo = "M " + (objectX - objectRadius)+ ' ' + (objectY + objectRadius) + " l " + (2*objectRadius) +' ' + (-2*objectRadius);
				var mistakeLineOne = chart.paper.path(mistakesPathOne);
				var mistakeLineTwo = chart.paper.path(mistakesPathTwo);
				mistakeLineOne.attr({
					"stroke-width": "1",
					"stroke": "#000000"
				});
				mistakeLineTwo.attr({
					"stroke-width": "1",
					"stroke": "#000000"
				});
				chart.set[3].remove();
				chart.set[4].remove();
				chart.set[3] = mistakeLineOne;
				chart.set[4] = mistakeLineTwo;
			}
		}

		if (label === "add-trial") {
			if (chart.set.length >= 2) {
				decadeNumber = 0;
				decadeBasePosition = chartBottomY - (decadeNumber * chart.decadeHeight);
				decadeBaseValue = Math.pow(10, decadeNumber + chart.minExponent);
				console.log('decade base value is ' + decadeBaseValue);
				console.log('decade base position is ' + decadeBasePosition);
				console.log('decade number is ' + decadeNumber);
				objectY = chart.valueToYPosition(decadeBasePosition, numberPlusOne * decadeBaseValue, decadeBaseValue);
				console.log('y position is ' + objectY);
				var blankCircle = chart.paper.circle(objectX, objectY, objectRadius);	
				blankCircle.attr({'fill-opacity': 0});
				chart.set[1].remove();
				chart.set[1] = blankCircle;
			}
		}

	});
	$('.subtract').bind('click', function(e){
		var numberMinusOne = parseInt($(this).next().html()) - 1;
		$(this).next().html(numberMinusOne);
		var label = $(this).attr('id');

		if (label === "sub-correct") {
			// only do something if a circle is in the set, circle is in position index 2 in aray
			if (chart.set.length >= 3) {
				decadeNumber = 3;
				decadeBasePosition = chartBottomY - (decadeNumber * chart.decadeHeight);
				decadeBaseValue = Math.pow(10, decadeNumber + chart.minExponent);
				objectY = chart.valueToYPosition(decadeBasePosition, numberMinusOne * decadeBaseValue, decadeBaseValue);
				newCircle = chart.paper.circle(objectX, objectY, objectRadius);
				newCircle.attr({
					'fill-opacity': 1,
					'fill': '#000'
				})
				chart.set[2].remove();
				chart.set[2] = newCircle;
			}
		}

		if (label === "sub-floor") {
			// only do something if a floor is in the set, floor is in position index 0 in aray
			if (chart.set.length >= 1) {
				decadeNumber = 3;
				decadeBasePosition = chartBottomY - (decadeNumber * chart.decadeHeight);
				decadeBaseValue = Math.pow(10, decadeNumber + chart.minExponent);
				objectY = chart.valueToYPosition(decadeBasePosition, numberMinusOne * decadeBaseValue, decadeBaseValue);
				floorPath = "M " + (objectX - objectRadius) + ' ' + objectY + " l " + (2*objectRadius) + ' 0';
				floor = chart.paper.path(floorPath);
				floor.attr({
					"stroke-width": "1",
					"stroke": "#000000"
				});
				chart.set[0].remove();
				chart.set[0] = floor;
			}
		}

		if (label === "sub-error") {
			if (chart.set.length >= 4) {
				decadeNumber = 3;
				decadeBasePosition = chartBottomY - (decadeNumber * chart.decadeHeight);
				decadeBaseValue = Math.pow(10, decadeNumber + chart.minExponent);
				objectY = chart.valueToYPosition(decadeBasePosition, numberMinusOne * decadeBaseValue, decadeBaseValue);
				var mistakesPathOne = "M " + (objectX - objectRadius)+ ' ' + (objectY - objectRadius) + " l " + (2*objectRadius) +' ' + (2*objectRadius);
				var mistakesPathTwo = "M " + (objectX - objectRadius)+ ' ' + (objectY + objectRadius) + " l " + (2*objectRadius) +' ' + (-2*objectRadius);
				var mistakeLineOne = chart.paper.path(mistakesPathOne);
				var mistakeLineTwo = chart.paper.path(mistakesPathTwo);
				mistakeLineOne.attr({
					"stroke-width": "1",
					"stroke": "#000000"
				});
				mistakeLineTwo.attr({
					"stroke-width": "1",
					"stroke": "#000000"
				});
				chart.set[3].remove();
				chart.set[4].remove();
				chart.set[3] = mistakeLineOne;
				chart.set[4] = mistakeLineTwo;
			}
		}

		if (label === "sub-trial") {
			if (chart.set.length >= 2) {
				decadeNumber = 0;
				decadeBasePosition = chartBottomY - (decadeNumber * chart.decadeHeight);
				decadeBaseValue = Math.pow(10, decadeNumber + chart.minExponent);
				objectY = chart.valueToYPosition(decadeBasePosition, numberMinusOne * decadeBaseValue, decadeBaseValue);
				var blankCircle = chart.paper.circle(objectX, objectY, objectRadius);	
				blankCircle.attr({'fill-opacity': 0});
				chart.set[1].remove();
				chart.set[1] = blankCircle;
			}
		}
	});	
}

/* Initialize the chart */
Chart.prototype.init = function() {
	// initialize width and height of chart based on window size
	var width = $(window).width();
	var height = $(window).height();
	$("#draw").width(width);
	$("#draw").height(height);

	// initialize 'draw' div as hammer touch area
	this.hammertime = $("#draw").hammer();

	// define active day, just put in 18 for now
	this.activeDay = 18;

	// get dimensions from jquery drawElement to define chart height, width and margins
	this.bottomMargin = this.drawElement.height() * 0.1;
	this.topMargin = this.drawElement.height() * 0.05;

	this.leftMargin = this.drawElement.width() * 0.05;
	this.rightMargin = this.drawElement.width() * 0.05;

	this.chartWidth = this.drawElement.width() - (this.leftMargin + this.rightMargin);
	this.chartHeight = this.drawElement.height() - (this.bottomMargin + this.topMargin);

	// set padding for number labels on chart
	this.labelPadding = this.leftMargin * 0.15;	

	// set tick lengths
	this.baseTickLength = 8;
	this.intermediateTickLength = 5;

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

	// a decade is the section between two exponents of ten on the chart. 
	// For example, a decade would be from 1-10 or 0.001-0.01.
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
		this.drawHorizontalLine(lineStartX - this.baseTickLength, lineEndX + this.baseTickLength, decadeBasePosition, lineAttrs);
		// writes the number label for the grid line
		this.drawLabel(lineStartX - this.labelPadding, decadeBasePosition, decadeBaseValue, labelAttr);

		// if we're on the last decade, also draw the top line and ticker for the decade
		if (decadeNumber === (this.numberOfDecades - 1)) {
		    var topDecadePosition = decadeBasePosition - this.decadeHeight;
		    var topDecadeValue = Math.pow(10, this.minExponent + i + 1);
		    this.drawHorizontalLine(lineStartX - this.baseTickLength, lineEndX + this.baseTickLength, topDecadePosition, lineAttrs);
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

		// only draw line with ticks and labels on the fifth line in the decade 
		// (this is just how the chart is designed)
		if (j === 5) {
			var labelAttr = {
				'font-size': 10,
				'text-anchor': 'end'
			}
			this.drawLabel(lineStartX - this.labelPadding, intermediateLineYPosition, lineValue, labelAttr);
			this.drawHorizontalLine(lineStartX - this.intermediateTickLength, lineEndX + this.intermediateTickLength, intermediateLineYPosition, lineAttrs);
		}

		else {
			this.drawHorizontalLine(lineStartX, lineEndX, intermediateLineYPosition, lineAttrs);
		}
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

		// draw the blue line representing today's line
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

		// draw the rest of the vertical lines
		else {
			// every 7th and 14th vertical line are bolded
			if (i%7 === 0) {
				lineAttrs.weight = '1';
				// include tickmarks and labels on the 14th line
				if (i%14 === 0) {
					var vertLabelPadding = this.labelPadding + 10;
					this.drawLabel(startX + i*spacing, lineEndY + vertLabelPadding, i, labelAttr);
					this.drawVerticalLine(startX + i*spacing, lineStartY - this.baseTickLength, lineEndY + this.baseTickLength, lineAttrs);
				}
				else {
					this.drawVerticalLine(startX + i*spacing, lineStartY, lineEndY, lineAttrs);
				}
			}
			// draw normal vertical lines
			else {
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
 	var decadeNumber = params['decadeNumber'] || 'not defined';

	line.attr({"stroke-width": lineWeight,
			   "stroke": lineColor});

	if (isActive) {
		this.createTouchEvents(line, day);
	}
}

// function that draws points on the 'today' line when there is a touch input
Chart.prototype.createTouchEvents = function(line, day) {
	// creates an array to store touch events
	this.set = this.paper.set();

	var chart = this;
	chart.hammertime.on("tap", function(e) {
		// draw point on active day line
		var chartBottomY = chart.chartHeight + chart.topMargin;
		var y = chartBottomY - event.y;
		var value = chart.pointToValue(y);
		// create a rounding factor to snap touch event to nearest horizontal line coordinate
		var roundingFactor;
		if (value >= 0 && value < 0.01) roundingFactor = 1000; 
		if (value >= 0.01 && value < 0.1) roundingFactor = 100;
		if (value >= .1 && value < 1) roundingFactor = 10;
		if (value >= 1 && value < 10) roundingFactor = 1;
		if (value >= 10 && value < 100) roundingFactor = .1;
		if (value >= 100 && value < 1000) roundingFactor = .01;
		var roundedValue = Math.round(value*roundingFactor) / roundingFactor;
		

		// converting back from value to y-coordinate
		var decadeNumber = chart.findDecade(y);
		var decadeBasePosition = chartBottomY - (decadeNumber * chart.decadeHeight);
		var decadeBaseValue = Math.pow(10, decadeNumber + chart.minExponent);
		var snapObjectY = chart.valueToYPosition(decadeBasePosition, roundedValue, decadeBaseValue);
		var objectY = chart.valueToYPosition(decadeBasePosition, value, decadeBaseValue);

		var objectX = chart.dayToXPosition(day);
		var objectRadius = 3;

		// draw floor, floor must snap to grid
		if (chart.set.length === 0) {
			var floorPath = "M " + (objectX - objectRadius) + ' ' + (snapObjectY) + " l " + (2*objectRadius) + ' 0';
			var floor = chart.paper.path(floorPath);
			floor.attr({
				"stroke-width": "1",
				"stroke": "#000000"
			});
			$("#floors").html(Math.round(value * roundingFactor));
			chart.set.push(floor);
		}

		// draw trials, trials must snap to grid
		else if (chart.set.length === 1) {
			var blankCircle = chart.paper.circle(objectX, snapObjectY, objectRadius);
			blankCircle.attr({'fill-opacity': 0});
			$("#trials").html(Math.round(value * roundingFactor));
			chart.set.push(blankCircle);
		}

		// draw corrects
		else if (chart.set.length === 2) {
			var circle = chart.paper.circle(objectX, objectY, objectRadius);
			circle.attr({
				'fill-opacity': 1,
				'fill': '#000'
			})
			$("#corrects").html(Math.round(value));
			chart.set.push(circle);
		}

		// draw mistakes
		else if (chart.set.length === 3) {
			//create an x shape
			var mistakesPathOne = "M " + (objectX - objectRadius)+ ' ' + (objectY - objectRadius) + " l " + (2*objectRadius) +' ' + (2*objectRadius);
			var mistakesPathTwo = "M " + (objectX - objectRadius)+ ' ' + (objectY + objectRadius) + " l " + (2*objectRadius) +' ' + (-2*objectRadius);
			var mistakeLineOne = chart.paper.path(mistakesPathOne);
			var mistakeLineTwo = chart.paper.path(mistakesPathTwo);
			mistakeLineOne.attr({
				"stroke-width": "1",
				"stroke": "#000000"
			});
			mistakeLineTwo.attr({
				"stroke-width": "1",
				"stroke": "#000000"
			});
			$("#errors").html(Math.round(value));
			chart.set.push(mistakeLineOne);
			chart.set.push(mistakeLineTwo);
		}

		if (chart.set.length > 0) {
			$('#adjustments').css("display", "block");
		}

		else {
			$('#adjustments').css("display", "none");
		}
	});
	
	// erases marks on chart
	chart.hammertime.on("swiperight", function(e) {
		chart.set.remove();
		chart.set.length = 0;
		$('#adjustments').css("display", "none");
	});
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

