/**
 * Created by zcy on 2017/6/27.
 */
app.controller("car_query_controller", ["$scope", "$rootScope", "$host", "_basic", "_config", "baseService", function ($scope, $rootScope, $host, _basic, _config, baseService) {
    // 车辆品牌
    $scope.getCarMakeData = function () {
        _basic.get($host.api_url + "/carMake").then(function (carMakeData) {
            if (carMakeData.success === true) {
                $scope.carMakeList = carMakeData.result;
                console.log("品牌:", carMakeData);
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
                console.log("发运地:", addrData);
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
                console.log("目的地城市:", cityData);
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
                console.log("委托方:", entrustData);
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
                console.log("经销商:", receiveData);
            }
            else {
                swal(receiveData.msg, "", "error");
            }
        });
    };

    // 根据条件搜索车辆
    $scope.search_car = function () {
        _basic.get($host.api_url + "/carList?" + _basic.objToUrl({
                vinCode: $scope.vin_code,
                makeId: $scope.brandId,
                addrId: $scope.addrId,
                orderStart: $scope.instructionsStart,
                orderEnd: $scope.instructionsEnd,
                entrustId: $scope.entrustId,
                receiveId: $scope.receiveId,
                routeEndId:$scope.destinationId
            })).then(function (data) {
            if (data.success === true) {
                $scope.responseData = data.result;
                console.log("responseData:", $scope.responseData);
            }
            else {
                swal(data.msg, "", "error");
            }
        });
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