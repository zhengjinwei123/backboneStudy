/**
 * Created by 郑金玮 on 2016/12/10.
 */
var Express = require("express");
var _ = require("lodash");
var Http = require('http');
var Path = require("path");
var Ejs = require("ejs");
var MorganLogger = require('morgan'),
    BodyParser = require('body-parser'),
    CookieParser = require('cookie-parser'),
    Session = require('express-session');
var ObjUtil = require("../../utils/app").Object;
var FileUtil = require("../../utils/app").File;
var EventEmitter = require("events").EventEmitter;
var Util = require("util");
var Async = require("async");
var Favicon = require('serve-favicon');


var ExpressPlugin = function (host, port, path) {
    EventEmitter.call(this);

    var argsCnt = ObjUtil.count(arguments);
    if (argsCnt < 2) {
        if (argsCnt == 0) {
            this.host = '127.0.0.1';
            this.port = '8080';
        } else if (argsCnt == 1) {
            if (_.isString(arguments[0])) {
                this.host = arguments[0];
                this.port = '8080';
            } else if (_.isNumber(arguments[0])) {
                this.port = arguments[0];
                this.host = '127.0.0.1';
            } else {
                throw new TypeError("invalid args,you must be specify a number(port) and a string(host)");
            }
        }
    } else {
        if (_.isNumber(host) && _.isString(port)) {
            this.host = port;
            this.port = host;
        } else {
            if (!_.isNumber(port) && _.isString(host)) {
                throw new TypeError("invalid args,you must be specify a number(port) and a string(host)");
            } else {
                this.host = host;
                this.port = port;
            }
        }
    }

    if (!FileUtil.isExists(path)) {
        try {
            FileUtil.createDirectory(path);
        } catch (e) {
            console.error(e.message);
        } finally {

        }
    }


    var viewPath = Path.join(path, '/views');
    this.routePath = Path.join(path, "/routes");
    var publicPath = Path.join(path, "/public");
    var staticPath = Path.join(path, '/static');

    var imagesPath = Path.join(path, "/public/images");
    var jsPath = Path.join(path, "/public/js");
    var stylePath = Path.join(path, "/public/stylesheets");

    FileUtil.createDirectory(viewPath);
    FileUtil.createDirectory(this.routePath);
    FileUtil.createDirectory(publicPath);
    FileUtil.createDirectory(staticPath);
    FileUtil.createDirectory(imagesPath);
    FileUtil.createDirectory(jsPath);
    FileUtil.createDirectory(stylePath);

    if (!FileUtil.isExists(Path.join(this.routePath, "/index.js"))) {
        var jsTemplate = FileUtil.readSync(Path.join(__dirname, "/template.js"));
        FileUtil.writeSync(Path.join(this.routePath, "/index.js"), jsTemplate);
    }

    if (!FileUtil.isExists(Path.join(viewPath, "/index.ejs"))) {
        var viewTemplate = FileUtil.readSync(Path.join(__dirname, '/template.ejs'));
        FileUtil.writeSync(Path.join(viewPath, "/index.ejs"), viewTemplate);
    }

    if (!FileUtil.isExists(Path.join(stylePath, "/style.css"))) {
        var cssTemplate = FileUtil.readSync(Path.join(__dirname, '/template.css'));
        FileUtil.writeSync(Path.join(stylePath, "/style.css"), cssTemplate);
    }

    if (!FileUtil.isExists(Path.join(path, '/public/images/favicon.ico'))) {
        var icon = FileUtil.readSync(Path.join(__dirname, '/favicon.ico'));
        FileUtil.writeSync(Path.join(path, '/public/images/favicon.ico'), icon);
    }


    this.path = path;
    this.routesList = {};
    this.app = Express();

    this.filterFuncs = [];//过滤函数列表

    this.dispatchFunc = null;//消息发送
};
Util.inherits(ExpressPlugin, EventEmitter);

ExpressPlugin.prototype.loadRoutes = function (routePath) {
    var routesFiles = FileUtil.traverseSync(routePath);
    var self = this;
    routesFiles.forEach(function (f) {
        var extraPath = f.path.replace(routePath, "");
        var route = require(f.path);
        var routeName = extraPath.replace('.js', "");
        self.routesList[routeName] = self.routesList[routeName] || 1;

        if (route['L'] && _.isArray(route.L) && route['R']) {
            self.app.use(routeName, route.R);
            route.L.forEach(function (r) {
                var _name = routeName + "/" + r;
                self.routesList[_name] = self.routesList[_name] || 1;
                self.app.use(_name, route.R);
            });
        } else {
            self.app.use(routeName, route);
        }
    });
};

ExpressPlugin.prototype.use = function (func) {
    if (_.isFunction(func)) {
        this.filterFuncs.push(func);
    }
};

ExpressPlugin.prototype.dispatch = function (func) {
    if (_.isFunction(func)) {
        this.dispatchFunc = func;
    }
};

ExpressPlugin.prototype.env = function () {
    return this.app.get('env');
};

ExpressPlugin.prototype.start = function (callback) {
    var self = this;
    Http.createServer(this.app).listen(this.port, function () {
        //self.app.configure('development', function () {
        //
        //});
        self.emit('ready');
    });

    self.on('ready', function () {
        self.app.set('views', Path.join(self.path, 'views'));
        self.app.set('view engine', "ejs");
        self.app.use(MorganLogger('dev'));
        self.app.use(BodyParser.json({limit:'50mb'}));
        self.app.use(BodyParser.urlencoded({limit:"50mb",extended: false}));
        self.app.use(CookieParser());

        var iconPath = self.path + '/public/images/favicon.ico';
        FileUtil.createFile(iconPath);
        self.app.use(Favicon(iconPath));

        //self.use(Express.errorHandler({ dumpExceptions: true, showStack: true }));

        self.app.use(Session({
            secret: 'express-secret',
            cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, // 30 days
            name: 'expressSecret'
        }));

        self.app.use(Express.static(Path.join(self.path, 'public')));
        self.app.use(Express.static(Path.join(self.path, 'static')));


        self.app.use(function (req, res, next) {
            if (self.filterFuncs.length) {
                Async.eachSeries(self.filterFuncs, function (func, callback) {
                    func(req, res, function (err) {
                        callback(err);
                    });
                }, function (err, resp) {
                    next(err);
                });
            } else {
                next();
            }
        });
        self.loadRoutes(self.routePath);

        if (self.dispatchFunc) {
            self.app.use(function (req, res, next) {
                self.dispatchFunc(req, res, next);
            });
        }

        self.app.use(function (req, res) {
            res.statusCode = 404;
            res.end();
        });

        process.on('uncaughtException', function (err) {
            self.emit('uncaughtException', err);
        });

        callback();
    });
};

module.exports = ExpressPlugin;
