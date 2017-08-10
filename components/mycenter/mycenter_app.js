/**
 * Created by root on 2017/7/25.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import '../common/rem'
import Mycenter from './mycenter.jsx';
import Publisher from '../common/footer.jsx';
ReactDOM.render(
    <Mycenter />,
    document.getElementById('container')
);
ReactDOM.render(
    <Publisher selected="person" />,
    document.getElementById('footer')
);