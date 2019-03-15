/**
 * Restructure by zcy on 2018/2/5.
 */
app.controller("truck_repair_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope, $state, $stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    var truckId = $stateParams.id;
    $scope.truckType = $stateParams.type;
    $scope.showAccidentRepair = true;
    $scope.connectAccident = false;


    // 点击返回按钮返回之前页面
    $scope.return = function () {
        $state.go($stateParams.from,{from:'truck_repair'}, {reload: true});
    };

    // 判断车辆类型获取头车或挂车详细信息
    $scope.getCurrentTruckDetails = function () {
        if($scope.truckType == 1){
            _basic.get($host.api_url + "/truckFirst?truckId=" + truckId).then(function (data) {
                if (data.success === true) {
                    // console.log("头车",data);
                    $scope.truckMessage = data.result[0];
                }
                else {
                    swal(data.msg, "", "error")
                }
            });
        }
        else{
            _basic.get($host.api_url + "/truckTrailer?truckId=" + truckId).then(function (data) {
                if (data.success === true) {
                    // console.log("挂车",data);
                    $scope.truckMessage = data.result[0];
                }
                else {
                    swal(data.msg, "", "error")
                }
            });
        }
    };

    // 根据车辆id查询维修详情
    $scope.getCurrentRepairInfo = function () {
        $scope.repairingList = [];
        $scope.repairedList = [];
        _basic.get($host.api_url + "/truckRepairRel?" + _basic.objToUrl({
            truckId: truckId
        })).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                for (var i = 0; i < data.result.length; i++) {
                    if(data.result[i].repair_status == 0){
                        $scope.repairingList.push(data.result[i]);
                        data.result[i].repair_type = data.result[i].repair_type.toString();
                    }
                    else{
                        $scope.repairedList.push(data.result[i]);
                    }

                    if(data.result[0].repair_type == 1){
                        $scope.connectAccident = true;
                    }
                }
                // console.log("repairingList",$scope.repairingList);
                // console.log("repairedList",$scope.repairedList);
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取当前id关联事故列表
    $scope.getAllAccidentInfo = function () {
        _basic.get($host.api_url + "/truckAccident?truckId=" + truckId).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                if(data.result.length === 0){
                    $scope.hasNotAccident = true;
                }
                else{
                    $scope.hasNotAccident = false;
                }
                $scope.accidentNumList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击维修类型决定事故详情显示或隐藏
    $scope.isCheckAssociatedAccident = function (repairingItem) {
        if(repairingItem == 1){
            $scope.connectAccident = true;
        }
        else{
            $scope.connectAccident = false;
        }
    };

    // 保存修改后的维修信息
    $scope.saveRepairInfo = function(repairObj){
        var paramObj;
        var condition;
        // 根据不同的事故状态传不同的参数走不同的判断条件
        if($scope.connectAccident){
            paramObj = {
                repairType: repairObj.repair_type,
                repairReason: repairObj.repair_reason
            };
            condition = (repairObj.repair_type !== "" && repairObj.repair_reason !== "");
        }
        else{
            paramObj = {
                repairType: repairObj.repair_type,
                accidentId: repairObj.accident_id,
                repairReason: repairObj.repair_reason
            };
            condition = (repairObj.repair_type !== "" && repairObj.accident_id !== "" && repairObj.repair_reason !== "");
        }
        if(condition){
            _basic.put($host.api_url + "/user/" + userId + "/truckRepairRelBase/" + repairObj.id,{
                repairType: repairObj.repair_type,
                accidentId: repairObj.accident_id,
                repairReason: repairObj.repair_reason
            }).then(function (data) {
                if (data.success === true) {
                    // console.log("data", data);
                    swal("保存成功！", "", "success");
                    $scope.getCurrentRepairInfo();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请填写完整信息", "", "warning");
        }

    };

    // 获取维修站信息并打开维修结束模态框
    $scope.finishRepairInfo = function (relId) {
        $scope.relId = relId;
        // $scope.$scope.repairStation = "";
        $scope.repairDescription = "";
        $scope.repairMoney = 0;
        _basic.get($host.api_url + "/repairStation?repairSationStatus=1").then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                $scope.repairStationList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        $('#repairFinishMod').modal('open');
    };

    // 模态框内确认维修结束
    $scope.completeRepairInfo = function () {
        if($scope.relId !== "" && $scope.repairStation != null && $scope.repairMoney !== 0){
            swal({
                    title: "确定结束维修吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确认",
                    cancelButtonText: "取消"
                }).then(
                function(result){
                    if (result.value) {
                        _basic.put($host.api_url + "/user/" + userId + "/truckRepairRel/" + $scope.relId, {
                            repairStationId: $scope.repairStation,
                            remark: $scope.repairDescription,
                            repairMoney: $scope.repairMoney
                        }).then(function (data) {
                            if (data.success === true) {
                                // console.log("data", data);
                                $('#repairFinishMod').modal('close');
                                $scope.getCurrentRepairInfo();
                            }
                            else {
                                swal(data.msg, "", "error");
                            }
                        });
                    }
                });
        }
        else{
            swal("请填写完整信息！", "", "warning");
        }
    };


    // 获取数据
    $scope.queryData = function () {
        $scope.getCurrentTruckDetails();
        $scope.getCurrentRepairInfo();
        $scope.getAllAccidentInfo();
    };
    $scope.queryData();
}]);