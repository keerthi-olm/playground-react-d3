import React, { Component } from 'react';
import LineChart from './charts/LineChart'
import DialChart from './charts/DialChart'
import PieBasicChart from './charts/pieBasic'
import ReactSpeedometer from './charts/SpeedO'


class App extends Component {
  render() {
    return (
       <div>
            <div className="pure-g container">
               <div className="pure-u-1">
                <div className="bottom-right-svg">
                    <LineChart/>
                    <PieBasicChart/>
                    <DialChart/>
                    <ReactSpeedometer/>
                </div>
            </div>
            </div>
            </div>
    );
  }
}

export default App;