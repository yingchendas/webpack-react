/**
 * Created by Lein on 2016/11/7.
 */
"use strict";
const MongoDb = require('../../utilities/event-mongodb-datasource');
const common = require('../../utilities/common');

module.exports = router=> {
    router.get('/index', (req, res)=> {
        if (req.session.user.auth.indexOf('ADMIN') != -1) {
            res.redirect(req.rootPath + '/user/admin')
        }
    });

    router.get('/login', (req, res)=> {
        res.jade('manager/login')
    });

    router.post('/login_form', (req, res)=> {
            common.validate(req.body, {
                login_name: 'notnull',
                password: 'notnull'
            });
            let user;
            let mongodb = new MongoDb('find', {
                find: {
                    table: 'user',
                    method: 'findOne',
                    param: {
                        login_name: req.body.login_name
                    },
                    fun: (rs, go)=> {
                        user = rs;
                        go();
                    }
                }
            });

            mongodb.on('err', err=> {
                process.nextTick(()=> {
                    throw err;
                })
            })

            mongodb.on('end', ()=> {
                console.log(user)
                if (user && user.password === String.md5(req.body.login_name + "{" + req.body.password + "}")) {
                    req.session.regenerate(function (err) {
                        req.session.user = user;
                        res.redirect(req.rootPath + '/index')
                    });

                } else {
                    res.redirect(req.rootPath + '/login')
                }
            });

            mongodb.start();
        }
    )
};