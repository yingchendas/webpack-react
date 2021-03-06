/**
 * Created by root on 2017/6/19.
 */
import React from 'react';
import './Register.css'
import ReactDOM from 'react-dom';
import Slider from '../common/pic';
import {
    Container,
    View,
    Group,
    Button,
    ButtonGroup,
    Modal,
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
            <Container fill="true" direction="column" >
               <View>
                    <Container scrollable>
                        <Slider img={this.state.arr}></Slider>
                        <div className="publisher">
                            <div>
                                <label htmlFor="userName">用户名:</label>
                                <input type="text" id="userName" placeholder="请输入用户名"/>
                            </div>
                            <div>
                                <label htmlFor="pwd">登录密码:</label>
                                <input type="password" id="pwd" placeholder="请输入登录密码"/>
                            </div>
                            <div className="tc">
                                <button className="registerBtn" onClick={this.handclick.bind(this)}>注册</button>
                            </div>

                            <Modal
                                title={this.state.title}
                                role="alert"
                                isOpen={this.state.isModalOpen}
                                onDismiss={this.closeModal.bind(this)}
                                >
                                {this.state.value}
                            </Modal>

                        </div>
                    </Container>
                </View>
            </Container>

        );

    }
})

export default  register;