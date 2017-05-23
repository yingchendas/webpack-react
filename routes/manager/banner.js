"use strict";
const MongoDb = require('../../utilities/event-mongodb-datasource');
const ObjectId = require('mongodb').ObjectId;
const common = require('../../utilities/common');
const application = require('../../application.json');
const url = require('url');
const request = require('request');
const bannerType = require('../../utilities/banner_type')

module.exports  = router => {
    router.all('/banner', (req, res) => {
        let page = 1;
        if (req.body.page && req.body.page.isInt()) {
            page = ~~req.body.page;
        } else if (req.query.page && req.query.page.isInt()) {
            page = ~~req.query.page;
        }
        let count;
        let result=[];
        let user = req.session.user;
        let db = new MongoDb(user.channel_id?'findOne':'count', {
            findOne: {
                table: 'channel',
                method: 'findOne',
                param : {
                    _id : ObjectId(user.channel_id)
                },
                fun: (rs, go) => {
                    count=1;
                    result.push(rs);
                    go();
                }
            },
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
            res.jade('manager/banner/banner_list', {
                page: common.page(result, count, page, 20),
            })
        });

        db.start();
    });

    router.all('/banner/info', (req, res) => {
        common.validate({"id":req.query.id},{"id":"notnull"});
        let result;
        let condition = {};
        let channels = {};
        condition["channel_id"] =ObjectId(req.query.id);

        let db = new MongoDb('find', {
            find: {
                table: 'banner',
                method: 'find',
                param: [condition,{
                    sort: {
                        sort: 1
                    }
                }],
                fun: (rs, go) => {
                    result = rs;
                    go('find_channel');
                }
            },
            find_channel: {
                table: 'channel',
                method: 'findOne',
                param: {
                    _id : ObjectId(req.query.id)
                },
                fun: (rs, go) => {
                    channels = rs==null?channels:rs;
                    go();
                }
            },
        });

        db.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db.on('end', () => {
            console.log(result);
            res.jade('manager/banner/banner_info', {
                info: result,
                types:bannerType.exist(),
                channel:channels
            });

        });

        db.start();
    });

    router.post('/banner/save', (req, res) => {
        common.validate({"msg":req.body.msg,"channel":req.body.channel_id},{"msg":"notnull","channel":"notnull"});
        console.log(req.body.msg);
        let data = JSON.parse(req.body.msg);
        let count = 0;
        let db = new MongoDb(data[0].id?"update":"save", {
            save:{
                table: 'banner',
                method: 'insert',
                param:()=> {
                    return {
                        title:data[count].title,
                        img:data[count].img,
                        channel_id:ObjectId(req.body.channel_id),
                        type:data[count].type,
                        sort:data[count].sort,
                        bannerUrl:data[count].bannerUrl
                    }
                },
                fun: (rs, go) => {
                    if(count === (data.length-1)){
                        go()
                    }else{
                        count++;
                        go(data[count].id?"update":"save");
                    }
                }
            },
            update:{
                table: 'banner',
                method: 'updateOne',
                param:()=>[{
                    _id : ObjectId(data[count].id)
                },{
                    '$set':{
                        sort:data[count].sort
                    }
                }],
                fun: (rs, go) => {
                    if(count === (data.length-1)){
                        go()
                    }else{
                        count++;
                        go(data[count].id?"update":"save");
                    };
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
    })

    router.post('/banner/remove', (req, res) => {
        common.validate({"id":req.body.id},{"id":"notnull"});

        let db = new MongoDb('remove', {
            remove: {
                table: 'banner',
                method: 'remove',
                param: {
                    _id : ObjectId(req.body.id)
                },
                fun: (rs, go) => {
                    go();
                }
            },
        });

        db.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db.on('end', () => {
            res.push({
                "code":"success"
            });

        });

        db.start();
    });

}