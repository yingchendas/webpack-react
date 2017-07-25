import React from 'react';
import './footer.css'
const TabBarDemo = React.createClass({
    getInitialState() {
        var selectName
        switch (this.props.selected){
            case "index": selectName='home';break;
            case 'person':selectName='person';break;
            case 'gear' :selectName='gear';break;
            default: selectName='home';
        }
        return {
            selected: selectName
        };
    },

    handleClick(key, e) {

    },

    render() {
        return (
            <footer className="_bar">
                <a href="index.html" className={this.state.selected=="home"?"onActive":''}>
                    <p className="iconfont icon-icon-test1 f2m "></p>
                    <p>首页</p>
                </a>
                <a href="">
                    <p className=" f2m icon-icon-test4 iconfont"></p>
                    <p>发现</p>
                </a>

                <a href="mycenter.html"  className={this.state.selected=="person"?"onActive":''}>
                    <p className="iconfont icon-icon-test12 f2m"></p>
                    <p>个人中心</p>
                </a>
                <a href="">
                    <p className="iconfont icon-icon-test14 f2m"></p>
                    <p>设置</p>
                </a>

            </footer>
        )
    }
});
// test
export default TabBarDemo;