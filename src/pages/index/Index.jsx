import React, { Component } from 'react';
import axios from 'axios'; //http请求工具
import Chart from 'chart.js';
import Navbar from '../../components/navbar/Navbar';
import './Index.css';
import logo from '../../assets/starsea.png';
class Index extends Component{
    constructor(props) {
        super(props);
        this.state={type:'', links:'', keys: '', data: '',keyword:''};
        this.linkstack=[];
        this.context = null;
        this.chartRef = React.createRef();//建立react内部引用

        //this.URLgetJSON(props.source);
    }

    //根据url get JSON
    URLgetJSON=(source)=>{
        this.activelink=source;
        this.serverRequest = axios.get(source)
        .then(res=>res.data)//脱离主Response类
        .then((result)=>{
            this.SetNewState(result);
        })
    };

    //根据keyword get JSON
    KeywordgetJSON=(keyword)=>{
        this.setState({keyword});
        this.serverRequest=axios.get('/search/'+keyword)
            .then(res=>res.data)
            .then((result)=>{
                this.serverRequest=axios.get(result.links[0].href)
                    .then(res=>res.data)
                    .then((result)=>{
                        this.SetNewState(result);
                    })
            });

    };

    //Get JSON并更新State
    SetNewState=(JSONresult)=>{
        var dataarray = new Array(JSONresult.resultList.length);
        var linkarray = new Array(JSONresult.resultList.length);
        var keyarray = new Array(JSONresult.resultList.length);
        for(var i=0;i<JSONresult.resultList.length;i++){
            if(JSONresult.type!="day"){
                linkarray[i]=JSONresult.links[i].href;
            }
            keyarray[i]=JSONresult.resultList[i].date;
            dataarray[i]=JSONresult.resultList[i].result;
        }
        this.setState({type:JSONresult.type, links:linkarray, keys: keyarray, data: dataarray, });
    };

    //关键字搜索
    HandleSearch=()=>{
        if(this.myChart!=undefined){
            this.myChart.destroy();
        }
        this.KeywordgetJSON(this.state.keyword);
    };

    //更新关键字
    HandleKeywordInput=(e)=>{
        this.setState({keyword:e.value});
        console.log(this.state.keyword);
    }

    //绘制图表
    PlotChart=()=>{
        var ctx = this.context;
        console.log(this.context);
        this.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.state.keys,
                datasets: [{
                    label: 'data',
                    data: this.state.data,
                }]
            },
            options: {
                responsive:true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });


    };

    //访问下级
    HandleClick=(evt)=>{
        var activePoints = this.myChart.getElementsAtEvent(evt);
        if (activePoints.length && this.state.type!="day") {
            evt.stopPropagation();
            this.myChart.destroy();
            this.linkstack.push(this.activelink);
            this.URLgetJSON(this.state.links[activePoints[0]._index]);
        }

    };


    //返回上级
    ReturnUpper=()=>{
        if (this.linkstack.length>0){
            this.myChart.destroy();
            this.URLgetJSON(this.linkstack.pop());
        }
    };


    //render后绘制图表
    componentDidUpdate() {
        this.context = this.chartRef.current.getContext('2d');
        this.PlotChart();
    }

    componentDidMount() { //不要用WillMount,马上要被砍了
        //this.serverRequest.abort();
    }

    render() {
        if (this.state.keyword==''){
            return(
                <div>
                <img src={logo} className="mainimg"/>
                <input className="maininput" onKeyDown={this.HandleKeywordInput} type="text" id="searchbox"></input>
                <a className="button1 mainsearchbutton" onClick={this.HandleSearch}>SDC一下 你就知道</a>
            </div>
        );
        }
        else{
            if (this.state.type=="month" || this.state.type=="day") {
                return (
                    <div>
                    <Navbar fun1={this.HandleSearch} keyword={this.state.keyword} keywordHandler={this.HandleKeywordInput}/>
                <div className="chartcontainer">
                    <canvas  ref={this.chartRef} id="myChart" width="400" height="400"  onClick={this.HandleClick}></canvas>
                </div>
                <a className="button1 mainsearchbutton" onClick={this.ReturnUpper}>返回上级</a>
                </div>
            );
            }
            else{
                return (
                    <div>
                    <Navbar fun1={this.HandleSearch} keyword={this.state.keyword}/>
                <div className="chartcontainer">
                    <canvas  ref={this.chartRef} id="myChart" width="400" height="400"  onClick={this.HandleClick}></canvas>
                </div>
                </div>
            );
            }
        }
    }
}

export default Index;