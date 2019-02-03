import React, { Component } from 'react';
import './Navbar.css';

class Navbar extends Component{

    constructor(props){
        super(props);
    }

    render = ()=>{
        return (
            <div>
                <div id="navbg"></div>
                <div id="navcover">
                    <div className="container">
                        <div className="row" >
                            <div className="col-xs-2">
                            </div>
                            <div className="col-xs-8">
                                <input className="subinput" type="text" id="searchbox" defaultValue={this.props.keyword} onKeyUp={this.props.HandleKeywordInput}></input>
                            </div>
                            <div className="col-xs-2">
                                <a className="subsearchbutton" onClick={this.props.fun1}>搜 索</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Navbar;