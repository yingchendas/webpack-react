"use strict"

let banner_type = {
    "index": {
        "name":"首页图片",
        "type": 1
    },
    "search": {
        "name":"查询页图片",
        "type": 2
    }
};


exports.banner_type = banner_type;

exports.exist = (code) => {
    let l = {};
    if (code && code instanceof Array) {
        code.forEach(c => {
            if (banner_type[c])
                l[c] = banner_type[c]
        })
        return l;
    } else if (code && banner_type[code]) {
        return l[code] = banner_type[code]
    } else {
        return banner_type;
    }
};

//
// const path = require('path')
//
// console.log(path.join(__dirname, './har/rsa_private_key.pem'));