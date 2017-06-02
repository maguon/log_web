/**
 * Created by ASUS on 2017/5/17.
 */
/**
 * Created by jiangsen on 2017/5/17.
 */
// var car_demand_controller = angular.module("car_demand_controller", []);
app.controller("car_demand_controller", ["$scope", "$rootScope", "$host", "_basic", "_config", "baseService", function ($scope, $rootScope,$host, _basic,  _config, baseService) {
    $scope.curruntId = 0;
    $scope.start = 0;
    $scope.size = 11;
    var userId = _basic.getSession(_basic.USER_ID);

    var searchAll = function () {
        var reqUrl = $host.api_url + "/user/" + userId + "/car?active=" + 1 + "&start=" + $scope.start + "&size=" + $scope.size
        if ($scope.search_relStatus != null) {
            reqUrl = reqUrl + "&relStatus=" + $scope.search_relStatus
        }
        if ($scope.search_storage != null) {
            reqUrl = reqUrl + "&storageId=" + $scope.search_storage
        }
        if ($scope.search_makeId != null) {
            reqUrl = reqUrl + "&makeId=" + $scope.search_makeId
        }
        if ($scope.search_modelId != null) {
            reqUrl = reqUrl + "&modelId=" + $scope.search_modelId
        }
        if ($scope.search_vin != null) {
            reqUrl = reqUrl + "&vin=" + $scope.search_vin
        }
        if ($scope.search_enterTime_start != null) {
            reqUrl = reqUrl + "&enterStart=" + $scope.search_enterTime_start
        }
        if ($scope.search_enterTime_end != null) {
            reqUrl = reqUrl + "&enterEnd=" + $scope.search_enterTime_end
        }
        if ($scope.search_planTime_start != null) {
            reqUrl = reqUrl + "&planStart=" + $scope.search_planTime_start
        }
        if ($scope.search_planTime_end != null) {
            reqUrl = reqUrl + "&planEnd=" + $scope.search_planTime_end
        }
        if ($scope.search_outTime_start != null) {
            reqUrl = reqUrl + "&realStart=" + $scope.search_outTime_start
        }
        if ($scope.search_outTime_end != null) {
            reqUrl = reqUrl + "&realEnd=" + $scope.search_outTime_end
        }
        // console.log(reqUrl);
        _basic.get(reqUrl).then(function (data) {
            if (data.success == true) {
                $scope.storage_car_box = data.result;
                $scope.storage_car = $scope.storage_car_box.slice(0, 10);
                if ($scope.start > 0) {
                    $("#pre").removeClass("disabled");
                } else {
                    $("#pre").addClass("disabled");
                }
                if ($scope.storage_car_box.length < $scope.size) {
                    $("#next").addClass("disabled");
                } else {
                    $("#next").removeClass("disabled");
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 条件查询
    $scope.searchStorage_car = function () {
        searchAll();
    };


    // 分页
    // 上一页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        searchAll();

    };
    // 下一页
    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        searchAll();
    };

    // 車庫狀態
    $scope.rel_status = _config.car_rel_status;
    $scope.search_relStatus = 1;
    // 车辆品牌查询
    _basic.get($host.api_url + "/carMake").then(function (data) {
        if (data.success == true) {
            $scope.makecarName = data.result;
        } else {
            swal(data.msg, "", "error");
        }
    });
    // 车库查询
    _basic.get($host.api_url + "/storage").then(function (data) {
        if (data.success == true) {
            $scope.storageName = data.result;
        } else {
            swal(data.msg, "", "error");
        }
    });


    // 存放位置联动查询--行
    $scope.changeStorageId = function (val) {
        if (val) {
            _basic.get($host.api_url + "/storageParking?storageId=" + val).then(function (data) {
                if (data.success == true) {
                    $scope.storageParking = data.result;

                    $scope.parkingArray = baseService.storageParking($scope.storageParking);
                    // console.log($scope.parkingArray)

                } else {
                    swal(data.msg, "", "error");
                }
            });
        }

    },
        // 存放位置联动查询--列
        $scope.changeStorageRow = function (val, array) {

            if (val) {
                // console.log(val);
                $scope.colArr = array[val - 1].col;
                // console.log($scope.colArr)
            }


        };

    // 车辆型号联动查询
    $scope.changeMakeId = function (val) {
        // console.log(val);
        if (val) {
            if ($scope.curruntId == val) {

            } else {
                $scope.curruntId = val;
                _basic.get($host.api_url + "/carMake/" + val + "/carModel").then(function (data) {
                    if (data.success == true) {
                        $scope.carModelName = data.result;

                    } else {
                        swal(data.msg, "", "error")
                    }
                })
            }
        }


    };
    // modelId全局变量
    $scope.change_model_id = "";
    searchAll();
}]);

