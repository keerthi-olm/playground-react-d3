import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as d3 from "d3";
import {Axis,Grid} from './ChartTools';
import chartDefaults from '../charts/utils/simpleChartDefaults'
import playBtn from '../charts/utils/playBtn.svg'


export class DemoBarChart extends React.Component {   
   constructor(props) { 
  
    super(props);
    this.state = {style: 0 };
    
    this.colorScale = d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'));
    

  }

  componentWillMount() {
    var parseDate = d3.timeParse("%Y-%m");  //TRICKY : the parmeter for timeParse function is of the format of the date string that is to be parsed
            this.props.data.forEach(function(d) {

              if (!(d.date instanceof Date)) {
                    d.date = parseDate(d.date);
                    d.value = +d.value;

                  }
          });

  }

  componentDidMount() {    
    //This picks a random colour scheme from chartstyles array and changes the state
    //this.interval = setInterval(() => {this.setState({style:Math.floor(Math.random() * this.props.chartStyles.length)});}, 15000); 

   }

   render = () => {
      var {widthFn,heightFn,margin,radius,innerRadius,arcSizeInAngle,parseDate,xScale,yScale,data,chartStyles} = this.props;


      // Possible bug when you try to set the sacels via defaultProps. Needs further investigation    
      //Scales worked out in 2 parts frts define scale, then map scale to domain of data

    xScale= d3.scaleBand().range([0, widthFn(margin)], .05);
    yScale=d3.scaleLinear().range([heightFn(margin), 0]);
    xScale.domain(data.map(function(d) { return d.date; }));
    yScale.domain([0, d3.max(data, function(d) { return d.value; })]);
    
        var w = widthFn(margin),
            h = heightFn(margin);
 
     var y = d3.scaleLinear()
            .domain([0,d3.max(data,function(d){
                return d.value;
            })])
            .range([h, 0]);


        var yGrid = d3.axisLeft()
            .scale(y)
            .ticks(5)
            .tickSize(-w, 0, 0)
            .tickFormat("");
    return (<div>

      <svg width='100%' viewBox={`0 0 ${widthFn(margin)} ${heightFn(margin)}`} preserveAspectRatio="xMinYMid meet">
        {/* formula for dgerees to rads :::->  deg * Math.PI / 180 */}

        <g transform={`translate(${margin.left} ,${margin.top})`}>

        </g>
        <Grid h={h} grid={yGrid} gridType="y"/>
         {data.map(
                   (value, i ) => <Bar key={i}
                   value={value}
                   xScale={xScale}
                   yScale={yScale}
                   i={i}
                   
                   height={heightFn(margin)}
                   chartStyles={this.props.chartStyles}
                  style={this.state.style}/>
          )}

      </svg>
       <button onClick={this.play}>Play again</button>
      </div>
    );
  }
play=()=> {this.setState({style:Math.floor(Math.random() * this.props.chartStyles.length)})}

};


class Bar extends React.Component {

  componentDidMount() { 

   // Manipulate the dom to achieve animaion via d3 transition
   this.update();    
   }

  componentDidUpdate = (nextProps, nextState, nextContext) => {

    this.update();


  }

 update =()=> {
    // Pick a the colour range scheme defined in the  chartstyles array.
     var {0:color1,1:color2,2:interval}=this.props.chartStyles[this.props.style][1]
    
     this.colorScale = d3.interpolateHsl(d3.rgb(color1), d3.rgb(color2));

     var bar=d3.select(this.refs.bar).data([this.props.value])
                       .attr('y',210)
                       .attr('height',this.props.height)
                       .attr('fill',this.colorScale(interval*this.props.i))
                       .transition()
                       .ease(d3.easeSin)  
           .duration(500).delay(Math.floor(Math.random() * 500) +500)
           .attr("height", 210 - this.props.yScale(this.props.value.value))
           .attr("y", this.props.yScale(this.props.value.value));

 }


  render = () => {
    let {xScale,yScale, value} = this.props
    let {arcSize, fill, innerRadius = 0, outerRadius,startAngle=0} = this.props;
   

    return (
      <rect ref='bar' className='bar'
      key={this.props.i}
          x={xScale(value.date)}
          y={0}

          width= {xScale.bandwidth(value.date)}
          height={0}/>
                
        );
      }
    }


    DemoBarChart.propTypes = {
      width:PropTypes.number,
      height:PropTypes.number,
      radius:PropTypes.number,
      margin:PropTypes.object,
      width:PropTypes.func,
      height:PropTypes.func,
      // xScale:PropTypes.func,
      // yScale:PropTypes.func,
      color:PropTypes.func,
      chartStyles:PropTypes.array,
      data:PropTypes.array

                                
             
    }
    // use shape ie : 
    //  propTypes: {
    //   data: PropTypes.shape({
    //     id: PropTypes.number.isRequired,
    //     title: PropTypes.string
    //  })
    // }
    DemoBarChart.defaultProps = {
    
      margin:{top: 20, right: 20, bottom: 70, left: 40},
      widthFn: (margin) => {return 600 - margin.left - margin.right},
      heightFn: (margin) => {return 300 - margin.top - margin.bottom},
      // xScale: ((widthFn) => {return d3.scaleBand().range([0, widthFn], .05);})(),
      // yScale: ((heightFn) => {return d3.scaleLinear().range([heightFn, 0]);})(),
      color: d3.schemeCategory10,
      parseDate: (date) => {return d3.timeParse("%Y-%m").parse},
      chartStyles:[ 
        ['silver',['#00ff11','#fbff00',0.25],'green','blue'],
        ['gold',['#e8e2ca','#3e6c0a',0.05],'gold','green','blue'],
        ['lightblue',['#00ff11','#fbff00',0.25],'gold','green','blue'],
        ['green',['#0a4c6b','#0084ff',0.05],'gold','green','blue'],
        ['green',['#ffcc00','#9dff00',0.05],'gold','green','blue'],
        ['green',['#ffd500','#ff8c00',0.05],'gold','green','blue'],
        ['orange',['#F6511D','rgb(255, 192, 0)',0.05],'gold','green','blue'],
        ['green',['#0084ff','#0a4c6b',0.05],'gold','green','blue'],
         

        
      ],
      data: chartDefaults().data
           


    }
export default DemoBarChart;


