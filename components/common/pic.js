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

const SliderExample = React.createClass({
    render() {
        return(
            <Group>
                <Slider
                    onAction={onAction}
                    controls={false}
                    autoPlay={true}
                >
                    { this.props.img.map(function (name) {
                        return(
                            <Slider.Item>
                                <a href={name.href}>
                                    <img
                                        src={name.src}/>
                                </a>
                            </Slider.Item>
                        )
                    })
                    }
                </Slider>
            </Group>

        );

    }
});
export default SliderExample ;