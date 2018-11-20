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
    $scope.rightKeyWord2 = "";
    $scope.lineEndCityInfo = "";
    $scope.lineStartDate = "";
    $scope.lineStartTime = "";
    $scope.addDispatchMissionList = [];
    $(".load_mission").hide();
    $scope.transportationTransportPlanCount=0;
    $scope.arriveTransportPlanCount=0;
    $scope.dateTime = null;
    //增加装车任务时，默认始发站出发
    $scope.selectWhereStart=1;
    $scope.truckNumberCount =0;
    $scope.truckIdCount =0;

    //中间调度指令边儿上的（待运和在途）
    function truckDispatchCount(){
        _basic.get($host.api_url + "/truckDispatchCount?dispatchFlag=1").then(function (data) {
            if (data.success === true) {
                $scope.readyAcceptCount =data.result[0].ready_accept_count;
                $scope.onRoadCount =data.result[0].on_road_count;
            }
        })
    }

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
            }
            else {
                swal(dispatchCarData.msg, "", "error");
            }
        });
        _basic.get($host.api_url + "/dpTransferDemandStat?transferStatus=1").then(function (data) {
            if (data.success === true) {
                // 转换日期格式
                for (var i = 0; i < data.result.length; i++) {
                    data.result[i].date_id = moment(data.result[i].date_id.toString()).format("YYYY-MM-DD");
                }
                $scope.transferdisPatchCarList = data.result;
                $scope.newTransferDispatchCarList = $scope.transferdisPatchCarList;
            }
            else {
                swal(data.msg, "", "error");
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
                        carDetailsData.result[i].operate_status = "途"
                    }
                    else{
                        carDetailsData.result[i].operate_status = "待"
                    }
                }
                $scope.carDetailsList = carDetailsData.result;
                $scope.newCarDetailsList = $scope.carDetailsList;

            }
            else {
                swal(carDetailsData.msg, "", "error");
            }
        });
        _basic.get($host.api_url + '/cityTruckDispatchCount?dispatchFlag=1').then(function (locateData) {
            if (locateData.success === true) {
                $scope.truckIdCount = locateData.result[0].truck_id;
                $scope.truckNumberCount = locateData.result[0].truck_number;
            }
            else {
                swal(locateData.msg, "", "error");
            }
        });
    };
    $scope.getCarDetails2 = function () {
        _basic.get($host.api_url + "/truckDispatch?dispatchFlag=0").then(function (carDetailsData) {
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
                        carDetailsData.result[i].operate_status = "途"
                    }
                    else{
                        carDetailsData.result[i].operate_status = "待"
                    }
                }
                $scope.carDetailsList2 = carDetailsData.result;
                $scope.newCarDetailsList2 = $scope.carDetailsList2;
            }
            else {
                swal(carDetailsData.msg, "", "error");
            }
        });
    };
    // 根据输入的关键字筛选左侧卡片 直达  信息
    $scope.updateLeftCardList = function () {
        $scope.newDispatchCarList = [];
        $scope.newTransferDispatchCarList =[];
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

    // 根据输入的关键字筛选左侧卡片 中转  信息
    $scope.updateTransferLeftCardList= function () {
        $scope.newTransferDispatchCarList =[];
        if($scope.leftTransferKeyWord != ""){
            for(var i = 0;i < $scope.transferdisPatchCarList.length;i++){
                if(($scope.transferdisPatchCarList[i].transfer_city_name).indexOf($scope.leftTransferKeyWord) !== -1 || ($scope.transferdisPatchCarList[i].route_end_name).indexOf($scope.leftTransferKeyWord) !== -1){
                    $scope.newTransferDispatchCarList.push($scope.transferdisPatchCarList[i])
                }
            }
        }
        else{
            $scope.newTransferDispatchCarList = $scope.transferdisPatchCarList;
        }

    };

    // 根据输入的关键字筛选右侧卡片信息
    $scope.updateRightCardList = function () {
        $scope.newCarDetailsList = [];
        if($scope.rightKeyWord != ""){
            for(var i = 0;i < $scope.carDetailsList.length;i++){
                if(($scope.carDetailsList[i].truck_num).indexOf($scope.rightKeyWord) !== -1 || ($scope.carDetailsList[i].city_name).indexOf($scope.rightKeyWord) !== -1 || ($scope.carDetailsList[i].drive_name).indexOf($scope.rightKeyWord) !== -1)
                {
                    $scope.newCarDetailsList.push($scope.carDetailsList[i]);
                }
            }

        }
        else{
            $scope.newCarDetailsList = $scope.carDetailsList;
        }
    };

    //版位数 城市
    function getTruckNumber(){
        _basic.get($host.api_url + "/truckNumberType").then(function (cityData) {
            if (cityData.success === true) {
                $scope.truckNumberList = cityData.result;
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
        _basic.get($host.api_url + "/city").then(function (cityData) {
            if (cityData.success === true) {
                $scope.cityList = cityData.result;
                $('#citySelect').select2({
                    placeholder: '城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true

                });
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
    }
    $scope.changecitySelect = function (citySelect,truckNumber){
        $scope.truckIdCount =0;
        $scope.truckNumberCount =0;
        if(citySelect==null||citySelect==undefined||citySelect==''){
            var obj={
                truckNumber:truckNumber
            }
        }
       else if(truckNumber==null||truckNumber==undefined||truckNumber==''){
            var obj={
                currentCity:citySelect
            }
        }
        else{
            var obj={
                currentCity:citySelect,
                truckNumber:truckNumber
            }
        }
        var  url = $host.api_url + "/truckDispatch?dispatchFlag=1&"+_basic.objToUrl(obj);
        var  urlCount = $host.api_url + "/cityTruckDispatchCount?dispatchFlag=1&"+_basic.objToUrl(obj);
        _basic.get(url).then(function (locateData) {
            if (locateData.success === true) {
                $scope.carDetailsList = locateData.result;
                $scope.updateRightCardList();
            }
            else {
                swal(locateData.msg, "", "error");
            }
        });
        _basic.get(urlCount).then(function (locateData) {
            if (locateData.success === true) {
                $scope.truckIdCount = locateData.result[0].truck_id;
                $scope.truckNumberCount = locateData.result[0].truck_number;
                if(locateData.result[0].truck_number==null){
                    $scope.truckNumberCount=0;
                }
            }
            else {
                swal(locateData.msg, "", "error");
            }
        });
    }
    $scope.changeTruckNumber = function (citySelect,truckNumber){
        $scope.truckIdCount =0;
        $scope.truckNumberCount =0;
        if(citySelect==null||citySelect==undefined||citySelect==''){
            var obj={
                truckNumber:truckNumber
            }
        }
        else if(truckNumber==null||truckNumber==undefined||truckNumber==''){
            var obj={
                currentCity:citySelect
            }
        }
        else{
            var obj={
                currentCity:citySelect,
                truckNumber:truckNumber
            }
        }
        var  url = $host.api_url + "/truckDispatch?dispatchFlag=1&"+_basic.objToUrl(obj);
        var  urlCount = $host.api_url + "/cityTruckDispatchCount?dispatchFlag=1&"+_basic.objToUrl(obj);
        _basic.get(url).then(function (locateData) {
            if (locateData.success === true) {
                $scope.carDetailsList = locateData.result;
                $scope.updateRightCardList();
            }
            else {
                swal(locateData.msg, "", "error");
            }
        });
        _basic.get(urlCount).then(function (locateData) {
            if (locateData.success === true) {
                $scope.truckIdCount = locateData.result[0].truck_id;
                $scope.truckNumberCount = locateData.result[0].truck_number;
                if(locateData.result[0].truck_number==null){
                    $scope.truckNumberCount=0;
                }
            }
            else {
                swal(locateData.msg, "", "error");
            }
        });
    }


    // 点击左侧 直达 的卡片详情显示模态框
    $scope.showCarInfoModel = function (currentModelInfo) {
        $scope.currentModelInfo = currentModelInfo;
        // 根据当前卡片信息查询距离
        _basic.get($host.api_url + "/cityRoute?routeStartId=" + currentModelInfo.route_start_id + "&routeEndId=" + currentModelInfo.route_end_id).then(function (distanceData) {
            if (distanceData.success === true) {
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
                $scope.transportationCountList=0;
                $scope.transportationList = data.result;
                for(var i = 0;i < $scope.transportationList.length;i++){
                    $scope.transportationCountList+= $scope.transportationList[i].plan_count;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        $('#carInfoModel').modal('open');
    };


    // 点击左侧 直达 的卡片详情显示模态框中的模态框
    $scope.showCarDetailModel = function (transport) {
        // 根据卡片信息查询起始目的地信息
        _basic.get($host.api_url + "/carList?" + _basic.objToUrl({
            orderStart:transport.date_id,
            orderEnd :transport.date_id,
            routeStartId: transport.route_start_id,
            addrId:transport.base_addr_id,
            receiveId:transport.receive_id,
            routeEndId: transport.route_end_id
        })).then(function (data) {
            if (data.success === true) {
                $scope.vinList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        $(".modal").modal();
        $('#carDetailModel').modal('open');
    };



    // 点击左侧 中转 的卡片详情显示模态框中的模态框
    $scope.showCarTDetailModel = function (transport) {
        // 根据卡片信息查询起始目的地信息
        _basic.get($host.api_url + "/carList?" + _basic.objToUrl({
            orderStart:transport.date_id,
            orderEnd :transport.date_id,
            routeStartId: transport.route_start_id,
            addrId:transport.base_addr_id,
            receiveId:transport.receive_id,
            routeEndId: transport.route_end_id
        })).then(function (data) {
            if (data.success === true) {
                $scope.vinTList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        $(".modal").modal();
        $('#carTDetailModel').modal('open');
    };



    // 点击左侧 中转 的卡片详情显示模态框
    $scope.showCarTransferInfoModel = function (currentModelInfo) {
        // 转换日期格式
        $scope.currentTransferModelInfo = currentModelInfo;
        $scope.arriveStu();
        $scope.arrivedStu();
        // 根据当前卡片信息查询距离
        _basic.get($host.api_url + "/cityRoute?routeStartId=" + currentModelInfo.transfer_city_id + "&routeEndId=" + currentModelInfo.route_end_id).then(function (distanceData) {
            if (distanceData.success === true) {
                if (distanceData.result.length === 0) {
                    $scope.currentTransferDistance = "notSet"
                }
                else {
                    $scope.currentTransferDistance = distanceData.result[0].distance
                }
            }
            else {
                swal(distanceData.msg, "", "error");
            }
        });
        $('#showCarTransferInfoModel').modal('open');
    };

    // 根据卡片信息查询起始目的地信息 (即将到达)
    $scope.arrivedStu=function(){
        $scope.currentTransferModelInfo.date_id= moment($scope.currentTransferModelInfo.date_id.toString()).format("YYYY-MM-DD");
        var dateTime=moment($scope.currentTransferModelInfo.date_id).format("YYYYMMDD");
        _basic.get($host.api_url + "/dpRouteLoadTask?" + _basic.objToUrl({
            dateId: dateTime,
            transferCityId: $scope.currentTransferModelInfo.transfer_city_id,
            routeStartId:$scope.currentTransferModelInfo.route_start_id,
            routeEndId: $scope.currentTransferModelInfo.route_end_id,
            loadTaskStatus:3
        })).then(function (data) {
            if (data.success === true) {
                $scope.transportationTransportListStatus3 = data.result;
                $scope.haveArrivedCarCount=0;
                for(var i = 0;i < $scope.transportationTransportListStatus3.length;i++){
                    $scope.haveArrivedCarCount+= $scope.transportationTransportListStatus3[i].real_count;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .arrivedStu').addClass("active");
        $("#arrivedStu").addClass("active");
        $("#arrivedStu").show();
    };


    // 根据卡片信息查询起始目的地信息 (已经到达)
    $scope.arriveStu=function(){
        $scope.currentTransferModelInfo.date_id= moment($scope.currentTransferModelInfo.date_id.toString()).format("YYYY-MM-DD");
        var dateTime=moment($scope.currentTransferModelInfo.date_id).format("YYYYMMDD");
        _basic.get($host.api_url + "/dpTransferDemand?arriveCount=0&" + _basic.objToUrl({
            dateId:dateTime,
            transferCityId: $scope.currentTransferModelInfo.transfer_city_id,
            routeStartId:$scope.currentTransferModelInfo.route_start_id,
            routeEndId: $scope.currentTransferModelInfo.route_end_id,
            transferStatus:1
        })).then(function (data) {
            if (data.success === true) {
                $scope.arrivedCarCount=0;
                $scope.arriveTransportPlanCount=0;
                $scope.transportationTransportListStatus7 = data.result;
                for(var i = 0;i < $scope.transportationTransportListStatus7.length;i++){
                    $scope.arrivedCarCount+= $scope.transportationTransportListStatus7[i].arrive_count;
                    $scope.arriveTransportPlanCount+= $scope.transportationTransportListStatus7[i].plan_count;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .arriveStu').addClass("active");
        $("#arriveStu").addClass("active");
        $("#arriveStu").show();
    };


    // 点击右侧卡片显示调度指令信息,并获取往期任务及当前任务
    $scope.showDispatchInfo = function (dispatchInfo) {
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
            }
            else {
                swal(currentLineData.msg, "", "error");
            }
        });

        //临时路线
        _basic.get($host.api_url + "/dpRouteTaskTmp?truckId=" + dispatchInfo.truck_id ).then(function (currentLineData) {
            if (currentLineData.success === true) {
                currentLineData.result.reverse();
                $scope.temporaryLineList = currentLineData.result;
            }
            else {
                swal(currentLineData.msg, "", "error");
            }
        });


        // 当前司机未执行调度任务
        _basic.get($host.api_url + "/dpRouteTask?driveId=" + dispatchInfo.drive_id + "&taskStatus=1").then(function (data) {
            if (data.success === true) {
                $scope.dispatchMissionList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        $scope.showMiddleCard = true;
    };

    // 显示修改车辆位置模态框
    $scope.showModifyCarPositionMod = function (transportDetails) {
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

    // 生成当前线路按钮,点击显示路线信息并获取城市信息
    $scope.showCreateLine = function (cityId) {
        var startCityId;
        $scope.lineEndCityInfo = "";
        $scope.lineStartDate = "";
        // 线路的起始城市根据当前线路的最后一条的结束城市为准
        if($scope.currentLineList&&$scope.currentLineList.length === 0){
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
                $('#chooseEndCity1').select2({
                    placeholder: '选择城市',
                    containerCssClass: 'select2_dropdown'
                });
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
        $scope.lineInfo = true;
    };

    //打开生成临时路线模态框
    $scope.showCreateTemporaryLine = function(){
        $("#temporaryLineMod").modal("open");
        getBaseAddr();
    }

    //模态框 改变起始城市  目的城市也跟着改变
    $scope.changeMod =function (start){
        if(start==null){
            $scope.addCityList =[];
            $scope.endCityInfoMod="";
            $scope.addCityList =[];
        }
        else{
            _basic.get($host.api_url + "/cityRouteDispatch?routeStartId="+start.id).then(function(data){
                if (data.success === true) {
                    $scope.addCityList = data.result;
                    $('#chooseEndCityMod').select2({
                        placeholder: '目的城市',
                        containerCssClass : 'select2_dropdown',
                        allowClear: true

                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
    }

    // 新增路线 保存  按钮
    $scope.keepLineInfo =function (){
        if ($scope.startCityInfoMod !== null && $scope.lineStartDate != ""&&$scope.endCityInfoMod!==null) {
            _basic.post($host.api_url + "/user/" + userId + "/dpRouteTaskTmp", {
                truckId: $scope.dispatchInfo.truck_id,
                routeId:$scope.endCityInfoMod.route_id,
                truckNumber:$scope.dispatchInfo.truck_number,
                driveId: $scope.dispatchInfo.drive_id,
                routeStartId: $scope.startCityInfoMod.id,
                routeStart:$scope.startCityInfoMod.city_name,
                routeEndId: $scope.endCityInfoMod.end_id,
                routeEnd:$scope.endCityInfoMod.city_name,
                distance: $scope.endCityInfoMod.distance,
                taskPlanDate: $scope.lineStartDate
            }).then(function (data) {
                if (data.success === true) {
                    $scope.lineInfo = false;
                    $scope.showDispatchInfo($scope.dispatchInfo);
                    $("#temporaryLineMod").modal("close");
                    swal("新增路线成功", "", "success");
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else {
            swal("请填写完整信息", "", "error");
        }
    }

    // 新增路线 发布 按钮
    $scope.confirmChange = function () {
        if ($scope.lineEndCityInfo != "" && $scope.lineStartDate != "") {
            var routeStartId = $scope.currentLineList.length === 0 ? $scope.dispatchInfo.current_city :  $scope.currentLineList[$scope.currentLineList.length - 1].route_end_id;
            var routeStart = $scope.currentLineList.length === 0 ? $scope.dispatchInfo.city_name :  $scope.currentLineList[$scope.currentLineList.length - 1].city_route_end;

            _basic.post($host.api_url + "/user/" + userId + "/dpRouteTask", {
                truckId: $scope.dispatchInfo.truck_id,
                routeId:$scope.lineEndCityInfo.route_id,
                truckNumber:$scope.dispatchInfo.truck_number,
                driveId: $scope.dispatchInfo.drive_id,
                routeStartId: routeStartId,
                routeStart:routeStart,
                routeEndId: $scope.lineEndCityInfo.end_id,
                routeEnd:$scope.lineEndCityInfo.city_name,
                distance: $scope.lineEndCityInfo.distance,
                cityRouteId: $scope.lineEndCityInfo.id,
                taskPlanDate: $scope.lineStartDate
            }).then(function (data) {
                if (data.success === true) {
                    $scope.lineInfo = false;
                    $scope.showDispatchInfo($scope.dispatchInfo);
                    swal("新增路线成功", "", "success");
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
        $("#temporaryLineMod").modal("close");

    };

    // 删除临时路线
    $scope.deletetemporaryLine = function (deleteLineId,event) {
        event.stopPropagation();
        swal({
                title: "确定删除当前临时路线吗？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },
            function(){
                _basic.delete($host.api_url + "/user/" + userId + "/dpRouteTaskTmp/" + deleteLineId).then(function (data) {
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

    // 删除当前路线
    $scope.deleteLine = function (deleteLineId,event) {
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

    // 点击线路获取当前路线下的装车任务信息
    $scope.showMissionInfo = function (showLineId,showLineDate,startLineId,index) {
        $scope.locateId = "";
        $scope.sendCityId = "";
        $scope.receiveInfo = "";
        $scope.distributeNum = "";
        $scope.lineStartTime = "";
        $scope.ransferLocateId = "";
        $scope.originalRoute = "";
        $scope.distributeNum2 = "";
        $scope.lineStartTime2 = "";
        $scope.whetherTransfer2 = "";
        $scope.transferCityId2 = "";
        $scope.hasTransferType2 = "";
        $scope.showLineId = showLineId;
        $scope.showLineDate = showLineDate;
        $scope.startLineId = startLineId;
        $scope.clickIndex = index;
        // 默认显示当前装车任务
        $(".load_mission" + index).show();
        $(".route_fee_info").hide();
        $scope.lineDate = moment(showLineDate).format("YYYY-MM-DD");// model双向的scope，用作任务时间默认显示和取值
        $scope.lineDate2 = moment(showLineDate).format("YYYY-MM-DD");// model双向的scope，用作任务时间默认显示和取值
        $scope.lineDateBak = moment(showLineDate).format("YYYY-MM-DD");// 不可改变的scope，用作刷新任务方法的参数使用
        $scope.missionInfo = false;
        $scope.addMissionBtn = true;
        getBaseAddr();

        //获取出发城市
        _basic.get($host.api_url + "/dpRouteTask?dpRouteTaskId=" + showLineId).then(function (data) {
            if (data.success == true) {
                $scope.dispatchInfoList = data.result[0];

            } else {
                swal(data.msg, "", "error");
            }
        });

        // 装车任务信息
        _basic.get($host.api_url + "/dpRouteLoadTask?dpRouteTaskId=" + showLineId + "&loadTaskStatusArr=1,3,7").then(function (missionData) {
            if (missionData.success === true) {
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

    };

    // 点击线路获取当前路线下的装车任务信息
    $scope.showMissionInfo2 = function (showLineId,showLineDate,startLineId,index) {
        $scope.locateId = "";
        $scope.sendCityId = "";
        $scope.receiveInfo = "";
        $scope.distributeNum = "";
        $scope.lineStartTime = "";
        $scope.ransferLocateId = "";
        $scope.originalRoute = "";
        $scope.distributeNum2 = "";
        $scope.lineStartTime2 = "";
        $scope.whetherTransfer2 = "";
        $scope.transferCityId2 = "";
        $scope.hasTransferType2 = "";
        $scope.showLineId = showLineId;
        $scope.showLineDate = showLineDate;
        $scope.startLineId = startLineId;
        $scope.clickIndex = index;
        // 默认显示当前装车任务
        $(".load_mission" + index).show();
        $(".route_fee_info").hide();
        $scope.lineDate = moment(showLineDate).format("YYYY-MM-DD");// model双向的scope，用作任务时间默认显示和取值
        $scope.lineDate2 = moment(showLineDate).format("YYYY-MM-DD");// model双向的scope，用作任务时间默认显示和取值
        $scope.lineDateBak = moment(showLineDate).format("YYYY-MM-DD");// 不可改变的scope，用作刷新任务方法的参数使用
        $scope.missionInfo = false;
        $scope.addMissionBtn = true;
        getBaseAddr();

     /*   //获取出发城市
        _basic.get($host.api_url + "/dpRouteTask?dpRouteTaskId=" + showLineId).then(function (data) {
            if (data.success == true) {
                $scope.dispatchInfoList = data.result[0];

            } else {
                swal(data.msg, "", "error");
            }
        });
*/
        // 装车任务信息
        _basic.get($host.api_url + "/dpRouteLoadTaskTmp?dpRouteTaskTmpId=" + showLineId ).then(function (missionData) {
            if (missionData.success === true) {
              /*  if(missionData.result.length !== 0){
                    $scope.taskId = missionData.result[0].dp_route_task_id;
                    $scope.opName = missionData.result[0].task_op_name;
                }
                else{
                    $scope.taskId = "暂无";
                    $scope.opName = "暂无";
                }*/
                $scope.missionList2 = missionData.result;
            }
            else {
                swal(missionData.msg, "", "error");
            }
        });

    };

    //发布临时路线
    $scope.releaseTmporaryLine =function(temporaryLine,event){
        event.stopPropagation();
        var obj={
            dpRouteTaskTmpId:temporaryLine.id,
            truckId:$scope.dispatchInfo.truck_id,
            truckNumber:$scope.dispatchInfo.truck_number,
            driveId: $scope.dispatchInfo.drive_id,
            routeId:temporaryLine.route_id,
            routeStartId:temporaryLine.route_start_id,
            routeStart:temporaryLine.route_start,
            routeEndId:temporaryLine.route_end_id,
            routeEnd:temporaryLine.route_end,
            distance:temporaryLine.distance,
            taskPlanDate: moment(temporaryLine.task_plan_date.toString()).format("YYYY-MM-DD"),
            currentCity:$scope.dispatchInfo.current_city
        };
        _basic.post($host.api_url + "/user/" + userId + "/dpRouteTaskBatch" ,obj).then(function (data) {
            if(data.success === true){
                swal("新增装车任务成功", "", "success");
                $scope.missionInfo = true;
                $scope.addMissionBtn =false ;
                $scope.showDispatchInfo($scope.dispatchInfo)
            }
            else{
                swal(data.msg, "", "error");
            }
        })
    }


    // 获取装车地点信息
    function getBaseAddr(){
        _basic.get($host.api_url + "/baseAddr?cityId=" + $scope.startLineId).then(function (locateData) {
            if (locateData.success === true) {
                $scope.locateList = locateData.result;
            }
            else {
                swal(locateData.msg, "", "error");
            }
        });
        _basic.get($host.api_url + "/city").then(function (cityData) {
            if (cityData.success === true) {
                $scope.sendCityList = cityData.result;
                $('.destination_city').select2({
                    placeholder: '目的地城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true

                });
                $('.transfer_city').select2({
                    placeholder: '中转站城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('.transfer_city2').select2({
                    placeholder: '中转站城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#chooseStartCityMod').select2({
                    placeholder: '起始城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true

                });
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
    }


    //获取中转站
    $scope.getTransferCity = function (cityId){
        _basic.get($host.api_url + "/baseAddr?cityId=" + cityId).then(function (locateData) {
            if (locateData.success === true) {
                $scope.transferCityList = locateData.result;
            }
            else {
                swal(locateData.msg, "", "error");
            }
        });
    }

    //选择中转站之后点击中转装车地点查询 原始装车地和经销商
    $scope.changeTransferLocate = function (transferAddrId){
        if(transferAddrId==null){
            transferCityLocateList=[];
        }
        else{
            _basic.get($host.api_url + "/dpTransferDemand?transferStatus=1&transferAddrId=" + transferAddrId.id).then(function (data) {
                if (data.success === true) {
                    $scope.transferCityLocateList = data.result;
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }

    }

    //改变是始发站出发还是中转站出发
    $scope.changeWhereStart = function (selectWhereStart) {
        $scope.selectWhereStart=selectWhereStart;
    };

    //抵达的是否是中转站
    $scope.checkWhetherTransfer = function (whetherTransfer){
        if (whetherTransfer == 1) {
            $scope.hasTransferType = false;
        }
        else {
            $scope.hasTransferType = true;
        }
    }

    // 选择装车地点时重置目的地城市和经销商
    $scope.cancelDestinationCity = function () {
        $scope.addrList = [];
    };

    // 根据选择的城市获取送达经销商和指令时间及派发数量信息
    $scope.getReceiveDistributor = function (lineId,sendCityId,locateId) {
        if(locateId!==null&&sendCityId!==undefined){
            if(lineId != ""){
                _basic.get($host.api_url + "/dpDemandBase?" + _basic.objToUrl({
                    routeStartId:$scope.startLineId,
                    baseAddrId:locateId.id,
                    routeEndId:sendCityId,
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
        }
        else {
            return;
        }
    };

    // 根据经销商查看模态框详情(始发)
    $scope.showCarModel= function(sendCityId,locateId){
        if($scope.receiveInfo !== null&&$scope.receiveInfo !==''){
            // 根据卡片信息查询起始目的地信息
            _basic.get($host.api_url + "/carList?" + _basic.objToUrl({
                orderStart:$scope.receiveInfo.date_id,
                orderEnd :$scope.receiveInfo.date_id,
                routeStartId: $scope.startLineId,
                addrId:locateId.id,
                receiveId:$scope.receiveInfo.receive_id,
                routeEndId: sendCityId
            })).then(function (data) {
                if (data.success === true) {
                    $scope.vinTList = data.result;
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
            $(".modal").modal();
            $('#carTDetailModel').modal('open');
        }
        else{
            swal("请先选择经销商", "", "error");
        }
    }

    // 根据经销商查看模态框详情(中转)
    $scope.showCarModelT= function(){
        if($scope.originalRoute !== null&&$scope.originalRoute !==''){
            // 根据卡片信息查询起始目的地信息
            _basic.get($host.api_url + "/carList?" + _basic.objToUrl({
                orderStart:$scope.originalRoute.date_id,
                orderEnd :$scope.originalRoute.date_id,
                routeStartId: $scope.originalRoute.route_start_id,
                addrId:$scope.originalRoute.base_addr_id,
                receiveId:$scope.originalRoute.receive_id,
                routeEndId: $scope.originalRoute.route_end_id
            })).then(function (data) {
                if (data.success === true) {
                    $scope.vinTList = data.result;
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
            $(".modal").modal();
            $('#carTDetailModel').modal('open');
        }
        else{
            swal("请先选择原始路线", "", "error");
        }
    }


    // 提交线路下的 （始发站出发） 任务信息
    $scope.submitMissionInfo = function (lineId,sendCityId,locateId,whetherTransfer,transferCityId,transferName,index) {
        if(locateId != {} && sendCityId != "" && $scope.receiveInfo != "" && $scope.distributeNum != "" && $scope.lineDate != "" && $scope.lineStartTime != ""){

            // 如果不中转就去掉后两个属性
            if (whetherTransfer==0) {
               var  obj={
                     loadTaskType:$scope.selectWhereStart,
                     dpDemandId:$scope.receiveInfo.id,
                     transferDemandId:0,
                     routeStartId:$scope.dispatchInfoList.route_start_id,
                     routeStart:$scope.dispatchInfoList.route_start,
                     baseAddrId:locateId.id,
                     addrName:locateId.addr_name,
                     routeEndId:sendCityId.id,
                     routeEnd:sendCityId.city_name,
                     receiveId:$scope.receiveInfo.receive_id,
                     shortName:$scope.receiveInfo.short_name,
                     dateId:$scope.receiveInfo.date_id,
                     planDate:$scope.lineDate + " " + $scope.lineStartTime,
                     planCount:$scope.distributeNum,
                     transferFlag:0,
                     transferCityId:0,
                     transferCity:'',
                     transferAddrId:0,
                     transferAddrName:''
                 }
            }
            else{
                var obj={
                    loadTaskType:$scope.selectWhereStart,
                    dpDemandId:$scope.receiveInfo.id,
                    transferDemandId:0,
                    routeStartId:$scope.dispatchInfoList.route_start_id,
                    routeStart:$scope.dispatchInfoList.route_start,
                    baseAddrId:locateId.id,
                    addrName:locateId.addr_name,
                    routeEndId:sendCityId.id,
                    routeEnd:sendCityId.city_name,
                    receiveId:$scope.receiveInfo.receive_id,
                    shortName:$scope.receiveInfo.short_name,
                    dateId:$scope.receiveInfo.date_id,
                    planDate:$scope.lineDate + " " + $scope.lineStartTime,
                    planCount:$scope.distributeNum,
                    transferFlag:whetherTransfer,
                    transferCityId:transferCityId.id,
                    transferCity:transferCityId.city_name,
                    transferAddrId:transferName.id,
                    transferAddrName:transferName.addr_name
                };
            }
            _basic.post($host.api_url + "/user/" + userId + "/dpRouteTask/" + lineId + "/dpRouteLoadTask",obj).then(function (data) {
                if(data.success === true){
                    swal("新增装车任务成功", "", "success");
                    $scope.missionInfo = true;
                    $scope.addMissionBtn =false ;
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

    // 提交线路下的 （中转站出发） 任务信息
    $scope.postMissionInfo = function (lineId,cityRouteEnd,locateId,whetherTransfer2,transferCityId2,transferName2,originalRoute,index) {
        if(locateId.id != undefined && locateId.addr_name!==undefined&&  originalRoute != ""  && $scope.distributeNum2 != "" && $scope.lineDate2 != "" && $scope.lineStartTime2 != ""){

            // 如果不中转就去掉后两个属性
            if (whetherTransfer2==0) {
              var  obj={
                    loadTaskType:$scope.selectWhereStart,
                    dpDemandId:$scope.originalRoute.demand_id,
                    transferDemandId:originalRoute.id,
                    routeStartId:$scope.originalRoute.transfer_city_id,
                    routeStart:$scope.originalRoute.transfer_city_name,
                    baseAddrId:locateId.id,
                    addrName:locateId.addr_name,
                    routeEndId:$scope.originalRoute.route_end_id,
                    routeEnd:originalRoute.route_end_name,
                    receiveId:$scope.originalRoute.receive_id,
                    shortName:$scope.originalRoute.short_name,
                    dateId:$scope.originalRoute.date_id,
                    planDate:$scope.lineDate2 + " " + $scope.lineStartTime2,
                    planCount:$scope.distributeNum2,
                    transferFlag:0,
                    transferCityId:0,
                    transferCity:"",
                    transferAddrId:0,
                    transferAddrName:''
                }
            }
            else{
                var obj={
                    loadTaskType:$scope.selectWhereStart,
                    dpDemandId:$scope.originalRoute.demand_id,
                    transferDemandId:originalRoute.id,
                    routeStartId:$scope.originalRoute.transfer_city_id,
                    routeStart:$scope.originalRoute.transfer_city_name,
                    baseAddrId:locateId.id,
                    addrName:locateId.addr_name,
                    routeEndId:$scope.originalRoute.route_end_id,
                    routeEnd:originalRoute.route_end_name,
                    receiveId:$scope.originalRoute.receive_id,
                    shortName:$scope.originalRoute.short_name,
                    dateId:$scope.originalRoute.date_id,
                    planDate:$scope.lineDate2 + " " + $scope.lineStartTime2,
                    planCount:$scope.distributeNum2,
                    transferFlag:whetherTransfer2,
                    transferCityId:transferCityId2.id,
                    transferCity:transferCityId2.city_name,
                    transferAddrId:transferName2.id,
                    transferAddrName:transferName2.addr_name
                };
            }
            _basic.post($host.api_url + "/user/" + userId + "/dpRouteTask/" + lineId + "/dpRouteLoadTask",obj).then(function (data) {
                if(data.success === true){
                    swal("新增装车任务成功", "", "success");
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


    // 提交线路下的 （始发站出发） 任务信息
    $scope.submitMissionInfo2 = function (lineId,sendCityId,locateId,whetherTransfer,transferCityId,transferName,index) {
        if(locateId != {} && sendCityId != "" && $scope.receiveInfo != "" && $scope.distributeNum != "" && $scope.lineDate != "" && $scope.lineStartTime != ""){

            // 如果不中转就去掉后两个属性
            if (whetherTransfer==0) {
                var  obj={
                    loadTaskType:$scope.selectWhereStart,
                    dpDemandId:$scope.receiveInfo.id,
                    transferDemandId:0,
                    routeStartId:$scope.receiveInfo.route_start_id,
                    routeStart:$scope.receiveInfo.route_start,
                    baseAddrId:locateId.id,
                    addrName:locateId.addr_name,
                    routeEndId:sendCityId.id,
                    routeEnd:sendCityId.city_name,
                    receiveId:$scope.receiveInfo.receive_id,
                    shortName:$scope.receiveInfo.short_name,
                    dateId:$scope.receiveInfo.date_id,
                    planDate:$scope.lineDate + " " + $scope.lineStartTime,
                    planCount:$scope.distributeNum,
                    transferFlag:0,
                    transferCityId:0,
                    transferCity:'',
                    transferAddrId:0,
                    transferAddrName:''
                }
            }
            else{
                var obj={
                    loadTaskType:$scope.selectWhereStart,
                    dpDemandId:$scope.receiveInfo.id,
                    transferDemandId:0,
                    routeStartId:$scope.receiveInfo.route_start_id,
                    routeStart:$scope.receiveInfo.route_start,
                    baseAddrId:locateId.id,
                    addrName:locateId.addr_name,
                    routeEndId:sendCityId.id,
                    routeEnd:sendCityId.city_name,
                    receiveId:$scope.receiveInfo.receive_id,
                    shortName:$scope.receiveInfo.short_name,
                    dateId:$scope.receiveInfo.date_id,
                    planDate:$scope.lineDate + " " + $scope.lineStartTime,
                    planCount:$scope.distributeNum,
                    transferFlag:whetherTransfer,
                    transferCityId:transferCityId.id,
                    transferCity:transferCityId.city_name,
                    transferAddrId:transferName.id,
                    transferAddrName:transferName.addr_name
                };
            }
            _basic.post($host.api_url + "/user/" + userId + "/dpRouteTaskTmp/" + lineId + "/dpRouteLoadTaskTmp",obj).then(function (data) {
                if(data.success === true){
                    swal("新增装车任务成功", "", "success");
                    $scope.missionInfo = true;
                    $scope.addMissionBtn =false ;
                    $scope.showMissionInfo2(lineId,$scope.lineDateBak,$scope.startLineId,index);
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

    // 提交线路下的 （中转站出发） 任务信息
    $scope.postMissionInfo2 = function (lineId,cityRouteEnd,locateId,whetherTransfer2,transferCityId2,transferName2,originalRoute,index) {
        if(locateId.id != undefined && locateId.addr_name!==undefined&&  originalRoute != ""  && $scope.distributeNum2 != "" && $scope.lineDate2 != "" && $scope.lineStartTime2 != ""){

            // 如果不中转就去掉后两个属性
            if (whetherTransfer2==0) {
                var  obj={
                    loadTaskType:$scope.selectWhereStart,
                    dpDemandId:$scope.originalRoute.demand_id,
                    transferDemandId:originalRoute.id,
                    routeStartId:$scope.originalRoute.transfer_city_id,
                    routeStart:$scope.originalRoute.transfer_city_name,
                    baseAddrId:locateId.id,
                    addrName:locateId.addr_name,
                    routeEndId:$scope.originalRoute.route_end_id,
                    routeEnd:originalRoute.route_end_name,
                    receiveId:$scope.originalRoute.receive_id,
                    shortName:$scope.originalRoute.short_name,
                    dateId:$scope.originalRoute.date_id,
                    planDate:$scope.lineDate2 + " " + $scope.lineStartTime2,
                    planCount:$scope.distributeNum2,
                    transferFlag:0,
                    transferCityId:0,
                    transferCity:"",
                    transferAddrId:0,
                    transferAddrName:''
                }
            }
            else{
                var obj={
                    loadTaskType:$scope.selectWhereStart,
                    dpDemandId:$scope.originalRoute.demand_id,
                    transferDemandId:originalRoute.id,
                    routeStartId:$scope.originalRoute.transfer_city_id,
                    routeStart:$scope.originalRoute.transfer_city_name,
                    baseAddrId:locateId.id,
                    addrName:locateId.addr_name,
                    routeEndId:$scope.originalRoute.route_end_id,
                    routeEnd:originalRoute.route_end_name,
                    receiveId:$scope.originalRoute.receive_id,
                    shortName:$scope.originalRoute.short_name,
                    dateId:$scope.originalRoute.date_id,
                    planDate:$scope.lineDate2 + " " + $scope.lineStartTime2,
                    planCount:$scope.distributeNum2,
                    transferFlag:whetherTransfer2,
                    transferCityId:transferCityId2.id,
                    transferCity:transferCityId2.city_name,
                    transferAddrId:transferName2.id,
                    transferAddrName:transferName2.addr_name
                };
            }
            _basic.post($host.api_url + "/user/" + userId + "/dpRouteTaskTmp/" + lineId + "/dpRouteLoadTaskTmp",obj).then(function (data) {
                if(data.success === true){
                    swal("新增装车任务成功", "", "success");
                    $scope.missionInfo = false;
                    $scope.addMissionBtn = true;
                    $scope.showMissionInfo2(lineId,$scope.lineDateBak,$scope.startLineId,index);
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
    $scope.deleteMission2 = function (missionId, lineId) {
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
                _basic.delete($host.api_url + "/user/" + userId + "/dpRouteLoadTaskTmp/" + missionId).then(function (data) {
                    if (data.success === true) {
                        $scope.showMissionInfo2(lineId,$scope.showLineDate,$scope.startLineId,$scope.clickIndex);
                        swal("删除成功", "", "success");
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            });
    };























    // 获取数据
    function queryData() {
        truckDispatchCount();
        $scope.getDeliveryCarInfo();
        $scope.getCarDetails();
        $scope.getCarDetails2();
        getTruckNumber();
    };
    queryData();
}]);