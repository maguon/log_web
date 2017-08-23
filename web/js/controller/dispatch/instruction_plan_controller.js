/**
 * Created by zcy on 2017/8/21.
 */
app.controller("instruction_plan_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.showMiddleCard = false;

    // 获取发运商品车信息
    $scope.getDeliveryCarInfo = function () {
        _basic.get($host.api_url + "/dpTaskStat").then(function (dispatchCarData) {
            if (dispatchCarData.success === true) {
                // 转换日期格式
                for (var i = 0; i < dispatchCarData.result.length;i++) {
                    dispatchCarData.result[i].date_id = moment(dispatchCarData.result[i].date_id.toString()).format("YYYY-MM-DD");
                }
                $scope.disPatchCarList = dispatchCarData.result;
                console.log("$scope.disPatchCarList", $scope.disPatchCarList)
            }
            else {
                swal(dispatchCarData.msg, "", "error");
            }
        });
    };

    // 获取车辆详情信息
    $scope.getCarDetails = function () {
        _basic.get($host.api_url + "/truckDispatch?dispatchFlag=1").then(function (carDetailsData) {
            if (carDetailsData.success === true) {
                $scope.carDetailsList = carDetailsData.result;
                console.log("carDetailsData", carDetailsData)
            }
            else {
                swal(carDetailsData.msg, "", "error");
            }
        });
    };

    // 点击左侧卡片详情显示模态框
    $scope.showCarInfoModel = function (currentModelInfo) {
        console.log("currentModelInfo",currentModelInfo);
        $scope.currentModelInfo = currentModelInfo;
        // 根据当前卡片信息查询距离
        _basic.get($host.api_url + "/cityRoute?routeStartId=" + currentModelInfo.route_start_id + "&routeEndId=" + currentModelInfo.route_end_id).then(function (distanceData) {
            if (distanceData.success === true) {
                console.log("distanceData",distanceData);
                if(distanceData.result.length === 0){
                    $scope.currentDistance = "notSet"
                }
                else{
                    $scope.currentDistance = distanceData.result[0].distance
                }
            }
            else {
                swal(distanceData.msg, "", "error");
            }
        });

        // 根据卡片信息查询起始目的地信息
        _basic.get($host.api_url + "/dpTaskStatBase?" + _basic.objToUrl({
                routeStartId:currentModelInfo.route_start_id,
                routeEndId:currentModelInfo.route_end_id,
                dateId:parseInt(moment(currentModelInfo.date_id).format("YYYYMMDD"))
            })).then(function (data) {
            if (data.success === true) {
                $scope.transportationList = data.result;
                console.log("data",data);
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // console.log("currentModelInfo",currentModelInfo);
        $('#carInfoModel').modal('open');
    };

    // 点击右侧卡片显示调度指令信息,并获取往期任务
    $scope.showDispatchInfo = function (dispatchInfo) {
        $scope.dispatchInfo = dispatchInfo;
        // 往期任务
        _basic.get($host.api_url + "/dpRouteTask?truckId=" + dispatchInfo.truck_id + "&taskStatus=9").then(function (missionData) {
            if (missionData.success === true) {
                $scope.pastMissionList = missionData.result;
                console.log("missionData", missionData)
            }
            else {
                swal(missionData.msg, "", "error");
            }
        });
        $scope.showMiddleCard = true;
        console.log("dispatchInfo",$scope.dispatchInfo);
    };

    $scope.closeModel = function () {
        $('#carInfoModel').modal('close');
    };

    $scope.queryData = function () {
        $scope.getDeliveryCarInfo();
        $scope.getCarDetails();
    };
    $scope.queryData();
}]);