import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './index.css';
import App from './components/App';
import Answer from './components/Answer';
import List from './components/List';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/" component={App}></Route>
            <Route path="/answer/:address/:id" component={Answer}></Route>
            <Route path="/list" component={List}></Route>
        </div>
    </Router>
   , document.getElementById('root'));

serviceWorker.unregister();
