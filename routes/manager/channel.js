/**
 * Created by Lein on 2016/11/14.
 */
"use strict";

const MongoDb = require('../../utilities/event-mongodb-datasource');
const ObjectId = require('mongodb').ObjectId;
const common = require('../../utilities/common');
const ent = require('../../utilities/insurance_company');
const util = require("util");


module.exports = router => {
    router.all('/channel', (req, res) => {
        let page = 1;
        if (req.body.page && req.body.page.isInt()) {
            page = ~~req.body.page;
        } else if (req.query.page && req.quer.page.isInt()) {
            page = ~~req.query.page;
        }
        let count;
        let result;
        let db = new MongoDb('count', {
            count: {
                table: 'channel',
                method: 'count',
                param : {
                    delete_status:{$ne:1}
                },
                fun: (rs, go) => {
                    count = rs;
                    go('find');
                }
            },
            find: {
                table: 'channel',
                method: 'find',
                param: [{
                    delete_status:{$ne:1}
                }, {
                    limit: 20,
                    skip: (page - 1) * 20,
                    sort: {
                        _id: 1
                    }
                }],
                fun: (rs, go) => {
                    result = rs;
                    go();
                }
            }
        })

        db.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db.on('end', () => {
            res.jade('manager/channel/channel_list', {
                page: common.page(result, count, page, 20),
            })
        });

        db.start();
    });

    router.get('/channel/info', (req, res) => {
        let wx = {};
        let wxpay = {};
        let alipay={};
        common.validate(req.query, {
            id: 'id'
        });

        let channel = {};
        let go = () => {
            res.jade('manager/channel/channel_info', {
                info: channel,
                wxs: wx,
                wxpays: wxpay,
                ents:ent.exist(),
                alipay:alipay
            })
        }

        let mDb = new MongoDb(req.query.id ? 'find' : 'wx', {
            find: {
                table: 'channel',
                method: 'findOne',
                param: {
                    delete_status:{$ne:1},
                    _id: ObjectId(req.query.id)
                },
                fun: (rs, go) => {
                    channel = rs;
                    go('wx');
                }
            },
            wx: {
                table: 'thirdparty',
                method: 'find',
                param:{
                    type: 'wx'
                },
                fun: (rs, go) => {
                    wx = rs;
                    go('wxpay');
                }
            },
            wxpay: {
                table: 'thirdparty',
                method: 'find',
                param: {type: 'wx', pay_key: {$exists: true}},
                fun: (rs, go) => {
                    wxpay = rs;
                    go('alipay');
                }
            },
            alipay:{
                table: 'thirdparty',
                method: 'find',
                param: {type: 'alipay'},
                fun: (rs, go) => {
                    alipay = rs;
                    go();
                }
            }
        });
        mDb.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        mDb.on('end', () => {
            go();
        });

        mDb.start();
    });

    router.post('/channel/save', (req, res) => {
        common.validate(req.body, {
            "pay_type" : "notnull",
            "name":"notnull",
            "code":"notnull",
            "cycleTime":"notnull",
            "freezingAmount":"notnull",
            "scale_first":"notnull",
            "scale_second":"notnull"
        });
        let loginName = '';
        if(req.body.login_type === 'wx'){
            loginName=req.body.login_name
        }
        let payWays=[];
        let payType = util.isArray(req.body.pay_type) ? req.body.pay_type : [req.body.pay_type];
        let entId = req.body.entId.split(",");
        let payName ='';
        let alipay='';
        let result = '';
        let entConf = JSON.parse(req.body.entConf);
        for(var i=0;i<payType.length;i++){
            if(payType[i]=='wx'){
                let obj = {payId:req.body.pay_web,payName:'wx',payType:"1"};
                payWays.push(obj);
                let obj1 = {payId:req.body.wxpay_app,payName:'wx',payType:"2"}
                payWays.push(obj1);
                //payName = req.body.pay_name
            }else if(payType[i]=='zfb'){
                //alipay=req.body.alipay_name
                let obj = {payId:req.body.alipay_web,payName:'zfb',payType:"1"};
                payWays.push(obj);
                let obj1 = {payId:req.body.alipay_app,payName:'zfb',payType:"2"};
                payWays.push(obj1);
            }
        }
        console.log(12312312);
        console.log(payWays)
        let db = new MongoDb(req.body.id?'update':'find', {
            find:{
                table: 'channel',
                method: 'findOne',
                param:{
                    code:req.body.code
                },
                fun: (rs, go) => {
                    go('insert')
                }
            },
            insert: {
                table: 'channel',
                method: 'insert',
                param: () => {
                    return {
                        name: req.body.name,
                        code:req.body.code,
                        login_type: req.body.login_type,
                        login_name: loginName,
                        pay_ways:payWays,
                        ent_id :entId,
                        withdrawal_rate:parseFloat(req.body.withdrawalRate),
                        withdrawal_type:req.body.withdrawalType,
                        is_owner:req.body.isOwner?req.body.isOwner:"2",
                        allow_loginB:req.body.allowloginB?req.body.allowloginB:"2",
                        cycle_time:~~req.body.cycleTime,
                        freezing_amount:~~req.body.freezingAmount,
                        limit:{
                            day_num:req.body.dayNum&&req.body.dayNum>0?~~req.body.dayNum:0,
                            total_num:req.body.totalNum&&req.body.totalNum>0?~~req.body.totalNum:0
                        },
                        alipay_name:alipay,
                        ent_conf:entConf,
                        scale:{
                            "scale_first":parseFloat(req.body.scale_first),
                            "scale_second":parseFloat(req.body.scale_second),
                        }
                    }
                },
                fun: (rs, go) => {
                    result=rs;
                    go('save_user');
                }
            },
            save_user:{
                table: 'user',
                method: 'insert',
                param: () => {
                    let o = {
                        username: req.body.name+"_admin",
                        role: 'manager',
                        create_time: new Date(),
                        login_name: req.body.name+"_admin",
                        auth: ["CHANNEL"],
                        password: String.md5(req.body.name+"_admin" + "{111111}"),
                        channel_id : ObjectId(result.ops[0]._id),
                        channel_name : req.body.name,
                        status:1
                    };
                    return o;
                },
                fun: (rs, go)=> {
                    go();
                }
            },
            update:{
                table: 'channel',
                method: 'updateOne',
                param:()=>[{
                    _id : ObjectId(req.body.id)
                },{
                    '$set':{
                        name: req.body.name,
                        code:req.body.code,
                        login_type: req.body.login_type,
                        login_name: loginName,
                        pay_ways:payWays,
                        ent_id :entId,
                        withdrawal_rate:parseFloat(req.body.withdrawalRate),
                        withdrawal_type:req.body.withdrawalType,
                        is_owner:req.body.isOwner?req.body.isOwner:"2",
                        allow_loginB:req.body.allowloginB?req.body.allowloginB:"2",
                        cycle_time:~~req.body.cycleTime,
                        freezing_amount:~~req.body.freezingAmount,
                        limit:{
                            day_num:req.body.dayNum&&req.body.dayNum>0?~~req.body.dayNum:0,
                            total_num:req.body.totalNum&&req.body.totalNum>0?~~req.body.totalNum:0
                        },
                        alipay_name:alipay,
                        ent_conf:entConf,
                        scale:{
                            "scale_first":parseFloat(req.body.scale_first),
                            "scale_second":parseFloat(req.body.scale_second),
                        }
                    }
                }],
                fun: (rs, go) => {
                    go();
                }
            }

        })

        db.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db.on('end', () => {
            res.redirect(req.rootPath + "/channel")
        });

        db.start();
    });

    router.get('/channel/remove', (req, res) => {
        let db2 = new MongoDb('remove', {
            remove:{
                table: 'channel',
                method: 'updateOne',
                param:()=>[{
                    _id:ObjectId(req.query.id)
                },{
                    '$set': {
                        delete_status: 1,
                    }
                },{
                    multi: true
                }],
                fun:(rs,go) => {
                    go()
                }
            }
        })
        db2.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db2.on('end', () => {
            res.redirect(req.rootPath + "/channel")
        });

        db2.start();
    });

    router.post('/channel/findCode', (req, res) => {
        let chan;
        let db2 = new MongoDb('find', {
            find:{
                table: 'channel',
                method: 'findOne',
                param:()=>{
                    return{
                        code:req.body.code,
                        delete_status:{$ne:1}
                    }
                },
                fun:(rs,go) => {
                    chan=rs;
                    go()
                }
            }
        })
        db2.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db2.on('end', () => {
            if(chan){
                res.push({
                    "code":"fail"
                })
            }else{
                res.push({
                    "code":"success"
                })
            }
        });

        db2.start();
    });


    router.post('/channel/addNum', (req, res) => {
        let db2 = new MongoDb('add', {
            add:{
                table: 'channel',
                method: 'updateOne',
                param:()=>[{
                    _id:ObjectId(req.body.id)
                },{
                    '$set': {
                        "limit.total_num":~~req.body.totalNum+~~req.body.addNum,
                    }
                },{
                    multi: true
                }],
                fun:(rs,go) => {
                    go('save_log');
                }
            },
            save_log:{
                table: 'query_total_number_log',
                method: 'insert',
                param: () => {
                    return {
                        user_id:ObjectId(req.body.userId),
                        total_num: ~~req.body.totalNum,
                        add_num:~~req.body.addNum,
                        create_time: new Date(),
                        status :1,
                    }
                },
                fun: (rs, go) => {
                    go();
                }
            }
        })
        db2.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db2.on('end', () => {
            res.push({
                "code":"success"
            })
        });

        db2.start();
    });

    router.post('/channel/refreshNum', (req, res) => {
        let db2 = new MongoDb('add', {
            add:{
                table: 'channel',
                method: 'updateOne',
                param:()=>[{
                    _id:ObjectId(req.body.id)
                },{
                    '$set': {
                        "limit.total_num":0,
                    }
                },{
                    multi: true
                }],
                fun:(rs,go) => {
                    go('save_log');
                }
            },
            save_log:{
                table: 'query_total_number_log',
                method: 'insert',
                param: () => {
                    return {
                        user_id:ObjectId(req.body.userId),
                        add_num:0,
                        create_time: new Date(),
                        status :1,
                    }
                },
                fun: (rs, go) => {
                    go();
                }
            }
        })
        db2.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db2.on('end', () => {
            res.push({
                "code":"success"
            })
        });

        db2.start();
    });
};