/**
 * Created by zcy on 2017/8/30.
 */
app.controller("instruction_operation_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    $scope.truckNum = "";
    $scope.driveName = "";
    $scope.currentStatus = "";
    $scope.startCityId = "";
    $scope.locateAddrId = "";
    $scope.endCityId = "";
    $scope.distributorId = "";
    $scope.currentCity = "";
    $scope.taskStart = "";


    // 查询指令数据
    $scope.getTruckDispatch = function () {
        if($scope.currentStatus == "1"){
            $scope.taskStart = "0";
            $scope.currentCity = "";
        }
        if($scope.currentStatus == "2"){
            $scope.taskStart = "";
            $scope.currentCity = "0";
        }
        if($scope.currentStatus == ""){
            $scope.currentCity = "";
            $scope.taskStart = "";
        }
        _basic.get($host.api_url + "/truckDispatch?" + _basic.objToUrl({
                dispatchFlag:1,
                truckNum:$scope.truckNum,
                driveName:$scope.driveName,
                cityTaskStart:$scope.startCityId,
                baseAddrId:$scope.locateAddrId,
                taskEnd:$scope.endCityId,
                receiveId:$scope.distributorId,
                currentCity:$scope.currentCity,
                taskStart:$scope.taskStart
            })).then(function (dispatchData) {
            if (dispatchData.success === true) {
                // 根据城市判断状态
                for (var i = 0; i < dispatchData.result.length; i++) {
                    if (dispatchData.result[i].current_city === 0) {
                        dispatchData.result[i].operate_status = "在途"
                    }
                    else {
                        dispatchData.result[i].operate_status = "待运中"
                    }
                }
                $scope.dispatchList = dispatchData.result;
            }
            else {
                swal(dispatchData.msg, "", "error");
            }
        });
    };

    // 获取起始城市信息
    $scope.getStartCityInfo = function () {
        _basic.get($host.api_url + "/city").then(function (cityData) {
            if (cityData.success === true) {
                $scope.startCityList = cityData.result;
                $('.js-example-basic-single').select2({
                    placeholder: '始发城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
    };

    // 获取目的城市信息
    $scope.getEndCityInfo = function () {
        _basic.get($host.api_url + "/city").then(function (cityData) {
            if (cityData.success === true) {
                $scope.endCityList = cityData.result;
                $('.js-example-basic-single2').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
    };

    // 根据起始城市查询装车地点
    $scope.getLocateAddress = function () {
        _basic.get($host.api_url + "/baseAddr?cityId=" + $scope.startCityId).then(function (locateData) {
            if (locateData.success === true) {
                $scope.locateList = locateData.result;
            }
            else {
                swal(locateData.msg, "", "error");
            }
        });
    };

    // 根据目的城市获取经销商
    $scope.getDistributor = function () {
        _basic.get($host.api_url + "/receive?cityId=" + $scope.endCityId).then(function (distributorData) {
            if (distributorData.success === true) {
                $scope.distributorList = distributorData.result;
            }
            else {
                swal(distributorData.msg, "", "error");
            }
        });
    };

    // 获取所有数据
    $scope.queryData = function () {
        $scope.getTruckDispatch();
        $scope.getStartCityInfo();
        $scope.getEndCityInfo();
    };
    $scope.queryData();
}]);