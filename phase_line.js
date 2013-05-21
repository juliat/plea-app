/* Phase Line Class */

function PhaseLine() {
	this.value = null;
}

PhaseLine.prototype.draw = function() {

}

PhaseLine.prototype.create = function(name, noteText) {
	
}

PhaseLine.prototype.drawNote = function() {

}

/*
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
*/

/*
	this.phaselineRadius = 40;
	this.phaselineTopLength = 440;
	this.phaselineBottomLength = 80;
	this.phaselineStartY = 60;*/

/*
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

	$('#phaseline-label').popover({
		placement:'top',
        title: 'Note'
	});*/