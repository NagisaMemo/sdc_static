import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
const env = require('./.env');

//import particals

//import pages
import Index from './pages/index/Index';


class App extends Component {
  render() {
    return (
      <Router basename={(env.NODE_ENV) == 'development' ? '/sdc/' : '/'}>
				<div>
				  <Route exact path="/" component={Index} />
				</div>
			</Router>
    );
  }
}

export default App;
