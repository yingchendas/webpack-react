const request = require('request');
const url = require('url');
const application = require('../application.json');
const util = require('util');
const querystring = require('querystring')
const crypto = require('crypto');

exports.encode  = function(body,publickey,privatekey){
    let tmp = {}
    Object.keys(body).sort().forEach(i => {
        if(body[i]){
            tmp[i] = body[i];
        }

    });
    let ecstr = querystring.stringify(tmp, null, null, {
        encodeURIComponent: function (e) {
            return e;
        }
    });

    let hmacSha1 = crypto.createHmac('sha1', privatekey);
    hmacSha1.update(ecstr);
    let code = hmacSha1.digest('hex');
    return {
        auth:code,
        key:publickey
    }
};