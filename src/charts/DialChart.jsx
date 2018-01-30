import React from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as d3 from "d3";

// Based on http://bl.ocks.org/msqr/3202712






export class DialChart extends React.Component {   

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
        <Pie x={x} y={y} radius={radius} data={[5, 2, 7, 1, 1, 3, 4, 9]} />
      </svg>
    );
  }


};

class Pie extends React.Component {
  constructor(props) {
    super(props);
    // https://github.com/d3/d3/wiki/Ordinal-Scales#category10
    this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    this.renderSlice = this.renderSlice.bind(this);
  }

  render() {
    let {x, y, data} = this.props;
    // https://github.com/d3/d3/wiki/Pie-Layout
    let pie = d3.pie();
    return (
      <g transform={`translate(${x}, ${y})`}>
        {/* Render a slice for each data point */}
        {pie(data).map(this.renderSlice)}
      </g>
    );
  }

  renderSlice(value, i) {
    // We'll create this component in a minute
    return (
      <Slice key={i}
             outerRadius={this.props.radius}
             value={value}
             fill={this.colorScale(i)} />
    );
  }
}

class Slice extends React.Component {
  render() {
    let {value, fill, innerRadius = 0, outerRadius} = this.props;
    // https://github.com/d3/d3/wiki/SVG-Shapes#arc
    let arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);
    return (
      <path d={arc(value)} fill={fill} />
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
        color:PropTypes.func 
             
    }
    DialChart.defaultProps = {
    
            width: 300,
            height: 300,
            radius:100,
            innerRadius:50,
            pi:PropTypes.number,
            chartId: 'halfPie_chart',
            color: d3.schemeCategory10


    }
export default DialChart;
window.DialChart=DialChart;