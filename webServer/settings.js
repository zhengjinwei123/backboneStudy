/**
 * Created by zhengjinwei on 2017/1/18.
 */

module.exports = {
    redis: {
        poolCnt: 1,
        namePrefix: "pool_",
        host: "127.0.0.1",
        port: 6379,
        db: 1,
        auth: null
    },
    mysql: {
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        database: "jade_db",
        password: "root"
    }
};
