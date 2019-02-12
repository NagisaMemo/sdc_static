import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios'; //http请求工具
import Chart from 'chart.js';
import Loader from '../../components/loader/Loader'//加载显示工具
import Navbar from '../../components/navbar/Navbar';
import Modal from '../../components/modal/Modal';
import 'bootstrap/js/dist/modal';
import './Index.css';//导入CSS
import logo from '../../assets/starsea.png';//Logo
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = { type: '', links: '', keys: '', data: '', keyword: '', loading: false };
        this.prev = '';
        this.context = null;
        this.chartRef = React.createRef();//建立react内部引用

        //Bind所有函数至本类
        this.URLgetJSON         = this.URLgetJSON.bind(this);
        this.KeywordgetJSON     = this.KeywordgetJSON.bind(this);
        this.SetNewState        = this.SetNewState.bind(this);
        this.HandleSearch       = this.HandleSearch.bind(this);
        this.PlotChart          = this.PlotChart.bind(this);
        this.HandleKeywordInput = this.HandleKeywordInput.bind(this);
        this.HandleClick        = this.HandleClick.bind(this);
        this.ReturnUpper        = this.ReturnUpper.bind(this);
    }

    //根据url get JSON
    URLgetJSON = (source) => {
        this.activelink = source;
        this.setState({ loading: true })
        this.serverRequest = axios.get(source)
            .then(res => res.data)//脱离主Response类
            .then((result) => {
                this.SetNewState(result);
                this.setState({ loading: false })
            })
    };

    //根据keyword get JSON
    KeywordgetJSON = (keyword) => {
        this.setState({ keyword, loading: true });
        this.serverRequest = axios.get('/sdc/api/search/' + keyword)
            .then(res => res.data)
            .then((result) => {
                if(result.links.length==0)
                {
                    $("#Modalbox").modal();
                }
                else
                {
                this.serverRequest = axios.get(result.links[0].href)
                    .then(res => res.data)
                    .then((result) => {
                        this.SetNewState(result);
                        this.setState({ loading: false });
                    })
                }
            });

    };

    //Get JSON并更新State
    SetNewState = (JSONresult) => {
        var dataarray = new Array(JSONresult.resultList.length);
        var linkarray = new Array(JSONresult.resultList.length);
        var keyarray = new Array(JSONresult.resultList.length);
        for (var i = 0; i < JSONresult.resultList.length; i++) {
            if (JSONresult.type != "day") {
                linkarray[i] = JSONresult.links[i].href;
            }
            keyarray[i] = JSONresult.resultList[i].date;
            dataarray[i] = JSONresult.resultList[i].result;
        }
        //上级地址
        if (JSONresult.type == "month" || JSONresult.type == "day") {
            this.prev = JSONresult.links[JSONresult.links.length - 1].href
        }
        this.setState({ type: JSONresult.type, links: linkarray, keys: keyarray, data: dataarray, });
    };

    //关键字搜索
    HandleSearch = () => {
        this.PlotChart();
        this.KeywordgetJSON(this.state.keyword);
    };

    //更新关键字
    HandleKeywordInput = (e) => {
        this.setState({ keyword: e.target.value });
    }

    //绘制图表
    PlotChart = () => {
        //提取DOM元素
        if (this.chartRef.current != null) {
            this.context = this.chartRef.current.getContext('2d');
        }
        var ctx = this.context;
        if (this.myChart != undefined) {
            this.myChart.destroy();
        }
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
                responsive: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    };

    //访问下级
    HandleClick = (evt) => {
        var activePoints = this.myChart.getElementsAtEvent(evt);
        if (activePoints.length && this.state.type != "day") {
            evt.stopPropagation();
            this.URLgetJSON(this.state.links[activePoints[0]._index]);
        }

    };


    //返回上级
    ReturnUpper = () => {
        this.URLgetJSON(this.prev);
    };


    //render后绘制图表
    componentDidUpdate() {
        if (this.state.keyword != '') {
            this.PlotChart();
        }
    }

    componentDidMount() { //用DidMount替代WillMount
        //this.serverRequest.abort();
    }

    render() {
        if (this.state.keyword == '') {
            return (
                <div>
                    <Loader active={this.state.loading} children={"正在加载中..."}></Loader>
                    <img src={logo} className="mainimg" />
                    <input autoFocus className="maininput" value={this.state.keyword} onChange={this.HandleKeywordInput} type="text" id="searchbox"></input>
                    <a className="button1 mainsearchbutton" onClick={this.HandleSearch}>SDC一下 你就知道</a>
                    <Modal />
                </div>
            );
        }
        else {
            if (this.state.type == "month" || this.state.type == "day") {
                return (
                    <div>
                        <Loader active={this.state.loading} children={"正在加载中..."}></Loader>
                        <Navbar fun1={this.HandleSearch} keyword={this.state.keyword} keywordHandler={this.HandleKeywordInput} />
                        <div className="chartcontainer">
                            <canvas ref={this.chartRef} id="myChart" width="400" height="400" onClick={this.HandleClick}></canvas>
                        </div>
                        <a className="button1 mainsearchbutton" onClick={this.ReturnUpper}>返回上级</a>
                        <Modal />
                    </div>
                );
            }
            else {
                return (
                    <div>
                        <Loader active={this.state.loading} children={"正在加载中..."}></Loader>
                        <Navbar fun1={this.HandleSearch} keyword={this.state.keyword} keywordHandler={this.HandleKeywordInput} />
                        <div className="chartcontainer">
                            <canvas ref={this.chartRef} id="myChart" width="400" height="400" onClick={this.HandleClick}></canvas>
                        </div>
                        <Modal />
                    </div>
                );
            }
        }
    }
}

export default Index;