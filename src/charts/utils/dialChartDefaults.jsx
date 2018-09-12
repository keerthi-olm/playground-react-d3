import PropTypes from 'prop-types';
import * as d3 from "d3";

export default () => { 
	return ( 
		{
defaultProps :{
    
            width: 500,
            height: 500,
            radius:100,
            innerRadius:100,
            pi:PropTypes.number,
            chartId: 'halfPie_chart',
            color: d3.schemeCategory10,
            outerRadius:200,
            pi:PropTypes.number,
            chartId: 'halfPie_chart',
            color: d3.schemeCategory10,
            minValue : 0,
            maxValue: 10,
            minAngle: -90,
            maxAngle: 90,
            majorTicks: 5,
            labelInset: 10,
            value:6,
            scale:d3.scaleLinear().range([0, 1]).domain([0, 100]),
            needleConf:      {
                                ringInset: 20,
                                needleWidth: 15,
                                needleTailLength: 5,
                                needleHeadLengthPercent: .95,
                                minAngle: -90,
                                maxAngle: 90,
                                labelInset: 10,
                                parentWidth: 200,
                                parentHeight: 100,
                                innerRadius:20,
                                outerRadius:100
                              },
            data: [4,8,13,15,18,30,40 ]


    }

    })//return

}//End