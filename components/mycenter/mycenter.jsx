/**
 * Created by root on 2017/7/25.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Footer from '../common/footer.jsx';
const Mycenter =React.createClass({
    getInitialState(){
        return(
            null
        )
    },
    render(){
        return(
            <div>
                <header className="clearfix tl userBox container">
                    <div className="clearfix ">
                        <img className="fl" src="/images/header.png" width="60px" alt="用户头像" />
                        <span className="tc fl userName c_666">用户名</span>
                    </div>

                </header>
                <div className="weui_cells weui_cells_access">
                    <a className="weui_cell" href="commission/myWallet.html">
                        <div className="weui_cell_hd"><img src="/images/money.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>我的钱包</p>
                            {/*<img src="../images/hot.png" className="pa money" width="30px" alt="" />*/}
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                </div>
                <div className="weui_cells weui_cells_access">
                    <a className="weui_cell" href="policy/policymanager.html">

                        <div className="weui_cell_hd"><img src="/images/policy.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>我的保单</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell"  href="addressmanager/addressmanager.html">

                        <div className="weui_cell_hd"><img src="/images/addr.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>地址管理</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell" href="pwdmanager/pwdmanager.html">

                        <div className="weui_cell_hd"><img src="/images/pwd.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>密码管理</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                </div>
                <div className="weui_cells weui_cells_access">
                    <a className="weui_cell" href="policy/policymanager.html">

                        <div className="weui_cell_hd"><img src="/images/policy.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>我的保单</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell"  href="addressmanager/addressmanager.html">

                        <div className="weui_cell_hd"><img src="/images/addr.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>地址管理</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell" href="pwdmanager/pwdmanager.html">

                        <div className="weui_cell_hd"><img src="/images/pwd.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>密码管理</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                </div>
                <div className="weui_cells weui_cells_access">
                    <a className="weui_cell" href="policy/policymanager.html">

                        <div className="weui_cell_hd"><img src="/images/policy.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>我的保单</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell"  href="addressmanager/addressmanager.html">

                        <div className="weui_cell_hd"><img src="/images/addr.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>地址管理</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell" href="pwdmanager/pwdmanager.html">

                        <div className="weui_cell_hd"><img src="/images/pwd.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>密码管理</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                </div>
                <div className="weui_cells weui_cells_access">
                    <a className="weui_cell" href="policy/policymanager.html">

                        <div className="weui_cell_hd"><img src="/images/policy.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>我的保单</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell"  href="addressmanager/addressmanager.html">

                        <div className="weui_cell_hd"><img src="/images/addr.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>地址管理</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell" href="pwdmanager/pwdmanager.html">

                        <div className="weui_cell_hd"><img src="/images/pwd.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>密码管理</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                </div>
                <div className="weui_cells weui_cells_access">
                    <a className="weui_cell" href="policy/policymanager.html">

                        <div className="weui_cell_hd"><img src="/images/policy.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>我的保单</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell"  href="addressmanager/addressmanager.html">

                        <div className="weui_cell_hd"><img src="/images/addr.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>地址管理</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell" href="pwdmanager/pwdmanager.html">

                        <div className="weui_cell_hd"><img src="/images/pwd.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>密码管理</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                </div>
                <div className="weui_cells weui_cells_access">
                    <a className="weui_cell" href="policy/policymanager.html">

                        <div className="weui_cell_hd"><img src="/images/policy.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>我的保单</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell"  href="addressmanager/addressmanager.html">

                        <div className="weui_cell_hd"><img src="/images/addr.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>地址管理</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell" href="pwdmanager/pwdmanager.html">

                        <div className="weui_cell_hd"><img src="/images/pwd.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>密码管理</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                </div>
                <div className="weui_cells weui_cells_access">
                    <a className="weui_cell" href="policy/policymanager.html">

                        <div className="weui_cell_hd"><img src="/images/policy.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>我的保单</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell"  href="addressmanager/addressmanager.html">

                        <div className="weui_cell_hd"><img src="/images/addr.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>地址管理</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell" href="pwdmanager/pwdmanager.html">

                        <div className="weui_cell_hd"><img src="/images/pwd.png" alt="" style={{width:"20px",display:"block",marginRight:"5px"}}/></div>
                        <div className="weui_cell_bd weui_cell_primary pr">
                            <p>密码管理</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                </div>
                <Footer></Footer>
            </div>

        )
    }
})

export default Mycenter