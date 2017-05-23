/**
 * Created by lein on 2017/1/22.
 */
"use strict";

const Mongodb = require('../../utilities/event-mongodb-datasource');
const ObjectId = require('mongodb').ObjectId;
const wxPay = require('../../utilities/weixin/pay');
const entity = require('../../utilities/weixin/Entity');
const Pay = entity.Pay;
const AliPay = require('../../utilities/alipay/Pay');
const application = require('../../application.json');
const wx_user = require('../../utilities/weixin/wx_user');
const loginURL = require('../../utilities/weixin/loginURL');

let is_direct = function (channel, pay_type, order) {
    let pay_company = channel.ent_conf.filter(t => t.company === order.bx_detail.audit.productCode)[0];
    if (!pay_company || order.total_money !== order.bx_detail.result.discountTotalPremium) {
        return false
    } else {
        switch (order.bx_detail.audit.productCode) {
            case 'CHAC':
                if (['zfb', 'yb-pc', 'yb-app'].indexOf(pay_type) === -1)
                    return false;
                return typeof pay_company.isDirect === 'boolean' ? pay_company.isDirect : (pay_company.isDirect === 'true' ? true : false)
            default:
                return false;
        }
    }
}

module.exports = router => {
    router.get('/checkEnv/:orderCode', (req, res) => {
        let order;
        let findThirdparty = (id, fn) => {
            let thirdparty;
            let db = new Mongodb('find', {
                find: {
                    table: 'thirdparty',
                    method: 'findOne',
                    param: () => {
                        return {
                            _id: ObjectId(id)
                        }
                    },
                    fun: (rs, go) => {
                        thirdparty = rs;
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
                if (thirdparty)
                    fn(thirdparty)
                else
                    process.nextTick(() => {
                        throw new Error('第三方接口不存在');
                    })
            });

            db.start();
        }
        let run = () => {
            switch (order.pay_type) {
                case 'wx':
                    let payObj = req.session.channel.pay_ways.filter(e => e.payName === 'wx' && e.payType === '1')[0];

                    // if (req.session.channel.pay_type.indexOf('wx') !== -1 && req.session.channel.pay_name === req.session.channel.login_name) {
                    if (payObj && payObj.payId === req.session.channel.login_name) {
                        findThirdparty(req.session.channel.login_name, thirdparty => {

                            let wx_conf = {
                                appid: thirdparty.appid,
                                mch_id: thirdparty.protal_code,
                                key: thirdparty.pay_key
                            };
                            let payConfig = new Pay("保险购买", order.code, process.env.NODE_ENV === 'pro' ? ~~(order.total_money * 100) : 1, '127.0.0.1', application[process.env.NODE_ENV || 'dev'].domainName + application[process.env.NODE_ENV || 'dev'].root_path.callback + '/wx/event_order', req.session.user.wx_user.openid, wx_conf, 'JSAPI');
                            wxPay.unifiedorder(payConfig, wx_conf, (err, rs) => {
                                if (err) {
                                    process.nextTick(() => {
                                        throw err;
                                    })
                                } else {
                                    let payData = {
                                        appId: thirdparty.appid,
                                        timeStamp: ~~(new Date().getTime() / 1000),
                                        nonceStr: String.uuid(),
                                        package: "prepay_id=" + rs.prepay_id,
                                        signType: 'MD5'
                                    };
                                    payData.paySign = wxPay.sign(payData, wx_conf);
                                    res.jade('client/wxClientPay', {
                                        prepay_id: rs.prepay_id,
                                        thirdparty: thirdparty._id,
                                        payData: payData,
                                        orderCode: order.code,
                                        channel: req.session.channel.code
                                    });
                                }
                            })
                        });
                    } else if (payObj) {
                        findThirdparty(payObj.payId, thirdparty => {
                            res.redirect(loginURL.build(application[process.env.NODE_ENV || 'dev'].domainName + application[process.env.NODE_ENV || 'dev'].root_path.pay + '/wx/otherpay/' + order.code, 'snsapi_base', thirdparty.appid))
                        });
                    }
                    break;
                case 'zfb':
                    console.log('111111')
                    let alipayObj = req.session.channel.pay_ways.filter(e => e.payName === 'zfb' && e.payType === '1')[0];
                    // if (req.session.channel.pay_type.indexOf('zfb') !== -1) {
                    if (alipayObj && !is_direct(req.session.channel, 'zfb', order)) {
                        let aplipayConf;
                        let db = new Mongodb('find', {
                            find: {
                                table: 'thirdparty',
                                method: 'findOne',
                                param: {
                                    _id: ObjectId(alipayObj.payId)
                                },
                                fun: (rs, go) => {
                                    aplipayConf = rs;
                                    go();
                                }
                            }
                        });

                        db.on('err', err => {
                            throw err;
                        });

                        db.on('end', () => {
                            if (aplipayConf) {
                                let url = new AliPay('pay', aplipayConf.appid, {
                                    subject: '保险购买：' + order.code,
                                    code: order.code,
                                    amount: order.total_money,
                                    channel: order.channel.code
                                }, aplipayConf.alipay_key).build();
                                res.redirect(url)
                            } else {
                                res.jade('client/checkEnv', {
                                    orderCode: req.params.orderCode
                                })
                            }
                        });

                        db.start();
                    } else if (alipayObj && is_direct(req.session.channel, 'zfb', order)) {
                        switch (order.bx_detail.audit.productCode) {
                            case 'CHAC':
                                let pt = 2;
                                res.jade('client/checkEnv', {
                                    direct: order.bx_detail.audit.productCode,
                                    orderCode: order.bx_detail.result.policyNo,
                                    payType: 2,
                                    payAmt:order.total_money
                                });
                                break;
                            default:
                                res.jade('client/checkEnv', {
                                    orderCode: req.params.orderCode
                                })
                                break;
                        }

                    } else {
                        res.jade('client/checkEnv', {
                            orderCode: req.params.orderCode
                        })
                    }
                    break;
                default:
                    res.jade('client/checkEnv', {
                        orderCode: req.params.orderCode
                    });
                    break;
            }
        };

        let db = new Mongodb('query', {
            query: {
                table: 'order',
                method: 'findOne',
                param: {
                    code: req.params.orderCode,
                    user_id: req.session.user._id,
                    status: {
                        $in: ['2', '9']
                    }
                },
                fun: (rs, go) => {
                    order = rs;
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
            if (order) {
                run();
            } else {
                process.nextTick(() => {
                    throw new Error('订单不存在')
                })
            }
        });

        db.start();
    });

    router.get('/wx/otherpay/:orderCode', (req, res) => {

        let findThirdparty = (id, fn) => {
            let thirdparty;
            let order;
            let db = new Mongodb('find', {
                find: {
                    table: 'thirdparty',
                    method: 'findOne',
                    param: () => {
                        return {
                            _id: ObjectId(id)
                        }
                    },
                    fun: (rs, go) => {
                        thirdparty = rs;
                        if (thirdparty) {
                            go('order')
                        } else {
                            go();
                        }
                    }
                },
                order: {
                    table: 'order',
                    method: 'findOne',
                    param: {
                        code: req.params.orderCode,
                        user_id: req.session.user._id
                    },
                    fun: (rs, go) => {
                        order = rs;
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
                if (thirdparty && order)
                    fn(thirdparty, order)
                else
                    process.nextTick(() => {
                        throw new Error('第三方接口不存在');
                    })
            });

            db.start();
        }

        let payObj = req.session.channel.pay_ways.filter(e => e.payName === 'wx' && e.payType === '1')[0];
        if (payObj) {
            findThirdparty(payObj.payId, (thirdparty, order) => {
                wx_user.accessToken({
                    code: req.query.code,
                    appid: thirdparty.appid,
                    secret: thirdparty.app_secret
                }, (err, access_token) => {
                    if (err) {
                        process.nextTick(() => {
                            throw err;
                        })
                    } else {
                        if (access_token.access_token) {
                            let openid = access_token.openid;


                            let wx_conf = {
                                appid: thirdparty.appid,
                                mch_id: thirdparty.protal_code,
                                key: thirdparty.pay_key
                            };
                            // ~~(order.bx_detail.result.discountTotalPremium * 100)
                            console.error(~~(order.total_money * 100))
                            let payConfig = new Pay("保险购买", order.code, ~~(order.total_money * 100), '127.0.0.1', application[process.env.NODE_ENV || 'dev'].domainName + application[process.env.NODE_ENV || 'dev'].root_path.callback + '/wx/event_order', openid, wx_conf, 'JSAPI');
                            wxPay.unifiedorder(payConfig, wx_conf, (err, rs) => {
                                if (err) {
                                    process.nextTick(() => {
                                        throw err;
                                    })
                                } else {
                                    let payData = {
                                        appId: thirdparty.appid,
                                        timeStamp: ~~(new Date().getTime() / 1000),
                                        nonceStr: String.uuid(),
                                        package: "prepay_id=" + rs.prepay_id,
                                        signType: 'MD5'
                                    };
                                    payData.paySign = wxPay.sign(payData, wx_conf);
                                    res.jade('client/wxClientPay', {
                                        prepay_id: rs.prepay_id,
                                        thirdparty: thirdparty._id,
                                        payData: payData,
                                        orderCode: req.params.orderCode,
                                        channel: req.session.channel.code
                                    });
                                }
                            })
                        } else {
                            process.nextTick(() => {
                                throw new Error('获取微信授权失败')
                            })
                        }
                    }
                });
            });
        } else {
            process.nextTick(() => {
                throw new Error('不支持该支付方式')
            })
        }

    });
}