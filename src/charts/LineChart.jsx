import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as d3 from "d3";
export class Axis extends React.Component {
    static propTypes = {
        h:PropTypes.number,
        axis:PropTypes.func,
        axisType:PropTypes.oneOf(['x','y'])

    }

    componentDidUpdate () { this.renderAxis(); }
    componentDidMount  () { this.renderAxis(); }
    renderAxis () {
        var node = ReactDOM.findDOMNode(this);
        d3.select(node).call(this.props.axis);

    }
    render (){
    // var xmytest=33;
            var translate = "translate(0,"+(this.props.h)+")";

            return (
                <g className="axis" transform={this.props.axisType==='x'?translate:""} >
                </g>
            );
        }

    }

export class Grid extends React.Component{
    static propTypes = {
        h:PropTypes.number,
        grid:PropTypes.func,
        gridType:PropTypes.oneOf(['x','y'])
    }

    componentDidUpdate () { this.renderGrid(); }
    componentDidMount () { this.renderGrid(); }
    renderGrid () {
        var node = ReactDOM.findDOMNode(this);
        d3.select(node).call(this.props.grid);

    }
    render () {
        var translate = "translate(0,"+(this.props.h)+")";
        return (
            <g className="y-grid" transform={this.props.gridType==='x'?translate:""}>
            </g>
        );
    }

}

export class ToolTip extends React.Component{ 
    static propTypes = {
        tooltip:PropTypes.object
    }
    render (){

        var visibility="hidden";
        var transform="";
        var x=0;
        var y=0;
        var width=150,height=70;
        var transformText='translate('+width/2+','+(height/2-5)+')';
        var transformArrow="";

        if(this.props.tooltip.display===true){
            var position = this.props.tooltip.pos;

            x= position.x;
            y= position.y;
            visibility="visible";

            //console.log(x,y);

            if(y>height){
                transform='translate(' + (x-width/2) + ',' + (y-height-20) + ')';
                transformArrow='translate('+(width/2-20)+','+(height-2)+')';
            }else if(y<height){

                transform='translate(' + (x-width/2) + ',' + (Math.round(y)+20) + ')';
                transformArrow='translate('+(width/2-20)+','+0+') rotate(180,20,0)';
            }



        }else{
            visibility="hidden"
        }

        return (
            <g transform={transform}>
                <rect className="shadow"  width={width} height={height} rx="5" ry="5" visibility={visibility} fill="#6391da" opacity=".9"/>
                <polygon className="shadow"  points="10,0  30,0  20,10" transform={transformArrow}
                         fill="#6391da" opacity=".9" visibility={visibility}/>
                <text  visibility={visibility} transform={transformText}>
                    <tspan  x="0" textAnchor="middle" fontSize="15px" fill="#ffffff">{this.props.tooltip.data.key}</tspan>
                    <tspan  x="0" textAnchor="middle" dy="25" fontSize="20px" fill="#a9f3ff">{this.props.tooltip.data.value+" visits"}</tspan>
                </text>
            </g>
        );
    }
}

 export class Dots extends React.Component{   
    static propTypes = {
        data:PropTypes.array,
        x:PropTypes.func,
        y:PropTypes.func

    } 
    render (){
        // function x(data.date) and y(data.date) will return the x and y psotion of the data point
        // the use map to iterate through to produce each circle and store it in circles
        
        var _self=this;

        //remove last & first point
        var data=this.props.data.splice(1);
        data.pop();

        var circles=data.map(function(d,i){
            //Dots with tool tips on mouseover. Mouse Event handler
            return (<circle className="dot" r="7" cx={_self.props.x(d.date)} cy={_self.props.y(d.count)} fill="#7dc7f4"
                            stroke="#3f5175" strokeWidth="5px" key={i}
                            onMouseOver={_self.props.showToolTip} onMouseOut={_self.props.hideToolTip}
                            data-key={d3.timeFormat("%b %e")(d.date)} data-value={d.count}/>)
        });

        return(
            <g>
                {circles}
            </g>
        );
    }
}


export class LineChart extends React.Component {   


  constructor(props, context) {
    super(props, context);

    this.state = {
            tooltip:{ display:false,data:{key:'',value:''}},
            width:800
    };
  };
    // mixins=[resizeMixin];



    render (){
        var data=[
            {day:'02-11-2016',count:180},
            {day:'02-12-2016',count:250},
            {day:'02-13-2016',count:150},
            {day:'02-14-2016',count:496},
            {day:'02-15-2016',count:140},
            {day:'02-16-2016',count:380},
            {day:'02-17-2016',count:100},
            {day:'02-18-2016',count:150}
        ];

        var margin = {top: 5, right: 50, bottom: 20, left: 50},
            w = this.state.width - (margin.left + margin.right),
            h = this.props.height - (margin.top + margin.bottom);

        var parseDate = d3.timeParse("%m-%d-%Y");

        data.forEach(function (d) {
            d.date = parseDate(d.day);
        });

        var x = d3.scaleTime()
            .domain(d3.extent(data, function (d) {
                return d.date;
            }))
            .rangeRound([0, w]);

        var y = d3.scaleLinear()
            .domain([0,d3.max(data,function(d){
                return d.count+100;
            })])
            .range([h, 0]);

        var yAxis = d3.axisLeft()
            .scale(y)
            .ticks(5);

        var xAxis = d3.axisBottom()
            .scale(x)
            .tickValues(data.map(function(d,i){
                if(i>0) {
                    return d.date;
                } return false;
            }).splice(1))
            .ticks(4);

        // var xGrid = d3.axisBottom()
        //     .scale(x)
        //     .orient('bottom')
        //     .ticks(5)
        //     .tickSize(-h, 0, 0)
        //     .tickFormat("");


        var yGrid = d3.axisLeft()
            .scale(y)
            .ticks(5)
            .tickSize(-w, 0, 0)
            .tickFormat("");


        // var interpolations = [
        //     "linear",
        //     "step-before",
        //     "step-after",
        //     "basis",
        //     "basis-closed",
        //     "cardinal",
        //     "cardinal-closed"];

        var line = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.count);
            }).curve(d3.curveCardinal);

        var transform='translate(' + margin.left + ',' + margin.top + ')';

        return (
            <div>
                <svg id={this.props.chartId} width={this.state.width} height={this.props.height}>

                    <g transform={transform}>

                        <Grid h={h} grid={yGrid} gridType="y"/>
                        {/*<Grid h={h} grid={xGrid} gridType="x"/> */}

                        <Axis h={h} axis={yAxis} axisType="y" />
                        <Axis h={h} axis={xAxis} axisType="x"/>

                        <path className="line shadow" d={line(data)} strokeLinecap="round"/>

                        <Dots data={data} x={x} y={y} showToolTip={this.showToolTip} hideToolTip={this.hideToolTip}/>

                        <ToolTip tooltip={this.state.tooltip}/>
                    </g>

                </svg>


            </div>
        );
    }
    //foo = (e) => {.....} -- this preserves 'this' within even handlers
    showToolTip = (e) =>{

        e.target.setAttribute('fill', '#FFFFFF');
        this.setState({tooltip:{
            display:true,
            data: {
                key:e.target.getAttribute('data-key'),
                value:e.target.getAttribute('data-value')
                },
            pos:{
                x:e.target.getAttribute('cx'),
                y:e.target.getAttribute('cy')
            }

            }
        });
    }
    hideToolTip = (e) =>{
        e.target.setAttribute('fill', '#7dc7f4');
        this.setState({tooltip:{ display:false,data:{key:'',value:''}}});
    }


};
    LineChart.propTypes = {
        width:PropTypes.number,
        height:PropTypes.number,
        chartId:PropTypes.string
    }
    LineChart.defaultProps = {
    
            width: 800,
            height: 300,
            chartId: 'v1_chart'
     
    }
export default LineChart;
window.LineChart=LineChart;