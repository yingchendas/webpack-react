/**
 * Created by root on 2017/6/19.
 */
import React from 'react';
import './login.css'
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
const login =React.createClass({
    getInitialState:function(){
        return {
            name:'star',bool:false,
            arr: [
                {href:"login.html",src:"/images/banner1.png"},
                {href:"login.html",src:"/images/banner1.png"},
                {href:"login.html",src:"/images/banner1.png"},
                {href:"login.html",src:"/images/banner1.png"}
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
        let userName = $("#userName").val();
        let pwd = $("#pwd").val();
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
           let item =this
           /*todo 数据提交*/
           $.ajax({
               "url": "/client/customer/login",
               "type": "POST",
               "dataType":"json",
               "data": {
                   "userName":userName,
                   "pwd":pwd
               },
               success:function(data){
                   if(data.code==10000){
                       window.location.href='index.html'
                   }else{
                       item.setState({
                           isModalOpen:true,
                           title:'温馨提示',
                           value:data.message
                       })
                   }

               },
               error:function(e){
                   this.setState({
                       isModalOpen:true,
                       title:'温馨提示',
                       value:'密码或用户名错误'
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
                            <div className="weui_cells weui_cells_form">
                                <div>
                                    <label htmlFor="userName">用户名:</label>
                                    <input type="text" id="userName" placeholder="请输入用户名"/>
                                </div>
                                <div>
                                    <label htmlFor="pwd">登录密码:</label>
                                    <input type="password" id="pwd" placeholder="请输入登录密码"/>
                                </div>
                            </div>

                            <div className="tc">
                                <a href="javascript:void(0)" id="loginBtn" className="weui_btn bg_1ea" onClick={this.handclick.bind(this)}>登录</a>
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

export default  login;