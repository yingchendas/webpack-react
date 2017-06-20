/**
 * Created by root on 2017/6/19.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {
    Container,
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
            arr:[{name:"cy23",age:13},{name:"qwe13",age:15}],
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
               title:'提示',
               value:'请输入用户名'
           });
           //Global.tool.toast("请输入用户名");
       }else if(pwd==''){
           this.setState({
               isModalOpen:true,
               title:'提示',
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
                   console.log(data)
               },
               error:function(e){
                   console.log(e)
               }
           })
       }
    },
    render(){
        return(
            <div className="publisher">
                <div>
                    <label htmlFor="userName">用户名:</label>
                    <input type="text" id="userName" placeholder="请输入用户名"/>
                </div>
                <div>
                    <label htmlFor="userName">选择</label>
                    <input type="checkbox" checked={this.state.bool} onChange={this.handChange} />
                </div>
                <div>
                    <label htmlFor="pwd">登录密码:</label>
                    <input type="password" id="pwd" placeholder="请输入登录密码"/>
                </div>
                <button className="success234" onClick={this.handclick}>注册</button>
                <ul id="tset" style={{display:this.state.bool?"block":"none"}}>
                    {
                        this.state.arr.map(function (name) {
                            return (<li>Hello, {name.name}!</li>)
                        })
                    }
                </ul>
                <Modal
                    title={this.state.title}
                    role="alert"
                    isOpen={this.state.isModalOpen}
                    onDismiss={this.closeModal.bind(this)}
                    >
                    {this.state.value}
                </Modal>

            </div>

        );

    }
})

export default  register;