/**
 * Created by root on 2017/7/24.
 */
import React from 'react';
import '../../public/css/common/common.css';
import './iscroll.css';
import '../../public/js/lib/jquery-1.7.min';
import Slider from './pic';
$(function () {
    refresher.init({
        id:"wrapper",//<------------------------------------------------------------------------------------┐
        pullDownAction:Refresh,
        pullUpAction:Load
    });
    function Refresh() {
        setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
            var el, li, i;
            el =document.querySelector("#wrapper ul");
            //这里写你的刷新代码
            document.getElementById("wrapper").querySelector(".pullDownIcon").style.display="none";
            document.getElementById("wrapper").querySelector(".pullDownLabel").innerHTML="<img src='/css/ok.png'/>刷新成功";
            setTimeout(function () {
                wrapper.refresh();
                document.getElementById("wrapper").querySelector(".pullDownLabel").innerHTML="";
            },1000);//模拟qq下拉刷新显示成功效果
            /****remember to refresh after  action completed！ ---yourId.refresh(); ----| ****/
        }, 1000);
    }
    function Load() {
        setTimeout(function () {// <-- Simulate network congestion, remove setTimeout from production!
            var el, li, i;
            el =document.querySelector("#wrapper ul");
            for (i=0; i<10; i++) {
                li = document.createElement('li');
                li.innerHTML="<img src='/images/game/game8.png'><div class='game-info'><h1>华仔超神战记</h1><p>9万次下载     89.18M</p><p>秒杀虚拟摇杆，砸烂手机键盘</p></div><button>下载</button>"
                el.appendChild(li, el.childNodes[0]);
            }
            wrapper.refresh();/****remember to refresh after action completed！！！   ---id.refresh(); --- ****/
            wrapper.enable()
            },2000);
    }
})
const Iscroll = React.createClass({
    getInitialState(){
      var arr=[
          {
            src:"/images/game/game1.png",
             gameName:"华仔天下"
          },
          {
              src:"/images/game/game2.png",
              gameName:"华仔天下1"
          },
          {
              src:"/images/game/game3.png",
              gameName:"华仔天下2"
          },
          {
              src:"/images/game/game1.png",
              gameName:"华仔天下"
          },
          {
              src:"/images/game/game2.png",
              gameName:"华仔天下1"
          },
          {
              src:"/images/game/game3.png",
              gameName:"华仔天下2"
          },
          {
              src:"/images/game/game1.png",
              gameName:"华仔天下"
          },
          {
              src:"/images/game/game2.png",
              gameName:"华仔天下1"
          },
          {
              src:"/images/game/game3.png",
              gameName:"华仔天下2"
          },
          {
              src:"/images/game/game3.png",
              gameName:"华仔天下2"
          },

      ]
        return {
            arr:arr,
            arr1: [
                {href:"login.html",src:"http://s.amazeui.org/media/i/demos/bing-1.jpg"},
                {href:"login.html",src:"http://s.amazeui.org/media/i/demos/bing-2.jpg"},
                {href:"login.html",src:"http://s.amazeui.org/media/i/demos/bing-3.jpg"},
                {href:"login.html",src:"http://s.amazeui.org/media/i/demos/bing-4.jpg"}
            ],
        }
    },
    render(){
        return(
            <div>
                <Slider img={this.state.arr1}></Slider>
                <div id="wrapper">
                    <ul>
                        {
                            this.state.arr.map(function (item) {
                                return (
                                    <li className="clearfix">
                                        <img src={item.src} />
                                        <div className="game-info">

                                            <h1>{item.gameName}</h1>
                                            <p>3万次下载 147.98M</p>
                                            <p>网易游戏出品,双维度操控，真人真机对战</p>
                                        </div>
                                        <button>下载</button>
                                    </li>
                                )
                            })
                        }

                    </ul>
                </div>
            </div>

        )
    }
})
export default Iscroll