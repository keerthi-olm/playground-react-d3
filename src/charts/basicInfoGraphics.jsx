import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as d3 from "d3";


//http://bl.ocks.org/d3noob/8952219
//https://plnkr.co/edit/WjmCzZ?p=preview
//C:\Temp\react-d3-current-28-01-2018\src
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
var N = d3.max(data, function(d) { return d.value; }); 
var domain=Array.apply(null, {length: N}).map(Number.call, Number);
domain.shift();
    xScale= d3.scaleBand().range([0, widthFn(margin)], .05).padding(0.1);
    yScale= d3.scaleBand().range([0, heightFn(margin)], .05).padding(0.1);
    // yScale=d3.scaleLinear().range([heightFn(margin), 0]);
    xScale.domain(data.map(function(d) { return d.date; }));
     // yScale.domain([0, d3.max(data, function(d) { return d.value; })]);
   yScale.domain(domain);
    return (
      <svg width= {widthFn(margin)} height={heightFn(margin)} >
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

            //     bar.transition()
            // .duration(animationDuration)
            // .attr("y", 0)
            // .attr("height", height);

   // var bar=d3.select(this.refs.bar).data([this.props.value])
   //                     .attr('y',500)
   //                     .attr('height',500)
   //                     .transition()
   //                     .ease(d3.easeLinear)  
   //         .duration(3000).delay(1000)
   //         .attr("height", 500 - this.props.yScale(this.props.value.value))
   //         .attr("y", this.props.yScale(this.props.value.value));

           // TODO info graphics : turn data value  into array of value size then draw image
           // ie coins for evry unit into array then var N = 10;  Array.apply(null, {length: N}).map(Number.call, Number)
           // Charts using grid : https://codepen.io/robinrendle/pen/470df4328fc964a0fc358395105d2a
             
   }

  render = () => {
    let {xScale,yScale, value} = this.props
    let {arcSize, fill, innerRadius = 0, outerRadius,startAngle=0} = this.props;
    // https://github.com/d3/d3/wiki/SVG-Shapes#arc
    // for alice settings see http://d3indepth.com/shapes/#arc-generator
    // can add the following to make prettier .padAngle(.02) .padRadius(100) .cornerRadius(4);

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

            //     bar.transition()
            // .duration(animationDuration)
            // .attr("y", 0)
            // .attr("height", height);

            // Template functions, markup genrator

            // push to buffer ther return buffer https://stackoverflow.com/questions/40476075/how-to-concatenate-jsx-elements-into-an-array
       
          }
    render = () => {
      var test="M 92.699987,165.8522 C 41.510531,165.8522 -3.4112195e-8,157.23722 -3.4112195e-8,146.6076 v 19.2446 C -3.4112195e-8,176.49194 41.510531,185.10692 92.699987,185.10692 c 51.208943,0 92.719473,-8.61498 92.719473,-19.25472 v -19.2446 c -0.0167,10.62962 -41.51053,19.2446 -92.719473,19.2446 z";

//        var buffer = []
// for (var i = this.props.value.value ; i >= 0; i--) {
//           buffer.push(<div>AAA</div>);
//         buffer.push(<div>BBB</div>);
//         buffer.push(<div>C</div>);
// };
var width,height;
var svgTags=this.svgStack(test,width=this.props.xScale.bandwidth(this.props.value.date),height=this.props.yScale.bandwidth(this.props.value.value));



return (  <svg>{svgTags}</svg>
  )

// return (  <svg x={this.props.xScale(this.props.value.date)} 
// height={this.props.yScale(this.props.value.value)} 
//   width={this.props.xScale.bandwidth(this.props.value.date)}> <path d={test} transform= "translate(0 0)"></path>
// </svg>
//   )

//tips : Template literals  ::-->   `string text ${expression} string text`   ""  
    }
svgStack (test,width,height) { console.log(width+'------>>>>>>>>>>'+height);
                   var buffer = [], vb="0 0 "+width+" "+this.props.yScale(this.props.value.value);
       
                  buffer=this.coins(test,width,height);
                  return buffer


      }

      coins (test,width,height) { console.log(width+'------>>>>>>>>>>'+height);
                   var buffer = [],yValue=170;
        for (var i = 1 ; i <= this.props.value.value; i++) {
                  // yValue=yValue-((this.props.value.value-i)*height);      
                  buffer.push(<svg x={this.props.xScale(this.props.value.date)} width={width} height="45" viewBox="0 0 185.41946 38.49932" y={(180-height)-this.props.yScale(i)} > {this.coinsData(test,width,height)}</svg>);

        };
        return buffer
      }
      coinsData (test,width,height) {  return ( <g transform="translate(3.4112195e-8,-116.6076)" id="g3053"><path d="M 92.699987,165.8522 C 41.510531,165.8522 -3.4112195e-8,157.23722 -3.4112195e-8,146.6076 v 19.2446 C -3.4112195e-8,176.49194 41.510531,185.10692 92.699987,185.10692 c 51.208943,0 92.719473,-8.61498 92.719473,-19.25472 v -19.2446 c -0.0167,10.62962 -41.51053,19.2446 -92.719473,19.2446 z" id="path3103"  /></g>
  )
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
    
      margin:{top: 20, right: 20, bottom: 70, left: 40},
      widthFn: (margin) => {return 600 - margin.left - margin.right},
      heightFn: (margin) => {return 300 - margin.top - margin.bottom},
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
         "date": "2013-01",
         "value": "17"
       },
       {
         "date": "2013-02",
         "value": "16"
       },
       {
         "date": "2013-03",
         "value": "12"
       },
       {
         "date": "2013-04",
         "value": "11"
       },
       {
         "date": "2013-05",
         "value": "13"
       },
       {
         "date": "2013-06",
         "value": "3"
       },
      
      ]
           


    }
export default InfoGraphicsChart;


