"use strict";
const MongoDb = require('../../utilities/event-mongodb-datasource');
const ObjectId = require('mongodb').ObjectId;
const common = require('../../utilities/common');
const application = require('../../application.json');
const url = require('url');
const request = require('request');
const ent = require('../../utilities/insurance_company');

module.exports  = router =>{
    router.all('/store_member', (req, res)=> {
        let page = 1;
        if (req.body.page && req.body.page.isInt()) {
            page = ~~req.body.page;
        } else if (req.query.page && req.quer.page.isInt()) {
            page = ~~req.query.page;
        }
        let result;
        let count;
        let condition = {
            "distributor.store_id" : ObjectId(req.query.id)
        };
        console.log(condition);
        let db = new MongoDb('count', {
            count: {
                table: 'user',
                method: 'count',
                param:condition,
                fun: (rs, go)=> {
                    count = rs;
                    go('find');
                }
            },
            find: {
                table: 'user',
                method: 'find',
                param: [condition, {
                    limit: 20,
                    skip: (page - 1) * 20,
                    sort: {
                        sort: -1
                    }
                }],
                fun: (rs, go)=> {
                    result = rs;
                    console.log(result)
                    go();
                }
            },
        });

        db.on('err', err=> {
            process.nextTick(()=> {
                throw err;
            })
        });

        db.on('end', ()=> {
            res.jade('manager/store_member/store_member_list',{
                page: common.page(result, count, page, 20),
                storeId:req.query.id
            });

        });

        db.start();
    });
    router.get('/store_member1', (req, res)=> {
        let page = 1;
        let result;
        let count;
        let condition = {
            "distributor.store_id" : ObjectId(req.query.id)
        };
        console.log(condition);
        let db = new MongoDb('count', {
            count: {
                table: 'user',
                method: 'count',
                param:condition,
                fun: (rs, go)=> {
                    count = rs;
                    go('find');
                }
            },
            find: {
                table: 'user',
                method: 'find',
                param: condition,
                fun: (rs, go)=> {
                    result = rs;
                    console.log(result)
                    go();
                }
            },
        });

        db.on('err', err=> {
            process.nextTick(()=> {
                throw err;
            })
        });

        db.on('end', ()=> {
            if(result){
                res.push({
                    code:"success",
                    message:result
                })
            }else{
                res.push({
                    code: "failure",
                    message: "该店铺未绑定子店铺"
                })
            }
            // res.jade('manager/store_member/store_member_list',{
            //     result: result,
            //     storeId:req.query.id
            // });

        });

        db.start();
    });

    router.get('/store_member/info', (req, res) => {
        let store_obj = {};
        let channals = {};
        //let userchan = {};
        let stores =[];
        let parentId ;
        let user={};
        let parents='';
        let manager = {};
        let one_channnel ={};
        let go = () => {
            res.jade('manager/store_member/store_member_info', {
                info: store_obj,
                channels:channals,
                //userchan:userchan,
                stores:stores,
                parent:parents,
                storId:req.query.storeId,
                user:user,
                manager:manager,
                oneChannnel:one_channnel,
                ents:ent.exist(),
            })
        };
        let mDb = new MongoDb(req.query.id?'find_user':"find" , {
            find_user:{
                table: 'user',
                method: 'findOne',
                param: {
                    _id: ObjectId(req.query.id)
                },
                fun: (rs, go) => {
                    user = rs;
                    parentId=user.parent?user.parent._id:'';
                    go(user.parent?"find_parent":'find');
                }
            },
            find_parent:{
                table: 'user',
                method: 'findOne',
                param: () => {
                    return {_id: ObjectId(parentId)}
                },
                fun: (rs, go) => {
                    parents = rs;
                    go('find');
                }
            },
            find: {
                table: 'store',
                method: 'findOne',
                param: {
                    delete_status:{$ne:1},
                    _id: ObjectId(req.query.storeId)
                },
                fun: (rs, go) => {
                    store_obj = rs;
                    go('find_one_channel');
                }
            },
            find_one_channel:{
                table: 'channel',
                method: 'findOne',
                param: ()=>{
                    return {_id:store_obj.channel_id}
                },
                fun: (rs, go) => {
                    one_channnel=rs;
                    go("find_store_manager");
                }
            },
            find_store_manager:{
                table: 'user',
                method: 'findOne',
                param: {
                    "distributor.store_id":ObjectId(req.query.storeId),
                    is_manager: "1"
                },
                fun: (rs, go) => {
                    manager = rs;
                    go('find_user_channel');
                }
            },
            find_user_channel:{
                table: 'channel',
                method: 'findOne',
                param: ()=>{
                    return {_id: ObjectId(req.session.user.channel_id)}
                },
                fun: (rs, go) => {
                    //userchan=rs;
                    if(req.session.user.auth.indexOf("STORE")!= -1){
                        go("find_channel");
                    }else{
                        go("find_all_store");
                    }
                }
            },
            find_all_store:{
                table: 'store',
                method: 'find',
                param:()=> {
                    return {
                        channel_id: store_obj.channel_id
                    }
                },
                fun: (rs, go) => {
                    stores = rs;
                    go('find_channel');
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
    router.post('/store_member/save', (req, res)=> {
        common.validate(req.body, {
            //entConf: 'notnull',
            channel: 'notnull',
            store: 'notnull',
            isManager: 'notnull',
            loginName: 'notnull',
            username: 'notnull',
            bankOwner: 'notnull',
            bankName: 'notnull',
            bankCode: 'notnull',
            // cycleTime: 'notnull',
            freezingAmount: 'notnull'
        });
        let user = {};
        let parentuser={};
        let channel ={};
       // let entConf = JSON.parse(req.body.entConf);
        let db = new MongoDb((function () {
            if(req.body.isManager=="1"){
                return "update";
            }else{
                //return req.body.id ? 'update_one' : 'find_channel';
                return req.body.storeNext!='-1'&&!req.body.id?"find_scale":req.body.id ? 'update_one' : 'find_channel';
            }
        })(), {
            update: {
                table: 'user',
                method: 'updateOne',
                param: ()=>[{
                    "distributor.store_id":ObjectId(req.body.store),
                    is_manager:"1"
                }, {
                    '$set': {
                        is_manager:"2",
                    }
                }],
                fun: (rs, go)=> {
                    //go( req.body.id ? 'update_one' : 'find_channel');
                    go(req.body.storeNext!='-1'&&!req.body.id?"find_scale":req.body.id ? 'update_one' : 'find_channel');
                }
            },
            find_scale:{
               table:'user',
               method:'findOne',
                param:()=>[{
                   _id:ObjectId(req.body.storeNext)
                }],
                fun: (rs, go)=> {
                    delete rs.parent;
                    parentuser=rs
                    go(req.body.id ? 'update_one' : 'find_channel');
                }
            },
            update_one: {
                table: 'user',
                method: 'updateOne',
                param: ()=>[{
                    _id: ObjectId(req.body.id)
                }, {
                    '$set': {
                        is_manager:req.body.isManager,
                        role: 'customer',
                        nickname: req.body.username,
                        //distributor:{
                            "distributor.name":req.body.username,
                            "distributor.store_name":req.body.store,
                            "distributor.store_id":ObjectId(req.body.store),
                            "distributor.mobile":req.body.loginName,
                            "distributor.bank_owner":req.body.bankOwner,
                            "distributor.bank_name":req.body.bankName,
                            "distributor.bank_card":req.body.bankCode,
                           // cycle_time:~~req.body.cycleTime,
                            "distributor.freezing_amount":~~req.body.freezingAmount,
                            //ent_conf:entConf,
                            //parent:scale,
                            "distributor.ent_name":req.body.store,
                            "distributor.limit":{
                                day_num:req.body.dayNum&&req.body.dayNum>0?~~req.body.dayNum:0,
                                total_num:req.body.totalNum&&req.body.totalNum>0?~~req.body.totalNum:0
                            }
                        }
                    //}
                }],
                fun: (rs, go)=> {
                    go();
                }
            },
            save_user:{
                table: 'user',
                method: 'insert',
                param: () => {
                    let o = {
                        nickname: req.body.username,
                        is_manager:req.body.isManager,
                        role: 'customer',
                        create_time: new Date(),
                        login_name: req.body.loginName,
                        auth: ["OPERATE"],
                        password: String.md5(req.body.loginName + "{"+req.body.password+"}"),
                        channel_id : ObjectId(req.body.channel),
                        channel_name:channel.name,
                        status:1,
                        regist_time:new Date(),
                        distributor:{
                            name:req.body.username,
                            store_name:req.body.store,
                            store_id:ObjectId(req.body.store),
                            mobile:req.body.loginName,
                            bank_owner:req.body.bankOwner,
                            bank_name:req.body.bankName,
                            bank_card:req.body.bankCode,
                            //cycle_time:~~req.body.cycleTime,
                            freezing_amount:~~req.body.freezingAmount,
                            //ent_conf:entConf,
                            ent_name:req.body.store,
                            limit:{
                                day_num:req.body.dayNum&&req.body.dayNum>0?~~req.body.dayNum:0,
                                total_num:req.body.totalNum&&req.body.totalNum>0?~~req.body.totalNum:0
                            }
                        }

                    };
                    if(req.body.storeNext!='-1'){
                        o.parent= parentuser
                    }
                    return o;
                },
                fun: (rs, go)=> {
                    user=rs;
                    go();
                }
            },
            find_channel:{
                table: 'channel',
                method: 'findOne',
                param:{
                    _id:ObjectId(req.body.channel)
                },
                fun: (rs, go) => {
                    channel=rs;
                    go('save_user')
                }
            },
        });

        db.on('err', err=> {
            process.nextTick(()=> {
                throw err;
            })
        });

        db.on('end', ()=> {
            res.redirect(req.rootPath + '/store_member?id='+req.body.store);
        });

        db.start();
    });
    router.post('/store_member/changePwd',(req,res)=>{
        console.log(req.body.loginName);
        console.log(req.body.id);
        console.log(req.body.newPwd);
        console.log(req.body.store);
        let db = new MongoDb("changePwd",{
            changePwd:{
                table:'user',
                method:"updateOne",
                param:()=>[{
                    _id:ObjectId(req.body.id)
                },{
                    '$set':{
                        password: String.md5(req.body.loginName + "{"+req.body.newPwd+"}"),
                    }
                }],
                fun: (rs, go)=> {
                    go();
                }
            }
        });
        db.on('err', err=> {
            process.nextTick(()=> {
                throw err;
            })
        });

        db.on('end', ()=> {
            res.redirect(req.rootPath + '/store_member?id='+req.body.store);
        });

        db.start();
    })
    router.post('/store_member/addNum', (req, res) => {
        let db2 = new MongoDb('add', {
            add:{
                table: 'user',
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
                    console.log(1131121)
                    console.log(rs)
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
                        status :3,
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
    /*验证用户是否注册*/
    router.post('/store_member/checkedUser',(req,res)=>{
        let message="success";
        let db = new MongoDb("user_find",{
            user_find:{
                table: 'user',
                method: 'findOne',
                param: {
                    login_name: req.body.login_name,
                    distributor:{$exists:true},
                    role:"customer"
            },
            fun: (rs, go)=> {
               if(!rs){
                   message="faile"
               }
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
            res.push({
                "code":message
            })
        });

        db.start();
    })
    router.post('/store_member/refreshNum', (req, res) => {
        let db2 = new MongoDb('add', {
            add:{
                table: 'user',
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
                        status :3,
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
}