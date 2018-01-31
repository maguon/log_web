app.controller("car_wash_fee_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    // 获取目的城市列表
    $scope.getCityList = function () {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                $scope.cityList = data.result;
                $('#end_city').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 根据城市id获取经销商
    $scope.getRecive = function () {
        if($scope.cityId == 0 || $scope.cityId == "" || $scope.cityId == null){
            $scope.cityId = null;
            $scope.receiveList = [];
        }
        else{
            _basic.get($host.api_url + "/receive?cityId=" + $scope.cityId).then(function (data) {
                if (data.success === true) {
                    $scope.receiveList = data.result;
                    // console.log("receiveList", $scope.receiveList);
                }
            });
        }
    };

    // 获取洗车费列表
    $scope.getCarWashFeeList = function () {
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRel?" + _basic.objToUrl({
            dpRouteTaskId: $scope.instructionNum,
            driveName: $scope.driver,
            routeEndId: $scope.destinationCity,
            receiveId: $scope.distributor,
            status: $scope.receive_status,
            cleanDateStart: $scope.receiveTimeStart,
            cleanDateEnd: $scope.receiveTimeEnd
        })).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                $scope.carWashFeeList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getCityList();
        $scope.getCarWashFeeList();
    };
    $scope.queryData();
}]);