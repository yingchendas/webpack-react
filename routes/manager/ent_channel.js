
"use strict";
const MongoDb = require('../../utilities/event-mongodb-datasource');
const ObjectId = require('mongodb').ObjectId;
const common = require('../../utilities/common');
const application = require('../../application.json');
const url = require('url');
const request = require('request');
const ent = require('../../utilities/insurance_company');

module.exports  = router => {
    router.all('/ent_channel', (req, res) => {
        let page = 1;
        if (req.body.page && req.body.page.isInt()) {
            page = ~~req.body.page;
        } else if (req.query.page && req.quer.page.isInt()) {
            page = ~~req.query.page;
        }
        let result;
        let count;
        let condition = {};
        let chan_count=0;
        let user = req.session.user;
        // if(user.channel_id){
        //     condition.channel_id= user.channel_id;
        // }

        let db = new MongoDb('count', {
            count: {
                table: 'ent_channel',
                method: 'count',
                param:condition,
                fun: (rs, go) => {
                    count = rs;
                    go('find');
                }
            },
            find: {
                table: 'ent_channel',
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
                    console.log(rs)
                    if(rs.length>=1){
                        go('find_one_channel');
                    }else{
                        go();
                    }

                }
            },
            find_one_channel:{
                table: 'channel',
                method: 'findOne',
                param: ()=>{
                    return {_id: ObjectId(result[chan_count].channel_id)}
                },
                fun: (rs, go) => {
                    result[chan_count].channel = rs==null?result[chan_count].channel:rs;
                    if(chan_count === result.length - 1){
                        go();
                    }else{
                        chan_count++;
                        go('find_one_channel')
                    }

                }
            }
        });

        db.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db.on('end', () => {
            res.jade('manager/ent/ent_channel_list', {
                page: common.page(result, count, page, 20),
            });

        });

        db.start();
    });

    router.get('/ent_channel/info', (req, res) => {
        let ent_obj = {};
        let channals = {};
        let go = () => {
            res.jade('manager/ent/ent_channel_info', {
                info: ent_obj,
                ents:ent.exist(),
                channels:channals
            })
        };
        let mDb = new MongoDb(req.query.id?'find':"find_channel" , {
            find: {
                table: 'ent_channel',
                method: 'findOne',
                param: {
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
                    return {_id: ObjectId(ent_obj.channel_id)}
                },
                fun: (rs, go) => {
                    ent_obj.channel = rs==null?ent_obj.channel:rs;
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

    router.all('/ent_channel/save', (req, res)=> {
        let obj = {};
        let param = {
            name:req.body.name,
            code:req.body.code,
            channel:req.body.channel,
        };
        checkEnt(param);
        let db = new MongoDb(req.body.id?'update':'find_code', {
            find_code:{
                table: 'ent_channel',
                method: 'findOne',
                param:{
                    code:req.body.code
                },
                fun: (rs, go) => {
                    if(rs){
                        res.push({
                            "code":"fail",
                            "message":"编码重复"
                        })
                    }else{
                        go('save');
                    }
                }
            },
            save:{
                table: 'ent_channel',
                method: 'insert',
                param:{
                    name:req.body.name,
                    code:req.body.code,
                    channel_id:JSON.parse(req.body.channel)._id
                },
                fun: (rs, go) => {
                    go();
                }
            },
            update:{
                table: 'ent_channel',
                method: 'updateOne',
                param:()=>[{
                    _id : ObjectId(req.body.id)
                },{
                    '$set':{
                        name:req.body.name,
                        code:req.body.code,
                        channel_id:JSON.parse(req.body.channel)._id
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

    router.all('/ent_channel/remove', (req, res)=> {
        let db = new MongoDb('remove', {
            remove:{
                table: 'ent_channel',
                method: 'remove',
                param:{
                    _id : ObjectId(req.query.id)
                },
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
            res.redirect(req.rootPath + '/ent_channel')

        });

        db.start();
    });
}




function checkEnt(param) {
    common.validate(param,{
        "name":"notnull",
        "code":"notnull",
        "channel":"notnull"
    })
}