app.controller("finance_route_fee_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    $scope.start = 0;
    $scope.size = 10;


    // 获取所有司机信息
    $scope.getDriverList = function () {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                $scope.driveList = data.result;
                for(var i =0;i< $scope.driveList.length;i++){
                    if( $scope.driveList[i].mobile==null){
                        $scope.driveList[i].mobile = '空';
                    }
                }

                $('#driver_name').select2({
                    placeholder: '请选择',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 查询出车款列表
    $scope.getCarFinanceList = function () {
        _basic.get($host.api_url + "/dpRouteTaskLoan?" + _basic.objToUrl({
            dpRouteTaskLoanId: $scope.dispatchNum,
            driveId: $scope.driverId,
            truckNum: $scope.truckNum,
            applyUserName: $scope.reportPerson,
            applyDateStart: $scope.reportStartTime,
            applyDateEnd: $scope.reportEndTime,
            grantDateStart: $scope.grantStartTime,
            grantDateEnd: $scope.grantEndTime,
            refundDateStart: $scope.reimbursementStartTime,
            refundDateEnd: $scope.reimbursementEndTime,
            taskLoanStatus: $scope.grantStatus,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
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
                $scope.carFinanceList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 清除司机数据
    $scope.clearDriverInfo = function () {
        if($scope.driverId == 0 || $scope.driverId == "" || $scope.driverId == null){
            $scope.driverId = null;
        }
    };

    // 点击查询
    $scope.searchCarFinanceList = function () {
        $scope.start = 0;
        $scope.getCarFinanceList();
    };

    // 下载csv
    $scope.downloadCsvFile = function () {
        var obj = {
            dpRouteTaskLoanId: $scope.dispatchNum,
            driveId: $scope.driverId,
            truckNum: $scope.truckNum,
            applyUserName: $scope.reportPerson,
            applyDateStart: $scope.reportStartTime,
            applyDateEnd: $scope.reportEndTime,
            grantDateStart: $scope.grantStartTime,
            grantDateEnd: $scope.grantEndTime,
            refundDateStart: $scope.reimbursementStartTime,
            refundDateEnd: $scope.reimbursementEndTime,
            taskLoanStatus: $scope.grantStatus
        };
        window.open($host.api_url + "/dpRouteTaskLoan.csv?" + _basic.objToUrl(obj));
    };

    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - $scope.size;
        $scope.getCarFinanceList();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + $scope.size;
        $scope.getCarFinanceList();
    };


    // 获取数据
    $scope.queryData = function () {
        $scope.getDriverList();
        $scope.getCarFinanceList();
    };
    $scope.queryData();
}]);