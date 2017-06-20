import React from 'react';
import ReactDOM from 'react-dom';
import Publisher from '../common/footer.jsx';
import Slider from '../common/pic';
import Modal from '../common/modal';

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