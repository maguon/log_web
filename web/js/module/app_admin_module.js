/**
 * Created by ASUS on 2017/5/26.
 */

var app = angular.module("log_dev", ['ui.materialize','ui.router',"CommonFilter","ngCookies","ngMessages","hostService","baseService","adminDirective"]);

app.config(['$httpProvider',"$cookiesProvider",function($httpProvider,$cookiesProvider) {
    $cookiesProvider.defaults = {
        path: "/",
        domain: "",//cookie 作用域， cookies只在这个域和其子域有效
        expires:new Date(new Date().getTime()+5000),//有效时间
        secure: true//该cookie只在安全连接中被提供
    };
}]);