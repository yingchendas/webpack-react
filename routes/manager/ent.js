
"use strict";
const MongoDb = require('../../utilities/event-mongodb-datasource');
const ObjectId = require('mongodb').ObjectId;
const common = require('../../utilities/common');
const application = require('../../application.json');
const url = require('url');
const request = require('request');
const ent = require('../../utilities/insurance_company');

module.exports  = router => {
    router.all('/ent', (req, res) => {
        let page = 1;
        if (req.body.page && req.body.page.isInt()) {
            page = ~~req.body.page;
        } else if (req.query.page && req.quer.page.isInt()) {
            page = ~~req.query.page;
        }
        let result;
        let count;
        let condition = {};
        let user = req.session.user;
        if(user.channel_id){
            condition ={$or:[{customer_channel:user.channel_id.toString()},{second_channel:user.channel_id.toString()}]};
        }
        let db = new MongoDb('count', {
            count: {
                table: 'ent_apply',
                method: 'count',
                param: condition,
                fun: (rs, go) => {
                    count = rs;
                    go('find');
                }
            },
            find: {
                table: 'ent_apply',
                method: 'find',
                param: [condition, {
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
        });

        db.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db.on('end', () => {
            res.jade('manager/ent/ent_list', {
                page: common.page(result, count, page, 20),
            });

        });

        db.start();
    });

    router.get('/ent/info', (req, res) => {
        let ent_obj = {};
        let channals = {};
        let go = () => {
            res.jade('manager/ent/ent_info', {
                info: ent_obj,
                ents:ent.exist(),
                channels:channals,
            })
        };
        let mDb = new MongoDb(req.query.id?'find':"find_channel" , {
            find: {
                table: 'ent_apply',
                method: 'findOne',
                param: {
                    delete_status:{$ne:1},
                    _id: ObjectId(req.query.id)
                },
                fun: (rs, go) => {
                    ent_obj = rs;
                    go('find_one_channel');
                }
            },
            find_one_channel:{
                table: 'channel',
                method: 'findOne',
                param: ()=>{
                    return {_id: ObjectId(ent_obj.second_channel)}
                },
                fun: (rs, go) => {
                    ent_obj.second_channel = rs==null?ent_obj.second_channel:rs;
                    go("find_channel");
                }
            },
            find_channel: {
                table: 'channel',
                method: 'find',
                param: {
                    delete_status:{$ne:1},
                },
                fun: (rs, go) => {
                    channals = rs==null?channals:rs;
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

    router.post('/ent/save', (req, res)=> {
        let entConf = JSON.parse(req.body.entConf);
        let obj = {};
        let param = {
            freezing_amount:req.body.freezingAmount,
            user_id:req.body.userId,
            ent_name:req.body.entName,
            ent_conf:entConf,
            second_channel:req.body.secondChannel,
            uploadId:req.body.uploadId,
            cycle_time:req.body.cycleTime
        };
        checkEnt(param);
        let db = new MongoDb('findOne', {
            findOne:{
                table: 'ent_apply',
                method: 'findOne',
                param:()=> {
                    return {
                        _id:ObjectId(req.body.id)
                    }
                },
                fun: (rs, go) => {
                    obj=rs;
                    go('update');
                }
            },
            update:{
                table: 'ent_apply',
                method: 'updateOne',
                param:()=>[{
                    _id : ObjectId(req.body.id)
                },{
                    '$set':{
                        freezing_amount:parseFloat(req.body.freezingAmount),
                        ent_name:req.body.entName,
                        ent_conf:entConf,
                        second_channel:req.body.secondChannel=='-1'?obj.customer_channel:JSON.parse(req.body.secondChannel)._id,
                        status:1,
                        uploadId:req.body.uploadId,
                        limit:{
                            day_num:req.body.dayNum&&req.body.dayNum>0?~~req.body.dayNum:0,
                            total_num:req.body.totalNum&&req.body.totalNum>0?~~req.body.totalNum:0
                        },
                        cycle_time:~~req.body.cycleTime
                    }
                }],
                fun: (rs, go) => {
                    go('update_user');
                }
            },
            update_user:{
                table: 'user',
                method: 'updateOne',
                param:()=>[{
                    _id : ObjectId(req.body.userId)
                },{
                    '$set':{
                        distributor:{
                            name:req.body.customer_name,
                            store_name:req.body.storeName,
                            mobile:req.body.mobile,
                            bank_name:req.body.bankName,
                            bank_card:req.body.bankCarNo,
                            freezing_amount:parseFloat(req.body.freezingAmount),
                            second_channel:req.body.secondChannel=='-1'?obj.customer_channel:JSON.parse(req.body.secondChannel)._id,
                            ent_name:req.body.entName,
                            ent_conf:entConf,
                            uploadId:req.body.uploadId,
                            limit:{
                                day_num:req.body.dayNum&&req.body.dayNum>0?~~req.body.dayNum:0,
                                total_num:req.body.totalNum&&req.body.totalNum>0?~~req.body.totalNum:0
                            },
                            cycle_time:~~req.body.cycleTime
                        }
                    }
                }],
                fun: (rs, go) => {
                    go();
                }
            }

        });
        db.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db.on('end', ()=> {
            res.redirect(req.rootPath + "/ent")

        });

        db.start();
    });

    router.all('/ent/refused', (req, res)=> {
        common.validate({refuled:req.body.refuled},{"refuled":"notnull"});
        console.log(req.body.refuled);
        let db = new MongoDb('update', {
            update:{
                table: 'ent_apply',
                method: 'updateOne',
                param:()=>[{
                    _id : ObjectId(req.body.id)
                },{
                    '$set':{
                        refuled:req.body.refuled,
                        status:-1
                    }
                }],
                fun: (rs, go) => {
                    go();
                }
            }

        });
        db.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db.on('end', ()=> {
            res.push({
                "code":"success"
            })

        });

        db.start();
    });

    router.post('/ent/setNum', (req, res) => {
        let db2 = new MongoDb('update_ent', {
            update_ent:{
                table: 'ent_apply',
                method: 'updateOne',
                param:()=>[{
                    _id:ObjectId(req.body.id)
                },{
                    '$set': {
                        "limit.day_num":~~req.body.setNum,
                    }
                },{
                    multi: true
                }],
                fun:(rs,go) => {
                    go('update_user');
                }
            },
            update_user:{
                table: 'user',
                method: 'updateOne',
                param:()=>[{
                    _id:ObjectId(req.body.userId)
                },{
                    '$set': {
                        "distributor.limit.day_num":~~req.body.setNum,
                    }
                },{
                    multi: true
                }],
                fun:(rs,go) => {
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

    router.post('/ent/addNum', (req, res) => {
        let db2 = new MongoDb('update_ent', {
            update_ent:{
                table: 'ent_apply',
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
                    go('update_user');
                }
            },
            update_user:{
                table: 'user',
                method: 'updateOne',
                param:()=>[{
                    _id:ObjectId(req.body.userId)
                },{
                    '$set': {
                        "distributor.limit.total_num":~~req.body.totalNum+~~req.body.addNum,
                    }
                },{
                    multi: true
                }],
                fun:(rs,go) => {
                    go("save_log");
                }
            },
            save_log:{
                table: 'query_total_number_log',
                method: 'insert',
                param: () => {
                    return {
                        user_id:ObjectId(req.body.user),
                        total_num: ~~req.body.totalNum,
                        add_num:~~req.body.addNum,
                        create_time: new Date(),
                        status :2,
                    }
                },
                fun: (rs, go) => {
                    go();
                }
            }
        });
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

    router.post('/ent/changeRate', (req, res) => {
        let entConf = JSON.parse(req.body.entConf);
        let db2 = new MongoDb('update_ent', {
            update_ent:{
                table: 'ent_apply',
                method: 'updateOne',
                param:()=>[{
                    _id:ObjectId(req.body.id)
                },{
                    '$set': {
                        freezing_amount:parseFloat(req.body.freezingAmount),
                        ent_name:req.body.entName,
                        ent_conf:entConf,
                        uploadId:req.body.uploadId,
                        cycle_time:~~req.body.cycleTime
                    }
                },{
                    multi: true
                }],
                fun:(rs,go) => {
                    go('update_user');
                }
            },
            update_user:{
                table: 'user',
                method: 'updateOne',
                param:()=>[{
                    _id:ObjectId(req.body.userId)
                },{
                    '$set': {
                        "distributor.freezing_amount":parseFloat(req.body.freezingAmount),
                        "distributor.ent_name":req.body.entName,
                        "distributor.ent_conf":entConf,
                        "distributor.uploadId":req.body.uploadId,
                        "distributor.cycle_time":~~req.body.cycleTime
                    }
                },{
                    multi: true
                }],
                fun:(rs,go) => {
                    go();
                }
            }
        });
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

    router.post('/ent/refreshNum', (req, res) => {
        let db2 = new MongoDb('update_ent', {
            update_ent:{
                table: 'ent_apply',
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
                    go('update_user');
                }
            },
            update_user:{
                table: 'user',
                method: 'updateOne',
                param:()=>[{
                    _id:ObjectId(req.body.userId)
                },{
                    '$set': {
                        "distributor.limit.total_num":0,
                    }
                },{
                    multi: true
                }],
                fun:(rs,go) => {
                    go("save_log");
                }
            },
            save_log:{
                table: 'query_total_number_log',
                method: 'insert',
                param: () => {
                    return {
                        user_id:ObjectId(req.body.user),
                        add_num:0,
                        create_time: new Date(),
                        status :2,
                    }
                },
                fun: (rs, go) => {
                    go();
                }
            }
        });
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
}




function checkEnt(param) {
    common.validate(param,{
        "freezing_amount":"notnull",
        "user_id":"notnull",
        "ent_name":"notnull",
        "ent_conf":"notnull",
        "second_channel":"notnull",
        "uploadId":"notnull",
        "cycle_time":"notnull"
    })
}