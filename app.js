/**
 * Created by zhengjinwei on 2017/1/13.
 */
var JadeLoader = require("./mnode/app").plugin.JadeLoader;
var Path = require("path");
var LogUtil = require("./mnode/utils/app").Logger;

JadeLoader.init(Path.join(__dirname), true, 360, function () {
    var Singleton = JadeLoader.Jader('utils').get('singleton-utils');
    var Logger = Singleton.getDemon(LogUtil, Path.join(__dirname, "./config/logger.json"), Path.join(__dirname, "./logs"));
    Logger.info("Http", "jade loader start.");

    var HttpServer = Singleton.getDemon(JadeLoader.Jader('plugin').get('http'), 9901,'127.0.0.1',{
        filtersFunc: [
            function (message) {
                return true;
            }
        ]
    }, Path.join(__dirname, "./web"),null);

    HttpServer.createServer();

    HttpServer.on("ready", function (data) {
        Logger.info("Http", data);
    });
    HttpServer.on("error", function (data) {
        Logger.info("Http", data);
    });
    HttpServer.on("connect-connect", function (data) {
        Logger.info("Http", data);
    });
    HttpServer.on("connect-error", function (error) {
        Logger.info("Http", error);
    });
    HttpServer.on("connect-disconnect", function (data) {
        Logger.info("Http", data);
    });
    HttpServer.on("connect-response", function (data) {
        Logger.info("Http", data);
    });
    HttpServer.on("connect-errorcode", function (code) {
        Logger.info("Http", code);
    });
});