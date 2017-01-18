/**
 * Created by zhengjinwei on 2017-01-18 19:12:36.
 * model代码基于工具自动生成,不要进行修改
 */
var Model = require('../../mnode/plugin/mysqlRedisCache/model');
var Util = require("util");

function Picture(){
    Model.call(this);
    this.tableName = 'picture';
    this.fields = {"id":0,"name":"","content":"","tm":"0","create_tm":"CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"};
    this.tablePrefix = 't_';
    this.pk = 'id';
}
Util.inherits(Picture,Model);

module.exports = Picture;