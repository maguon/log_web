/**
 * Created by ASUS on 2017/3/31.
 */
/**
 * Created by ASUS on 2017/3/14.
 */
var hostService=angular.module("hostService",[]);
hostService.factory("$host",function () {
    var _this={
        api_url:"http://stg.myxxjs.com:9001/api",
        file_url:"http://stg.myxxjs.com:9002/api",
        record_url:"http://stg.myxxjs.com:9004/api",
        socket_url:"ws://localhost:9005"

    };
    return _this;

});
// hostService.factory("$upload",function () {
//     var _this={
//         api_url_upload:"http://stg.myxxjs.com:9002/api"
//
//     };
//     return _this;
//
// });
