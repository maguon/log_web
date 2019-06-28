app.controller("not_handover_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    $scope.start = 0;
    $scope.size = 11;
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.ArrayList=[];
    $scope.carIds=[];
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
                $('#startCity').select2({
                    placeholder: '始发城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
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
                    placeholder: '司机',
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


    $scope.changeCarMake = function (entrustId){
        _basic.get($host.api_url + "/entrustMakeRel?entrustId=" + entrustId).then(function (data) {
            if (data.success == true && data.result.length >= 0) {
                $scope.entrustMakeRelList = data.result;

            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }


    // 发运地名称
    $scope.getAddrData = function () {
        if($scope.startCity == 0 || $scope.startCity == "" || $scope.startCity == null){
            $scope.startCity = null;
            $scope.locateList = [];
        }
        else{
            _basic.get($host.api_url + "/baseAddr?cityId=" + $scope.startCity).then(function (data) {
                if (data.success === true) {
                    $scope.locateList = data.result;
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
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
                makeId: $scope.car_brand,
                routeStartId: $scope.startCity,
                baseAddrId: $scope.locateId,
                taskPlanDateStart: $scope.planTimeStart,
                taskPlanDateEnd: $scope.planTimeEnd,
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
                makeId: $scope.car_brand,
                routeStartId: $scope.startCity,
                baseAddrId: $scope.locateId,
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



    //点击加号 生成数组
    $scope.getArr = function (el){
        if($scope.ArrayList.length!==0){
            if(
                $scope.ArrayList[0].make_name==el.make_name&&
                $scope.ArrayList[0].e_short_name==el.e_short_name&&
                $scope.ArrayList[0].route_end==el.route_end&&
                $scope.ArrayList[0].route_start==el.route_start&&
                $scope.ArrayList[0].addr_name==el.addr_name&&
                $scope.ArrayList[0].r_short_name==el.r_short_name
            ){
                for (var i = 0; i < $scope.ArrayList.length; i++) {
                    if ($scope.ArrayList[i].vin === el.vin) {
                        swal('不能重复添加相同车辆!',"", "error");
                        return;
                    }
                }
                $scope.ArrayList.push(el);
            }
            else{
                swal('添加失败',"", "error");
            }
        }
        else{
            $scope.ArrayList.push(el);
        }
    }
    //删除
    $scope.deleteSingle =function (_obj,_arr){
        var length = _arr.length;
        for (var i = 0; i < length; i++) {
            if (_arr[i] === _obj) {
                if (i === 0) {
                    _arr.shift(); //删除并返回数组的第一个元素
                    return _arr;
                }
                else if (i === length - 1) {
                    _arr.pop();  //删除并返回数组的最后一个元素
                    return _arr;
                }
                else {
                    _arr.splice(i, 1); //删除下标为i的元素
                    return _arr;
                }
            }
        }
        $scope.ArrayList =_arr;
    }

    //未交接到已交接
    $scope.addArr = function (){
        for (var i = 0; i < $scope.ArrayList.length; i++) {
            $scope.carIds.push($scope.ArrayList[i].car_id)
        }
        $scope.addNumberId='';
        $scope.addHandoverReceiveStartTime='';
        $scope.newRemark='';

        $('#addSettlementItem').modal('open');
    }

    $scope.addSettlementItem = function (){
        swal({
            title: "确定交接左侧所有车辆吗？",
            text: "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        }).then(function (result) {
            if (result.value) {
                if($scope.addNumberId!== undefined&&$scope.addHandoverReceiveStartTime!== undefined){
                    _basic.post($host.api_url + "/user/" + userId + "/settleHandoverAll", {
                        "serialNumber":  $scope.addNumberId,
                        "entrustId":   $scope.ArrayList[0].entrust_id,
                        "receivedDate": $scope.addHandoverReceiveStartTime,
                        "routeStartId":  $scope.ArrayList[0].route_start_id,
                        "routeEndId":  $scope.ArrayList[0].route_end_id,
                        "receiveId":  $scope.ArrayList[0].receive_id,
                        "carCount":$scope.ArrayList.length,
                        "remark":$scope.newRemark,
                        "carIds":$scope.carIds
                    }).then(function (data) {
                        if (data.success == true) {
                            $scope.ArrayList=[];
                            $('#addSettlementItem').modal('close');
                            getNotHandover();
                            swal("交接成功", "", "success");
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    })
                }
              else {
                    swal("请填写完整信息！", "", "warning");
                }

            }
        })
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