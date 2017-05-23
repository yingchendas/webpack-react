"use strict";
const events = require('events');
const util = require('util');
const MongoClient = require("mongodb").MongoClient;
const application = require('../application.json');
const url = application[process.env.NODE_ENV || 'dev'].mongo;

let db;
let status = 0;
let fns = [];

let MongoDb = function (to, data) {
    events.EventEmitter.call(this);
    this.data = data;
    this.to = to;
};

util.inherits(MongoDb, events.EventEmitter);

MongoDb.prototype.err = function (err) {
    this.emit('err', err);
};

MongoDb.prototype.start = function () {
    let self = this;

    let exeTable = function (to, obj) {
        let data = obj[to];
        let table = db.collection(data.table);
        console.log("MONGO EXE    -- " + data.table + "." + data.method)
        let callback = function (err, rs) {
            if (err) {
                self.err(err);
            } else {
                try {
                    data.fun(rs, function (go) {
                        if (go) {
                            exeTable(go, obj);
                        } else
                            self.end();
                    });
                } catch (e) {
                    self.err(err);
                }
            }
        };
        let findCallback = function (err, rs) {
            rs.toArray(function (err, rs) {
                callback(err, rs);
            });
        };
        let exeString = 'table.' + data.method + '(';
        let tempData;
        if (data.param) {
            if (data.param instanceof Function) {
                tempData = data.param();
            } else {
                tempData = data.param;
            }
            if (tempData instanceof Array) {
                for (let i = 0; i < tempData.length; i++) {
                    exeString += 'tempData[' + i + '],';
                }
            } else {
                exeString += 'tempData,';
            }
        }
        if (data.method === 'find') {
            exeString += 'findCallback)';
        } else {
            exeString += 'callback)';
        }
        console.log("MONGO PARAM  -- " + JSON.stringify(tempData || {}))
        console.log("MONGO SCRIPT -- " + exeString)
        eval(exeString);
    };

    if (db) {
        exeTable(self.to, self.data);
    } else if (status === 1) {
        fns.push({
            start: self.to,
            data: self.data
        });
    } else {
        status = 1;
        MongoClient.connect(url, {
            server: {
                poolSize: 10,
                socketOptions: {
                    autoReconnect: true
                },
                reconnectTries: 30,
                reconnectInterval: 1000
            }
        }, function (err, database) {
            if (err) {
                self.err(err);
            } else {
                db = database;
                exeTable(self.to, self.data);
                let temp;
                while (temp = fns.shift()) {
                    exeTable(temp.start, temp.data);
                }
            }
        });
    }
};

MongoDb.prototype.end = function () {
    this.emit('end');
};

MongoDb.prototype.close = function () {
    db.close();
};

module.exports = MongoDb;