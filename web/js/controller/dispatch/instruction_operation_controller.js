/**
 * Created by zcy on 2017/8/30.
 */
app.controller("instruction_operation_controller", ["$scope","$rootScope","$state","$stateParams", "$host", "_basic", function ($scope,$rootScope,$state,$stateParams,  $host, _basic) {
    $scope.truckNum = "";
    $scope.driveName = "";
    $scope.currentStatus = "";
    $scope.startCityId = "";
    $scope.locateAddrId = "";
    $scope.endCityId = "";
    $scope.distributorId = "";
    $scope.currentCity = "";
    $scope.taskStart = "";
    $scope.start = 0;
    $scope.size = 11;

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

    //获取司机
     function getDriveName() {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success === true) {
                $scope.driveList = data.result;
                $('#driver_name').select2({
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

    // 查询指令数据
    $scope.getTruckDispatch = function () {
        // 基本检索URL
        var url = $host.api_url + "/truckDispatchLoadTask?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "instruction_operation",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);

                // 根据城市判断状态
                for (var i = 0; i < data.result.length; i++) {
                    if (data.result[i].current_city === 0) {
                        data.result[i].operate_status = "在途"
                    }
                    else {
                        data.result[i].operate_status = "待运中"
                    }
                }
                $scope.boxArray = data.result;
                $scope.dispatchList = $scope.boxArray.slice(0, 10);
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
               /* $scope.dispatchList = data.result;*/
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取起始城市信息
    $scope.getStartCityInfo = function () {
        _basic.get($host.api_url + "/city").then(function (cityData) {
            if (cityData.success === true) {
                $scope.startCityList = cityData.result;
                $('#start_city_list').select2({
                    placeholder: '始发城市',
                    containerCssClass : 'select2_dropdown'
                });
                $('#end_city_list').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown'
                });
                $('#transferId').select2({
                    placeholder: '中转站城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
    };

    // 根据起始城市查询装车地点
    $scope.getLocateAddress = function () {
        if($scope.startCityId == "" || $scope.startCityId == null || $scope.startCityId == 0){
            $scope.startCityId = null;
            $scope.locateList = [];
        }
        else{
            _basic.get($host.api_url + "/baseAddr?cityId=" + $scope.startCityId).then(function (locateData) {
                if (locateData.success === true) {
                    $scope.locateList = locateData.result;
                }
                else {
                    swal(locateData.msg, "", "error");
                }
            });
        }
    };

    // 根据目的城市获取经销商
    $scope.getDistributor = function () {
        if($scope.endCityId == 0 || $scope.endCityId == "" || $scope.endCityId == null){
            $scope.endCityId = null;
            $scope.distributorList = [];
        }
        else{
            _basic.get($host.api_url + "/receive?cityId=" + $scope.endCityId).then(function (distributorData) {
                if (distributorData.success === true) {
                    $scope.distributorList = distributorData.result;
                }
                else {
                    swal(distributorData.msg, "", "error");
                }
            });
        }
    };

    //根据中转站获取中转站地点
    $scope.getTansferAddress = function(){
        if($scope.transferId == "" || $scope.transferId == null || $scope.transferId== 0){
            $scope.$transferId = null;
            $scope.transferList = [];
        }
        else{
            _basic.get($host.api_url + "/baseAddr?cityId=" + $scope.transferId).then(function (locateData) {
                if (locateData.success === true) {
                    $scope.transferList = locateData.result;
                }
                else {
                    swal(locateData.msg, "", "error");
                }
            });
        }
    }

    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.transferId=conditions.transferCityId;
        $scope.transferArr=conditions.transferAddrId;
        $scope.truckNum=conditions.truckId;
        $scope.driveName=conditions.driveName;
        $scope.startCityId=conditions.cityTaskStart;
        $scope.locateAddrId=conditions.baseAddrId;
        $scope.endCityId=conditions.taskEnd;
        $scope.distributorId=conditions.receiveId;
        $scope.currentCity=conditions.currentCity;
        $scope.taskStart=conditions.taskStart;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        if($scope.currentStatus == "1"){
            $scope.taskStart = "0";
            $scope.currentCity = "";
        }
        if($scope.currentStatus == "2"){
            $scope.taskStart = "";
            $scope.currentCity = "0";
        }
        if($scope.currentStatus == ""){
            $scope.currentCity = "";
            $scope.taskStart = "";
        }
        return {
            transferCityId:$scope.transferId,
            transferAddrId:$scope.transferArr,
            dispatchFlag:1,
            truckId:$scope.truckNum,
            driveName:$scope.driveName,
            cityTaskStart:$scope.startCityId,
            baseAddrId:$scope.locateAddrId,
            taskEnd:$scope.endCityId,
            receiveId:$scope.distributorId,
            currentCity:$scope.currentCity,
            taskStart:$scope.taskStart
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "instruction_operation_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "instruction_operation") {
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
        $scope.getLocateAddress();
        $scope.getDistributor();
        $scope.getTansferAddress();
        // 查询数据
        $scope.getTruckDispatch();

    }
    initData();

    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.search_car();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.search_car();
    };
    // 获取所有数据
    $scope.queryData = function () {
        getTruckNum();
        getDriveName();
        $scope.getTruckDispatch();
        $scope.getStartCityInfo();
    };
    $scope.queryData();
}]);