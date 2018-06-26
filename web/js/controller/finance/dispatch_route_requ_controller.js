app.controller("dispatch_route_requ_controller", ["$scope", "$host", "_basic","_config",  function ($scope, $host, _basic,_config) {

    var userId = _basic.getSession(_basic.USER_ID);
    $scope.start = 0;
    $scope.size = 11;
    $scope.truckId = '';

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

    // 查询调度列表
    function getCarInstructionList() {
        _basic.get($host.api_url + "/dpRouteTaskNotLoan?" + _basic.objToUrl({
            taskStatusArr:8,
            dpRouteTaskId: $scope.instructionNum,
            driveId: $scope.driverId,
            truckNum: $scope.truckNum,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                $scope.carInstructionBoxArray = data.result;
                $scope.carInstructionList = $scope.carInstructionBoxArray.slice(0, 10);
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

/*
    // 打开申请出车款模态框
    $scope.addApplyRouteFeeMod = function () {
        $scope.flag = false;
        $scope.missionList=[];
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
    };*/

    //打开申请出车款模态框(列表)
    $scope.addRouteFee = function (dispatchIdSmall,driveIdSmall) {
        $scope.flag = true;
        $scope.roadTollCost = 0;
        $scope.fuelCost = 0;
        $scope.roadCost = 0;
        $scope.fineCost = 0;
        $scope.parkingCost = 0;
        $scope.taxiCost = 0;
        $scope.remark = "";
        $scope.planMoney = 0;
        $scope.bigPrice = 0;
        $scope.driveIdSmall= driveIdSmall;
        $scope.dispatchIdSmall=dispatchIdSmall;

        //司机 车牌号 挂车货位
        _basic.get($host.api_url + "/drive?driveId=" + driveIdSmall).then(function (data) {
            if (data.success === true) {
                if(data.result.length==0){
                    $scope.driveSmallList=[];
                    $scope.truckId ='';
                }else{
                    $scope.driveSmallList = data.result[0];
                    $scope.truckId = data.result[0].truck_id;
                }

            }
        });

        //状态 调度编号 路线 计划装车数 计划执行时间
        _basic.get($host.api_url + "/dpRouteTaskNotLoan?dpRouteTaskId=" + dispatchIdSmall + "&taskStatusArr=8").then(function (data) {
            if (data.success === true) {
                if(data.result.length==0){
                    $scope.missionList = {};
                }else {
                    $scope.missionList = data.result[0];
                    $scope.roadTollCost = data.result[0].distance*0.8;
                    if(data.result[0].protect_fee ==null||data.result[0].protect_fee ==0){
                        $scope.roadCost = 0;
                    }else{
                        $scope.roadCost = data.result[0].protect_fee;
                    }
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        washCarFee();
        $("#addCarFinanceModel").modal("open");

    };
    //获取洗车费
    function washCarFee(){
        $scope.totalPrice=0;
        $scope.bigPrice =0;
        //洗车费
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRel?dpRouteTaskId=" + $scope.dispatchIdSmall + "&statusArr=1,2").then(function (data) {
            if (data.success === true) {
                $scope.responseData = data.result;
                for(i=0;i<$scope.responseData.length;i++){
                    $scope.totalPrice  =$scope.responseData[i].actual_price;
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


    //出车款发放
    $scope.addRouteFeeInfo = function(){
        var planMoneyCount = parseFloat($("#planMoney").html()).toFixed(2);
        // 根据选择的调度id查询调度详细信息
        _basic.post($host.api_url + "/user/" + userId + "/dpRouteTaskLoan",{
            driveId: $scope.driveIdSmall,
            truckId: $scope.truckId,
            grantPassingCost: $scope.roadTollCost,
            grantFuelCost: $scope.fuelCost,
            grantProtectCost: $scope.roadCost,
            grantPenaltyCost: $scope.fineCost,
            grantParkingCost: $scope.parkingCost,
            grantTaxiCost: $scope.taxiCost,
            grantExplain: $scope.remark,
            grantActualMoney: parseFloat(planMoneyCount),
            dpRouteTaskIds: [$scope.dispatchIdSmall]
        }).then(function (data) {
            if (data.success === true) {
                $("#addCarFinanceModel").modal("close");
                swal("新增成功", "", "success");
              /*  $scope.searchCarInstructionList();*/
                getCarInstructionList();

            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }



    /*// 根据选择的司机id查询关联任务信息
    $scope.searchMatchMission = function () {
        _basic.get($host.api_url + "/dpRouteTaskNotLoan?driveId=" + $scope.driverIdMod + "&taskStatusArr=8").then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                $scope.missionList = data.result;
                $scope.matchMissionList = [];
                $scope.roadTollCost = 0;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };*/

  /*  // 选中关联任务后创建信息卡片
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
                _basic.get($host.api_url + "/dpRouteTaskNotLoan?dpRouteTaskId=" + $scope.dispatchNumMod).then(function (data) {
                    if (data.success === true) {
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
            if( $scope.driveIdSmall != "" && $scope.matchMissionList.length !== 0){
                for (var i = 0; i < $scope.matchMissionList.length; i++) {
                    dpRouteTaskIds.push($scope.matchMissionList[i].id)
                }
                _basic.post($host.api_url + "/user/" + userId + "/dpRouteTaskLoan",{
                    driveId: $scope.driveIdSmall,
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
                        $scope.searchCarInstructionList();

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
                        $("#addCarFinanceModel").modal("close");
                        swal("新增成功", "", "success");
                        $scope.searchCarInstructionList();
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
*/



    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        getCarInstructionList();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        getCarInstructionList();
    };



    // 获取数据
    $scope.queryData = function () {
        getCarInstructionList();
        getDriverList();
    };
    $scope.queryData();

}])