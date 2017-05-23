import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute, hashHistory } from 'react-router'
import App from './components/publisher/App'
import About from './components/publisher/About'
import Repos from './components/publisher/Repos'
import Repo from './components/publisher/Repo'
import Home from './components/publisher/Home'

render((
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="/repos?k=123" component={Repos}>
          <Route path="/repos/:userName/:repoName" component={Repo}/>
        </Route>
        <Route path="/about" component={About}/>
      </Route>
    </Router>
), document.getElementById('container'))

// var Grandson = React.createClass({
//     render: function(){
//         return (
//             <div style={{border: "1px solid red",margin: "10px"}}>{this.props.name}：
//               <select onChange={this.props.handleSelect}>
//                 <option value="男">男</option>
//                 <option value="女">女</option>
//               </select>
//             </div>
//         )
//     }
// });
// var Child = React.createClass({
//     render: function(){
//         return (
//             <div style={{border: "1px solid green",margin: "10px"}}>
//                 {this.props.name}：<input onChange={this.props.handleVal}/>
//               <Grandson name="性别" handleSelect={this.props.handleSelect}/>
//             </div>
//         )
//     }
// });
// var Parent = React.createClass({
//     getInitialState: function(){
//         return {
//             username: '',
//             sex: ''
//         }
//     },
//     handleVal: function(event){
//         this.setState({username: event.target.value});
//     },
//     handleSelect: function(event) {
//         this.setState({sex: event.target.value});
//     },
//     render: function(){
//         return (
//             <div style={{border: "1px solid #000",padding: "10px"}}>
//               <div>用户姓名：{this.state.username}</div>
//               <div>用户性别：{this.state.sex}</div>
//               <Child name="姓名" handleVal={this.handleVal} handleSelect={this.handleSelect}/>
//             </div>
//         )
//     }
// });
// render(
//     <Parent />,
//     document.getElementById('container')
// );