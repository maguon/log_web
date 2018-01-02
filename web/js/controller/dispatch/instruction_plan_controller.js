/**
 * Created by zcy on 2017/8/21.
 */
app.controller("instruction_plan_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.showMiddleCard = false;
    $scope.lineInfo = false;
    $scope.missionInfo = false;
    $scope.addMissionBtn = true;
    $scope.leftKeyWord = "";
    $scope.rightKeyWord = "";
    $scope.lineEndCityInfo = "";
    $scope.lineStartDate = "";
    $scope.lineStartTime = "";

    // 获取发运商品车信息（左侧信息卡片）
    $scope.getDeliveryCarInfo = function () {
        _basic.get($host.api_url + "/dpTaskStat?dpTaskStatStatus=1").then(function (dispatchCarData) {
            if (dispatchCarData.success === true) {
                // 转换日期格式
                for (var i = 0; i < dispatchCarData.result.length; i++) {
                    dispatchCarData.result[i].date_id = moment(dispatchCarData.result[i].date_id.toString()).format("YYYY-MM-DD");
                }
                $scope.disPatchCarList = dispatchCarData.result;
                $scope.newDispatchCarList = $scope.disPatchCarList;
                // console.log("$scope.newDispatchCarList", $scope.newDispatchCarList)
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
                for (var i = 0; i < carDetailsData.result.length; i++) {
                    if (carDetailsData.result[i].drive_name === null) {
                        carDetailsData.result[i].drive_name = "";
                    }
                    if (carDetailsData.result[i].city_name === null) {
                        carDetailsData.result[i].city_name = "";
                    }
                    if(carDetailsData.result[i].current_city === 0){
                        carDetailsData.result[i].operate_status = "在途"
                    }
                    else{
                        carDetailsData.result[i].operate_status = "待运中"
                    }
                }
                $scope.carDetailsList = carDetailsData.result;
                $scope.newCarDetailsList = $scope.carDetailsList;
                // console.log("carDetailsData", $scope.newCarDetailsList);
            }
            else {
                swal(carDetailsData.msg, "", "error");
            }
        });
    };

    // 根据输入的关键字筛选左侧卡片信息
    $scope.updateLeftCardList = function () {
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
        // console.log("currentModelInfo", currentModelInfo);
        $scope.currentModelInfo = currentModelInfo;
        // 根据当前卡片信息查询距离
        _basic.get($host.api_url + "/cityRoute?routeStartId=" + currentModelInfo.route_start_id + "&routeEndId=" + currentModelInfo.route_end_id).then(function (distanceData) {
            if (distanceData.success === true) {
                // console.log("distanceData", distanceData);
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
        _basic.get($host.api_url + "/dpDemand?" + _basic.objToUrl({
            dateIdStart: currentModelInfo.date_id,
            dateIdEnd:currentModelInfo.date_id,
            routeStartId: currentModelInfo.route_start_id,
            routeEndId: currentModelInfo.route_end_id,
            demandStatus:"1"
        })).then(function (data) {
            if (data.success === true) {
                // console.log("data",data);
                $scope.transportationList = data.result;
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
        $scope.lineInfo = false;
        // 往期任务
        _basic.get($host.api_url + "/dpRouteTask?truckId=" + dispatchInfo.truck_id + "&taskStatus=10").then(function (pastMissionData) {
            if (pastMissionData.success === true) {
                // 转换日期格式
                for (var i = 0; i < pastMissionData.result.length; i++) {
                    pastMissionData.result[i].date_id = moment(pastMissionData.result[i].date_id.toString()).format("YYYY-MM-DD")
                }
                $scope.pastMissionList = pastMissionData.result;
                // console.log("pastMissionData", pastMissionData);
            }
            else {
                swal(pastMissionData.msg, "", "error");
            }
        });

        // 当前线路
        _basic.get($host.api_url + "/dpRouteTask?truckId=" + dispatchInfo.truck_id + "&taskStatusArr=1,2,3,4").then(function (currentLineData) {
            if (currentLineData.success === true) {
                $scope.currentLineList = currentLineData.result;
                // console.log("currentLineData", currentLineData);
            }
            else {
                swal(currentLineData.msg, "", "error");
            }
        });
        $scope.showMiddleCard = true;
        // console.log("dispatchInfo", $scope.dispatchInfo);
    };

    // 生成线路按钮,点击显示路线信息并获取城市信息
    $scope.showCreateLine = function (cityId) {
        var startCityId;
        $scope.lineEndCityInfo = "";
        $scope.lineStartDate = "";
        // 线路的起始城市根据当前线路的最后一条的结束城市为准
        if($scope.currentLineList.length === 0){
            $scope.startCityName = $scope.dispatchInfo.city_name;
            startCityId = cityId;
        }
        else{
            $scope.startCityName = $scope.currentLineList[$scope.currentLineList.length - 1].city_route_end;
            startCityId = $scope.currentLineList[$scope.currentLineList.length - 1].route_end_id
        }
        _basic.get($host.api_url + "/cityRouteDispatch?routeStartId=" + startCityId).then(function (cityData) {
            if (cityData.success === true) {
                $scope.cityList = cityData.result;
                // console.log("cityData", $scope.cityList)
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
        $scope.lineInfo = true;
    };

    // 线路填写完毕后确认按钮
    $scope.confirmChange = function () {
        if ($scope.lineEndCityInfo != "" && $scope.lineStartDate != "") {
            var routeStartId = $scope.currentLineList.length === 0 ? $scope.dispatchInfo.current_city :  $scope.currentLineList[$scope.currentLineList.length - 1].route_end_id;
            // console.log("routeStartId",routeStartId);
            _basic.post($host.api_url + "/user/" + userId + "/dpRouteTask", {
                truckId: $scope.dispatchInfo.truck_id,
                driveId: $scope.dispatchInfo.drive_id,
                routeStartId: routeStartId,
                routeEndId: $scope.lineEndCityInfo.end_id,
                distance: $scope.lineEndCityInfo.distance,
                taskPlanDate: $scope.lineStartDate
            }).then(function (data) {
                if (data.success === true) {
                    $scope.lineInfo = false;
                    $scope.showDispatchInfo($scope.dispatchInfo);
                    swal("新增成功", "", "success");
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

    // 新增路线取消按钮
    $scope.hideLineInfo = function () {
        $scope.lineInfo = false;
    };

    // 删除线路
    $scope.deleteLine = function (deleteLineId,event) {
        // console.log("deleteLineId",deleteLineId);
        event.stopPropagation();
        swal({
                title: "确定删除当前线路吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },
            function(){
                _basic.delete($host.api_url + "/user/" + userId + "/dpRouteTask/" + deleteLineId).then(function (data) {
                    if (data.success === true) {
                        $scope.showDispatchInfo($scope.dispatchInfo);
                        swal("删除成功", "", "success");
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            });
    };

    // 点击线路获取当前路线下的任务
    $scope.showMissionInfo = function (showLineId,showLineDate,startLineId) {
        $scope.lineDate = moment(showLineDate).format("YYYY-MM-DD");// model双向的scope，用作任务时间默认显示和取值
        $scope.lineDateBak = moment(showLineDate).format("YYYY-MM-DD");// 不可改变的scope，用作刷新任务方法的参数使用
        $scope.startLineId = startLineId;
        $scope.missionInfo = false;
        $scope.addMissionBtn = true;
        _basic.get($host.api_url + "/dpRouteLoadTask?dpRouteTaskId=" + showLineId + "&loadTaskStatusArr=1,3,7").then(function (missionData) {
            if (missionData.success === true) {
                // console.log("getMissionData", missionData);
                $scope.missionList = missionData.result;
            }
            else {
                swal(missionData.msg, "", "error");
            }
        });
    };

    // 增加任务
    $scope.addMission = function () {
        $scope.addMissionBtn = false;
        $scope.locateId = "";
        $scope.sendCityId = "";
        $scope.receiveInfo = "";
        $scope.distributeNum = "";
        $scope.lineStartTime = "";

        // 获取装车地点信息
        _basic.get($host.api_url + "/baseAddr?cityId=" + $scope.startLineId).then(function (locateData) {
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
                $('.js-example-basic-single').select2({
                    placeholder: '选择城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
    };

    // 关闭任务
    $scope.closeMissionInfo = function () {
        $scope.missionInfo = false;
        $scope.addMissionBtn = true;
    };

    // 根据选择的城市获取送达经销商和指令时间及派发数量信息
    $scope.getReceiveDistributor = function (lineId) {
        if($scope.locateId != ""){
            _basic.get($host.api_url + "/dpDemandBase?" + _basic.objToUrl({
                dpRouteTaskId:lineId,
                routeStartId:$scope.startLineId,
                baseAddrId:$scope.locateId,
                routeEndId:$scope.sendCityId,
                demandStatus:"1"
            })).then(function (addrData) {
                if (addrData.success === true) {
                    $scope.addrList = addrData.result;
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



    // 提交线路下的任务信息
    $scope.submitMissionInfo = function (lineId) {
        if($scope.locateId != "" && $scope.sendCityId != "" && $scope.receiveInfo != "" && $scope.distributeNum != "" && $scope.lineDate != "" && $scope.lineStartTime != ""){
            _basic.post($host.api_url + "/user/" + userId + "/dpRouteTask/" + lineId + "/dpRouteLoadTask",{
                dpDemandId:$scope.receiveInfo.id,
                routeStartId:$scope.dispatchInfo.current_city,
                baseAddrId:$scope.locateId,
                routeEndId:$scope.sendCityId,
                receiveId:$scope.receiveInfo.receive_id,
                dateId:$scope.receiveInfo.date_id,
                planDate:$scope.lineDate + " " + $scope.lineStartTime,
                planCount:$scope.distributeNum
            }).then(function (data) {
                if(data.success === true){
                    swal("新增成功", "", "success");
                    $scope.missionInfo = false;
                    $scope.addMissionBtn = true;
                    $scope.showMissionInfo(lineId,$scope.lineDateBak,$scope.startLineId);
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

    // 删除任务信息
    $scope.deleteMission = function (missionId, lineId) {
        // console.log("missionId", missionId, "lineId", lineId);
        swal({
                title: "确定删除当前任务吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },
            function () {
                _basic.delete($host.api_url + "/user/" + userId + "/dpRouteLoadTask/" + missionId).then(function (data) {
                    if (data.success === true) {
                        $scope.showMissionInfo(lineId);
                        swal("删除成功", "", "success");
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            });
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