/**
 * 主菜单：财务管理 -> 洗车费用 控制器
 */
app.controller("car_wash_fee_controller", ["$scope","$rootScope","$state","$stateParams", "$host", "_config","_basic", function ($scope,$rootScope,$state,$stateParams, $host,_config, _basic) {


    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 翻页用
    $scope.start = 0;
    $scope.size = 11;

    // 领取状态列表
    $scope.receiveStatus = _config.receiveStatus;


    // 领取状态 默认为未领取
    $scope.receive_status = "1";


    // 补发状态
    $scope.supplementStatus = _config.supplementStatus;



    // 车辆类型
    $scope.truckType = _config.truckType;



    // 公司所属类型列表
    $scope.operateTypeList = _config.operateType;



    // 是否月結
    $scope.monthFlagList = _config.monthFlag;



    // 初始化复选金额
    $scope.initial={
        selectedIdsArr:[],
        checkedWash:0,
        checkedTotalTrailerFee:0,
        checkedCarParkingFee:0,
        checkedTotalRunFee:0,
        checkedLeadFee:0
    }



    /*
    * 获取查询条件
    * */
    function getCondition(){

        //目的城市
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


        //司机
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success == true) {
                $scope.driveList = data.result;
                $('#drivder').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });


        //货车牌号
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckList = data.result;
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



    /*
    * 所属类型--公司联动
    * */
    $scope.changeOperateType=function () {
        _basic.get($host.api_url+"/company?operateType="+$scope.operateType).then(function (data) {
            if(data.success==true){
                $scope.companyList=data.result;
            }else {
                swal(data.msg,"","error")
            }
        });
    };



    /*
    * 根据城市id获取经销商
    * */
    $scope.changeEndCity = function () {
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



   /*
   * 通过
   * */
    $scope.getPast = function(id){
        swal({
            title: "确定领取吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消"
        }).then(
            function(result){
                if (result.value) {
                    _basic.put($host.api_url + "/user/" + userId + "/loadTaskCleanRel/" + id + "/status/2", {}).then(function (data) {
                        if (data.success === true) {
                            getCarWashFeeList();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });
    }



    /*
    * 拒绝
    * */
    $scope.getReject = function(id){
        swal({
            title: "确定驳回吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消"
        }).then(
            function(result){
                if (result.value) {
                    _basic.put($host.api_url + "/user/" + userId + "/loadTaskCleanRel/" + id + "/status/0", {}).then(function (data) {
                        if (data.success === true) {
                            getCarWashFeeList();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });

    }




    /*
    * 点击查询按钮
    * */
    $scope.getCarWashFeeList = function () {
        $scope.start = 0;
        getCarWashFeeList();
    }




    /*
    * 获取列表
    * */
    function getCarWashFeeList() {
        // 基本检索URL
        var url = $host.api_url + "/dpRouteLoadTaskCleanRel?start=" + $scope.start + "&size=" + $scope.size;
        var urlCount = $host.api_url + "/dpRouteLoadTaskCleanRelCount?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        urlCount = conditions.length > 0 ? urlCount + "&" + conditions : urlCount;

        _basic.get(url).then(function (data) {
            if (data.success == true) {
                $scope.carWashFeeArray = data.result;
                $scope.carWashFeeList = $scope.carWashFeeArray.slice(0,10);
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


        //合计金额
        _basic.get(urlCount).then(function (data) {
            if (data.success === true) {
                $scope.boxArrayFee = data.result[0];
            }

        });

    };



    /*
    * 点击下载按钮
    * */
    $scope.export = function () {
        // 基本检索URL
        var url = $host.api_url + "/dpRouteLoadTaskCleanRel.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    };




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



    /*
    *
    * 全选
    * */
    $scope.selectAllCheckBox = function (event) {

        //本页全部选中
        if (event.target.checked) {
            $("[name = 'select']").prop('checked', true);
            for (var i = 0; i < $scope.carWashFeeList.length; i++) {
                $scope.initial.selectedIdsArr.push($scope.carWashFeeList[i].id);
                $scope.initial.checkedWash+= $scope.carWashFeeList[i].actual_price;
                $scope.initial.checkedTotalTrailerFee+= $scope.carWashFeeList[i].total_trailer_fee;
                $scope.initial.checkedCarParkingFee+= $scope.carWashFeeList[i].car_parking_fee;
                $scope.initial.checkedTotalRunFee+= $scope.carWashFeeList[i].total_run_fee;
                $scope.initial.checkedLeadFee+=$scope.carWashFeeList[i].lead_fee;
            }
        }

        //本页全不选
        else {

            //初始化
            $scope.initial={
                selectedIdsArr:[],
                checkedWash:0,
                checkedTotalTrailerFee:0,
                checkedCarParkingFee:0,
                checkedTotalRunFee:0,
                checkedLeadFee:0
            }

            //checkbox 为空
            $("[name = 'select']").prop('checked', false);

        }
    };



    /*
    * 检测所有分选按钮是否被选中
    * */
    $scope.checkIsAllSel = function () {
        var selectAll = false;
        $("[name = 'select']").each(function () {
            if(!$(this).is(':checked')){
                selectAll = true;
            }
        });

        // 如果全部checkBox被选中，则改变全选按钮状态
        if(selectAll){
            $("[name = 'selectAll']").prop('checked' , false);
        }
        else{
            $("[name = 'selectAll']").prop('checked' , true);
        }
    };



    /*
    * 点击单个按钮
    * */
    $scope.checkSelMission = function (event, car, index) {
        var currentSel = event.target;

        //选中  添加金额
        if(currentSel.checked){
            $scope.initial.selectedIdsArr.push(car.id);
            $scope.initial.checkedWash+= car.actual_price;
            $scope.initial.checkedTotalTrailerFee+= car.total_trailer_fee;
            $scope.initial.checkedCarParkingFee+= car.car_parking_fee;
            $scope.initial.checkedTotalRunFee+= car.total_run_fee;
            $scope.initial.checkedLeadFee+= car.lead_fee;
        }


        //未选中  删除金额
        else{
            // 获取取消选中的checkbox在id数组中的下标
            var noSelIndex = $scope.initial.selectedIdsArr.indexOf(car.id);
            $scope.initial.selectedIdsArr.splice(noSelIndex, 1);
            $scope.initial.checkedWash-= car.actual_price;
            $scope.initial.checkedTotalTrailerFee-= car.total_trailer_fee;
            $scope.initial.checkedCarParkingFee-= car.car_parking_fee;
            $scope.initial.checkedTotalRunFee-= car.total_run_fee;
            $scope.initial.checkedLeadFee-= car.lead_fee;

        }
    };



    /*
    *
    * 点击批量按钮
    * */
    $scope.batchDeal = function (){
        $(".modal").modal();
        $("#openBatchDeal").modal("open");
    }



    /*
    *
    *  确定批量
    * */
    $scope.createList = function (){
        if($scope.initial.selectedIdsArr.length==0){
            $("#openBatchDeal").modal("close");
            swal('请至少选择一条数据', "", "error");

        }
        else {
            swal({
                title: "确定批量领取吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消"
            }).then(
                function(result){
                    if (result.value) {
                        _basic.put($host.api_url + "/user/" + userId + "/status/2/cleanRelAll", {
                            "cleanRelIds": $scope.initial.selectedIdsArr
                        }).then(function (data) {
                            if (data.success === true) {
                                //初始化
                                $scope.initial={
                                    selectedIdsArr:[],
                                    checkedWash:0,
                                    checkedTotalTrailerFee:0,
                                    checkedCarParkingFee:0,
                                    checkedTotalRunFee:0,
                                    checkedLeadFee:0
                                };
                                $("[name = 'selectAll']").prop('checked', false);
                                $("#openBatchDeal").modal("close");
                                getCarWashFeeList();
                            }
                            else {
                                swal(data.msg, "", "error");
                            }
                        });
                    }
                });
        }
    }



    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            loadTaskCleanRelId: $scope.cleanCarId,
            driveId: $scope.driver,
            routeEndId: $scope.cityId,
            receiveId: $scope.receive,
            status: $scope.receive_status,
            cleanDateStart: $scope.receiveTimeStart,
            cleanDateEnd: $scope.receiveTimeEnd,
            loadDateStart:$scope.loadDateStart,
            loadDateEnd:$scope.loadDateEnd,
            dpRouteTaskId:$scope.dpId,
            truckId:$scope.truckNum,
            companyId:$scope.truckCompany,
            operateType:$scope.operateType
        };
    }



    /*
    * 上一页
    *
    * */
    $scope.prePage = function () {

        //初始化
        $scope.initial={
            selectedIdsArr:[],
            checkedWash:0,
            checkedTotalTrailerFee:0,
            checkedCarParkingFee:0,
            checkedTotalRunFee:0,
            checkedLeadFee:0
        };

        $("[name = 'selectAll']").prop('checked', false);
        $scope.start = $scope.start - ($scope.size-1);
        getCarWashFeeList();
    };



    /*
    * 下一页
    * */

    $scope.nextPage = function () {

        //初始化
        $scope.initial={
            selectedIdsArr:[],
            checkedWash:0,
            checkedTotalTrailerFee:0,
            checkedCarParkingFee:0,
            checkedTotalRunFee:0,
            checkedLeadFee:0
        };

        $("[name = 'selectAll']").prop('checked', false);
        $scope.start = $scope.start + ($scope.size-1);
        getCarWashFeeList();
    };



    // 获取数据
    function queryData() {
        getCondition();
        getCarWashFeeList();
    };


    queryData();

}]);