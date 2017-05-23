
"use strict";
const MongoDb = require('../../utilities/event-mongodb-datasource');
const ObjectId = require('mongodb').ObjectId;
const common = require('../../utilities/common');
const application = require('../../application.json');
const url = require('url');
const request = require('request');
const ent = require('../../utilities/insurance_company')

module.exports  = router =>{
    router.all('/activity', (req, res)=> {
        let page = 1;
        if (req.body.page && req.body.page.isInt()) {
            page = ~~req.body.page;
        } else if (req.query.page && req.quer.page.isInt()) {
            page = ~~req.query.page;
        }
        let result;
        let channelList;
        let count;
        let chan_count=0;
        let condition = {delete_status:{$ne:1}};
        let user = req.session.user;
        if(user.channel_id){
            condition["channel"] =user.channel_id.toString();
        }
        let db = new MongoDb('count', {
            count: {
                table: 'activity',
                method: 'count',
                param:condition,
                fun: (rs, go)=> {
                    count = rs;
                    go('find');
                }
            },
            find: {
                table: 'activity',
                method: 'find',
                param: [condition, {
                    limit: 20,
                    skip: (page - 1) * 20,
                    sort: {
                        _id: 1
                    }
                }],
                fun: (rs, go)=> {
                    result = rs;
                    if(result.length > 0)
                        go('find_one_channel');
                    else
                        go();
                }
            },
            find_one_channel:{
                table: 'channel',
                method: 'findOne',
                param: ()=>{
                    return {_id: ObjectId(result[chan_count].channel)}
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

        db.on('err', err=> {
            process.nextTick(()=> {
                throw err;
            })
        });

        db.on('end', ()=> {
            res.jade('manager/activity/activity_list',{
                page: common.page(result, count, page, 20),
                ents:ent.exist(),
                channels:channelList
            });

        });

        db.start();
    });

    router.get('/activity/info', (req, res) => {
        let activity = {};
        let channals = {};
        let go = () => {
            res.jade('manager/activity/activity_info', {
                info: activity,
                ents:ent.exist(),
                channals:channals
            })
        };
        let mDb = new MongoDb(req.query.id?'find':"find_channel" , {
            find: {
                table: 'activity',
                method: 'findOne',
                param: {
                    delete_status:{$ne:1},
                    _id: ObjectId(req.query.id)
                },
                fun: (rs, go) => {
                    activity = rs;
                    go('find_one_channel');
                }
            },
            find_one_channel:{
                table: 'channel',
                method: 'findOne',
                param: ()=>{
                    return {_id: ObjectId(activity.channel)}
                },
                fun: (rs, go) => {
                    activity.channel = rs==null?activity.channel:rs;
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
            },
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

    router.all('/activity/ent', (req, res) => {
        res.push({
            ent:ent.exist()
        })
    });

    /**
     * 判断时间
     */
    router.all('/activity/checkedTime', (req, res)=> {
        let time=[];
        common.validate({start_time:req.body.start_time,end_time:req.body.end_time},{"start_time":"notnull","end_time":"notnull"});

        let db = new MongoDb("checked", {
            checked:{
                table: 'activity',
                method: 'find',
                param:{
                    _id:req.body.id?{$ne:ObjectId(req.body.id)}:"",
                    delete_status:{$ne:1},
                    channel:JSON.parse(req.body.channel)._id,
                    entName:req.body.entName,
                    $or:[{
                       startTime :{$lt:new Date(req["body"]["start_time"])},
                       endTime :{$gt:new Date(req["body"]["start_time"])}
                    },{
                        startTime :{$lt:new Date(req["body"]["end_time"])},
                        endTime :{$gt:new Date(req["body"]["end_time"])}
                    },{
                        startTime : {$gte:new Date(req["body"]["start_time"]),$lte:new Date(req["body"]["end_time"])}
                    },{
                        endTime : {$gte:new Date(req["body"]["start_time"]),$lte:new Date(req["body"]["end_time"])}
                    }]
                },
                fun: (rs, go) => {
                    time=rs;
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
            if(time.length>=1){
                res.push({
                    "code":"fail"
                })
            }else{
                res.push({
                    "code":"success"
                })
            }

        });

        db.start();
    })

    router.all('/activity/save', (req, res)=> {
        let param = {
            name:req.body.name,
            sub_name:req.body.sub_name,
            start_time:req.body.start_time,
            end_time:req.body.end_time,
            des:req.body.des,
            channel:JSON.parse(req.body.login_type)._id,
            entName:req.body.entName,
            details:JSON.parse(req.body.details),
            uploadId:req.body.uploadId
        };
        checkAct(param);
        let db = new MongoDb(req.body.id?'update':'save', {
            save:{
                table: 'activity',
                method: 'insert',
                param: {
                    name:req.body.name,
                    sub_name:req.body.sub_name,
                    startTime:new Date(req.body.start_time.replace(/-/g,'/')),
                    endTime:new Date(req.body.end_time.replace(/-/g,'/')),
                    des:req.body.des,
                    channel:JSON.parse(req.body.login_type)._id,
                    entName:req.body.entName,
                    details:JSON.parse(req.body.details),
                    uploadId:req.body.uploadId
                },
                fun: (rs, go) => {
                    go();
                }
            },
            update:{
                table: 'activity',
                method: 'updateOne',
                param:()=>[{
                    _id : ObjectId(req.body.id)
                },{
                    '$set':{
                        delete_status:1
                    }
                }],
                fun: (rs, go) => {
                    go('save');
                }
            }

        });
        db.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db.on('end', ()=> {
            res.redirect(req.rootPath + "/activity")

        });

        db.start();
    });

    router.all('/activity/remove', (req, res)=> {
        common.validate({id:req.query.id},"notnull");
        let db = new MongoDb("remove", {
            remove:{
                table: 'activity',
                method: 'updateOne',
                param:()=>[{
                    _id : ObjectId(req.query.id)
                },{
                    '$set':{
                        delete_status:1
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
            res.redirect(req.rootPath + "/activity")

        });

        db.start();
    })

    function checkAct(param) {
        common.validate(param,{
            "name":"notnull",
            "sub_name":"notnull",
            "start_time":"notnull",
            "end_time":"notnull",
            "des":"notnull",
            "channel":"notnull",
            "entName":"notnull",
            "details":"notnull",
            "uploadId":"notnull"
        })
    }

}