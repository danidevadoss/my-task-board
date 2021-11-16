import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const HighchartsWrapper = (props) => {
  //  console.log(props.chartData); // this is always correct

    let options = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Task Status'
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false,
                },
                showInLegend: true,
                colors:['#4d9ce6','#ddc722','#39ca1c']
            },
           
        },
        legend: {
            labelFormat: '<b>{name}</b> : {y}'
        },
        series: [{
            name: 'Status',
            colorByPoint: true,
            data: props.chartData
        }]
    };


    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
            oneToOne={true}
        />
    );
}

export default HighchartsWrapper;
