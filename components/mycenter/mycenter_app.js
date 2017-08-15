/**
 * Created by root on 2017/7/25.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import '../common/rem'
import Mycenter from './mycenter.jsx';
import Search from '../search/search.jsx';
ReactDOM.render(
    ( <Router history={hashHistory}>
        <Route path="/" component={Mycenter}/>
        <Route path="/repos" component={Search}/>
    </Router>),document.getElementById('container')
);