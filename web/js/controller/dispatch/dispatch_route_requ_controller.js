app.controller("dispatch_route_requ_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    var userId = _basic.getSession(_basic.USER_ID);
    $scope.start = 0;
    $scope.size = 10;
    $scope.flag = true;
    // 查询调度列表
    function getCarInstructionList() {
        _basic.get($host.api_url + "/dpRouteTaskNotLoan?" + _basic.objToUrl({
            dpRouteTaskId: $scope.instructionNum,
            driveId: $scope.driverId,
            truckNum: $scope.truckNum,
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
                $scope.carInstructionList = data.result;
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
    $scope.searchCarInstructionList = function () {
        $scope.start = 0;
        getCarInstructionList();
    };


    // 打开申请出车款模态框
    $scope.addApplyRouteFeeMod = function () {
        $scope.flag = false;
        $scope.matchMissionList = [];
        $scope.driverIdMod = "";
        $scope.dispatchNumMod = "";
        $scope.roadTollCost = 0;
        $scope.fuelCost = 0;
        $scope.roadCost = 0;
        $scope.fineCost = 0;
        $scope.parkingCost = 0;
        $scope.taxiCost = 0;
        $scope.remark = "";
        $scope.planMoney = 0;
        $("#addCarFinanceModel").modal("open");
    };

    //打开申请出车款模态框(列表)
    $scope.addRouteFee = function (dispatchIdSmall,driveIdSmall) {
        $scope.flag = true;
        $scope.dispatchNumMod = "";
        $scope.roadTollCost = 0;
        $scope.fuelCost = 0;
        $scope.roadCost = 0;
        $scope.fineCost = 0;
        $scope.parkingCost = 0;
        $scope.taxiCost = 0;
        $scope.remark = "";
        $scope.planMoney = 0;
        $scope.dispatchNumMod  = dispatchIdSmall;
        $scope.driverIdModel  = driveIdSmall;
        _basic.get($host.api_url + "/dpRouteTask?driveId=" + driveIdSmall + "&taskStatusArr=1,2,3,4").then(function (data) {
            if (data.success === true) {
                $scope.missionList = data.result;
                $scope.matchMissionList = [];
                $scope.roadTollCost = 0;
                $scope.createMatchMissionCard();
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        $("#addCarFinanceModel").modal("open");

    };

    // 根据选择的司机id查询关联任务信息
    $scope.searchMatchMission = function () {
        _basic.get($host.api_url + "/dpRouteTask?driveId=" + $scope.driverIdMod + "&taskStatusArr=1,2,3,4").then(function (data) {
            if (data.success === true) {
                $scope.missionList = data.result;
                $scope.matchMissionList = [];
                $scope.roadTollCost = 0;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 选中关联任务后创建信息卡片
    $scope.createMatchMissionCard = function () {
        if ($scope.dispatchNumMod !== "") {
            // 检测数组中是否有和当前选中的相同的id
            function checkDispatchId(obj) {
                return obj.id === $scope.dispatchNumMod;
            }

            if ($scope.matchMissionList.some(checkDispatchId)) {
                swal("不能重复添加相同任务！", "", "warning");
            }
            else {
                // 根据选择的调度id查询调度详细信息
                _basic.get($host.api_url + "/dpRouteTask?dpRouteTaskId=" + $scope.dispatchNumMod).then(function (data) {
                    if (data.success === true) {
                        // console.log("data", data);
                        $scope.matchMissionList.push(data.result[0]);
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                }).then(function () {
                    // 根据新增的任务卡片计算过路费
                    var distanceCount = 0;
                    for (var i = 0; i < $scope.matchMissionList.length; i++) {
                        $scope.roadTollCost = (distanceCount += $scope.matchMissionList[i].distance) * 0.8
                    }
                });
            }
        }
        else{
            swal("请选择任务信息！", "", "warning");
        }
    };

    // 删除关联任务
    $scope.deleteMatchMissionMod = function (index) {
        swal({
                title: "确定删除当前任务吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function(){
                $scope.$apply(function () {
                    $scope.matchMissionList.splice(index, 1);
                    // 重新计算过路费
                    if($scope.matchMissionList.length === 0){
                        $scope.roadTollCost = 0
                    }
                    else{
                        var distanceCount = 0;
                        for (var i = 0; i < $scope.matchMissionList.length; i++) {
                            $scope.roadTollCost = (distanceCount += $scope.matchMissionList[i].distance) * 0.8
                        }
                    }
                });
            });
    };

    // 新增出车款信息
    $scope.addRouteFeeInfo = function () {
        var dpRouteTaskIds = [];
        var planMoneyCount = parseFloat($("#planMoney").html()).toFixed(2);
        if($scope.flag==true){
            if($scope.driverIdModel != "" && $scope.matchMissionList.length !== 0){
                for (var i = 0; i < $scope.matchMissionList.length; i++) {
                    dpRouteTaskIds.push($scope.matchMissionList[i].id)
                }
                _basic.post($host.api_url + "/user/" + userId + "/dpRouteTaskLoan",{
                    driveId: $scope.driverIdModel,
                    applyPassingCost: $scope.roadTollCost,
                    applyFuelCost: $scope.fuelCost,
                    applyProtectCost: $scope.roadCost,
                    applyPenaltyCost: $scope.fineCost,
                    applyParkingCost: $scope.parkingCost,
                    applyTaxiCost: $scope.taxiCost,
                    applyExplain: $scope.remark,
                    applyPlanMoney: parseFloat(planMoneyCount),
                    dpRouteTaskIds: dpRouteTaskIds
                }).then(function (data) {
                    if (data.success === true) {
                        $("#addCarFinanceModel").modal("close");
                        swal("新增成功", "", "success");
                        $scope.searchCarFinanceList();
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            }
            else{
                swal("请填写司机和调度编号！", "", "warning");
            }
        }
        else{
            if($scope.driverIdMod != "" && $scope.matchMissionList.length !== 0){
                for (var i = 0; i < $scope.matchMissionList.length; i++) {
                    dpRouteTaskIds.push($scope.matchMissionList[i].id)
                }
                _basic.post($host.api_url + "/user/" + userId + "/dpRouteTaskLoan",{
                    driveId: $scope.driverIdMod,
                    applyPassingCost: $scope.roadTollCost,
                    applyFuelCost: $scope.fuelCost,
                    applyProtectCost: $scope.roadCost,
                    applyPenaltyCost: $scope.fineCost,
                    applyParkingCost: $scope.parkingCost,
                    applyTaxiCost: $scope.taxiCost,
                    applyExplain: $scope.remark,
                    applyPlanMoney: parseFloat(planMoneyCount),
                    dpRouteTaskIds: dpRouteTaskIds
                }).then(function (data) {
                    if (data.success === true) {
                        // console.log("data", data);
                        $("#addCarFinanceModel").modal("close");
                        swal("新增成功", "", "success");
                        $scope.searchCarFinanceList();
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            }
            else{
                swal("请填写司机和调度编号！", "", "warning");
            }
        }

    };




    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - $scope.size;
        getCarInstructionList();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + $scope.size;
        getCarInstructionList();
    };


    // 获取所有司机信息
    function getDriverList() {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success === true) {
                $scope.driveList = data.result;
                for(var i =0;i< $scope.driveList.length;i++){
                    if( $scope.driveList[i].mobile==null){
                        $scope.driveList[i].mobile = '空';
                    }
                }
                $('#driver_name_mod').select2({
                    placeholder: '请选择司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#driver_name_model').select2({
                    placeholder: '请选择司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#driver_name').select2({
                    placeholder: '请选择',
                    containerCssClass : 'select2_dropdown'
                });
                $("#driver_name_mod").val(null).trigger("change");
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 获取数据
    $scope.queryData = function () {
        getCarInstructionList();
        getDriverList();
    };
    $scope.queryData();

}])