app.controller("finance_route_fee_details_controller", ["$scope", "$stateParams", "$host", "_basic", function ($scope, $stateParams, $host, _basic) {

    var userId = _basic.getSession(_basic.USER_ID);
    var routeFeeId = $stateParams.id;
    var dispatchIdSmall = $stateParams.dpId;
    // 获取当前出车款详情信息
   function getCurrentRouteFeeInfo() {
        _basic.get($host.api_url + "/dpRouteTaskLoan?dpRouteTaskLoanId=" + routeFeeId).then(function (data) {
            if (data.success === true) {
                $scope.routeFeeInfo = data.result[0];
                $scope.routeFeeInfo.drive_id = data.result[0].drive_id;
                $scope.routeFeeInfo.truck_id = data.result[0].truck_id;
                $scope.routeFeeInfo.dp_route_task_id = data.result[0].dp_route_task_id;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
       _basic.get($host.api_url + "/dpRouteTaskLoanRel?dpRouteTaskLoanId=" + routeFeeId).then(function (data) {
           if (data.success === true) {
               $scope.routeFeeItem = data.result[0];
           }
           else {
               swal(data.msg, "", "error");
           }
       });
    };

    //获取洗车费
    function washCarFee(){
        $scope.totalPrice=0;
        $scope.bigPrice =0;
        //洗车费
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRel?dpRouteTaskId=" + dispatchIdSmall + "&statusArr=1,2").then(function (data) {
            if (data.success === true) {
                $scope.responseData = data.result;
                for(i=0;i<$scope.responseData.length;i++){
                    $scope.bigPrice  +=$scope.responseData[i].actual_price;
                }

            }
            else {
                swal(data.msg, "", "error");
            }
        });

    }

    //洗车费修改
    $scope.putWashCost = function (id,totalPrice){
        var obj = {
            "actualPrice": totalPrice
        };
        _basic.put($host.api_url + "/user/" + userId + "/loadTaskCleanRel/"+id, obj).then(function (data) {
            if (data.success == true) {
                washCarFee();
                swal("修改成功", "", "success");
            } else {
                washCarFee();
                swal(data.msg, "", "error");
            }
        })
    }

   /* // 获取已添加的关联任务信息
    $scope.getMatchMissionList = function () {
        _basic.get($host.api_url + "/dpRouteTaskLoanRel?dpRouteTaskLoanId=" + routeFeeId).then(function (data) {
            if (data.success === true) {
                $scope.matchMissionList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };*/

    // 点击保存
    $scope.grantRouteFeeInfo = function () {
        var totalCost = parseFloat($("#totalCost").html()).toFixed(2);
        _basic.put($host.api_url + "/user/" + userId + "/dpRouteTaskLoanGrant/" + routeFeeId,{
            driveId: $scope.routeFeeInfo.drive_id,
            truckId:$scope.routeFeeInfo.truck_id ,
            grantPassingCost: $scope.routeFeeInfo.grant_passing_cost,
            grantFuelCost: $scope.routeFeeInfo.grant_fuel_cost,
            grantProtectCost: $scope.routeFeeInfo.grant_protect_cost,
            grantPenaltyCost: $scope.routeFeeInfo.grant_penalty_cost,
            grantParkingCost: $scope.routeFeeInfo.grant_parking_cost,
            grantTaxiCost: $scope.routeFeeInfo.grant_taxi_cost,
            grantExplain: $scope.routeFeeInfo.grant_explain,
            grantActualMoney: parseFloat(totalCost),
            dpRouteTaskIds:[$scope.routeFeeInfo.dp_route_task_id]
        }).then(function (data) {
            if (data.success === true) {
                swal("保存成功", "", "success");
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击报销开启模态框
    $scope.reimbursementRouteFeeInfo = function () {
        $scope.repaymentMoneyMod = 0;
        $scope.profitCostMod = 0;
        $("#reimbursementCarFinanceModel").modal("open");
    };

    // 模态框内点击确定保存信息
    $scope.saveReimbursementInfo = function (taxiCostMod,parkingCostMod,fineCostMod,roadCostMod,fuelCostMod,roadTollCostMod) {
        var refundActualMoneyCost = parseFloat($("#reimbursement_money_mod").val()).toFixed(2);
        _basic.put($host.api_url + "/user/" + userId + "/dpRouteTaskLoanRepayment/" + routeFeeId,{
            refundPassingCost: roadTollCostMod,
            refundFuelCost: fuelCostMod,
            refundProtectCost: roadCostMod,
            refundPenaltyCost: fineCostMod,
            refundParkingCost:parkingCostMod,
            refundTaxiCost: taxiCostMod,
            repaymentMoney: $scope.repaymentMoneyMod,
            refundActualMoney: parseFloat(refundActualMoneyCost),
            profit: $scope.profitCostMod,
            refundExplain: $scope.remarkMod
        }).then(function (data) {
            if (data.success === true) {
                getCurrentRouteFeeInfo();
                $("#reimbursementCarFinanceModel").modal("close");
                swal("操作成功", "", "success");
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取数据
    $scope.queryData = function () {
       getCurrentRouteFeeInfo();
        washCarFee();
      /*  $scope.getMatchMissionList();*/
    };
    $scope.queryData();
}]);