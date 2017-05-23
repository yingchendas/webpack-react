/**
 * Created by lein on 2016/12/21.
 */
"use strict";

const request = require('request');
const url = require('url');
const application = require('../application.json');
const util = require('util');
const querystring = require('querystring')
const crypto = require('crypto');
const headerEncode = require("../utilities/headerEncode")

let privateKey = application[process.env.NODE_ENV || 'dev'].private_key;
let publicKey = application[process.env.NODE_ENV || 'dev'].public_key;
let vehicle = (ownerOrId, plateNo, vin, fn) => {
    let requestURL = url.format({
        protocol: 'http',
        hostname: application[process.env.NODE_ENV || 'dev'].interface.host,
        port: application[process.env.NODE_ENV || 'dev'].interface.port,
        pathname: application[process.env.NODE_ENV || 'dev'].interface.rootPath + '/ins/vehicle'
    });
    let body=function () {
        if (fn) {
            return {
                owner: ownerOrId,
                plateNo: plateNo,
                vin: vin
            }
        } else if (typeof  vin === 'function') {
            return {
                owner: ownerOrId,
                plateNo: plateNo,
            }
        } else {
            return {
                id: ownerOrId
            }
        }
    }

    request.post(requestURL, {
        form: body(),
        headers:headerEncode.encode(body(),publicKey,privateKey)
    }, (error, response, body) => {
        if (typeof plateNo === 'function')
            fn = plateNo;
        else if (typeof vin === 'function')
            fn = vin


        if (error) {
            fn(error)
        } else if (response.statusCode !== 200) {
            let err = new Error('获取失败')
            fn(err);
        } else {
            let rs = JSON.parse(body);
            if (!util.isArray(rs.message)) {
                rs.message = [rs.message];
            }
            fn(null, rs);
        }
    })
};

let renewal = (owner, plateNo, fn) => {

    let requestURL = url.format({
        protocol: 'http',
        hostname: application[process.env.NODE_ENV || 'dev'].interface.host,
        port: application[process.env.NODE_ENV || 'dev'].interface.port,
        pathname: application[process.env.NODE_ENV || 'dev'].interface.rootPath + '/ins/renewal'
    });

    let body = {
        owner: owner,
        plateNo: plateNo
    }

    request.post(requestURL, {
        form: body,
        headers:headerEncode.encode(body,publicKey,privateKey)
    }, (error, response, body) => {
        if (error) {
            fn(error)
        } else if (response.statusCode !== 200) {
            let err = new Error('获取失败')
            fn(err);
        } else {
            let rs = JSON.parse(body);
            if(rs.code=='success'){
                let ve = rs.message.VehicleInsurance.VehicleInsuranceItem;
                for(var i=0;i<ve.length;i++){
                    if(ve[i].Code=='Z5'){
                        ve[i].Amount=ve[i].UnitAmount
                    }
                }
            }
            fn(null, rs)
        }
    })
};

let calculate = (data, fn) => {
    let requestURL = url.format({
        protocol: 'http',
        hostname: application[process.env.NODE_ENV || 'dev'].interface.host,
        port: application[process.env.NODE_ENV || 'dev'].interface.port,
        pathname: application[process.env.NODE_ENV || 'dev'].interface.rootPath + '/ins/calculate'
    });
    let body= {
        param: JSON.stringify(data)
    }
    request.post(requestURL, {
        form: body,
        headers:headerEncode.encode(body,publicKey,privateKey)
    }, (error, response, body) => {
        if (error) {
            fn(error)
        } else if (response.statusCode !== 200) {
            let err = new Error('算价格失败')
            fn(err);
        } else {
            let rs = JSON.parse(body);
            fn(null, rs)
        }
    })
};

let audit = (data, fn) => {
    let requestURL = url.format({
        protocol: 'http',
        hostname: application[process.env.NODE_ENV || 'dev'].interface.host,
        port: application[process.env.NODE_ENV || 'dev'].interface.port,
        pathname: application[process.env.NODE_ENV || 'dev'].interface.rootPath + '/ins/audit'
    });

    let body = {
        param: JSON.stringify(data)
    }
    request.post(requestURL, {
        form: body,
        headers:headerEncode.encode(body,publicKey,privateKey)
    }, (error, response, body) => {
        if (error) {
            fn(error)
        } else if (response.statusCode !== 200) {
            let err = new Error('核保失败')
            fn(err);
        } else {
            let rs = JSON.parse(body);
            fn(null, rs)
        }
    })
};

let vehicle2 = function (data,fn) {
    let requestURL = url.format({
        protocol: 'http',
        hostname: application[process.env.NODE_ENV || 'dev'].interface.host,
        port: application[process.env.NODE_ENV || 'dev'].interface.port,
        pathname: application[process.env.NODE_ENV || 'dev'].interface.rootPath + '/ins/vehicle2'
    });

    let body = {
        param: JSON.stringify(data)
    }

    request.post(requestURL, {
        form: data,
        headers:headerEncode.encode(data,publicKey,privateKey)
    }, (error, response, body) => {
        if (error) {
            fn(error)
        } else if (response.statusCode !== 200) {
            let err = new Error('查询车辆失败')
            fn(err);
        } else {
            let rs = JSON.parse(body);
            fn(null, rs)
        }
    })
}
exports.vehicle = vehicle;
exports.vehicle2 = vehicle2;
exports.renewal = renewal;
exports.calculate = calculate;
exports.audit = audit;

// vehicle2({
//     'LicenseNo': "川A47MX8",
//     "Vin": "LFV3A28K0F3028246",
//     "ModelCode": "FV7203BFQBG",
//     "EngineNo": "072114",
//     "EnrollDate": "2015-11-04",
//     "Syr": "邹舟",
//     "IdNo": '513823198408150035',
//     "IdType": "01",
//     "CustomerType": "01"
// },(err,data)=>{
//     console.log(err)
//     console.log(data)
// })