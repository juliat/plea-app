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
	this.activeDay = 18;
	this.minExponent = -3;
	this.maxExponent = 3;
	this.numberOfDecades = Math.abs(this.minExponent) + Math.abs(this.maxExponent);
	this.init();
}


// Initialize the chart
Chart.prototype.init = function() {
	this.setObjects();
	this.setStyles();
	this.setDimensions();
	this.createChartTouchEvents();
	this.createPaperDrawingArea();
	this.createAdjustmentsTouchEvents();
	this.createPhaselineTouchEvents();
	this.drawXAxis();
	this.drawYAxis();
}

Chart.prototype.setObjects = function() {
	this.metricsOrder = ['floor', 'corrects', 'trials', 'errors'];
	this.metric = {
		'corrects' : {
						'marker' : 'filled-circle',
						'metric' : null // instance of metric is stored here
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
				     }
	};

	this.phaseline = {
		'phaseline' : null
	};
}

Chart.prototype.setStyles = function() {
	this.metricStyles = {
		'filled-circle' : 	{
								'fill-opacity': 1,
						   		'fill': '#7FFF00',
						   		'stroke': 0,
						   		'opacity': .9
						   	},
		'line' : 			{ 
								'stroke-width': '1',
					 			'stroke': '#000'
					 		},
		'cross' : 			{ 
								'stroke-width': '1',
				    			'stroke': "#F62817",
				    			'opacity': .9
				    		},
		'empty-circle' : 	{
								'fill-opacity': 0
							}
	};
	this.phaselineStyles = {
		'phaseline' : 		{
								'stroke-width' : 1.5,
								'stroke' : '#404040'
							},
		'phaseline-floor' : {
								'text-anchor' : 'start'
							},
		'phaseline-note' : 	{
								'text-anchor' : 'middle'
							}
	}
	this.chartStyles = {
		// horizontal lines and labels
		'decadebaseline' : 	{
								'weight' : '1.1',
								'color' : '#A6C5D3'
							},
		'decadebaselabel' : {
								'font-size' : 15,
								'text-anchor' : 'end',
								'color' : '#A6C5D3'
							},
		'intermediateline' : {
								'weight' : '0.4',
								'color' : '#A6C5D3'
							},
		'middleline' :   	{
								'weight' : '0.8',
								'color' : '#A6C5D3'
							},
		'middlelabel' : 	{
								'font-size' : 10,
								'text-anchor' : 'end',
								'color' : '#A6C5D3'
							},
		'floorlabel' : 		{
								'font-size' : 10,
								'text-anchor' : 'start',
								'color' : '#A6C5D3'
							},
		// vertical lines and labels
		'weekline' : 		{
								'weight' : '1',
								'color' : '#A6C5D3'
							},
		'weeklabel' : 		{
								'font-size' : 14,
								'text-anchor' : 'middle',
								'color' : '#A6C5D3'
							},
		'activedayline' : 	{
								'weight' : '1',
								'color' : '#0000FF'
							},
		'activedaylabel' : 	{
								'font-size' : 8,
								'text-anchor' : 'middle',
								'color' : '#0000FF'
							}
	};
}

Chart.prototype.setDimensions = function() {
	// initialize width and height of chart based on window size
	var width = $(window).width();
	var height = $(window).height();
	// #draw div is the wrapper for the chart
	$("#draw").width(width);
	$("#draw").height(height);
	console.log(width);
	console.log(height);

	// get dimensions from jquery drawElement to define chart height, width and margins
	this.drawElement = $('#draw');
	this.bottomMargin = this.drawElement.height() * 0.05;
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

	// calculate height of a decade in pixels by dividing the chart height by the number of decades
	this.decadeHeight = this.chartHeight / this.numberOfDecades;
}

// given a string with a metric name, returns the next metric that should
// be entered by the user
Chart.prototype.getNextMetric = function(metricName) {
	var chart = this;
	// find this one in the list metrics in order
	var thisIndex = chart.metricsOrder.indexOf(metricName);
	var nextMetric = 'none';

	// if the next metric is within array bounds, return it
	if (thisIndex + 1 < chart.metricsOrder.length) {
		var nextMetric = chart.metricsOrder[thisIndex+1];
	}
	// otherwise return the default value of 'none'
	return nextMetric;
}

// save and display a metric inputted by the user
// param metricName: metric name as a string
Chart.prototype.saveMetric = function(metricName, yValue) {
	var chart = this;
	// if the metric is already on the chart, remove it
	if (chart.metric[metricName]['metric'] !== null) {
		chart.metric[metricName]['metric'].paperObject.remove();
	}
	
	// create a new instance of Metric for this metric
	chart.metric[metricName]['metric'] = new Metric(chart, 'floor', chart.activeDay, yValue);

	// update the marker on the chart
	var htmlMetricID = "#"+metricName;
	// find it and set it to the new value
	$(htmlMetricID).val(chart.metric[metricName]['metric'].value+'"');
	
	// highlight the corresponding setion for this metric in the adjustments panel
	var htmlAdjustmentSectionID = "#"+metricName+"-section";
	$("htmlAdjustmentSectionID").css('background','rgba(242,242,242,.8)');
	// TODO: this should really be adding a class rather than modifying the css
	// and probably in its own "highlightMetricAdjustment" function

	var nextMetric = chart.getNextMetric(metricName);
	// if the next metric to be entered hasn't been set yet,
	if (chart.metric[nextMetric]['metric'] === null) {
		// set it as the active metric 
		chart.activeMetric = nextMetric;

		// and highlight that section in the adjustments panel
		$('#adjustments').css("display", "block");
		htmlAdjustmentSectionID = "#"+metricName+"-section";
		$(htmlAdjustmentSectionID).css('background','rgba(200,200,200,.8)');
	}
	// otherwise set the activeMetric to none
	else {
		chart.activeMetric = ' '
	}
}

// function that draws points on the 'today' line when there is a touch input
Chart.prototype.createChartTouchEvents = function() {
	var chart = this;
	this.activeMetric = 'floor';
	chart.hammertime = $("#draw").hammer();

	// draw point on active day line
	chart.hammertime.on("tap", function(e) {
		e.preventDefault();
		var chartBottomY = chart.chartHeight + chart.topMargin;
		var y = chartBottomY - event.y;

		chart.saveMetric(chart.activeMetric);
	});

	// show the adjustments panel when the user swipes left
	chart.hammertime.on("swipeleft", function(e) {
		e.preventDefault();
		$('#adjustments').css("display", "block");
	});

	// hide the adjustments panel when the user swipes right
	chart.hammertime.on("swiperight", function(e) {
		e.preventDefault();
		$('#adjustments').css("display", "none");
	});
}

Chart.prototype.createPaperDrawingArea = function() {
	// store dom element
	var drawDOMElement = document.getElementById('draw');

	// create a raphael 'paper' drawing area
	this.paper = new Raphael(drawDOMElement, this.drawElement.width(), this.drawElement.height());
}

Chart.prototype.createAdjustmentsTouchEvents = function() {
	var chart = this;
	$('.add').on('touchstart click', function(e){
		e.preventDefault();
		var label = $(this).attr('id'); // get the id of the div that was clicked

		if (label === "add-correct") {
			chart.metric['corrects']['metric'].changeValueAndMarker(1);
		}

		if (label === "add-floor") {
			chart.metric['floor']['metric'].changeValueAndMarker(1);
		}

		if (label === "add-error") {
			chart.metric['errors']['metric'].changeValueAndMarker(1);
		}

		if (label === "add-trial") {
			chart.metric['trials']['metric'].changeValueAndMarker(1);
		}
	});

	$('.subtract').on('touchstart click', function(e){
		e.preventDefault();
		var label = $(this).attr('id');

		if (label === "sub-correct") {
			chart.metric['corrects']['metric'].changeValueAndMarker(-1);
		}

		if (label === "sub-floor") {
			chart.metric['floor']['metric'].changeValueAndMarker(-1);
		}

		if (label === "sub-error") {
			chart.metric['errors']['metric'].changeValueAndMarker(-1);
		}

		if (label === "sub-trial") {
			chart.metric['trials']['metric'].changeValueAndMarker(-1);
		}
	});

	$('#floor-label').on('touchstart click', function(e){
		e.preventDefault();
		chart.activeMetric = 'floor';
		$("#floor-section").css('background','rgba(200,200,200,.8)');
		$("#error-section").css('background','rgba(242,242,242,.8)');
		$("#correct-section").css('background','rgba(242,242,242,.8)');
		$("#trial-section").css('background','rgba(242,242,242,.8)');
	});
	$('#correct-label').on('touchstart click', function(e){
		e.preventDefault();
		chart.activeMetric = 'corrects';
		$("#correct-section").css('background','rgba(200,200,200,.8)');
		$("#error-section").css('background','rgba(242,242,242,.8)');
		$("#floor-section").css('background','rgba(242,242,242,.8)');
		$("#trial-section").css('background','rgba(242,242,242,.8)');
	});
	$('#error-label').on('touchstart click', function(e){
		e.preventDefault();
		chart.activeMetric = 'errors';
		$("#error-section").css('background','rgba(200,200,200,.8)');
		$("#floor-section").css('background','rgba(242,242,242,.8)');
		$("#correct-section").css('background','rgba(242,242,242,.8)');
		$("#trial-section").css('background','rgba(242,242,242,.8)');
	});
	$('#trial-label').on('touchstart click', function(e){
		e.preventDefault();
		chart.activeMetric = 'trials';
		$("#trial-section").css('background','rgba(200,200,200,.8)');
		$("#error-section").css('background','rgba(242,242,242,.8)');
		$("#correct-section").css('background','rgba(242,242,242,.8)');
		$("#floor-section").css('background','rgba(242,242,242,.8)');
	});
}

Chart.prototype.createPhaselineTouchEvents = function() {
	var chart = this;
	// when you click on the add phase line element, show the modal
	$('#phaseline').on('touchstart click', function(e){
		e.preventDefault();
		$('#addPhaseline').modal('show');
	});
	// TODO: comment this code!
	$('#add-phaseline').on('touchstart click', function(e){
		e.preventDefault();
		// setup values in modal (is that what this is doing?)
		var phaselineFloor = $("#phaseline-floor").val();
		var type;
		$("input[type='checkbox']:checked").each(function() {
			type=$(this).val();
		});

		var note = $("#phaseline-note").val();
		$('#addPhaseline').modal('hide');
		chart.phaseline['phaseline'] = new PhaseLine(chart, chart.activeDay, type, note, phaselineFloor);
		$('#phaseline').css('display', 'none');
		$('#remove-phaseline').css('display', 'inline-block');
	});
	$('#remove-phaseline').on('touchstart click', function(e){
		e.preventDefault();
		chart.phaseline['phaseline'].paperObject.remove();
		$('#phaseline').css('display', 'inline-block');
		$('#remove-phaseline').css('display', 'none');
	});
}

Chart.prototype.getMarkerForMetric = function(type) {
	return this.metric[type]['marker'];
}

// draws the lines on the x axis of the chart
Chart.prototype.drawXAxis = function() {
	// for each decade, draw the lines within that decade on the log scale
	// these variables define the x positions for the start and end of each line
	var lineStartX = this.leftMargin;
	var lineEndX = this.chartWidth;
	var chartBottomY = this.topMargin + this.chartHeight;

	// a decade is the section between two exponents of ten on the chart. 
	// For example, a decade would be from 1-10 or 0.001-0.01.
	for (var i = 0; i < this.numberOfDecades; i++) {
		var decadeBaseValue = Math.pow(10, this.minExponent + i);

		// find the y position for the base value of the decade.
		var decadeNumber = i;
		var decadeBasePosition = chartBottomY - (decadeNumber * this.decadeHeight);

		// draw the baseValue label on the chart for this decade
		this.drawLabel(lineStartX - this.labelPadding, decadeBasePosition, decadeBaseValue, this.chartStyles['decadebaselabel']);
		
		// draw floor labels for baseValue lines
		if (decadeBaseValue === 1) {
			this.drawLabel(lineEndX+70, decadeBasePosition, 1/decadeBaseValue+'"', this.chartStyles['floorlabel']);
			this.drawHorizontalLine(lineStartX - this.baseTickLength, lineEndX + 1.7*this.baseTickLength, decadeBasePosition, this.chartStyles['decadebaseline']);
		}
		else if (decadeBaseValue < 1) {
			this.drawLabel(lineEndX+70, decadeBasePosition, 1/decadeBaseValue+"'", this.chartStyles['floorlabel']);
			this.drawHorizontalLine(lineStartX - this.baseTickLength, lineEndX + 1.7*this.baseTickLength, decadeBasePosition, this.chartStyles['decadebaseline']);
		}
		else {
			this.drawHorizontalLine(lineStartX - this.baseTickLength, lineEndX + this.baseTickLength, decadeBasePosition, this.chartStyles['decadebaseline']);
		}

		// if we're on the last decade, draw a top baseValue line and label
		if (decadeNumber === (this.numberOfDecades - 1)) {
		    var topDecadePosition = decadeBasePosition - this.decadeHeight;
		    var topDecadeValue = Math.pow(10, this.minExponent + i + 1);
		    this.drawHorizontalLine(lineStartX - this.baseTickLength, lineEndX + this.baseTickLength, topDecadePosition, this.chartStyles['decadebaseline']);
		    this.drawLabel(lineStartX - this.labelPadding, topDecadePosition, topDecadeValue, this.chartStyles['decadebaselabel']);
		}

		// draw all the log lines for this decade
		this.drawIntermediateLines(decadeNumber, decadeBaseValue, decadeBasePosition, lineStartX, lineEndX)
	}
}


// get y positions for and draw lines for values in between the high and the low
Chart.prototype.drawIntermediateLines = function(decadeNumber, decadeBaseValue, decadeBasePosition, lineStartX, lineEndX) {
	for (var j = 2; j < 10; j++) {
		// solve equation where value equals two to nine, then multiply by base of the decade
		var lineValue = j * decadeBaseValue;
		var intermediateLineYPosition = this.valueToYPosition(decadeBasePosition, lineValue, decadeBaseValue);

		// only draw line with ticks and labels on the fifth line in the decade 
		// (this is just how the chart is designed)
		if (j === 5) {
			this.drawLabel(lineStartX - this.labelPadding, intermediateLineYPosition, lineValue, this.chartStyles['middlelabel']);
			this.drawHorizontalLine(lineStartX - this.intermediateTickLength, lineEndX + this.intermediateTickLength, intermediateLineYPosition, this.chartStyles['middleline']);
			// draw floor label
			if (lineValue < 1) {
				this.drawLabel(lineEndX+70, intermediateLineYPosition, 1/lineValue +"'", this.chartStyles['floorlabel']);
				this.drawHorizontalLine(lineStartX - this.intermediateTickLength, lineEndX + 2*this.intermediateTickLength, intermediateLineYPosition, this.chartStyles['middleline']);
			}
		}

		else {
			if (lineValue >=1 && lineValue <= 6) {
				this.drawLabel(lineEndX+70, intermediateLineYPosition, 60/lineValue+'"', this.chartStyles['floorlabel']);
				this.drawHorizontalLine(lineStartX, lineEndX+this.intermediateTickLength, intermediateLineYPosition,  this.chartStyles['intermediateline']);
			}
			else if (lineValue === .002 || lineValue===.02 || lineValue===.2) {
				this.drawLabel(lineEndX+70, intermediateLineYPosition, 1/lineValue +"'",  this.chartStyles['floorlabel']);
				this.drawHorizontalLine(lineStartX, lineEndX+this.intermediateTickLength, intermediateLineYPosition,  this.chartStyles['intermediateline']);
			}

			else {
				this.drawHorizontalLine(lineStartX, lineEndX, intermediateLineYPosition, this.chartStyles['intermediateline']);
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

	line.attr({"stroke-width": lineWeight,
			   "stroke": lineColor});
}

// draw regularly spaced lines for the number of days in the chart
Chart.prototype.drawYAxis = function() {
	var spacing = this.chartWidth/this.numberOfDays;

	var lineStartY = this.topMargin; // - roundingErrorRoom;
	var lineEndY = lineStartY + this.chartHeight;

	var startX = this.leftMargin;
	var labelAttr;
	var lineAttrs;
	var vertLabelPadding = this.labelPadding + 10;

	for (var i = 0; i <= this.numberOfDays; i++) {
		// draw the blue line representing today's line
		if (i === this.activeDay) {
			this.drawLabel(startX + i*spacing, lineStartY - this.labelPadding, 'TODAY', this.chartStyles['activedaylabel']);
			this.drawVerticalLine(startX + i*spacing, lineStartY, lineEndY, this.chartStyles['activedayline'], true, i);
		}

		// draw the rest of the vertical lines
		else {
			// every 7th and 14th vertical line are bolded
			if (i%7 === 0) {
				// include tickmarks and labels on the 14th line
				if (i%14 === 0) {
					this.drawLabel(startX + i*spacing, lineEndY + vertLabelPadding, i, this.chartStyles['weeklabel']);
					this.drawVerticalLine(startX + i*spacing, lineStartY - this.baseTickLength, lineEndY + this.baseTickLength, this.chartStyles['weekline']);
				}
				else {
					this.drawVerticalLine(startX + i*spacing, lineStartY, lineEndY, this.chartStyles['weekline']);
				}
			}
			// draw normal vertical lines
			else {
				this.drawVerticalLine(startX + i*spacing, lineStartY, lineEndY, this.chartStyles['intermediateline']);
			}
		}
	}
}

Chart.prototype.drawVerticalLine = function(x, y1, y2, params) {
	// console.log('drawing horizontal line at ' + y + 'from ' + x1 + ' to ' + x2);
	var deltaX = 0; // zero because we don't want the line to be slanted
	var deltaY = y2 - y1;
	var basePath = "M " + x + ' ' + y1 + " l " + deltaX + ' ' + deltaY;

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

