/**
 * 主菜单：调度管理 -> 保道费 控制器
 */
app.controller("reissue_premium_controller", ["$scope", "$state","$stateParams", "_basic", "_config", "$host", function ($scope, $state,$stateParams, _basic, _config, $host) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 翻页用
    $scope.start = 0;
    $scope.size = 11;

    //领取状态列表
    $scope.receiveStatus = _config.receiveStatus;

    //领取状态 默认为未领取
    $scope.conStatus = "1";


    // 获取查询条件 (司机  货车牌号   目的城市)
    function getCondition() {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success == true) {
                $scope.driveList = data.result;
                $('#driver').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckList = data.result;
                $('#truckNumber').select2({
                    placeholder: '货车牌号',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success === true) {
                $scope.cityList = data.result;
                $('#endCity').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };


    /*
    *  根据目的城市id获取经销商
    * */
    $scope.getRecive = function () {
        if($scope.conRouteEnd == 0 || $scope.conRouteEnd == "" || $scope.conRouteEnd == null){
            $scope.conRouteEnd = null;
            $scope.receiveList = [];
        }
        else{
            _basic.get($host.api_url + "/receive?cityId=" + $scope.conRouteEnd).then(function (data) {
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


   /*
   * 获取保道费列表
   * */
    $scope.searchInsurancePremium = function () {
        $scope.start = 0;
        getInsurancePremium();
    }


    //列表查询
    function getInsurancePremium() {
        // 基本检索URL
        var url =$host.api_url + "/dpRouteLoadTaskCleanRel?start=" + $scope.start + "&size=" + $scope.size;
        var urlCount = $host.api_url+ '/dpRouteLoadTaskCleanRelCount?start=' + $scope.start + "&size=" + $scope.size;

        //条件
        var conditions = _basic.objToUrl(makeConditions());


        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        urlCount=conditions.length > 0 ? urlCount + "&" + conditions : urlCount;


        _basic.get(url).then(function (data) {
            if (data.success === true) {
                $scope.insurancePremiumArray = data.result;
                $scope.insurancePremiumArrayList = $scope.insurancePremiumArray.slice(0,10);
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

        //总金额
        _basic.get(urlCount).then(function (data) {
            if (data.success === true) {
                $scope.totalFee = data.result[0];
            }

        })
    };


    /*
    * 数据导出
    * */
    $scope.export = function () {
        // 基本检索URL
        var url = $host.api_url + "/dpRouteLoadTaskProtect.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    };




    /*
    * 单一补发
    * */
    $scope.addSingleReissue = function (el){
        $scope.singleReissueData=el;

        //获取车辆数
        _basic.get($host.api_url + "/dpRouteLoadTask?dpRouteTaskId=" +el.dp_route_task_id).then(function (data) {
            if (data.success === true) {
                $scope.carBox = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        $scope.newTrailerFee =0;
        $scope.newCarParkingFee =0;
        $scope.newRunFee =0;
        $scope.newLeadFee =0;
        $('#singleReissue').modal('open');
    }


    /*
    * 确定补发
    * */
    $scope.addSingleReissueItem =function () {
        if($scope.dispatchNum==undefined){
            swal('车辆不能为空', "", "error");
            $('#singleReissue').modal('close');
        }
        else {
            if ($scope.dispatchNum.car_count == 0 || $scope.newTrailerFee == null || $scope.newCarParkingFee == null ||
                $scope.newRunFee == null || $scope.newLeadFee == null || $scope.dispatchNum.car_count == null) {
                swal('车辆或者补价不能为空', "", "error");
            }
            else {
                _basic.post($host.api_url + "/user/" + userId + "/dpRouteLoadTaskCleanRel", {
                    dpRouteTaskId: $scope.dispatchNum.dp_route_task_id,
                    dpRouteLoadTaskId: $scope.dispatchNum.id,
                    driveId: $scope.dispatchNum.drive_id,
                    truckId: $scope.dispatchNum.truck_id,
                    receiveId: $scope.dispatchNum.receive_id,
                    monthFlag: $scope.dispatchNum.month_flag,
                    carCount: $scope.dispatchNum.car_count,
                    trailerFee: $scope.newTrailerFee,
                    totalTrailerFee: $scope.newTrailerFee * $scope.dispatchNum.car_count,
                    carParkingFee: $scope.newCarParkingFee * $scope.dispatchNum.car_count,
                    runFee: $scope.newRunFee,
                    totalRunFee: $scope.newRunFee * $scope.dispatchNum.car_count,
                    leadFee: $scope.newLeadFee,
                    type: 1
                }).then(function (data) {
                    if (data.success === true) {
                        $('#singleReissue').modal('close');
                        swal("操作成功", "", "success");
                        getInsurancePremium();
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                })
            }
        }
    }




    //根据调度编号 添加补发
    $scope.addFeeItem = function (){
        $scope.dpId='';
        $scope.carItem=null;
        $scope.dispatchNum=undefined;
        $scope.remarkItem='';
        $(".no_car_detail").hide();
        $(".car_detail").hide();
        $('#addFeeItem').modal('open');
    };


    //根据调度编号 查找调度信息
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

                    $scope.newTrailerFee =0;
                    $scope.newCarParkingFee =0;
                    $scope.newRunFee =0;
                    $scope.newLeadFee =0;
                }
            }
        })
    }


    //根据调度编号 补发保道费
    $scope.addFee  = function(){
        if($scope.dispatchNum==undefined){
            swal('车辆或者补价不能为空', "", "error");
        }
        else{
            if ($scope.dispatchNum.car_count==0||$scope.newTrailerFee==null||$scope.newCarParkingFee==null||
                $scope.newRunFee==null||$scope.newLeadFee==null||$scope.dispatchNum.car_count==null) {
                swal('车辆或者补价不能为空', "", "error");
            }
            else {
                _basic.post($host.api_url + "/user/" + userId + "/dpRouteLoadTaskCleanRel",{
                    dpRouteTaskId: $scope.dispatchNum.dp_route_task_id,
                    dpRouteLoadTaskId: $scope.dispatchNum.id,
                    driveId:$scope.dispatchNum.drive_id,
                    truckId:$scope.dispatchNum.truck_id,
                    receiveId: $scope.dispatchNum.receive_id,
                    monthFlag:$scope.dispatchNum.month_flag,
                    carCount: $scope.dispatchNum.car_count,
                    trailerFee:  $scope.newTrailerFee,
                    totalTrailerFee: $scope.newTrailerFee*$scope.dispatchNum.car_count,
                    carParkingFee:  $scope.newCarParkingFee*$scope.dispatchNum.car_count,
                    runFee:  $scope.newRunFee,
                    totalRunFee: $scope.newRunFee*$scope.dispatchNum.car_count,
                    leadFee:  $scope.newLeadFee,
                    type: 1,
                    remark:$scope.remarkItem
                }).then(function (data) {
                    if (data.success === true) {
                        $('#addFeeItem').modal('close');
                        swal("操作成功", "", "success");
                        getInsurancePremium();
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                })
            }
        }

    }



    /**
     * 组装检索条件。
     */
    function makeConditions() {
        // 检索条件
        var conditionsObj = {
            loadTaskCleanRelId:$scope.conId,
            driveId: $scope.conDriver,
            routeEndId: $scope.conRouteEnd,
            receiveId: $scope.conReceive,
            status: $scope.conStatus,
            loadDateStart:$scope.conLoadDateStart,
            loadDateEnd:$scope.conLoadDateEnd,
            dpRouteTaskId:$scope.conRouteTaskId,
            truckId:$scope.conTruckNum
        };
        return conditionsObj;
    }








    // 分页
    $scope.previousPage = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getInsurancePremium();
    };

    $scope.nextPage = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getInsurancePremium();
    };



    // 获取数据
    function queryData() {
        getCondition();
        getInsurancePremium();
    };


    queryData();

}]);