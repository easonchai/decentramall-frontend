import React, { useEffect } from 'react';
import Chart from 'chart.js';

interface Props{
    current:number;
}

export default function Graph(props: Props){
    //To do: make label only depend on the current supply
    useEffect(() => {
        var ctx = document.getElementById("myChart");
        var data = {
            labels: current,
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
                for (var j = 0; j < data.labels.length; j++) {
                    var fct = data.datasets[0].function,
                        x = data.labels[j],
                        y = fct(x);
                    data.datasets[0].data.push(y);
                }
            }
        });

        new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        }
                    }]
                }
            }
        });
    },[]);

    return(<canvas id="myChart"></canvas>)
}