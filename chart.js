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
	this.stage = new Kinetic.Stage({
		container: 'chart',
		height: this.chartElement.height(),
		width: this.chartElement.width()
	})
};

Chart.prototype.drawXAxis = function() {
	// for each decade, draw the lines within that decade on the log scale
	var i;
	//create layer
	var layer = new Kinetic.Layer();
	for (i = 0; i < this.numberOfDecades; i++) {
		var decadeBaseValue = Math.pow(10, this.minCountPerMinuteExponent + i);
		var decadeHighValue = Math.pow(10, this.minCountPerMinuteExponent + i + 1);
		var decadeHeight = this.chartElement.height() / this.numberOfDecades;
		// draw lines for the decade high value and the decade low value
		// [call line drawing function here]
		console.log('decade base value for decade ' + i + ' is ' + decadeBaseValue);
		console.log('decade high value for decade ' + i + ' is ' + decadeHighValue);

		// get y positions for and draw lines for values in between the high and the low
		var yPosition;

		for (var j = 2; j < 10; j++) {
			// solve equation where value equals two to nine, then multiply by base of the decade
			yPosition = this.valueToYPosition(decadeHeight, j, decadeBaseValue);
			console.log('y Position for intermediate line '+ j + ' : ' + yPosition);

			var xLine = new Kinetic.Line({
		        points: [0, 1000],
		        stroke: 'black',
        		strokeWidth: 4
		    });
		    layer.add(xLine);

		    var rect = new Kinetic.Rect({
		        x: 239,
		        y: 75,
		        width: 100,
		        height: 50,
		        fill: 'green',
		        stroke: 'black',
		        strokeWidth: 4
		    });
		    layer.add(rect);
		}
		//debugger;
		this.stage.add(layer);
	}
	return 'done';
}

// takes a value and coverts it to a y position on the chart
Chart.prototype.valueToYPosition = function(decadeHeight, lineValue, decadeBaseValue) {
	var y = 10 + decadeHeight * (log10(lineValue/decadeBaseValue));
	console.log("decadeHeight is " + decadeHeight);
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
