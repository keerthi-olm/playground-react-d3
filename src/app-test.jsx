import React, { Component } from 'react';
import LineChart from './charts/LineChart'
import DialChart from './charts/DialChart'
import PieBasicChart from './charts/pieBasic'
import ReactSpeedometer from './charts/SpeedO'
import SingleArc from './charts/singleArc'
import SingleBarChart from './charts/basicClipedBarChart'
import DemoBarChart from './charts/demoBarChart'
import InfoGraphicsChart from './charts/basicInfoGraphics'
import './style.css'



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

                    <DemoBarChart/>
                    
                    <SingleBarChart/>
                    <InfoGraphicsChart />
                    <ReactSpeedometer/>

                    <SingleArc />
                     
                </div>
            </div>
            </div>
            </div>
    );
  }
}

export default App;