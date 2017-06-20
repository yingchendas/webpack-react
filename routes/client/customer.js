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
    });
    router.post("/customer/register",(req,res)=>{
        console.log(123121)
        let userInfo=null;
        let db = new Mongodb("insert",{
            insert:{
                table:'user',
                method:'insert',
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
                    message:"注册成功",
                    data:userInfo
                })

            }else{
                res.push({
                    code:10002,
                    message:"注册失败",
                })
            }

        })
        db.start();
    })
};