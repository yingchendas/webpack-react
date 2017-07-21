/**
 * Created by root on 2017/6/19.
 */
import React from 'react';
import Slider from '../common/pic';
import Modal from '../common/modal';
import {
    Container,
    View,
    Group,
    Button,
    ButtonGroup,
    Field,
    List,
    Icon,
} from 'amazeui-touch';
const register =React.createClass({
    getInitialState:function(){
        return {
            name:'star',bool:false,
            arr: [
                {href:"login.html",src:"http://s.amazeui.org/media/i/demos/bing-1.jpg"},
                {href:"login.html",src:"http://s.amazeui.org/media/i/demos/bing-2.jpg"},
                {href:"login.html",src:"http://s.amazeui.org/media/i/demos/bing-3.jpg"},
                {href:"login.html",src:"http://s.amazeui.org/media/i/demos/bing-4.jpg"}
                ],
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
    handChange:function (event) {
        this.setState({bool:event.target.checked});
        if(event.target.checked){
            this.setState({
                arr:[{name:"cy23",age:13},{name:"qwe13",age:15}]
            })
        }else {
            this.setState({
                arr:[{name:"cy",age:13},{name:"qwe",age:15}]
            })
        }

    },
    handclick:function (){
        var userName = $("#userName").val();
        var pwd = $("#pwd").val();
       if(userName==''){
           this.setState({
               isModalOpen:true,
               title:'温馨提示',
               value:'请输入用户名'
           });
           //Global.tool.toast("请输入用户名");
       }else if(pwd==''){
           this.setState({
               isModalOpen:true,
               title:'温馨提示',
               value:'请输入登录密码'
           })
           //Global.tool.toast("请输入登录密码")
       }else {
           /*todo 数据提交*/
           $.ajax({
               "url": "/client/customer/register",
               "type": "POST",
               "dataType":"json",
               "data": {
                   "userName": userName,
                   "pwd":pwd
               },
               success:function(data){
                   window.location.href='login.html';
               },
               error:function(e){
                   this.setState({
                       isModalOpen:true,
                       title:'温馨提示',
                       value:'注册失败'
                   })
               }
           })
       }
    },
    render(){
        return(
               <View>
                    <Slider img={this.state.arr}></Slider>
                    <Modal></Modal>
                </View>

        );

    }
})

export default  register;