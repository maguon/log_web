app.controller("finance_route_fee_details_controller", ["$scope", "$stateParams", "$host", "_basic", function ($scope, $stateParams, $host, _basic) {

    var userId = _basic.getSession(_basic.USER_ID);
    var routeFeeId = $stateParams.id;

    // 获取当前出车款详情信息
    $scope.getCurrentRouteFeeInfo = function () {
        _basic.get($host.api_url + "/dpRouteTaskLoan?dpRouteTaskLoanId=" + routeFeeId).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                $scope.routeFeeInfo = data.result[0];
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

    // 点击发放或保存
    $scope.grantRouteFeeInfo = function (operation) {
        var totalCost = parseFloat($("#totalCost").html()).toFixed(2);
        _basic.put($host.api_url + "/user/" + userId + "/dpRouteTaskLoanGrant/" + routeFeeId,{
            grantPassingCost: $scope.routeFeeInfo.grant_passing_cost,
            grantFuelCost: $scope.routeFeeInfo.grant_fuel_cost,
            grantProtectCost: $scope.routeFeeInfo.grant_protect_cost,
            grantPenaltyCost: $scope.routeFeeInfo.grant_penalty_cost,
            grantParkingCost: $scope.routeFeeInfo.grant_parking_cost,
            grantTaxiCost: $scope.routeFeeInfo.grant_taxi_cost,
            grantExplain: $scope.routeFeeInfo.grant_explain,
            grantActualMoney: parseFloat(totalCost)
        }).then(function (data) {
            if (data.success === true) {
                if(operation === "save"){
                    swal("保存成功", "", "success");
                }
                $scope.getCurrentRouteFeeInfo();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击报销开启模态框
    $scope.reimbursementRouteFeeInfo = function () {
        $scope.roadTollCostMod = 0;
        $scope.fuelCostMod = 0;
        $scope.roadCostMod = 0;
        $scope.fineCostMod = 0;
        $scope.parkingCostMod = 0;
        $scope.taxiCostMod = 0;
        $scope.repaymentMoneyMod = 0;
        $scope.profitCostMod = 0;
        $scope.remarkMod = "";
        $("#reimbursementCarFinanceModel").modal("open");
    };

    // 模态框内点击确定保存信息
    $scope.saveReimbursementInfo = function () {
        var refundActualMoneyCost = parseFloat($("#reimbursement_money_mod").val()).toFixed(2);
        _basic.put($host.api_url + "/user/" + userId + "/dpRouteTaskLoanRepayment/" + routeFeeId,{
            refundPassingCost: $scope.roadTollCostMod,
            refundFuelCost: $scope.fuelCostMod,
            refundProtectCost: $scope.roadCostMod,
            refundPenaltyCost: $scope.fineCostMod,
            refundParkingCost: $scope.parkingCostMod,
            refundTaxiCost: $scope.taxiCostMod,
            repaymentMoney: $scope.repaymentMoneyMod,
            refundActualMoney: parseFloat(refundActualMoneyCost),
            profit: $scope.profitCostMod,
            refundExplain: $scope.remarkMod
        }).then(function (data) {
            if (data.success === true) {
                // 修改借款状态
                _basic.put($host.api_url + "/user/" + userId + "/dpRouteTaskLoan/" + routeFeeId + "/taskLoanStatus/3",{}).then(function (data) {
                    if (data.success === true) {
                        $scope.getCurrentRouteFeeInfo();
                        $("#reimbursementCarFinanceModel").modal("close");
                        swal("操作成功", "", "success");
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
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