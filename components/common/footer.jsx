import React from 'react';
import {
    Link,
} from 'react-router';
import {
    Container,
    Group,
    TabBar,
    Icon,
    Badge,
    amStyles,
} from 'amazeui-touch';

const TabBarDemo = React.createClass({
    getInitialState() {
        return {
            selected: 'home'
        };
    },

    handleClick(key, e) {
        e.preventDefault();

        this.setState({
            selected: key
        }, function() {
            console.log('选中了： %s', this.state.selected);
            if(this.state.selected=='person'){
                window.location.href='mycenter.html'
            }
        });
    },

    render() {
        return (
            <TabBar
                amStyle="Warning"
                onAction={this.handleClick}
            >
                <TabBar.Item
                    eventKey="home"
                    selected={this.state.selected === 'home'}
                    icon="home"
                    title="首页"
                />
                <TabBar.Item
                    component={Link}
                    selected={this.state.selected === 'person'}
                    eventKey="person"
                    icon="person"
                    title="个人中心"
                    to="/"
                />
                <TabBar.Item
                    selected={this.state.selected === 'gear'}
                    eventKey="gear"
                    icon="gear"
                    title="设置"
                />
            </TabBar>
        )
    }
});
// test
export default TabBarDemo;