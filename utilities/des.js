/**
 * Created by Lein on 16/8/29.
 */
"use strict";
let crypto = require('crypto');

let des_key = 'Unt53c1f';

var Des = function () {
}

Des.encrypt = function (plaintext) {
    let key = new Buffer(des_key);
    let encrypt_iv = new Buffer(8);
    for (let i = 0; i < 16; i++) {
        encrypt_iv[i] = 0;
    }
    var cipher = crypto.createCipheriv('des-cbc', key, encrypt_iv);
    cipher.setAutoPadding(true)
    var ciph = cipher.update(plaintext, 'utf8', 'base64');
    ciph += cipher.final('base64');
    return ciph;
}

Des.decrypt = function (encrypt_text) {
    var key = new Buffer(des_key);
    var decrypt_iv = new Buffer(8);
    for (let i = 0; i < 16; i++) {
        decrypt_iv[i] = 0;
    }
    var decipher = crypto.createDecipheriv('des-cbc', des_key, decrypt_iv);
    decipher.setAutoPadding(true);
    var txt = decipher.update(encrypt_text, 'base64', 'utf8');
    txt += decipher.final('utf8');
    return txt;
};

Des.encryptBase64 = function (v) {
    return new Buffer(v, 'utf8').toString('base64');
};

Des.decryptBase64 = function (v) {
    return new Buffer(v, 'base64').toString('utf8');
};

module.exports = Des
