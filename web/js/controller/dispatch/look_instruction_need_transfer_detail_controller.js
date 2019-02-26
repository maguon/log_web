/**
 * Created by ASUS on 2017/9/4.
 */
app.controller("look_instruction_need_transfer_detail_controller", ["$scope", "$host", "_basic", "$state", "$stateParams", function ($scope, $host, _basic, $state, $stateParams) {
    $scope.LoadTaskList = false;


    // 返回
    $scope.return = function () {
        $state.go($stateParams.from,{from:"look_instruction_need_transfer_detail"}, {reload: true})
    };

    // 获取需求详情信息
    $scope.getDispatchInfo = function () {
        _basic.get($host.api_url + "/dpTransferDemand?transferDemandId=" + $stateParams.id).then(function (data) {
            if (data.success === true && data.result.length > 0) {
                $scope.this_instruction = data.result[0];
                $scope.this_instruction.date_id = data.result[0].date_id;
                $scope.this_instruction.transfer_city_id = data.result[0].transfer_city_id;
                $scope.this_instruction.route_start_id = data.result[0].route_start_id;
                $scope.this_instruction.route_end_id = data.result[0].route_end_id;
                if ($scope.this_instruction.date_id) {
                    $scope.dateId = moment($scope.this_instruction.date_id.toString()).format("YYYY-MM-DD");
                }
                else {
                    $scope.dateId = "";
                }
                getdisPatchInfo($scope.this_instruction.date_id,$scope.this_instruction.transfer_city_id, $scope.this_instruction.route_start_id,$scope.this_instruction.route_end_id,$scope.this_instruction.receive_id,$scope.this_instruction.demand_id);

            }
        });
    };
    function getdisPatchInfo(date_id,transfer_city_id,route_start_id,route_end_id,receive_id,demand_id){
        //即将到达
        _basic.get($host.api_url + "/dpRouteLoadTask?"+
        _basic.objToUrl({
            dateId: date_id,
            receiveId:receive_id,
            dpDemandId:demand_id,
            transferCityId: transfer_city_id,
            routeStartId:route_start_id,
            routeEndId: route_end_id,
            loadTaskStatus:3
        })).then(function (data) {
            if (data.success === true) {
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
        //已经到达
        _basic.get($host.api_url + "/dpRouteLoadTask?"+
            _basic.objToUrl({
                dateId: date_id,
                dpDemandId:demand_id,
                receiveId:receive_id,
                transferCityId: transfer_city_id,
                routeStartId:route_start_id,
                routeEndId: route_end_id,
                loadTaskStatus:7
            })).then(function (data) {
            if (data.success === true) {
                var sendPlanCount = 0;
                for (var i = 0; i < data.result.length; i++) {
                    sendPlanCount += data.result[i].plan_count
                }
                $scope.disPatchHaveInfoList = data.result;
                $scope.PlanCount = sendPlanCount;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    // 控制模态框
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

    $scope.queryData = function () {
        $scope.getDispatchInfo();
    };
    $scope.queryData();
}]);