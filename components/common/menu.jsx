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
function movemouse(e){
    console.log(totalWidth)
    if (isdrag){
        var n = tx + e.touches[0].pageX - x;
        if(n>=0||n<=-(totalWidth-380)){
            return false
        }
        $("#list").css("left",n);
        return false;
    }
}

function selectmouse(e){
    isdrag = true;
    tx = parseInt(document.getElementById("list").style.left+0);
    x = e.touches[0].pageX;
    return false;
}
$(function () {
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
                listBox.style.left = (listBox.offsetLeft-200) + 'px';
            }else if(e.pageX > width && offset > 200){ //临界位置，，右侧滚动到末尾
                listBox.style.left = -_offset + 'px';
            }
            if(e.pageX < width && listBox.offsetLeft < -200) { //点击左侧并且左侧的偏移量小于0，左滑。
                listBox.style.left = (listBox.offsetLeft + 200) + 'px';

            }else if(e.pageX < width && listBox.offsetLeft < 0){ //临界位置，左侧滚到开始的位置
                listBox.style.left = 0
            }

        });

    }


    //拖拽
    document.getElementById("list").addEventListener('touchend',function(){
        isdrag = false;
    });
    document.getElementById("list").addEventListener('touchstart',selectmouse);
    document.getElementById("list").addEventListener('touchmove',movemouse);
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