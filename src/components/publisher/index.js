/**
 * Created by root on 2017/5/25.
 */
import React from "react";
import {
    Container,
    Group,
    Button,
    Slider,

} from "amazeui-touch";
const container = React.createClass({
    getInitialState:function () {
        return {enble:false}
    },
    handleClick:function (event) {
        this.setState({enble:!this.state.enble})
    },
    render (){
        return(
            <p>
                <input type="text" disabled={this.state.enble} placeholder={this.state.enble?"123":"12"}/>
                <h1>hello {this.props.name}</h1>
                <button onClick={this.handleClick}> changeType</button>
            </p>
        )
    }
});
export default container;
