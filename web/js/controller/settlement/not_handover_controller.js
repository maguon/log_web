app.controller("not_handover_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    $scope.start = 0;
    $scope.size = 11;

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


    //查询
    $scope.getNotHandoverInfo = function () {
        $scope.start = 0;
        getNotHandover();
    }

    function  getNotHandover(){
        _basic.get($host.api_url + "/notSettleHandover?transferFlag=0&" + _basic.objToUrl({
            carLoadStatus:2,
            vinCode:$scope.VIN,
            entrustId:$scope.client,
            routeEndId:$scope.arrive_city,
            receiveId:$scope.receiveId,
            dpRouteTaskId:$scope.instructionNum,
            driveId:$scope.driverIdMod,
            receivedDateStart:$scope.planTimeStart,
            receivedDateEnd:$scope.planTimeEnd,
            start:$scope.start.toString(),
            size:$scope.size
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
    getNotHandover();

}])