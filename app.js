"use strict";

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const fs = require('fs');
const domain = require('domain');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const loginURL = require('./utilities/weixin/loginURL');
const application = require('./application.json');
const weixin_config = require('./utilities/weixin/weixin_config.json');
//const roles = require('./role.json');
const Mongodb = require('./utilities/event-mongodb-datasource');

let app = express();
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'jade'));
app.set('view engine', 'pug');
app.locals.pretty = '\t';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// if (app.get('env') === 'development') {
//     let logger = require('morgan');
//     app.use(logger('dev'));
// }
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    console.info(req.method + " - " + req.path);
    console.debug("BODY PARAM:" + JSON.stringify(req.body))
    console.debug("QUERY PARAM:" + JSON.stringify(req.query))
    console.debug("PARAMS PARAM:" + JSON.stringify(req.params))
    next();
})

app.all('/', (req, res) => {
    res.redirect('/manager/login');
});

app.use(function (req, res, next) {
    res.push = function (data) {
        res.send(data);
    };

//  res.jade = function (path, options) {
//      if (process.env.NODE_ENV !== 'dev') {
//          var data = {};
//          for (let t in app.locals) {
//              if (t !== 'settings') {
//                  data[t] = app.locals[t];
//              }
//          }
//
//          for (var t in res.locals) {
//              data[t] = res.locals[t];
//          }
//
//          data.session = req.session
//
//          var o = options || {};
//          for (var t in o) {
//              data[t] = o[t];
//          }
//          res.send(require('./views/' + path).run(data))
//      } else {
//          var data = {};
//          for (let t in app.locals) {
//              if (t !== 'settings') {
//                  data[t] = app.locals[t];
//              }
//          }
//
//          for (var t in res.locals) {
//              data[t] = res.locals[t];
//          }
//          data.session = req.session
//          var o = options || {};
//          for (var t in o) {
//              data[t] = o[t];
//          }
//
//          res.render(path, data);
//      }
//  };
    next();
})

let analyze = function (root, router) {
    var paths = fs.readdirSync(root);
    for (var i = 0; i < paths.length; i++) {
        var path = root + '/' + paths[i];
        var p = fs.statSync(path);
        if (p.isDirectory()) {
            analyze(path, router);
        } else if (p.isFile()) {
            if (path.endWith('\\.js')) {
                require(path)(router)
            }
        }
    }
};
/*链接mongo数据库*/
var mongoStore = new MongoStore({
    url: application[process.env.NODE_ENV || 'dev'].mongo,
    autoReconnect: true,
    stringify: false,
    collection: 'web_session'
});

app.use('/', session({
    secret: 'liquor*UHB&YGV()#$%^',
    cookie: {
        secure: false
    },
    name: 'sessionid',
    rolling: true,
    resave: false,
    saveUninitialized: true,
    store: mongoStore
}));
/*路由*/
var clientRouter = express.Router({
    caseSensitive: 'enabled'
});

clientRouter.use(function (req, res, next) {

    var m = domain.create();
    m.on('error', function (err) {
        next(err, req, res, next);
    });
    m.add(req);
    m.add(res);
    m.run(next);
});


clientRouter.use(function (req, res, next) {
    req.rootPath = application[process.env.NODE_ENV || 'dev'].root_path.client;
    res.locals.rootPath = application[process.env.NODE_ENV || 'dev'].root_path.client;
    res.locals.pay = application[process.env.NODE_ENV || 'dev'].root_path.pay;
    next();
});
/*验证用户是否已经登陆*/
clientRouter.use(function (req, res, next) {
    if (String.pathMatcher('/remote/**', req.path)
        || String.pathMatcher('/buy/**', req.path)
        || String.pathMatcher('/remote/**', req.path)
        || String.pathMatcher('/coupon/**', req.path)
        || String.pathMatcher('/index', req.path)) {
        if (req.session.user) {
            let db = new Mongodb('find', {
                find: {
                    table: 'user',
                    method: 'findOne',
                    param: {
                        _id: req.session.user._id
                    },
                    fun: (rs, go) => {
                        req.session.user = rs;
                        go();
                    }
                }
            });

            db.on('err', err => {
                process.nextTick(() => {
                    throw err;
                })
            })

            db.on('end', () => {
                next()
            });

            db.start();
        } else {
            res.redirect(req.rootPath + '/' + res.locals.channel + '/main')
        }
    } else {
        next();
    }

});

analyze(__dirname + '/routes/client', clientRouter);

app.use(application[process.env.NODE_ENV || 'dev'].root_path.client, clientRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace


// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.trace(err)
    err.status = err.status || 500
    res.locals.message = err.message;
    res.locals.error = err
    // render the error page
    res.status(err.status || 500);
    res.jade('error');
});

module.exports = app;
