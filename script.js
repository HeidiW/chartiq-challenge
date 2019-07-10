//first, get data from CSV and return it as array
    const dataPoints = [];
    $.get("https://s3.amazonaws.com/www.heidiwilliamsfoy.com/ibm.csv", function(data) {
    function getDataPointsFromCSV(csv) {
    let objectData = csvLines = points = [];
    csvLines = csv.split(/[\r?\n|\r|\n]+/);
        
    for (var i = 0; i < csvLines.length; i++)
        if (csvLines[i].length > 0) {
            points = csvLines[i].split(",");
            dataPoints.push({ 
                x: points[0], 
                y: parseFloat(points[4]) 		
	    });
	 }
    return dataPoints;
   }
   //then, create the chart
   const chart = new CanvasJS.Chart("chartContainer", {
    title: {
      text: "Column Chart with 20 Day Simple Moving Average"
    },
    toolTip: {
      shared: true
    },
    axisY: {
      includeZero: false
    },
    axisX: {
      valueFormatString: "DD-MMM-YY"
    },
    data: [{
      type: "spline",
      xValueFormatString: "DD(DDD) MMM YY(YYY)",
      yValueFormatString: "#,##0.00",
      name: "Stock Price",
      dataPoints
    }]
  });
  
  calculateMovingAverage(chart);
  chart.render();

  //calculate the moving average from the datapoints
  // Function to calculate n-Day Simple moving average
  function calculateMovingAverage(chart) {
    const numOfDays = 20;
    // return if there are insufficient dataPoints
    if(chart.options.data[0].dataPoints.length <= numOfDays) return;
    else {
      // Add a new line series for  Moving Averages
      chart.options.data.push({
        type: "",
        markerSize: 0,
        name: "Moving Average of IBM Stock Over 20 Day Period",
        yValueFormatString: "#,##0.00",
        dataPoints: []
      });
      var total;
      for(var i = numOfDays; i < chart.options.data[0].dataPoints.length; i++) {
        total = 0;
        for(var j = (i - numOfDays); j < i; j++) {
          total += chart.options.data[0].dataPoints[j].y;
        }
        chart.options.data[1].dataPoints.push({
          x: chart.options.data[0].dataPoints[i].x,
          y: total / numOfDays
        });
      }
    }
  }