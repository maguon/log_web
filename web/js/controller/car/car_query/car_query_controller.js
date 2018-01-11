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
        if($scope.addrCity == 0 || $scope.addrCity == "" || $scope.addrCity == null){
            $scope.addrCity = null;
            $scope.addrList = [];
        }
        else{
            _basic.get($host.api_url + "/baseAddr?cityId=" + $scope.addrCity).then(function (addrData) {
                if (addrData.success === true) {
                    $scope.addrList = addrData.result;
                    // console.log("发运地:", addrData);
                }
                else {
                    swal(addrData.msg, "", "error");
                }
            });
        }
    };

    // 目的地城市
    $scope.getCityData = function () {
        _basic.get($host.api_url + "/city").then(function (cityData) {
            if (cityData.success === true) {
                $scope.cityList = cityData.result;
                $('#start_city_list').select2({
                    placeholder: '发运地城市',
                    containerCssClass : 'select2_dropdown'
                });
                $('#end_city_list').select2({
                    placeholder: '目的地城市',
                    containerCssClass : 'select2_dropdown'
                });
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
        if($scope.destinationId == 0 || $scope.destinationId == "" || $scope.destinationId == null){
            $scope.destinationId = null;
            $scope.receiveList = [];
        }
        else{
            _basic.get($host.api_url + "/receive?cityId=" + $scope.destinationId).then(function (receiveData) {
                if (receiveData.success === true) {
                    $scope.receiveList = receiveData.result;
                }
                else {
                    swal(receiveData.msg, "", "error");
                }
            });
        }
    };

    // 根据条件搜索车辆
    $scope.search_car = function () {
        _basic.get($host.api_url + "/carList?" + _basic.objToUrl({
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
                start:$scope.start.toString(),
                size:$scope.size
            })).then(function (data) {
            if (data.success === true) {
                if ($scope.start > 0) {
                    $("#pre").show();
                }
                else {
                    $("#pre").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#next").hide();
                }
                else {
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
        $scope.getCityData();
        $scope.getEntrustData();
        // 默认显示所有数据
        $scope.search_car();
    };
    $scope.queryData();

}]);