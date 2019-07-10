// set up the CSV conversion function
function getDataPointsFromCSV(csv) {
    const dataPoints = [];
    let points = [];
    let csvLines = csv.split(/[\r?\n|\r|\n]+/);

    for (var i = 1; i < csvLines.length; i++) {
        if (csvLines[i].length > 0) {
            points = csvLines[i].split(",");
            dataPoints.push({
                x: new Date(points[0]),
                y: parseFloat(points[4])
            });
        }
    }
    return dataPoints;
}


// Take the data from the chart and calculate the 20-day moving average closing price
function calculateMovingAverage(chart) {
    let newPoints = [];
    let numOfDays = 20;
    const chartData = chart.options.data[0].dataPoints;

    for(let i = numOfDays; i < chartData.length; i++) {
        let total = 0;

        for(let j = i - numOfDays; j < i; j++) {
            total += chartData[j].y;
        }

        newPoints.push({
            x: chartData[i].x,
            y: total / numOfDays
        });
    }

    // once all the data is calculated, we add a new line
    chart.options.data.push({
        type: "spline",
        markerSize: 0,
        name: "Moving Average of IBM Stock Over 20 Day Period",
        dataPoints: newPoints,
        toolTipContent: "{x}</br>{name}: <strong>{y}</strong> USD"
    });
}


// First, get the csv, then run the function as a callback
$.get("https://s3.amazonaws.com/www.heidiwilliamsfoy.com/chartiq-challenge/ibm.csv", function(response) {
    const chart = new CanvasJS.Chart("chartContainer", {
        title: {
            fontFamily: 'Roboto',
            text: "IBM 20-Day Moving Average",
            padding: 10,
        },
        axisX: {
            labelAngle: -30,
        },
        axisY: {
            includeZero: false,
            labelFormatter: e => `$${CanvasJS.formatNumber(e.value, "0.00")}`
        },
        data: [{
            dataPoints: getDataPointsFromCSV(response),
            markerSize: 5,
            name: "Closing Price",
            toolTipContent: "{x}</br>{name}: <strong>{y}</strong> USD",
            type: "spline",
            xValueFormatString: "MM-DD-YY",
        }],
        theme: "dark2"
    });

    // after setting up the chart object, add the second line for the moving average
    calculateMovingAverage(chart);

    // when everything's done, render the chart
    chart.render();
});
