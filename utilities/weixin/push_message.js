/**
 * Created by Lein on 2016/10/15.
 */
"use strict";

const httpRequest = require('../http_request');
const tokens = require('./Tokens');

exports.push = function (id, message, fn) {

    httpRequest.send({
        method: 'POST',
        hostname: 'api.weixin.qq.com',
        path: '/cgi-bin/message/custom/send?access_token=' + tokens.getToken(),
        content: new Buffer(JSON.stringify({
            touser: id,
            msgtype: 'text',
            text: {
                content: message
            }
        }))
    }, fn);
}
//
// httpRequest.send({
//     method: 'POST',
//     hostname: 'api.weixin.qq.com',
//     path: '/cgi-bin/material/batchget_material?access_token=i1_xsbE6WpbYX5WKDKvNNvW5UkusO6L_MSOtS6eDzz0symxl2iHVVqpA0eQCnHIuUw3qbyXxcUaIBQ3aXOYlCaRinf1LrzNmwM4zJALRjd2F9ca0bPkSPRikDSSyQxscYZTeAGATUO',
//     content: new Buffer(JSON.stringify({
//         "type":'news',
//         "offset":0,
//         "count":10
//     }))
// }, (err,rs)=>{
//     console.log(err)
//     console.log(rs)
// });

