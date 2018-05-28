/**
 * Created by zcy on 2017/8/21.
 * Restructure by zcy on 2018/3/29.
 */
app.controller("instruction_plan_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.showMiddleCard = false;
    $scope.lineInfo = false;
    $scope.missionInfo = false;
    $scope.allRouteFeeInfo = false;
    $scope.applyRouteFeeBtn = true;
    $scope.addMissionBtn = true;
    $scope.hasRouteFeeInfoId = false;
    $scope.leftKeyWord = "";
    $scope.rightKeyWord = "";
    $scope.lineEndCityInfo = "";
    $scope.lineStartDate = "";
    $scope.lineStartTime = "";
    $scope.addDispatchMissionList = [];
    $(".load_mission").hide();

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
        // console.log("dispatchInfo",dispatchInfo);
        $scope.dispatchInfo = dispatchInfo;
        $scope.lineInfo = false;
        // 往期任务
        _basic.get($host.api_url + "/dpRouteTask?truckId=" + dispatchInfo.truck_id + "&taskStatus=10&start=0&size=5").then(function (pastMissionData) {
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
                currentLineData.result.reverse();
                $scope.currentLineList = currentLineData.result;
                // console.log("currentLineData", currentLineData);
            }
            else {
                swal(currentLineData.msg, "", "error");
            }
        });

        // 当前司机未执行调度任务
        _basic.get($host.api_url + "/dpRouteTask?driveId=" + dispatchInfo.drive_id + "&taskStatus=1").then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                $scope.dispatchMissionList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        $scope.showMiddleCard = true;
        // console.log("dispatchInfo", $scope.dispatchInfo);
    };

    // 显示修改车辆位置模态框
    $scope.showModifyCarPositionMod = function (transportDetails) {
        // console.log("transportDetails",transportDetails);
        $scope.transportDetails = transportDetails;
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success === true) {
                $scope.allCityList = data.result;
                $('#car_position').select2({
                    placeholder: '车辆当前位置',
                    containerCssClass : 'select2_dropdown'
                });
                $("#modifyCarPositionMod").modal("open");
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 修改车辆位置
    $scope.modifyCarPosition = function () {
        if($scope.positionCityId != "" && $scope.positionCityId != undefined){
            _basic.put($host.api_url + "/user/" + userId + "/truck/" + $scope.transportDetails.truck_id + "/dispatch",{
                currentCity: $scope.positionCityId
            }).then(function (data) {
                if (data.success === true) {
                    $('#modifyCarPositionMod').modal('close');
                    swal("设置成功", "", "success");
                    $scope.getCarDetails();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请选择车辆位置", "", "warning");
        }
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
                $('#chooseEndCity').select2({
                    placeholder: '选择城市',
                    containerCssClass: 'select2_dropdown'
                });
                // console.log("cityData", $scope.cityList)
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
        $scope.lineInfo = true;
    };

    /*// 控制tab显示隐藏
    $scope.showLoadMissionInfo = function (index) {
        $(".load_mission" + index).show();
        $(".route_fee_info").hide();
    };

    $scope.showRouteFeeInfo = function (index) {
        $scope.dispatchMissionNum = "";
        $(".route_fee_info" + index).show();
        $(".load_mission").hide();
    };*/

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

    // 删除路线
    $scope.deleteLine = function (deleteLineId,event) {
        // console.log("deleteLineId",deleteLineId);
        event.stopPropagation();
        swal({
                title: "确定删除当前路线吗？",
                text: "如果删除该路线，则包含该路线的出车款将与其解除关联",
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

    // 点击线路获取当前路线下的装车任务信息和出车款信息
    $scope.showMissionInfo = function (showLineId,showLineDate,startLineId,index) {
        // console.log("点击路线",showLineId,showLineDate,startLineId,index);
        $scope.showLineId = showLineId;
        $scope.showLineDate = showLineDate;
        $scope.startLineId = startLineId;
        $scope.clickIndex = index;

        // 默认显示当前装车任务
        $(".load_mission" + index).show();
        $(".route_fee_info").hide();

       /* // 默认蓝条回到最左，防止蹿位
        $(".tabs .indicator").css({
            right: 590 + "px",
            left: 0 + "px"
        });*/

        $scope.lineDate = moment(showLineDate).format("YYYY-MM-DD");// model双向的scope，用作任务时间默认显示和取值
        $scope.lineDateBak = moment(showLineDate).format("YYYY-MM-DD");// 不可改变的scope，用作刷新任务方法的参数使用
        $scope.startLineId = startLineId;
        $scope.missionInfo = false;
        $scope.addMissionBtn = true;

        // 装车任务信息
        _basic.get($host.api_url + "/dpRouteLoadTask?dpRouteTaskId=" + showLineId + "&loadTaskStatusArr=1,3,7").then(function (missionData) {
            if (missionData.success === true) {
                // console.log("getMissionData", missionData);
                if(missionData.result.length !== 0){
                    $scope.taskId = missionData.result[0].dp_route_task_id;
                    $scope.opName = missionData.result[0].task_op_name;
                }
                else{
                    $scope.taskId = "暂无";
                    $scope.opName = "暂无";
                }
                $scope.missionList = missionData.result;
            }
            else {
                swal(missionData.msg, "", "error");
            }
        });

       /* // 出车款信息
        _basic.get($host.api_url + "/dpRouteTaskLoan?dpRouteTaskId=" + showLineId).then(function (data) {
            if (data.success === true) {
                // console.log("出车款信息", data);
                if(data.result.length !== 0){
                    // 根据是否有出车款信息来判断是否有出车款id
                    $scope.hasRouteFeeInfoId = true;
                    $scope.routeFeeInfo = data.result[0];
                    // 有出车款信息时查询关联调度任务
                    $scope.getMatchDispatchMissionList(data.result[0].id,data.result[0].task_loan_status)
                }
                else{
                    // 无出车款信息时设置当前默认线路调度任务
                    $scope.addDispatchMissionList = [];
                    $scope.routeFeeInfo = {};
                    _basic.get($host.api_url + "/dpRouteTask?dpRouteTaskId=" + showLineId).then(function (data) {
                        if (data.success === true) {
                            // console.log("无出车款信息时设置当前默认线路调度任务",data);
                            data.result[0].dp_route_task_id = data.result[0].id;
                            $scope.addDispatchMissionList.push(data.result[0]);
                            $scope.routeFeeInfo.apply_passing_cost = data.result[0].distance * 0.8;
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                    $scope.hasRouteFeeInfoId = false;
                    $scope.allRouteFeeInfo = false;
                    $scope.applyRouteFeeBtn = true;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });*/
    };

    /*// 获取出车款下关联调度任务信息
    $scope.getMatchDispatchMissionList = function (loanId,status) {
        _basic.get($host.api_url + "/dpRouteTaskLoanRel?dpRouteTaskLoanId=" + loanId).then(function (data) {
            if (data.success === true) {
                // 根据是否有关联调度任务来判断是否需要申请出车款
                if(data.result.length !== 0){
                    $scope.allRouteFeeInfo = true;
                    $scope.applyRouteFeeBtn = false;
                }
                else{
                    $scope.allRouteFeeInfo = false;
                    $scope.applyRouteFeeBtn = true;
                }
                // console.log("关联调度任务", data);
                $scope.matchDispatchMissionList = data.result;
                // 未发放状态下计算过路费
                if(status == 1){
                    // 重新计算过路费
                    var distanceCount = 0;
                    for (var i = 0; i < $scope.matchDispatchMissionList.length; i++) {
                        $scope.routeFeeInfo.apply_passing_cost = (distanceCount += $scope.matchDispatchMissionList[i].distance) * 0.8
                    }
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };*/

    // 增加调度关联任务
    $scope.addMatchMission = function () {
        if($scope.dispatchMissionNum !== ""){
            // 根据是否有出车款判断是接口增还是前台增
            if($scope.hasRouteFeeInfoId){
                // 检测是否有相同的关联任务
                function checkDispatchId(obj) {
                    return obj.dp_route_task_id === $scope.dispatchMissionNum;
                }
                if ($scope.matchDispatchMissionList.some(checkDispatchId)) {
                    swal("不能重复添加相同任务！", "", "warning");
                }
                else{
                    _basic.post($host.api_url + "/user/" + userId + "/dpRouteTaskLoanRel",{
                        dpRouteTaskLoanId:$scope.routeFeeInfo.id,
                        dpRouteTaskId: $scope.dispatchMissionNum
                    }).then(function (data) {
                        if (data.success === true) {
                            // console.log("data", data);
                            swal("添加成功", "", "success");
                            $scope.getMatchDispatchMissionList($scope.routeFeeInfo.id,$scope.routeFeeInfo.task_loan_status);
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            }
            else{
                // 检测是否有相同的关联任务
                function checkAddDispatchId(obj) {
                    return obj.dp_route_task_id === $scope.dispatchMissionNum;
                }
                if ($scope.addDispatchMissionList.some(checkAddDispatchId)) {
                    swal("不能重复添加相同任务！", "", "warning");
                }
                else{
                    // 根据调度编号查询详细信息
                    _basic.get($host.api_url + "/dpRouteTaskLoanRel?dpRouteTaskId=" + $scope.dispatchMissionNum).then(function (data) {
                        if (data.success === true) {
                            // console.log("详细信息",data);
                            // 判断调度任务是否已被关联
                            if(data.result.length === 0){
                                // 查询详细信息
                                _basic.get($host.api_url + "/dpRouteTask?dpRouteTaskId=" + $scope.dispatchMissionNum + "&taskStatus=1").then(function (detailsData) {
                                    if (detailsData.success === true) {
                                        detailsData.result[0].dp_route_task_id = detailsData.result[0].id;
                                        $scope.addDispatchMissionList.push(detailsData.result[0]);
                                    }
                                    else {
                                        swal(detailsData.msg, "", "error");
                                    }
                                }).then(function () {
                                    // 重新计算过路费
                                    var distanceCount = 0;
                                    for (var i = 0; i < $scope.addDispatchMissionList.length; i++) {
                                        $scope.routeFeeInfo.apply_passing_cost = (distanceCount += $scope.addDispatchMissionList[i].distance) * 0.8
                                    }
                                });
                            }
                            else{
                                swal("此调度任务已被关联！", "", "warning");
                            }
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            }

        }
        else{
            swal("请选择任务信息！", "", "warning");
        }
    };

    // 删除调度任务（接口）
    $scope.deleteBackEndDispatchMission = function (loanId,taskId) {
        swal({
                title: "确定删除当前调度任务吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function(){
                _basic.delete($host.api_url + "/user/" + userId + "/dpRouteTaskLoan/" + loanId + "/dpRouteTask/" + taskId).then(function (data) {
                    if (data.success === true) {
                        // console.log("data", data);
                        $scope.getMatchDispatchMissionList(loanId,$scope.routeFeeInfo.task_loan_status)
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            });
    };

    // 删除调度任务（前台）
    $scope.deleteFrontEndDispatchMission = function (index) {
        swal({
                title: "确定删除当前调度任务吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function(){
                $scope.$apply(function () {
                    $scope.addDispatchMissionList.splice(index, 1);
                    // 重新计算过路费
                    if($scope.addDispatchMissionList.length === 0){
                        $scope.routeFeeInfo.apply_passing_cost = 0
                    }
                    else{
                        var distanceCount = 0;
                        for (var i = 0; i < $scope.addDispatchMissionList.length; i++) {
                            $scope.routeFeeInfo.apply_passing_cost = (distanceCount += $scope.addDispatchMissionList[i].distance) * 0.8
                        }
                    }
                });
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
                $('.destination_city').select2({
                    placeholder: '目的地城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
    };

    // 选择装车地点时重置目的地城市和经销商
    $scope.cancelDestinationCity = function () {
        $scope.addrList = [];
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
    $scope.submitMissionInfo = function (lineId,index) {
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
                    $scope.showMissionInfo(lineId,$scope.lineDateBak,$scope.startLineId,index);
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

    // 删除装车任务
    $scope.deleteMission = function (missionId, lineId) {
        // console.log("删除装车任务",missionId, lineId);
        swal({
                title: "确定删除当前装车任务吗？",
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
                        $scope.showMissionInfo(lineId,$scope.showLineDate,$scope.startLineId,$scope.clickIndex);
                        swal("删除成功", "", "success");
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            });
    };

    // 点击申请出车款
    $scope.applyRouteFee = function () {
        $scope.allRouteFeeInfo = true;
        $scope.applyRouteFeeBtn = false;
        // $scope.routeFeeInfo.apply_passing_cost = 0;
        $scope.routeFeeInfo.apply_fuel_cost = 0;
        $scope.routeFeeInfo.apply_protect_cost = 0;
        $scope.routeFeeInfo.apply_penalty_cost = 0;
        $scope.routeFeeInfo.apply_parking_cost = 0;
        $scope.routeFeeInfo.apply_taxi_cost = 0;
        $scope.routeFeeInfo.apply_explain = "";
    };

    // 保存出车款信息
    $scope.saveRouteFeeInfo = function (index) {
        var totalCost = parseFloat($("#totalCost").html()).toFixed(2);
        var saveDpRouteTaskIdArr = [];
        var addDpRouteTaskIdArr = [];
        // 根据有无出车款id判断是新增操作还是保存操作
        if($scope.hasRouteFeeInfoId){
            // 保存
            for (var i = 0; i < $scope.matchDispatchMissionList.length; i++) {
                saveDpRouteTaskIdArr.push($scope.matchDispatchMissionList[i].dp_route_task_id)
            }
            _basic.put($host.api_url + "/user/" + userId + "/dpRouteTaskLoanApply/" + $scope.routeFeeInfo.id,{
                applyPassingCost: $scope.routeFeeInfo.apply_passing_cost,
                applyFuelCost: $scope.routeFeeInfo.apply_fuel_cost,
                applyProtectCost: $scope.routeFeeInfo.apply_protect_cost,
                applyPenaltyCost: $scope.routeFeeInfo.apply_penalty_cost,
                applyParkingCost: $scope.routeFeeInfo.apply_parking_cost,
                applyTaxiCost: $scope.routeFeeInfo.apply_taxi_cost,
                applyExplain: $scope.routeFeeInfo.apply_explain,
                applyPlanMoney: parseFloat(totalCost),
                dpRouteTaskIds: saveDpRouteTaskIdArr
            }).then(function (data) {
                if (data.success === true) {
                    swal("保存成功", "", "success");
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            // 新增
            for (var j = 0; j < $scope.addDispatchMissionList.length; j++) {
                addDpRouteTaskIdArr.push($scope.addDispatchMissionList[j].dp_route_task_id)
            }
            _basic.post($host.api_url + "/user/" + userId + "/dpRouteTaskLoan", {
                driveId: $scope.dispatchInfo.drive_id,
                applyPassingCost: $scope.routeFeeInfo.apply_passing_cost,
                applyFuelCost: $scope.routeFeeInfo.apply_fuel_cost,
                applyProtectCost: $scope.routeFeeInfo.apply_protect_cost,
                applyPenaltyCost: $scope.routeFeeInfo.apply_penalty_cost,
                applyParkingCost: $scope.routeFeeInfo.apply_parking_cost,
                applyTaxiCost: $scope.routeFeeInfo.apply_taxi_cost,
                applyExplain: $scope.routeFeeInfo.apply_explain,
                applyPlanMoney: parseFloat(totalCost),
                dpRouteTaskIds: addDpRouteTaskIdArr
            }).then(function (data) {
                if (data.success === true) {
                    swal("操作成功", "", "success");
                    $scope.showMissionInfo($scope.showLineId,$scope.showLineDate,$scope.startLineId,$scope.clickIndex);
                    // 默认显示当前装车任务
                    $(".route_fee_info" + index).show();
                    $(".load_mission").hide();

                    // 默认蓝条回到最左，防止蹿位
                    $(".tabs .indicator").css({
                        right: 0 + "px",
                        left: 603 + "px"
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getDeliveryCarInfo();
        $scope.getCarDetails();
    };
    $scope.queryData();
}]);