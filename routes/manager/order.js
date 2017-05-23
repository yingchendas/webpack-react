"use strict";
const MongoDb = require('../../utilities/event-mongodb-datasource');
const ObjectId = require('mongodb').ObjectId;
const common = require('../../utilities/common');
const application = require('../../application.json');
const url = require('url');
const request = require('request');
const orderStatus = require('../../utilities/order_status');
const code = require('../../utilities/insurance_code');
const company = require('../../utilities/insurance_company');
const headerEncode = require("../../utilities/headerEncode")

let privateKey = application[process.env.NODE_ENV || 'dev'].private_key;
let publicKey = application[process.env.NODE_ENV || 'dev'].public_key;

module.exports = router => {
    router.all('/order', (req, res) => {
        let page = 1;
        if (req.body.page) {
            page = ~~req.body.page;
        } else if (req.query.page) {
            page = ~~req.query.page;
        }
        let result;
        let count;
        let chan_count = 0;
        let chan_counts = 0;
        let channel = [];
        let condition = {status: {"$exists": true}, delete_status: {$ne: 1}};
        let user = req.session.user;
        if (user.channel_id) {
            condition["channel_id"] = user.channel_id;
        }

        if (req["body"]["plateNo"]) {
            condition["bx_detail.calculate.vehicleInfo.LicenseNo"] = req["body"]["plateNo"];
        }

        if (req["body"]["orderNo"]) {
            condition["code"] = req["body"]["orderNo"];
        }
        if (req["body"]["company"] && req["body"]["company"] !=-1) {
            condition["bx_detail.calculate.ProductCode"] = req["body"]["company"];
        }
        if (req["body"]["start_time"]) {
            condition["create_time"] = {$gte: new Date(req["body"]["start_time"])}
        }
        if (req["body"]["end_time"]) {
            condition["create_time"] = {$lt: new Date(req["body"]["end_time"])}
        }
        if (req["body"]["start_time"] && req["body"]["end_time"]) {
            condition["create_time"] = {
                $gte: new Date(req["body"]["start_time"]),
                $lt: new Date(req["body"]["end_time"])
            }
        }
        if (req["body"]["status"] && req["body"]["status"] != -1) {
            condition["status"] = req["body"]["status"];
        }
        let condition_channel;
        if (req["body"]["channel"] && req["body"]["channel"] != -1) {
            condition_channel = JSON.parse(req.body.channel);
            condition["channel_id"] = ObjectId(condition_channel._id);
        }
        console.log(condition);
        let par = {
            plateNo: req["body"]["plateNo"],
            code: req["body"]["orderNo"],
            start_time: req["body"]["start_time"],
            end_time: req["body"]["end_time"],
            channel: condition_channel ? condition_channel : {},
            status: parseInt(req["body"]["status"]),
            company:req["body"]["company"]
        }
        let db = new MongoDb('count', {
            count: {
                table: 'order',
                method: 'count',
                param: condition,
                fun: (rs, go) => {
                    count = rs;
                    go('find');
                }
            },
            find: {
                table: 'order',
                method: 'find',
                param: [condition, {
                    limit: 20,
                    skip: (page - 1) * 20,
                    sort: {
                        _id: -1
                    }
                }],
                fun: (rs, go) => {
                    for(let i=0;i<rs.length;i++){
                        rs[i].bx_detail.calculate.ProductCode = company.getNameByCode(rs[i].bx_detail.calculate.ProductCode);
                    }
                    result = rs;
                    if (rs.length >= 1) {
                        for (let i = 0; i < rs.length; i++) {
                            rs[i].status = orderStatus.exist(rs[i].status);
                        }
                        go('find_one_user');
                    } else {
                        go('find_channel');
                    }
                }
            },
            find_one_user: {
                table: 'user',
                method: 'findOne',
                param: () => {
                    return {_id: ObjectId(result[chan_count].user_id)}
                },
                fun: (rs, go) => {
                    result[chan_count].user_info = rs;
                    if (chan_count === result.length - 1) {
                        go("find_channels");
                    } else {
                        chan_count++;
                        go('find_one_user')
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
            },
            find_channels:{
                table:'channel',
                method:'find',
                param:()=>{
                    return {_id: ObjectId(result[chan_counts].channel_id)}
                },
                fun:(rs,go)=>{
                    result[chan_counts].channel = rs;
                    if (chan_counts === result.length - 1) {
                        go('find_channel');
                    } else {
                        chan_counts++;
                        go('find_channels')
                    }
                }
            }
        });

        db.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db.on('end', () => {
            res.jade('manager/order/order_list', {
                page: common.page(result, count, page, 20),
                orderStatus: orderStatus.order_list,
                condition: par,
                channels: channel,
                loginName:req.session.user.login_name,
                ents:company.exist(),
            });

        });

        db.start();
    });
    /*
    * 删除订单
    * */
    router.get('/order/remove',(req,res)=>{
        let page = ~~req.query.page;
        let db = new MongoDb('remove',{
            remove:{
                table:"order",
                method:'updateOne',
                param:[{
                    _id:ObjectId(req.query.id)
                },{
                    $set:{
                        delete_status:1
                    }
                }
                ],
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
            res.redirect(req.rootPath + "/order?page="+page)

        });
        db.start();
    });
    /**
     * 查看订单详情
     */
    router.get('/order/info', (req, res) => {
        let order = {};
        let user = {};
        let db2 = new MongoDb('findOne', {
            findOne: {
                table: 'order',
                method: 'findOne',
                param: {
                    _id: ObjectId(req.query.id)
                },
                fun: (rs, go) => {
                    if (rs) {
                        rs.statusInfo = orderStatus.exist(rs.status);
                        rs.bx_detail.calculate.ProductCode = company.exist(rs.bx_detail.calculate.ProductCode)
                    }
                    order = rs;
                    go("find_user")
                }
            },
            find_user: {
                table: 'order',
                method: 'findOne',
                param: () => {
                    return {
                        _id: ObjectId(order.user_id)
                    }
                },
                fun: (rs, go) => {
                    user = rs;
                    go()
                }
            }
        })
        db2.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db2.on('end', () => {
            res.jade('manager/order/order_info', {
                order: order,
                user: user
            });

        });

        db2.start();
    });

    /**
     * 修改订单状态
     */
    router.get('/order/changeStatus', (req, res) => {
        let order = {};
        let db2 = new MongoDb("findOrder", {
            findOrder:{
                table: 'order',
                method: 'findOne',
                param:{
                    _id: ObjectId(req.query.id)
                },
                fun: (rs, go) => {
                    order=rs;
                    go('findOne')
                }
            },
            findOne: {
                table: 'order',
                method: 'update',
                param: [{
                    _id: ObjectId(req.query.id)
                }, {
                    "$set": {
                        status: req.query.status
                    }
                }],

                fun: (rs, go) => {
                    go('status_log')
                }
            },
            status_log:{
                table: 'order_logs',
                method: 'insert',
                param: ()=>{
                    return {
                        "order_code":order.code,
                        "before_status":order.status,
                        "after_status":req.query.status,
                        "operating_time":new Date(),
                        "operator":req.session.user._id
                    }
                },

                fun: (rs, go) => {
                    go()
                }
            }
        })
        db2.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db2.on('end', () => {
            res.redirect(req.rootPath + "/order")

        });
        db2.start();
    });

    router.post('/order/changeStatusHebao', (req, res) => {
        let order = {};
        let db2 = new MongoDb("find_order", {
            find_order:{
                table: 'order',
                method: 'findOne',
                param: {
                    _id: ObjectId(req.body.id)
                },
                fun: (rs, go) => {
                    order = rs;
                    go("find_hebao")
                }
            },
            find_hebao: {
                table: 'order',
                method: 'update',
                param: [{
                    _id: ObjectId(req.body.id)
                }, {
                    "$set": {
                        status: "2",
                        "bx_detail.result.commercePolicyNo":req.body.commerNo,
                        "bx_detail.result.compulsoryPolicyNo":req.body.compulNo,
                        hebao:true,
                        hebao_time:new Date()
                    }
                }],

                fun: (rs, go) => {
                    go('status_log')
                }
            },
            status_log:{
                table: 'order_logs',
                method: 'insert',
                param: ()=>{
                    return {
                        "order_code":order.code,
                        "before_status":"1",
                        "after_status":"2",
                        "operating_time":new Date(),
                        "operator":req.session.user._id
                    }
                },

                fun: (rs, go) => {
                    go()
                }
            }
        })
        db2.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db2.on('end', () => {
            res.push({
                "code":"success"
            })

        });
        db2.start();
    });

    router.post('/order/changeStatusAudit', (req, res) => {
        let order = {};
        let db2 = new MongoDb("find_order", {
            find_order:{
                table: 'order',
                method: 'findOne',
                param: {
                    _id: ObjectId(req.body.id)
                },
                fun: (rs, go) => {
                    order = rs;
                    go("find_audit")
                }
            },
            find_audit: {
                table: 'order',
                method: 'update',
                param: [{
                    _id: ObjectId(req.body.id)
                }, {
                    "$set": {
                        status: "4",
                        audit_des:req.body.auditDes,
                        description:req.body.auditDes
                    }
                }],

                fun: (rs, go) => {
                    go('status_log')
                }
            },
            status_log:{
                table: 'order_logs',
                method: 'insert',
                param: ()=>{
                    return {
                        "order_code":order.code,
                        "before_status":"7",
                        "after_status":"4",
                        "operating_time":new Date(),
                        "operator":req.session.user._id
                    }
                },

                fun: (rs, go) => {
                    go()
                }
            }
        })
        db2.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db2.on('end', () => {
            res.push({
                "code":"success"
            })

        });
        db2.start();
    });

    /**
     * 后台填写保单信息
     */
    router.get('/order/appendInfo', (req, res) => {
        let order = {};
        let db2 = new MongoDb('findOne', {
            findOne: {
                table: 'order',
                method: 'findOne',
                param: {
                    _id: ObjectId(req.query.id)
                },

                fun: (rs, go) => {
                    order = rs;
                    if (rs) {
                        rs.statusInfo = orderStatus.exist(rs.status);
                        rs.bx_detail.calculate.ProductCode = company.exist(rs.bx_detail.calculate.ProductCode)
                    }

                    go()
                }
            }
        })
        db2.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db2.on('end', () => {
            res.jade('manager/order/order_sup', {
                order: order
            })

        });
        db2.start();
    });

    /**
     * 后台保存保单信息
     */
    router.post('/order/saveAppendInfo', (req, res) => {
        let order = {};
        let orderDetail = JSON.parse(req.body.orderDetail);
        let compulsoryInsurances = [];
        let commercialInsurances = [];
        if (orderDetail) {
            for (var i = 0; i < orderDetail.length; i++) {
                if (orderDetail[i].code == 'J1' || orderDetail[i].code == 'CCS') {
                    compulsoryInsurances.push(orderDetail[i])
                } else {
                    commercialInsurances.push(orderDetail[i])
                }
            }
        }
        let db2 = new MongoDb('findOne', {
            findOne: {
                table: 'order',
                method: 'findOne',
                param: {
                    _id: ObjectId(req.body.id)
                },

                fun: (rs, go) => {
                    order = rs;
                    console.log(rs)
                    go("update")
                }
            },
            update: {
                table: 'order',
                method: 'updateOne',
                param: [{
                    _id: ObjectId(req.body.id)
                }, {
                    "$set": {
                        "bx_detail.result.compulsoryPolicyNo": req.body.compulsoryPolicyNo,
                        "bx_detail.result.commercePolicyNo": req.body.commercePolicyNo,
                        "bx_detail.result.compulsoryInsurances": compulsoryInsurances,
                        "bx_detail.result.commercialInsurances": commercialInsurances,
                        "bx_detail.result.discountTotalPremium":parseFloat(req.body.AllAmount),
                        "bx_detail.result.compulsoryPremium":parseFloat(req.body.compAmounts),
                        "bx_detail.result.commercialPremium":parseFloat(req.body.commAmounts),
                        "compNo": req.body.compNo,
                        "commNo": req.body.commNo,
                        "bx_detail.calculate.vehicleInfo.LicenseNo": req.body.LicenseNo,
                        "bx_detail.calculate.vehicleInfo.VehicleTypeCode": req.body.ModelCode,
                        "bx_detail.calculate.vehicleInfo.CarOwnerInfo.Name": req.body.owner,
                        "bx_detail.calculate.vehicleInfo.Name": req.body.VehicleType,
                        "bx_detail.calculate.vehicleInfo.Vin": req.body.Vin,
                        "bx_detail.calculate.vehicleInfo.EngineNo": req.body.EngineNo,
                        "bx_detail.calculate.vehicleInfo.Seat": req.body.Seat,
                        "bx_detail.calculate.vehicleInfo.EnrollDate": req.body.EnrollDate,
                        "bx_detail.calculate.vehicleInfo.TransferFlagTime": req.body.TransferFlagTime,
                        "status": "9",
                        "cal_time":new Date()
                    }
                }],

                fun: (rs, go) => {
                    go('status_log')
                }
            },
            status_log:{
                table: 'order_logs',
                method: 'insert',
                param: ()=>{
                    return {
                        "order_code":order.code,
                        "before_status":"7",
                        "after_status":"9",
                        "operating_time":new Date(),
                        "operator":req.session.user._id
                    }
                },

                fun: (rs, go) => {
                    go()
                }
            }
        })
        db2.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db2.on('end', () => {
            res.push({
                "code": "success"
            })

        });
        db2.start();
    });


    /**
     * 后台出单
     */
    router.post('/order/outOrder', (req, res) => {
        let order = {};
        let db2 = new MongoDb('findOne', {
            findOne: {
                table: 'order',
                method: 'findOne',
                param: {
                    _id: ObjectId(req.body.id)
                },

                fun: (rs, go) => {
                    order = rs;
                    go("update")
                }
            },
            update: {
                table: 'order',
                method: 'updateOne',
                param: [{
                    _id: ObjectId(req.body.id)
                }, {
                    "$set": {
                        "effect_order_time": new Date(),
                        "bx_detail.calculate.vehicleInfo.CarOwnerInfo.IdNo": req.body.orderIdNo,
                        "bx_detail.calculate.vehicleInfo.CarOwnerInfo.Name": req.body.orderName,
                        "compulsoryPolicyNo": req.body.compNo,
                        "commercePolicyNo": req.body.commNo,
                        "compulsoryPolicyDate": new Date(req.body.compDate),
                        "commercePolicyDate": new Date(req.body.commDate),
                        "description":new Date().toFormat("YYYY-MM-DD HH24:MI")+"纸质保单已寄出（顺丰速运-"+req.body.expressNUm+"）",
                        "status": "6"
                    }
                }],

                fun: (rs, go) => {
                    go('status_log')
                }
            },
            status_log:{
                table: 'order_logs',
                method: 'insert',
                param: ()=>{
                    return {
                        "order_code":order.code,
                        "before_status":order.status,
                        "after_status":"6",
                        "operating_time":new Date(),
                        "operator":req.session.user._id
                    }
                },

                fun: (rs, go) => {
                    go()
                }
            }
        })
        db2.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        db2.on('end', () => {
            res.push({
                "code": "success"
            })

        });
        db2.start();
    });

    /**
     * 订单再次报价信息跳转
     */
    router.get('/order/audit_msg', (req, res) => {
        res.jade('manager/order/order_audit', {
            id: req.query.id
        });

    })

    /**
     * 后台订单核保
     */
    router.post('/order/audit', (req, res) => {
        let order = {};
        let msg = {};
        let calcu_data = {};
        let license = req.body.license;
        let owner = req.body.owner;
        let vin = req.body.vin;
        let idNo = req.body.idNo;
        //保存订单
        let save_order = (err, data) => {
            if (!err) {
                console.log("核保正常");
                if (JSON.parse(data).code === 'success') {
                    calcu_data.message.audit.CommercePolicyNo = data.message.commercialNo;
                    calcu_data.message.audit.CompulsoryPolicyNo = data.message.compulsoryNo;
                    let db5 = new MongoDb('update', {
                        update: {
                            table: 'order',
                            method: 'updateOne',
                            param: [{
                                _id: ObjectId(req.body.id)
                            }, {
                                "$set": {
                                    "bx_detail.audit": calcu_data.message.audit,
                                    "bx_detail.result": calcu_data.message.result,
                                    "status": 2
                                }
                            }],
                            fun: (rs, go) => {
                                go()
                            }
                        },
                    });

                    db5.on('err', err => {
                        process.nextTick(() => {
                            throw err;
                        })
                    });
                    db5.on('end', () => {
                        res.push({
                            code: 'succerss',
                            message: '成功',
                            status: 1
                        })

                    });

                    db5.start();
                } else {
                    process.nextTick(() => {
                        throw new Error('查询失败');
                    })
                }
                //在这里保存订单
                // return_calcu= JSON.parse(data);
            } else {
                process.nextTick(() => {
                    throw err;
                })
            }
        }
        //核保
        let hebao = (err, data) => {
            if (!err) {
                //调核保
                if (JSON.parse(data).code === 'success') {
                    calcu_data = JSON.parse(data);
                    getAudit(data, save_order);
                } else {
                    process.nextTick(() => {
                        throw new Error('查询失败');
                    })
                }
            } else {
                process.nextTick(() => {
                    throw err;
                })
            }
        }

        //算价返回正确购买时间
        let return_suanjia = (err, data) => {
            let json_data = JSON.parse(data);
            if (!err) {
                //根据返回的不同时间来
                if (json_data.code == 'success') {
                    hebao(null, data);
                } else {
                    //根据返回的不同时间来
                    if (json_data.message.CommercePolicyEndDate && json_data.message.CompulsoryPolicyEndDate) {
                        //获取时间
                        msg.message.CommercePolicyBeginDate = changeTime(json_data.message.CommercePolicyEndDate, 1).toFormat("YYYY-MM-DDTHH:MI:SS");
                        msg.message.CommercePolicyEndDate = changeTime(json_data.message.CommercePolicyEndDate, 1).toFormat("YYYY-MM-DDTHH:MI:SS");
                        msg.message.CompulsoryPolicyBeginDate = changeTime(json_data.message.CompulsoryPolicyEndDate, 1).toFormat("YYYY-MM-DDTHH:MI:SS");
                        msg.message.CompulsoryPolicyEndDate = changeTime(json_data.message.CompulsoryPolicyEndDate, 1).toFormat("YYYY-MM-DDTHH:MI:SS");

                    } else if (json_data.message.CommercePolicyEndDate) {
                        msg.message.CommercePolicyBeginDate = changeTime(json_data.message.CommercePolicyEndDate, 1).toFormat("YYYY-MM-DDTHH:MI:SS");
                        msg.message.CommercePolicyEndDate = changeTime(json_data.message.CommercePolicyEndDate, 365).toFormat("YYYY-MM-DDTHH:MI:SS");
                        msg.message.CompulsoryPolicyBeginDate = changeTime(json_data.message.CommercePolicyEndDate, 1).toFormat("YYYY-MM-DDTHH:MI:SS");
                        msg.message.CompulsoryPolicyEndDate = changeTime(json_data.message.CommercePolicyEndDate, 365).toFormat("YYYY-MM-DDTHH:MI:SS");

                    } else if (json_data.message.CompulsoryPolicyEndDate) {
                        msg.message.CommercePolicyBeginDate = changeTime(json_data.message.CompulsoryPolicyEndDate, 1).toFormat("YYYY-MM-DDTHH:MI:SS");
                        msg.message.CommercePolicyEndDate = changeTime(json_data.message.CompulsoryPolicyEndDate, 365).toFormat("YYYY-MM-DDTHH:MI:SS");
                        msg.message.CompulsoryPolicyBeginDate = changeTime(json_data.message.CompulsoryPolicyEndDate, 1).toFormat("YYYY-MM-DDTHH:MI:SS");
                        msg.message.CompulsoryPolicyEndDate = changeTime(json_data.message.CompulsoryPolicyEndDate, 365).toFormat("YYYY-MM-DDTHH:MI:SS");
                    } else {
                        process.nextTick(() => {
                            throw new Error('查询失败');
                        })
                    }
                    //再次调算价
                    getCalculate(order, msg, hebao, idNo);
                }
            } else {
                process.nextTick(() => {
                    throw err;
                })
            }
        };


        let exe = () => {
            let requestURL = url.format({
                protocol: 'http',
                hostname: application[process.env.NODE_ENV || 'dev'].interface.host,
                port: application[process.env.NODE_ENV || 'dev'].interface.port,
                pathname: '/interface/ins/renewal'
            });
            request.post(requestURL, {
                form: {
                    owner: owner,
                    plateNo: license
                }
            }, (err, response, body) => {
                //查询续保
                if (err || response.statusCode !== 200) {

                    let err = new Error('查询续保信息失败');
                    process.nextTick(() => {
                        throw err;
                    })
                } else {
                    //判断是否查询续保成功
                    body = JSON.parse(body);
                    if (body.code === 'success') {
                        msg = body;
                        var returnDate = isBuyForTime(body.message.FormerInfo.CompulsoryPolicyEndDate);
                        if (returnDate.code == 'success') {
                            getCalculate(order, body, hebao, idNo)

                        } else if (returnDate.message) {
                            //直接push回去
                            process.nextTick(() => {
                                throw new Error('查询失败');
                            })
                        } else {
                            //这里需回调算价
                            console.log("进入算价，取时间");
                            getCalculate(order, body, return_suanjia, idNo)
                        }
                    } else {
                        //失败调查询车辆接口
                        let vehicle = url.format({
                            protocol: 'http',
                            hostname: application[process.env.NODE_ENV || 'dev'].interface.host,
                            port: application[process.env.NODE_ENV || 'dev'].interface.port,
                            pathname: '/interface/ins/vehicle'
                        });
                        request.post(vehicle, {
                            form: {
                                owner: owner,
                                plateNo: license,
                                vin: vin
                            }
                        }, (err, response, body) => {
                            if (err || response.statusCode !== 200) {

                                let err = new Error('查询车辆信息失败')
                                process.nextTick(() => {
                                    throw err;
                                })
                            } else {
                                //判断是否查询车辆信息成功
                                body = JSON.parse(body)
                                if (body.code == 'success') {
                                    res.jade('manager/order/order_car_dialog', {
                                        message: body.message,
                                        order_id: order._id,
                                    })
                                } else {
                                    process.nextTick(() => {
                                        throw new Error('查询失败')
                                    })
                                }
                            }
                        })
                    }
                }
            })
        };

        let db3 = new MongoDb('findOne', {
            findOne: {
                table: 'order',
                method: 'findOne',
                param: {
                    _id: ObjectId(req.body.id)
                },
                fun: (rs, go) => {
                    order = rs;
                    //调查询车辆
                    go()
                }
            },
        });

        db3.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });
        db3.on('end', () => {

            exe();

        });

        db3.start();
    })

    /**
     * 获取车辆信息后算价
     * again
     */
    router.post('/order/audit_again', (req, res) => {
        let user_name = 'fgcs03';
        let password = '111111';
        let order = {};
        let msg = {};
        let calcu_data = {};

        //保存订单
        let save_order = (err, data) => {
            if (!err) {
                console.log("核保正常");
                if (JSON.parse(data).code === 'success') {
                    res.push({
                        code: 'succerss',
                        message: '成功'
                    })
                } else {
                    process.nextTick(() => {
                        throw new Error("查询失败");
                    })
                }
                //在这里保存订单
                // return_calcu= JSON.parse(data);
            } else {
                process.nextTick(() => {
                    throw err;
                })
            }
        }
        //核保
        let hebao = (err, data) => {
            if (!err) {
                //调核保
                if (JSON.parse(data).code === 'success') {
                    calcu_data = JSON.parse(data);
                    getAudit(data, save_order);
                } else {
                    process.nextTick(() => {
                        throw new Error('查询失败');
                    })
                }
            } else {
                process.nextTick(() => {
                    throw err;
                })
            }
        };

        let return_cal = (err, data) => {
            let json_data = JSON.parse(data);
            if (!err) {
                if (json_data.code === 'success') {
                    hebao(null, data);
                } else {
                    //根据返回的不同时间来
                    if (json_data.message.CommercePolicyEndDate && json_data.message.CompulsoryPolicyEndDate) {
                        //获取时间
                        msg.message.CommercePolicyBeginDate = changeTime(json_data.message.CommercePolicyEndDate, 1).toFormat("YYYY-MM-DDTHH:MI:SS");
                        msg.message.CommercePolicyEndDate = changeTime(json_data.message.CommercePolicyEndDate, 1).toFormat("YYYY-MM-DDTHH:MI:SS");
                        msg.message.CompulsoryPolicyBeginDate = changeTime(json_data.message.CompulsoryPolicyEndDate, 1).toFormat("YYYY-MM-DDTHH:MI:SS");
                        msg.message.CompulsoryPolicyEndDate = changeTime(json_data.message.CompulsoryPolicyEndDate, 1).toFormat("YYYY-MM-DDTHH:MI:SS");

                    } else if (json_data.message.CommercePolicyEndDate) {
                        msg.message.CommercePolicyBeginDate = changeTime(json_data.message.CommercePolicyEndDate, 1).toFormat("YYYY-MM-DDTHH:MI:SS");
                        msg.message.CommercePolicyEndDate = changeTime(json_data.message.CommercePolicyEndDate, 365).toFormat("YYYY-MM-DDTHH:MI:SS");
                        msg.message.CompulsoryPolicyBeginDate = changeTime(json_data.message.CommercePolicyEndDate, 1).toFormat("YYYY-MM-DDTHH:MI:SS");
                        msg.message.CompulsoryPolicyEndDate = changeTime(json_data.message.CommercePolicyEndDate, 365).toFormat("YYYY-MM-DDTHH:MI:SS");

                    } else if (json_data.message.CompulsoryPolicyEndDate) {
                        msg.message.CommercePolicyBeginDate = changeTime(json_data.message.CompulsoryPolicyEndDate, 1).toFormat("YYYY-MM-DDTHH:MI:SS");
                        msg.message.CommercePolicyEndDate = changeTime(json_data.message.CompulsoryPolicyEndDate, 365).toFormat("YYYY-MM-DDTHH:MI:SS");
                        msg.message.CompulsoryPolicyBeginDate = changeTime(json_data.message.CompulsoryPolicyEndDate, 1).toFormat("YYYY-MM-DDTHH:MI:SS");
                        msg.message.CompulsoryPolicyEndDate = changeTime(json_data.message.CompulsoryPolicyEndDate, 365).toFormat("YYYY-MM-DDTHH:MI:SS");
                    } else {
                        process.nextTick(() => {
                            throw new Error('查询失败');
                        })
                    }
                    //再次调算价
                    getCalculate(order, msg, hebao);
                }
            } else {
                process.nextTick(() => {
                    throw err;
                })
            }
        }

        let exe2 = () => {
            let dataMsg = JSON.parse(req.body.car_info);
            let calculate_data = {
                'code': 'success', 'message': {
                    'ToInsuredInfo': dataMsg.CarOwnerInfo,
                    'BeInsuredInfo': dataMsg.CarOwnerInfo,
                    'logUser': {
                        'Username': user_name,
                        'Password': password
                    },
                    'vehicleInfo': dataMsg,
                    'CommercePolicyBeginDate': changeTime(new Date(), 1).toFormat("YYYY-MM-DDTHH:MI:SS"),
                    'CommercePolicyEndDate': changeTime(new Date(), 1).toFormat("YYYY-MM-DDTHH:MI:SS"),
                    'CompulsoryPolicyBeginDate': changeTime(new Date(), 1).toFormat("YYYY-MM-DDTHH:MI:SS"),
                    'CompulsoryPolicyEndDate': changeTime(new Date(), 1).toFormat("YYYY-MM-DDTHH:MI:SS"),
                    'ProductCode': 'PAZYCX',
                    'Province': '四川',
                    'ProxyCompanyID': '0'
                }
            };
            msg = calculate_data;
            getCalculate(order, calculate_data, return_cal);
        };


        let db4 = new MongoDb('findOne', {
            findOne: {
                table: 'order',
                method: 'findOne',
                param: {
                    _id: ObjectId(req.body.id)
                },
                fun: (rs, go) => {
                    order = rs;
                    //调查询车辆
                    go()
                }
            },
        });

        db4.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });
        db4.on('end', () => {
            exe2();

        });

        db4.start();
    })

    /**
     * 再次算价核保
     * again
     */
    router.all('/order/audit_second', (req, res) => {
        let order = {};
        let cal_msg = {};
        let sj = () => {
            //调算价接口
            let requestURL = url.format({
                protocol: 'http',
                hostname: application[process.env.NODE_ENV || 'dev'].interface.host,
                port: application[process.env.NODE_ENV || 'dev'].interface.port,
                pathname: '/interface/ins/calculate'
            });
            let body={
                param: JSON.stringify(order.bx_detail.calculate),
            }
            request.post(requestURL, {
                form: body,
                headers:headerEncode.encode(body,publicKey,privateKey)
            }, (err, response, body) => {
                console.log(body)
                if (err || response.statusCode !== 200)
                    res.push({
                        "code": "fail"
                    });
                else {
                    cal_msg = JSON.parse(body);
                    hebao(null, body);
                }
            })
        };
        //核保
        let hebao = (err, data) => {
            if (!err) {
                //调核保
                if (JSON.parse(data).code === 'success') {
                    getAudit(data, save_order);
                } else {
                    process.nextTick(() => {
                        throw new Error('查询失败');
                    })
                }
            } else {
                process.nextTick(() => {
                    throw err;
                })
            }
        };
        // 修改订单信息
        let save_order = (err, data) => {
            let hb = JSON.parse(data);
            if (hb.code === 'success') {
                cal_msg.message.audit.CommercePolicyNo = hb.message.commercialNo;
                cal_msg.message.audit.CompulsoryPolicyNo = hb.message.compulsoryNo;
                let db5 = new MongoDb('findOne', {
                    findOne: {
                        table: 'order',
                        method: 'updateOne',
                        param: [{
                            _id: ObjectId(req.query.id)
                        }, {
                            "$set": {
                                "bx_detail.audit": cal_msg.message.audit,
                                "bx_detail.result": cal_msg.message.result,
                            }
                        }],
                        fun: (rs, go) => {
                            order = rs;
                            go()
                        }
                    },
                });
                db5.on('err', err => {
                    process.nextTick(() => {
                        throw err;
                    })
                });
                db5.on('end', () => {
                    res.push({
                        code: 'success',
                        message: '成功'
                    });
                });
                db5.start();

            } else {
                process.nextTick(() => {
                    throw new Error("查询失败");
                })
            }
        };
        //获取订单信息
        let db4 = new MongoDb('findOne', {
            findOne: {
                table: 'order',
                method: 'findOne',
                param: {
                    _id: ObjectId(req.query.id)
                },
                fun: (rs, go) => {
                    order = rs;
                    //调查询车辆
                    go()
                }
            },
        });

        db4.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });
        db4.on('end', () => {
            sj();
        });
        db4.start();

    })

}


//判断是否能购买保险
function isBuyForTime(comDate) {
    var date = new Date();
    var time = Math.ceil((new Date(comDate).getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
    if (time >= 90) {
        return {"code": "fault", "message": new Date((new Date(comDate).getTime() - 24 * 60 * 60 * 1000 * 90))};
    } else if (time >= -90 && time < 90) {
        return {"code": "success", "message": new Date((new Date(comDate).getTime() + 24 * 60 * 60 * 1000))};
    } else {
        return {"code": "fault"};
    }
}

//获取诚泰车损价格
function getMoneyCT(priceNoTax, useNatrue, vtCode, unCode, comBeginDate, enrollDate) {
    var enDate = new Date(enrollDate);
    var comDate = new Date(comBeginDate);
    var subDay = comDate.getDay() < enDate.getDay() ? 1 : 0;
    var month = (comDate.getYear() * 12 + comDate.getMonth() ) - (enDate.getYear() * 12 + enDate.getMonth()) + subDay;
    var x = 0.009;
    if (("A012" == vtCode || "A022" == vtCode) && useNatrue == 2) {
        x = 0.006;
    } else if ("01" == unCode || "214" == unCode || "B022" == vtCode || "B032" == vtCode || "B042" == vtCode) {
        x = 0.012;
    }
    var money = priceNoTax - priceNoTax * x * month;
    if (money < priceNoTax * 0.2) {
        money = priceNoTax * 0.2;
    }
    return money;
}

//获取其他车损价格
function getMoney(priceNoTax, useNatrue, vtCode, unCode, comBeginDate, enrollDate) {
    var enDate = new Date(enrollDate);
    var comDate = new Date(comBeginDate);
    var subDay = comDate.getDay() < enDate.getDay() ? 1 : 0;
    var month = (comDate.getYear() * 12 + comDate.getMonth() ) - (enDate.getYear() * 12 + enDate.getMonth()) + subDay;
    var x = 0.009;
    if (("A012" == vtCode || "A022" == vtCode) && useNatrue == 1 && unCode != "01") {
        x = 0.012;
    } else if (useNatrue == 2 && ("A012" == vtCode || "A022" == vtCode) && unCode != "01") {
        x = 0.006;
    } else if (useNatrue == 1 && unCode == "01") {
        x = 0.011;
    }
    var money = priceNoTax - priceNoTax * x * month;
    if (money <= priceNoTax * 0.2) {
        money = priceNoTax * 0.2;
    }
    return money;
}

//通过身份证获取生日
function getBirthDay(idNO) {
    return idNo.substring(6, 10) + "-" + idNo.substring(10, 12) + "-" + idNo.substring(12, 14);
}
//通过身份证获取年纪
function getAge(idNO) {
    var user_brith = idNo.substring(6, 10) + "-" + idNo.substring(10, 12) + "-" + idNo.substring(12, 14);
    var user_brith_date = new Date(user_brith);
    return new Date().getYear() - user_brith_date.getYear();
}

//封装用户信息
function userInfo(toInsuredInfo, idNo) {
    toInsuredInfo.Address ? toInsuredInfo.Address : toInsuredInfo['Address'] = "成都市武侯区";
    toInsuredInfo.Mobile ? toInsuredInfo.Mobile : toInsuredInfo['Mobile'] = "13800138000";
    toInsuredInfo.IdNo ? toInsuredInfo.IdNo : toInsuredInfo['IdNo'] = idNo;
    toInsuredInfo.Sex ? toInsuredInfo.Sex : toInsuredInfo['Sex'] = parseInt(idNo.substring(16, 17)) % 2 == 0 ? 2 : 1;
    toInsuredInfo.Birthday ? toInsuredInfo.Birthday : toInsuredInfo['Birthday'] = getBirthDay(idNo);
    toInsuredInfo.Age ? toInsuredInfo.Age : toInsuredInfo['Age'] = getAge(idNo);
    return toInsuredInfo;
}

//提取算价接口
function getCalculate(order, body, fn, idNo) {
    //根据保险公司算取车损价格
    let z1_price;
    //不同的保险公司传入数据
    let _priceFromCar;
    //这里取保险公司编码判断
    if (1) {
        _priceFromCar = body.message.vehicleInfo.PriceNoTax;

    } else {
        _priceFromCar = body.message.vehicleInfo.Price;
    }
    z1_price = getMoneyCT(_priceFromCar,
        body.message.vehicleInfo.UseNature ? body.message.vehicleInfo.UseNature : 2,
        body.message.vehicleInfo.VehicleTypeCode,
        body.message.vehicleInfo.UseNatureCode,
        body.message.CommercePolicyBeginDate,
        body.message.vehicleInfo.EnrollDate);
    //这里进行算价,定义算价的对象
    let calculate = {};
    //在这里获取险种信息
    let details = order.bx_detail.calculate.VehicleInsurance.VehicleInsuranceItem;
    //定义险种的集合
    let vehicInsuranceItem = [];
    if (details != null && details.length > 0) {
        for (var i = 0; i < details.length; i++) {
            //这里需要把车损，盗抢价格拉进来
            let item = {};
            if (details[i].Code == 'Z1' || details[i].Code == 'Z2' || details[i].Code == 'F5') {
                item = {
                    'Code': details[i].Code.toUpperCase(),
                    'Amount': z1_price,
                    'Quantity': details[i].Quantity,
                    'UnitAmount': details[i].UnitAmount
                };
            } else {
                item = {
                    'Code': details[i].Code.toUpperCase(),
                    'Amount': details[i].Amount,
                    'Quantity': details[i].Quantity,
                    'UnitAmount': details[i].UnitAmount
                };
            }
            vehicInsuranceItem.push(item);
        }
    }
    //修改续保信息里面的电话等信息
    let toInsuredInfo = userInfo(body.message.ToInsuredInfo, idNo);
    let beInsuredInfo = userInfo(body.message.BeInsuredInfo, idNo);
    calculate = {
        'VehicleInsurance': {'VehicleInsuranceItem': vehicInsuranceItem},
        'ToInsuredInfo': toInsuredInfo,
        'BeInsuredInfo': beInsuredInfo,
        'loginUser': body.message.logUser,
        'vehicleInfo': body.message.vehicleInfo,
        'CommercePolicyBeginDate': body.message.CommercePolicyBeginDate,
        'CommercePolicyEndDate': body.message.CommercePolicyEndDate,
        'CompulsoryPolicyBeginDate': body.message.CompulsoryPolicyBeginDate,
        'CompulsoryPolicyEndDate': body.message.CompulsoryPolicyEndDate,
        'ProductCode': body.message.ProductCode,
        'CompanyProvince': body.message.Province,
        'ProxyCompanyID': body.message.ProxyCompanyID
    };
    //调算价接口
    let requestURL = url.format({
        protocol: 'http',
        hostname: application[process.env.NODE_ENV || 'dev'].interface.host,
        port: application[process.env.NODE_ENV || 'dev'].interface.port,
        pathname: '/interface/ins/calculate'
    });
    request.post(requestURL, {
        form: {
            param: JSON.stringify(calculate),
        }
    }, (err, response, body) => {
        if (err || response.statusCode !== 200)
            fn(err)
        else
            fn(null, body)
    })
}

//查询续保
function getAudit(return_calcu, fn) {

    let _audit = JSON.parse(return_calcu).message.audit;
    //调核保接口
    let requestURL = url.format({
        protocol: 'http',
        hostname: application[process.env.NODE_ENV || 'dev'].interface.host,
        port: application[process.env.NODE_ENV || 'dev'].interface.port,
        pathname: '/interface/ins/audit'
    });
    let body = {
        param: JSON.stringify(_audit),
    }
    request.post(requestURL, {
        form: body,
        headers:headerEncode.encode(body,publicKey,privateKey)
    }, (err, response, body) => {
        if (err || response.statusCode !== 200) {
            fn(err)
        }
        else {
            fn(null, body)
        }
    })

}

//时间做加减
function changeTime(time, day) {
    var change_time = new Date(time);
    return new Date(change_time.getTime() + day * 24 * 60 * 60 * 1000)
}

