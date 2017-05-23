"use strict"

const Db = require("../../utilities/event-mongodb-datasource");
const xml2js = require("xml2js");

module.exports = router => {

    router.get('/jt/paymentCallback', (req, res) => {
        res.jade('client/other/paysuccess');
    });

    router.post('/jt/paymentBackCallback', (req, res) => {
        let xml;
        console.log('景泰支付回调：');
        console.log(req.body);
        for(let key in req.body){
            if(req.body[key]){
                xml = req.body[key];
            }else{
                xml = key;
            }
            break;
        }
        if(xml){
            let parser = new xml2js.Parser({
                explicitArray: false
            });
            parser.parseString(xml, (err, json) => {
                if(!err && json.xml.result_code == 'SUCCESS'){
                    let order;
                    let db = new Db('update', {
                        'get' : {
                            'table' : 'order',
                            'method' : 'findOne',
                            'param' : {
                                'audit_return_code' : json.xml.carApplyNo
                            },
                            'fun' : (rs, go) => {
                                order = rs;
                                if(order){
                                    go("update");
                                }else{
                                    go();
                                }
                            }
                        },
                        'update' : {
                            'table' : 'order',
                            'method' : 'update',
                            'param' : [{
                                'audit_return_code' : json.xml.carApplyNo
                            },{
                                '$set' : {
                                    'status' : '5',
                                    'description' : '支付成功，等待出单'
                                }
                            }],
                            'fun' : (rs, go) => {
                                go('log');
                            }
                        },
                        'log' : {
                            'table' : 'order_logs',
                            'method' : 'insert',
                            'param' : () => {
                                return {
                                    'order_code' : order.code,
                                    'before_status' : '2',
                                    'after_status' : '5',
                                    'operating_time' : new Date()
                                };
                            },
                            'fun' : (rs, go) => {
                                go();
                            }
                        }
                    });
                    db.on("err", err => {
                        process.nextTick(() => {
                            res.write('<xml><result_code>FAIL</result_code></xml>');
                            res.end();
                            throw err;
                        });
                    });
                    db.on("end", () => {
                        res.write('<xml><result_code>SUCCESS</result_code></xml>');
                        res.end();
                    });
                    db.start();
                }else{
                    res.write('<xml><result_code>FAIL</result_code></xml>');
                    res.end();
                }
            });
        }else{
            res.write('<xml><result_code>FAIL</result_code></xml>');
            res.end();
        }
    });

}

// let parser = new xml2js.Parser({
//     explicitArray: false
// });
//
// parser.parseString('<xml><amount><![CDATA[0.01]]></amount><appId><![CDATA[DL20160317000001]]></appId><carApplyNo><![CDATA[PROPFA201604190000216461]]></carApplyNo></xml>', (err, json) => {
//     console.log(json.xml.carApplyNo)
// });