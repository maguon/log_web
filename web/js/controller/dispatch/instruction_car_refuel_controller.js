/**
 * Created by zcy on 2017/8/30.
 */
app.controller("instruction_car_refuel_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
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
    $scope.search_query = function (params) {
        _basic.get($host.api_url + "/driveRefuel?" + _basic.objToUrl(params)).then(function (data) {
            if (data.success == true && data.result.length >= 0) {
                $scope.car_refuel_obj = data.result;
                $scope.car_refuel = $scope.car_refuel_obj.slice(0, 10);
                if ($scope.start > 0) {
                    $scope.pre = true;
                } else {
                    $scope.pre = false;
                }
                if ($scope.car_refuel_obj.length < $scope.size) {
                    $scope.next = false;
                } else {
                    $scope.next = true;
                }

            } else {
                swal(data.msg, "", "error")
            }
        })
    };

    // 基本条件
    $scope.queryParams = {
        start: $scope.start,
        size: $scope.size
    };
    // 普通查询
    $scope.search_All = function () {

        // 控制分页查询参数
        $scope.queryParams.start = $scope.start == 0 ? '0' : $scope.start;
        if($scope.currentStatus == "1"){
            $scope.queryParams.checkStatus = "1"
        }
        $scope.search_query($scope.queryParams)
    };
    $scope.search_All();


    // 条件赋值
    $scope.setParams = function () {

        // 控制查询参数逻辑
        if ($scope.truckNum) {
            $scope.queryParams.truckNum = $scope.truckNum;
        } else {
            $scope.queryParams.truckNum = null;
        }

        if ($scope.driveName) {
            $scope.queryParams.driveName = $scope.driveName;
        } else {
            $scope.queryParams.driveName = null;
        }

        if ($scope.oilingStatus) {
            $scope.queryParams.refuelAddressType = $scope.oilingStatus;
        } else {
            $scope.queryParams.refuelAddressType = null;
        }


        if ($scope.refueling_startTime) {
            $scope.queryParams.refuelDateStart = $scope.refueling_startTime;
        } else {
            $scope.queryParams.refuelDateStart = null;
        }

        if ($scope.refueling_endTime) {
            $scope.queryParams.refuelDateEnd = $scope.refueling_endTime;
        } else {
            $scope.queryParams.refuelDateEnd = null;
        }

        if ($scope.currentStatus) {
            $scope.queryParams.checkStatus = $scope.currentStatus;
        } else {
            $scope.queryParams.checkStatus = null;
        }
    };
    // 头车搜索事件-条件查询
    $scope.search_condition = function () {
        $scope.start = 0;
        $scope.setParams();
        $scope.search_query($scope.queryParams)
    };

    // 分页
    // 上一页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        $scope.search_All();
    };

    // 下一页
    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        $scope.search_All();
    };

}]);