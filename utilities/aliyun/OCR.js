/**
 * Created by lein on 2017/5/2.
 */
"use strict";
const request = require('request');
const fs = require('fs');
const ImgResize = require('../ImgResize');


exports.ocr = function (file, originalname, fn) {
    fs.readFile(ImgResize(file, 1024, originalname), (err, data) => {
        if (err) {
            process.nextTick(() => {
                throw err;
            })
        } else {
            let file_base64 = data.toString('base64');
            request.post({
                url: 'http://dm-53.data.aliyun.com/rest/160601/ocr/ocr_vehicle.json',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    Authorization: 'APPCODE 633cac7c28ce461caff24db229f00ac7'
                },
                body: JSON.stringify({
                    "inputs": [
                        {
                            "image": {
                                "dataType": 50,
                                "dataValue": file_base64
                            }
                        }
                    ]
                })
            }, (err, res, body) => {
                if (err || res.statusCode !== 200) {
                    process.nextTick(() => {
                        throw err;
                    })
                } else {
                    let content = JSON.parse(JSON.parse(body).outputs[0].outputValue.dataValue);
                    if (content.success)
                        fn(content)
                    else {
                        process.nextTick(() => {
                            throw new Error('分析失败');
                        })
                    }
                }
            })
        }
    })

};
// let a = '/Users/lein/Desktop/12121';
//
//
// this.ocr(a, '1212.jpeg', rs => {
//     console.log(rs)
// })




