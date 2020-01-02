app.controller("dispatch_order_controller", ["$scope", "$rootScope","$state","$stateParams", "$host", "_config","_basic", function ($scope,$rootScope,$state,$stateParams,  $host,_config, _basic) {
    $scope.start = 0;
    $scope.size = 11;
    $("#pre").hide();
    $("#next").hide();
    var userId = _basic.getSession(_basic.USER_ID);


    // 调度指令状态
    $scope.taskStatusList =_config.taskStatus;


    /*
    * 获取起始城市 目的城市*
    * */
    function getCity(){
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.cityList = data.result;
                $('#startCity').select2({
                    placeholder: '起始城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#endCity').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
        });
    }

    //获取司机
    function getDriveName() {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success === true) {
                $scope.driveList = data.result;
                $('#driver').select2({
                    placeholder: '司机',
                    containerCssClass: 'select2_dropdown',
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

    /**
     * 点击查询按钮
     * */
    $scope.getOrderInfo = function (){
        $scope.start = 0;
        seachOrderInfo();
    }

    // 下载csv  调度路线导出
    $scope.downloadCsvFile = function () {
        // 基本检索URL
        /* if($scope.reverseFlag==null){
             var url = $host.api_url + "/dpRouteTask.csv?"
         }
         else {
             var url = $host.api_url + "/dpRouteTask.csv?"+'reverseFlag='+$scope.reverseFlag;
         }*/
        var url = $host.api_url + "/dpRouteTask.csv?"

        if($scope.planTimeEnd==undefined||$scope.planTimeStart==undefined){
            swal('请输入完整的计划执行时间', "", "error");
            $("#pre").hide();
            $("#next").hide();
        }
        else{
            // 检索条件
            var conditionsObj = {
                dpRouteTaskId: $scope.dispatchId,
                taskStatus: $scope.taskStatus,
                taskPlanDateStart: $scope.planTimeStart,
                taskPlanDateEnd:$scope.planTimeEnd,
                driveId:$scope.driver,
                truckId: $scope.truckNumber,
                routeStartId:$scope.startCity,
                routeEndId: $scope.endCity,
                upDistanceFlag: $scope.mileageFlag
            };
            var conditions = _basic.objNewToUrl(conditionsObj);
            // 检索URL
            url = conditions.length > 0 ? url  + conditions : url;
            window.open(url);
        }

    };


    //司机里程导出
    $scope.export = function (){
        var obj={
            loadTaskStatuArr:[1,3,7]
        }
        /*  // 基本检索URL
          if($scope.reverseFlag==null){
              var url = $host.api_url + "/driveDistanceLoad.csv?"+ _basic.objNewToUrl(obj)
          }
          else {
              var url = $host.api_url + "/driveDistanceLoad.csv?"+'reverseFlag='+$scope.reverseFlag+'&'+ _basic.objNewToUrl(obj);
          }
    */
        var url = $host.api_url + "/driveDistanceLoad.csv?" + _basic.objNewToUrl(obj)
        if($scope.planTimeEnd==undefined||$scope.planTimeStart==undefined){
            swal('请输入完整的计划执行时间', "", "error");
            $("#pre").hide();
            $("#next").hide();
        }
        else {
            // 检索条件
            var conditionsObj = {
                dpRouteTaskId: $scope.dispatchId,
                taskStatus: $scope.taskStatus,
                taskPlanDateStart: $scope.planTimeStart,
                taskPlanDateEnd:$scope.planTimeEnd,
                driveId:$scope.driver,
                truckId: $scope.truckNumber,
                routeStartId:$scope.startCity,
                routeEndId: $scope.endCity
            };
            var conditions = _basic.objNewToUrl(conditionsObj);
            // 检索URL
            url = conditions.length > 0 ? url + "&" + conditions : url;
            window.open(url);
        }
    }




    //装车明细导出
    $scope.exportCar = function (){
        var obj={
            loadTaskStatuArr:[1,3,7]
        }
        var url = $host.api_url + "/dpRouteTaskDetail.csv?" + _basic.objNewToUrl(obj);
        if($scope.planTimeEnd==undefined||$scope.planTimeStart==undefined){
            swal('请输入完整的计划执行时间', "", "error");
            $("#pre").hide();
            $("#next").hide();
        }
        else {
            // 检索条件
            var conditionsObj = {
                dpRouteTaskId: $scope.dispatchId,
                taskStatus: $scope.taskStatus,
                taskPlanDateStart: $scope.planTimeStart,
                taskPlanDateEnd:$scope.planTimeEnd,
                driveId:$scope.driver,
                truckId: $scope.truckNumber,
                routeStartId:$scope.startCity,
                routeEndId: $scope.endCity
            };
            var conditions = _basic.objNewToUrl(conditionsObj);
            // 检索URL
            url = conditions.length > 0 ? url + "&" + conditions : url;
            window.open(url);
        }
    }


    /**
     * 查询列表
     * */
    function seachOrderInfo(){
        var url = $host.api_url + "/dpRouteTaskList?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objNewToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "dispatch_order",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
                $scope.dispatchOrderBoxArray = data.result;
                $scope.dispatchOrderArray = $scope.dispatchOrderBoxArray.slice(0, 10);
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
            } else {
                swal(data.msg, "", "error");
            }
        });
    };


    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.dispatchId=conditions.dpRouteTaskId;
        $scope.taskStatus=conditions.taskStatus;
        $scope.planTimeStart=conditions.taskPlanDateStart;
        $scope.planTimeEnd=conditions.taskPlanDateEnd;
        $scope.driver=conditions.driveId;
        $scope.truckNumber = conditions.truckId;
        $scope.startCity=conditions.routeStartId;
        $scope.endCity=conditions.routeEndId;
        $scope.reverseFlag = conditions.reverseFlag;
        $scope.mileageFlag =conditions.upDistanceFlag;


    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            dpRouteTaskId: $scope.dispatchId,
            taskStatus: $scope.taskStatus,
            taskPlanDateStart: $scope.planTimeStart,
            taskPlanDateEnd:$scope.planTimeEnd,
            driveId:$scope.driver,
            truckId: $scope.truckNumber,
            routeStartId:$scope.startCity,
            routeEndId: $scope.endCity,
            reverseFlag: $scope.reverseFlag,
            upDistanceFlag: $scope.mileageFlag
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "dispatch_order_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "dispatch_order") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);


            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
        }
        // 查询数据
        seachOrderInfo();
    }
    initData();

    /*
    * 修改结算
    * */
    $scope.putSettle = function (obj){
        if(obj.task_status!==10){
            $(".modal").modal();
            $("#putSettle").modal("close");
            swal("全部完成状态下可修改！", "", "warning");
        }
        else{
            $(".modal").modal();
            $("#putSettle").modal("open");
        }
        $scope.putSettleItem=obj;

    }
    $scope.putSettleData =function(){
        if($scope.putSettleItem.distance == null || $scope.putSettleItem.distance === ""
            || $scope.putSettleItem.car_count == null || $scope.putSettleItem.car_count === ""
            || $scope.putSettleItem.load_flag == null || $scope.putSettleItem.load_flag === ""){
            swal("里程或运载车辆数或载重类型不能为空！", "", "warning");
        }
        else{
            _basic.put($host.api_url + "/user/" + userId + "/dpRouteTask/" +$scope.putSettleItem.id +'/dpRouteLoadFlag',{
                distance: $scope.putSettleItem.distance,
                carCount: $scope.putSettleItem.car_count,
                loadFlag: $scope.putSettleItem.load_flag,
                reverseMoney: $scope.putSettleItem.reverse_money
            }).then(function (data) {
                if (data.success === true) {
                    swal("保存成功", "", "success");
                    $("#putSettle").modal("close");
                    seachOrderInfo();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }

    /*
    * 修改油耗
    * */
    $scope.putOil = function (obj){
        if(obj.task_status!==10){
            $(".modal").modal();
            $("#putOil").modal("close");
            swal("全部完成状态下可修改！", "", "warning");
        }
        else{
            $(".modal").modal();
            $("#putOil").modal("open");
        }
        $scope.putOilItem=obj;
    }
    $scope.putOilData =function(){
        if($scope.putOilItem.oil_distance == null || $scope.putOilItem.oil_distance === ""
            || $scope.putOilItem.oil_load_flag == null || $scope.putOilItem.oil_load_flag === ""){
            swal("里程或载重类型不能为空！", "", "warning");
        }
        else{
            _basic.put($host.api_url + "/user/" + userId + "/dpRouteTask/" +$scope.putOilItem.id +'/dpRouteOilLoadFlag',{
                oilDistance: $scope.putOilItem.oil_distance,
                oilLoadFlag: $scope.putOilItem.oil_load_flag
            }).then(function (data) {
                if (data.success === true) {
                    swal("保存成功", "", "success");
                    $("#putOil").modal("close");
                    seachOrderInfo();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }


    /**
     * 上一页
     */
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size - 1) ;
        seachOrderInfo();
    };

    /**
     * 下一页
     */
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1) ;
        seachOrderInfo();
    };


    /**
     * 获取数据
     */
    function getData (){
        getCity();
        getDriveName();
        getTruckNum();
    }
    getData();
}])