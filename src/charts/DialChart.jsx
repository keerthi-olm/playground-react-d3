import React from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as d3 from "d3";

// Based on http://bl.ocks.org/msqr/3202712
// another good example https://swizec.com/blog/how-to-make-a-piechart-using-react-and-d3/swizec/6785
// very good library ----> https://bl.ocks.org/d3indepth
// for animation : http://blog.scottlogic.com/2015/09/03/d3-without-d3.html
// speed meter : full code https://github.com/palerdot/react-d3-speedometer/blob/master/src/index.js

export class DialChart extends React.Component {   
  constructor(props) {
    super();

    this.pointerHeadLength = Math.round(this.r * props.pointerHeadLengthPercent);

 }
  deg2rad(deg) {
    return deg * Math.PI / 180;
  }
  
  newAngle(d) {
    var ratio = this.scale(d);
    var newAngle = this.props.minAngle + (this.ratio * this.range);
    return newAngle;
  }

 render() {
    // For a real world project, use something like
    // https://github.com/digidem/react-dimensions
    let width = 500;
    let height = 500;
    let minViewportSize = Math.min(width, height);
    // This sets the radius of the pie chart to fit within
    // the current window size, with some additional padding
    let radius = (minViewportSize * .9) / 2;
    // Centers the pie chart
    let x = width / 2;
    let y = height / 2;

    return (
      <svg width= {width} height={height}>
        {/* We'll create this component in a minute */}
        <Pie x={x} y={y} radius={radius} data={[5, 2, 7, 1, 1, 3, 4,9,5, 2, ]} />
      </svg>
    );
  }


};

class Pie extends React.Component {
  constructor(props) {
    super(props);
    // https://github.com/d3/d3/wiki/Ordinal-Scales#category10
    this.colorScale = d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'));

  }

  render() {
    let {x, y, data} = this.props;
    // https://github.com/d3/d3/wiki/Pie-Layout
    // Set piechart start and end angles ie full donut, half donut or quater donut.
    let pie = d3.pie().startAngle(-0.5 * Math.PI).endAngle(0.5 * Math.PI);
    return (
      <g transform={`translate(${x}, ${y})`}>
        {pie(data).map( /* Render a slice for each data point */
                      (value, i) => <Slice key={i}
                               value={value}
                               fill={this.colorScale(0.05*i)} />
          )}
      </g>
    );
  }

}

class Slice extends React.Component {
  render() {
    let {value, fill, innerRadius = 0, outerRadius} = this.props;
    // https://github.com/d3/d3/wiki/SVG-Shapes#arc
    let arc = d3.arc().innerRadius(20).outerRadius(100);
    return (
      <path d={arc(value)} fill={fill} stroke='white'/>
    );
  }
}
    DialChart.propTypes = {
        width:PropTypes.number,
        height:PropTypes.number,
        radius:PropTypes.number,
        innerRadius:PropTypes.number,
        pi:PropTypes.number,
        chartId:PropTypes.string,
        color:PropTypes.func,
        width:PropTypes.number,
        height:PropTypes.number,
        radius:PropTypes.number,
        innerRadius:PropTypes.number,
        pi:PropTypes.number,
        chartId:PropTypes.string,
        color:PropTypes.func,
        minValue :PropTypes.number,
        maxValue: PropTypes.number,
        minAngle: PropTypes.number,
        maxAngle: PropTypes.number,
        majorTicks:PropTypes.number,
        labelInset: PropTypes.number 
             
    }
    DialChart.defaultProps = {
    
            width: 300,
            height: 300,
            radius:100,
            innerRadius:50,
            pi:PropTypes.number,
            chartId: 'halfPie_chart',
            color: d3.schemeCategory10,
            width: 300,
            height: 300,
            radius:100,
            innerRadius:50,
            pi:PropTypes.number,
            chartId: 'halfPie_chart',
            color: d3.schemeCategory10,
            minValue : 0,
            maxValue: 10,
            minAngle: -90,
            maxAngle: 90,
            majorTicks: 5,
            labelInset: 10


    }
export default DialChart;
window.DialChart=DialChart;