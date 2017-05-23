/**
 * Created by Lein on 16/9/5.
 */
"use strict";

let appids = {};
exports.appids = appids;


// const ZooKeeper = require("zookeeper");
// const application = require('../../application.json');
// let zookeeper = new ZooKeeper();
//
//
// zookeeper.init({
//     connect: application[process.env.NODE_ENV || 'dev'].mongo,
//     timeout: 200000,
//     debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
//     host_order_deterministic: false
// });
//
//
// zookeeper.on(ZooKeeper.on_connected, function (zk) {
//     console.log("reader on_connected: zk=%j", zk);
//
//     let run = () => {
//         let t = runs.shift();
//         if (t) {
//             push(t.path, t.data, ok => {
//                 process.nextTick(() => {
//                     t.fn(ok)
//                 })
//                 run();
//             });
//         }
//     };
//     run();
// });
//
//
// let watcher_token = ()=> {
//     zk.aw_get(token_path, (type, state, path)=> {
//         console.log("zookeeper '" + path + "' change!")
//         watcher_token();
//     }, (rc, error, stat, data)=> {
//         if (rc === 0) {
//             try {
//                 let temp_token = JSON.parse(data.toString());
//                 if (temp_token.access_token) {
//                     weixin_token = temp_token.access_token;
//                     console.debug("weixin token:" + weixin_token);
//                 }
//             } catch (e) {
//                 console.error(e.message)
//             }
//         }
//
//     });
// };
//
// let watcher_ticket = ()=> {
//     zk.aw_get(jsapi_ticket_path, (type, state, path)=> {
//         console.debug("zookeeper '" + path + "' change!")
//         watcher_ticket();
//     }, (rc, error, stat, data)=> {
//         try {
//             let temp_ticket = JSON.parse(data.toString());
//             if (temp_ticket.ticket) {
//                 weixin_jsapi_ticket = temp_ticket.ticket;
//                 console.debug("weixin ticket:" + weixin_jsapi_ticket);
//             }
//         } catch (e) {
//             console.error(e.message)
//         }
//
//     });
// };
// watcher_token();
// watcher_ticket();
//
// exports.getToken = function () {
//     return weixin_token;
// };
//
// exports.getTicket = function () {
//     return weixin_jsapi_ticket;
// };