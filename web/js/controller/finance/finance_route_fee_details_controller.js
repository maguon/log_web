app.controller("finance_route_fee_details_controller", ["$scope", "$state","$stateParams", "$host", "_basic",  "_config",function ($scope, $state,$stateParams, $host, _basic,_config) {

    var userId = _basic.getSession(_basic.USER_ID);
    var routeFeeId = $stateParams.id;
    $scope.dpRouteTaskIds=[];
    $scope.passingCost=_config.passingCost;

    $scope.return = function(){
        $state.go($stateParams.from,{from:"finance_route_fee_details"}, {reload: true})
    }
    // 获取当前出车款详情信息
   function getCurrentRouteFeeInfo() {
        _basic.get($host.api_url + "/dpRouteTaskLoan?dpRouteTaskLoanId=" + routeFeeId).then(function (data) {
            if (data.success === true) {
                if(data.result.length==0){
                    $scope.routeFeeInfo = [];
                }else{
                    $scope.routeFeeInfo = data.result[0];
                    $scope.routeFeeInfo.drive_id = data.result[0].drive_id;
                    $scope.routeFeeInfo.truck_id = data.result[0].truck_id;
                    searchMatchMission();
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };


    // 根据选择的司机id查询关联任务信息
    function  searchMatchMission(){
        _basic.get($host.api_url + "/dpRouteTaskNotLoan?driveId=" +  $scope.routeFeeInfo.drive_id + "&taskStatusArr=8").then(function (data) {
            if (data.success === true) {
                if(data.result.length==0){
                    $scope.missionList =[];
                }else{
                    $scope.missionList = data.result;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取已添加的关联任务信息
    function getMatchMissionCar() {
        _basic.get($host.api_url + "/dpRouteTaskLoanRel?dpRouteTaskLoanId=" + routeFeeId).then(function (data) {
            if (data.success === true) {
                if(data.result.length==0){
                    $scope.matchMissionList =[];
                }else {
                    $scope.matchMissionList = data.result;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    //添加或者删除调度时，费用的变化
    function getMatchMissionList() {
        _basic.get($host.api_url + "/dpRouteTaskLoanRel?dpRouteTaskLoanId=" + routeFeeId).then(function (data) {
            if (data.success === true) {
                if(data.result.length==0){
                    $scope.matchMissionList =[];
                }else{
                    $scope.matchMissionList = data.result;
                    $scope.routeFeeInfo.grant_passing_cost=0;
                    $scope.routeFeeInfo.grant_protect_cost=0;
                    for(var i = 0;i<  $scope.matchMissionList.length;i++){
                        if($scope.matchMissionList[i].protect_fee==null){
                            $scope.matchMissionList[i].protect_fee=0;
                        }
                        $scope.routeFeeInfo.grant_passing_cost += $scope.matchMissionList[i].distance*$scope.passingCost;
                        $scope.routeFeeInfo.grant_protect_cost += $scope.matchMissionList[i].protect_fee;
                    }
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    //获取洗车费
    function washCarFee(){
        $scope.bigPrice =0;
        //洗车费
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRel?dpRouteTaskLoanId=" + routeFeeId + "&statusArr=1,2").then(function (data) {
            if (data.success === true) {
                if(data.result.length==0){
                    $scope.responseData =[];
                }else{
                    $scope.responseData = data.result;
                    for(var i = 0;i<  $scope.responseData.length;i++){
                        $scope.bigPrice += $scope.responseData[i].actual_price+$scope.responseData[i].actual_guard_fee;
                    }

                }

            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //洗车费修改
    $scope.putWashCost = function (id,totalPrice,guardFee){
        var obj = {
            actualPrice: totalPrice,
            actualGuardFee:guardFee
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


    // 新增关联任务
    $scope.createMatchMissionCard = function (dispatchNum) {
        $scope.dispatchNum=dispatchNum;
        if(dispatchNum !== ""){
            // 检测是否有相同的关联任务
            function checkDispatchId(obj) {
                return obj.dp_route_task_id === dispatchNum;
            }
            if ($scope.matchMissionList.some(checkDispatchId)) {
                swal("不能重复添加相同任务！", "", "warning");
            }
            else{
                _basic.post($host.api_url + "/user/" + userId + "/dpRouteTaskLoanRel",{
                    dpRouteTaskLoanId: routeFeeId,
                    dpRouteTaskId: dispatchNum
                }).then(function (data) {
                    if (data.success === true) {
                        swal("新增成功", "", "success");
                        washCarFee();
                        getMatchMissionList();
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
                text: "",
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
                        swal("删除成功", "", "success");
                        washCarFee();
                        getMatchMissionList();
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            });
    };

    // 点击保存
    $scope.grantRouteFeeInfo = function () {
        var totalCost = parseFloat($("#totalCost").html()).toFixed(2);
        _basic.put($host.api_url + "/user/" + userId + "/dpRouteTaskLoanGrant/" + routeFeeId,{
            driveId: $scope.routeFeeInfo.drive_id,
            truckId:$scope.routeFeeInfo.truck_id ,
            grantPassingCost: $scope.routeFeeInfo.grant_passing_cost,
            grantFuelCost:$scope.routeFeeInfo.grant_fuel_cost,
            grantProtectCost: $scope.routeFeeInfo.grant_protect_cost,
            grantPenaltyCost:$scope.routeFeeInfo.grant_penalty_cost,
            grantParkingCost: $scope.routeFeeInfo.grant_parking_cost,
            grantTaxiCost: $scope.routeFeeInfo.grant_taxi_cost,
            grantHotelCost: $scope.routeFeeInfo.grant_hotel_cost,
            grantCarCost: $scope.routeFeeInfo.grant_car_cost,
            grantExplain: $scope.routeFeeInfo.grant_explain,
            grantActualMoney: parseFloat(totalCost),
            dpRouteTaskIds:[$scope.dpRouteTaskIds]
        }).then(function (data) {
            if (data.success === true) {
                getMatchMissionCar();
                getCurrentRouteFeeInfo();
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
        $scope.roadCostMod=$scope.routeFeeInfo.grant_passing_cost;
        $scope.fuelCostMod=$scope.routeFeeInfo.grant_fuel_cost;
        $scope.roadTollCostMod=$scope.routeFeeInfo.grant_protect_cost;
        $scope.fineCostMod=$scope.routeFeeInfo.grant_penalty_cost;
        $scope.parkingCostMod=$scope.routeFeeInfo.grant_parking_cost;
        $scope.taxiCostMod=$scope.routeFeeInfo.grant_taxi_cost;
        $scope.hotelCostMod=$scope.routeFeeInfo.grant_hotel_cost;
        $scope.carCostMod=$scope.routeFeeInfo.grant_car_cost;
        $scope.enterCostMod = 0;
        $scope.runCostMod= 0;
        $scope.trailerCostMod= 0;
        $scope.repairCostMod= 0;
        $scope.careCostMod= 0;
    };

    // 模态框内点击确定保存信息
    $scope.saveReimbursementInfo = function (roadCostMod,fuelCostMod,roadTollCostMod,fineCostMod,parkingCostMod,taxiCostMod,hotelCostMod,carCostMod,enterCostMod,runCostMod,trailerCostMod,repairCostMod,careCostMod) {
        var refundActualMoneyCost = parseFloat($("#reimbursement_money_mod").val()).toFixed(2);
        _basic.put($host.api_url + "/user/" + userId + "/dpRouteTaskLoanRepayment/" + routeFeeId,{
            refundPassingCost:  roadCostMod,
            refundFuelCost: fuelCostMod,
            refundProtectCost:roadTollCostMod,
            refundPenaltyCost: fineCostMod,
            refundParkingCost:parkingCostMod,
            refundTaxiCost: taxiCostMod,
            refundHotelCost: hotelCostMod,
            refundCarCost: carCostMod,
            refundEnterCost:enterCostMod,
            refundRunCost: runCostMod,
            refundTrailerCost:trailerCostMod,
            refundRepairCost: repairCostMod,
            refundCareCost: careCostMod,
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
        getMatchMissionCar();
    };
    $scope.queryData();
}]);