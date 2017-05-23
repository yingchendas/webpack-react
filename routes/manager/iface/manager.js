/*
* 接口认证管理
* */
"use strict"

const Db = require('../../../utilities/event-mongodb-datasource');
const ObjectId = require('mongodb').ObjectId;
const common = require('../../../utilities/common');
const iface = require("../../../utilities/iface");

module.exports = router => {

    router.all("/iface/list", (request, response) => {
        let page = 1;
        if (request["body"]["page"] && request["body"]["page"].isInt()) {
            page = ~~request["body"]["page"];
        } else if (request["query"]["page"] && request["query"]["page"].isInt()) {
            page = ~~request["query"]["page"];
        }
        let count;
        let result;
        let conditions = {};
        if(request["body"]["username"]){
            conditions["username"] = {
                "$regex" : request["body"]["username"]
            }
        }
        let db = new Db("count", {
            "count" : {
                "table" : "iface_account",
                "method" : "count",
                "param" : [
                    conditions
                ],
                "fun" : (rs, go) => {
                    count = rs;
                    go("find");
                }
            },
            "find" : {
                "table" : "iface_account",
                "method" : "find",
                "param" : [
                    conditions,{
                        limit: 20,
                        skip: (page - 1) * 20,
                        sort: {
                            create_time : -1
                        }
                    }
                ],
                "fun" : (rs, go) => {
                    result = rs;
                    go();
                }
            }
        });

        db.on("err", err => {
            process.nextTick(()=> {
                throw err;
            });
        });

        db.on("end", () => {
            response.jade("manager/iface/list", {
                "page" : common.page(result, count, page, 20),
                "username" : request["body"]["username"]
            });
        });

        db.start();
    });

    router.get("/iface/create", (request, response) => {
        let channels;
        let db = new Db('getChannel', {
            "getChannel" : {
                "table" : "channel",
                "method" : "find",
                "param" : [{
                    "delete_status" : {
                        "$ne" : 1
                    }
                }],
                "fun" : (rs, go) => {
                    channels = rs;
                    go();
                }
            }
        });
        db.on("err", err => {
            process.nextTick(() => {
                throw err;
            });
        });
        db.on("end", () => {
            response.jade("manager/iface/add", {
                "interfaces" : iface["interfaces"],
                "channels" : channels
            });
        });
        db.start();
    });

    router.post("/iface/create", (request, response) => {
        common.validate(request["body"], {
            "title" : ["notnull"]
        });

        let account = {
            "title" : request["body"]["title"],
            "publicKey" : String.randomStr(16),
            "privateKey" : String.randomStr(32),
            "status" : 1,
            "create_time" : new Date(),
            "create_user" : ObjectId(request["session"]["user"]["_id"]),
            "auth" : request["body"]["auth"] || []
        };
        if(request["body"]["lbb_username"]){
            account["lbb"] = {
                "username" : request["body"]["lbb_username"],
                "password" : request["body"]["lbb_password"],
                "token" : request["body"]["lbb_token"]||""
            };
        }
        if(request["body"]["ct_username"]){
            account["CHAC"] = {
                "username" : request["body"]["ct_username"],
                "password" : request["body"]["ct_password"],
                "partnerCode" : request["body"]["ct_partnerCode"]
            };
        }
        if(request["body"]["tp_username"]){
            account["TPCX"] = {
                "username" : request["body"]["tp_username"],
                "groupNo" : request["body"]["tp_groupNo"],
                "privateKey" : request["body"]["tp_privateKey"]
            };
            // if(/^-----BEGIN PRIVATE KEY-----\n\S+\n-----END PRIVATE KEY-----$/.test(request["body"]["tp_privateKey"])){
            //     account["TPCX"]["privateKey"] = request["body"]["tp_privateKey"];
            // }else{
            //     account["TPCX"]["privateKey"] = '-----BEGIN PRIVATE KEY-----\n' + request["body"]["tp_privateKey"] + '\n-----END PRIVATE KEY-----';
            // }
        }
        if(request["body"]["rb_username"]){
            account["RBCX"] = {
                "username" : request["body"]["rb_username"],
                "key" : request["body"]["rb_key"]
            };
        }
        let db = new Db("insert", {
            "insert" : {
                "table" : "iface_account",
                "method" : "insert",
                "param" : account,
                "fun" : (rs, go) => {
                    go();
                }
            }
        });

        db.on("err", err => {
            process.nextTick(() => {
                throw err;
            });
        });

        db.on("end", () => {
            response.redirect(request.rootPath + "/iface/list");
        });

        db.start();
    });

    router.post("/iface/changeStatus", (request, response) => {
        common.validate(request["body"], {
            "id" : ["notnull", "id"],
            "status" : ["notnull", "int"]
        });

        let db = new Db("update", {
            "update" : {
                "table" : "iface_account",
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

        db.on("err", err => {
            process.nextTick(() => {
                throw err;
            });
        });

        db.on("end", () => {
            response.push({
                "code" : "success",
                "message" : "操作成功！"
            });
        });

        db.start();
    });

    router.get("/iface/config", (request, response) => {
        common.validate(request["query"], {
            "id" : "notnull"
        });
        let account = null;
        let db = new Db("findOne",{
            "findOne" : {
                "table" : "iface_account",
                "method" : "findOne",
                "param" : {
                    "_id" : ObjectId(request["query"]["id"])
                },
                "fun" : (rs, go) => {
                    account = rs;
                    go();
                }
            }
        });
        db.on("err", err => {
            process.nextTick(() => {
                throw err;
            });
        });

        db.on("end", () => {
            response.jade("manager/iface/mod", {
                "account" : account,
                "interfaces" : iface.interfaces
            });
        });

        db.start();
    });

    router.post("/iface/saveConfig", (request, response) => {
        common.validate(request["body"], {
            "_id" : "notnull"
        });
        let db = new Db("update", {
            "update" : {
                "table" : "iface_account",
                "method" : "update",
                "param" : () => {
                    let obj = {
                        "$set" : {
                            "auth" : request["body"]["auth"] || []
                        }
                    };
                    if(request["body"]["lbb_username"]){
                        obj["$set"]["lbb"] = {
                            "username" : request["body"]["lbb_username"],
                            "password" : request["body"]["lbb_password"],
                            "token" : request["body"]["lbb_token"] || ""
                        };
                    }else if(request["body"]["lbb"]){
                        obj["$unset"] = {
                            "lbb" : true
                        };
                    }
                    if(request["body"]["ct_username"]){
                        obj["$set"]["CHAC"] = {
                            "username" : request["body"]["ct_username"],
                            "password" : request["body"]["ct_password"],
                            "partnerCode" : request["body"]["ct_partnerCode"]
                        };
                    }else if(request["body"]["CHAC"]){
                        if(obj["$unset"]){
                            obj["$unset"]["CHAC"] = true;
                        }else{
                            obj["$unset"] = {
                                "CHAC" : true
                            };
                        }
                    }
                    if(request["body"]["tp_username"]){
                        obj["$set"]["TPCX"] = {
                            "username" : request["body"]["tp_username"],
                            "groupNo" : request["body"]["tp_groupNo"],
                            "privateKey" : request["body"]["tp_privateKey"]
                        };
                    }else if(request["body"]["TPCX"]){
                        if(obj["$unset"]){
                            obj["$unset"]["TPCX"] = true;
                        }else{
                            obj["$unset"] = {
                                "TPCX" : true
                            };
                        }
                    }
                    if(request["body"]["rb_username"]){
                        obj["$set"]["RBCX"] = {
                            "username" : request["body"]["rb_username"],
                            "key" : request["body"]["rb_key"]
                        };
                    }else if(request["body"]["RBCX"]){
                        if(obj["$unset"]){
                            obj["$unset"]["RBCX"] = true;
                        }else{
                            obj["$unset"] = {
                                "RBCX" : true
                            };
                        }
                    }
                    return [{
                        "_id" : ObjectId(request["body"]["_id"])
                    },obj];
                },
                "fun" : (rs, go) => {
                    go();
                }
            }
        });

        db.on("err", err => {
           process.nextTick(() => {
               throw err;
           });
        });

        db.on("end", () => {
            response.redirect(request.rootPath + "/iface/list");
        });

        db.start();
    });
};