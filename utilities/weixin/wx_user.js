/**
 * Created by Lein on 16/9/6.
 */
"use strict";

const request = require('request');
const url = require('url');

let accessToken = function (code, fn) {
    let requestURL = url.format({
        protocol: 'https',
        hostname: 'api.weixin.qq.com',
        port: 443,
        pathname: '/sns/oauth2/access_token',
        query: {
            appid: code.appid,
            secret: code.secret,
            code: code.code,
            grant_type: 'authorization_code'
        }
    });
    request.get(requestURL, (error, res, body) => {
        if (error) {
            fn(error)
        } else if (res.statusCode !== 200) {
            let err = new Error('微信授权获取失败')
            fn(err);
        } else {
            let rs = JSON.parse(body);
            fn(null, rs)
        }
    });
}

let userInfo = function (access_token, openid, fn) {

    let requestURL = url.format({
        protocol: 'https',
        hostname: 'api.weixin.qq.com',
        port: 443,
        pathname: '/sns/userinfo',
        query: {
            access_token: access_token,
            openid: openid,
        }
    });

    request.get(requestURL, (error, res, body) => {
        if (error) {
            fn(error)
        } else if (res.statusCode !== 200) {
            let err = new Error('获取用户信息失败')
            fn(err);
        } else {
            let rs = JSON.parse(body);
            fn(null, rs)
        }
    });

};

exports.accessToken = accessToken;
exports.userInfo = userInfo;