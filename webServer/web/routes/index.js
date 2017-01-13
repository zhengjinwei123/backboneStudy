var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    console.log("get:",req.query);
    res.render('index', { title: 'Express' });
});

router.get('/data', function(req, res, next) {
    console.log("data",req.query);
    req.query.name = "zzz";
    req.query.age = 20;
    req.query.tt = 3333;
    res.json(req.query);
});

router.post('/', function(req, res, next) {

    console.log("post",req.body);
    res.render('index', { title: 'Express' });
});

module.exports = {
    R:router,
    L:[
        'data'
    ]
};
