"use strict";

const uuid = require('node-uuid');
const mime = require('mime');
const crypto = require('crypto');
const insurance_company = require('./insurance_company');

require('date-utils');


global.company_list = insurance_company.company_list();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

String.prototype.endWith = function (reg) {
    return new RegExp(reg + '$').test(this);
};

String.prototype.startWith = function (reg) {
    return new RegExp('^' + reg).test(this);
};

String.prototype.isMobile = function () {
    return new RegExp('^1[0-9]{10}$').test(this);
};

String.prototype.isAge = function () {
    return new RegExp('^[0-9]{1,2}$').test(this);
};

String.prototype.isInt = function () {
    return new RegExp('^[0-9]+$').test(this);
};

String.prototype.isFloat = function () {
    return new RegExp('^[0-9]+(\.[0-9]+)?$').test(this);
};

String.prototype.isId = function () {
    return new RegExp('^[0-9a-zA-Z]{24}$').test(this);
};

String.prototype.isDate = function () {
    return new RegExp('^[0-9]{4}-[0-1]{1}[0-9]{1}-[0-3]{1}[0-9]{1}$').test(this);
};

String.prototype.isTime = function () {
    return new RegExp('^[0-9]{4}-[0-1][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]$').test(this);
};

String.prototype.isToken = function () {
    return new RegExp('^[0-9a-zA-Z]{32}$').test(this);
};

String.prototype.isTokens = function () {
    return new RegExp('^[0-9a-zA-Z]{32}(,[0-9a-zA-Z]{32})*$').test(this);
};

String.prototype.postfix = function () {
    return this.substring(this.lastIndexOf('.'));
};

String.prototype.pathMatcher = function (matcher) {
    String.pathMatcher(matcher, this);
}

String.prototype.isEmail = function () {
    return new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/).test(this)
}
String.pathMatcher = function (matcher, path) {
    var t = matcher.replace(/\/\*\*$/, '(\/\\w*\/?)*(.\\w*)?').replace(/\/\*\*/g, '(\/\\w*\/?)*').replace(/(\/\*)/g, '\/\\w*').replace(/\./g, '\\.');
    return new RegExp('^' + t + '$').test(path);
}

String.uuid = function () {
    return uuid.v4().replace(/-/g, '');
};

String.contentType = function (filename) {
    return mime.lookup(filename);
};

String.md5 = function (source) {
    let md5 = crypto.createHash('md5');
    md5.update(source);
    return md5.digest('hex')
};

String.sha1 = function (source) {
    let sha1 = crypto.createHash('sha1');
    sha1.update(source);
    return sha1.digest('hex')
};

String.randomStr = function (len) {
    let t = '1234567890abcdefghjklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let rstr = "";
    for (var i = 0; i < len; i++) {
        var c = getRandomInt(0, t.length)
        rstr += t[c]
    }
    return rstr;
}
