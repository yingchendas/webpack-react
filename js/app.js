import React from 'react';
import ReactDOM from 'react-dom';
import Publisher from './components/publisher/footer.jsx';
import Slider from './components/publisher/pic';

ReactDOM.render(
    <Publisher />,
    document.getElementById('footer')
);
ReactDOM.render(
    <Slider />,
    document.getElementById('slider')
);