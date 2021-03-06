/**
 * Created by ASUS on 2017/8/22.
 */
app.controller("instruction_list_controller", ["$scope","$rootScope","$state","$stateParams", "$host", "_config", "_basic", function ($scope, $rootScope,$state,$stateParams,$host, _config, _basic) {
    $scope.start = 0;
    $scope.size = 11;
    // 指令状态
    $scope.taskStatusList = _config.taskStatus;
    // 任务状态
    $scope.missionStatusList = _config.missionStatus;

    //获取起始城市  目的城市
    function getCity(){
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.cityList = data.result;
                $('#start_city').select2({
                    placeholder: '起始城市',
                    containerCssClass : 'select2_dropdown'
                });
                $('#end_city').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
        });
    }

    //获取货车牌号
    function getTruckNum() {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumListAll = data.result;
                $('#truckId').select2({
                    placeholder: "货车牌号",
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    }

    //司机
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
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
    }

    // 获取装车地点
    $scope.getAddres = function () {
        if($scope.start_city == 0 || $scope.start_city == "" || $scope.start_city == null){
            $scope.start_city = null;
            $scope.baseAddrList = [];
        }
        else{
            _basic.get($host.api_url + "/baseAddr?cityId=" + $scope.start_city).then(function (data) {
                if (data.success == true) {
                    $scope.baseAddrList = data.result;
                }
            });
        }
    };

    // 获取经销商
    $scope.getRecive = function () {
        if($scope.end_city == 0 || $scope.end_city == "" || $scope.end_city == null){
            $scope.end_city = null;
            $scope.receiveList = [];
        }
        else{
            _basic.get($host.api_url + "/receive?cityId=" + $scope.end_city ).then(function (data) {
                if (data.success == true) {
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

    // 搜索请求
   function search_All() {

       if (($scope.dispatch_instruct_endTime == undefined && $scope.dispatch_instruct_startTime == undefined) && ($scope.instruct_endTime == undefined && $scope.instruct_startTime == undefined) ||
           ($scope.dispatch_instruct_endTime == '' && $scope.dispatch_instruct_startTime == '') &&( $scope.instruct_endTime == '' && $scope.instruct_startTime == '')) {
           $scope.instruction_list=[];
           swal('请输入完整的时间范围', "", "error");
       }
       else {
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
                       pageId: "instruction_list",
                       start: $scope.start,
                       size: $scope.size,
                       conditions: conditionsObj
                   };
                   // 将当前画面的条件
                   $rootScope.refObj = {pageArray: []};
                   $rootScope.refObj.pageArray.push(pageItems);
                   $scope.instruction_list_obj = data.result;
                   $scope.instruction_list = $scope.instruction_list_obj.slice(0, 10);
                   if ($scope.start > 0) {
                       $scope.pre = true;
                   }
                   else {
                       $scope.pre = false;
                   }

                   if ($scope.instruction_list_obj.length < $scope.size) {
                       $scope.next = false;
                   }
                   else {
                       $scope.next = true;
                   }

               } else {
                   swal(data.msg, "", "error")
               }
           })
       }
    };

    // 普通查询
    $scope.search_condition = function () {
        $scope.start = 0;
        search_All()
    };

    // 上一页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        search_All();
    };

    // 下一页
    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        search_All();
    };

    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.vin = conditions.vin;
        $scope.dispatch_num = conditions.dpRouteTaskId;
        $scope.dispatch_instruct_startTime= conditions.taskPlanDateStart;
        $scope.dispatch_instruct_endTime = conditions.taskPlanDateEnd;
        $scope.truck_num = conditions.truckNum;
        $scope.driver = conditions.driveName;
        $scope.start_city= conditions.routeStartId;
        $scope.dispatch_car_position= conditions.baseAddrId;
        $scope.end_city= conditions.routeEndId;
        $scope.dealer = conditions.receiveId;
        $scope.task_status= conditions.taskStatus;
        $scope.dispatch_car_status= conditions.loadTaskStatus;
        $scope.instruct_startTime= conditions.createdOnStart;
        $scope.instruct_endTime = conditions.createdOnEnd;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            vin: $scope.vin,
            dpRouteTaskId: $scope.dispatch_num,
            createdOnStart:$scope.instruct_startTime,
            createdOnEnd: $scope.instruct_endTime,
            taskPlanDateStart:$scope.dispatch_instruct_startTime,
            taskPlanDateEnd:$scope.dispatch_instruct_endTime,
            truckNum: $scope.truck_num,
            driveName: $scope.driver,
            loadTaskStatus: $scope.dispatch_car_status,
            routeStartId: $scope.start_city,
            baseAddrId: $scope.dispatch_car_position,
            routeEndId:$scope.end_city,
            receiveId:$scope.dealer,
            taskStatus:$scope.task_status
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "look_instruction_list_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "instruction_list") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
                // 查询数据
                search_All();

            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
        }
        $scope.getRecive();
        $scope.getAddres();
        getCity();
        getDriveNameList ();
        getTruckNum();

    }
    initData();


}]);