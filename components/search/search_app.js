/**
 * Created by chenying on 2017/8/7.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Footer from '../common/footer.jsx';
import Search from './search.jsx';

ReactDOM.render(
    <Footer selected="search" />,
    document.getElementById('footer')
);
ReactDOM.render(
    <Search />,
    document.getElementById('container')
);