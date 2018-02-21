import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as d3 from "d3";

// Based on http://bl.ocks.org/msqr/3202712
// another good example https://swizec.com/blog/how-to-make-a-piechart-using-react-and-d3/swizec/6785
// very good library ----> https://bl.ocks.org/d3indepth
// for animation : http://blog.scottlogic.com/2015/09/03/d3-without-d3.html
// speed meter : full code https://github.com/palerdot/react-d3-speedometer/blob/master/src/index.js
//needle rostation: https://stackoverflow.com/questions/38585575/d3-js-gauge-needle-rotate-with-dynamic-data


//ToDo  ::::  claen up varialbles, use properties and states properly
//            Refactor functions
//             What you learnt  : 
//             Pie chart angle calculations, 
//            Template strings (backticks)
//            using tween functions in d3...
//            intpropelateing functions

//color interpolators https://www.alanzucconi.com/2016/01/06/colour-interpolation/
// cold cool warm hot ---> 4 color interpolator



export class PieBasiclChart extends React.Component {   
  constructor(props) {
    super();


 }

 render = () => {
    // For a real world project, use something like
    // https://github.com/digidem/react-dimensions
    let width = this.props.width;
    let height = this.props.height;
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
        <Pie x={x} y={y} radius={radius} data={[1, 3, 4, 5, 6, 7, 8,9,10 ]} conf={this.props}/>
      </svg>
    );
  }


};

class Pie extends React.Component {
  constructor (props) {
    super(props);
    // https://github.com/d3/d3/wiki/Ordinal-Scales#category10
    //this.colorScale = d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'));
    //Good resource for intrepolating colors 
    // HTTP  --> https://bl.ocks.org/EfratVil/903d82a7cde553fb6739fe55af6103e2

    this.colorScale = d3.interpolateHsl(d3.rgb('#00ff11'), d3.rgb('#fbff00'))
    // This sets the radius of the pie chart to fit within
    // the current window size, with some additional padding
     let minViewportSize = Math.min(this.props.conf.width, this.props.conf.height);// move up

     this.outerRadius = (minViewportSize * .9) / 2;// move up

  }

  render = () => {
    let {x, y, data} = this.props;
    // https://github.com/d3/d3/wiki/Pie-Layout
    // Set piechart start and end angles ie full donut, half donut or quater donut.
    let pie = d3.pie().startAngle(-0.5 * Math.PI).endAngle(0.5 * Math.PI);  // toDo :Replace angles with start/end variables
    return (
      <g transform={`translate(${x}, ${y})`}>
        {pie(data).map( /* Render a slice for each data point */
                      (value, i ) => <Slice key={i}
                               value={value}
                               fill={this.colorScale((0.25)*i)}
                                innerRadius={this.props.conf.innerRadius}
                                outerRadius={this.outerRadius}  />
          )}
      </g>
    );
  }

}

class Slice extends React.Component {
  componentDidMount() { 
         let arc = d3.arc().innerRadius(this.props.innerRadius).outerRadius(this.props.outerRadius);

         var path = d3.select(this.refs.path).attr('d',arc(this.props.value));

// folow example http://bl.ocks.org/mbostock/5100636
// this.props.value is arry that contains start and end angles

   //  .transition()
   //  .delay(function(d, i) {
   //    return i * 800;
   //  })
   //      .attrTween('d', function(d) {
   // var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
   // return function(t) {
   //     d.endAngle = i(t);
   //   return arc(d);
   // }
   }

  render = () => {
    let {value, fill, innerRadius = 0, outerRadius} = this.props;
    // https://github.com/d3/d3/wiki/SVG-Shapes#arc
    // for alice settings see http://d3indepth.com/shapes/#arc-generator
    // can add the following to make prettier .padAngle(.02) .padRadius(100) .cornerRadius(4);
    let arc = d3.arc().innerRadius(this.props.innerRadius).outerRadius(this.props.outerRadius)
  
    return (
      <path ref='path' d={[]} fill={fill} stroke='white' />
    );
  }
}


      PieBasiclChart.propTypes = {
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
        value:PropTypes.number,
        scale:PropTypes.func,

                                
             
    }
    // use shape ie : 
    //  propTypes: {
    //   data: PropTypes.shape({
    //     id: PropTypes.number.isRequired,
    //     title: PropTypes.string
    //  })
    // }
    PieBasiclChart.defaultProps = {
    
            width: 500,
            height: 500,
            radius:100,
            innerRadius:100,
            pi:PropTypes.number,
            color: d3.schemeCategory10,
            outerRadius:200,
            pi:PropTypes.number,
            chartId: 'halfPie_chart',
            minValue : 0,
            maxValue: 10,
            minAngle: -90,
            maxAngle: 90,
            majorTicks: 5,
            labelInset: 10,
            value:6,
            scale:d3.scaleLinear().range([0, 1]).domain([0, 10]),
           


    }
export default PieBasiclChart;
