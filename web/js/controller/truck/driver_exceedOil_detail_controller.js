app.controller("driver_exceedOil_detail_controller", ["$scope", "$state","$stateParams", "_basic", "_config", "$host", function ($scope, $state,$stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    var exceedOilId = $stateParams.id;
    var driveId = $stateParams.driveId;

    // 返回
    $scope.return = function () {
        $state.go($stateParams.from,{from:"driver_exceedOil_detail"}, {reload: true})
    };



    // 获取任务信息
    function getOilRel() {
        //司机  核油日期   数量
        _basic.get($host.api_url + "/driveExceedOil?exceedOilId="+exceedOilId).then(function (data) {
            if (data.success === true) {
                $scope.exceedOilItem = data.result[0];
                $scope.overOil=$scope.exceedOilItem.actual_oil - $scope.totalOil;
                $scope.overUrea=$scope.exceedOilItem.actual_urea - $scope.totalUrea;

            }
            else {
                swal(data.msg, "", "error");
            }
        });


        // 未扣款任务
        _basic.get($host.api_url + "/dpRouteTaskOilRel?settleStatus=1&driveId=" + driveId ).then(function (data) {
            if (data.success === true) {
                $scope.unOilRelList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 扣款任务
        _basic.get($host.api_url + "/driveDpRouteTaskOilRel?driveExceedOilId="+exceedOilId).then(function (data) {
            if (data.success === true) {
                $scope.totalOil=0;
                $scope.totalUrea =0;
                $scope.OilRelList = data.result;
                for (var i = 0; i < $scope.OilRelList.length; i++) {
                    $scope.totalOil = $scope.totalOil+$scope.OilRelList[i].total_oil;
                    $scope.totalUrea = $scope.totalUrea+$scope.OilRelList[i].urea;

                }

            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };



    //添加未扣款任务到扣款任务
    $scope.addOilRel =function(id){
        _basic.post($host.api_url + "/user/" + userId + "/driveDpRouteTaskOilRel",{
            dpRouteTaskOilRelId: id,
            driveExceedOilId: exceedOilId
        }).then(function (data) {
            if (data.success === true) {
                swal("操作成功", "", "success");
                getOilRel();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };



    // 移除当前扣款任务到未扣款任务
    $scope.deleteOilRel = function (id) {
        swal({
            title: "确定移除当前扣款任务？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消"
        }).then(
            function(result){
                if (result.value) {
                    _basic.delete($host.api_url + "/user/" + userId + "/dpRouteTaskOilRel/" + id + "/driveExceedOil/" + exceedOilId).then(function (data) {
                        if (data.success === true) {
                            getOilRel();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });

    };



    // 任务详情
    $scope.showDispatchMissionModal = function (salaryInfo) {
        $scope.salaryInfo = salaryInfo;
        //获取装车任务信息
        _basic.get($host.api_url + "/dpRouteLoadTask?dpRouteTaskId=" + salaryInfo.dp_route_task_id).then(function (data) {
            if (data.success === true) {
                $scope.lineList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        $("#dispatchMissionModal").modal("open");
    };



    //添加实际用油量  实际尿素量   实际金额
    $scope.putTotalInfo = function (){
        _basic.put($host.api_url + "/user/" + userId + "/exceedOil/" + exceedOilId,{
            planOil: $scope.totalOil,
            planUrea: $scope.totalUrea,
            actualOil: $scope.exceedOilItem.actual_oil,
            actualUrea:$scope.exceedOilItem.actual_urea,
            exceedOil: $scope.exceedOilItem.actual_oil-$scope.totalOil,
            exceedUrea: $scope.exceedOilItem.actual_urea- $scope.totalUrea,
            actualMoney:$scope.exceedOilItem.actual_money,
            remark:$scope.exceedOilItem.remark
        }).then(function (data) {
            if (data.success === true) {
                swal("保存成功", "", "success");
                getOilRel();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };


    $scope.endOfProcessing =function (){
        swal({
            title: "确定处理结束吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消"
        }).then(
            function(result){
                if (result.value) {
                    _basic.put($host.api_url + "/user/" + userId + "/exceedOil/" + exceedOilId,{
                        planOil: $scope.totalOil,
                        planUrea: $scope.totalUrea,
                        actualOil: $scope.exceedOilItem.actual_oil,
                        actualUrea:$scope.exceedOilItem.actual_urea,
                        exceedOil: $scope.exceedOilItem.actual_oil-$scope.totalOil,
                        exceedUrea: $scope.exceedOilItem.actual_urea- $scope.totalUrea,
                        actualMoney:$scope.exceedOilItem.actual_money,
                        remark:$scope.exceedOilItem.remark
                    }).then(function (data) {
                        if (data.success === true) {
                            swal("处理成功", "", "success");
                            getOilRel();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });

                    _basic.put($host.api_url + "/user/" + userId + "/exceedOil/" + exceedOilId + "/oilStatus/2", {}).then(function (data) {
                        if (data.success === true) {
                            swal("处理成功", "", "success");
                            getOilRel();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });
    }


    getOilRel();

}]);