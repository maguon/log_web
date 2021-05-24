
app.controller("car_wash_fee_management_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.receive_status = "1";
    $scope.addWashFeeFlag=false;
    $scope.start = 0;
    $scope.size = 11;
    $(".car_detail").hide();
    $(".no_car_detail").hide();
    $scope.userDepartment = parseInt(_basic.getSession(_basic.USER_TYPE));
    if($scope.userDepartment==49||userId=='1'){
        $scope.addWashFeeFlag=true
    }
    else {
        $scope.addWashFeeFlag=false;
    }
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
    // 所属类型--公司联动
    $scope.getCompany=function () {
        _basic.get($host.api_url+"/company?operateType="+$scope.operateType).then(function (data) {
            if(data.success==true){
                $scope.companyList=data.result;
            }else {
                swal(data.msg,"","error")
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
                    $('#dealer').select2({
                        placeholder: '经销商',
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
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
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRel?" +_basic.objNewToUrl({
            loadTaskCleanRelId: $scope.instructionNum,
            driveId: $scope.driver,
            routeEndId: $scope.destinationCity,
            receiveId: $scope.distributor,
            status: $scope.receive_status,
            monthFlag:$scope.monthFlag,
            cleanDateStart: $scope.receiveTimeStart,
            cleanDateEnd: $scope.receiveTimeEnd,
            loadDateStart:$scope.loadDateStart,
            loadDateEnd:$scope.loadDateEnd,
            dpRouteTaskId:$scope.dp_number,
            truckId:$scope.truckNum,
            companyId:$scope.companyId,
            operateType:$scope.operateType,
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
        _basic.get($host.api_url+ '/dpRouteLoadTaskCleanRelCount?' + _basic.objNewToUrl({
            loadTaskCleanRelId: $scope.instructionNum,
            driveId: $scope.driver,
            routeEndId: $scope.destinationCity,
            receiveId: $scope.distributor,
            monthFlag:$scope.monthFlag,
            status: $scope.receive_status,
            cleanDateStart: $scope.receiveTimeStart,
            cleanDateEnd: $scope.receiveTimeEnd,
            loadDateStart:$scope.loadDateStart,
            loadDateEnd:$scope.loadDateEnd,
            dpRouteTaskId:$scope.dp_number,
            truckId:$scope.truckNum,
            companyId:$scope.companyId,
            operateType:$scope.operateType
        })).then(function (data) {
            if (data.success === true) {
                $scope.boxArrayFee = data.result[0];
            }

        })
    };
    // 数据导出
    $scope.export = function () {
        // 基本检索URL
        var url = $host.api_url + "/dpRouteLoadTaskCleanRel.csv?" ;

        var conditions =_basic.objNewToUrl({
            loadTaskCleanRelId: $scope.instructionNum,
            driveId: $scope.driver,
            routeEndId: $scope.destinationCity,
            receiveId: $scope.distributor,
            monthFlag:$scope.monthFlag,
            status: $scope.receive_status,
            cleanDateStart: $scope.receiveTimeStart,
            cleanDateEnd: $scope.receiveTimeEnd,
            loadDateStart:$scope.loadDateStart,
            loadDateEnd:$scope.loadDateEnd,
            dpRouteTaskId:$scope.dp_number,
            truckId:$scope.truckNum,
            companyId:$scope.companyId,
            operateType:$scope.operateType
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
        $scope.addSingMoney ='';
        $scope.addTotalMoney ='';
        $scope.addSingOtherMoney ='';
        $scope.addTotalOtherMoney ='';
        $scope.remark ='';
        $('#addSingleMoney').modal('open');
    }
    $scope.changeSingleMoney =function (addSingMoney,dispatchNum){
        if(dispatchNum==null){
            dispatchNum=0;
        }
        if(addSingMoney==null||addSingMoney==''){
            addSingMoney=0;
        }
        $scope.addTotalMoney=addSingMoney*dispatchNum;
    }
    $scope.changeSingleOtherMoney =function (addSingMoneyOtherItem,dispatchNum){
        if(dispatchNum==null){
            dispatchNum=0;
        }
        if(addSingMoneyOtherItem==null||addSingMoneyOtherItem==''){
            addSingMoneyOtherItem=0;
        }
        $scope.addTotalOtherMoney=addSingMoneyOtherItem*dispatchNum;
    }
    $scope.changeDispatchNum=function (addSingMoney,addSingOtherMoney,dispatchNum){
        if(dispatchNum==null){
            dispatchNum=0;
        }
        if(addSingMoney==null||addSingMoney==''){
            addSingMoney=0;
        }
        if(addSingOtherMoney==null||addSingOtherMoney==''){
            addSingOtherMoney=0;
        }
        $scope.addTotalMoney=addSingMoney*dispatchNum;
        $scope.addTotalOtherMoney=addSingOtherMoney*dispatchNum;
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
                "smallSinglePrice": $scope.addSingMoney,
                "otherFee": $scope.addSingOtherMoney,
                "actualOtherFee": $scope.addTotalOtherMoney,
                "totalOtherFee": $scope.addTotalOtherMoney,
                'monthFlag':$scope.dispatchNum.month_flag,
                actualPrice:$scope.addTotalMoney,
                "totalPrice": $scope.addTotalMoney,
                "carCount": $scope.dispatchNum.car_count,
                "smallCarCount": $scope.dispatchNum.car_count,
                "type": 1,
                remark:$scope.remark
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
        $scope.addSingMoneyItem=undefined;
        $scope.addSingOtherMoneyItem=undefined;
        $scope.remarkItem='';
        $(".no_car_detail").hide();
        $(".car_detail").hide();
        $('#addFeeItem').modal('open');
    };
    //查找详细信息
    $scope.getDetail1 = function (){
        let dpRouteTaskId = $scope.dpId == "" ? -1 : $scope.dpId;
        _basic.get($host.api_url + "/dpRouteLoadTask?dpRouteTaskId=" +dpRouteTaskId).then(function (data) {
            if (data.success = true) {
                if (data.result.length == 0) {
                    $(".no_car_detail").show();
                    $(".car_detail").hide();
                } else {
                    $(".no_car_detail").hide();
                    $(".car_detail").show();
                    $scope.addWashFeeBox = data.result;
                    $scope.carItem = data.result[0];
                    }
                }
        })
    }

    $scope.addFee  = function(){
        if($scope.dispatchNum==undefined){
            swal('车辆或者补价不能为空', "", "error");
        }
        else{
            if ($scope.dispatchNum.car_count==0||$scope.addSingMoneyItem==undefined||$scope.addSingOtherMoneyItem==undefined||$scope.dispatchNum.car_count==null) {
                swal('车辆或者补价不能为空', "", "error");
            }
            else {
                _basic.post($host.api_url + "/user/" + userId + "/dpRouteLoadTaskCleanRel", {
                    "dpRouteTaskId": $scope.dispatchNum.dp_route_task_id,
                    "dpRouteLoadTaskId": $scope.dispatchNum.id,
                    "driveId":$scope.dispatchNum.drive_id,
                    "truckId":$scope.dispatchNum.truck_id,
                    "receiveId": $scope.dispatchNum.receive_id,
                    "smallSinglePrice": $scope.addSingMoneyItem,

                    'monthFlag':$scope.dispatchNum.month_flag,
                    actualPrice:$scope.addTotalMoney,
                    "totalPrice": $scope.addTotalMoney,

                    "otherFee": $scope.addSingOtherMoneyItem,
                    "actualOtherFee": $scope.addTotalOtherMoney,
                    "totalOtherFee": $scope.addTotalOtherMoney,

                    "carCount": $scope.dispatchNum.car_count,
                    "smallCarCount": $scope.dispatchNum.car_count,
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


    /*
   * 点击查看详情
   * */
    $scope.getDetail = function (id){
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRel?loadTaskCleanRelId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.showList = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        })
        $(".modal").modal();
        $("#openDetailModal").modal("open");
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