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

