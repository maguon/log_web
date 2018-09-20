/**
 * Created by ASUS on 2017/8/29.
 */
app.controller("instruction_driver_mileage_controller", ["$scope","$rootScope","$state","$stateParams",  "$host", "_basic", "baseService", function ($scope, $rootScope,$state,$stateParams,$host, _basic, baseService) {

    $scope.driver_mileage_startTime = moment(baseService.dateFirst()).format("YYYY-MM-DD");
    $scope.driver_mileage_endTime = moment(baseService.dateLast()).format("YYYY-MM-DD");
    // 司机里程
    $scope.search = function () {
        // 基本检索URL
        var url = $host.api_url + "/driveDistanceLoad?";
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "instruction_driver_mileage",
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
                $scope.driveDistanceCount = data.result;
            }
            else {
                swal(data.msg, "", "error")
            }
        });
    };
    $scope.search();

    $scope.search_all = function () {
        if ($scope.driver_mileage_startTime == undefined || $scope.driver_mileage_endTime == undefined) {
            swal("统计时间不能为空！", "", "error")
        }
        else {
            $scope.search();
        }
    }


    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.drive_name=conditions.driveName;
        $scope.truckNum=conditions.truckNum;
        $scope.driver_mileage_startTime=conditions.dateIdStart;
        $scope.driver_mileage_endTime=conditions.dateIdEnd;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            taskStatus: 10,
            driveName: $scope.drive_name,
            truckNum: $scope.truckNum,
            dateIdStart: $scope.driver_mileage_startTime,
            dateIdEnd: $scope.driver_mileage_endTime
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "instruction_drive_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "instruction_driver_mileage") {
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
        }
        // 查询数据
        $scope.search();

    }
    initData();




}]);