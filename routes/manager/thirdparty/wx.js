/**
 * Created by lein on 2016/12/8.
 */
"use strict";

const MongoDb = require('../../../utilities/event-mongodb-datasource');
const common = require('../../../utilities/common');
const ObjectId = require('mongodb').ObjectId;
const request = require('request');
const application = require('../../../application.json');
const url = require('url');
const querystring = require('querystring');
const util = require("util");

module.exports = router => {

    router.all('/thirdparty/wx/list', (req, res) => {
        let page = 1;
        if (req.body.page && req.body.page.isInt()) {
            page = ~~req.body.page;
        } else if (req.query.page && req.quer.page.isInt()) {
            page = ~~req.query.page;
        }

        let result = {};
        let count;
        let db = new MongoDb('count', {
            count: {
                table: 'thirdparty',
                method: 'count',
                param:{
                    "type":"wx"
                },
                fun: (data, go) => {
                    count = data
                    if (count > 0)
                        go('find')
                    else
                        go();
                }
            },
            find: {
                table: 'thirdparty',
                method: 'find',
                param: [{
                    "type":"wx"
                }, {
                    skip: (page - 1) * 20,
                    limit: 20
                }],
                fun: (data, go) => {
                    result = data;
                    go();
                }
            }
        });

        db.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db.on('end', () => {
            res.jade('manager/thirdparty/wx/wx_list', {
                page: common.page(result, count, page, 20)
            });
        });

        db.start();
    });

    router.get('/thirdparty/wx/info', (req, res) => {
        common.validate(req.query, {
            id: ['id']
        });

        if (req.query.id) {
            let result;
            let db = new MongoDb('findOne', {
                findOne: {
                    table: 'thirdparty',
                    method: 'findOne',
                    param: {
                        _id: ObjectId(req.query.id)
                    },
                    fun: (data, go) => {
                        result = data;
                        go();
                    }
                }
            });

            db.on('err', err => {
                process.nextTick(() => {
                    throw err;
                })
            });

            db.on('end', () => {

                let requestURL = url.format({
                    protocol: 'http',
                    hostname: application[process.env.NODE_ENV || 'dev'].schedule.host,
                    port: application[process.env.NODE_ENV || 'dev'].schedule.port,
                    pathname: '/schedule/isRunningWx'
                });

                request.post(requestURL,{form:{
                    appid:result.appid
                }},(err,response,body)=>{
                    if(!err && response.statusCode === 200){
                        let b = JSON.parse(body);
                        console.log(b);
                        res.jade('manager/thirdparty/wx/wx_info', {
                            info: result,
                            isRun:b.message
                        });
                    }
                });

            });

            db.start();
        } else
            res.jade('manager/thirdparty/wx/wx_info', {
                info: {}
            });
    });

    router.post('/thirdparty/wx/save', (req, res) => {
        if (!req.body.is_pay)
            common.validate(req.body, {
                name: 'notnull',
                appid: 'notnull',
                app_secret: 'notnull',
                is_pay: '^1$',
                id: ['id']
            });
        else {
            common.validate(req.body, {
                name: 'notnull',
                appid: 'notnull',
                app_secret: 'notnull',
                is_pay: ['notnull', '^1$'],
                pay_key: 'notnull',
                id: ['id'],
                protal_code: 'notnull'
            });
        }

        let db = new MongoDb(req.body.id ? 'update' : 'save', {
            save: {
                table: 'thirdparty',
                method: 'insert',
                param: () => {
                    let data = {
                        name: req.body.name,
                        appid: req.body.appid,
                        app_secret: req.body.app_secret,
                        type: 'wx'
                    }

                    if (req.body.is_pay) {
                        data.pay_key = req.body.pay_key;
                        data.protal_code = req.body.protal_code;
                    }

                    return data;
                },
                fun: (data, go) => go()
            },
            update: {
                table: 'thirdparty',
                method: 'update',
                param: () => {
                    let data = [{
                        _id: ObjectId(req.body.id)
                    }, {
                        name: req.body.name,
                        appid: req.body.appid,
                        app_secret: req.body.app_secret,
                        type: 'wx'
                    }];

                    if (req.body.is_pay) {
                        data[1].pay_key = req.body.pay_key;
                        data[1].protal_code = req.body.protal_code;
                    }

                    return data;
                },
                fun: (data, go) => go()
            }
        });

        db.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db.on('end', () => {
            res.redirect(req.rootPath + '/thirdparty/wx/list')
        });

        db.start();
    });

    router.post('/thirdparty/wx/test', (req, res) => {
        common.validate(req.body, {
            appid: 'notnull',
            app_secret: 'notnull'
        });


        let requestURL = url.format({
            protocol: 'http',
            hostname: application[process.env.NODE_ENV || 'dev'].schedule.host,
            port: application[process.env.NODE_ENV || 'dev'].schedule.port,
            pathname: '/schedule/getWxToken'
        });
        request.post(requestURL, {
            form: {
                appid: req.body.appid,
                secret: req.body.app_secret
            }
        }, (err, response, body) => {
            if (err || response.statusCode !== 200) {
                let err = new Error('加入队列失败')
                process.nextTick(() => {
                    throw err;
                })
            } else {
                res.push({
                    code: 'success',
                    message: JSON.parse(body)
                })
            }
        })
    });

    router.post('/thirdparty/wx/run', (req, res) => {

        common.validate(req.body, {
            appid: 'notnull',
            app_secret: 'notnull'
        });

        let requestURL = url.format({
            protocol: 'http',
            hostname: application[process.env.NODE_ENV || 'dev'].schedule.host,
            port: application[process.env.NODE_ENV || 'dev'].schedule.port,
            pathname: '/schedule/runWxToken'
        });

        request.post(requestURL, {
            form: {
                appid: req.body.appid,
                secret: req.body.app_secret
            }
        }, (err, response, body) => {
            if (err || response.statusCode !== 200) {
                let err = new Error('加入队列失败')
                process.nextTick(() => {
                    throw err;
                })
            } else {
                res.push({
                    code: 'success',
                    message: '成功'
                })
            }
        })
    });
};