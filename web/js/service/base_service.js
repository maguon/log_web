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

                // pk[i].plan_time-
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
                        storage_id: pk[i].storage_id
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
                    storage_id: pk[i].storage_id
                });
            }

        }
        // console.log(parkingArray);
        return parkingArray;
        // return parkingArray;
    };
    // 页面之间数据传递
    _this.pass_parameter=function () {
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

    return _this
});





