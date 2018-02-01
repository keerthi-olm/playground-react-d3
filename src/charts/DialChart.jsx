import React from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as d3 from "d3";

// Based on http://bl.ocks.org/msqr/3202712
// another good example https://swizec.com/blog/how-to-make-a-piechart-using-react-and-d3/swizec/6785




export class DialChart extends React.Component {   
constructor(props) {
    super();

    this.pie = d3.pie().value((d) => d.value);
    this.colors = d3.scaleOrdinal(d3.schemeCategory10);
        this.range = props.maxAngle - this.minAngle;
    this.r = props.size / 2;
    this.pointerHeadLength = Math.round(this.r * props.pointerHeadLengthPercent);

    // a linear scale that maps domain values to a percent from 0..1
    this.scale = d3.scale.linear()
      .range([0,1])
      .domain([props.minValue, props.maxValue]);
      
    this.ticks = this.scale.ticks(props.majorTicks);
    this.tickData = d3.range(props.majorTicks).map(function() {return 1/props.majorTicks;});
    
    this.arc = d3.svg.arc()
      .innerRadius(this.r - props.ringWidth - props.ringInset)
      .outerRadius(this.r - props.ringInset)
      .startAngle(function(d, i) {
        var ratio = d * i;
        let deg =props.minAngle + (this.ratio * this.range)
        return deg => deg * Math.PI / 180;
      })
      .endAngle(function(d, i) {
        var ratio = d * (i+1);
        let deg =props.minAngle + (this.ratio * this.range)
        return deg => deg * Math.PI / 180;
      });

 }
  deg2rad(deg) {
    return deg * Math.PI / 180;
  }
  
  newAngle(d) {
    var ratio = scale(d);
    var newAngle = this.props.minAngle + (ratio * range);
    return newAngle;
  }
  renderAnother() {
    var svg = d3.select(container)
      .append('svg:svg')
        .attr('class', 'gauge')
        .attr('width', this.props.clipWidth)
        .attr('height', this.props.clipHeight);
    
    var centerTx = 'translate('+r +','+ r +')';
    
    var arcs = svg.append('g')
        .attr('class', 'arc')
        .attr('transform', centerTx);
    
    arcs.selectAll('path')
        .data(tickData)
      .enter().append('path')
        .attr('fill', function(d, i) {
          return this.props.arcColorFn(d * i);
        })
        .attr('d', arc);
    
    var lg = svg.append('g')
        .attr('class', 'label')
        .attr('transform', centerTx);
    lg.selectAll('text')
        .data(ticks)
      .enter().append('text')
        .attr('transform', function(d) {
          var ratio = scale(d);
          var newAngle = this.props.minAngle + (ratio * range);
          return 'rotate(' +newAngle +') translate(0,' +(this.props.labelInset - r) +')';
        })
        .text(this.props.labelFormat);

    var lineData = [ [this.props.pointerWidth / 2, 0], 
            [0, -pointerHeadLength],
            [-(this.props.pointerWidth / 2), 0],
            [0, this.props.pointerTailLength],
            [this.props.pointerWidth / 2, 0] ];
        return (
            <g transform={translate}>
                {pie.map((d, i) => this.arcGenerator(d, i))}
            </g>
        )
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