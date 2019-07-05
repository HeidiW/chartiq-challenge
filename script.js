
    const fetch = require("node-fetch");
    fetch('https://s3.amazonaws.com/www.heidiwilliamsfoy.com/ibm.csv').then(response => response.text()).then(rawData => {
      const objectData = Papa.parse(rawData, { header: true }).data;

      // Transform the parsed JS object to match the x/y data points expected from CanvasJS
      const dataPoints = objectData.map(row => ({
        x: new Date(row.Date),
        y: parseFloat(row.Close) 
      }));

      const chart = new CanvasJS.Chart("chartContainer", {
        title: {
          fontFamily: 'Roboto',
          text: "Moving Average Closing Price of IBM",
          padding: 10,
        },
        axisX: {
          labelAngle: -30,
          valueFormatString: "MMM-DD-YY"
        },
        axisY: {
          includeZero: false,
          labelFormatter: e => `$${CanvasJS.formatNumber(e.value, "0.00")}`,
          interval: 1
        },
        data: [{
          type: "spline",
          connectNullData:true,
          dataPoints,
          markerSize: 10,
          name: "Closing Price",
          toolTipContent: "{x}</br>{name}: <strong>{y}</strong> USD",
        }],

        theme: "dark2"
      });

      chart.render();
    });