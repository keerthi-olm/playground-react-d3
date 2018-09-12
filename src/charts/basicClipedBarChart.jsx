import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from "d3";
import flagPng from './flag.png';
import flagPng2 from './flag2.png';
import chartDefaults from '../charts/utils/simpleChartDefaults'

export class SingleBarChart extends React.Component {   

 render = () => {
    var {widthFn,heightFn,margin,parseDate,xScale,yScale,data} = this.props;
    this.colorScale = d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'));
    var parseDate = d3.timeParse("%Y-%m");
        data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
      });

    // Possible bug when you try to set the sacels via defaultProps. Needs further investigation    
    //Scales worked out in 2 parts frts define scale, then map scale to domain of data
//     easeElastic
// easeBounce
// easeLinear
// easeSin
// easeQuad
// easeCubic
// easePoly
// easeCircle
// easeExp
// easeBack

    xScale= d3.scaleBand().range([0, widthFn(margin)], .05).padding(0.1);
    yScale=d3.scaleLinear().range([heightFn(margin), 0]);
    xScale.domain(data.map(function(d) { return d.date; }));
    yScale.domain([0, d3.max(data, function(d) { return d.value; })]);
   
    return (
      <svg width= {widthFn(margin)} height={heightFn(margin)} >
        {/* formula for dgerees to rads :::->  deg * Math.PI / 180 */}

        <g transform={`translate(${margin.left} ,${margin.top})`}>

        </g>       {/* Put the image that is to be clipped here and set the clip path attribute*/} 
        <image  width={widthFn(margin)} height={heightFn(margin)} href={flagPng2} />          
        <image  width={widthFn(margin)} height={heightFn(margin)} href={flagPng} clipPath = {'url(#clip-barChart)'} />
           {/* Use <defs> to deine reusable framents of svg tags*/} 
        <defs> {/* Mask */}   
            <clipPath id="clip-barChart">
         {data.map(
                   (value, i ) => <Bar 
                   value={value}
               xScale={xScale}
               yScale={yScale}
               fill={this.colorScale(0.05*1) } key={i} />
          )}
                  </clipPath>
        </defs>


      </svg>
    );
  }


};

class Bar extends React.Component {

  componentDidMount() { 
        // initiate animation here

   var bar=d3.select(this.refs.bar).data([this.props.value])
                       .attr('y',500)
                       .attr('height',500)
                       .transition()
                       .ease(d3.easeLinear)  
           .duration(3000).delay(1000)
           .attr("height", 500 - this.props.yScale(this.props.value.value))
           .attr("y", this.props.yScale(this.props.value.value));
             
   }

  render = () => {
    let {xScale,yScale, value} = this.props
    let {arcSize, fill, innerRadius = 0, outerRadius,startAngle=0} = this.props;

    return (
      <rect ref='bar'
      fill = "steelblue"
          x={xScale(value.date)}
          y={0}

          width= {xScale.bandwidth(value.date)}
          height={0}/>
                
        );
      }
    }


    SingleBarChart.propTypes = {
      width:PropTypes.number,
      height:PropTypes.number,
      margin:PropTypes.object,
      width:PropTypes.func,
      height:PropTypes.func,
      xScale:PropTypes.func,
      yScale:PropTypes.func,
      color:PropTypes.array,


      data:PropTypes.array

                                
             
    }
    // use shape ie : 
    //  propTypes: {
    //   data: PropTypes.shape({
    //     id: PropTypes.number.isRequired,
    //     title: PropTypes.string
    //  })
    // }
    SingleBarChart.defaultProps = {
    
      margin:{top: 20, right: 20, bottom: 70, left: 40},
      widthFn: (margin) => {return 600 - margin.left - margin.right},
      heightFn: (margin) => {return 300 - margin.top - margin.bottom},
      // xScale: ((widthFn) => {return d3.scaleBand().range([0, widthFn], .05);})(),
      // yScale: ((heightFn) => {return d3.scaleLinear().range([heightFn, 0]);})(),
      color: d3.schemeCategory10,
      parseDate: (date) => {return d3.timeParse("%Y-%m").parse},

      data: chartDefaults().data
           


    }
export default SingleBarChart;


