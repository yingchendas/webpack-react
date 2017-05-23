"use strict";
const MongoDb = require('../../utilities/event-mongodb-datasource');
const ObjectId = require('mongodb').ObjectId;
const common = require('../../utilities/common');
const application = require('../../application.json');
const url = require('url');
const request = require('request');
const code = require('../../utilities/insurance_code')

module.exports  = router =>{
    router.all('/drawing', (req, res)=> {
        let page = 1;
        if (req.body.page && req.body.page.isInt()) {
            page = ~~req.body.page;
        } else if (req.query.page && req.quer.page.isInt()) {
            page = ~~req.query.page;
        }
        let result;
        let count;
        let condition={ delete_status:{$ne:1}};
        if(req.body.status&&req.body.status!=-2){
            condition["status"] = parseInt(req["body"]["status"]);
        }
        let db = new MongoDb('count', {
            count: {
                table: 'drawing',
                method: 'count',
                param:condition,
                fun: (rs, go)=> {
                    count = rs;
                    go('find');
                }
            },
            find: {
                table: 'drawing',
                method: 'find',
                param: [condition, {
                    limit: 20,
                    skip: (page - 1) * 20,
                    sort: {
                        _id:  -1
                    }
                }],
                fun: (rs, go)=> {
                    result = rs;
                    go();
                }
            },
        });

        db.on('err', err=> {
            process.nextTick(()=> {
                throw err;
            })
        });

        db.on('end', ()=> {
            res.jade('manager/drawing/drawing_list',{
                page: common.page(result, count, page, 20),
                condition:condition
            });

        });

        db.start();
    });

    router.get('/drawing/info', (req, res) => {
        let drawing = {};
        let user = {};
        let go = () => {
            res.jade('manager/drawing/drawing_info', {
                info: drawing,
                codes:code.code,
                user:user
            })
        };
        let mDb = new MongoDb("find" , {
            find: {
                table: 'drawing',
                method: 'findOne',
                param: {
                    delete_status:{$ne:1},
                    _id: ObjectId(req.query.id)
                },
                fun: (rs, go) => {
                    drawing = rs==null?drawing:rs;
                    go('find_user');
                }
            },
            find_user:{
                table: 'user',
                method: 'findOne',
                param: ()=>{
                    return{
                        _id:drawing.userId
                    }
                },
                fun: (rs, go) => {
                    user = rs;
                    user.sub =Math.round((user.wallet.amount-user.wallet.already_withdrawals)*100)/100;
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

    router.all('/drawing/refused', (req, res)=> {
        let user = {};
        let drawing = {};
        common.validate({refuled:req.body.refuled},{"refuled":"notnull"});
        let db = new MongoDb('update', {
            update:{
                table: 'drawing',
                method: 'updateOne',
                param:()=>[{
                    _id : ObjectId(req.body.id)
                },{
                    '$set':{
                        refuled:req.body.refuled,
                        status:-1
                    }
                }],
                fun: (rs, go) => {
                    go('find_drawing');
                }
            },
            find_drawing:{
                table: 'drawing',
                method: 'findOne',
                param:{
                    _id : ObjectId(req.body.id)
                },
                fun: (rs, go) => {
                    drawing=rs;
                    go("find_user");
                }
            },
            find_user:{
                table: 'user',
                method: 'findOne',
                param:{
                    _id : ObjectId(req.body.user_id)
                },
                fun: (rs, go) => {
                    user=rs;
                    go("update_user");
                }
            },
            update_user:{
                table: 'user',
                method: 'updateOne',
                param:()=>[{
                    _id : ObjectId(req.body.user_id)
                },{
                    '$set':{
                        "wallet.already_withdrawals":parseFloat((user.wallet.already_withdrawals-drawing.amount).toFixed(2))
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
    router.all('/drawing/pass', (req, res)=> {
        let db = new MongoDb('update', {
            update:{
                table: 'drawing',
                method: 'updateOne',
                param:()=>[{
                    _id : ObjectId(req.query.id)
                },{
                    '$set':{
                        status:1
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
            res.redirect(req.rootPath + "/drawing");
        });

        db.start();
    });


}