/**
 * Created by root on 2017/8/1.
 */
import React from 'react';
import './loading.css'
const Loading = React.createClass({
    getInitialState() {
        return {
            timer :null,
            positionY :0
        };
    },
    componentWillMount:function () {//数据数据加载前调用
        clearInterval(this.timer);
    },
    componentDidMount: function () {//数据加载完成后调用
        this.timer=setInterval(function () {
            let positionY= this.state.positionY;
            positionY++;
            if(positionY*50==350){
                positionY=0
            }
            this.setState({
                positionY:positionY
            })
        }.bind(this),600)
    },
    componentDidUpdate:function () {//数据更新后调用
        if(this.props.openLoading){
            document.getElementById('_loadingContainer').style.display="block";
        }else {
            document.getElementById('_loadingContainer').style.display="none";
            clearInterval(this.timer);
        }
    },

    render() {
        return (
            <div id="_loadingContainer">
                <div className="loadingBox" style={{"background-position-y":-this.state.positionY*50+"px"}} >
                </div>
            </div>
        )
    }
});
// test
export default Loading;