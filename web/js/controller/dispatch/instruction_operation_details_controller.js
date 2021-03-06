/**
 * Created by zcy on 2017/8/31.
 */
app.controller("instruction_operation_details_controller", ["$scope","$state", "$host", "$stateParams", "_basic", function ($scope, $state, $host, $stateParams, _basic) {
    $('ul.tabs').tabs();
    var truckId = $stateParams.truckId;
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.showDetails = false;
    $scope.vinNum = "";
    var carId=[];
    // 返回
    $scope.return = function () {
        $state.go($stateParams.from,{from:"instruction_operation_details"}, {reload: true})
    };


    // 根据点击的truckId查询当前司机信息
    $scope.getDriverInfo = function () {
        _basic.get($host.api_url + "/truckDispatch?dispatchFlag=1&truckId=" + truckId).then(function (driverData) {
            if (driverData.success === true) {
                if(driverData.result[0].current_city === 0){
                    driverData.result[0].operate_status = "在途"
                }
                else{
                    driverData.result[0].operate_status = "待运中"
                }
                // console.log("driverData",driverData);
                $scope.driverInfo = driverData.result[0];
            }
            else {
                swal(driverData.msg, "", "error");
            }
        });
    };

    // 获取所有非取消状态的指令操作信息
    $scope.getOperationInfo = function () {
        _basic.get($host.api_url + "/dpRouteTaskList?truckId=" + truckId + "&taskStatusArr=1,2,3,4,9").then(function (operateData) {
            if (operateData.success === true) {
                for(var i = 0;i < operateData.result.length;i++){
                    if(operateData.result[i].task_start_date === null){
                        operateData.result[i].task_start_date = "暂无";
                    }
                }
                $scope.operationList = operateData.result;
            }
            else {
                swal(operateData.msg, "", "error");
            }
        });
    };

    // 点击tab获取当前指令操作信息
    $scope.getCurrentOperationInfo = function (operationId) {
        _basic.get($host.api_url + "/dpRouteTaskList?dpRouteTaskId=" + operationId + "&truckId=" + truckId).then(function (currentOperateData) {
            if (currentOperateData.success === true) {
                $scope.currentOperateInfo = currentOperateData.result[0];
                $scope.getOperationMission(currentOperateData.result[0].id);
                $scope.showDetails = true;
            }
            else {
                swal(currentOperateData.msg, "", "error");
            }
        });
    };

    // 根据当前指令信息id获取任务信息
    $scope.getOperationMission = function (operationId) {
        _basic.get($host.api_url + "/dpRouteLoadTask?dpRouteTaskId=" + operationId).then(function (missionData) {
            if (missionData.success === true) {
                $scope.missionList = missionData.result;

            }
            else {
                swal(missionData.msg, "", "error");
            }
        });
    };

    // 点击接受指令，变为开始执行
    $scope.acceptInstruction = function () {
        _basic.put($host.api_url + "/user/" + userId + "/dpRouteTask/" + $scope.currentOperateInfo.id + "/taskStatus/2",{}).then(function (data) {
            if (data.success === true) {
                $scope.getCurrentOperationInfo($scope.currentOperateInfo.id)
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击开始执行，变为在途
    $scope.beginExecution = function () {
        _basic.put($host.api_url + "/user/" + userId + "/dpRouteTask/" + $scope.currentOperateInfo.id + "/taskStatus/3",{}).then(function (data) {
            if (data.success === true) {
                $scope.getCurrentOperationInfo($scope.currentOperateInfo.id);
                $scope.getOperationInfo();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击在途，变为完成
    $scope.onTheWay = function () {
        _basic.put($host.api_url + "/user/" + userId + "/dpRouteTask/" + $scope.currentOperateInfo.id + "/taskStatus/4",{}).then(function (data) {
            if (data.success === true) {
                $scope.getCurrentOperationInfo($scope.currentOperateInfo.id)
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击完成
    $scope.completeMission = function () {
        _basic.put($host.api_url + "/user/" + userId + "/dpRouteTask/" + $scope.currentOperateInfo.id + "/taskStatus/9",{}).then(function (data) {
            if (data.success === true) {
                $scope.getCurrentOperationInfo($scope.currentOperateInfo.id)
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };



    //从已接受调整为待接受
    $scope.changeTaskStatus2 =function(){

    }


   /* //从执行调整为已接受
    $scope.changeTaskStatus3 =function(){

    }*/
    //从在途调整为执行
    $scope.changeTaskStatus4 =function(){
        _basic.put($host.api_url + "/user/" + userId + "/dpRouteTask/" + $scope.currentOperateInfo.id + "/taskStatusBack/3?truckId="+$scope.currentOperateInfo.truck_id,{}).then(function (data) {
            if (data.success === true) {
                $scope.getCurrentOperationInfo($scope.currentOperateInfo.id)
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
   /* //从完成调整为在途
    $scope.changeTaskStatus5 =function(){

    }
*/






    // 点击任务获取装车信息
    $scope.showTruckLoadInfo = function (missionId) {
        _basic.get($host.api_url + "/dpRouteLoadTask/" + missionId + "/dpRouteLoadTaskDetail").then(function (loadData) {
            if (loadData.success === true) {
                $scope.loadList = loadData.result;
                carId=[];
                for(var i = 0;i < $scope.loadList.length;i++){
                    carId.push($scope.loadList[i].car_id);
                }
            }
            else {
                swal(loadData.msg, "", "error");
            }
        });
    };

    // 根据输入的VIN进行模糊查询
    $scope.searchMatchVin = function (routeId,addrId,loadTaskType) {
        if ($scope.vinNum!==""&&$scope.vinNum != undefined) {
            if ($scope.vinNum.length >= 6&&$scope.vinNum.length<=17) {
                if(loadTaskType==1){
                    _basic.get($host.api_url + "/carList?vinCode=" + $scope.vinNum + "&carStatusArr=1,2&start=0&size=5").then(function (data) {
                        if (data.success == true && data.result.length > 0) {
                            $scope.vin_msg = data.result;
                            var vinObjs = {};
                            for (var i in $scope.vin_msg) {
                                vinObjs[$scope.vin_msg[i].id+
                                '               '+$scope.vin_msg[i].vin +
                                '               '+ $scope.vin_msg[i].make_name +
                                '               '+ $scope.vin_msg[i].en_short_name +
                                '               '+ $scope.vin_msg[i].addr_name
                                    ] = null;
                            }
                            return vinObjs;
                        } else {
                            return {};
                        }
                    }).then(function (vinObjs) {
                        $('.autocomplete').autocomplete({
                            data: vinObjs,
                            minLength: 6
                        });
                        $('.autocomplete').focus();
                    })
                }
                else{
                    _basic.get($host.api_url + "/carList?vinCode=" + $scope.vinNum +'&newCurrentCityId='+routeId +'&newCurrentAddrId='+ addrId+ "&carStatusArr=1,2&start=0&size=5").then(function (data) {
                        if (data.success == true && data.result.length > 0) {
                            $scope.vin_msg = data.result;
                            var vinObjs = {};
                            for (var i in $scope.vin_msg) {
                                vinObjs[$scope.vin_msg[i].id+
                                '               '+$scope.vin_msg[i].vin +
                                '               '+ $scope.vin_msg[i].make_name +
                                '               '+ $scope.vin_msg[i].en_short_name +
                                '               '+ $scope.vin_msg[i].addr_name
                                    ] = null;
                            }
                            return vinObjs;
                        } else {
                            return {};
                        }
                    }).then(function (vinObjs) {
                        $('.autocomplete').autocomplete({
                            data: vinObjs,
                            minLength: 6
                        });
                        $('.autocomplete').focus();
                    })
                }
            }

            else if($scope.vinNum.length >17){
                $scope.carId=$scope.vinNum.split('   ')[0];
                $scope.codeVin=$scope.vinNum.split('   ')[5];
                if(loadTaskType==1){
                    _basic.get($host.api_url + "/carList?userId="+userId+"&vinCode=" + $scope.codeVin +'&carId='+$scope.carId +"&carStatusArr=1,2&start=0&size=5").then(function (data) {
                        if (data.success == true && data.result.length > 0) {
                            $scope.vin_msg = data.result;
                            var vinObjs = {};
                            for (var i in $scope.vin_msg) {
                                vinObjs[$scope.vin_msg[i].vin +
                                '   品牌:'+ $scope.vin_msg[i].make_name +
                                '   委托方:'+ $scope.vin_msg[i].en_short_name +
                                '   发运地:'+ $scope.vin_msg[i].addr_name+
                                '   carId:'+ $scope.vin_msg[i].id
                                    ] = null;
                            }
                            return vinObjs;
                        } else {
                            return {};
                        }
                    }).then(function (vinObjs) {
                        $('.autocomplete').autocomplete({
                            data: vinObjs,
                            minLength: 6
                        });
                        $('.autocomplete').focus();
                    })
                }
                else{
                    _basic.get($host.api_url + "/carList?userId="+userId+"&vinCode=" + $scope.codeVin +'&carId='+$scope.carId+'&newCurrentCityId='+routeId +'&newCurrentAddrId='+ addrId+ "&carStatusArr=1,2&start=0&size=5").then(function (data) {
                        if (data.success == true && data.result.length > 0) {
                            $scope.vin_msg = data.result;
                            var vinObjs = {};
                            for (var i in $scope.vin_msg) {
                                vinObjs[$scope.vin_msg[i].vin +
                                '   品牌:'+ $scope.vin_msg[i].make_name +
                                '   委托方:'+ $scope.vin_msg[i].en_short_name +
                                '   发运地:'+ $scope.vin_msg[i].addr_name+
                                '   carId:'+ $scope.vin_msg[i].id
                                    ] = null;
                            }
                            return vinObjs;
                        } else {
                            return {};
                        }
                    }).then(function (vinObjs) {
                        $('.autocomplete').autocomplete({
                            data: vinObjs,
                            minLength: 6
                        });
                        $('.autocomplete').focus();
                    })
                }
            }
            else {
                $('.autocomplete').autocomplete({minLength: 6});
                $scope.vin_msg = {}
            }
        }
    };

    // 查询输入的VIN是否存在
    $scope.checkVinNum = function (missionId) {
        if($scope.vinNum != ""){
            _basic.get($host.api_url + "/carList?carId="+$scope.carId + "&carStatusArr=1,2").then(function (checkData) {
                if (checkData.success === true) {
                    if(checkData.result.length === 0){
                        swal("查无此VIN信息或商品车不是待装车状态，不能进行装车", "", "error");
                    }
                    else{
                        $scope.addLoadCar(checkData.result[0].id,missionId)
                    }
                }
                else {
                    swal(checkData.msg, "", "error");
                }
            });
        }
        else{
            swal("请输入VIN", "", "warning");
        }
    };

    // 新增装车数
    $scope.addLoadCar = function (carId,missionId) {
        _basic.post($host.api_url + "/user/" + userId + "/dpRouteLoadTask/" + missionId + "/dpRouteLoadTaskDetail?truckId=" + truckId+'&dpRouteTaskId='+$scope.currentOperateInfo.id,{
            carId:carId,
            vin:$scope.codeVin
          /*  dpRouteTaskId: $scope.currentOperateInfo.id*/
        }).then(function (addLoadData) {
            if (addLoadData.success === true) {
                $scope.showTruckLoadInfo(missionId);
                $scope.vinNum = "";
                swal("装车成功", "", "success");
            }
            else {
                swal(addLoadData.msg, "", "error");
            }
        });
    };

    // 删除装车数
    $scope.deleteLoadCar = function (carId,detailId,missionId) {
        swal({
                title: "确定删除当前装车吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
        }).then(function (result) {
            if (result.value) {
                _basic.delete($host.api_url + "/user/" + userId + "/dpRouteTaskDetail/" + detailId + "?truckId=" + truckId + "&carId=" + carId).then(function (delLoadData) {
                    if (delLoadData.success === true) {
                        $scope.showTruckLoadInfo(missionId);
                        swal("删除成功", "", "success");
                    }
                    else {
                        swal(delLoadData.msg, "", "error");
                    }
                });
            }
        })
    }
    // 完成装车
    $scope.completeLoadCar = function (missionId) {
        _basic.put($host.api_url + "/user/" + userId + "/dpRouteLoadTask/" + missionId + "/loadTaskStatus/3",{}).then(function (completeData) {
            if (completeData.success === true) {
                // 刷新任务状态
               /* $scope.getOperationMission($scope.currentOperateInfo.id);*/
                $scope.getCurrentOperationInfo($scope.currentOperateInfo.id)
                swal("完成装车", "", "success");
            }
            else {
                swal(completeData.msg, "", "error");
            }
        });
    };
    /*//调整为未装车
    $scope.changeLoadCarStatus =function (missionId){
        _basic.put($host.api_url + "/user/" + userId + "/dpRouteLoadTask/" + missionId + "/loadTaskStatusBack/1",{}).then(function (completeData) {
            if (completeData.success === true) {
                $scope.getCurrentOperationInfo($scope.currentOperateInfo.id)
                swal("调整为未装车成功！", "", "success");
            }
            else {
                swal(completeData.msg, "", "error");
            }
        });



    }*/

    //调整为车辆未装车
    $scope.changeCarNoArr =function (missionId){
        _basic.put($host.api_url + "/user/" + userId + "/dpRouteLoadTask/" + missionId + "/loadTaskStatusBack/1",{
            carIds: carId
        }).then(function (completeData) {
            if (completeData.success === true) {
                $scope.getCurrentOperationInfo($scope.currentOperateInfo.id);
                swal("调整为未装车成功！", "", "success");
            }
            else {
                swal(completeData.msg, "", "error");
            }
        });
    }


    // 点击确认车辆送达
    $scope.vehicleDelivery = function (loadId,missionId) {
        swal({
                title: "确认车辆送达？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
        }).then(
            function(result){
                if (result.value) {
                    _basic.put($host.api_url + "/user/" + userId + "/dpRouteTaskDetail/" + loadId + "/carLoadStatus/2?truckId=" + truckId, {}).then(function (data) {
                        if (data.success === true) {
                            $scope.showTruckLoadInfo(missionId);
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });
    };

    // 点击出现异常
    $scope.AbnormalOccurrence = function (carId,missionId) {
        swal({
                title: "确定进入异常状态吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
        }).then(
            function(result){
                if (result.value) {
                    _basic.post($host.api_url + "/user/" + userId + "/carExceptionRel", {
                        carId: carId,
                        remark: ""
                    }).then(function (data) {
                        if (data.success === true) {
                            $scope.showTruckLoadInfo(missionId);
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });
    };

    // // 点击出现异常，显示模态框
    // $scope.AbnormalOccurrence = function () {
    //     $('#abnormalModel').modal('open');
    // };
    //
    // // 提交文字描述和照片
    // $scope.submitInfo = function () {
    //
    // };
    //
    // // 关闭模态框
    // $scope.closeModel = function () {
    //     $('#abnormalModel').modal('close');
    // };

    // 完成配送
    $scope.completeSendCar = function (missionId) {
        _basic.put($host.api_url + "/user/" + userId + "/dpRouteLoadTask/" + missionId + "/loadTaskStatus/7",{}).then(function (sendData) {
            if (sendData.success === true) {
                // console.log("sendData",sendData);
                // 刷新任务状态
                $scope.getOperationMission($scope.currentOperateInfo.id);
                swal("完成配送", "", "success");
            }
            else {
                swal(sendData.msg, "", "error");
            }
        });
    };



    // 获取数据
    $scope.queryData = function () {
        $scope.getOperationInfo();
        $scope.getDriverInfo();
    };
    $scope.queryData();
}]);