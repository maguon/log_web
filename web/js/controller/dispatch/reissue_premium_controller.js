
app.controller("reissue_premium_controller", ["$scope", "$state","$stateParams", "_basic", "_config", "$host", function ($scope, $state,$stateParams, _basic, _config, $host) {


    var userId = _basic.getSession(_basic.USER_ID);
    $scope.receive_status = "1";
    $scope.start = 0;
    $scope.size = 11;

    // 获取目的城市列表
    $scope.getCityList = function () {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success === true) {
                $scope.cityList = data.result;
                $('#end_city').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    //司机
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
                $('#getDrivderId').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //获取货车牌号
    function getTruckNum() {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumListAllList = data.result;
                $('#truckNum').select2({
                    placeholder: '货车牌号',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    }

    // 根据城市id获取经销商
    $scope.getRecive = function () {
        if($scope.cityId == 0 || $scope.cityId == "" || $scope.cityId == null){
            $scope.cityId = null;
            $scope.receiveList = [];
        }
        else{
            _basic.get($host.api_url + "/receive?cityId=" + $scope.cityId).then(function (data) {
                if (data.success === true) {
                    $scope.receiveList = data.result;
                }
            });
        }
    };

    // 获取洗车费列表
    $scope.getCarWashFeeList = function () {
        $scope.start = 0;
        getCarWashFeeList();
    }


    function getCarWashFeeList() {
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRel?" + _basic.objToUrl({
            loadTaskCleanRelId: $scope.instructionNum,
            driveId: $scope.driver,
            routeEndId: $scope.destinationCity,
            receiveId: $scope.distributor,
            status: $scope.receive_status,
            cleanDateStart: $scope.receiveTimeStart,
            cleanDateEnd: $scope.receiveTimeEnd,
            loadDateStart:$scope.loadDateStart,
            loadDateEnd:$scope.loadDateEnd,
            dpRouteTaskId:$scope.dp_number,
            truckId:$scope.truckNum,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                $scope.carWashFeeBoxArray = data.result;
                $scope.carWashFeeList = $scope.carWashFeeBoxArray.slice(0,10);
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
        _basic.get($host.api_url+ '/dpRouteLoadTaskCleanRelCount?' + _basic.objToUrl({
            loadTaskCleanRelId: $scope.instructionNum,
            driveId: $scope.driver,
            routeEndId: $scope.destinationCity,
            receiveId: $scope.distributor,
            status: $scope.receive_status,
            cleanDateStart: $scope.receiveTimeStart,
            cleanDateEnd: $scope.receiveTimeEnd,
            loadDateStart:$scope.loadDateStart,
            loadDateEnd:$scope.loadDateEnd,
            dpRouteTaskId:$scope.dp_number,
            truckId:$scope.truckNum,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                $scope.boxArrayFee = data.result[0];
            }

        })
    };
    // 数据导出
    $scope.export = function () {
        // 基本检索URL
        var url = $host.api_url + "/dpRouteLoadTaskProtect.csv?" ;

        var conditions = _basic.objToUrl({
            loadTaskCleanRelId: $scope.instructionNum,
            driveId: $scope.driver,
            routeEndId: $scope.destinationCity,
            receiveId: $scope.distributor,
            status: $scope.receive_status,
            cleanDateStart: $scope.receiveTimeStart,
            cleanDateEnd: $scope.receiveTimeEnd,
            loadDateStart:$scope.loadDateStart,
            loadDateEnd:$scope.loadDateEnd,
            dpRouteTaskId:$scope.dp_number
        });
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    };


    //单加钱
    $scope.addSingleMoney = function (el){
        $scope.detailData=el;
        _basic.get($host.api_url + "/dpRouteLoadTask?dpRouteTaskId=" +el.dp_route_task_id).then(function (data) {
            if (data.success === true) {
                $scope.addWashFeeBox = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        $scope.addTrailerFee ='';
        $scope.addCarParkingFee ='';
        $scope.addRunFee ='';
        $scope.addLeadFee ='';
        $('#addSingleMoney').modal('open');
    }

    $scope.addDataItem =function () {
        if ($scope.dispatchNum.car_count==0) {
            swal('车辆不能为空', "", "error");
            $('#addSingleMoney').modal('close');
        }
        else {
            _basic.post($host.api_url + "/user/" + userId + "/dpRouteLoadTaskCleanRel", {
                "dpRouteTaskId": $scope.dispatchNum.dp_route_task_id,
                "dpRouteLoadTaskId": $scope.dispatchNum.id,
                "driveId":$scope.dispatchNum.drive_id,
                "truckId":$scope.dispatchNum.truck_id,
                "receiveId": $scope.dispatchNum.receive_id,
                monthFlag:$scope.dispatchNum.month_flag,
                "carCount": $scope.dispatchNum.car_count,
                "trailerFee":  $scope.addTrailerFee,
                "totalTrailerFee": $scope.addTrailerFee*$scope.dispatchNum.car_count,
                "carParkingFee":  $scope.addCarParkingFee*$scope.dispatchNum.car_count,
                "runFee":  $scope.addRunFee,
                "totalRunFee": $scope.addRunFee*$scope.dispatchNum.car_count,
                "leadFee":  $scope.addLeadFee,
                "type": 1
            }).then(function (data) {
                if (data.success === true) {
                    $('#addSingleMoney').modal('close');
                    swal("操作成功", "", "success");
                    getCarWashFeeList();
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
    }



    //添加
    $scope.addFeeItem = function (){
        $scope.dpId='';
        $scope.carItem=null;
        $scope.dispatchNum=undefined;
        $scope.remarkItem='';
        $(".no_car_detail").hide();
        $(".car_detail").hide();
        $('#addFeeItem').modal('open');
    };
    //查找详细信息
    $scope.getDetail = function (){
        _basic.get($host.api_url + "/dpRouteLoadTask?dpRouteTaskId=" +$scope.dpId).then(function (data) {
            if (data.success = true) {
                if (data.result.length == 0) {
                    $(".no_car_detail").show();
                    $(".car_detail").hide();
                } else {
                    $(".no_car_detail").hide();
                    $(".car_detail").show();
                    $scope.addWashFeeBox = data.result;
                    $scope.carItem = data.result[0];
                    $scope.addTrailerFee =0;
                    $scope.addCarParkingFee =0;
                    $scope.addRunFee =0;
                    $scope.addLeadFee =0;
                }
            }
        })
    }

    $scope.addFee  = function(){
        if($scope.dispatchNum==undefined){
            swal('车辆或者补价不能为空', "", "error");
        }
        else{
            if ($scope.dispatchNum.car_count==0||$scope.addTrailerFee==null||$scope.addCarParkingFee==null||
                $scope.addRunFee==null||$scope.addLeadFee==null||$scope.dispatchNum.car_count==null) {
                swal('车辆或者补价不能为空', "", "error");
            }
            else {
                _basic.post($host.api_url + "/user/" + userId + "/dpRouteLoadTaskCleanRel", {
                    "dpRouteTaskId": $scope.dispatchNum.dp_route_task_id,
                    "dpRouteLoadTaskId": $scope.dispatchNum.id,
                    "driveId":$scope.dispatchNum.drive_id,
                    "truckId":$scope.dispatchNum.truck_id,
                    "receiveId": $scope.dispatchNum.receive_id,
                    monthFlag:$scope.dispatchNum.month_flag,
                    "carCount": $scope.dispatchNum.car_count,
                    "trailerFee":  $scope.addTrailerFee,
                    "totalTrailerFee": $scope.addTrailerFee*$scope.dispatchNum.car_count,
                    "carParkingFee":  $scope.addCarParkingFee*$scope.dispatchNum.car_count,
                    "runFee":  $scope.addRunFee,
                    "totalRunFee": $scope.addRunFee*$scope.dispatchNum.car_count,
                    "leadFee":  $scope.addLeadFee,
                    "type": 1,
                    remark:$scope.remarkItem
                }).then(function (data) {
                    if (data.success === true) {
                        $('#addFeeItem').modal('close');
                        swal("操作成功", "", "success");
                        getCarWashFeeList();
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                })
            }
        }

    }







    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getCarWashFeeList();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getCarWashFeeList();
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getCityList();
        getCarWashFeeList();
        getDriveNameList ();
        getTruckNum();
    };
    $scope.queryData();

}]);