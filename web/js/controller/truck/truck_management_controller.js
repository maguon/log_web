app.controller("truck_management_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host",function ($scope, $state, $stateParams, _basic, _config, $host) {
        $scope.size = 10;
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
        // 获取筛选列表
        function getManagementRecordList () {
            if($scope.driveName==0){
                $scope.driveName="";
            }
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
                accidentStatus:$scope.accidentStatus,
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
                    $scope.truckManagementList = data.result;
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        };
        // 搜索维修记录
        $scope.searchTruckManagement = function () {
            $scope.start=0;
            getManagementRecordList();
        };
        // 分页
        $scope.previous_page = function () {
            $scope.start = $scope.start - $scope.size;
            getManagementRecordList();
        };
        $scope.next_page = function () {
            $scope.start = $scope.start + $scope.size;
            getManagementRecordList();
        };
        // 获取数据
        function queryData () {
            getDriveNameList();
            getTruckNumList();
            $scope.searchTruckManagement();
        };
        queryData();
    }]);