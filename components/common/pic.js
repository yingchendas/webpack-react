/**
 * Created by root on 2017/5/24.
 */
import React from 'react';
import {
    Container,
    Group,
    Button,
    Slider,

} from "amazeui-touch";
const onAction = function(index, direction) {
    //console.log('激活的幻灯片编号：', index, '，滚动方向：', direction);
};
const sliderIntance = (
    <Slider
        onAction={onAction}
        controls={false}
        autoPlay={true}
    >
        <Slider.Item>
            <a href="login.html">
            <img
                src="http://s.amazeui.org/media/i/demos/bing-1.jpg" />
            </a>
        </Slider.Item>
        <Slider.Item><img
            src="http://s.amazeui.org/media/i/demos/bing-2.jpg" /></Slider.Item>
        <Slider.Item>
            <img
                src="http://s.amazeui.org/media/i/demos/bing-3.jpg" /></Slider.Item>
        <Slider.Item>
            <img
                src="http://s.amazeui.org/media/i/demos/bing-4.jpg" /></Slider.Item>
    </Slider>
);

const SliderExample = React.createClass({
    getInitialState:function(){
        return {
            name:'star',bool:false,
            arr:[{name:"cy23",age:13},{name:"qwe13",age:15}],
            isModalOpen: false
        }
    },
     handleSaveClicked(){
       // alert(111)
    },
    render() {
        return(
            <Group>
                {sliderIntance}
                <input className ='btn btn-save'onBlur={this.handleSaveClicked} type="text"/>
                <ul id="tset">
                    {
                        this.props.name.map(function (name) {
                            return (<li>Hello, {name.name}!</li>)
                        })
                    }
                </ul>
            </Group>

        );

    }
});
export default SliderExample ;