/**
 * Created by Lein on 16/9/5.
 */
"use strict";

const querystring = require('querystring');
const url = require('url')

exports.build = function (path, snsapi, appid, channel) {
    return url.format({
        protocol: 'https',
        host: 'open.weixin.qq.com',
        pathname: '/connect/oauth2/authorize',
        search: querystring.stringify({
            appid: appid,
            redirect_uri: path,
            response_type: 'code',
            scope: snsapi,
            state: channel
        }),
        hash: 'wechat_redirect'
    })
};