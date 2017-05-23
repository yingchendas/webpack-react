/**
 * Created by Lein on 16/9/6.
 */
"use strict";

const querystring = require('querystring');
const config = require('./weixin_config.json');
const xml2js = require('xml2js');
const request = require('request');
const entity = require('./Entity');
const Pay = entity.Pay;
const QueryOrder = entity.QueryOrder;
const url = require('url')
require('../../utilities/StringUtils')

let sign = function (data, wx_conf) {
    let tmp = {};
    Object.keys(data).sort().forEach(t => {
        if (data[t]) tmp[t] = data[t]
    })
    tmp.key = wx_conf.key;
    let encryptStr = querystring.stringify(tmp, "&", "=", {
        encodeURIComponent: t => t
    });
    console.log(encryptStr)
    return String.md5(encryptStr).toUpperCase();
};

let unifiedorder = function (data, wx_conf, fn) {
    let tmp = {};
    Object.keys(data).sort().forEach(t => tmp[t] = data[t]);
    tmp.sign = sign(data, wx_conf);
    var builder = new xml2js.Builder({
        rootName: 'xml',
        xmldec: {
            'version': '1.0',
            'encoding': 'UTF-8'
        },
        cdata: true
    });

    console.log(tmp)
    let content = builder.buildObject(tmp);
    let requestURL = url.format({
        protocol: 'https',
        hostname: 'api.mch.weixin.qq.com',
        pathname: '/pay/unifiedorder'
    });

    request.post(requestURL, {
        body: new Buffer(content)
    }, (error, response, body) => {
        if (error) {
            fn(error)
        } else if (response.statusCode !== 200) {
            let err = new Error('创建微信订单失败')
            fn(err);
        } else {
            xml2js.parseString(body, {explicitArray: false, explicitRoot: false}, (err, rs) => {
                if (err) {
                    fn(err)
                } else {

                    let sign1 = rs.sign;
                    delete rs.sign;
                    if (sign(rs, wx_conf) === sign1) {
                        fn(null, {
                            prepay_id: rs.prepay_id
                        })
                    } else {
                        fn(new Error('微信订单验证失败'))
                    }
                }

            })
        }
    });

};

let queryorder = function (data, wx_conf, fn) {
    let tmp = {};
    Object.keys(data).sort().forEach(t => tmp[t] = data[t]);
    tmp.sign = sign(data, wx_conf);
    var builder = new xml2js.Builder({
        rootName: 'xml',
        xmldec: {
            'version': '1.0',
            'encoding': 'UTF-8'
        },
        cdata: true
    });


    let content = builder.buildObject(tmp);
    console.log(content)
    let requestURL = url.format({
        protocol: 'https',
        hostname: 'api.mch.weixin.qq.com',
        pathname: '/pay/orderquery'
    });

    request.post(requestURL, {
        body: new Buffer(content)
    }, (error, response, body) => {
        if (error) {
            fn(error)
        } else {
            xml2js.parseString(body, {explicitArray: false, explicitRoot: false}, (err, rs) => {
                if (err) {
                    fn(err)
                } else {
                    let sign1 = rs.sign;
                    delete rs.sign;
                    if (sign(rs, wx_conf) === sign1) {
                        fn(null, rs);
                    } else {
                        fn(new Error('微信订单查询验证失败'))
                    }
                }

            })
        }
    });
}
exports.unifiedorder = unifiedorder;
exports.sign = sign;
exports.queryorder = queryorder;
// let xml = '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg><appid><![CDATA[wxfa48d02cab97035a]]></appid><mch_id><![CDATA[1394972202]]></mch_id><nonce_str><![CDATA[7kp49tO4GrOodalI]]></nonce_str><sign><![CDATA[FB38FC06A6A8DCF0985F0197C418967C]]></sign><result_code><![CDATA[SUCCESS]]></result_code><prepay_id><![CDATA[wx201610071643108c1142d5650840934911]]></prepay_id><trade_type><![CDATA[JSAPI]]></trade_type></xml>'
// xml2js.parseString(xml, {explicitArray: false, explicitRoot: false}, (err, rs)=> {
//     let sign1 = rs.sign;
//     delete rs.sign;
//     console.log(sign(rs) === sign1)
// })

// unifiedorder(new Pay("啊啊", '1111', 11, '192.168.0.1', 'http://www.163.com', 'oGefAw-2TkNT_AqaNjtlaBJbRR2I'), (err, rs) => {
//     console.log(err)
//     console.log(rs)
// });

// queryorder(new QueryOrder('e12f71fe9f824e96a3405b211faf6c9e'), (err, rs)=> {
//     console.log(err)
//     console.log(rs)
// })
// unifiedorder(new Pay("测试", 'test00005', 1, '192.168.0.1', 'http://www.163.com', '', {
//     appid: 'wx7b00d82094197125',
//     mch_id: '1451375602',
//     key: 'db00ee40e94f41d4bfd94aef7f9b233a'
// }, 'APP'), {
//     appid: 'wx7b00d82094197125',
//     mch_id: '1451375602',
//     key: 'db00ee40e94f41d4bfd94aef7f9b233a'
// }, (err, rs) => {
//     console.log(err)
//     console.log(rs)
//
//     let appParamter = {
//         appid: 'wx7b00d82094197125',
//         partnerid: '1451375602',
//         prepayid: rs.prepay_id,
//         package: 'Sign=WXPay',
//         noncestr: String.uuid(),
//         timestamp: ~~(new Date().getTime() / 1000)
//     }
//
//     appParamter.sign = sign(appParamter, {
//         appid: 'wx7b00d82094197125',
//         mch_id: '1451375602',
//         key: 'db00ee40e94f41d4bfd94aef7f9b233a'
//     })
//
//     console.log(appParamter)
//
//
// });
// //appid=wx7b00d82094197125&body=测试&mch_id=1451375602&nonce_str=3c8d48c9375d4593860932df35c0f0c1&notify_url=http://www.163.com&out_trade_no=test00004&spbill_create_ip=192.168.0.1&total_fee=1&trade_type=APP&key=db00ee40e94f41d4bfd94aef7f9b233a
// // let obj = {
// //     appid: 'wx7b00d82094197125',
// //     body: '测试',
// //     mch_id: '1451375602',
// //     nonce_str: 'c07a01c0f8c04b838d08755613f73bc2',
// //     notify_url: 'http://www.163.com',
// //     openid: '',
// //     out_trade_no: 'test00003',
// //     spbill_create_ip: '192.168.0.1',
// //     total_fee: 1,
// //     trade_type: 'APP',
// //     sign: 'E3B64F7336FF557A3EDCC07DAB5CDFAD'
// // }
//
// // let data = {
// //     appid: 'wx7b00d82094197125',
// //     partnerid: '1451375602',
// //     prepayid: 'wx20170502145946b7d9b11e410684171578',
// //     package: 'Sign=WXPay',
// //     noncestr: '87f1be53b6b941b08dc9ce51cff0e74a',
// //     timestamp: 1493708386,
// //     sign: '5BAA622C2E84846C319D9B4FF12ABE6E'
// // }
//
// // let tmp = {};
// // Object.keys(data).sort().forEach(t => tmp[t] = data[t]);
// // tmp.sign = sign(data, {
// //     appid: 'wx7b00d82094197125',
// //     mch_id: '1451375602',
// //     key: 'db00ee40e94f41d4bfd94aef7f9b233a'
// // });
//
// // let encryptStr = querystring.stringify(data, "&", "=", {
// //     encodeURIComponent: t => t
// // });
//
// //{ prepay_id: 'wx2017050214005361b051d1e70259129236' }
// // console.log('weixin://wap/pay?' + encryptStr)
// // console.log('weixin://wap/pay?' + encodeURIComponent(encryptStr))