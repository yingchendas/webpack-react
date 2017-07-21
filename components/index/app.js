import React from 'react';
import ReactDOM from 'react-dom';
import Publisher from '../common/footer.jsx';
import Index from './index.jsx';

ReactDOM.render(
    <Publisher selected="index" />,
    document.getElementById('footer')
);
ReactDOM.render(
    <Index />,
    document.getElementById('container')
);