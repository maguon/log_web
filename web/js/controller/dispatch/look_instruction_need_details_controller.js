/**
 * Created by ASUS on 2017/9/4.
 */


app.controller("look_instruction_need_details_controller", ["$scope", "$host", "_basic", "$state", "$stateParams", function ($scope, $host, _basic, $state, $stateParams) {
    $scope.LoadTaskList = false;
    var userId = _basic.getSession(_basic.USER_ID);


    // 返回
    $scope.return = function () {
        $state.go($stateParams.from,{from:"look_instruction_need_details"}, {reload: true})
    };


    // 获取需求详情信息
    $scope.getDispatchInfo = function () {
        _basic.get($host.api_url + "/dpDemand?dpDemandId=" + $stateParams.id).then(function (data) {
            if (data.success === true && data.result.length > 0) {
                $scope.this_instruction = data.result[0];
                if ($scope.this_instruction.date_id) {
                    $scope.data_id = moment($scope.this_instruction.date_id.toString()).format("YYYY-MM-DD");
                }
                else {
                    $scope.data_id = "";
                }
            }
        });

        _basic.get($host.api_url + "/dpRouteLoadTask?dpDemandId=" + $stateParams.id).then(function (data) {
            if (data.success === true) {
                // console.log("data",data);
                var sendPlanCount = 0;
                for (var i = 0; i < data.result.length; i++) {
                    sendPlanCount += data.result[i].plan_count
                }
                $scope.disPatchInfoList = data.result;
                $scope.PlanCount = sendPlanCount;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 控制商品车详情开合
    $scope.open_LoadTaskList = function (id) {
            _basic.get($host.api_url + "/dpRouteLoadTask/" + id + "/dpRouteLoadTaskDetail").then(function (data) {
                if (data.success == true && data.result.length >= 0) {
                    $scope.this_LoadTaskList = data.result;
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        _basic.get($host.api_url + "/dpRouteLoadTask?dpRouteLoadTaskId=" + id).then(function (data) {
            if (data.success == true && data.result.length >= 0) {
                $scope.loadTaskModelList = data.result[0];
            }
            else {
                swal(data.msg, "", "error");
            }
        })

        $('#carInfoModel').modal('open');
    };

    // 取消需求
    $scope.cancelInstruction = function () {
        swal({
                title: "确定取消当前需求吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function(){
                _basic.put($host.api_url + "/user/" + userId + "/dpDemand/" + $stateParams.id + "/demandStatus/0",{}).then(function (data) {
                    if (data.success === true) {
                        swal("取消成功", "", "success");
                        $scope.getDispatchInfo();
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            });
    };

    // 完成需求
    $scope.completeInstruction = function () {
        swal({
                title: "确定完成当前需求吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function(){
                _basic.put($host.api_url + "/user/" + userId + "/dpDemand/" + $stateParams.id + "/demandStatus/2",{}).then(function (data) {
                    if (data.success === true) {
                        swal("成功", "", "success");
                        $scope.getDispatchInfo();
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            });
    };

    $scope.queryData = function () {
        $scope.getDispatchInfo();
    };
    $scope.queryData();
}]);