"use strict";
let querystring = require('querystring');
let https = require('https');

let send = (param, callback) => {
    if(param.method){
        param.method = param.method.toUpperCase();
    }else{
        param.method = "GET";
    }

    let headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length':param.buffer ? new Buffer(param.data).length:new Buffer(JSON.stringify(param.data)).length
    };

    if(param.headers){
        for(let header in param.headers){
            headers[header] = param.headers[header];
        }
    }

    let config = {
        "hostname" : param.host,
        "port" : param.port || 80,
        "path" : param.path || "/",
        "method" : param.method,
        "headers" : headers
    };

    if(param.method == "GET"){
        config.path += ('?' + querystring.stringify(param.data));
        delete config.headers["Content-Length"];
    }

    let req = https.request(config, res => {
        if (res.statusCode == 200) {
            res.setEncoding('UTF8');
        }
        var d = ''
        res.on('data', function (data) {
            d += data;
        });

        res.on('end', function () {
            if (res.statusCode == 200) {
                callback(null, d);
            } else {
                var err = new Error(d);
                callback(err, null);
            }
        });
    });

    req.on('error', function (err) {
        callback(err, null);
    });

    if(param.method == "POST"){
        if(param.buffer)
            req.write(new Buffer(param.data))
        else
            req.write(JSON.stringify(param.data));
    }else{
        req.write('\r\n');
    }
    req.end();
};

exports.send = send;