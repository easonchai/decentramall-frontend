import React, { useEffect } from 'react';
import Chart from 'chart.js';

export default function Graph(){
  useEffect(() => {
    var ctx = document.getElementById("myChart");
    var data = {
        labels: Array.from({length: 1200}, (_, i) => i + 1),
        datasets: [{
            label: "Price (DAI)",
            function: function(x) { 
                return 2500*((x-600)/Math.sqrt(100000+(x-600)**2) + 1) 
            },
            borderColor: "#ffa45c",
            data: [],
            fill: false
        }]
    };

    Chart.pluginService.register({
        beforeInit: function(chart) {
            var data = chart.config.data;
            for (var i = 0; i < data.datasets.length; i++) {
                for (var j = 0; j < data.labels.length; j++) {
                    var fct = data.datasets[i].function,
                        x = data.labels[j],
                        y = fct(x);
                    data.datasets[i].data.push(y);
                }
            }
        }
    });

    var myBarChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });

  },[]);

    return(<canvas id="myChart"></canvas>)
}