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

    router.all('/thirdparty/alipay/list', (req, res) => {
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
                    "type":"alipay"
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
                    "type":"alipay"
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
            res.jade('manager/thirdparty/alipay/alipay_list', {
                page: common.page(result, count, page, 20)
            });
        });

        db.start();
    });

    router.get('/thirdparty/alipay/info', (req, res) => {

        let result={};
        let db = new MongoDb('findOne', {
            findOne: {
                table: 'thirdparty',
                method: 'findOne',
                param: {
                    _id: ObjectId(req.query.id)
                },
                fun: (data, go) => {
                    result = data==null?{}:data;
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

            res.jade('manager/thirdparty/alipay/alipay_info', {
                info: result
            });

        });

        db.start();
    });

    router.post('/thirdparty/alipay/save', (req, res) => {
        common.validate(req.body, {
            name: 'notnull',
            appid: 'notnull',
            alipayKey: 'notnull',
        });
        let db = new MongoDb(req.body.id ? 'update' : 'save', {
            save: {
                table: 'thirdparty',
                method: 'insert',
                param: () => {
                    let data = {
                        name: req.body.name,
                        appid: req.body.appid,
                        alipay_key: req.body.alipayKey,
                        type: 'alipay',
                        alipay_public_key:req.body.alipayComKey
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
                        alipay_key: req.body.alipayKey,
                        type: 'alipay',
                        alipay_public_key:req.body.alipayComKey
                    }];

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
            res.redirect(req.rootPath + '/thirdparty/alipay/list')
        });

        db.start();
    });


};