/* Chart Class 
 * ========================================================================= *
*/

// draw chart when window loads
window.onload = function(){
	$("#behavior-chart").click(function(){
		var chart = new behaviorChart();
		$("#type-of-chart").css("display","none");

	});
	$("#scatterplot").click(function(){
		var chart = new Chart();
		$("#type-of-chart").css("display","none");
	});
}

// construct chart object
function Chart() {
	this.numberOfDays = 140;
	this.minExponent = -3;
	this.maxExponent = 3;
	this.numberOfDecades = Math.abs(this.minExponent) + Math.abs(this.maxExponent);
	this.drawElement = $('#draw');
	this.markerRadius = 5;

	this.phaselineRadius = 40;
	this.phaselineTopLength = 440;
	this.phaselineBottomLength = 80;
	this.phaselineStartY = 60;

	this.metric = {
		'corrects' : {
						'marker' : 'filled-circle',
						'metric' : null
					 },
		'floor' :   {
						'marker' : 'line',
						'metric' : null
				     },
		'errors' :   {
						'marker' : 'cross',
						'metric' : null
				     },
		'trials' :   {
						'marker' : 'empty-circle',
						'metric' : null
				     },
	};

	this.phaseline = {
		'value' : null,
		'note' : null
	};

	this.markerStyles = {
		'filled-circle' : 	{
								'fill-opacity': 1,
						   		'fill': '#000'
						   	},
		'line' : 			{ 
								"stroke-width": "1",
					 			"stroke": "#000000"
					 		},
		'cross' : 			{ 
								"stroke-width": "1",
				    			"stroke": "#000000"
				    		},
		'empty-circle' : 	{
								'fill-opacity': 0
							},
	};
	
	this.init();

	// init adjustment div
	this.adjustmentsInit();
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
	
	this.set = this.paper.set();

	// draw axes
	this.drawXAxis();
	this.drawYAxis();
};

Chart.prototype.getMarkerForMetric = function(type) {
	return this.metric[type]['marker'];
}

Chart.prototype.drawPhaseline = function (x) {
	var r = this.phaselineRadius;
	var y = this.phaselineStartY;
	var l = this.phaselineTopLength;
	var z = this.phaselineBottomLength;
	var linePath = 'M '+(x+r)+' '+y+' C '+(x+r)+' '+y+' '+(x+(r-35))+' '+(y)+' '+(x)+' '+(y+r-20)+' L '+(x)+' '+(y+r+l)+' L '+(x+(r-15))+' '+(y+r+l+z);
	var newPhaseline = this.paper.path(linePath);
	newPhaseline.attr({
		'stroke-width': 1.5,
		'stroke': '#404040'
	});
	this.phaseline['value'] = newPhaseline;
}

Chart.prototype.removePhaseline = function () {
	this.phaseline['value'].remove();
	this.phaseline['value'] = null;
}

Chart.prototype.adjustmentsInit = function() {
	var chart = this;

	// set the height of the # adjustments div to be the height of the window
	$('#adjustments').width($(window).width()); 

	$('.add').on('click', function(e){
		e.preventDefault();
		var numberPlusOne = parseInt($(this).prev().html()) + 1; // grab previous html element and add one to its value
		var label = $(this).attr('id'); // get the id of the div that was clicked

		if (label === "add-correct") {
			if (chart.metric['corrects']['metric'] !== null) {
				chart.metric['corrects']['metric'].changeMarkerValue(1);
				$(this).prev().html(chart.metric['corrects']['metric'].value);
				chart.metric['corrects']['metric'].changeMarkerPosition(1);
			}
		}

		if (label === "add-floor") {
			if (chart.markers['floor']['marker'] !== null) {
				var increment;
				var decadeNumber;
				if (chart.floorValue >= 0 && chart.floorValue < 0.01) {
					increment = .001; 
					decadeNumber = 0;
					roundingFactor = 1000;
				}
				if (chart.floorValue >= 0.01 && chart.floorValue < 0.1) {
					increment = .01;
					decadeNumber = 1;
					roundingFactor = 100;
				}
				if (chart.floorValue >= .1 && chart.floorValue < 1) {
					increment = .1;
					decadeNumber = 2;
					roundingFactor = 10;
				}
				if (chart.floorValue >= 1 && chart.floorValue < 10) {
					increment = 1;
					decadeNumber = 3;
					roundingFactor = 1;
				}
				chart.floorValue = Math.round(chart.floorValue*roundingFactor)/roundingFactor + increment;
				chart.editMarker('floors', chart.floorValue * roundingFactor, decadeNumber);
				if (chart.floorValue > 1) {
					chart.convertedFloorValue = Math.round(60/chart.floorValue*10)/10;
				}
				else {
					chart.convertedFloorValue = Math.round(1/chart.floorValue*10)/10;
				}
				$(this).prev().html(chart.convertedFloorValue);
			}
		}

		if (label === "add-error") {
			if (chart.markers['errors']['marker'] !== null) {
				chart.editMarker('errors', numberPlusOne, 3);
				$(this).prev().html(numberPlusOne);
			}
		}

		if (label === "add-trial") {
			if (chart.markers['trials']['marker'] !== null) {
				chart.editMarker('trials', numberPlusOne, 0);
				$(this).prev().html(numberPlusOne);
			}
		}

	});
	$('.subtract').on('click', function(e){
		e.preventDefault();
		var numberMinusOne = parseInt($(this).next().html()) - 1;
		var label = $(this).attr('id');

		if (label === "sub-correct") {
			if (chart.markers['corrects']['marker'] !== null && chart.markers['corrects']['value'] > 1) {
				chart.editMarker('corrects', numberMinusOne, 3);
				$(this).next().html(numberMinusOne);
			}
		}

		if (label === "sub-floor") {
			// only do something if a floor is in the set, floor is in position index 0 in aray
			if (chart.markers['floor']['marker'] !== null) {
				var decadeNumber;
				var decrement;
				if (chart.floorValue >= 0 && chart.floorValue < 0.01) {
					decrement = .001; 
					decadeNumber = 0;
					roundingFactor = 1000;
				}
				if (chart.floorValue >= 0.01 && chart.floorValue < 0.1) {
					decrement = .01;
					decadeNumber = 1;
					roundingFactor = 100;
				}
				if (chart.floorValue >= .1 && chart.floorValue < 1) {
					decrement = .1;
					decadeNumber = 2;
					roundingFactor = 10;
				}
				if (chart.floorValue >= 1 && chart.floorValue < 10) {
					decrement = 1;
					decadeNumber = 3;
					roundingFactor = 1;
				}
				chart.floorValue -=  Math.round(chart.floorValue*roundingFactor)/roundingFactor - decrement;
				chart.editMarker('floor', chart.floorValue * roundingFactor, decadeNumber);
				if (chart.floorValue > 1) {
					chart.convertedFloorValue = Math.round(60/chart.floorValue*10)/10;
				}
				else {
					chart.convertedFloorValue = Math.round(1/chart.floorValue*10)/10;
				}
				$(this).next().html(chart.convertedFloorValue);
			}
		}

		if (label === "sub-error") {
			if (chart.markers['errors']['marker'] !== null && chart.markers['errors']['value'] > 1) {
				chart.editMarker('errors', numberMinusOne, 3);
				$(this).next().html(numberMinusOne);
			}
		}

		if (label === "sub-trial") {
			if (chart.markers['trials']['marker'] !== null && chart.markers['trials']['value'] > 1) {
				chart.editMarker('trials', numberMinusOne, 0);
				$(this).next().html(numberMinusOne);
			}
		}
	});	

	$('#phaseline').on('click', function(e){
		chart.drawPhaseline(chart.dayToXPosition(chart.activeDay));
		$('#add-to-phaseline').css('display', 'inline-block');
		$('#phaseline').css('display', 'none');
		$('#remove-phaseline').css('display','inline-block');
	});

	$('#remove-phaseline').on('click', function(e) {
		chart.removePhaseline();
		$('#add-to-phaseline').css('display', 'none');
		$('#remove-phaseline').css('display', 'none');
		$('#phaseline').css('display', 'inline-block');
	});

	$('#add-to-phaseline').on('click', function(e){
		chart.phaseline['note']=$('.note-input').val();
		$('.modal').modal('hide');
		$('.note-input').val('');
		$('#phaseline-label').attr('data-content', chart.phaseline['note']);
		$('#phaseline-label').data('popover').setContent();
	});

	$('#add-to-floor').on('click', function(e){
		chart.markers['floor']['note']=$('.note-input').val();
		$('.modal').modal('hide');
		$('.note-input').val('');
		$('#floor-label').attr('data-content', chart.markers['floor']['note']);
		$('#floor-label').data('popover').setContent();
	});

	$('#add-to-correct').on('click', function(e){
		chart.markers['corrects']['note']=$('.note-input').val();
		$('.modal').modal('hide');
		$('.note-input').val('');
		$('#correct-label').attr('data-content', chart.markers['corrects']['note']);
		$('#correct-label').data('popover').setContent();
	});

	$('#add-to-error').on('click', function(e){
		chart.markers['errors']['note']=$('.note-input').val();
		$('.modal').modal('hide');
		$('.note-input').val('');
		$('#error-label').attr('data-content', chart.markers['errors']['note']);
		$('#error-label').data('popover').setContent();
	});

	$('#add-to-trial').on('click', function(e){
		chart.markers['trials']['note']=$('.note-input').val();
		$('.modal').modal('hide');
		$('.note-input').val('');
		$('#trial-label').attr('data-content', chart.markers['trials']['note']);
		$('#trial-label').data('popover').setContent();
	});

	$('#error-label').popover({
		placement:'top',
        title: 'Note'
	});

	$('#trial-label').popover({
		placement:'top',
        title: 'Note'
	});

	$('#correct-label').popover({
		placement:'top',
        title: 'Note'
	});

	$('#floor-label').popover({
		placement:'top',
        title: 'Note'
	});

	$('#phaseline-label').popover({
		placement:'top',
        title: 'Note'
	});

}


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
		var floorAttr = {
			'font-size': 11,
			'text-anchor': 'start'
		}

		// draw the baseValue line on the chart for this decade
		this.drawHorizontalLine(lineStartX - this.baseTickLength, lineEndX + this.baseTickLength, decadeBasePosition, lineAttrs);
		if (decadeBaseValue === 1) {
			this.drawLabel(lineEndX+70, decadeBasePosition, 1/decadeBaseValue+'"', floorAttr);
			this.drawHorizontalLine(lineStartX, lineEndX+this.baseTickLength, decadeBasePosition, lineAttrs);
		}
		if (decadeBaseValue < 1) {
			this.drawLabel(lineEndX+70, decadeBasePosition, 1/decadeBaseValue+"'", floorAttr);
			this.drawHorizontalLine(lineStartX, lineEndX+this.baseTickLength, decadeBasePosition, lineAttrs);
		}
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
			var floorAttr = {
				'font-size': 11,
				'text-anchor': 'start'
			}
			this.drawLabel(lineStartX - this.labelPadding, intermediateLineYPosition, lineValue, labelAttr);
			this.drawHorizontalLine(lineStartX - this.intermediateTickLength, lineEndX + this.intermediateTickLength, intermediateLineYPosition, lineAttrs);
			if (lineValue < 1) {
				this.drawLabel(lineEndX+70, intermediateLineYPosition, 1/lineValue +"'", floorAttr);
				this.drawHorizontalLine(lineStartX, lineEndX+this.intermediateTickLength, intermediateLineYPosition, lineAttrs);
			}
		}

		else {
			var floorAttr = {
				'font-size': 11,
				'text-anchor': 'start'
			}
			this.drawHorizontalLine(lineStartX, lineEndX, intermediateLineYPosition, lineAttrs);
			if (lineValue >=1 && lineValue <= 6) {
				this.drawLabel(lineEndX+70, intermediateLineYPosition, 60/lineValue+'"', floorAttr);
				this.drawHorizontalLine(lineStartX, lineEndX+this.intermediateTickLength, intermediateLineYPosition, lineAttrs);
			}
			else if (lineValue === .002 || lineValue===.02 || lineValue===.2) {
				this.drawLabel(lineEndX+70, intermediateLineYPosition, 1/lineValue +"'", floorAttr);
				this.drawHorizontalLine(lineStartX, lineEndX+this.intermediateTickLength, intermediateLineYPosition, lineAttrs);
			}
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

Chart.prototype.getDecadeBasePosition = function(decadeNumber) {
	var chartBottomY = this.topMargin + this.chartHeight;
	var position = chartBottomY - (decadeNumber * this.decadeHeight);
	return position;
}

Chart.prototype.getDecadeBaseValue = function(decadeNumber) {
	var decadeExponent = decadeNumber + this.minExponent;
	var value = Math.pow(10, decadeExponent);
	return value;
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
	var chart = this;
	var index = 0;
	chart.hammertime.on("tap", function(e) {
		// draw point on active day line
		var chartBottomY = chart.chartHeight + chart.topMargin;
		var y = chartBottomY - event.y;

		// draw floor, floor must snap to grid
		if (index === 0) {
			chart.metric['floor']['metric'] = new Metric(chart, 'floor', chart.activeDay, y);
			$("#floors").html(chart.metric['floor']['metric'].value);
			index+=1;
		}

		// draw trials, trials must snap to grid
		else if (index === 3) {
			chart.metric['trials']['metric'] = new Metric(chart, 'trials', chart.activeDay, y);
			$("#trials").html(chart.metric['trials']['metric'].value);
			index+=1;
		}

		// draw corrects
		else if (index === 1) {
			chart.metric['corrects']['metric'] = new Metric(chart, 'corrects', chart.activeDay, y);
			$("#corrects").html(chart.metric['corrects']['metric'].value);
			index+=1;
		}

		// draw errors
		else if (index === 2) {
			chart.metric['errors']['metric'] = new Metric(chart, 'errors', chart.activeDay, y);
			$("#errors").html(chart.metric['errors']['metric'].value);
			index+=1;
		}

		if (index > 0) {
			$('#adjustments').css("display", "block");
		}

		else {
			$('#adjustments').css("display", "none");
		}
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

// takes a point and finds what decade you are in based on that point
Chart.prototype.findDecade = function(point) {
	var decadeNumber = Math.floor(point/this.decadeHeight);
	return decadeNumber;
}

// just a helper to do log10 of numbers (javascript doesn't let you specify the base) of a log normally
function log10(value) {
  return Math.log(value) / Math.LN10;
}

