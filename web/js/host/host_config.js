/**
 * Created by ASUS on 2017/3/14.
 */
var hostService = angular.module("hostService", []);
hostService.factory("$host", function () {
    var _this = {
        api_url: "http://stg.myxxjs.com:9001/api",
        file_url: "http://stg.myxxjs.com:9002/api",
        record_url: "http://stg.myxxjs.com:9004/api",
        socket_url: "ws://stg.myxxjs.com:9005",
        domain_name: "http://stg.myxxjs.com:8000"

    };
    return _this;
});
