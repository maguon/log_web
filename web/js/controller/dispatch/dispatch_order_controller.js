app.controller("dispatch_order_controller", ["$scope", "$rootScope","$state","$stateParams", "$host", "_config","_basic", function ($scope,$rootScope,$state,$stateParams,  $host,_config, _basic) {
    $scope.start = 0;
    $scope.size = 11;
    // 调度任务状态
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


    /**
     * 点击查询按钮
     * */
    $scope.getOrderInfo = function (){
        $scope.start = 0;
        seachOrderInfo();
    }

    // 下载csv
    $scope.downloadCsvFile = function () {
        // 基本检索URL
        var url = $host.api_url + "/dpRouteTask.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    };


    /**
     * 查询列表
     * */
    function seachOrderInfo(){
        // 基本检索URL
        var url = $host.api_url + "/dpRouteTask?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
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
                $scope.dispatchOrderArray = $scope.dispatchOrderBoxArray.slice(0,10);
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
        $scope.driver=conditions.driveName;
        $scope.truckNum=conditions.truckNum;
        $scope.startCity=conditions.routeStartId;
        $scope.endCity=conditions.routeEndId;
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
            driveName:$scope.driver,
            truckNum:$scope.truckNum,
            routeStartId:$scope.startCity,
            routeEndId:$scope.endCity
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
        seachOrderInfo();
    }
    getData();
}])