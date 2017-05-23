"use strict";

const MongoDb = require('../../utilities/event-mongodb-datasource');
const ObjectId = require('mongodb').ObjectId;
const common = require('../../utilities/common');

module.exports = router => {
    router.all('/vehicle_find_user', (req, res) => {
        let page = 1;
        if (req.body.page && req.body.page.isInt()) {
            page = ~~req.body.page;
        } else if (req.query.page && req.quer.page.isInt()) {
            page = ~~req.query.page;
        }
        let result;
        let count;
        let chan_count = 0;
        let channel=[];
        let condition = {delete_status: {$ne: 1}};

        let user = req.session.user;
        if (user.channel_id) {
            condition["channel_id"] = user.channel_id;
        }

        if (req["body"]["distributor"]||req["body"]["distributor"]!="-1") {
            if(req["body"]["distributor"]=="1"){
                condition["distributor"] = {"$exists": true};
            }else if(req["body"]["distributor"]=="2"){
                condition["distributor"] = {"$exists": false};
            }
        }
        let condition_channel;
        if (req["body"]["channel"] && req["body"]["channel"] != -1) {
            condition_channel = JSON.parse(req.body.channel);
            condition["channel_id"] = ObjectId(condition_channel._id);
        }

        let par = {
            channel: condition_channel ? condition_channel : {},
            distributor: req["body"]["distributor"]
        }
        let db = new MongoDb('count', {
            count: {
                table: 'user',
                method: 'count',
                param: condition,
                fun: (rs, go) => {
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
                        _id: -1
                    }
                }],
                fun: (rs, go) => {
                    result = rs;
                    go('find_one_channel');
                }
            },
            find_one_channel: {
                table: 'channel',
                method: 'findOne',
                param: () => {
                    return {_id: result[chan_count]?ObjectId(result[chan_count].channel_id):""}
                },
                fun: (rs, go) => {
                    if(result.length==0){
                        go("find_channel")
                    }else{
                        result[chan_count].channel = rs;
                        if (chan_count === result.length - 1) {
                            go('find_channel');
                        } else {
                            chan_count++;
                            go('find_one_channel')
                        }
                    }

                }
            },
            find_channel: {
                table: 'channel',
                method: 'find',
                param: {
                    delete_status: {$ne: 1}
                },
                fun: (rs, go) => {
                    channel = rs;
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
            res.jade('manager/vehicle_find_user/vehicle_find_list', {
                page: common.page(result, count, page, 20),
                condition: par,
                channels:channel
            });

        });

        db.start();
    });

    router.all('/vehicle_find_user/info', (req, res) => {
        let page = 1;
        if (req.body.page && req.body.page.isInt()) {
            page = ~~req.body.page;
        } else if (req.query.page && req.query.page.isInt()) {
            page = ~~req.query.page;
        }
        let count;

        let result_day = [];
        let result_total = {};
        let result_channel_total = {};
        let user = {};
        let channel={};

        let mDb = new MongoDb('find_user', {
            find_user: {
                table: 'user',
                method: 'findOne',
                param: {
                    _id: ObjectId(req.query.userId?req.query.userId:req.body.userId),
                },
                fun: (rs, go) => {
                    user = rs;
                    go('find_channel');
                }
            },
            find_channel: {
                table: 'channel',
                method: 'findOne',
                param:()=> {
                    return{
                        _id: ObjectId(user.channel_id)
                    }
                },
                fun: (rs, go) => {
                    channel = rs;
                    go('find_day_count');
                }
            },
            find_day_count: {
                table: 'user_find_vehicle',
                method: 'count',
                param:()=> {
                    return{
                        type:"use",
                        user_id: ObjectId(req.query.userId?req.query.userId:req.body.userId),
                        day:{$exists: true}
                    }
                },
                fun: (rs, go) => {
                    count = rs;
                    go('find_day');
                }
            },
            find_day: {
                table: 'user_find_vehicle',
                method: 'find',
                param:[{
                    type:"use",
                    user_id: ObjectId(req.query.userId?req.query.userId:req.body.userId),
                    day:{$exists: true}
                }, {
                    limit: 20,
                    skip: (page - 1) * 20,
                    sort: {
                        _id: -1
                    }
                }],
                fun: (rs, go) => {
                    result_day = rs;
                    go('find_total');
                }
            },
            find_total: {
                table: 'user_find_vehicle',
                method: 'findOne',
                param: {
                    type:"use",
                    user_id: ObjectId(req.query.userId?req.query.userId:req.body.userId),
                    day:{$exists: false}
                },
                fun: (rs, go) => {
                    result_total = rs;
                    go('find_channel_total');
                }
            },
            find_channel_total: {
                table: 'channel_find_vehicle',
                method: 'findOne',
                param:()=> {
                    return{
                        type:"use",
                        channel_id: ObjectId(user.channel_id),
                        day:{$exists: false}
                    }
                },
                fun: (rs, go) => {
                    result_channel_total = rs;
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
            res.jade('manager/vehicle_find_user/vehicle_find_info', {
                userId:user._id,
                page: common.page(result_day, count, page, 20),
                result_total: result_total,
                channel_total:result_channel_total,
                channel:channel
            });
        });

        mDb.start();
    });
}