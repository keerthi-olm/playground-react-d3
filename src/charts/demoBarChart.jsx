import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as d3 from "d3";

//http://bl.ocks.org/d3noob/8952219
//https://plnkr.co/edit/WjmCzZ?p=preview
//C:\Temp\react-d3-current-28-01-2018\src
export class DemoBarChart extends React.Component {   
   constructor(props) { 
  
    super(props);
    this.state = {style: 0 };
    
    this.colorScale = d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'));
    

  }

  componentWillMount() {
    var parseDate = d3.timeParse("%Y-%m");  //TRICKY : he parmeter for timeParse function is the forma of the date sring that is to be parsed
            this.props.data.forEach(function(d) {

              if (!(d.date instanceof Date)) {
                    d.date = parseDate(d.date);
                    d.value = +d.value;

                  }
          });

  }

  componentDidMount() {    

    this.interval = setInterval(() => {this.setState({style:Math.floor(Math.random() * 4)});}, 15000);        
   
   }

   render = () => {
      var {widthFn,heightFn,margin,radius,innerRadius,arcSizeInAngle,parseDate,xScale,yScale,data,chartStyles} = this.props;


      // Possible bug when you try to set the sacels via defaultProps. Needs further investigation    
      //Scales worked out in 2 parts frts define scale, then map scale to domain of data

     xScale= d3.scaleBand().range([0, widthFn(margin)], .05);
    yScale=d3.scaleLinear().range([heightFn(margin), 0]);
    xScale.domain(data.map(function(d) { return d.date; }));
    yScale.domain([0, d3.max(data, function(d) { return d.value; })]);
   
    return (
      <svg width= {widthFn(margin)} height={heightFn(margin)} >
        {/* formula for dgerees to rads :::->  deg * Math.PI / 180 */}

        <g transform={`translate(${margin.left} ,${margin.top})`}>

        </g>
         {data.map(
                   (value, i ) => <Bar key={i}
                   value={value}
                   xScale={xScale}
                   yScale={yScale}
                   
                   height={heightFn(margin)}
                   chartStyles={this.props.chartStyles}
                  style={this.state.style}/>
          )}

      </svg>
    );
  }


};


class Bar extends React.Component {

  componentDidMount() { 

   // Manipulae the dom to achieve animaion via d3 transition
   this.update();    
   }

  componentDidUpdate = (nextProps, nextState, nextContext) => {

  this.update();


  }

 update =()=> {
    //: animation http://duspviz.mit.edu/d3-workshop/transitions-animation/
    // https://swizec.com/blog/using-d3js-transitions-in-react/swizec/6797
    // dash board http://bl.ocks.org/diethardsteiner/3287802
    // Furher research in animation hooks for react
     var bar=d3.select(this.refs.bar).data([this.props.value])
                       .attr('y',500)
                       .attr('height',this.props.height)
                       .attr('fill',this.props.chartStyles[this.props.style][0])
                       .transition()
                       .ease(d3.easeSin)  
           .duration(1000).delay(Math.floor(Math.random() * 500) +500)
           .attr("height", 500 - this.props.yScale(this.props.value.value))
           .attr("y", this.props.yScale(this.props.value.value));

            // easeBounce
            // easeLinear
            // easeSin
            // easeQuad
            // easeCubic
            // easePoly
            // easeCircle
            // easeExp
            // easeBack
            //ie  .transition().ease(d3.easeSin) 

 }


  render = () => {
    let {xScale,yScale, value} = this.props
    let {arcSize, fill, innerRadius = 0, outerRadius,startAngle=0} = this.props;
    // https://github.com/d3/d3/wiki/SVG-Shapes#arc
    // for alice settings see http://d3indepth.com/shapes/#arc-generator
    // can add the following to make prettier .padAngle(.02) .padRadius(100) .cornerRadius(4);
    // d3.selectAll(this.refs.bar).remove();

    return (
      <rect ref='bar'
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
      xScale:PropTypes.func,
      yScale:PropTypes.func,
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
        ['silver','gold','green','blue'],
        ['gold','gold','green','blue'],
        ['lightblue','gold','green','blue'],
        ['green','gold','green','blue']
      ],
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
export default DemoBarChart;


