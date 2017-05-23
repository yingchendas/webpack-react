"use strict"
require("../utilities/StringUtils");

let order_list = {
    "1": {
        "name": "等待核保",
        "des": "未核保"
    },
    "2": {
        "name": "待支付",
        "des": ""
    },
    "3": {
        "name": "补充资料",
        "des": "支付过后审核不通过"
    },
    "4": {
        "name": "上传证件",
        "des": "后台上传证件照不清晰"
    },
    "5": {
        "name": "待出单",
        "des": ""
    },
    "6": {
        "name": "已生效",
        "des": ""
    },
    "7": {
        "name": "人工处理",
        "des": ""
    },
    "81": {
        "name": "已失效(后台超时)",
        "des": "后台人工算价超时"
    },
    "82": {
        "name": "已失效(算价失败)",
        "des": "后台算价失败"
    },
    "83": {
        "name": "已失效(取消)",
        "des": "待支付，客户取消"
    },
    "84": {
        "name": "已失效(支付超时)",
        "des": "待支付，超时"
    },
    "85": {
        "name": "已失效(待出单退单)",
        "des": "待出单，退单"
    },
    "86": {
        "name": "已失效(已生效退单)",
        "des": "已生效，退单"
    },
    "87": {
        "name": "已失效(重新核保自动取消)",
        "des": "客户重新算价，系统自动取消"
    },
    "9": {
        "name": "人工算价成功",
        "des": "后台人工算价成功后"
    }

};


exports.order_list = order_list;

exports.exist = (code) => {
    let l = {};
    if (code && code instanceof Array) {
        code.forEach(c => {
            if (order_list[c])
                l[c] = order_list[c]
        })
        return l;
    } else if (code && order_list[code]) {
        return l[code] = order_list[code]
    } else {
        return order_list;
    }
};

exports.show_client = (code) => {
    for(let k in order_list){
        if(k === code){
            if(code.startWith('8')){
                return "已失效";
            }
            return order_list[code].name;
        }
    }
    return "";
};
