app.controller("dispatch_route_requ_controller", ["$scope", "$host","$state", "_basic", "_config",  function ($scope, $host,$state, _basic,_config) {

    var userId = _basic.getSession(_basic.USER_ID);
    $scope.start = 0;
    $scope.size = 11;
    $scope.truckId = '';
    $scope.passingCost=_config.passingCost;
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
        $scope.hotelCost = 0;
        $scope.carCost = 0;
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
                    $scope.roadTollCost = data.result[0].distance*$scope.passingCost;
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
        $scope.bigPrice =0;
        if(  $scope.dispatchIdSmall==''||  $scope.dispatchIdSmall==null||  $scope.dispatchIdSmall==undefined){
            $scope.responseData=[];
        }else {
            //洗车费
            _basic.get($host.api_url + "/dpRouteLoadTaskCleanRel?dpRouteTaskId=" + $scope.dispatchIdSmall + "&statusArr=1,2").then(function (data) {
                if (data.success === true) {
                    $scope.responseData = data.result;
                    for (i = 0; i < $scope.responseData.length; i++) {
                        $scope.bigPrice += $scope.responseData[i].actual_price+$scope.responseData[i].actual_guard_fee;
                    }

                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
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


    //出车款发放
    $scope.addRouteFeeInfo = function(){
        //出车款状态修改
        if( $scope.responseData.length==0){
        }else{
            _basic.put($host.api_url + "/user/" + userId + "/dpRouteTask/" + $scope.dispatchIdSmall+'/status/2',{}).then(function (data) {
                if (data.success == true) {
                } else {
                    swal(data.msg, " ", "error");
                }
            })
        }

        var planMoneyCount = parseFloat($("#planMoney").html()).toFixed(2);
        if ($scope.truckId==  "") {
            $scope.truckId= 0;
        }
        var obj={
            driveId: $scope.driveIdSmall,
            truckId: $scope.truckId,
            grantPassingCost: $scope.roadTollCost,
            grantFuelCost: $scope.fuelCost,
            grantProtectCost: $scope.roadCost,
            grantPenaltyCost: $scope.fineCost,
            grantParkingCost: $scope.parkingCost,
            grantTaxiCost: $scope.taxiCost,
            grantHotelCost: $scope.hotelCost,
            grantCarCost: $scope.carCost,
            grantExplain: $scope.remark,
            grantActualMoney: parseFloat(planMoneyCount),
            dpRouteTaskIds: [$scope.dispatchIdSmall]
        }
        // 根据选择的调度id查询调度详细信息
        _basic.post($host.api_url + "/user/" + userId + "/dpRouteTaskLoan",obj).then(function (data) {
            if (data.success === true) {
                $("#addCarFinanceModel").modal("close");
                getCarInstructionList();
                $state.go('finance_route_fee_details', {
                    reload: true,
                    id:data.id,
                    dpId:$scope.dispatchIdSmall,
                    from: 'dispatch_route_requ'
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

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