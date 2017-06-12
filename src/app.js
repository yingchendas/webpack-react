import React from 'react';
import ReactDOM from 'react-dom';
import Publisher from './components/publisher/footer.jsx';
import Slider from './components/publisher/pic';
import Tres from './components/publisher/index';
import Modal from './components/publisher/modal';

ReactDOM.render(
    <Publisher />,
    document.getElementById('footer')
);
ReactDOM.render(
    <Slider />,
    document.getElementById('slider')
);
ReactDOM.render(
    <Modal />,
    document.getElementById('container')
);