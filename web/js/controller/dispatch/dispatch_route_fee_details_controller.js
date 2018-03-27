app.controller("dispatch_route_fee_details_controller", ["$scope", "$stateParams", "$host", "_basic", function ($scope, $stateParams, $host, _basic) {

    var routeFeeId = $stateParams.id;
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.dispatchNum = "";

    // 获取当前出车款详情信息
    $scope.getCurrentRouteFeeInfo = function () {
        _basic.get($host.api_url + "/dpRouteTaskLoan?dpRouteTaskLoanId=" + routeFeeId).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                $scope.routeFeeInfo = data.result[0];
                $scope.getCurrentDriverMatchMissionList();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取已添加的关联任务信息
    $scope.getMatchMissionList = function () {
        _basic.get($host.api_url + "/dpRouteTaskLoanRel?dpRouteTaskLoanId=" + routeFeeId).then(function (data) {
            if (data.success === true) {
                // console.log("missionListData", data);
                $scope.matchMissionList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 查询当前司机下的所有关联任务信息
    $scope.getCurrentDriverMatchMissionList = function () {
        _basic.get($host.api_url + "/dpRouteTask?driveId=" + $scope.routeFeeInfo.drive_id + "&taskStatusArr=1,2,3,4").then(function (data) {
            if (data.success === true) {
                // console.log("missionData", data);
                $scope.missionList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 新增关联任务
    $scope.createMatchMissionCard = function () {
        if($scope.dispatchNum !== ""){
            // 检测是否有相同的关联任务
            function checkDispatchId(obj) {
                return obj.dp_route_task_id === $scope.dispatchNum;
            }
            if ($scope.matchMissionList.some(checkDispatchId)) {
                swal("不能重复添加相同任务！", "", "warning");
            }
            else{
                _basic.post($host.api_url + "/user/" + userId + "/dpRouteTaskLoanRel",{
                    dpRouteTaskLoanId: routeFeeId,
                    dpRouteTaskId: $scope.dispatchNum
                }).then(function (data) {
                    if (data.success === true) {
                        swal("新增成功", "请重新填写过路费", "success");
                        $scope.getMatchMissionList();
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            }
        }
        else{
            swal("请选择调度编号！", "", "warning");
        }
    };

    // 删除关联任务
    $scope.deleteMatchMission = function (id) {
        swal({
                title: "确定删除当前任务吗？",
                text: "删除后请重新填写过路费",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function(){
                _basic.delete($host.api_url + "/user/" + userId + "/dpRouteTaskLoan/" + routeFeeId + "/dpRouteTask/" + id).then(function (data) {
                    if (data.success === true) {
                        $scope.getMatchMissionList();
                        swal("删除成功", "请重新填写过路费", "success");
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            });
    };

    // 保存当前未发放数据
    $scope.saveRouteFeeInfo = function () {
        var totalCost = parseFloat($("#totalCost").html()).toFixed(2);
        _basic.put($host.api_url + "/user/" + userId + "/dpRouteTaskLoanApply/" + routeFeeId,{
            applyPassingCost: $scope.routeFeeInfo.apply_passing_cost,
            applyFuelCost: $scope.routeFeeInfo.apply_fuel_cost,
            applyProtectCost: $scope.routeFeeInfo.apply_protect_cost,
            applyPenaltyCost: $scope.routeFeeInfo.apply_penalty_cost,
            applyParkingCost: $scope.routeFeeInfo.apply_parking_cost,
            applyTaxiCost: $scope.routeFeeInfo.apply_taxi_cost,
            applyExplain: $scope.routeFeeInfo.apply_explain,
            applyPlanMoney: parseFloat(totalCost)
        }).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                swal("保存成功", "", "success");
                $scope.getCurrentRouteFeeInfo();
                $scope.getMatchMissionList();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getCurrentRouteFeeInfo();
        $scope.getMatchMissionList();
    };
    $scope.queryData();
}]);