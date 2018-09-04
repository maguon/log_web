app.controller("entrust_setting_detail_controller", ["$scope",'$state', "_basic","$stateParams", "_config", "$host", function ($scope,$state, _basic,$stateParams, _config, $host) {
    var entrustId = $stateParams.id;
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.hasChosen = false;
    $scope.selectedCityId = 0;
    $scope.startCityList = [];
    $scope.endCityList = [];

    // 委托方
    function getEntrust(){
        _basic.get($host.api_url + "/entrustRoute").then(function (data) {
            if (data.success == true) {
                $scope.entrustList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        })
        _basic.get($host.api_url + "/entrustRoute?entrustId="+entrustId).then(function (data) {
            if (data.success == true) {
                $scope.entrustItem = data.result[0];
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    };

    // 获取所有起始城市和结束城市
   function getCityList() {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success === true) {
                $scope.startCityList = data.result;
                for (var i = 0; i < data.result.length; i++) {
                    $scope.startCityList[i].flag=true;
                    var endItem = {
                        id: data.result[i].id,
                        city_name: data.result[i].city_name,
                        dis: "",
                        fee:'',
                        routeId:0,
                        flag: 1
                    };
                    $scope.endCityList.push(endItem);
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 根据选择的城市获取线路，并设置线路公里数
    $scope.searchCityLine = function (currentCityInfo,index) {
        $scope.startCityIndex = index;
        for (var i = 0; i <$scope.startCityList.length; i++) {
            $scope.startCityList[i].flag = true;
        }
        $scope.startCityList[index].flag=false;
        $scope.startCity = currentCityInfo.city_name;
        $scope.selectedCityId = currentCityInfo.id;
        _basic.get($host.api_url + "/cityRoute?routeStartId=" + currentCityInfo.id).then(function (data) {
            if (data.success === true) {
                $scope.hasChosen = true;
                for (var i = 0; i < $scope.endCityList.length; i++) {
                    for (var j = 0; j < data.result.length; j++) {
                        if ($scope.endCityList[i].id == $scope.selectedCityId && data.result[j].route_start_id == data.result[j].route_end_id && $scope.selectedCityId == data.result[j].route_start_id) {
                            $scope.endCityList[i].dis = "";
                            $scope.endCityList[i].fee = '';
                            $scope.endCityList[i].routeId = 0;
                            $scope.endCityList[i].flag = 2;
                            break;
                        }
                        else if (($scope.endCityList[i].id == data.result[j].route_start_id || $scope.endCityList[i].id == data.result[j].route_end_id) && ($scope.selectedCityId != $scope.endCityList[i].id)) {
                            $scope.endCityList[i].dis = "";
                            $scope.endCityList[i].fee = '';
                            $scope.endCityList[i].routeId = 0;
                            $scope.endCityList[i].flag = 2;
                            break;
                        }
                        else {
                            $scope.endCityList[i].dis = "";
                            $scope.endCityList[i].fee = '';
                            $scope.endCityList[i].routeId = 0;
                            $scope.endCityList[i].flag = 1;
                        }
                    }
                }

                getEntrustCityRouteRel();
            }
            else {
                swal(data.msg, "", "error");
            }
        });

    };

    function getEntrustCityRouteRel(){
        _basic.get($host.api_url + "/entrustCityRouteRel?routeStartId=" +  $scope.selectedCityId+"&entrustId="+$scope.entrustItem.id).then(function (data) {
            if (data.success === true) {
                for (var i = 0; i < $scope.endCityList.length; i++) {
                    for (var j = 0; j < data.result.length; j++) {
                        if ($scope.endCityList[i].id == $scope.selectedCityId && data.result[j].route_start_id == data.result[j].route_end_id && $scope.selectedCityId == data.result[j].route_start_id) {
                            $scope.endCityList[i].dis = data.result[j].distance;
                            $scope.endCityList[i].fee = data.result[j].fee;
                            $scope.endCityList[i].routeId = data.result[j].id;
                            $scope.endCityList[i].flag = 0;
                            break;
                        }
                        else if (($scope.endCityList[i].id == data.result[j].route_start_id || $scope.endCityList[i].id == data.result[j].route_end_id) && ($scope.selectedCityId != $scope.endCityList[i].id)) {
                            $scope.endCityList[i].dis = data.result[j].distance;
                            $scope.endCityList[i].fee = data.result[j].fee;
                            $scope.endCityList[i].routeId = data.result[j].id;
                            $scope.endCityList[i].flag = 0;
                            break;
                        }
                        else {
                            $scope.endCityList[i].dis = "";
                            $scope.endCityList[i].fee = '';
                            $scope.endCityList[i].routeId = 0;
                        }
                    }
                }
            }

        })
    }

    $scope.changeClient = function (entrustId){
        $state.go('entrust_setting_detail', {
            reload: true,
            id:entrustId,
            from: 'entrust_setting'
        });
    }

    // 点击打开模态框
    $scope.modifyLineInfo = function (lineInfo,flag,ev) {
        if(flag==1){
            ev.stopPropagation();
        }else{
            $scope.routerSetting();
            $scope.endCity = lineInfo.city_name;
            $scope.distance = lineInfo.dis;
            $scope.price = lineInfo.fee;
            $scope.modifyFlag = lineInfo.flag;
            $scope.routeId = lineInfo.routeId;
            $scope.endCityId = lineInfo.id;
            _basic.get($host.api_url + "/cityRoute?routeStartId=" +$scope.selectedCityId+'&routeEndId='+$scope.endCityId).then(function (data) {
                if (data.success === true&&data.result.length>0) {
                    $scope.cityRouteId=data.result[0].id;
                }
            })
            if($scope.modifyFlag!==1){
                if($scope.hasChosen){
                    $('#modifyModel').modal('open');
                }
                else{
                    swal("请先选择起始城市！", "", "warning");
                }
            }
            else{
                $('#modifyModel').modal('close');
            }
        }


    };

    // 修改或设置里程数
    $scope.distanceModify = function () {
        // flag为0时执行修改操作，为2执行新增操作
        if($scope.modifyFlag==0){
            if($scope.distance !== null){
                _basic.put($host.api_url + "/user/" + userId + "/entrustCityRouteRel/" + $scope.routeId,{
                    entrustId: $scope.entrustItem.id,
                    cityRouteId: $scope.routeId,
                    distance:parseFloat($scope.distance),
                    fee: parseFloat($scope.price)
                }).then(function (modifyData) {
                    if (modifyData.success === true) {
                        swal("修改成功", "", "success");
                        $('#modifyModel').modal('close');
                        $scope.searchCityLine($scope.startCityList[$scope.startCityIndex],$scope.startCityIndex)
                    }
                    else {
                        swal(modifyData.msg, "", "error");
                    }
                });
            }
            else{
                swal("里程数不能为空！", "", "error");
            }
        }
        else{
            if($scope.distance !== ""){
                _basic.post($host.api_url + "/user/" + userId + "/entrustCityRouteRel",{
                    entrustId: $scope.entrustItem.id,
                    cityRouteId:$scope.cityRouteId,
                    distance:$scope.distance,
                    fee: $scope.price
                }).then(function (data) {
                    if (data.success === true) {
                        swal("修改成功", "", "success");
                        $('#modifyModel').modal('close');
                        $scope.searchCityLine($scope.startCityList[$scope.startCityIndex],$scope.startCityIndex)
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            }
            else{
                swal("里程数不能为空！", "", "error");
            }
        }
    };

    //获取任務執行记录
    function  getRecordList () {
        _basic.get($host.record_url + "/entrustRecord?cityRouteId=" + $scope.cityRouteId+'&entrustId='+$scope.entrustItem.id).then(function (data) {
            if (data.success == true) {
                if(data.result.length == 0){
                    $scope.recordList =[];
                }
                else{
                    $scope.recordList = data.result[0].comment;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }


    //模态框内的菜单跳转
    $scope.routerSetting = function(){
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .router_setting').addClass("active");
        $("#routerSetting").addClass("active");
        $("#routerSetting").show();
    }
    $scope.settingRecord = function(){
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .setting_record').addClass("active");
        $("#settingRecord").addClass("active");
        $("#settingRecord").show();
        getRecordList ();
    }

    getCityList();
    getEntrust();
}]);