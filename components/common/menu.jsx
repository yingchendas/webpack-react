/**
 * Created by root on 2017/7/24.
 */
import React from 'react';
import './menu.css';
import '../../public/js/lib/jquery-1.7.min';
import Iscroll from './iscroll.jsx'
//拖拽
var leftUnm=0;
var rightNum = 0;
var timer = null;
var isdrag=false;
var tx,x;
var totalWidth = 0;
function move(x) {
    var left=$("#list").offset().left;
    var left=$("#list").offset().left;
    if(x>0){
        if(left+x+500>0){
            $("#list").css("left",0);
            return false;
        }else if(left+x+100<-1810){
            $("#list").css("left",-(totalWidth-200))
            return false;
        }
        $("#list").css("left",left+x+500);
    }else{
        if(left+x-500>0){
            $("#list").css("left",0);
            return false;
        }else if(left+x-100<-1810){
            $("#list").css("left",-(totalWidth-200))
            return false;
        }
        $("#list").css("left",left+x-500);
    }


}
$(function () {
    mui.init({
        gestureConfig:{
            tap: true, //默认为true
            doubletap: true, //默认为false
            longtap: true, //默认为false
            swipe: true, //默认为true
            drag: true, //默认为true
            hold:true,//默认为false，不监听
            release:false//默认为false，不监听
        }
    });
    document.getElementById("list").addEventListener("dragend",function(e){
        var x =e.detail.deltaX;
        var left=$("#list").offset().left;
        if(left+x-100>0){
            $("#list").css("left",0);
        }else if(left+x-100<-1810){
            $("#list").css("left",-(totalWidth-200))
        }

    });
    document.getElementById("list").addEventListener("drag",function(e){
        var x =e.detail.deltaX;
        move(x)

    });
    document.getElementById("list").addEventListener("swipeleft",function(e){
        var x =e.detail.deltaX;
        move(x)

    });
    document.getElementById("list").addEventListener("swiperight",function(e){
        var x =e.detail.deltaX;
        move(x)
    });
    var box = document.getElementById('root'); //外面的容器。
    var listBox = document.getElementById('list'); //ul列表。主要是移动它的left值
    var list = $('.list').find("li");//所有列表元素
    var width = box.clientWidth /2;  //为了判断是左滑还是右滑

    for(let i=0;i<list.length;i++){
        totalWidth = totalWidth + list[i].offsetWidth; //所有列表元素的总宽度
    }
    for(let i=0;i<list.length;i++){
        var _offset = totalWidth - box.clientWidth; //右边的偏移量
        list[i].addEventListener('click', function (e) {
            for(let j=0;j<list.length;j++){
                list[j].className = 'off';  //移除所有元素的样式
            }
            list[i].className = 'on';   //给点击的元素添加样式
            var offset =totalWidth - (Math.abs(listBox.offsetLeft) + box.clientWidth) + 100; //右边的偏移量 = 所有元素宽度之和 - （ul容器的左偏移量 + 父容器的宽度）
            if(e.pageX > width && offset > 0){  //点击右侧并且右侧的偏移量大于0，左滑。
                listBox.style.left = (listBox.offsetLeft-list[i].offsetWidth) + 'px';
            }else if(e.pageX > width && offset > list[i].offsetWidth){ //临界位置，，右侧滚动到末尾
                listBox.style.left = -_offset + 'px';
            }
            if(e.pageX < width && listBox.offsetLeft < -list[i].offsetWidth) { //点击左侧并且左侧的偏移量小于0，左滑。
                listBox.style.left = (listBox.offsetLeft + list[i].offsetWidth) + 'px';

            }else if(e.pageX < width && listBox.offsetLeft < 0){ //临界位置，左侧滚到开始的位置
                listBox.style.left = 0
            }

        });

    }
});
const Menu = React.createClass({
    getInitialState(){
        return (
            null
        )
    },
    handclick(){
        console.log(111)
    },
    render(){
        return(
            <div>
                <div id='root' className="root">
                    <ul className="list" id="list">
                        <li onClick={this.handclick.bind(this)} className="on">全单1</li>
                        <li onClick={this.handclick.bind(this)}>全部菜2单</li>
                        <li onClick={this.handclick.bind(this)}>全部3单</li>
                        <li onClick={this.handclick.bind(this)}>菜单4</li>
                        <li onClick={this.handclick.bind(this)}>全菜单</li>
                        <li onClick={this.handclick.bind(this)}>全部5菜单</li>
                        <li onClick={this.handclick.bind(this)}>全6单</li>
                        <li onClick={this.handclick.bind(this)}>全6部菜单</li>
                        <li onClick={this.handclick.bind(this)}>全菜7单</li>
                        <li onClick={this.handclick.bind(this)}>全8单</li>
                        <li onClick={this.handclick.bind(this)}>全部5菜单</li>
                        <li onClick={this.handclick.bind(this)}>全6单</li>
                        <li onClick={this.handclick.bind(this)}>全6部菜单</li>
                        <li onClick={this.handclick.bind(this)}>全菜7单</li>
                        <li onClick={this.handclick.bind(this)}>全8单</li>
                        <li onClick={this.handclick.bind(this)}>全9部菜单</li>
                        <li onClick={this.handclick.bind(this)}>全10单</li>
                        <li onClick={this.handclick.bind(this)}>全11部单</li>
                        <li onClick={this.handclick.bind(this)}>菜2单</li>
                        <li onClick={this.handclick.bind(this)}>全菜12单</li>
                        <li onClick={this.handclick.bind(this)}>全32部菜单</li>
                    </ul>
                </div>
                <Iscroll/>
            </div>


        )
    }
})
export default Menu;