"use strict";
const MongoDb = require('../../utilities/event-mongodb-datasource');
const ObjectId = require('mongodb').ObjectId;
const common = require('../../utilities/common');
const application = require('../../application.json');
const url = require('url');
const request = require('request');

module.exports  = router =>{
    router.all('/store', (req, res)=> {
        let page = 1;
        if (req.body.page && req.body.page.isInt()) {
            page = ~~req.body.page;
        } else if (req.query.page && req.quer.page.isInt()) {
            page = ~~req.query.page;
        }
        let result;
        let count;
        let condition = {delete_status:{$ne:1}};
        let user = req.session.user;
        if(user.channel_id){
            condition["channel"] =user.channel_id;
        }
        let db = new MongoDb('count', {
            count: {
                table: 'store',
                method: 'count',
                param:condition,
                fun: (rs, go)=> {
                    count = rs;
                    go('find');
                }
            },
            find: {
                table: 'store',
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
            res.jade('manager/store/store_list',{
                page: common.page(result, count, page, 20),
            });

        });

        db.start();
    });

    router.get('/store/info', (req, res) => {
        let store_obj = {};
        let channals = {};
        let userchan = {};
        let go = () => {
            res.jade('manager/store/store_info', {
                info: store_obj,
                channels:channals,
                userchan:userchan
            })
        };
        let mDb = new MongoDb(req.query.id?'find':"find_user_channel" , {
            find: {
                table: 'store',
                method: 'findOne',
                param: {
                    delete_status:{$ne:1},
                    _id: ObjectId(req.query.id)
                },
                fun: (rs, go) => {
                    store_obj = rs;
                    console.log(store_obj);
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
                    userchan=rs;
                    console.log(rs)
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

    router.post('/store/save', (req, res)=> {
        common.validate(req.body, {
            name: 'notnull',
            channel: 'notnull'
        });
        let user = {};
        let channel ={};
        let db = new MongoDb(req.body.id ? 'update' : 'find_channel', {
            update: {
                table: 'store',
                method: 'updateOne',
                param: ()=>[{
                    _id: ObjectId(req.body.id)
                }, {
                    '$set': {
                        channel_id:ObjectId(req.body.channel),
                        name: req.body.name,
                        mobile:req.body.mobile,
                        address:req.body.address,
                        des:req.body.des
                    }
                }],
                fun: (rs, go)=> {
                    go();
                }
            },
            insert: {
                table: 'store',
                method: 'insert',
                param: () => {
                    let o = {
                        channel_id:ObjectId(req.body.channel),
                        name: req.body.name,
                        mobile:req.body.mobile,
                        address:req.body.address,
                        des:req.body.des,
                        user_id:ObjectId(user.ops[0]._id),
                        create_time:new Date()
                    };
                    return o;

                },
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
                        role: 'manager',
                        create_time: new Date(),
                        login_name: req.body.username,
                        auth: ["STORE"],
                        password: String.md5(req.body.username + "{"+req.body.password+"}"),
                        channel_id : ObjectId(req.body.channel),
                        channel_name:channel.name,
                        status:1
                    };
                    return o;
                },
                fun: (rs, go)=> {
                    user=rs;
                    go('insert');
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
            res.redirect(req.rootPath + '/store');
        });

        db.start();
    });
}