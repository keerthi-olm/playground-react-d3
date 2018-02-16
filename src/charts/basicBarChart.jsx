import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as d3 from "d3";

//http://bl.ocks.org/d3noob/8952219
//C:\Temp\react-d3-current-28-01-2018\src
export class SingleBarChart extends React.Component {   

 render = () => {
    var {widthFn,heightFn,margin,radius,innerRadius,arcSizeInAngle,parseDate,xScale,yScale,data} = this.props;
    this.colorScale = d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'));

        data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;

    xScale(widthFn(margin)).domain(data.map(function(d) { return d.date; }));
    yScale(heightFn(margin)).domain([0, d3.max(data, function(d) { return d.value; })]);
    });
    return (
      <svg width= {widthFn(margin)} height={heightFn(margin)} >
        {/* formula for dgerees to rads :::->  deg * Math.PI / 180 */}

        <g transform={`translate(${margin.left} ,${margin.top})`}>

        </g>
         {data.map(
                   (value, i ) => <Bar 
                   value={value}
               xScale={xScale}
               yScale={yScale}
               fill={this.colorScale(0.05*1)} />
          )}

         
      </svg>
    );
  }


};


class Bar extends React.Component {

  componentDidMount() { 
        // can initiate animation here
   }

  render = () => {
    let {xScale,yScale, value} = this.props
    let {arcSize, fill, innerRadius = 0, outerRadius,startAngle=0} = this.props;
    // https://github.com/d3/d3/wiki/SVG-Shapes#arc
    // for alice settings see http://d3indepth.com/shapes/#arc-generator
    // can add the following to make prettier .padAngle(.02) .padRadius(100) .cornerRadius(4);
    let arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0);
  
    return (
      <rectangle 
      fill = "steelblue"
          x={(value) => { return xScale(value.date)}}
          y={(value) => { return yScale(value.value)}}

          width= {this.props.xScale.rangeBand}

      />
      
    );
  }
}


      SingleBarChart.propTypes = {
        width:PropTypes.number,
        height:PropTypes.number,
        radius:PropTypes.number,
        innerRadius:PropTypes.number,
        arcSizeInAngle: PropTypes.number,
        degToRad:PropTypes.func,
        margin:PropTypes.array,
        width:PropTypes.func,
        height:PropTypes.func,
        xScale:PropTypes.func,
        yScale:PropTypes.func,


        data:PropTypes.object

                                
             
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
            xScale: (width) => {return d3.scaleBand().range([0, width], .05);},
            yScale: (height) => {return d3.scaleLinear().range([height, 0]);},
            innerRadius:80,
            color: d3.schemeCategory10,
            outerRadius:200,
            arcSizeInAngle: 120,
            degToRad:(deg) => {return deg* Math.PI / 180},
            parseDate: (date) => {return d3.timeParse("%Y-%m").parse},

            data: [
 {
   "date": "2013-01",
   "value": "53"
 },
 {
   "date": "2013-02",
   "value": "165"
 },
 {
   "date": "2013-03",
   "value": "269"
 },
 {
   "date": "date",
   "value": "value"
 },
 {
   "date": "2013-01",
   "value": "53"
 },
 {
   "date": "2013-02",
   "value": "165"
 },
 {
   "date": "2013-03",
   "value": "269"
 },
 {
   "date": "2013-04",
   "value": "344"
 },
 {
   "date": "2013-05",
   "value": "376"
 },
 {
   "date": "2013-06",
   "value": "410"
 },
 {
   "date": "2013-07",
   "value": "421"
 },
 {
   "date": "2013-08",
   "value": "405"
 },
 {
   "date": "2013-09",
   "value": "376"
 },
 {
   "date": "2013-10",
   "value": "359"
 },
 {
   "date": "2013-11",
   "value": "392"
 },
 {
   "date": "2013-12",
   "value": "433"
 },
 {
   "date": "2014-01",
   "value": "455"
 },
 {
   "date": "2014-02",
   "value": "478"
 }
]
           


    }
export default SingleBarChart;


