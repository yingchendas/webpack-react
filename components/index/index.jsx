/**
 * Created by root on 2017/6/19.
 */
import React from 'react';
import '../../public/css/common/common.css';
import './index.css';
import Menu from '../common/menu.jsx';
import Myloading from '../common/loading.jsx';
import {
    Container,
    View,
} from 'amazeui-touch';
const register =React.createClass({
    getInitialState:function(){
        return {
            name:'star',bool:false
        }
    },
    componentWillMount:function () {
        this.setState({
            openLoading: true,
        })
    },
    componentDidMount:function () {
        setTimeout(function () {
            this.setState({
                openLoading: false,
            })
        }.bind(this),5000)

    },
    render(){
        return(
            <Container fill="true" direction="column" >
                <View>
                    <Container scrollable>
                        <Menu></Menu>
                        <Myloading openLoading={this.state.openLoading}></Myloading>
                    </Container>
                </View>
            </Container>

        );

    }
})

export default  register;