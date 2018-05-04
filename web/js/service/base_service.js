/**
 * Created by ASUS on 2017/4/6.
 */
var baseService = angular.module("baseService", []);

baseService.factory("baseService", function () {

    var _this = {};
    // 仓储车辆图分布
    _this.storageParking = function (pk) {
        var parkingArray = [];
        for (i = 0; i < pk.length; i++) {
            expiredFlag = false;
            var time;
            var date = new Date(pk[i].plan_out_time);
            var plan_time = date.getTime();


            var new_time = new Date().getTime();
            time = plan_time - new_time - 1000 * 60 * 60 * 24 * 5;
            if (time > 0) {
                expiredFlag = false;
            } else {
                expiredFlag = true;
            }
            for (j = 0; j < parkingArray.length;) {
                if (parkingArray[j].row == pk[i].row) {
                    break;
                } else {
                    j++;
                }
            }
            if (j == parkingArray.length) {
                parkingArray.push({
                    row: pk[i].row,
                    col: [{
                        col: pk[i].col,
                        vin: pk[i].vin,
                        carId: pk[i].car_id,
                        id: pk[i].id,
                        status: pk[i].parking_status,
                        plan_time: expiredFlag,
                        storage_name: pk[i].storage_name,
                        storage_id: pk[i].storage_id,
                        storage_area_id: pk[i].storage_area_id
                    }]
                })
            } else {
                parkingArray[j].col.push({
                    col: pk[i].col,
                    vin: pk[i].vin,
                    carId: pk[i].car_id,
                    id: pk[i].id,
                    status: pk[i].parking_status,
                    plan_time: expiredFlag,
                    storage_name: pk[i].storage_name,
                    storage_id: pk[i].storage_id,
                    storage_area_id: pk[i].storage_area_id
                });
            }

        }
        // console.log(parkingArray);
        return parkingArray;
        // return parkingArray;
    };
    // 页面之间数据传递
    _this.pass_parameter = function () {
        //定义参数对象
        var myObject = {};

        /**
         * 定义传递数据的setter函数
         * @param {type} xxx
         * @returns {*}
         * @private
         */
        var _setter = function (data) {
            myObject = data;
        };

        /**
         * 定义获取数据的getter函数
         * @param {type} xxx
         * @returns {*}
         * @private
         */
        var _getter = function () {
            return myObject;
        };

        // Public APIs
        // 在controller中通过调setter()和getter()方法可实现提交或获取参数的功能
        return {
            setter: _setter,
            getter: _getter
        };
    };
    // 获取当前月第一天
    _this.dateFirst = function () {
        var date = new Date();
        return date.setDate(1);
    };
    // 获取当前月最后一天
    _this.dateLast = function () {
        var date = new Date();
        var currentMonth = date.getMonth();
        var nextMonth = ++currentMonth;
        var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
        var oneDay = 1000 * 60 * 60 * 24;
        return new Date(nextMonthFirstDay - oneDay);
    };

    _this.getWeek = function () {
        var d1 = new Date();
        var d2 = new Date();
        var date = new Date();
        var currentYear = date.getFullYear();
        d2.setMonth(0);
        d2.setDate(1);
        d2.setDate(7 - d2.getDay());
        var rq = d1 - d2;
        var s1 = Math.ceil(rq / (24 * 60 * 60 * 1000));
        var s2 = Math.ceil(s1 / 7);
        var s3 = s2 + 1;
        if (s3 < 10) {
            s3 = "0" + s3;
        }
        var string = currentYear + '' + s3;
        return string;
    };

    // BMap经纬度转AMap经纬度
    _this.transformMarkerPosition = function (lon, lat) {
        var gd_lat_lon = new Array(2);
        var PI = 3.14159265358979324 * 3000.0 / 180.0;
        var x = lon - 0.0065, y = lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * PI);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * PI);
        gd_lat_lon[0] = z * Math.cos(theta);
        gd_lat_lon[1] = z * Math.sin(theta);
        return gd_lat_lon;
    };

    return _this
});





