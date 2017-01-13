require.config({
    paths:{
        jquery:["/lib/jquery.min"],
        underscore:["/lib/underscore.min"],
        backbone:["/lib/backbone.min"]
    },
    shim:{
        backbone:{deps:["jquery","underscore"]}
    }
});