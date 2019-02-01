class DataPlot extends React.Component {
    constructor(props) {
        super(props);
        this.state={type:'', links:'', keys: '', data: '', };
        this.linkstack=[];
        this.keyword='';

        //根据url get JSON
        this.URLgetJSON=(source)=>{
            this.activelink=source;
            this.serverRequest=$.get(source,  this.SetNewState);
        };

        //根据keyword get JSON
        this.KeywordgetJSON=(keyword)=>{
            this.keyword=keyword;
            console.log("关键字搜索暂时不能返回有用的结果");
            //this.serverRequest=$.get('/search/'+keyword, this.SetNewState);
            this.serverRequest=$.get('/date',  this.SetNewState);
        };

        //Get JSON并更新State
        this.SetNewState=(JSONresult)=>{
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
        this.HandleSearch=()=>{
            if(this.myChart!=undefined){
                this.myChart.destroy();
            }
            this.keyword=$("#searchbox").val();
            this.KeywordgetJSON(this.keyword);
        };

        //绘制图表
        this.PlotChart=()=>{
            var ctx = $("#myChart");
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
        this.HandleClick=(evt)=>{
            var activePoints = this.myChart.getElementsAtEvent(evt);
            if (activePoints.length && this.state.type!="day") {
                evt.stopPropagation();
                this.myChart.destroy();
                this.linkstack.push(this.activelink);
                this.URLgetJSON(this.state.links[activePoints[0]._index]);
            }

        };


        //返回上级
        this.ReturnUpper=()=>{
            if (this.linkstack.length>0){
                this.myChart.destroy();
                this.URLgetJSON(this.linkstack.pop());
            }
        };

        //this.URLgetJSON(props.source);
    }

    //render后绘制图表
    componentDidUpdate() {
        this.PlotChart();
    }


    componentWillUnmount() {
        this.serverRequest.abort();
    }

    render() {
        if (this.keyword==''){
            return(
                <div>
                <img src="/starsea.png" className="mainimg"/>
                <input className="maininput" type="text" id="searchbox"></input>
                <a className="button1 mainsearchbutton" onClick={this.HandleSearch}>SDC一下 你就知道</a>
            </div>
        );
        }
        else{
            if (this.state.type=="month" || this.state.type=="day") {
                return (
                    <div>
                    <MyNav fun1={this.HandleSearch} keyword={this.keyword}/>
                <div className="chartcontainer">
                    <canvas id="myChart" width="400" height="400"  onClick={this.HandleClick}></canvas>
                </div>
                <a className="button1 mainsearchbutton" onClick={this.ReturnUpper}>返回上级</a>
                </div>
            );
            }
            else{
                return (
                    <div>
                    <MyNav fun1={this.HandleSearch} keyword={this.keyword}/>
                <div className="chartcontainer">
                    <canvas id="myChart" width="400" height="400"  onClick={this.HandleClick}></canvas>
                </div>
                </div>
            );
            }
        }
    }
}

function MyNav(props){
    return(
        <div>
            <div id="navbg"></div>
            <div id="navcover">
                <div className="container">
                    <div className="row" >
                        <div className="col-xs-2">
                        </div>
                        <div className="col-xs-8">
                            <input className="subinput" type="text" id="searchbox" defaultValue={props.keyword}></input>
                        </div>
                        <div className="col-xs-2">
                            <a className="subsearchbutton" onClick={props.fun1}>搜 索</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

);
}

ReactDOM.render(
<DataPlot source="/date" />,
    document.getElementById('example')
);
