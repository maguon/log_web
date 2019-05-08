app.controller("car_wash_fee_details_controller", ["$scope", "$host", "$stateParams", "$state", "_basic", function ($scope,  $host, $stateParams, $state, _basic) {

    var userId = _basic.getSession(_basic.USER_ID);
    var carId = $stateParams.id;

    // 返回
    $scope.return = function () {
        $state.go($stateParams.from,{from:"car_wash_fee_details"}, {reload: true})
    };

    // 根据当前id查询洗车费详情
    $scope.getCurrentCarWashFeeInfo = function () {
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRel?loadTaskCleanRelId=" + carId).then(function (data) {
            if (data.success === true) {
                $scope.currentFeeInfo = data.result[0];
                $scope.currentStatus = data.result[0].status;

                if(data.result[0].status === 1){
                    $scope.totalPrice = data.result[0].total_price;
                    $scope.guardFee  =data.result[0].guard_fee;
                    $scope.remark = data.result[0].remark;
                }
                else{
                    $scope.totalPrice = data.result[0].actual_price;
                    $scope.guardFee  =data.result[0].actual_guard_fee;
                    $scope.remark = data.result[0].remark;
                }

            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击驳回
    $scope.rejectWashFee = function () {
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
                    _basic.put($host.api_url + "/user/" + userId + "/loadTaskCleanRel/" + carId + "/status/0", {
                        actualPrice: 0,
                        actualGuardFee: 0,
                        remark: $scope.remark
                    }).then(function (data) {
                        if (data.success === true) {
                            $scope.getCurrentCarWashFeeInfo();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });
    };

    // 点击领取
    $scope.receiveWashFee = function () {
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
                    _basic.put($host.api_url + "/user/" + userId + "/loadTaskCleanRel/" + carId + "/status/2", {
                        actualPrice: $scope.totalPrice,
                        actualGuardFee: $scope.guardFee,
                        remark: $scope.remark
                    }).then(function (data) {
                        if (data.success === true) {
                            $scope.getCurrentCarWashFeeInfo();
                           /* $state.go("car_wash_fee")*/
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getCurrentCarWashFeeInfo();
    };
    $scope.queryData();
}]);