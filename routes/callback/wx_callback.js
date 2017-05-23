/**
 * Created by lein on 2017/2/23.
 */
"use strict";

const xml2js = require('xml2js');
const MongoDb = require('../../utilities/event-mongodb-datasource');
const Pay = require('../../utilities/weixin/pay');

module.exports = router => {

    let findThirdparty = function (appid, mch_id, fn) {
        let thirdparty;
        let db = new MongoDb('find', {
            find: {
                table: 'thirdparty',
                method: 'findOne',
                param: () => {
                    return {
                        appid: appid,
                        protal_code: mch_id,
                        type:'wx'
                    }
                },
                fun: (rs, go) => {
                    thirdparty = rs;
                    go();
                }
            }
        });

        db.on('err', err => {
            db.on('err', err => {
                process.nextTick(function () {
                    throw err;
                })
            });
        });

        db.on('end', () => {
            fn(thirdparty);
        })

        db.start();


    };
    router.post('/wx/event_order', (req, res) => {
        let t = undefined;

        req.on('data', data => {
            if (t) {
                t = Buffer.concat([d, data], d.length + data.length);
            } else {
                t = data;
            }
        });

        req.on('end', () => {
            xml2js.parseString(t, {explicitArray: false, explicitRoot: false}, (err, rs) => {
                findThirdparty(rs.appid, rs.mch_id, thirdparty => {
                    let sign = rs.sign;
                    delete rs.sign;
                    if (thirdparty && sign === Pay.sign(rs, {
                            key: thirdparty.pay_key
                        }) && rs.return_code == 'SUCCESS' && rs.result_code == 'SUCCESS') {
                        let oldOrder;
                        let db = new MongoDb('update', {
                            update: {
                                table: 'order',
                                method: 'findOneAndUpdate',
                                param: [{
                                    code: rs.out_trade_no,
                                    status: {
                                        $in: ["2", "9"]
                                    }
                                }, {
                                    $set: {
                                        wx_pay: rs,
                                        status: "5"
                                    }
                                }],
                                fun: (rs, go) => {
                                    oldOrder = rs.value;
                                    if (oldOrder)
                                        go('order_status');
                                    else
                                        go()
                                }
                            },
                            order_status: {
                                table: 'order_logs',
                                method: 'insert',
                                param: () => {
                                    return {
                                        order_code: rs.out_trade_no,
                                        before_status: oldOrder.status,
                                        after_status: '5',
                                        operating_time: new Date()
                                    }
                                },
                                fun: (rs, go) => {
                                    go();
                                }
                            }
                        });

                        db.on('err', err => {
                            process.nextTick(function () {
                                throw err;
                            })
                        });


                        db.on('end', () => {
                            res.end("<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>");
                        });

                        db.start();
                    } else {
                        res.push('')
                    }
                })
            })
        });
    });
}