/**
 * Created by lein on 2017/5/8.
 */
"use strict";

const crypto = require('crypto');
const fs = require('fs');
var encryptData = function (data, key, iv) {
    iv = iv || "";
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var cipher = crypto.createCipheriv('aes-128-ecb', key, iv);
    cipher.setAutoPadding(true);
    cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));
    return cipherChunks.join('');
}
var decryptData = function (data, key, iv) {
    if (!data) {
        return "";
    }
    iv = iv || "";
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var decipher = crypto.createDecipheriv('aes-128-ecb', key, iv);
    decipher.setAutoPadding(true);
    cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
    cipherChunks.push(decipher.final(clearEncoding));
    return cipherChunks.join('');
}
// var encryptData = function (data, key) {
//     var dateEncode = crypto.createCipheriv('aes-128-ecb', key, "");
//     dateEncode.setAutoPadding(true);
//     dateEncode.update(data, 'utf8', 'base64');
//     return dateEncode.final('base64');
// };
//
// var decryptData = function (encrypt_data, key) {
//     var dateEncode = crypto.createDecipheriv('aes-128-ecb', key, "");
//     dateEncode.setAutoPadding(true);
//     dateEncode.update(encrypt_data, 'base64', 'utf8');
//     return dateEncode.final('utf8');
// };

var encryptKey = function (key, public_key_path, fn) {

    fs.readFile(public_key_path, (err, rs) => {
        if (err) {
            process.nextTick(() => {
                throw err;
            })
        } else {
            fn(crypto.publicEncrypt({
                key: rs,
                padding: crypto.constants.RSA_PKCS1_PADDING
            }, new Buffer(key)).toString('base64'));
        }
    });

};

var decryptKey = function (encrypt_key, private_key_path, fn) {
    fs.readFile(private_key_path, (err, rs) => {
        if (err) {
            process.nextTick(() => {
                throw err;
            })
        } else {
            fn(crypto.privateDecrypt({
                key: rs,
                padding: crypto.constants.RSA_PKCS1_PADDING
            }, new Buffer(encrypt_key, 'base64')).toString());
        }
    });
};

let md5 = function (data) {
    let md5Encode = crypto.createHash('md5');
    md5Encode.update(data);
    return new Buffer(md5Encode.digest('hex').toUpperCase());
};

var sign = function (data, private_key_path, fn) {
    fs.readFile(private_key_path, (err, rs) => {
        if (err) {
            process.nextTick(() => {
                throw err;
            })
        } else {
            let sign = crypto.createSign('RSA-SHA256');
            sign.update(md5(data));
            fn(sign.sign(rs, "base64"));
        }
    });

}

var verify = function (data, sign, public_key_path, fn) {
    fs.readFile(public_key_path, (err, rs) => {
        if (err) {
            process.nextTick(() => {
                throw err;
            })
        } else {
            let verify = crypto.createVerify('RSA-SHA256');
            verify.update(data);
            fn(verify.verify(rs, sign, "base64"));
        }
    });

}

//
// let key = "1111111111111111";
// let data = "{\"aa\":11111}";
// let publicKey = './rsa_public_key.pem';
// let privateKey = './rsa_private_key.pem';
// let ts='ioWzO0DrJuR11ZTGUs+MdFGfwe4daMz7dcYj9pyDFD147zs+a8uRmyDVQA1fVO5aHjOqnux0+cEsXH9u9adacGwvSnI+ZbHQB9T0BDe6hGpVqk4Ts1FlIzKKHxfEzNUMd2HlTQbAaBCYWPFCJMyTdDySrT/cccAeXoR3zNNts6w='
// let td ='oBCa3OFEaVDdfmKuDlchP3SmSMaqOFKJ9iOgTS+HN37Q5PakQUT+/yhvpO2wsV/nUYz2bEYRiE27JFKGIcuPeFDE/eyGZaWQXdWPYW1qW38n6iR7tEMDR22ENrHM63ozcU4k37W9D/oAD23fvTj5Xg=='
// console.log("data encrypt decrypt:" + (decryptData(encryptData(data, key), key) === data));
// decryptKey(ts, privateKey, decode => {
//     console.log("key encrypt decrypt1:" + decode);
//    let tl = decryptData(td, decode);
//     console.log("tl1:" + tl);
// })
// encryptKey(key, publicKey, encode => {
//     decryptKey(encode, privateKey, decode => {
//         console.log("key encrypt decrypt:" + (decode === key));
//     })
// });
//
// let t = "ClekgbTW8niJMIqX8kuUEXVTVO6Xe5Fsxg024woF3K4mrpg54PPDuD/3snjT8hjR8fLAwmLz2CZQMiEajzBvpoGBuSyT+v2do3ukNIqlIcux+qptAmmKm+DJnl70kT3isQ4niOTIChCRR8lfBzEMVmOuHZSyKLEXzaXw20OEfoo="
// sign(data, privateKey, s => {
//     verify(md5(data), t, publicKey, v => {
//         console.log("verify:" + v)
//     })
// });

module.exports = {
    encryptData,encryptKey,sign,verify,decryptKey,decryptData,md5
}