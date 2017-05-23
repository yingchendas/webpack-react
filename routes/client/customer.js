/*
 * 用户相关功能
 * */
"use strict"

require('../../utilities/StringUtils');
const common = require("../../utilities/common");
const Mongodb = require('../../utilities/event-mongodb-datasource');
const ObjectId = require('mongodb').ObjectId;
const orderStatus = require("../../utilities/order_status");
const company = require('../../utilities/insurance_company');
const application = require("../../application.json");
const sendSms = require('../../utilities/sms/send');

let ins = {
    Z1: "车损险",
    Z2: "盗抢险",
    Z3: "三者险",
    Z4: "座位险（司机）",
    Z5: "座位险（乘客）",
    B1: "车损险不计免赔",
    B2: "盗抢险不计免赔",
    B3: "三者险不计免赔",
    B4: "座位险（司机）不计免赔",
    B5: "座位险（乘客）不计免赔",
    F1: "划痕险",
    B7: "划痕险不计免赔",
    F2: "玻碎险",
    F5: "自燃险",
    B8: "自燃险不计免赔",
    F8: "涉水发动机损坏险",
    B11: "涉水发动机损坏险不计免赔",
    F3: "指定专修厂特约条款",
    F12: "机动车损失保险无法找到第三方特约险"
};

let time = 1000 * 60 * 3;

module.exports = router => {
    /*用户中心*/
    router.post("/customer/login",(req,res)=>{
        
        console.log(req.body.userName)
        let userInfo=null;
        let db = new Mongodb("find",{
            find:{
                table:'user',
                method:'findOne',
                param:{
                    userName:req.body.userName,
                    pwd:req.body.pwd
                },
                fun:(rs,go)=>{
                    userInfo=rs;
                    go();
                }
            }
        })
        db.on('err', err => {
            console.log(111)
            process.nextTick(() => {
                throw err;
            })
        });
        db.on("end",()=>{
            console.log(userInfo)
            if(userInfo !=null){
                res.push({
                    code:10000,
                    message:"登录成功",
                    data:userInfo
                })
                
            }else{
                res.push({
                   code:10002,
                    message:"密码或用户名错误",
                })
            }
            
        })
         db.start();
    })
};