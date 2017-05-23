"use strict"

let company_list = (() => {
    return {
        "TPCX": {
            "name": "太平车险",
            "icon": ""
        },
        "RBCX": {
            "name": "人保车险",
            "icon": ""
        },
        "PAZYCX": {
            "name": "平安车险",
            "icon": ""
        },
        "JTCX": {
            "name": "锦泰车险",
            "icon": ""
        },
        "CHAC": {
            "name": "诚泰车险",
            "icon": ""
        }
    }
});


exports.company_list = company_list;

exports.exist = (code) => {
    let l = {};
    let t = company_list()
    if (code && code instanceof Array) {
        code.forEach(c => {
            if (t[c])
                l[c] = t[c]
        })
        return l;
    } else if (code && t[code]) {
        return l[code] = t[code]
    } else {
        return t;
    }
};

exports.getNameByCode = code => {
    let t = company_list()
    if (t[code]) {
        return t[code].name;
    }
    return "";
};
