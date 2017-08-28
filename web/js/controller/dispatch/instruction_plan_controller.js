/**
 * Created by zcy on 2017/8/21.
 */
app.controller("instruction_plan_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.showMiddleCard = false;
    $scope.lineInfo = false;
    // $scope.lineInfoTxt = false;
    $scope.missionInfo = false;
    $scope.missionTxt = false;
    $scope.leftKeyWord = "";
    $scope.rightKeyWord = "";

    // 获取发运商品车信息（左侧信息卡片）
    $scope.getDeliveryCarInfo = function () {
        _basic.get($host.api_url + "/dpTaskStat").then(function (dispatchCarData) {
            if (dispatchCarData.success === true) {
                // 转换日期格式
                for (var i = 0; i < dispatchCarData.result.length; i++) {
                    dispatchCarData.result[i].date_id = moment(dispatchCarData.result[i].date_id.toString()).format("YYYY-MM-DD");
                }
                $scope.disPatchCarList = dispatchCarData.result;
                $scope.newDispatchCarList = $scope.disPatchCarList;
                console.log("$scope.newDispatchCarList", $scope.newDispatchCarList)
            }
            else {
                swal(dispatchCarData.msg, "", "error");
            }
        });
    };

    // 获取车辆详情信息（右侧信息卡片）
    $scope.getCarDetails = function () {
        _basic.get($host.api_url + "/truckDispatch?dispatchFlag=1").then(function (carDetailsData) {
            if (carDetailsData.success === true) {
                // 防止过滤出错，将信息为null的转为空字符串
                for(var i = 0;i<carDetailsData.result.length;i++){
                    if(carDetailsData.result[i].drive_name === null){
                        carDetailsData.result[i].drive_name = "";
                    }
                    if(carDetailsData.result[i].city_name === null){
                        carDetailsData.result[i].city_name = "";
                    }
                }
                $scope.carDetailsList = carDetailsData.result;
                $scope.newCarDetailsList = $scope.carDetailsList;
                console.log("carDetailsData", $scope.newCarDetailsList);
            }
            else {
                swal(carDetailsData.msg, "", "error");
            }
        });
    };

    // 根据输入的关键字筛选左侧卡片信息
    $scope.updateLeftCardList = function () {
        console.log("leftKeyWord",$scope.leftKeyWord);
        $scope.newDispatchCarList = [];
        if($scope.leftKeyWord != ""){
            for(var i = 0;i < $scope.disPatchCarList.length;i++){
                if(($scope.disPatchCarList[i].city_route_start).indexOf($scope.leftKeyWord) !== -1 || ($scope.disPatchCarList[i].city_route_end).indexOf($scope.leftKeyWord) !== -1){
                    $scope.newDispatchCarList.push($scope.disPatchCarList[i])
                }
            }
        }
        else{
            $scope.newDispatchCarList = $scope.disPatchCarList;
        }

    };

    // 根据输入的关键字筛选右侧卡片信息
    $scope.updateRightCardList = function () {
        console.log("rightKeyWord",$scope.rightKeyWord);
        $scope.newCarDetailsList = [];
        if($scope.rightKeyWord != ""){
            for(var i = 0;i < $scope.carDetailsList.length;i++){
                if(($scope.carDetailsList[i].truck_num).indexOf($scope.rightKeyWord) !== -1 || ($scope.carDetailsList[i].city_name).indexOf($scope.rightKeyWord) !== -1 || ($scope.carDetailsList[i].drive_name).indexOf($scope.rightKeyWord) !== -1){
                    $scope.newCarDetailsList.push($scope.carDetailsList[i])
                }
            }
        }
        else{
            $scope.newCarDetailsList = $scope.carDetailsList;
        }
    };

    // 点击左侧卡片详情显示模态框
    $scope.showCarInfoModel = function (currentModelInfo) {
        console.log("currentModelInfo", currentModelInfo);
        $scope.currentModelInfo = currentModelInfo;
        // 根据当前卡片信息查询距离
        _basic.get($host.api_url + "/cityRoute?routeStartId=" + currentModelInfo.route_start_id + "&routeEndId=" + currentModelInfo.route_end_id).then(function (distanceData) {
            if (distanceData.success === true) {
                console.log("distanceData", distanceData);
                if (distanceData.result.length === 0) {
                    $scope.currentDistance = "notSet"
                }
                else {
                    $scope.currentDistance = distanceData.result[0].distance
                }
            }
            else {
                swal(distanceData.msg, "", "error");
            }
        });

        // 根据卡片信息查询起始目的地信息
        _basic.get($host.api_url + "/dpTaskStatBase?" + _basic.objToUrl({
                routeStartId: currentModelInfo.route_start_id,
                routeEndId: currentModelInfo.route_end_id,
                dateId: parseInt(moment(currentModelInfo.date_id).format("YYYYMMDD"))
            })).then(function (data) {
            if (data.success === true) {
                $scope.transportationList = data.result;
                console.log("data", data);
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // console.log("currentModelInfo",currentModelInfo);
        $('#carInfoModel').modal('open');
    };

    // 点击右侧卡片显示调度指令信息,并获取往期任务及当前任务
    $scope.showDispatchInfo = function (dispatchInfo) {
        $scope.dispatchInfo = dispatchInfo;
        // 往期任务
        _basic.get($host.api_url + "/dpRouteTask?truckId=" + dispatchInfo.truck_id + "&taskStatus=9").then(function (pastMissionData) {
            if (pastMissionData.success === true) {
                $scope.pastMissionList = pastMissionData.result;
                console.log("pastMissionData", pastMissionData);
            }
            else {
                swal(pastMissionData.msg, "", "error");
            }
        });

        // 当前线路
        _basic.get($host.api_url + "/dpRouteTaskBase?truckId=" + dispatchInfo.truck_id).then(function (currentMissionData) {
            if (currentMissionData.success === true) {
                $scope.currentMissionList = currentMissionData.result;
                console.log("currentMissionData", currentMissionData);
            }
            else {
                swal(currentMissionData.msg, "", "error");
            }
        });
        $scope.showMiddleCard = true;
        console.log("dispatchInfo", $scope.dispatchInfo);
    };

    // 生成线路按钮,点击显示路线信息并获取城市信息
    $scope.showCreateLine = function (cityId) {
        console.log("cityId", cityId);
        _basic.get($host.api_url + "/cityRouteDispatch?routeStartId=" + cityId).then(function (cityData) {
            if (cityData.success === true) {
                $scope.cityList = cityData.result;
                console.log("cityData", $scope.cityList)
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
        $scope.lineInfo = true;
    };

    // 线路填写完毕后确认按钮
    $scope.confirmChange = function () {
        $scope.cityTxt = document.getElementById("city").options[document.getElementById("city").selectedIndex].text;
        if ($scope.lineEndCityInfo != undefined && $scope.lineStartTime != undefined) {
            _basic.post($host.api_url + "/user/" + userId + "/dpRouteTask", {
                truckId: $scope.dispatchInfo.truck_id,
                driveId: $scope.dispatchInfo.drive_id,
                routeStartId: $scope.dispatchInfo.current_city,
                routeEndId: $scope.lineEndCityInfo.end_id,
                distance: $scope.lineEndCityInfo.distance,
                taskPlanDate: $scope.lineStartTime
            }).then(function (data) {
                if (data.success === true) {
                    // $scope.lineInfoTxt = true;
                    $scope.lineInfo = false;
                    $scope.lineId = data.id;
                    console.log("lineId",$scope.lineId);
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else {
            swal("请填写完整信息", "", "error");
        }
    };

    // 增加任务
    $scope.addMission = function () {
        // 获取装车地点信息
        _basic.get($host.api_url + "/baseAddr?cityId=" + $scope.dispatchInfo.current_city).then(function (locateData) {
            if (locateData.success === true) {
                $scope.locateList = locateData.result;
                $scope.missionInfo = true;
                // console.log("locateData",locateData);
            }
            else {
                swal(locateData.msg, "", "error");
            }
        });

        // 获取送达城市
        _basic.get($host.api_url + "/city").then(function (cityData) {
            if (cityData.success === true) {
                $scope.sendCityList = cityData.result;
                console.log("city",cityData)
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
    };

    // 根据选择的城市获取送达经销商和指令时间及派发数量信息
    $scope.getReceiveDistributor = function () {
        console.log("sendCityId",$scope.sendCityId);
        if($scope.locateId != undefined){
            _basic.get($host.api_url + "/dpTaskStatBase?" + _basic.objToUrl({
                    routeStartId:$scope.dispatchInfo.current_city,
                    baseAddrId:$scope.locateId,
                    routeEndId:$scope.sendCityId
                })).then(function (addrData) {
                if (addrData.success === true) {
                    $scope.addrList = addrData.result;
                    console.log("addrData",addrData)
                }
                else {
                    swal(addrData.msg, "", "error");
                }
            });
        }
        else{
            swal("请先选择装车地点", "", "error");
        }

    };

    // 根据条件获取指令时间
    $scope.getInstructionsTime = function () {
        console.log("receiveInfo",$scope.receiveInfo);
    };

    // 提交线路信息
    $scope.submitMissionInfo = function () {
        $scope.loadingAddrTxt = document.getElementById("chooseLocate").options[document.getElementById("chooseLocate").selectedIndex].text;
        $scope.sendCityTxt = document.getElementById("chooseCity").options[document.getElementById("chooseCity").selectedIndex].text;
        $scope.sendAddrTxt = document.getElementById("chooseDistributor").options[document.getElementById("chooseDistributor").selectedIndex].text;

        if($scope.locateId != undefined && $scope.sendCityId != undefined && $scope.receiveInfo != null && $scope.distributeNum != undefined){
            _basic.post($host.api_url + "/user/" + userId + "/dpRouteTask/" + $scope.lineId + "/dpRouteLoadTask",{
                routeStartId:$scope.dispatchInfo.current_city,
                baseAddrId:$scope.locateId,
                routeEndId:$scope.sendCityId,
                receiveId:$scope.receiveInfo.receive_id,
                dateId:$scope.receiveInfo.date_id,
                planCount:$scope.distributeNum
            }).then(function (data) {
                if(data.success === true){
                    swal("新增成功", "", "success");
                    console.log("data",data);
                    $scope.missionInfo = false;
                    $scope.missionTxt = true;
                }
                else{
                    swal(data.msg, "", "error");
                }
            })
        }
        else{
            swal("请填写完整信息", "", "error");
        }
    };

    $scope.closeModel = function () {
        $('#carInfoModel').modal('close');
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getDeliveryCarInfo();
        $scope.getCarDetails();
    };
    $scope.queryData();
}]);