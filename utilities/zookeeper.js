/**
 * Created by lein on 2016/12/9.
 */
"use strict";

const ZooKeeper = require('zookeeper');
const application = require('../application.json');
const MongoDb = require('./event-mongodb-datasource');
const wxToken = require('./weixin/Tokens').appids;

let zookeeper = new ZooKeeper();

let connZK;

let runs = [];

zookeeper.init({
    connect: application[process.env.NODE_ENV || 'dev'].zookeeper,
    timeout: 200000,
    debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
    host_order_deterministic: false
});

let listenerPath = [];

zookeeper.on(ZooKeeper.on_connected, function (zk) {
    console.log("reader on_connected: zk=%j", zk);
    connZK = zk;

    let run = () => {
        let t = listenerPath.shift();
        if (t) {
            listener(t.path, data => {
                process.nextTick(() => {
                    t.fun(data)
                });
                run();
            });
        }
    };
    run();

});

let listener = (path, fn) => {
    if (connZK) {
        connZK.aw_get(path, (type, state, path) => {
            console.log("zookeeper '" + path + "' data change!")
            listener(path, fn);
        }, (rc, error, stat, data) => {
            if (rc === 0) {
                fn(data)
            } else {
                setTimeout(() => {
                    listener(path, fn);
                }, 1000);
            }
        })
    } else {
        listenerPath.push({
            path: path,
            fun: fn
        })
    }
}

let listenerWx = (appid) => {
    wxToken[appid] = {};
    listener('/wxToken' + appid, data => {
        if (data) {
            console.log("listener token:" + data.toString());
            wxToken[appid].access_token = data.toString();
        } else {
            console.error("listener token error:" + appid);
        }
    });

    listener('/jsapiTicket' + appid, data => {
        if (data) {
            console.log("listener ticket:" + data.toString());
            wxToken[appid].ticket = data.toString();
        } else {
            console.error("listener ticket error:" + appid);
        }
    });
};

let wxs;
let db = new MongoDb('find', {
    find: {
        table: 'schedule',
        method: 'find',
        param: {
            type: 'wx'
        },
        fun: (rs, go) => {
            wxs = rs;
            go();
        }
    }
});

db.on('err', err => {
    process.nextTick(() => {
        throw err;
    });
});

db.on('end', () => {
    wxs.forEach(wx => {
        listenerWx(wx.appid)
    })

});

db.start();

exports.listenerWx = listenerWx;



