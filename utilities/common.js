/**
 * Created by Lein on 16/9/20.
 */
"use strict";

const util = require('util');
const assert = require('assert');

let page = (result, count, nonce, num) => {

    if (count === 0) {
        return {
            result: [],
            count: 0,
            nonce: 1,
            nonceNum: 0,
            max: 1,
            num: num,
            top: 1,
            end: 1,
            up: false,
            next: false,
            pageGroup: [1]
        };
    } else {
        var t = count / num;
        var p = parseInt(t);
        if (t > p) {
            p++;
        }
        var pageGroup = [];
        if (p <= 11)
            for (let i = 1; i <= p; i++)
                pageGroup.push(i);
        else if (nonce <= 6)
            for (let i = 1; i <= 11; i++)
                pageGroup.push(i);
        else if (nonce >= (p - 6)) {
            for (let i = p - 10; i <= p; i++)
                pageGroup.push(i);
        } else {
            for (let i = ~~nonce - 5; i <= ~~nonce + 5; i++) {
                pageGroup.push(i);
            }
        }
        return {
            result: result,
            count: count,
            nonce: nonce,
            nonceNum: result.length,
            max: p,
            num: num,
            top: 1,
            end: p,
            up: nonce !== 1,
            next: nonce !== p,
            pageGroup: pageGroup
        };
    }
};

let _validate = (data, vali) => {
    let pass = true;
    if (vali !== 'notnull' && !data) {
        return true;
    } else if (typeof vali === 'function') {
        return vali(data)
    } else if (util.isArray(vali)) {
        let v = true
        vali.every(d => {
            if (d == data) {
                return v = false
            } else
                return v = true;
        });
        return !v
    }
    switch (vali) {
        case 'notnull':
            pass = !!data;
            break;
        case 'number':
            pass = data.toString().isFloat();
            break;
        case 'int':
            pass = data.toString().isInt();
            break;
        case 'id':
            pass = data.toString().isId();
            break;
        case 'time':
            pass = data.toString().isTime();
            break;
        case 'date':
            pass = data.toString().isDate();
            break;
        case 'mobile':
            pass = data.toString().isMobile();
            break;
        default:
            pass = new RegExp(vali).test(data.toString());
            break;
    }

    return pass;
};

let validate = (data, vali, fn) => {
    let pass = true;
    let key;
    Object.keys(vali).every(i => {
        let v = vali[i];
        if (util.isArray(v)) {
            v.every(j => {
                if (!util.isArray(data[i])) {
                    pass = _validate(data[i], j)
                    return !pass
                }else {
                    data[i].every(k => {
                        pass = _validate(k, j);
                        return !pass;
                    });
                    return !pass;
                }
            });
            if (!pass) {
                key = i;
                console.log("FORM VALIDATE - " + i + " ERROR")
            }
            return pass;
        } else {
            if (!util.isArray(data[i])) {
                pass = _validate(data[i], vali[i]);
                if (!pass) {
                    key = i;
                    console.log("FORM VALIDATE - " + i + " ERROR")
                }
                return pass;
            } else {
                data[i].every(j => {
                    return pass = _validate(j, vali[i]);
                });
                if (!pass) {
                    key = i
                    console.log("FORM VALIDATE - " + i + " ERROR")
                }
                return pass;
            }
        }
    });
    console.log("FORM VALIDATE - " + pass)

    if (fn) {
        fn(key)
    } else {
        // assert.ok(pass, message || '参数错误')
        if (!pass) {
            let err = new Error('参数错误');
            err.status = 400;
            throw err;
        }
    }
};

let validate2 = (data, vali, fn) => {
    let pass = true;
    let key = [];
    Object.keys(vali).forEach(i => {
        let v = vali[i];
        if (util.isArray(v)) {
            v.forEach(j => {
                if (!util.isArray(data[i])) {
                    pass = _validate(data[i], j);
                    if (!pass) {
                        key.push(i)
                    }
                } else {
                    let t = false;
                    data[i].forEach(k => {
                        pass = t = _validate(k, j);
                    });
                    if (!t) {
                        key.push(i)
                    }
                }
            });
        } else {
            if (!util.isArray(data[i])) {
                pass = _validate(data[i], vali[i]);
                if (!pass) {
                    key.push(i)
                }
            } else {
                data[i].forEach(j => {
                    pass = _validate(j, vali[i]);
                    if (!pass) {
                        key.push(i)
                    }
                });
                return pass;
            }
        }
    });

    fn(key.length === 0, key)
};

exports.page = page;
exports.validate = validate;
exports.validate2 = validate2;

