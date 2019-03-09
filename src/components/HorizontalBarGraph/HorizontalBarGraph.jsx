import React, { Component } from 'react';
import {HorizontalBar} from 'react-chartjs-2';
import './HorizontalBarGraph.css';

class HorizontalBarGraph extends Component{

    constructor(props){
        super(props);
        this.state={data:
                {
                    labels: props.keys,
                    datasets: [{
                        label: 'data',
                        data: props.data,
                    }]
                },
            type:props.type
        };
    }

    componentDidMount(){
    }

    componentWillReceiveProps(props) {
        this.setState({
                data:
                    {
                        labels: props.keys,
                        datasets: [{
                            label: 'data',
                            data: props.data,
                        }]
                    },
                type:props.type
            }
        );
    }


    render(){
        return (
            <div className="chartcontainerHBG">
                <HorizontalBar data={this.state.data}  options={{
                    maintainAspectRatio: false
                }}/>
            </div>
        )
    }
}

export default HorizontalBarGraph;