/**
 * Created by lein on 2017/2/22.
 */
"use strict";
const querystring = require('querystring');
const url = require('url');
const crypto = require('crypto');
const request = require('request');
const application = require('../../application.json');

let env = application[process.env.NODE_ENV || 'dev'];
let alipay_env = {
    test: 'https://openapi.alipaydev.com/gateway.do',
    pro: 'https://openapi.alipay.com/gateway.do'
};
let alipay_url = (() => {
    switch (process.env.NODE_ENV) {
        case 'pro':
            return url.parse(alipay_env.pro);
        default:
            return url.parse(alipay_env.test);
    }
})();

let encryptStr = function (data) {
    let tmp = {};
    Object.keys(data).sort().forEach(t => {
        if (data[t]) tmp[t] = data[t]
    })
    let encryptStr = querystring.stringify(tmp, "&", "=", {
        encodeURIComponent: t => t
    });
    return encryptStr;
};

let Pay = function (type, appid, data, private_key, public_key) {
    this.type = type;
    this.appid = appid;
    this.data = data;
    this.private_key = private_key;
    this.public_key = public_key;
};

Pay.prototype.build = function (fn) {
    let self = this;
    let config;
    switch (self.type) {
        case 'pay':
            config = self.requestPayConfig();
            break;
        default:
            config = self.requestQueryConfig()
    }

    let signStr = encryptStr(config.query);
    let sign = crypto.createSign('RSA-SHA256')
    sign.update(signStr);
    let s = sign.sign(self.private_key, 'base64')
    config.query.sign = s;
    if (self.type == 'pay') {
        return url.format(config);
    } else {
        request.get(url.format(config), (err, response, body) => {
            if (err)
                fn(err)
            else {
                let rs = JSON.parse(body);
                let signStr = JSON.stringify(rs.alipay_trade_query_response);
                let verifier = crypto.createVerify('RSA-SHA256')
                verifier.update(signStr);
                if (verifier.verify(self.public_key, rs.sign, 'base64')) {
                    fn(null, rs.alipay_trade_query_response)
                } else {
                    fn(new Error('支付宝签名验证失败'))
                }

            }
        })
    }
}

Pay.prototype.requestPayConfig = function () {
    let self = this;
    return {
        protocol: alipay_url.protocol,
        hostname: alipay_url.hostname,
        pathname: alipay_url.pathname,
        query: {
            app_id: self.appid,
            method: 'alipay.trade.wap.pay',
            charset: 'utf-8',
            sign_type: 'RSA2',
            timestamp: new Date().toFormat('YYYY-MM-DD HH24:MI:SS'),
            version: '1.0',
            return_url: env.domainName + env.root_path.client + '/' + self.data.channel + '/buy/orderCheck/' + self.data.code,
            notify_url: application[process.env.NODE_ENV || 'dev'].domainName + application[process.env.NODE_ENV || 'dev'].root_path.callback + '/alipay/event_order',
            biz_content: JSON.stringify({
                subject: self.data.subject,
                out_trade_no: self.data.code,
                total_amount: self.data.amount,
                product_code: 'QUICK_WAP_PAY'
            })
        }
    };
};

Pay.prototype.requestQueryConfig = function () {
    let self = this;
    return {
        protocol: alipay_url.protocol,
        hostname: alipay_url.hostname,
        pathname: alipay_url.pathname,
        query: {
            app_id: self.appid,
            method: 'alipay.trade.query',
            charset: 'utf-8',
            sign_type: 'RSA2',
            timestamp: new Date().toFormat('YYYY-MM-DD HH24:MI:SS'),
            version: '1.0',
            biz_content: JSON.stringify({
                out_trade_no: self.data.code
            })
        }
    };
};

module.exports = Pay
// const Db = require('../event-mongodb-datasource');
// require('../StringUtils')
// let aplipayConf;
// let db = new Db('find', {
//     find: {
//         table: 'thirdparty',
//         method: 'findOne',
//         param: {
//             type: 'alipay'
//         },
//         fun: (rs, go) => {
//             aplipayConf = rs;
//             console.log(rs)
//             go();
//         }
//     }
// });
//
// db.on('err', err => {
//     throw err;
// });
//
// db.on('end', () => {
//     try {
//         new Pay('query', aplipayConf.appid, {
//             subject: '测试订单',
//             code: 'BX201702220103',
//             amount: 0.01
//         }, aplipayConf.alipay_key, aplipayConf.alipay_public_key).build((err, body) => {
//             console.log(body)
//         });
//     } catch (e) {
//         console.trace(e)
//     }
// });
//
// db.start();


