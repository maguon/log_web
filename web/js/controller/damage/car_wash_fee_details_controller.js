app.controller("car_wash_fee_details_controller", ["$scope", "$host", "$stateParams", "$state", "_basic", function ($scope, $host, $stateParams, $state, _basic) {

    var userId = _basic.getSession(_basic.USER_ID);
    var carId = $stateParams.id;

    // 根据当前id查询洗车费详情
    $scope.getCurrentCarWashFeeInfo = function () {
        _basic.get($host.api_url + "/dpRouteLoadTaskCleanRel?loadTaskCleanRelId=" + carId).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                $scope.currentFeeInfo = data.result[0];
                $scope.currentStatus = data.result[0].status;
                if(data.result[0].status === 1){
                    $scope.totalPrice = data.result[0].total_price;
                }
                else{
                    $scope.totalPrice = data.result[0].actual_price;
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
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function(){
                _basic.put($host.api_url + "/user/" + userId + "/loadTaskCleanRel/" + carId + "/status/0",{
                    actualPrice: 0
                }).then(function (data) {
                    if (data.success === true) {
                        // console.log("data", data);
                        $scope.getCurrentCarWashFeeInfo();
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
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
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function(){
                _basic.put($host.api_url + "/user/" + userId + "/loadTaskCleanRel/" + carId + "/status/2",{
                    actualPrice: $scope.totalPrice
                }).then(function (data) {
                    if (data.success === true) {
                        // console.log("data", data);
                        $state.go("car_wash_fee")
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getCurrentCarWashFeeInfo();
    };
    $scope.queryData();
}]);