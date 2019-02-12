import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';
import './Linegraph.css';

class Linegraph extends Component{

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
        this.HandleClick= this.HandleClick.bind(this);
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

    HandleClick = (ele) => {
        if (ele.length && this.state.type != "day") {
            this.props.toParent(ele[0]._index);
        }

    };

    render(){
        return (
            <div className="chartcontainer">
                <Line data={this.state.data} onElementsClick={this.HandleClick} options={{
                    maintainAspectRatio: false
                }}/>
            </div>
        )
    }
}

export default Linegraph;