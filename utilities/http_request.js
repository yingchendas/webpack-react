"use strict";
let querystring = require('querystring');
let http = require('http');

let send = function (data, fn) {
    let headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length':data.buffer? new Buffer(data.param).length:new Buffer(JSON.stringify(data.param)).length
    };

    if (data.headers) {
        for (let header in data.headers) {
            headers[header] = data.headers[header];
        }
    }

    if (data.method == 'GET') {
        data.path += ('?' + querystring.stringify(data.param));
        delete headers['Content-Length'];
    }
    let config = {
        hostname: data.hostname,
        port: data.port ? data.port : 80,
        path: data.path,
        method: data.method,
        headers: headers
    }
    let req = http.request(config, function (res) {
        if (res.statusCode == 200) {
            res.setEncoding('UTF8');
        }
        var d = ''
        res.on('data', function (data) {
            d += data;
        });

        res.on('end', function () {
            if (res.statusCode == 200) {
                fn(null, d);
            } else {
                var err = new Error(d);
                fn(err, null);
            }
        });
    });

    // req.setTimeout(1000,function () {
    //     console.log("timeout")
    // })

    req.on('error', function (err) {
        fn(err, null);
    });

    if (data.method == 'POST') {
        if(data.buffer)
            req.write(new Buffer(data.param))
        else
            req.write(JSON.stringify(data.param));
    } else {
        req.write('\r\n');
    }
    req.end();
};

exports.send = send;