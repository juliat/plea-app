function behaviorChart() {
	this.numberOfDays = 140;
	this.minExponent = -3;
	this.maxExponent = 3;
	this.numberOfDecades = Math.abs(this.minExponent) + Math.abs(this.maxExponent);
	this.drawElement = $('#draw'); 
	this.markerRadius = 5 ;

	// to replace 'set'
	this.markers = {
		'corrects' : {
						'markerType' : 'filled-circle',
						'order' : 1,
						'value' : null
					 },
		'floors' :   {
						'markerType' : 'line',
						'order' : 0,
						'value' : null
				     },
		'errors' :   {
						'markerType' : 'filled-square',
						'order': 2,
						'value' : null
				     },
		'trials' :   {
						'markerType' : 'filled-triangle',
						'order' : 3,
						'value' : null
				     },
	};
	this.markerStyles = {
		'filled-circle' : {'fill-opacity': 1,
						   'fill': '#000'},
		'line' : { "stroke-width": "1",
					 "stroke": "#000000"},
		'filled-square' : { "stroke-width": "1",
				    "fill": "#000000"},
		'filled-triangle' : {'fill': "#000"},
	};
	
	this.init();
	// init adjustment div
	this.adjustmentsInit();
}

/* Initialize the behaviorChart */
behaviorChart.prototype.init = function() {
	// initialize width and height of behaviorChart based on window size
	var width = $(window).width();
	var height = $(window).height();
	$("#draw").width(width);
	$("#draw").height(height);

	// initialize 'draw' div as hammer touch area
	this.hammertime = $("#draw").hammer();

	// define active day, just put in 18 for now
	this.activeDay = 24;

	// get dimensions from jquery drawElement to define behaviorChart height, width and margins
	this.bottomMargin = this.drawElement.height() * 0.1;
	this.topMargin = this.drawElement.height() * 0.05;

	this.leftMargin = this.drawElement.width() * 0.05;
	this.rightMargin = this.drawElement.width() * 0.05;

	this.behaviorChartWidth = this.drawElement.width() - (this.leftMargin + this.rightMargin);
	this.behaviorChartHeight = this.drawElement.height() - (this.bottomMargin + this.topMargin);

	// set padding for number labels on behaviorChart
	this.labelPadding = this.leftMargin * 0.15;	

	// set tick lengths
	this.baseTickLength = 8;
	this.intermediateTickLength = 5;

	// calculate height of a decade in pixels by dividing the behaviorChart height by
	// the number of decades
	this.decadeHeight = this.behaviorChartHeight / this.numberOfDecades;

	// store dom element
	var drawDOMElement = document.getElementById('draw');

	var behaviorChart = this;
	// create a raphael 'paper' drawing area
	this.paper = new Raphael(drawDOMElement, this.drawElement.width(), this.drawElement.height());
	this.rectangle = this.paper.rect(0, 0, this.drawElement.width(), this.drawElement.height());  
	this.rectangle.attr({
		'fill' : '#fff',
		'stroke' : '#fff'
	});
	
	// draw axes
	this.drawXAxis();
	this.drawYAxis();
};

behaviorChart.prototype.drawMarker = function(valueType, x, y) {
	var markToDraw = this.markers[valueType]['markerType']; // get the mark to draw based on the valueType. e.g., corrects => filled circle
	if (markToDraw === 'filled-circle') {
		this.drawCircle(x, y, true);
	}
	if (markToDraw === 'line') {
		this.drawLine(x, y);
	}
	if (markToDraw === 'filled-square') {
		this.drawSquare(x, y);
	}
	if (markToDraw === 'filled-triangle') {
		this.drawTriangle(x, y);
	}
}

behaviorChart.prototype.drawSquare = function (x, y) {
	var newSquare = this.paper.rect(x-this.markerRadius, y-this.markerRadius, 2*this.markerRadius, 2*this.markerRadius);
	var behaviorChart = this;
	var squareMarkerStyles = this.markerStyles[this.markers['errors']['markerType']];
	newSquare.attr(squareMarkerStyles);
	this.set.push(newSquare);
}

behaviorChart.prototype.drawTriangle = function (x, y) {
	var trianglePath = 'M '+(x-this.markerRadius)+' '+(y+this.markerRadius)+' l '+(this.markerRadius)+' '+(-this.markerRadius*2)+' l '+(this.markerRadius)+' '+(this.markerRadius*2)+'Z';
	var newTriangle = this.paper.path(trianglePath);
	var triangleMarkerStyles = this.markerStyles[this.markers['trials']['markerType']];
	newTriangle.attr(triangleMarkerStyles);
	this.set.push(newTriangle);
}
behaviorChart.prototype.drawCircle = function (x, y, isFilled) {
	// create new circle with new position
	var newCircle = this.paper.circle(x, y, this.markerRadius);
	var behaviorChart = this;
	// factor out attributes into dictionary
	if (isFilled === true) {
		var correctMarkerStyles = this.markerStyles[this.markers['corrects']['markerType']];
		newCircle.attr(correctMarkerStyles);
	}
	else {
		var trialMarkerStyles = this.markerStyles[this.markers['trials']['markerType']];
		newCircle.attr(trialMarkerStyles);
	}

	this.set.push(newCircle);
}

behaviorChart.prototype.drawLine = function (x, y) {
	var linePath = 'M '+(x-this.markerRadius)+' '+y+' l '+(2*this.markerRadius)+' 0';
	var newLine = this.paper.path(linePath);
	var floorMarkerStyles = this.markerStyles[this.markers['floors']['markerType']];
	newLine.attr(floorMarkerStyles);
	this.set.push(newLine);
}

behaviorChart.prototype.drawCross = function (x, y) {
	var crossPathOne = 'M '+(x-this.markerRadius)+' '+(y-this.markerRadius)+' l '+(2*this.markerRadius)+' '+(2*this.markerRadius);
	var crossPathTwo = 'M '+(x-this.markerRadius)+' '+(y+this.markerRadius)+' l '+(2*this.markerRadius)+' '+(-2*this.markerRadius);
	var crossLineOne = this.paper.path(crossPathOne);
	var crossLineTwo = this.paper.path(crossPathTwo);
	var errorMarkerStyles = this.markerStyles[this.markers['errors']['markerType']];
	crossLineOne.attr(errorMarkerStyles);
	crossLineTwo.attr(errorMarkerStyles);
	this.set.push(crossLineOne);
	this.set.push(crossLineTwo);
}

behaviorChart.prototype.getElementXCoord = function(element, index) {
	var x = this.set[index].getBBox().x + this.markerRadius;
	return x;
}

behaviorChart.prototype.getElementYCoord = function(element, index) {
	if (index === 0) {
		var y = this.set[index].getBBox().y;
	}
	else {
		var y = this.set[index].getBBox().y + this.markerRadius;
	}
	return y;
}

behaviorChart.prototype.adjustmentsInit = function() {
	var behaviorChart = this;
	var decadeNumber;

	var markerY; // y position of the marker
	var markerX = behaviorChart.dayToXPosition(behaviorChart.activeDay); // x position of the marker
	var moveDistance;
	var index;

	// set the height of the # adjustments div to be the height of the window
	$('#adjustments').width($(window).width()); 

	$('.add').on('touchstart', function(e){
		// call numberPlusOne valuePlusOne
		e.preventDefault();
		var numberPlusOne = parseInt($(this).prev().html()) + 1; // grab previous html element and add one to its value
		//$(this).prev().html(numberPlusOne); // replace the contents of the previous html element with that value
		var label = $(this).attr('id'); // get the id of the div that was clicked

		console.log(behaviorChart.saveValue);
		if (behaviorChart.saveValue >= 1) {
			behaviorChart.saveValue+=1;
			var floorNumberPlusOne = 60/behaviorChart.saveValue;
		}
		else {
			var roundingFactor;
			if (behaviorChart.saveValue >= 0 && behaviorChart.saveValue < 0.01) roundingFactor = .001; 
			if (behaviorChart.saveValue >= 0.01 && behaviorChart.saveValue < 0.1) roundingFactor = .01;
			if (behaviorChart.saveValue >= .1 && behaviorChart.saveValue < 1) roundingFactor = .1;
			behaviorChart.saveValue+=roundingFactor;
			var floorNumberPlusOne = 1/(Math.round(behaviorChart.saveValue/roundingFactor)*roundingFactor);
		}
		console.log(behaviorChart.saveValue);

		if (label === "add-correct") {
			// only do things if there's a circle (correct) marker in the array. because of the order, it would be at index 2
			// it may be better to abstract the set into a dictionary rather than an array and make the order an attr of objects in the array
			if (behaviorChart.set.length >= 2) {
				decadeNumber = behaviorChart.base;
				index = 1;
				var binx;
				if (Chart.rateFinder === 8) {
					binx = 2;
				}
				markerY = behaviorChart.calculateMarkerY(decadeNumber, numberPlusOne+binx);
				moveDistance = -(behaviorChart.getElementYCoord(behaviorChart.set[index], index) - markerY);
				behaviorChart.set[index].transform("...t0," + moveDistance);
				$(this).prev().html(numberPlusOne);
			}
		}

		if (label === "add-floor") {
			// only do something if a floor is in the set, floor is at index 0 in array
			if (behaviorChart.set.length >= 1) {
				decadeNumber = behaviorChart.base;
				index = 0;
				markerY = behaviorChart.calculateMarkerY(decadeNumber, behaviorChart.saveValue);
				moveDistance = -(behaviorChart.getElementYCoord(behaviorChart.set[index], index) - markerY);
				behaviorChart.set[index].transform("...t0," + moveDistance);
				$(this).prev().html(floorNumberPlusOne);
			}
		}

		if (label === "add-error") {
			if (behaviorChart.set.length >= 3) {
				decadeNumber = behaviorChart.base;
				index = 2;
				markerY = behaviorChart.calculateMarkerY(decadeNumber, numberPlusOne);
				moveDistance = -(behaviorChart.getElementYCoord(behaviorChart.set[indexOne], indexOne) - markerY);
				behaviorChart.set[index].transform("...t0," + moveDistance);
				$(this).prev().html(numberPlusOne);
			}
		}

		if (label === "add-trial") {
			if (behaviorChart.set.length >= 4) {
				decadeNumber = behaviorChart.base;
				index = 3;
				markerY = behaviorChart.calculateMarkerY(decadeNumber, numberPlusOne);
				moveDistance = -(behaviorChart.getElementYCoord(behaviorChart.set[index], index) - markerY);
				behaviorChart.set[index].transform("...t0," + moveDistance);
				$(this).prev().html(numberPlusOne);
			}
		}

	});
	$('.subtract').on('touchstart', function(e){
		e.preventDefault();
		var numberMinusOne = parseInt($(this).next().html()) - 1;
		var label = $(this).attr('id');

		if (behaviorChart.saveValue >= 1) {
			behaviorChart.saveValue-=1;
			var floorNumberMinusOne = 60/behaviorChart.saveValue;
		}

		if (label === "sub-correct") {
			if (behaviorChart.set.length >= 2) {
				decadeNumber = 3;
				index = 1;
				markerY = behaviorChart.calculateMarkerY(decadeNumber, numberMinusOne);
				moveDistance = -(behaviorChart.getElementYCoord(behaviorChart.set[index], index) - markerY);
				behaviorChart.set[index].transform("...t0," + moveDistance);
				$(this).next().html(numberMinusOne);
			}
		}

		if (label === "sub-floor") {
			// only do something if a floor is in the set, floor is in position index 0 in aray
			if (behaviorChart.set.length >= 1) {
				decadeNumber = 3;
				index = 0;
				markerY = behaviorChart.calculateMarkerY(decadeNumber, behaviorChart.saveValue);
				moveDistance = -(behaviorChart.getElementYCoord(behaviorChart.set[index], index) - markerY);
				behaviorChart.set[index].transform("...t0," + moveDistance);
				$(this).next().html(floorNumberMinusOne);
			}
		}

		if (label === "sub-error") {
			if (behaviorChart.set.length >= 3) {
				decadeNumber = 3;
				indexOne = 2;
				indexTwo = 3;
				markerY = behaviorChart.calculateMarkerY(decadeNumber, numberMinusOne);
				moveDistance = -(behaviorChart.getElementYCoord(behaviorChart.set[indexOne], indexOne) - markerY);
				behaviorChart.set[indexOne].transform("...t0," + moveDistance);
				behaviorChart.set[indexTwo].transform("...t0," + moveDistance);
				$(this).next().html(numberMinusOne);
			}
		}

		if (label === "sub-trial") {
			if (behaviorChart.set.length >= 5) {
				decadeNumber = 0;
				index = 4;
				markerY = behaviorChart.calculateMarkerY(decadeNumber, numberMinusOne);
				moveDistance = -(behaviorChart.getElementYCoord(behaviorChart.set[index], index) - markerY);
				behaviorChart.set[index].transform("...t0," + moveDistance);
				$(this).next().html(numberMinusOne);
			}
		}
	});	/*
	this.addButtonHammer = $('.add').hammer();
	this.addButtonHammer.on("hold", function(e) {
		e.preventDefault();
		behaviorChart.hold = true;
		behaviorChart.helpme = setInterval(function(){
			var numberPlusOne = parseInt($(e.target).prev().html()) + 1; // grab previous html element and add one to its value
			$(e.target).prev().html(numberPlusOne); // replace the contents of the previous html element with that value
			var label = $(e.target).attr('id'); // get the id of the div that was clicked
			if (label === "add-correct") {
				// only do things if there's a circle (correct) marker in the array. because of the order, it would be at index 2
				// it may be better to abstract the set into a dictionary rather than an array and make the order an attr of objects in the array
				if (behaviorChart.set.length >= 2) {
					decadeNumber = 3;
					index = 1;
					markerY = behaviorChart.calculateMarkerY(decadeNumber, numberPlusOne);
					moveDistance = -(behaviorChart.getElementYCoord(behaviorChart.set[index], index) - markerY);
					behaviorChart.set[index].transform("...t0," + moveDistance);
				}
			}

			if (label === "add-floor") {
				// only do something if a floor is in the set, floor is at index 0 in array
				if (behaviorChart.set.length >= 1) {
					console.log('hi');
					decadeNumber = 3;
					index = 0;
					markerY = behaviorChart.calculateMarkerY(decadeNumber, numberPlusOne);
					moveDistance = -(behaviorChart.getElementYCoord(behaviorChart.set[index], index) - markerY);
					behaviorChart.set[index].transform("...t0," + moveDistance);
				}
			}

			if (label === "add-error") {
				if (behaviorChart.set.length >= 3) {
					decadeNumber = 3;
					indexOne = 2;
					indexTwo = 3;
					markerY = behaviorChart.calculateMarkerY(decadeNumber, numberPlusOne);
					moveDistance = -(behaviorChart.getElementYCoord(behaviorChart.set[indexOne], indexOne) - markerY);
					behaviorChart.set[indexOne].transform("...t0," + moveDistance);
					behaviorChart.set[indexTwo].transform("...t0," + moveDistance);
				}
			}

			if (label === "add-trial") {
				if (behaviorChart.set.length >= 5) {
					decadeNumber = 0;
					index = 4;
					markerY = behaviorChart.calculateMarkerY(decadeNumber, numberPlusOne);
					moveDistance = -(behaviorChart.getElementYCoord(behaviorChart.set[index], index) - markerY);
					behaviorChart.set[index].transform("...t0," + moveDistance);
					console.log(numberPlusOne);
				}
			}
		},200);
	});
	this.addButtonHammer.on("release", function(e) {
		if (behaviorChart.hold === true) {
			clearInterval(behaviorChart.helpme);
			behaviorChart.hold = false;
		}
	});
	this.subButtonHammer = $('.subtract').hammer();
	this.subButtonHammer.on("hold", function(e) {
		e.preventDefault();
		behaviorChart.hold = true;
		behaviorChart.helpme = setInterval(function(){
			var numberMinusOne = parseInt($(e.target).next().html()) - 1; // grab previous html element and add one to its value
			$(e.target).next().html(numberMinusOne); // replace the contents of the previous html element with that value
			var label = $(e.target).attr('id'); // get the id of the div that was clicked
			if (label === "sub-correct") {
				if (behaviorChart.set.length >= 2) {
					decadeNumber = 3;
					index = 1;
					markerY = behaviorChart.calculateMarkerY(decadeNumber, numberMinusOne);
					moveDistance = -(behaviorChart.getElementYCoord(behaviorChart.set[index], index) - markerY);
					behaviorChart.set[index].transform("...t0," + moveDistance);
				}
			}

			if (label === "sub-floor") {
				// only do something if a floor is in the set, floor is in position index 0 in aray
				if (behaviorChart.set.length >= 1) {
					decadeNumber = 3;
					index = 0;
					markerY = behaviorChart.calculateMarkerY(decadeNumber, numberMinusOne);
					moveDistance = -(behaviorChart.getElementYCoord(behaviorChart.set[index], index) - markerY);
					behaviorChart.set[index].transform("...t0," + moveDistance);
					console.log(numberMinusOne);
				}
			}

			if (label === "sub-error") {
				if (behaviorChart.set.length >= 3) {
					decadeNumber = 3;
					indexOne = 2;
					indexTwo = 3;
					markerY = behaviorChart.calculateMarkerY(decadeNumber, numberMinusOne);
					moveDistance = -(behaviorChart.getElementYCoord(behaviorChart.set[indexOne], indexOne) - markerY);
					behaviorChart.set[indexOne].transform("...t0," + moveDistance);
					behaviorChart.set[indexTwo].transform("...t0," + moveDistance);
				}
			}

			if (label === "sub-trial") {
				if (behaviorChart.set.length >= 5) {
					decadeNumber = 0;
					index = 4;
					markerY = behaviorChart.calculateMarkerY(decadeNumber, numberMinusOne);
					moveDistance = -(behaviorChart.getElementYCoord(behaviorChart.set[index], index) - markerY);
					behaviorChart.set[index].transform("...t0," + moveDistance);
				}
			}
		},200);
	});
	this.subButtonHammer.on("release", function(e) {
		if (behaviorChart.hold === true) {
			clearInterval(behaviorChart.helpme);
			behaviorChart.hold = false;
		}
	});
*/
}


// draws the lines on the x axis of the behaviorChart
behaviorChart.prototype.drawXAxis = function() {
	// for each decade, draw the lines within that decade on the log scale
	var i;

	// these variables define the x positions for the start and end of each line
	var lineStartX = this.leftMargin;
	var lineEndX = this.behaviorChartWidth;
	var behaviorChartBottomY = this.topMargin + this.behaviorChartHeight;

	// a decade is the section between two exponents of ten on the behaviorChart. 
	// For example, a decade would be from 1-10 or 0.001-0.01.
	for (i = 0; i < this.numberOfDecades; i++) {
		var decadeBaseValue = Math.pow(10, this.minExponent + i);

		// find the y position for the base value of the decade.
		var decadeNumber = i;
		var decadeBasePosition = behaviorChartBottomY - (decadeNumber * this.decadeHeight);

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

		// draw the baseValue line on the behaviorChart for this decade
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
behaviorChart.prototype.drawIntermediateLines = function(decadeNumber, decadeBaseValue, decadeBasePosition, lineStartX, lineEndX) {
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
		// (this is just how the behaviorChart is designed)
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

 
behaviorChart.prototype.drawLabel = function(x, y, lineValue, labelAttr) {
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


// takes a value and coverts it to a y position on the behaviorChart
behaviorChart.prototype.valueToYPosition = function(baseLineYPosition, lineValue, decadeBaseValue) {
	var decadeProportion = 1.0 * lineValue/decadeBaseValue;
	var logDecadeProportion = log10(decadeProportion);
	var offsetFromBase = this.decadeHeight * logDecadeProportion;
	var y = baseLineYPosition - offsetFromBase;
	return y;
}

behaviorChart.prototype.getDecadeBasePosition = function(decadeNumber) {
	var behaviorChartBottomY = this.topMargin + this.behaviorChartHeight;
	var position = behaviorChartBottomY - (decadeNumber * this.decadeHeight);
	return position;
}

behaviorChart.prototype.getDecadeBaseValue = function(decadeNumber) {
	var decadeExponent = decadeNumber + this.minExponent;
	var value = Math.pow(10, decadeExponent);
	return value;
}

behaviorChart.prototype.calculateMarkerY = function(decadeNumber, value) {
	var decadeBasePosition = this.getDecadeBasePosition(decadeNumber);
	var decadeBaseValue = this.getDecadeBaseValue(decadeNumber);
	var markerY = this.valueToYPosition(decadeBasePosition, value * decadeBaseValue, decadeBaseValue);
	return markerY;
}

behaviorChart.prototype.drawHorizontalLine = function(x1, x2, y, params) {
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

// draw regularly spaced lines for the number of days in the behaviorChart
behaviorChart.prototype.drawYAxis = function() {
	var spacing = this.behaviorChartWidth/this.numberOfDays;

	var lineStartY = this.topMargin; // - roundingErrorRoom;
	var lineEndY = lineStartY + this.behaviorChartHeight;

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

behaviorChart.prototype.drawVerticalLine = function(x, y1, y2, params, activeState, day) {
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
behaviorChart.prototype.createTouchEvents = function(line, day) {
	// creates an array to store touch events
	this.set = this.paper.set();

	var behaviorChart = this;
	behaviorChart.hammertime.on("tap", function(e) {
		// draw point on active day line
		var behaviorChartBottomY = behaviorChart.behaviorChartHeight + behaviorChart.topMargin;
		var y = behaviorChartBottomY - event.y;
		var value = behaviorChart.pointToValue(y);
		// create a rounding factor to snap touch event to nearest horizontal line coordinate
		var roundingFactor;
		if (value >= 0 && value < 0.01) {
			roundingFactor = 1000; 
		}
		if (value >= 0.01 && value < 0.1) {
			roundingFactor = 100;
		}
		if (value >= .1 && value < 1) {
			roundingFactor = 10;
		}
		if (value >= 1 && value < 10) {
			roundingFactor = 1;
		}
		if (value >= 10 && value < 100) {
			roundingFactor = .1;
		}
		if (value >= 100 && value < 1000) {
			roundingFactor = .01;
		}
		var roundedValue = Math.round(value*roundingFactor) / roundingFactor;
		

		// converting back from value to y-coordinate
		var decadeNumber = behaviorChart.findDecade(y);
		var decadeBasePosition = behaviorChartBottomY - (decadeNumber * behaviorChart.decadeHeight);
		var decadeBaseValue = behaviorChart.getDecadeBaseValue(decadeNumber);
		var snapMarkerY = behaviorChart.valueToYPosition(decadeBasePosition, roundedValue, decadeBaseValue);
		var markerY = behaviorChart.valueToYPosition(decadeBasePosition, value, decadeBaseValue);

		var markerX = behaviorChart.dayToXPosition(day);
		var markerRadius = 5;
		behaviorChart.saveValue = roundedValue;

		// draw floor, floor must snap to grid
		if (behaviorChart.set.length === 0) {
			behaviorChart.helpValue = value;
			behaviorChart.base;
			var floorValue = 60/roundedValue;
			var whereToDraw;
			if (floorValue >= 60) {
				floorValue = floorValue/60;
				if (floorValue >= 40 && floorValue < 90) {
					whereToDraw = behaviorChart.calculateMarkerY(0,16.66666);
					floorValue = 1;
					behaviorChart.base = 1;
				}
				if (floorValue >= 90 && floorValue < 160) {
					whereToDraw = behaviorChart.calculateMarkerY(0,8.33333);
					floorValue = 2;
					behaviorChart.base = 0;
				}
				if (floorValue >= 160 && floorValue < 300) {
					whereToDraw = behaviorChart.calculateMarkerY(0,4.16666);
					floorValue = 4;
					behaviorChart.base = 0;
				}
				if (floorValue >= 300 && floorValue < 800) {
					whereToDraw = behaviorChart.calculateMarkerY(0,2.08333);
					floorValue = 8;
					behaviorChart.base = 0;
				}
			}
			behaviorChart.drawMarker('floors', markerX, whereToDraw);
			$("#floors").html(floorValue + 'h');
			behaviorChart.rateFinder = floorValue;
		}

		// draw trials, trials must snap to grid
		else if (behaviorChart.set.length === 3) {
			behaviorChart.drawMarker('trials', markerX, snapMarkerY);
			var mink;
			if (behaviorChart.rateFinder === 8) {
				if (value >= 0 && value < 0.01) {
					roundingFactor = 1000;
					mink = -2;
				}
				if (value >= 0.01 && value < 0.1) {
					roundingFactor = 100;
					mink =7;
				}
				if (value >= .1 && value < 1) {
					roundingFactor = 10;
					mink=17;
				}
				if (value >= 1 && value < 10) {
					roundingFactor = 1;
					mink=27;
				}
				if (value >= 10 && value < 100) {
					roundingFactor = .1;
					mink=37;
				}
				if (value >= 100 && value < 1000) {
					roundingFactor = .01;
					mink=47;
				}
			}
			if (behaviorChart.rateFinder === 4) {
				if (value >= 0 && value < 0.01) {
					roundingFactor = 1000;
					mink = -4;
				}
				if (value >= 0.01 && value < 0.1) {
					roundingFactor = 100;
					mink =5;
				}
				if (value >= .1 && value < 1) {
					roundingFactor = 10;
					mink=15;
				}
				if (value >= 1 && value < 10) {
					roundingFactor = 1;
					mink=25;
				}
				if (value >= 10 && value < 100) {
					roundingFactor = .1;
					mink=35;
				}
				if (value >= 100 && value < 1000) {
					roundingFactor = .01;
					mink=45;
				}
			}
			if (behaviorChart.rateFinder === 2) {
				if (value >= 0 && value < 0.01) {
					roundingFactor = 1000;
					mink = -8;
				}
				if (value >= 0.01 && value < 0.1) {
					roundingFactor = 100;
					mink =1;
				}
				if (value >= .1 && value < 1) {
					roundingFactor = 10;
					mink=11;
				}
				if (value >= 1 && value < 10) {
					roundingFactor = 1;
					mink=21;
				}
				if (value >= 10 && value < 100) {
					roundingFactor = .1;
					mink=31;
				}
				if (value >= 100 && value < 1000) {
					roundingFactor = .01;
					mink=41;
				}
			}
			if (behaviorChart.rateFinder === 1) {
				if (value >= 0.01 && value < 0.1) {
					roundingFactor = 100;
					mink = -1;
				}
				if (value >= .1 && value < 1) {
					roundingFactor = 10;
					mink=8;
				}
				if (value >= 1 && value < 10) {
					roundingFactor = 1;
					mink=18;
				}
				if (value >= 10 && value < 100) {
					roundingFactor = .1;
					mink=28;
				}
				if (value >= 100 && value < 1000) {
					roundingFactor = .01;
					mink=38;
				}
			}
			$("#trials").html(Math.round(value * roundingFactor)+mink);
		}

		// draw corrects
		else if (behaviorChart.set.length === 1) {
			behaviorChart.drawMarker('corrects', markerX, snapMarkerY);
			var mink;
			if (behaviorChart.rateFinder === 8) {
				if (value >= 0 && value < 0.01) {
					roundingFactor = 1000;
					mink = -2;
				}
				if (value >= 0.01 && value < 0.1) {
					roundingFactor = 100;
					mink =7;
				}
				if (value >= .1 && value < 1) {
					roundingFactor = 10;
					mink=17;
				}
				if (value >= 1 && value < 10) {
					roundingFactor = 1;
					mink=27;
				}
				if (value >= 10 && value < 100) {
					roundingFactor = .1;
					mink=37;
				}
				if (value >= 100 && value < 1000) {
					roundingFactor = .01;
					mink=47;
				}
			}
			if (behaviorChart.rateFinder === 4) {
				if (value >= 0 && value < 0.01) {
					roundingFactor = 1000;
					mink = -4;
				}
				if (value >= 0.01 && value < 0.1) {
					roundingFactor = 100;
					mink =5;
				}
				if (value >= .1 && value < 1) {
					roundingFactor = 10;
					mink=15;
				}
				if (value >= 1 && value < 10) {
					roundingFactor = 1;
					mink=25;
				}
				if (value >= 10 && value < 100) {
					roundingFactor = .1;
					mink=35;
				}
				if (value >= 100 && value < 1000) {
					roundingFactor = .01;
					mink=45;
				}
			}
			if (behaviorChart.rateFinder === 2) {
				if (value >= 0 && value < 0.01) {
					roundingFactor = 1000;
					mink = -8;
				}
				if (value >= 0.01 && value < 0.1) {
					roundingFactor = 100;
					mink =1;
				}
				if (value >= .1 && value < 1) {
					roundingFactor = 10;
					mink=11;
				}
				if (value >= 1 && value < 10) {
					roundingFactor = 1;
					mink=21;
				}
				if (value >= 10 && value < 100) {
					roundingFactor = .1;
					mink=31;
				}
				if (value >= 100 && value < 1000) {
					roundingFactor = .01;
					mink=41;
				}
			}
			if (behaviorChart.rateFinder === 1) {
				if (value >= 0.01 && value < 0.1) {
					roundingFactor = 100;
					mink = -1;
				}
				if (value >= .1 && value < 1) {
					roundingFactor = 10;
					mink=8;
				}
				if (value >= 1 && value < 10) {
					roundingFactor = 1;
					mink=18;
				}
				if (value >= 10 && value < 100) {
					roundingFactor = .1;
					mink=28;
				}
				if (value >= 100 && value < 1000) {
					roundingFactor = .01;
					mink=38;
				}
			}
			$("#corrects").html(Math.round(value * roundingFactor)+mink);
		}

		// draw mistakes
		else if (behaviorChart.set.length === 2) {
			behaviorChart.drawMarker('errors', markerX, snapMarkerY);
			var mink;
			if (behaviorChart.rateFinder === 8) {
				if (value >= 0 && value < 0.01) {
					roundingFactor = 1000;
					mink = -2;
				}
				if (value >= 0.01 && value < 0.1) {
					roundingFactor = 100;
					mink =7;
				}
				if (value >= .1 && value < 1) {
					roundingFactor = 10;
					mink=17;
				}
				if (value >= 1 && value < 10) {
					roundingFactor = 1;
					mink=27;
				}
				if (value >= 10 && value < 100) {
					roundingFactor = .1;
					mink=37;
				}
				if (value >= 100 && value < 1000) {
					roundingFactor = .01;
					mink=47;
				}
			}
			if (behaviorChart.rateFinder === 4) {
				if (value >= 0 && value < 0.01) {
					roundingFactor = 1000;
					mink = -4;
				}
				if (value >= 0.01 && value < 0.1) {
					roundingFactor = 100;
					mink =5;
				}
				if (value >= .1 && value < 1) {
					roundingFactor = 10;
					mink=15;
				}
				if (value >= 1 && value < 10) {
					roundingFactor = 1;
					mink=25;
				}
				if (value >= 10 && value < 100) {
					roundingFactor = .1;
					mink=35;
				}
				if (value >= 100 && value < 1000) {
					roundingFactor = .01;
					mink=45;
				}
			}
			if (behaviorChart.rateFinder === 2) {
				if (value >= 0 && value < 0.01) {
					roundingFactor = 1000;
					mink = -8;
				}
				if (value >= 0.01 && value < 0.1) {
					roundingFactor = 100;
					mink =1;
				}
				if (value >= .1 && value < 1) {
					roundingFactor = 10;
					mink=11;
				}
				if (value >= 1 && value < 10) {
					roundingFactor = 1;
					mink=21;
				}
				if (value >= 10 && value < 100) {
					roundingFactor = .1;
					mink=31;
				}
				if (value >= 100 && value < 1000) {
					roundingFactor = .01;
					mink=41;
				}
			}
			if (behaviorChart.rateFinder === 1) {
				if (value >= 0.01 && value < 0.1) {
					roundingFactor = 100;
					mink = -1;
				}
				if (value >= .1 && value < 1) {
					roundingFactor = 10;
					mink=8;
				}
				if (value >= 1 && value < 10) {
					roundingFactor = 1;
					mink=18;
				}
				if (value >= 10 && value < 100) {
					roundingFactor = .1;
					mink=28;
				}
				if (value >= 100 && value < 1000) {
					roundingFactor = .01;
					mink=38;
				}
			}
			$("#errors").html(Math.round(value * roundingFactor)+mink);
		}

		if (behaviorChart.set.length > 0) {
			$('#adjustments').css("display", "block");
		}

		else {
			$('#adjustments').css("display", "none");
		}
	});
	
	// erases marks on behaviorChart
	behaviorChart.hammertime.on("swiperight", function(e) {
		behaviorChart.set.remove();
		behaviorChart.set.length = 0;
		$('#adjustments').css("display", "none");
		$('.input').html("");
	});
}

// converts a day (in int form, between 0 and 140 and 
// returns the x coordinate of that day line on the behaviorChart)
behaviorChart.prototype.dayToXPosition = function(day) {
	if ((day < 0) || (day > this.numberOfDays)) {
		return 'day out of range';
	}
	// compute based on margins and spacing. add variables from the drawYaxis function to the
	// behaviorChart object if need be
	else {
		var startX = this.leftMargin;
		var spacing = this.behaviorChartWidth/this.numberOfDays;
		var xValue = startX + day*spacing;
		return xValue;
	}
}

// plot historical data on the behaviorChart (should call helper methods for plotting data points on each day)
behaviorChart.prototype.drawHistoricalData = function() {

}

// should take in a day as an int between 0 and 140 and use that to determine where to draw the point vertically
behaviorChart.prototype.drawValue = function(day, value) {
	var cx = day;
	var cy = this.valueToYPosition(value);
	var radius = 1; //default
	var circle = paper.circle(cx, cy, radius);
}

// Change this
// takes a point on the behaviorChart and converts it to a semantic numeric value
behaviorChart.prototype.pointToValue = function(yPosition) {
	// get the base position (we're talking pixels) by using the value to position funciton on the base position
	var decadeNumber = this.findDecade(yPosition)
	var decadeBasePosition = decadeNumber * this.decadeHeight;
	var percentAwayFromVBase = (yPosition - decadeBasePosition)/this.decadeHeight;
	var decadeBaseValue = Math.pow(10, decadeNumber + this.minExponent);
	var value = decadeBaseValue * Math.pow(10, percentAwayFromVBase);
	return value;
}

behaviorChart.prototype.pointToFloorValue = function(yPosition) {
	var decadeNumber = 0;
	var decadeBasePosition = decadeNumber * this.decadeHeight;
	var percentAwayFromVBase = (yPosition - decadeBasePosition)/this.decadeHeight;
	var decadeBaseValue = Math.pow(10, decadeNumber + this.minExponent);
	var value = 60/(decadeBaseValue * Math.pow(10, percentAwayFromVBase));
	return value;
}

// takes a point and finds what decade you are in based on that point
behaviorChart.prototype.findDecade = function(point) {
	var decadeNumber = Math.floor(point/this.decadeHeight);
	return decadeNumber;
}

// note: for sooming maybe only draw decades

// just a helper to do log10 of numbers (javascript doesn't let you specify the base) of a log normally
function log10(value) {
  return Math.log(value) / Math.LN10;
}

