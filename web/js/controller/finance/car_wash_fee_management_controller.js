
app.controller("car_wash_fee_management_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    $scope.receive_status = "1";
    $scope.start = 0;
    $scope.size = 11;

    // 获取目的城市列表
    $scope.getCityList = function () {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success === true) {
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
    //司机
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
                $('#getDrivderId').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
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
                }
            });
        }
    };

    // 获取洗车费列表
    $scope.getCarWashFeeList = function () {
        $scope.start = 0;
        getCarWashFeeList();
    }


    function getCarWashFeeList() {
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRel?" + _basic.objToUrl({
            loadTaskCleanRelId: $scope.instructionNum,
            driveName: $scope.driver,
            routeEndId: $scope.destinationCity,
            receiveId: $scope.distributor,
            status: $scope.receive_status,
            cleanDateStart: $scope.receiveTimeStart,
            cleanDateEnd: $scope.receiveTimeEnd,
            loadDateStart:$scope.loadDateStart,
            loadDateEnd:$scope.loadDateEnd,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                $scope.carWashFeeBoxArray = data.result;
                $scope.carWashFeeList = $scope.carWashFeeBoxArray.slice(0,10);
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
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 数据导出
    $scope.export = function () {
        // 基本检索URL
        var url = $host.api_url + "/dpRouteLoadTaskCleanRel.csv?" ;

        var conditions = _basic.objToUrl({
            loadTaskCleanRelId: $scope.instructionNum,
            driveName: $scope.driver,
            routeEndId: $scope.destinationCity,
            receiveId: $scope.distributor,
            status: $scope.receive_status,
            cleanDateStart: $scope.receiveTimeStart,
            cleanDateEnd: $scope.receiveTimeEnd,
            loadDateStart:$scope.loadDateStart,
            loadDateEnd:$scope.loadDateEnd
        });
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    };
    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getCarWashFeeList();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getCarWashFeeList();
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getCityList();
        getCarWashFeeList();
        getDriveNameList ();
    };
    $scope.queryData();
}]);