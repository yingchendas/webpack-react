/*
* 车辆管理
* */
"use strict"

let Db = require('../../../utilities/event-mongodb-datasource');
let ObjectId = require('mongodb').ObjectId;
let common = require('../../../utilities/common');

module.exports = router => {

    router.all("/vehicle/list", (request, response) => {

        let condition = {
           "invalid":{$exists:false}
        };

        if(request["body"]["plateNo"]){
            condition["LicenseNo"] = request["body"]["plateNo"];
        }

        if(request["body"]["owner"]){
            condition["CarOwnerInfo.Name"] = request["body"]["owner"];
        }
        let page = 1;
        if (request["body"]["page"] && request["body"]["page"].isInt()) {
            page = ~~request["body"]["page"];
        } else if (request["query"]["page"] && request["query"]["page"].isInt()) {
            page = ~~request["query"]["page"];
        }

        let count = 0, result = null;
        let db = new Db("count", {
            "count" : {
                "table" : "vehicle",
                "method" : "count",
                "param" : condition,
                "fun" : (rs, go) => {
                    count = rs;
                    go("find");
                }
            },
            "find" : {
                "table" : "vehicle",
                "method" : "find",
                "param" : [condition,{
                    limit: 20,
                    skip: (page - 1) * 20,
                    sort: {
                        _id: -1
                    }
                }],
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
            response.jade("manager/vehicle/list", {
                "page" : common.page(result, count, page, 20),
                "plateNo" : request["body"]["plateNo"],
                "owner" : request["body"]["owner"]
            });
        });

        db.start();
    });

    router.get("/vehicle/info", (request, response) => {
        common.validate(request["query"], {
            "id" : "notnull"
        });
        let info = null;
        let db = new Db("findOne", {
            "findOne" : {
                "table" : "vehicle",
                "method" : "findOne",
                "param" : {
                    "_id" : ObjectId(request["query"]["id"])
                },
                "fun" : (rs, go) => {
                    info = rs;
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
            response.jade("manager/vehicle/info", {
                "vehicle" : info
            });
        });

        db.start();
    });
}