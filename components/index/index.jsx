/**
 * Created by root on 2017/6/19.
 */
import React from 'react';
import '../../public/css/common/common.css';
import './index.css';
import Menu from '../common/menu.jsx';
import Myloading from '../common/loading.jsx';
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
           <div>
               <Menu></Menu>
               <Myloading openLoading={this.state.openLoading}></Myloading>
           </div>



        );

    }
})

export default  register;