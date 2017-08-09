/**
 * Created by zcy on 2017/8/8.
 */
app.controller("storage_index_vehicle_controller", ['$rootScope', '$scope', "$host", '$location', '$q', "_basic", function ($rootScope, $scope, $host, $location, $q, _basic) {
    // 日期查询值
    // var searchStart = moment(new Date()).format('YYYYMMDD');
    var searchEnd = moment(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).format('YYYYMMDD');

    // 变量初始值
    $scope.type_1_count = 0;
    $scope.type_2_count = 0;
    $scope.type_3_count = 0;
    $scope.type_4_count = 0;
    $scope.driver_type_1_count = 0;
    $scope.driver_type_2_count = 0;
    $scope.driver_type_3_count = 0;
    $scope.driver_type_4_count = 0;
    $scope.trailer = 0;
    $scope.truckRepairCount = 0;
    $scope.quarantineTruck = 0;
    $scope.quarantineDriver = 0;

    // 获取车辆信息
    $scope.getTruckCountInfo = function () {
        // 所属类型信息
        _basic.get($host.api_url + "/operateTypeCount?truckType=1").then(function (data) {
            if (data.success === true) {
                for (var i = 0; i < data.result.length; i++) {
                    if (data.result[i].operate_type === 1) {
                        $scope.type_1_count = data.result[i].truck_count
                    }
                    if (data.result[i].operate_type === 2) {
                        $scope.type_2_count = data.result[i].truck_count
                    }
                    if (data.result[i].operate_type === 3) {
                        $scope.type_3_count = data.result[i].truck_count
                    }
                    if (data.result[i].operate_type === 4) {
                        $scope.type_4_count = data.result[i].truck_count
                    }
                }
                // console.log("truckData", data);
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 自营挂车数量
        _basic.get($host.api_url + "/truckCount?truckType=2&operateType=1").then(function (data) {
            if (data.success === true) {
                $scope.trailer = data.result[0].truck_count;
                // console.log("data", data);
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 在职司机数量
        _basic.get($host.api_url + "/driveOperateTypeCount?driveStatus=1").then(function (data) {
            if (data.success === true) {
                $scope.driverTotal = 0;
                for (var i = 0; i < data.result.length; i++) {
                    if (data.result[i].operate_type === 1) {
                        $scope.driver_type_1_count = data.result[i].drive_count
                    }
                    if (data.result[i].operate_type === 2) {
                        $scope.driver_type_2_count = data.result[i].drive_count
                    }
                    if (data.result[i].operate_type === 3) {
                        $scope.driver_type_3_count = data.result[i].drive_count
                    }
                    if (data.result[i].operate_type === 4) {
                        $scope.driver_type_4_count = data.result[i].drive_count
                    }
                    $scope.driverTotal = $scope.driverTotal + data.result[i].drive_count;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取维修车辆数量，待检车辆和待检司机信息
    $scope.getRepairCountInfo = function () {
        // 维修车辆数量
        _basic.get($host.api_url + "/truckRepairRelCount?repairStatus=0").then(function (data) {
            if (data.success === true) {
                $scope.truckRepairCount = data.result[0].repair_count;
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 待检车辆
        _basic.get($host.api_url + "/truckFirst?drivingDateEnd=" + searchEnd).then(function (data) {
            if (data.success === true) {
                $scope.quarantineTruck = data.result.length;
                // console.log("dateData", data)
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 待检司机
        _basic.get($host.api_url + "/drive?licenseDateEnd=" + searchEnd).then(function (data) {
            if (data.success === true) {
                $scope.quarantineDriver = data.result.length;
                // console.log("driver", data)
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    $scope.queryData = function () {
        $scope.getTruckCountInfo();
        $scope.getRepairCountInfo();

    };
    $scope.queryData();
}]);
