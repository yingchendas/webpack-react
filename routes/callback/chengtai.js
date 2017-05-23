/**
 * 诚泰保险公司回调
 * */
"use strict";

const Db = require("../../utilities/event-mongodb-datasource");

module.exports = router => {

    router.all("/ct/manualAudit", (req, res) => {
        let policyAppNo = req.body.policyAppNo;
        let paymentStartDate = req.body.paymentStartDate;//缴费有效期-起始
        let paymentEndDate = req.body.paymentEndDate;//缴费有效期-终止
        let status = req.body.status;
        let remark = req.body.remark;
        let udrDate = req.body.udrDate;//核保日期

        if(status == 1 || status == 5){
            let temp = 3 * 24 * 60 * 60000, order;

            let db = new Db("get", {
                "get" : {
                    "table": "order",
                    "method": "findOne",
                    "param": {
                        "audit_return_code": policyAppNo
                    },
                    "fun" : (rs, go) => {
                        if(rs){
                            order = rs;
                            go("update");
                        }else{
                            go();
                        }
                    }
                },
                "update" : {
                    "table": "order",
                    "method": "update",
                    "param": () => {
                        let a = new Date(order.create_time.getTime() + temp);
                        let desc = "将于 "+a.toFormat('YYYY-MM-DD HH24:MI') + " 失效";
                        return [{
                            "audit_return_code": policyAppNo
                        }, {
                            "$set": {
                                "hebao": true,
                                "hebao_time": new Date(),
                                "status": "2",
                                "description" : desc
                            }
                        }];
                    },
                    "fun": (rs, go) => {
                        go();
                    }
                }
            });
            db.on("err", err => {
                process.nextTick(() => {
                    console.log(err);
                    res.push({
                        "flag" : "0000"
                    });
                });
            });
            db.on("end", () => {
                res.push({
                    "flag" : "0000"
                });
            });
            db.start();
        }else{
            res.push({
                "flag" : "0000"
            });
        }
    });

    router.post('/ct/paymentCallback', (req, res) => {
        let orderCode = req.body.orderCode;
        let payDate = req.body.payDate;
        console.log('诚泰支付回调～～～～～～～');
        console.log('orderCode : ' + orderCode);
        console.log('payDate : ' + payDate);
        if(orderCode && payDate){
            let order;
            let db = new Db('get', {
                'get' : {
                    'table' : 'order',
                    'method' : 'findOne',
                    'param' : {
                        'bx_detail.result.policyNo' : orderCode
                    },
                    'fun' : (rs, go) => {
                        if(rs){
                            order = rs;
                            go('update');
                        }else{
                            go();
                        }
                    }
                },
                'update' : {
                    'table' : 'order',
                    'method' : 'update',
                    'param' : () => {
                        return [{
                            '_id' : order._id
                        },{
                            '$set' : {
                                'status' : '5',
                                'description' : '支付成功，等待出单'
                            }
                        }];
                    },
                    'fun' : (rs, go) => {
                        go('log');
                    }
                },
                'log' : {
                    'table' : 'order_logs',
                    'method' : 'insert',
                    'param' : () => {
                        return {
                            'order_code' : order.code,
                            'before_status' : '2',
                            'after_status' : '5',
                            'operating_time' : new Date()
                        };
                    },
                    'fun' : (rs, go) => {
                        go();
                    }
                }
            });
            db.on("err", err => {
                process.nextTick(() => {
                    console.log(err);
                    res.push({
                        "flag" : "发生异常：" + err.message
                    });
                });
            });
            db.on("end", () => {
                res.push({
                    "flag" : order ? "0000" : "订单不存在"
                });
            });
            db.start();
        }else{
            res.push({
                "flag" : "参数错误"
            });
        }
    });

    router.post('/ct/acceptConfirmation', (req, res) => {
        let applNo = req.body.applNo;
        let policyNSDate = new Date(req.body.policyNSDate);
        let sailPolicyNo = req.body.sailPolicyNo;
        let ciPolicyNo = req.body.ciPolicyNo;
        let db = new Db("update", {
            "update" : {
                "table" : "order",
                "method" : "update",
                "param" : [{
                    "audit_return_code" : applNo
                }, {
                    "$set" : {
                        "compulsoryPolicyNo": sailPolicyNo || "",
                        "commercePolicyNo": ciPolicyNo || "",
                        "compulsoryPolicyDate": policyNSDate,
                        "commercePolicyDate": policyNSDate
                    }
                }],
                "fun" : (rs, go) => {
                    go()
                }
            }
        });
        db.on("err", err => {
            process.nextTick(() => {
                console.log(err);
                res.push({
                    "flag" : "发生异常：" + err.message
                });
            });
        });
        db.on("end", () => {
            res.push({
                "flag" : "0000"
            });
        });
        db.start();
    });
}