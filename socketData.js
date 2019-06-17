// By: Vikrant Sharma
//display intial chart with no data
var canvas = document.getElementById("myChart");
var data = {
    labels: [],
    datasets: [
        {
            label: "Chlorine Levels (ppm)",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            data: [],
        }
    ]
};

var option = {
    showLines: true,
    title: {
            display: true,
            text: 'Location'
        }
};

var myChart = Chart.Line(canvas,{
    data:data,
    options:option
});


// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:8080');

// Connection open
socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
});

// Listen for messages and update chart
socket.addEventListener('message', function (event) {
    var result = JSON.parse(event.data);

    //if array then loop through elements --> go through intial 24 hours of previous data
    if (Array.isArray(result)){ 
        for (var i = 0; i < result.length; i++){
            //add data element to chart
            var add = [{ x: result[i].timestamp, y: result[i].value, loc: result[i].orgName }];
            if (add[0].y) { // if not null then use data
                myChart.data.labels.push(add[0].x);
                myChart.data.datasets[0].data.push(add[0].y);
                //console.log(add[0]);
                myChart.update();

                //check level and alert operator
                if (add[0].y < 1){
                    alert("Chlorine level is below 1.0 ppm!\nCurrent level is: " + add[0].y);
                } else if (add[0].y > 3){
                    alert("Chlorine level is above 3.0 ppm!\nCurrent level is: " + add[0].y);
                }

                //change location title based on server data
                myChart.options.title.text = add[0].loc;
            } 

        }
    } else { //add data
        //console.log('here');
        var add = [{ x: result.timestamp, y: result.value, loc: result.orgName }];
        //console.log(add[0]);

        if (add[0].y) { // if not null then use data
            myChart.data.labels.push(add[0].x);
            myChart.data.datasets[0].data.push(add[0].y);
            myChart.update(); 

            //check level and alert operator
            if (add[0].y < 1){
                alert("Chlorine level is below 1.0 ppm!\nCurrent level is: " + add[0].y);
            } else if (add[0].y > 3){
                alert("Chlorine level is above 3.0 ppm!\nCurrent level is: " + add[0].y);
            } 

            //change location title based on server data
            myChart.options.title.text = add[0].loc;               
        }
           
    }
});