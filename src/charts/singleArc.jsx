import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as d3 from "d3";



export class SingleArc extends React.Component {   

 render = () => {
    var {width,height,radius,innerRadius,arcSizeInAngle,value} = this.props;
    this.colorScale = d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'));
    return (
      <svg width= {width} height={height} >
        {/* formula for dgerees to rads :::->  deg * Math.PI / 180 */}
        <Slice 
               arcSize={{endAngle: this.props.degToRad(arcSizeInAngle)}}
               fill={this.colorScale(0.05*1)}
               innerRadius={innerRadius}
               outerRadius={radius}  />
      </svg>
    );
  }


};


class Slice extends React.Component {

  componentDidMount() { 
        // can initiate animation here
   }

  render = () => {
    let {arcSize, fill, innerRadius = 0, outerRadius,startAngle=0} = this.props;
    // https://github.com/d3/d3/wiki/SVG-Shapes#arc
    // for alice settings see http://d3indepth.com/shapes/#arc-generator
    // can add the following to make prettier .padAngle(.02) .padRadius(100) .cornerRadius(4);
    let arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0);
  
    return (
      <g transform={`translate(150, 150)`} height='300' width='300'>
      <path ref='path' d={arc(arcSize)} fill={fill} stroke='blue' />
      </g>
    );
  }
}


      SingleArc.propTypes = {
        width:PropTypes.number,
        height:PropTypes.number,
        radius:PropTypes.number,
        innerRadius:PropTypes.number,
        arcSizeInAngle: PropTypes.number,
        degToRad:PropTypes.func

                                
             
    }
    // use shape ie : 
    //  propTypes: {
    //   data: PropTypes.shape({
    //     id: PropTypes.number.isRequired,
    //     title: PropTypes.string
    //  })
    // }
    SingleArc.defaultProps = {
    
            width: 300,
            height: 300,
            radius:100,
            innerRadius:80,
            color: d3.schemeCategory10,
            outerRadius:200,
            arcSizeInAngle: 120,
            degToRad:(deg) => {return deg* Math.PI / 180}
           


    }
export default SingleArc;
