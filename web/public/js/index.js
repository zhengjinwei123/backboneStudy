define(function (require, exports, module) {
    var $ = require("jquery");
    var Backbone = require("backbone");
    var __ = require("underscore");


    function demo() {
        var People = Backbone.Model.extend({
            name: null,//姓名
            ctime: null//打卡时间
        });
//     新建Collection构造函数
        var Peoples = Backbone.Collection.extend({
            initialize: function (models, options) {
                this.bind("add", options.view.addOnePerson);//add将Model添加进Collection，在这里调用View中定义的addOnePerson函数
            }
        });
//     新建View构造函数
        AppView = Backbone.View.extend({
            el: $("body"),
            initialize: function () {
                this.peoples = new Peoples(null, {view: this})//实例化一个Collection
            },
            events: {
                "click #check": "checkIn"//绑定#check的click事件，并执行checkIn函数
            },
            checkIn: function () {
                var person_name = prompt("您的姓名是？");
                if (person_name == "") {
                    person_name = "路人甲";
                }
                var ctime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
                var person = new People({name: person_name, ctime: ctime});
                this.peoples.add(person);
            },
            addOnePerson: function (model) {
                $("#person-list").append("<li>" + model.get('name') + "您好，您的打卡时间为：" + model.get('ctime') + "</li>");
            }
        });
        var appview = new AppView;//实例化一个View，自动执行initialize中的函数
    }


    function demo1() {
        var Man = Backbone.Model.extend({
            url: "http://localhost:9901/index",
            initialize: function () {
                console.log("your create me!Man");
                this.bind("change:name", function () {
                    console.log("name has changed ", this.get("name"));
                });
                this.bind("invalid", function (model, error) {
                    alert(error);
                });
            },
            defaults: {
                name: "zhengjinwei",
                age: 26
            },
            validate: function (attributes) {
                if (attributes.name == '') {
                    return "name不能为空！";
                }
            },
            aboutMe: function () {
                console.log("myname is zhengjinwei");
            }
        });

        var man = new Man();
        console.log(man.get("name"));
        console.log(man.get("age"));

        man.set({name: "zjw", age: 24});
        console.log(man.get("name"));
        console.log(man.get("age"));

        man.set("name", "zjw1");
        man.set("age", 25);
        console.log(man.get("name"));
        console.log(man.get("age"));

        //man.set("name", "");
        //man.aboutMe();

        man.save();

        //man.fetch();

        //man.fetch({url: 'http://localhost:9901/index'});

        //man.fetch({
        //    url: 'http://localhost:9901/index',
        //    success: function (model, response) {
        //        alert('success');
        //        alert(model.get('name'));
        //    }, error: function () {
        //        alert('error');
        //    }
        //});
    }

    demo1();
});
