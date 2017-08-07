/**
 * Created by chenying on 2017/8/7.
 */
import React from 'react';
import '../../public/css/common/common.css';
import style from './Rearch.css';
import Iscroll from '../common/iscroll.jsx'
import Myloading from '../common/loading.jsx';
const Search=React.createClass({
    componentWillMount:function () {
        this.setState({
            openLoading: true,
            menuList:[
                {
                    name:"推荐分类",
                    type:1
                },
                {
                    name:"京东超市",
                    type:2
                },
                {
                    name:"国际名牌",
                    type:3
                },
                {
                    name:"奢侈品",
                    type:4
                },
                {
                    name:"全球购",
                    type:5
                },
                {
                    name:"男装",
                    type:6
                },
                {
                    name:"女装",
                    type:7
                },
                {
                    name:"男鞋",
                    type:8
                },
                {
                    name:"内衣配饰",
                    type:9
                },
                {
                    name:"箱包手袋",
                    type:10
                },
                {
                    name:"美妆个护",
                    type:11
                },
                {
                    name:"手机数码",
                    type:12
                }
                ,
                {
                    name:"家用电器",
                    type:13
                },
                {
                    name:"酒水饮料",
                    type:14
                },
                {
                    name:"酒水饮料",
                    type:14
                }

            ]
        })
    },
    componentDidMount:function () {
        setTimeout(function () {
            this.setState({
                openLoading: false
            })
        }.bind(this),5000);
    },

    render(){
        return(
            <div className="clearfix">
                <div className={style.navBox}>
                    <nav className={style._nav}>
                        <ul>
                            {
                                this.state.menuList.map(function (item,i) {
                                    function handClcik(e) {
                                        $(e.target).addClass(style.active);
                                        $(e.target).siblings().removeClass(style.active)
                                    }
                                  return(
                                      <li className={i==0?style.active:''} type={item.type} onClick={handClcik.bind(this)}>
                                          {item.name}
                                      </li>
                                  )
                                })
                            }
                        </ul>
                    </nav>
                    <div className={style.goodList}>
                        <Iscroll width="80%"></Iscroll>
                    </div>
                </div>
                <Myloading openLoading={this.state.openLoading}></Myloading>
            </div>
        );

    }
})
export default Search;