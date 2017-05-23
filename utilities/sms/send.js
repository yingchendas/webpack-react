/**
 * Created by lein on 2017/2/27.
 */
"use strict";


let TopClient = require('./topClient').TopClient;

let send = function (data, fn) {
    var client = new TopClient({
        'appkey': '23419810',
        'appsecret': 'd6e026452ed3d01e404802e0db57fd8d',
        'REST_URL': 'http://gw.api.taobao.com/router/rest'
    });

    client.execute('alibaba.aliqin.fc.sms.num.send', {
        'sms_type': 'normal',
        'sms_free_sign_name': 'U惠保',
        'sms_param': '{\"code\":\"' + data.random + '\"}',
        'rec_num': data.mobile,
        'sms_template_code': 'SMS_52495038'
    }, function (error, response) {
        if (!error)
            fn();
        else
            fn(error);
    })
}

exports.send = send;