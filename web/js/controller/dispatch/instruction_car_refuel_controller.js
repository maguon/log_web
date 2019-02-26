/**
 * Created by zcy on 2017/8/30.
 */
app.controller("instruction_car_refuel_controller", ["$scope","$rootScope","$state","$stateParams",  "$host", "_basic", function ($scope,$rootScope,$state,$stateParams, $host, _basic) {
    $scope.start = 0;
    $scope.size = 11;
    $scope.currentStatus = "1";
    var userId = _basic.getSession(_basic.USER_ID);
    // 通过
    $scope.resolve = function (id) {
        swal({
                title: "确定通过吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                _basic.put($host.api_url + "/user/" + userId + "/driveRefuel/" + id + "/checkStatus/" + 2, {}).then(function (data) {
                    if (data.success == true) {
                        $scope.search_All();
                    }
                })
            });
    };

    $scope.reject = function (id) {
        $scope.reject_id = id;
        $scope.reject_reason_msg = "";
        $('#modal1').modal('open');
    };

    $scope.reject_reason = function () {
        if($scope.reject_reason_msg != ""){
            _basic.put($host.api_url + "/user/" + userId + "/driveRefuel/" + $scope.reject_id + "/checkStatus/" + 3, {
                checkReason: $scope.reject_reason_msg
            }).then(function (data) {
                if (data.success == true) {
                    $scope.search_All();
                    $('#modal1').modal('close');
                }
            })
        }
        else{
            swal("请填写拒绝原因", "", "warning")
        }
    };

    // 搜索请求
    $scope.search_query = function () {
        // 基本检索URL
        var url = $host.api_url + "/driveRefuel?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "instruction_car_refuel",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
                $scope.car_refuel_obj = data.result;
                $scope.car_refuel = $scope.car_refuel_obj.slice(0, 10);
                if ($scope.start > 0) {
                    $scope.pre = true;
                }
                else {
                    $scope.pre = false;
                }
                if ($scope.car_refuel_obj.length < $scope.size) {
                    $scope.next = false;
                }
                else {
                    $scope.next = true;
                }

            }
            else {
                swal(data.msg, "", "error")
            }
        })
    };

    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.truckNum = conditions.truckNum;
        $scope.driveName = conditions.driveName;
        $scope.oilingStatus = conditions.refuelAddressType;
        $scope.refueling_startTime = conditions.refuelDateStart;
        $scope.refueling_endTime = conditions.refuelDateEnd;
        $scope.currentStatus = conditions.checkStatus;

    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            truckNum: $scope.truckNum,
            driveName: $scope.driveName,
            refuelAddressType: $scope.oilingStatus,
            refuelDateStart: $scope.refueling_startTime,
            refuelDateEnd: $scope.refueling_endTime,
            checkStatus: $scope.currentStatus
        }
    }


    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "instruction_car_refuel_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "instruction_car_refuel") {
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
        $scope.search_query();

    }
    initData();


    // 头车搜索事件-条件查询
    $scope.search_condition = function () {
        $scope.start = 0;
        $scope.search_query();
    };

    // 分页
    // 上一页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        $scope.search_query();
    };

    // 下一页
    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        $scope.search_query();
    };

}]);