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
                <div className={style.navBox}>
                    <nav className={style._nav}>
                        <ul>
                            <li>
                                12312
                            </li>
                            <li>
                                25252423
                            </li>
                            <li>
                                25252423
                            </li>
                            <li>
                                25252423
                            </li>
                            <li>
                                25252423
                            </li>
                            <li>
                                12312
                            </li>
                            <li>
                                25252423
                            </li>
                            <li>
                                25252423
                            </li>
                            <li>
                                25252423
                            </li>
                            <li>
                                25252423
                            </li>
                            <li>
                                12312
                            </li>
                            <li>
                                25252423
                            </li>
                            <li>
                                25252423
                            </li>
                            <li>
                                25252423
                            </li>
                            <li>
                                25252423
                            </li>
                        </ul>
                    </nav>
                    <div className={style.goodList}>
                        <Iscroll height="93.5%" width="80%"></Iscroll>
                    </div>
                </div>
                <Myloading openLoading={this.state.openLoading}></Myloading>
            </div>
        );

    }
})
export default Search;