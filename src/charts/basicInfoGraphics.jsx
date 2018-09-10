import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as d3 from "d3";
import svgCoinData from '../charts/utils/coinsData'


export class InfoGraphicsChart extends React.Component {   

 render = () => {
    var {widthFn,heightFn,margin,radius,innerRadius,arcSizeInAngle,parseDate,xScale,yScale,data} = this.props;
    this.colorScale = d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'));
    var parseDate = d3.timeParse("%Y-%m");
        data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
      });

    // Possible bug when you try to set the sacels via defaultProps. Needs further investigation    
    //Scales worked out in 2 parts frts define scale, then map scale to domain of data

    var N = d3.max(data, function(d) { return d.value; }); // Get maximum Y axis value
    var domain=Array.apply(null, {length: N+1}).map(Number.call, Number); // Turn that number into a sequntial array of n items.
    domain.shift();
    xScale= d3.scaleBand().range([0, widthFn(margin)], .05).padding(0.1);
    yScale= d3.scaleBand().range([0, heightFn(margin)], 0.05).padding(0.05);
    // yScale=d3.scaleLinear().range([heightFn(margin), 0]);
    xScale.domain(data.map(function(d) { return d.date; }));
     // yScale.domain([0, d3.max(data, function(d) { return d.value; })]);
    yScale.domain(domain); // Function to map domain to scale.
    return (
      <svg width= {widthFn(margin)} height={heightFn(margin)+100} >
        {/* formula for dgerees to rads :::->  deg * Math.PI / 180 */}

        <g transform={`translate(${margin.left} ,${margin.top})`}>

        </g>       {/* Put the image that is to be clipped here and set the clip path attribute*/} 
     
         {data.map(
                   (value, i ) => <Bar 
                   value={value}
               xScale={xScale}
               yScale={yScale}
               fill={this.colorScale(0.05*1) } />
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
    return (
      <InfoGraphic ref='infoBar'

          height={0}
          xScale={xScale}
          yScale={yScale}
          value={value} />
                
        );
      }
}

class InfoGraphic extends React.Component {

  componentDidMount() { 
        // can initiate animation here
       
  }
  render = () => {
     
    var width,height;
    var svgTags=this.svgStack(width=this.props.xScale.bandwidth(this.props.value.date),height=this.props.yScale.bandwidth(this.props.value.value));

    return (<svg>{svgTags}</svg>)

  }
  svgStack (width,height) { 
    //ToDO: Viewbox needs to be created dynamically.
    var buffer = [], vb="0 0 "+width+" "+this.props.yScale(this.props.value.value);
    buffer=this.coins(width,height);
    return buffer
  }

  coins (width,height) {
    // This builds one stack of coins.
    var buffer = [],yValue=170,top=0,vb,height=28;
    for (var i = 1 ; i <= this.props.value.value; i++) {
        // yValue=yValue-((this.props.value.value-i)*height); 
        if (i=== this.props.value.value) { top=1,height=135}
          //ToDO: Viewbox dimensions needs to be created dynamically.
          top===1 ?  vb = "0 0 185.41946 38.4993" : vb = "0 0 185.41946 38.4993" ;
        buffer.push(<svg x={this.props.xScale(this.props.value.date)} width={width} height={height} viewBox={vb} y={(260-height)-this.props.yScale(i)} > {this.coinsData(width,height,top)}</svg>);

    };
    return buffer
  }

  coinsData (width,height,top) {  
      // Return the coin pices to onstruct the coin stack
      if (top) {
        return ( svgCoinData().top )
      } else
        {
      return ( svgCoinData().bottom )

      }
      
  }

}

InfoGraphicsChart.propTypes = {
      width:PropTypes.number,
      height:PropTypes.number,
      radius:PropTypes.number,
      margin:PropTypes.object,
      width:PropTypes.func,
      height:PropTypes.func,
      xScale:PropTypes.func,
      yScale:PropTypes.func,
      color:PropTypes.func,
      data:PropTypes.array
}
    // use shape ie : 
    //  propTypes: {
    //   data: PropTypes.shape({
    //     id: PropTypes.number.isRequired,
    //     title: PropTypes.string
    //  })
    // }
InfoGraphicsChart.defaultProps = {
      margin:{top: 20, right: 20, bottom: 20, left: 40},
      widthFn: (margin) => {return 600 - margin.left - margin.right},
      heightFn: (margin) => {return 200 - margin.top - margin.bottom},
      // xScale: ((widthFn) => {return d3.scaleBand().range([0, widthFn], .05);})(),
      // yScale: ((heightFn) => {return d3.scaleLinear().range([heightFn, 0]);})(),
      color: d3.schemeCategory10,
      parseDate: (date) => {return d3.timeParse("%Y-%m").parse},

      data: [
       {
         "date": "2013-01",
         "value": "2"
       },
       {
         "date": "2013-02",
         "value": "5"
       },
       {
         "date": "2013-03",
         "value": "10"
       },
       {
         "date": "2013-04",
         "value": "19"
       },
       {
         "date": "2013-05",
         "value": "16"
       },
       {
         "date": "2013-06",
         "value": "12"
       },
       {
         "date": "2013-07",
         "value": "11"
       },
       {
         "date": "2013-08",
         "value": "13"
       },
       {
         "date": "2013-09",
         "value": "3"
       },
      
      ]
        }
export default InfoGraphicsChart;


