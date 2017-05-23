/**
 * Created by lein on 2017/2/23.
 */
"use strict";

const MongoDb = require('../../utilities/event-mongodb-datasource');
const crypto = require('crypto');
const querystring = require('querystring');

module.exports = router => {

    let findThirdparty = function (appid, fn) {
        let thirdparty;
        let db = new MongoDb('find', {
            find: {
                table: 'thirdparty',
                method: 'findOne',
                param: () => {
                    return {
                        appid: appid,
                        type: 'alipay'
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

    router.post('/alipay/event_order', (req, res) => {
        let b = req.body;

        let sign_type = b.sign_type;
        let sign = b.sign;

        delete b.sign_type;
        delete b.sign;

        findThirdparty(b.app_id, thirdparty => {
            if (thirdparty) {
                let tmp = {};
                Object.keys(b).sort().forEach(t => {
                    if (b[t]) tmp[t] = b[t]
                })
                let encryptStr = querystring.stringify(tmp, "&", "=", {
                    encodeURIComponent: t => t
                });
                let verifier = crypto.createVerify('RSA-SHA256')
                verifier.update(encryptStr);
                if (verifier.verify(thirdparty.alipay_public_key, sign, 'base64') && (b.trade_status == 'TRADE_SUCCESS' || b.trade_status == 'TRADE_FINISHED')) {
                    let oldOrder;
                    let mongodb = new MongoDb('update', {
                        update: {
                            table: 'order',
                            method: 'findOneAndUpdate',
                            param: [{
                                code: b.out_trade_no,
                                status: {
                                    $in: ["2", "9"]
                                }
                            }, {
                                $set: {
                                    alipay: b,
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
                                    order_code: b.out_trade_no,
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

                    mongodb.on('err', err => {
                        process.nextTick(function () {
                            throw err;
                        })
                    });


                    mongodb.on('end', () => {
                        res.push('success');
                    });

                    mongodb.start();
                } else {
                    res.push('error')
                }
            } else {
                res.push('error')
            }
        })

    });
};