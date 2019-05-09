app.controller("car_wash_fee_controller", ["$scope","$rootScope","$state","$stateParams", "$host", "_basic", function ($scope,$rootScope,$state,$stateParams, $host, _basic) {

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
        _basic.get($host.api_url + "/drive?driveName=").then(function (data) {
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
       // 基本检索URL
       var url = $host.api_url + "/dpRouteLoadTaskCleanRel?start=" + $scope.start + "&size=" + $scope.size;
       // 检索条件
       var conditionsObj = makeConditions();
       var conditions = _basic.objToUrl(conditionsObj);
       // 检索URL
       url = conditions.length > 0 ? url + "&" + conditions : url;

       _basic.get(url).then(function (data) {

           if (data.success == true) {

               // 当前画面的检索信息
               var pageItems = {
                   pageId: "car_wash_fee",
                   start: $scope.start,
                   size: $scope.size,
                   conditions: conditionsObj
               };
               // 将当前画面的条件
               $rootScope.refObj = {pageArray: []};
               $rootScope.refObj.pageArray.push(pageItems);
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
    };
    // 数据导出
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

    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.instructionNum=conditions.loadTaskCleanRelId;
        $scope.driver=conditions.driveName;
        $scope.cityId=conditions.routeEndId;
        $scope.distributor=conditions.receiveId;
        $scope.receive_status=conditions.status;
        $scope.receiveTimeStart=conditions.cleanDateStart;
        $scope.receiveTimeEnd=conditions.cleanDateEnd;
        $scope.loadDateStart=conditions.loadDateStart;
        $scope.loadDateEnd=conditions.loadDateEnd;
        $scope.dp_number=conditions.dpRouteTaskId;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            loadTaskCleanRelId: $scope.instructionNum,
            driveName: $scope.driver,
            routeEndId: $scope.cityId,
            receiveId: $scope.distributor,
            status: $scope.receive_status,
            cleanDateStart: $scope.receiveTimeStart,
            cleanDateEnd: $scope.receiveTimeEnd,
            loadDateStart:$scope.loadDateStart,
            loadDateEnd:$scope.loadDateEnd,
            dpRouteTaskId:$scope.dp_number
        };
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

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "car_wash_fee_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "car_wash_fee") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
                $scope.cityId = pageItems.conditions.routeEndId;

            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
        }
        $scope.getRecive();
        // 查询数据
        getCarWashFeeList();

    }
    initData();



    // 获取数据
    $scope.queryData = function () {
        $scope.getCityList();
        getCarWashFeeList();
        getDriveNameList ();
    };
    $scope.queryData();
}]);