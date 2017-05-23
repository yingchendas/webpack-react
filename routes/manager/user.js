/**
 * Created by Lein on 2016/11/7.
 */
"use strict";

const MongoDb = require('../../utilities/event-mongodb-datasource');
const ObjectId = require('mongodb').ObjectId;
const common = require('../../utilities/common');
const util = require("util");

module.exports = router => {
    router.all('/user/admin', (req, res)=> {
        let page = 1;
        if (req.body.page && req.body.page.isInt()) {
            page = ~~req.body.page;
        } else if (req.query.page && req.quer.page.isInt()) {
            page = ~~req.query.page;
        }
        let count;
        let result;
        let mongodb = new MongoDb('count', {
            count: {
                table: 'user',
                method: 'count',
                param:{
                    "role" : "manager"
                },
                fun: (rs, go)=> {
                    count = rs;
                    go('find');
                }
            },
            find: {
                table: 'user',
                method: 'find',
                param: [{
                    "role" : "manager"
                }, {
                    limit: 20,
                    skip: (page - 1) * 20,
                    sort: {
                        _id: 1
                    }
                }],
                fun: (rs, go)=> {
                    result = rs;
                    go();
                }
            }
        });

        mongodb.on('err', err=> {
            process.nextTick(()=> {
                throw err;
            })
        });

        mongodb.on('end', ()=> {
            res.jade('manager/user/admin_list', {
                page: common.page(result, count, page, 20)
            });
        });

        mongodb.start();
    });

    router.get('/user/admin/info', (req, res)=> {
        common.validate(req.query, {
            id: ['id']
        });

        let user = {}, channel = [];
        let go = ()=> {
            res.jade('manager/user/admin_info', {
                user: user,
                channel_list : channel
            })
        };
        let mongodb = new MongoDb("getChannel", {
            "getChannel" : {
                "table" : "channel",
                "method" : "find",
                "param" : {
                    "delete_status" : {
                        "$ne" : 1
                    }
                },
                "fun" : (rs, go) => {
                    channel = rs;
                    if (req.query.id) {
                        go('findOne');
                    }else{
                        go();
                    }
                }
            },
            findOne: {
                table: 'user',
                method: 'findOne',
                param: () => {
                    return {
                        "_id": ObjectId(req.query.id)
                    }
                },
                fun: (rs, go)=> {
                    user = rs || {}
                    go();
                }
            }
        });
        mongodb.on('err', err=> {
            process.nextTick(()=> {
                throw err;
            })
        });

        mongodb.on('end', ()=> go());

        mongodb.start();
    });

    router.post('/user/admin/save', (req, res)=> {
        if (req.body.id)
            common.validate(req.body, {
                username: 'notnull',
                auth: /^(ADMIN|OPERATE)$/
            });
        else
            common.validate(req.body, {
                username: 'notnull',
                auth: /^(ADMIN|OPERATE)$/,
                login_name: 'notnull',
            });
        let db = new MongoDb(req.body.id ? 'update' : 'insert', {
            update: {
                table: 'user',
                method: 'updateOne',
                param: ()=>[{
                    _id: ObjectId(req.body.id)
                }, {
                    '$set': {
                        username: new Buffer(req.body.username).toString('base64'),
                        auth:util.isArray(req.body.auth) ? req.body.auth : [req.body.auth]
                    }
                }, {
                    multi: true
                }],
                fun: (rs, go)=> {
                    go();
                }
            },
            insert: {
                table: 'user',
                method: 'insert',
                param: () => {
                    let o = {
                        username: new Buffer(req.body.username).toString('base64'),
                        role: 'manager',
                        create_time: new Date(),
                        login_name: req.body.login_name,
                        auth: util.isArray(req.body.auth) ? req.body.auth : [req.body.auth],
                        password: String.md5(req.body.login_name + "{111111}")
                    };
                    if(req.body.channel){
                        o.channel_id = ObjectId(req.body.channel);
                        o.channel_name = req.body.channel_name;
                    }
                    return o;
                },
                fun: (rs, go)=> {
                    console.log(rs)
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
            res.redirect(req.rootPath + '/user/admin');
        });

        db.start();
    });

    router.all("/user/customer", (request,response) => {
        let page = 1;
        if (request["body"]["page"] && request["body"]["page"].isInt()) {
            page = ~~request["body"]["page"];
        } else if (request["query"]["page"] && request["query"]["page"].isInt()) {
            page = ~~request["query"]["page"];
        }
        let count;
        let result;
        let condition = {
            "role" : "customer",
            "channel_id" : request["query"]["c"] ? ObjectId(request["query"]["c"]) : ObjectId(request["body"]["c"])
        };

        if(request["body"]["username"]){
            condition["nickname"] = request["body"]["username"];
        }

        if(request["body"]["isDistributor"]){
            condition["distributor"] = {
                "$exists" : request["body"]["isDistributor"] == 1 ? true : false
            }
        }

        let mongodb = new MongoDb("count", {
            "count" : {
                "table" : "user",
                "method" : "count",
                "param" : condition,
                "fun" : (rs, go)=> {
                    count = rs;
                    go("find");
                }
            },
            "find" : {
                "table" : "user",
                "method" : "find",
                "param" : [
                    condition, {
                    "limit" : 20,
                    "skip" : (page - 1) * 20,
                    "sort" : {
                        "_id" : 1
                    }
                }],
                "fun" : (rs, go)=> {
                    result = rs;
                    go();
                }
            }
        });

        mongodb.on("err", err => {
            process.nextTick(()=> {
                throw err;
            });
        });

        mongodb.on("end", ()=> {
            response.jade("manager/user/user_list", {
                "page" : common.page(result, count, page, 20),
                "username" : request["body"]["username"],
                "isDistributor" : request["body"]["isDistributor"],
                "c" : condition["channel_id"]
            });
        });

        mongodb.start();

    });

    router.get("/user/customer/info", (request, response) => {
        common.validate(request["query"], {
            "id" : ["notnull", "id"]
        });
        let user, source_channel, channel;
        let mogodb = new MongoDb("findOne", {
            "findOne" : {
                "table" : "user",
                "method" : "findOne",
                "param" : {
                    "_id" : ObjectId(request["query"]["id"])
                },
                "fun" : (rs, go) => {
                    user = rs || {};
                    go("findSourceChannel");
                }
            },
            "findSourceChannel" : {
                "table" : "channel",
                "method" : "findOne",
                "param" : () => {
                    return [{
                        "_id" : ObjectId(user.channel_id)
                    },{
                        "fields" : {
                            "name" : 1,
                            "_id" : 0
                        }
                    }];
                },
                "fun" : (rs, go) => {
                    source_channel = rs;
                    go("findNowChannel");
                }
            },
            "findNowChannel" : {
                "table" : "channel",
                "method" : "findOne",
                "param" : () => {
                    return [{
                        "_id" : ObjectId(user.channel_id)
                    },{
                        "fields" : {
                            "name" : 1,
                            "_id" : 0
                        }
                    }];
                },
                "fun" : (rs, go) => {
                    channel = rs;
                    go();
                }
            }
        });

        mogodb.on("err", err => {
            process.nextTick(()=> {
                throw err;
            });
        });

        mogodb.on("end", () => {
            response.jade("manager/user/user_info",{
                "user" : user,
                "source_channel" : source_channel.name,
                "channel" : channel.name
            });
        });

        mogodb.start();
    });

    router.post("/user/customer/changeStatus", (request, response) => {
        common.validate(request["body"], {
            "id" : ["notnull", "id"],
            "status" : ["notnull", "int"]
        });

        let mongodb = new MongoDb("update", {
            "update" : {
                "table" : "user",
                "method" : "update",
                "param" : [{
                    "_id" : ObjectId(request["body"]["id"])
                },{
                    "$set" : {
                        "status" : parseInt(request["body"]["status"])
                    }
                }],
                "fun" : (rs, go) => {
                    go();
                }
            }
        });

        mongodb.on("err", err => {
            process.nextTick(()=> {
                throw err;
            });
        });

        mongodb.on("end", () => {
            response.push({
                "code" : "success",
                "message" : "操作成功！"
            });
        });

        mongodb.start();
    });

};