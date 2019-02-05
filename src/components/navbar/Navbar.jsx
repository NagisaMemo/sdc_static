import React, { Component } from 'react';
import './Navbar.css';

class Navbar extends Component{

    constructor(props){
        super(props);
        this.render = this.render.bind(this);
    }

    render(){
        return (
            <div>
                <div id="navbg"></div>
                <div id="navcover">
                    <div className="container">
                        <div className="row" >
                            <div className="col-xs-2">
                            </div>
                            <div className="col-xs-8">
                                <input autoFocus  className="subinput" type="text" id="searchbox" value={this.props.keyword} onChange={this.props.keywordHandler}></input>
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