import React from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as d3 from "d3";

// Based on http://bl.ocks.org/msqr/3202712
// another good example https://swizec.com/blog/how-to-make-a-piechart-using-react-and-d3/swizec/6785
// very good library ----> https://bl.ocks.org/d3indepth
// for animation : http://blog.scottlogic.com/2015/09/03/d3-without-d3.html
// speed meter : full code https://github.com/palerdot/react-d3-speedometer/blob/master/src/index.js
//needle rostation: https://stackoverflow.com/questions/38585575/d3-js-gauge-needle-rotate-with-dynamic-data

export class DialChart extends React.Component {   
  constructor(props) {
    super();

    this.pointerHeadLength = Math.round(this.r * props.pointerHeadLengthPercent);

 }
  deg2rad = (deg)=>{
    return deg * Math.PI / 180;
  }
  
  newAngle = (d)=>{
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
       <Pointer value={this.props.value} />
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

class Pointer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: this.props.value };
   this.pointer_config = {
                ringInset: 20,

                pointerWidth: 10,
                pointerTailLength: 5,
                pointerHeadLengthPercent: 0.9,

                minAngle: -90,
                maxAngle: 90,

                labelInset: 10,

                // calculate the ReactSpeedometer 'parentNode' width/height; it might be used if fluidWidth: true
                parentWidth: 200,
                parentHeight: 100
            };
              this.pointerLine = d3.line().curve('d3CurveMonotoneX' );
      var r = 300 / 2;
                this.pointerHeadLength = Math.round(r * this.pointer_config.pointerHeadLengthPercent)
      this.line= [             [this.pointer_config.pointerWidth / 2, 0],
                    [0, -(this.pointerHeadLength)],
                    [-(this.pointer_config.pointerWidth / 2), 0],
                    [0, this.pointer_config.pointerTailLength],
                    [this.pointer_config.pointerWidth / 2, 0]
                  ];

    
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if(nextState.value !== this.state.value) {
    console.log(this.pointer_config.minAngle);
const g = d3.select(this.refs.g);
var pointerLine=d3.line();
              g.data([this.line])
                            .attr('class', 'pointer')
                            .attr('transform', 'translate(' + 250 + ',' + 250 + ')')
                            .style("fill", 'red')
                            .style("stroke", "red");
                            g.append('path')
                                            .attr('d', pointerLine )   .transition().duration(4000).attrTween("transform", function(interpolate) {
        return d3.interpolateString("rotate(" +(-90)+")", "rotate(" + 30 + ")");
      })
          return true
    } 
    console.log('not changed------------');
    return false
    
  }
  
    // every few seconds update reading values
  componentDidMount() {
    this.interval = setInterval(() => {this.setState({value:Math.floor(Math.random() * 10)});}, 3000);
  }


  render() {

    return (
      <g ref='g'></g>
      
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
        labelInset: PropTypes.number,
        value:PropTypes.number
             
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
            labelInset: 10,
            value:6


    }
export default DialChart;
window.DialChart=DialChart;