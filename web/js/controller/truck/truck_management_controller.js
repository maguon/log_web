app.controller("truck_management_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host",
    function ($scope, $state, $stateParams, _basic, _config, $host) {
        $scope.start = 0;
        $scope.size = 1;
         //司机
        function getDriveNameList () {
            _basic.get($host.api_url + "/drive?driveName=").then(function (data) {
                if (data.success == true) {
                    $scope.driveNameList = data.result;
                    $('#driveName').select2({
                        placeholder: '司机',
                        containerCssClass : 'select2_dropdown'
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        //車牌号
        function getTruckNumList () {
            _basic.get($host.api_url + "/truckBase").then(function (data) {
                if (data.success === true) {
                    $scope.truckNumList = data.result;
                    $('#truckNum').select2({
                        placeholder: '车牌号',
                        containerCssClass : 'select2_dropdown'
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        //获取列表信息
        function queryTruckManagementList() {
            _basic.get($host.api_url + "/truckAccident").then(function (data) {
                if (data.success == true) {
                    $scope.truckManagementList = data.result;
                } else {
                    swal(data.msg, "", "error")
                }
            });
        }
         // 获取筛选列表
        $scope.getManagementRecordList = function () {
            _basic.get($host.api_url + "/truckAccident?" + _basic.objToUrl({
                truckAccidentId: $scope.truckAccidentId,
                truckType:$scope.truckType,
                driveName:$scope.driveName,
                accidentDateStart: $scope.check_operation_startTime,
                accidentDateEnd: $scope.check_operation_endTime,
                truckNum:$scope.truckNum,
                dpRouteTaskId:$scope.dpRouteTaskId,
                truckAccidentType:$scope.truckAccidentType,
                underUserName:$scope.underUserName,
                accidentStatus:$scope.accidentStatus
            })).then(function (data) {
                if (data.success === true) {
                     console.log("data", data);
                    // if ($scope.start > 0) {
                    //     $("#record_pre").show();
                    // }
                    // else {
                    //     $("#record_pre").hide();
                    // }
                    // if (data.result.length < $scope.size) {
                    //     $("#record_next").hide();
                    // }
                    // else {
                    //     $("#record_next").show();
                    // }
                    $scope.truckManagementList = data.result;
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        };

        // 搜索维修记录
        $scope.searchTruckManagement = function () {
            $scope.start = 0;
            $scope.getManagementRecordList();
        };
         //分页
        // $scope.record_pre_btn = function () {
        //     $scope.start = $scope.start - $scope.size;
        //     $scope.getRepairRecordList();
        // };
        //
        // $scope.record_next_btn = function () {
        //     $scope.start = $scope.start + $scope.size;
        //     $scope.getRepairRecordList();
        // };
        // 获取数据
        $scope.queryData = function () {
            queryTruckManagementList();
            getDriveNameList();
            getTruckNumList();
        };
        $scope.queryData();
}]);