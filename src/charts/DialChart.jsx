import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from "d3";
import DialChartDeafults from '../charts/utils/dialChartDefaults'


//             Pie chart angle calculations, 
//            Template strings (backticks)
//            using angle rotate tween functions in d3...
//            intpropelateing functions



export class DialChart extends React.Component {   
  constructor(props) {
    super();
   this.state = {data:[...props.data],value: 50};
    this.needleHeadLength = Math.round(this.r * this.state.needleHeadLengthPercent);

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

    return (<div>
      <svg  viewBox={`0 0 ${width} ${height/2+30}`} preserveAspectRatio="xMinYMid meet">
        {/* We'll create this component in a minute */}
        <Pie x={x} y={y} radius={radius} data={this.state.data} conf={this.props}/>
       <Pointer value={this.state.value} scale={this.props.scale} conf={this.props.needleConf} pieWidth={width} pieHeight={height}/>
      </svg>
      <button onClick={this.play}>Play again</button>
      </div>
    );
  }
  play=()=> {this.setState({...this.state,value:Math.floor(Math.random() * 100)})}
 
};

class Pie extends React.Component {
  constructor (props) {
    super(props);
    //Color range for pie slices
    this.colorScale = d3.interpolateHsl(d3.rgb('#00ff11'), d3.rgb('#ff0000'))
     //this.colorScale = d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'));
     let minViewportSize = Math.min(this.props.conf.width, this.props.conf.height);// move up

     this.outerRadius = (minViewportSize * .9) / 2;// move up

  }

  render = () => {

    let {x, y, data} = this.props;
    // https://github.com/d3/d3/wiki/Pie-Layout
    // Set piechart start and end angles ie full donut, half donut or quater donut.
    let pie = d3.pie().startAngle(0.5 * Math.PI).endAngle(-0.5 * Math.PI);  // toDo :Replace angles with start/end variables
    return (
      <g transform={`translate(${x}, ${y})`}>
        {pie(data).map( /* Render a slice for each data point */
                      (value, i ) => <Slice key={i}
                               value={value}
                               fill={this.colorScale(0.15*i)}
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
                var start = {startAngle: (0.5 * Math.PI), endAngle: (-0.5 * Math.PI)};
               //  var start = {startAngle: 0 , endAngle: 0}; // Play around with start and end angles 0 0 strats at top
                var interpolate = d3.interpolate(start, d);
                return function (t) {
                    return arc(interpolate(t));
                };
            });

   }
 componentDidUpdate() { 
         let arc = d3.arc().innerRadius(this.props.innerRadius).outerRadius(this.props.outerRadius);

         var path = d3.select(this.refs.path).data([this.props.value]).attr('d',arc(this.props.value));
            
   }

  render = () => {
     
    let {value, fill, innerRadius = 0, outerRadius} = this.props;
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

    // this.pointerLine = d3.line().curve('d3CurveMonotoneX' );
    let minViewportSize = Math.min(this.props.pieWidth, this.props.pieHeight);// move up
    //Construct needle svg drawing
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
componentWillReceiveProps({someProp}) {
  this.setState({value:this.props.value});
}
  shouldComponentUpdate = (nextProps, nextState, nextContext) => {
    // Only render if value has changed
    if(nextState.value !== this.state.value) {
        this.update(nextState.value,this.state.value);
        return false
    } else if (nextState.value === this.state.value) return false

     // if other properties change and want to initate a render the put more condiotions here on other states 
  }
  
    // every few seconds update reading values
  componentDidMount() { 
    const gauge = d3.select(this.refs.g);
     // move up
    gauge.data([this.line])
                            .attr('class', 'pointer')
                            .attr('transform', 'translate(' + this.props.pieHeight /2 + ',' + this.props.pieWidth / 2 + ')')
                            .style("fill", 'red')
                            .style("stroke", "red").style('stroke-linejoin',"round").append('path').attr('d', this.pointerLine);
   this.update(this.state.value);
   // this.interval = setInterval(() => {this.setState({value:Math.floor(Math.random() * 100)});}, 7000);

  }

 update =(value,oldValue=5)=> {
    //The meat of the animtion. The needle will rotate from the the old value to the new value
    //This is done via some angle calculations
    var scale = this.props.scale  

    var range = this.pointer_config.maxAngle - this.pointer_config.minAngle;   
    var newAngle = this.getAngle(value,scale);  
    var oldAngle =  this.getAngle(oldValue,scale);     
    //Tween animation between two angles  
    const g = d3.select(this.refs.g.childNodes[0]);
                g.transition().duration(7000).attrTween("transform", function
                  (interpolate) {
         return d3.interpolateString("rotate(" + (oldAngle)+")", "rotate(" + newAngle + ")");
    }).on("start", function() {/* console.log('animi started')*/}).on("end", function() {/*console.log('Animi ended')*/}).on("interrupt", function() {/*console.log(this)*/});
        
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
        pi:PropTypes.func,
        chartId:PropTypes.string,
        color:PropTypes.array,
        width:PropTypes.number,
        height:PropTypes.number,
        radius:PropTypes.number,
        innerRadius:PropTypes.number,
        chartId:PropTypes.string,
        minValue :PropTypes.number,
        maxValue: PropTypes.number,
        minAngle: PropTypes.number,
        maxAngle: PropTypes.number,
        majorTicks:PropTypes.number,
        labelInset: PropTypes.number,
        value:PropTypes.number,
        scale:PropTypes.func,
        data:PropTypes.array,
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
    DialChart.defaultProps = DialChartDeafults().defaultProps;
export default DialChart;
window.DialChart=DialChart;