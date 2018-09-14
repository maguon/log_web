app.controller("dispatch_order_controller", ["$scope", "$host", "_config","_basic", function ($scope, $host,_config, _basic) {
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
        var obj = {
            dpRouteTaskId: $scope.dispatchId,
            taskStatus: $scope.taskStatus,
            taskPlanDateStart: $scope.planTimeStart,
            taskPlanDateEnd:$scope.planTimeEnd,
            driveName:$scope.driver,
            truckNum:$scope.truckNum,
            routeStartId:$scope.startCity,
            routeEndId:$scope.endCity
        };
        window.open($host.api_url + "/dpRouteTask.csv?" + _basic.objToUrl(obj));
    };


    /**
     * 查询列表
     * */
    function seachOrderInfo(){

        // 检索条件组装
        var condition = _basic.objToUrl({
            dpRouteTaskId: $scope.dispatchId,
            taskStatus: $scope.taskStatus,
            taskPlanDateStart: $scope.planTimeStart,
            taskPlanDateEnd:$scope.planTimeEnd,
            driveName:$scope.driver,
            truckNum:$scope.truckNum,
            routeStartId:$scope.startCity,
            routeEndId:$scope.endCity,
            start: $scope.start.toString(),
            size: $scope.size
        });

        _basic.get($host.api_url + "/dpRouteTask?" + condition).then(function (data) {
            if (data.success == true) {
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