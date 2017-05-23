"use strict";

const MongoDb = require('../../utilities/event-mongodb-datasource');
const ObjectId = require('mongodb').ObjectId;
const common = require('../../utilities/common');

module.exports = router => {
    router.all('/vehicle_find_channel', (req, res) => {
        let page = 1;
        if (req.body.page && req.body.page.isInt()) {
            page = ~~req.body.page;
        } else if (req.query.page && req.quer.page.isInt()) {
            page = ~~req.query.page;
        }
        let result;
        let count;
        let condition = {delete_status: {$ne: 1}};

        let user = req.session.user;
        if (user.channel_id) {
            condition["_id"] = ObjectId(user.channel_id);
        }

        let condition_channel;
        if (req["body"]["channel"] && req["body"]["channel"] != -1) {
            condition_channel = JSON.parse(req.body.channel);
            condition["channel_id"] = ObjectId(condition_channel._id);
        }

        let par = {
            channel: condition_channel ? condition_channel : {},
        }
        let db = new MongoDb('count', {
            count: {
                table: 'channel',
                method: 'count',
                param: condition,
                fun: (rs, go) => {
                    count = rs;
                    go('find');
                }
            },
            find: {
                table: 'channel',
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
            res.jade('manager/vehicle_find_channel/vehicle_find_list', {
                page: common.page(result, count, page, 20),
                condition: par
            });

        });

        db.start();
    });

    router.all('/vehicle_find_channel/info', (req, res) => {
        let page = 1;
        if (req.body.page && req.body.page.isInt()) {
            page = ~~req.body.page;
        } else if (req.query.page && req.query.page.isInt()) {
            page = ~~req.query.page;
        }
        let count;

        let result_day = [];
        let result_total = {};
        let channel={};

        let mDb = new MongoDb('find_channel', {
            find_channel: {
                table: 'channel',
                method: 'findOne',
                param: {
                    _id: ObjectId(req.query.id?req.query.id:req.body.id),
                },
                fun: (rs, go) => {
                    channel = rs;
                    go('find_day_count');
                }
            },
            find_day_count: {
                table: 'channel_find_vehicle',
                method: 'count',
                param:()=> {
                    return{
                        type:"use",
                        channel_id: ObjectId(req.query.id?req.query.id:req.body.id),
                        day:{$exists: true}
                    }
                },
                fun: (rs, go) => {
                    count = rs;
                    go('find_day');
                }
            },
            find_day: {
                table: 'channel_find_vehicle',
                method: 'find',
                param: [{
                            type:"use",
                            channel_id: ObjectId(req.query.id?req.query.id:req.body.id),
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
                table: 'channel_find_vehicle',
                method: 'findOne',
                param: {
                    type:"use",
                    channel_id: ObjectId(req.query.id?req.query.id:req.body.id),
                    day:{$exists: false}
                },
                fun: (rs, go) => {
                    result_total = rs;
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
            res.jade('manager/vehicle_find_channel/vehicle_find_info', {
                page: common.page(result_day, count, page, 20),
                result_total: result_total,
                channel:channel
            });
        });

        mDb.start();
    });
}