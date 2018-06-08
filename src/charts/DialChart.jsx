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



export class DialChart extends React.Component {   
  constructor(props) {
    super();

    this.needleHeadLength = Math.round(this.r * props.needleHeadLengthPercent);

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
        <Pie x={x} y={y} radius={radius} data={[5, 2, 7, 1, 1, 3, 4,9,5, 2, ]} conf={this.props}/>
       <Pointer value={this.props.value} scale={this.props.scale} conf={this.props.needleConf} pieWidth={width} pieHeight={height}/>
      </svg>
    );
  }


};

class Pie extends React.Component {
  constructor (props) {
    super(props);
    // https://github.com/d3/d3/wiki/Ordinal-Scales#category10
    this.colorScale = d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'));
    // this.colorScale = d3.interpolateHsl(d3.rgb('#ff0000'), d3.rgb('#000dff'))
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
                               fill={this.colorScale(0.05*i)}
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

         var path = d3.select(this.refs.path).data([this.props.value]).attr('d',arc(this.props.value))
            .transition()
            .duration(2000)
            .attrTween("d", function (d) { 
                var start = {startAngle: (-0.5 * Math.PI), endAngle: (0.5 * Math.PI)};
               //  var start = {startAngle: 0 , endAngle: 0}; // Play around with start and end angles 0 0 strats at top
                var interpolate = d3.interpolate(start, d);
                return function (t) {
                    return arc(interpolate(t));
                };
            });


// folow example http://bl.ocks.org/mbostock/5100636
// this.props.value is arry that contains start and end angles
//OR https://stackoverflow.com/questions/34434127/d3-js-smooth-transition-on-arc-draw-for-pie-chart

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
   //});
//-------------- another way to animate  -----------
          // .attrTween("d", function (d) { 
          //       var start = {startAngle: 0, endAngle: 0};
          //       var interpolate = d3.interpolate(start, d);
          //       return function (t) {
          //           return arc(interpolate(t));
          //       };
          //   });

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

class Pointer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: this.props.value };
    this.pointer_config  = props.conf;

    this.pointerLine = d3.line().curve('d3CurveMonotoneX' );
    let minViewportSize = Math.min(this.props.pieWidth, this.props.pieHeight);// move up
    this.outerRadius = (minViewportSize * .9) / 2; // move up
                this.needleHeadLength = Math.round(this.outerRadius * this.pointer_config.needleHeadLengthPercent)
      this.line= [  [this.pointer_config.needleWidth / 2, 0],
                    [0, -(this.needleHeadLength)],
                    [-(this.pointer_config.needleWidth / 2), 0],
                    [0, this.pointer_config.needleTailLength],
                    [this.pointer_config.needleWidth / 2, 0]
                  ];

    this.pointerLine=d3.line(); 
  }

  shouldComponentUpdate = (nextProps, nextState, nextContext) => {

    if(nextState.value !== this.state.value) {
        this.update(nextState.value,this.state.value);
        return false
    } else if (nextState.value === this.state.value) return false

     // if other properties change and want to initate a render the put more condiotions here on other states 
  }
  
    // every few seconds update reading values
  componentDidMount() {
    const g = d3.select(this.refs.g);
     // move up
    g.data([this.line])
                            .attr('class', 'pointer')
                            .attr('transform', 'translate(' + this.props.pieHeight /2 + ',' + this.props.pieWidth / 2 + ')')
                            .style("fill", 'red')
                            .style("stroke", "red").style('stroke-linejoin',"round").append('path').attr('d', this.pointerLine);
   this.update(this.state.value);
   this.interval = setInterval(() => {this.setState({value:Math.floor(Math.random() * 10)});}, 7000);
  }

 update =(value,oldValue=5)=> {

    var scale = this.props.scale  //d3.scaleLinear().range([0, 1]).domain([0, 10]); //move up

    var range = this.pointer_config.maxAngle - this.pointer_config.minAngle;   
    var newAngle = this.getAngle(value,scale);  //this.pointer_config.minAngle + (ratio * range); 
    var oldAngle =  this.getAngle(oldValue,scale);//this.pointer_config.minAngle + (oldRatio * range);         
  
    const g = d3.select(this.refs.g.childNodes[0]);
                g.transition().duration(7000).attrTween("transform", function
                  (interpolate) {
         return d3.interpolateString("rotate(" + (oldAngle)+")", "rotate(" + newAngle + ")");
    });
        
  }
  getAngle = (value,scale)=>{ //move up
    let ratio = scale(value); 
    let range = this.pointer_config.maxAngle - this.pointer_config.minAngle; 
    return  this.pointer_config.minAngle + (ratio * range);  
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
        value:PropTypes.number,
        scale:PropTypes.func,
        needleConf: PropTypes.shape({
                                      ringInset: PropTypes.number,
                                      needleWidth: PropTypes.number,
                                      needleTailLength: PropTypes.number,
                                      needleHeadLengthPercent: PropTypes.number,
                                      minAngle: PropTypes.number,
                                      maxAngle: PropTypes.number,
                                      labelInset: PropTypes.number,
                                      parentWidth: PropTypes.number,
                                      parentHeight: PropTypes.number,
                                      innerRadius:PropTypes.number,
                                      outerRadius:PropTypes.number
                                    })
                                
             
    }
    // use shape ie : 
    //  propTypes: {
    //   data: PropTypes.shape({
    //     id: PropTypes.number.isRequired,
    //     title: PropTypes.string
    //  })
    // }
    DialChart.defaultProps = {
    
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
            scale:d3.scaleLinear().range([0, 1]).domain([0, 10]),
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
                              }


    }
export default DialChart;
window.DialChart=DialChart;