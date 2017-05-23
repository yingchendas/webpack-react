
"use strict";
const MongoDb = require('../../utilities/event-mongodb-datasource');
const ObjectId = require('mongodb').ObjectId;
const common = require('../../utilities/common');
const application = require('../../application.json');
const url = require('url');
const request = require('request');
const code = require('../../utilities/insurance_code')

module.exports  = router =>{
    router.all('/template', (req, res)=> {
        let page = 1;
        if (req.body.page && req.body.page.isInt()) {
            page = ~~req.body.page;
        } else if (req.query.page && req.quer.page.isInt()) {
            page = ~~req.query.page;
        }
        let result;
        let count;
        let chan_count=0;
        let condition = {delete_status:{$ne:1}};
        let user = req.session.user;
        if(user.channel_id){
            condition["channel"] =user.channel_id.toString();
        }
        let db = new MongoDb('count', {
            count: {
                table: 'template',
                method: 'count',
                param:condition,
                fun: (rs, go)=> {
                    count = rs;
                    go('find');
                }
            },
            find: {
                table: 'template',
                method: 'find',
                param: [condition, {
                    limit: 20,
                    skip: (page - 1) * 20,
                    sort: {
                        sort: -1
                    }
                }],
                fun: (rs, go)=> {
                    result = rs;

                    if(result.length > 0)
                        go('find_one_channel')
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
            res.jade('manager/template/template_list',{
                page: common.page(result, count, page, 20),
            });

        });

        db.start();
    });

    router.get('/template/info', (req, res) => {
        let template = {};
        let channels = {};
        let go = () => {
            console.log(template);
            res.jade('manager/template/template_info', {
                info: template,
                codes:code.code,
                channels:channels
            })
        };
        let mDb = new MongoDb("find" , {
            find: {
                table: 'template',
                method: 'findOne',
                param: {
                    delete_status:{$ne:1},
                    _id: ObjectId(req.query.id)
                },
                fun: (rs, go) => {
                    template = rs==null?template:rs;
                    go("find_one_channel");
                }
            },
            find_one_channel:{
                table: 'channel',
                method: 'findOne',
                param: ()=>{
                    return {_id: ObjectId(template.channel)}
                },
                fun: (rs, go) => {
                    template.channel = rs==null?template.channel:rs;
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
                    console.log(rs)
                    channels = rs==null?channels:rs;
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

    router.all('/template/updateStatus', (req, res) => {
        let go = () => {
           res.redirect(req.rootPath + "/template")
        };
        let mDb = new MongoDb("update" , {
            update: {
                table: 'template',
                method: 'update',
                param: [{_id:ObjectId(req.query.id)},{
                   "$set":{
                       status:req.query.status
                   }
                }],
                fun: (rs, go) => {
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

    router.all('/template/save', (req, res)=> {
        let data = JSON.parse(req.body.data);
        let las = []
        console.log(req.body.channel)
        for(let i=0;i<data.length;i++){
            data[i].Quantity = '0';
            data[i].UnitAmount = '0';
            // let la={VehicleInsuranceItem:data[i]};
            las.push(data[i]);
        }

        let db = new MongoDb(req.body.recommended==1?"change_recommended":'change_not_recommended', {
            save:{
                table: 'template',
                method: 'insert',
                param: {
                    name:req.body.name,
                    sort:req.body.sort,
                    channel:JSON.parse(req.body.channel)._id,
                    VehicleInsurance:las,
                    status:1,
                    createTime:new Date(),
                    is_recommended:parseInt(req.body.recommended)
                },
                fun: (rs, go) => {
                    if(parseInt(req.body.recommended)==1){
                        go();
                    }else{
                        go();
                    }
                }
            },
            update:{
                table: 'template',
                method: 'updateOne',
                param:()=>[{
                    _id : ObjectId(req.body.id)
                },{
                    '$set':{
                        name:req.body.name,
                        sort:req.body.sort,
                        channel:JSON.parse(req.body.channel)._id,
                        VehicleInsurance:las,
                        status:1,
                        is_recommended:parseInt(req.body.recommended)
                    }
                }],
                fun: (rs, go) => {
                    if(parseInt(req.body.recommended)==1){
                        go()
                    }else{
                        go();
                    }
                }
            },
            change_recommended:{
                table: 'template',
                method: 'update',
                param:()=>[{
                    is_recommended:1,
                    channel:JSON.parse(req.body.channel)._id
                },{
                    '$set':{
                        is_recommended:0
                    }
                }],
                fun: (rs, go) => {
                    if(req.body.id){
                        go('update');
                    }else {
                        go('save');
                    }
                }
            },
            change_not_recommended:{
                table: 'template',
                method: 'find',
                fun: (rs, go) => {
                    if(req.body.id){
                        go('update');
                    }else {
                        go('save');
                    }
                }
            }

        });
        db.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db.on('end', ()=> {
            res.redirect(req.rootPath + "/template")

        });

        db.start();
    });
}