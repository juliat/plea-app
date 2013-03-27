var chart;
var chartData = [
{
    ax: 1,
    ay: 2
},
{
    ax: 2,
    ay: 3
},
{
    ax: 3,
    ay: 3
},
{
    ax: 4,
    ay: 3
},
{
    ax: 5,
    ay: 5
},
{
    ax: 6,
    ay: 8
},
{
    ax: 7,
    ay: 7
},
{
    ax: 8,
    ay: 8
},
{
    ax: 9,
    ay: 6
},
{
    ax: 10,
    ay: 8
},
{
    ax: 11,
    ay: 7
},
{
    ax: 12,
    ay: 9
}
];

AmCharts.ready(function() {
    // XY CHART
    chart = new AmCharts.AmXYChart();
    chart.pathToImages = "http://www.amcharts.com/lib/images/";
    chart.marginRight = 10;
    chart.marginTop = 10;
    chart.marginLeft = 10;
    chart.autoMarginOffset = 0;
    chart.dataProvider = chartData;
    chart.startDuration = 1;
    chart.color = "#b0afff";
    chart.addListener("clickGraphItem", function(event) {
        alert("You've clicked on a data point :)");
    });

    // AXES
    // X
    var xAxis = new AmCharts.ValueAxis();
    xAxis.position = "bottom";
    xAxis.axisAlpha = 0;
    xAxis.autoGridCount = false;
    xAxis.maximum = 140;
    xAxis.minimum = 0;
    xAxis.labelsEnabled = false;
    var guide = new AmCharts.Guide();
    var currentDay = chartData.length;
    guide.value = currentDay;
    guide.lineColor = "#CC0000";
    guide.dashLength = 4;
    guide.label = "current day";
    guide.inside = true;
    guide.lineAlpha = 1;
    xAxis.addGuide(guide);
    chart.addValueAxis(xAxis);

    // Y
    var yAxis = new AmCharts.ValueAxis();
    yAxis.axisColor = "blue";
    yAxis.position = "left";
    yAxis.axisAlpha = 0.15;
    yAxis.logarithmic = true;
    yAxis.maximum = 1000;
    yAxis.minimum = .001;
    yAxis.gridAlpha = .15;
    yAxis.autoGridCount = false;
    chart.addValueAxis(yAxis);

    //Adding Logarithmic guidelines on y axis
    var x = .001;
    for (var i = 0; i < 10; i++) {
        var logGuide = new AmCharts.Guide();
        logGuide.lineAlpha = .15;
        logGuide.value = x;
        if (logGuide.value == .005) {
            logGuide.tickLength = 5;
            logGuide.label = ".005";
            logGuide.lineAlpha = .3;
        }
        else {
            logGuide.tickLength = 0;
        }
        x+=.001;
        logGuide.lineColor = "blue";
        yAxis.addGuide(logGuide);
    }

    x = .01;
    for (var i = 0; i < 10; i++) {
        var logGuide = new AmCharts.Guide();
        logGuide.lineAlpha = .15;
        logGuide.value = x;
        if (logGuide.value == .05) {
            logGuide.tickLength = 5;
            logGuide.label = ".05";
            logGuide.lineAlpha = .3;
        }
        else {
            logGuide.tickLength = 0;
        }
        x+=.01;
        logGuide.lineColor = "blue";
        yAxis.addGuide(logGuide);
    }

    x = .1;
    for (var i = 0; i < 10; i++) {
        var logGuide = new AmCharts.Guide();
        logGuide.value = x;
        logGuide.lineAlpha = .15;
        logGuide.value = x;
        if (logGuide.value == .5) {
            logGuide.tickLength = 5;
            logGuide.label = ".5";
            logGuide.lineAlpha = .3;
        }
        else {
            logGuide.tickLength = 0;
        }
        x+=.1;
        logGuide.lineColor = "blue";
        yAxis.addGuide(logGuide);
    }

    x = 1;
    for (var i = 0; i < 10; i++) {
        var logGuide = new AmCharts.Guide();
        logGuide.value = x;
        logGuide.lineAlpha = .15;
        logGuide.value = x;
        if (logGuide.value == 5) {
            logGuide.tickLength = 5;
            logGuide.label = "5";
            logGuide.lineAlpha = .3;
        }
        else {
            logGuide.tickLength = 0;
        }
        x+=1;
        logGuide.lineColor = "blue";
        yAxis.addGuide(logGuide);
    }

    x = 10;
    for (var i = 0; i < 10; i++) {
        var logGuide = new AmCharts.Guide();
        logGuide.value = x;
        logGuide.lineAlpha = .15;
        logGuide.value = x;
        if (logGuide.value == 50) {
            logGuide.tickLength = 5;
            logGuide.label = "50";
            logGuide.lineAlpha = .3;
        }
        else {
            logGuide.tickLength = 0;
        }
        x+=10;
        logGuide.lineColor = "blue";
        yAxis.addGuide(logGuide);
    }

    x = 100;
    for (var i = 0; i < 10; i++) {
        var logGuide = new AmCharts.Guide();
        logGuide.value = x;
        logGuide.lineAlpha = .15;
        logGuide.value = x;
        if (logGuide.value == 500) {
            logGuide.tickLength = 5;
            logGuide.label = "500";
            logGuide.lineAlpha = .3;
        }
        else {
            logGuide.tickLength = 0;
        }
        x+=100;
        logGuide.lineColor = "blue";
        yAxis.addGuide(logGuide);
    }

    //Adding xAxis guidelines
    x = 1;
    for (var i = xAxis.minimum; i < xAxis.maximum; i++) {
        var xAxisGuide = new AmCharts.Guide();
        xAxisGuide.lineAlpha = .15;
        xAxisGuide.value = x;
        if (xAxisGuide.value%7 == 0) {
            xAxisGuide.tickLength = 5;
            xAxisGuide.label = xAxisGuide.value;
            xAxisGuide.lineAlpha = .3;
        }
        else {
            xAxisGuide.tickLength = 5;
        }
        x+=1;
        xAxisGuide.lineColor = "blue";
        xAxis.addGuide(xAxisGuide);
    }

    // GRAPHS
    var graph1 = new AmCharts.AmGraph();
    graph1.lineColor = "#42647F";
    graph1.balloonText = "x:[[x]] y:[[y]]";
    graph1.xField = "ax";
    graph1.yField = "ay";
    graph1.lineAlpha = 0;
    graph1.bullet = "round";
    chart.addGraph(graph1);

    // first trend line
    var trendLine = new AmCharts.TrendLine();
    trendLine.lineColor = "#42647F";
    trendLine.initialXValue = 1;
    trendLine.initialValue = 2;
    trendLine.finalXValue = 12;
    trendLine.finalValue = 11;
    chart.addTrendLine(trendLine);

    // CURSOR
    var chartCursor = new AmCharts.ChartCursor();
    chart.addChartCursor(chartCursor);

    // SCROLLBAR
    /*var chartScrollbar = new AmCharts.ChartScrollbar();
    chart.addChartScrollbar(chartScrollbar);*/

    // WRITE                                                
    chart.write("chartdiv");
});