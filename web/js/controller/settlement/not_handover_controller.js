app.controller("not_handover_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    $scope.start = 0;
    $scope.size = 11;
    $("#pre").hide();
    $("#next").hide();
    // 信息获取
    function getMsg() {
        // 委托方
        _basic.get($host.api_url + "/entrust").then(function (data) {
            if (data.success == true) {
                $scope.get_entrust = data.result;
            }
        })
        //  城市信息获取
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.get_city = data.result;
                $('#chooseEndCity').select2({
                    placeholder: '目的地城市',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
        });
        //获取司机
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
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    //未返回还车辆
    function getNum() {
        if ($scope.planTimeStart == undefined || $scope.planTimeEnd == undefined) {
            $scope.getNum =0;
        }
        else{
            _basic.get($host.api_url + "/notSettleHandoverCarCount?transferFlag=0&carLoadStatus=2&taskPlanDateStart="+$scope.planTimeStart +"&taskPlanDateEnd="+ $scope.planTimeEnd)
                .then(function (data) {
                    if (data.success === true) {
                        $scope.getNum=data.result[0].car_count;
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
        }

    };

    // 目的地城市-经销商联动
    $scope.get_received = function (id) {
        _basic.get($host.api_url + "/receive?cityId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.get_receive = data.result;
            } else {
                swal(data.msg, "", "error")
            }
        })
    };
    // 数据导出
    $scope.export = function () {
        if ($scope.planTimeStart == undefined || $scope.planTimeEnd == undefined) {
            swal('请输入完整的查询时间', "", "error");
        }
        else {
            var obj = {
                carLoadStatus: 2,
                vinCode: $scope.VIN,
                entrustId: $scope.client,
                routeEndId: $scope.arrive_city,
                receiveId: $scope.receiveId,
                dpRouteTaskId: $scope.instructionNum,
                driveId: $scope.driverIdMod,
                receivedDateStart: $scope.planTimeStart,
                receivedDateEnd: $scope.planTimeEnd

            };
            swal({
                    title: "确定导出未返还交接单表？",
                    text: "",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
            }).then(
                function (result) {
                    if (result.value) {
                        window.open($host.api_url + "/notSettleHandover.csv?" + _basic.objToUrl(obj));
                    }
                })
        }
    }

    //查询
    $scope.getNotHandoverInfo = function () {
        $scope.start = 0;
        getNum();
        getNotHandover();
    }

    function  getNotHandover() {
        if ($scope.planTimeStart == undefined || $scope.planTimeEnd == undefined) {
            swal('请输入完整的查询时间', "", "error");
            $scope.notHandoverArray = [];
        }
        else {
            _basic.get($host.api_url + "/notSettleHandover?transferFlag=0&" + _basic.objToUrl({
                carLoadStatus: 2,
                vinCode: $scope.VIN,
                entrustId: $scope.client,
                routeEndId: $scope.arrive_city,
                receiveId: $scope.receiveId,
                dpRouteTaskId: $scope.instructionNum,
                driveId: $scope.driverIdMod,
                taskPlanDateStart: $scope.planTimeStart,
                taskPlanDateEnd: $scope.planTimeEnd,
                start: $scope.start.toString(),
                size: $scope.size
            })).then(function (data) {
                if (data.success === true) {
                    $scope.boxArray = data.result;
                    $scope.notHandoverArray = $scope.boxArray.slice(0, 10);
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
        }
    }

    //打开模态框
    $scope.notHandOverDetail = function (id) {
        _basic.get($host.api_url + "/notSettleHandover?dpRouteTaskDetailId=" + id).then(function (data) {
            if (data.success === true) {
                $scope.notHandOverDetailArray = data.result[0];
            }
        })
        $('#settlementItem').modal('open');
    }



    // 分页
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getNotHandover();
    };

    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getNotHandover();
    };
    getMsg();
    getNum();

}])