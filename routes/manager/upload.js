
"use strict";

const mongodb = require('../../utilities/event-mongodb-datasource');
const multer = require('multer');
const application = require('../../application.json');
const request = require('request');
const fs = require('fs');
const objectid = require('mongodb').ObjectId;

let upload_path = application[process.env.NODE_ENV || 'dev'].uploadPath;
let upload = multer({
    dest:upload_path
}).single('file');


module.exports  = router =>{
    router.post('/common/upload', (req, res)=> {
        let obj={};
        upload(req,res,function (err) {
            if (err)
                throw err;
            let go = () => {
                res.push({
                    id:obj.ops[0]._id
                });
            };
            let mdb = new mongodb("save" , {
                save: {
                    table: 'common_attachment',
                    method: 'insert',
                    param: {
                        filename:req.file.filename,
                        mimetype:req.file.mimetype,
                        originalname:req.file.originalname,
                        size:req.file.size
                    },
                    fun: (rs, go) => {
                        obj=rs;
                        go();
                    }
                }
            });
            mdb.on('err', err => {
                process.nexttick(() => {
                    throw err;
                })
            });

            mdb.on('end', () => {
                go();
            });

            mdb.start();
        })
    });

    router.post('/common/upload_pay', (req, res)=> {
        upload(req,res,function (err) {
            if (err)
                throw err;
            let go = () => {
                fs.readFile(upload_path + '/' +req.file.filename,(err,privateKey)=>{
                    res.push({
                        privateKey:privateKey.toString()
                    });
                })
            };
            let mdb = new mongodb("save" , {
                save: {
                    table: 'common_attachment',
                    method: 'insert',
                    param: {
                        filename:req.file.filename,
                        mimetype:req.file.mimetype,
                        originalname:req.file.originalname,
                        size:req.file.size
                    },
                    fun: (rs, go) => {
                        go();
                    }
                }
            });
            mdb.on('err', err => {
                process.nexttick(() => {
                    throw err;
                })
            });

            mdb.on('end', () => {
                go();
            });

            mdb.start();
        })
    })

    router.post('/common/upload_pay_common', (req, res)=> {
        upload(req,res,function (err) {
            if (err)
                throw err;
            let go = () => {
                fs.readFile(upload_path + '/' +req.file.filename,(err,commonKey)=>{
                    let key = commonKey.toString().replace(/\r/g,'').replace(/\n/g,'');
                    let arr = key.split('');
                    let skey = '-----BEGIN PUBLIC KEY-----';
                    for(var i =0;i<arr.length;i++){
                        if(i%64==0){
                            skey+='\n'
                        }
                        skey+=arr[i]

                    }
                    skey+='\n-----END PUBLIC KEY-----';

                    res.push({
                        commonKey:skey
                    });
                })
            };
            let mdb = new mongodb("save" , {
                save: {
                    table: 'common_attachment',
                    method: 'insert',
                    param: {
                        filename:req.file.filename,
                        mimetype:req.file.mimetype,
                        originalname:req.file.originalname,
                        size:req.file.size
                    },
                    fun: (rs, go) => {
                        go();
                    }
                }
            });
            mdb.on('err', err => {
                process.nexttick(() => {
                    throw err;
                })
            });

            mdb.on('end', () => {
                go();
            });

            mdb.start();
        })
    })

    router.get('/common/download/:id', (req, res)=> {
        let file;
        let mdb = new mongodb("find" , {
            find: {
                table: 'common_attachment',
                method: 'findOne',
                param: {
                    _id:objectid(req.params.id)
                },
                fun: (rs, go) => {
                    file=rs;
                    go();
                }
            }
        });
        mdb.on('err', err => {
            process.nextTick(() => {
                throw err;
            })
        });

        mdb.on('end', () => {
            if (file) {
                res.writeHead(200, {
                    'Content-Length': file.size,
                    'Content-Type': file.mimetype
                });
                fs.createReadStream(upload_path + '/' + file.filename).pipe(res)
            } else {
                process.nextTick(() => {
                    throw new Error('文件不存在');
                })
            }

        });

        mdb.start();

    })
}