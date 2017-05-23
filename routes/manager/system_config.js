"use strict";
const MongoDb = require('../../utilities/event-mongodb-datasource');
const ObjectId = require('mongodb').ObjectId;
const common = require('../../utilities/common');
const request = require('request');

module.exports  = router => {
    router.all('/system', (req, res) => {
        let result={};
        let db = new MongoDb('findOne', {
            findOne: {
                table: 'system_config',
                method: 'findOne',
                fun: (rs, go) => {
                    result=rs;
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
            res.jade('manager/system/system_info', {
                info:result
            })
        });

        db.start();
    })

    router.post('/system/save', (req, res) => {
        let result={};
        console.log(req.body.limitNum)
        common.validate({"limit_num":req.body.limitNum},{"limit_num":"notnull"});
        let db = new MongoDb(req.body.id?"update":"save", {
            save: {
                table: 'system_config',
                method: 'insert',
                param:()=> {
                    return {
                        limit_num:~~req.body.limitNum,
                        scale:{
                            "scale_first":parseFloat(req.body.scale_first),
                            "scale_second":parseFloat(req.body.scale_second),
                        }
                    }
                },
                fun: (rs, go) => {
                    go();
                }
            },
            update:{
                table: 'system_config',
                method: 'updateOne',
                param:()=>[{
                    _id : ObjectId(req.body.id)
                },{
                    '$set':{
                        limit_num:~~req.body.limitNum,
                        scale:{
                            "scale_first":parseFloat(req.body.scale_first),
                            "scale_second":parseFloat(req.body.scale_second),
                        }
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

        db.on('end', () => {
            res.push({
                "code":"success"
            })
        });

        db.start();
    })
}