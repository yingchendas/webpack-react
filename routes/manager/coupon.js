/*
* 优惠码
* */
"use strict"

const Db = require('../../utilities/event-mongodb-datasource');
const ObjectId = require('mongodb').ObjectId;
const common = require('../../utilities/common');
const ent = require('../../utilities/insurance_company');
const util = require("util");

module.exports = router => {

    router.all("/coupon/list", (request, response) => {
        let page = 1;
        if (request["body"]["page"] && request["body"]["page"].isInt()) {
            page = ~~request["body"]["page"];
        } else if (request["query"]["page"] && request["query"]["page"].isInt()) {
            page = ~~request["query"]["page"];
        }
        let count;
        let result;
        let channels, companies = [];
        let user = request["session"]["user"];

        let condition = {};
        if(user.channel_id){
            condition["channel"] = user.channel_id;
        }else{
            if(request["body"]["type"]){
                condition["channel"] = {
                    "$exists" : request["body"]["type"] == 1 ? true : false
                }
            }

            if(request["body"]["channel"]){
                condition["channel"] = ObjectId(request["body"]["channel"]);
            }
        }

        if(request["body"]["company"]){
            condition["company"] = {
                "$in" : [request["body"]["company"]]
            };
        }
        if(request["body"]["code"]){
            condition["code"] = request["body"]["code"];
        }
        if(request["body"]["start_time"]){
            condition["start_time"] = {
                "$lte" : new Date(request["body"]["start_time"].replace(/-/g,'/'))
            };
            condition["end_time"] = {
                "$gte" : new Date(request["body"]["start_time"].replace(/-/g,'/'))
            };
        }
        if(request["body"]["end_time"]){
            condition["start_time"] = {
                "$lte" : new Date(request["body"]["end_time"].replace(/-/g,'/'))
            };
            condition["end_time"] = {
                "$gte" : new Date(request["body"]["end_time"].replace(/-/g,'/'))
            };
        }

        let db = new Db("count", {
            "count" : {
                "table" : "coupon",
                "method" : "count",
                "param" : condition,
                "fun" : (rs, go) => {
                    count = rs;
                    go("find");
                }
            },
            "find" : {
                "table" : "coupon",
                "method" : "find",
                "param" : [
                    condition,{
                        "limit" : 20,
                        "skip" : (page - 1) * 20,
                        "sort" : {
                            "create_time": -1
                        }
                    }
                ],
                "fun" : (rs, go) => {
                    result = rs;
                    if(user.channel_id){
                        go("getCompany");
                    }else{
                        go("getChannel");
                    }
                }
            },
            "getChannel" : {
                "table" : "channel",
                "method" : "find",
                "param" : {
                    "delete_status" : {
                        "$ne" : 1
                    }
                },
                "fun" : (rs, go) => {
                    channels = rs;
                    go();
                }
            },
            "getCompany" : {
                "table" : "channel",
                "method" : "findOne",
                "param" : () => {
                    return {
                        "_id" : ObjectId(user["channel_id"])
                    };
                },
                "fun" : (rs, go) => {
                    if(rs.ent_id && rs.ent_id.length > 0){
                        rs.ent_id.forEach(c => {
                            companies.push({
                                "code" : c,
                                "name" : ent.exist(c).name
                            });
                        });
                    }
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
            if(user.channel_id){
                response.jade("manager/coupon/list", {
                    "page" : common.page(result, count, page, 20),
                    "company_list" : companies,
                    "code" : request["body"]["code"],
                    "company" : request["body"]["company"],
                    "start_time" : request["body"]["start_time"],
                    "end_time" : request["body"]["end_time"]
                });
            }else{
                response.jade("manager/coupon/list", {
                    "page" : common.page(result, count, page, 20),
                    "channel_list" : channels,
                    "company_list" : ent.company_list(),
                    "code" : request["body"]["code"],
                    "type" : request["body"]["type"],
                    "channel" : request["body"]["channel"],
                    "company" : request["body"]["company"],
                    "start_time" : request["body"]["start_time"],
                    "end_time" : request["body"]["end_time"],
                    "isPlatform" : true
                });
            }
        });

        db.start();
    });

    router.post("/coupon/getChannel", (request, response) => {
        var result;
        let db = new Db("find", {
            "find" : {
                "table" : "channel",
                "method" : "find",
                "param" : {
                    "delete_status" : {
                        "$ne" : 1
                    }
                },
                "fun" : (rs, go) => {
                    result = rs;
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
                "message" : result
            });
        });

        db.start();
    });

    router.post("/coupon/getCompany", (request, response) => {
        let channelID = request["body"]["channel"];
        if(channelID){
            let channel;
            let db = new Db("getChannel", {
                "getChannel" : {
                    "table" : "channel",
                    "method" : "findOne",
                    "param" : {
                        "_id" : ObjectId(channelID)
                    },
                    "fun" : (rs, go) => {
                        channel = rs;
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
                if(channel){
                    if(channel.ent_id && channel.ent_id.length > 0){
                        let list = [];
                        channel.ent_id.forEach(c => {
                            list.push({
                                "code" : c,
                                "name" : ent.exist(c).name
                            });
                        });
                        response.push({
                            "code" : "success",
                            "message" : list
                        });
                    }else{
                        response.push({
                            "code" : "failure",
                            "message" : "该渠道未绑定保险公司！"
                        });
                    }
                }else{
                    response.push({
                        "code" : "failure",
                        "message" : "渠道数据不存在，请联系管理员！"
                    });
                }
            });

            db.start();
        }else{
            let list = [];
            for(let c in ent.company_list()){
                list.push({
                    "code" : c,
                    "name" : ent.company_list()[c].name
                });
            }
            response.push({
                "code" : "success",
                "message" : list
            });
        }
    });

    router.get("/coupon/info", (request, response) => {
        let coupon = null;
        if(request["query"]["id"]){
            let db = new Db("get", {
                "get" : {
                    "table" : "coupon",
                    "method" : "findOne",
                    "param" : {
                        "_id" : ObjectId(request["query"]["id"])
                    },
                    "fun" : (rs, go) => {
                        coupon = rs;
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
                response.jade("manager/coupon/info", {
                    "coupon" : coupon
                });
            });
            db.start();
        }else{
            if(request["session"]["user"]["channel_id"]){
                let companyList = [];
                let db = new Db("get", {
                    "get" : {
                        "table" : "channel",
                        "method" : "findOne",
                        "param" : () => {
                            return {
                                "_id" : ObjectId(request["session"]["user"]["channel_id"])
                            };
                        },
                        "fun" : (rs, go) => {
                            if(rs.ent_id && rs.ent_id.length > 0){
                                rs.ent_id.forEach(c => {
                                    companyList.push({
                                        "code" : c,
                                        "name" : ent.exist(c).name
                                    });
                                });
                            }
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
                    response.jade("manager/coupon/add", {
                        "isPlatform" : false,
                        "companyList" : companyList
                    });
                });
                db.start();
            }else{
                response.jade("manager/coupon/add", {
                    "isPlatform" : true
                });
            }
        }
    });

    router.post("/coupon/update", (request, response) => {
        common.validate(request["body"], {
            "id" : ["notnull", "id"],
            "quota_type" : ["notnull", "int"],
            "quota" : ["notnull", "number"],
            "count" : ["notnull", "int"],
            "use" : ["notnull", "int"],
            "start_time" : ["notnull", "time"],
            "end_time" : ["notnull", "time"]
        });

        let db = new Db("update", {
            "update" : {
                "table" : "coupon",
                "method" : "update",
                "param" : [{
                    "_id" : ObjectId(request["body"]["id"])
                },{
                    "$set" : {
                        "quota" : request["body"]["quota_type"] == 1 ? parseFloat((parseFloat(request["body"]["quota"]) / 100).toFixed(4)) : parseInt((parseFloat(request["body"]["quota"]) * 100).toFixed(0)),
                        "count" : parseInt(request["body"]["count"]),
                        "use" : parseInt(request["body"]["use"]),
                        "start_time" : new Date(request["body"]["start_time"].replace(/-/g,'/')),
                        "end_time" : new Date(request["body"]["end_time"].replace(/-/g,'/'))
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
            response.redirect(request.rootPath + "/coupon/list");
        });
        db.start();
    });

    router.post("/coupon/add", (request, response) => {
        let user = request["session"]["user"];
        if(!user.channel_id){
            common.validate(request["body"], {
                "type" : ["notnull", "int"],
                "company" : "notnull",
                "companyName" : "notnull",
                "quota_type" : ["notnull", "int"],
                "quota" : ["notnull","number"],
                "count" : ["notnull", "int"],
                "start_time" : ["notnull", "time"],
                "end_time" : ["notnull", "time"]
            });
        }else{
            common.validate(request["body"], {
                "company" : "notnull",
                "companyName" : "notnull",
                "quota_type" : ["notnull", "int"],
                "quota" : ["notnull","number"],
                "count" : ["notnull", "int"],
                "start_time" : ["notnull", "time"],
                "end_time" : ["notnull", "time"]
            });
        }

        let company = request["body"]["company"];
        let companyName = request["body"]["companyName"];
        let rate = request["body"]["quota"];
        let count = request["body"]["count"];
        if(!util.isArray(company)){
            company = [company];
            companyName = [companyName];
            rate = [rate];
            count = [count];
        }
        let code = String.randomStr(6).toUpperCase();
        let data = [];
        for(let i = 0; i < company.length; i++){
            var temp = {
                "company" : company[i],
                "company_name" : companyName[i],
                "code" : code,
                "quota_type" : parseInt(request["body"]["quota_type"]),
                "count" : parseInt(count[i]),
                "start_time" : new Date(request["body"]["start_time"].replace(/-/g,'/')),
                "end_time" : new Date(request["body"]["end_time"].replace(/-/g,'/')),
                "create_time" : new Date(),
                "create_user" : ObjectId(request["session"]["user"]["_id"]),
                "use" : 0
            };
            if(temp.quota_type == 1){
                temp["quota"] = parseFloat((parseFloat(rate[i]) / 100).toFixed(4));
            }else{
                temp["quota"] = parseInt((parseFloat(rate[i]) * 100).toFixed(0));
            }
            if(user.channel){
                temp["channel"] = ObjectId(user["channel_id"]);
                temp["channel_name"] = user["channel_name"];
            }else{
                if(request["body"]["type"] == 1){
                    temp["channel"] = ObjectId(request["body"]["channel"]);
                    temp["channel_name"] = request["body"]["channelName"];
                }
            }
            data.push(temp);
        }
        let db = new Db("insert", {
            "insert" : {
                "table" : "coupon",
                "method" : "insert",
                "param" : [data],
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
            response.redirect(request.rootPath + "/coupon/list");
        });
        db.start();
    });

    router.post("/coupon/del", (request, response) => {
        common.validate(request["body"], {
            "ids": "notnull"
        });
        let data = [];
        request["body"]["ids"].split(",").forEach(i => {
            data.push(ObjectId(i));
        });
        let db = new Db("remove", {
            "remove" : {
                "table" : "coupon",
                "method" : "update",
                "param" : [{
                    "_id" : {
                        "$in" : data
                    }
                },{
                    "$set" : {
                        "count" : 0
                    }
                },{
                    "multi" : true
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
            response.redirect(request.rootPath + "/coupon/list");
        });
        db.start();
    });
};