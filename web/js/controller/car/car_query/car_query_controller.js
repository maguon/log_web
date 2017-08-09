/**
 * Created by zcy on 2017/6/27.
 */
app.controller("car_query_controller", ["$scope", "$rootScope", "$host", "_basic", "_config", "baseService", function ($scope, $rootScope, $host, _basic, _config, baseService) {
    $scope.start = 0;
    $scope.size = 20;
    // 车辆品牌
    $scope.getCarMakeData = function () {
        _basic.get($host.api_url + "/carMake").then(function (carMakeData) {
            if (carMakeData.success === true) {
                $scope.carMakeList = carMakeData.result;
                // console.log("品牌:", carMakeData);
            }
            else {
                swal(carMakeData.msg, "", "error");
            }
        });
    };

    // 发运地名称
    $scope.getAddrData = function () {
        _basic.get($host.api_url + "/baseAddr").then(function (addrData) {
            if (addrData.success === true) {
                $scope.addrList = addrData.result;
                // console.log("发运地:", addrData);
            }
            else {
                swal(addrData.msg, "", "error");
            }
        });
    };

    // 目的地城市
    $scope.getCityData = function () {
        _basic.get($host.api_url + "/city").then(function (cityData) {
            if (cityData.success === true) {
                $scope.cityList = cityData.result;
                // console.log("目的地城市:", cityData);
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
    };

    // 委托方
    $scope.getEntrustData = function () {
        _basic.get($host.api_url + "/entrust").then(function (entrustData) {
            if (entrustData.success === true) {
                $scope.entrustList = entrustData.result;
                // console.log("委托方:", entrustData);
            }
            else {
                swal(entrustData.msg, "", "error");
            }
        });
    };

    // 经销商
    $scope.getReceiveData = function () {
        _basic.get($host.api_url + "/receive").then(function (receiveData) {
            if (receiveData.success === true) {
                $scope.receiveList = receiveData.result;
                // console.log("经销商:", receiveData);
            }
            else {
                swal(receiveData.msg, "", "error");
            }
        });
    };

    // 根据条件搜索车辆
    $scope.search_car = function () {
        _basic.get($host.api_url + "/carList?start=" + $scope.start + "&size=" + $scope.size + _basic.objToUrl({
                vinCode: $scope.vin_code,
                makeId: $scope.brandId,
                routeStartId:$scope.addrCity,
                addrId: $scope.addrId,
                orderStart: $scope.instructionsStart,
                orderEnd: $scope.instructionsEnd,
                entrustId: $scope.entrustId,
                receiveId: $scope.receiveId,
                routeEndId:$scope.destinationId,
                createdStart:$scope.createdStart,
                createdEnd:$scope.createdEnd,
                // start:$scope.start,
                // size:$scope.size
            })).then(function (data) {
            if (data.success === true) {

                if ($scope.start > 0) {
                    // $("#pre").removeClass("disabled");
                    $("#pre").show();
                } else {
                    // $("#pre").addClass("disabled");
                    $("#pre").hide();
                }
                if (data.result.length < $scope.size) {
                    // $("#next").addClass("disabled");
                    $("#next").hide();
                } else {
                    // $("#next").removeClass("disabled");
                    $("#next").show();
                }

                $scope.responseData = data.result;
                console.log("responseData:", $scope.responseData);
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - $scope.size;
        $scope.search_car();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + $scope.size;
        $scope.search_car();
    };

    // 点击车辆查询
    $scope.searchMatchCar = function () {
        // 点击查询的时候让分页起始条数初始化
        $scope.start = 0;
        $scope.search_car();
    };

    // 获取所有数据
    $scope.queryData = function () {
        $scope.getCarMakeData();
        $scope.getAddrData();
        $scope.getCityData();
        $scope.getEntrustData();
        $scope.getReceiveData();
        // 默认显示所有数据
        $scope.search_car();
    };
    $scope.queryData();

}]);