/**
 * Created by root on 2017/6/19.
 */
import React from 'react';
import '../../public/css/common/common.css';
import './index.css';
import Menu from '../common/menu.jsx';
import {
    Container,
    View,
} from 'amazeui-touch';
const register =React.createClass({
    getInitialState:function(){
        return {
            name:'star',bool:false,
            isModalOpen: false
        }
    },
    openModal() {
        this.setState({
            isModalOpen: true,
        })
    },

    closeModal() {
        this.setState({
            isModalOpen: false,
        });
    },
    render(){
        return(
            <Container fill="true" direction="column" >
                <View>
                    <Container scrollable>
                        <Menu></Menu>
                    </Container>
                </View>
            </Container>

        );

    }
})

export default  register;