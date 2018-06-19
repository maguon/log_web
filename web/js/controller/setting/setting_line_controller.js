/**
 * Modify by zcy on 2017/12/26.
 */
app.controller("setting_line_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.hasChosen = false;
    $scope.selectedCityId = 0;
    $scope.startCityList = [];
    $scope.endCityList = [];


    // 获取所有起始城市和结束城市
    $scope.getCityList = function () {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success === true) {
                // console.log("data",data);
                $scope.startCityList = data.result;
                for (var i = 0; i < data.result.length; i++) {
                    var endItem = {
                        id: data.result[i].id,
                        city_name: data.result[i].city_name,
                        dis: "",
                        routeId:0,
                        flag: false
                    };
                    $scope.endCityList.push(endItem);
                }
                // console.log("endCityList",$scope.endCityList);
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 根据选择的城市获取线路，并设置线路公里数
    $scope.searchCityLine = function (currentCityInfo,index) {
        $scope.startCityIndex = index;
        $scope.startCity = currentCityInfo.city_name;
        $scope.selectedCityId = currentCityInfo.id;
        _basic.get($host.api_url + "/cityRoute?routeStartId=" + currentCityInfo.id).then(function (data) {
            if (data.success === true) {
                // console.log("lineData", data);
                $scope.hasChosen = true;
                for (var i = 0; i < $scope.endCityList.length; i++) {
                    for (var j = 0; j < data.result.length; j++) {
                        if ($scope.endCityList[i].id == $scope.selectedCityId && data.result[j].route_start_id == data.result[j].route_end_id && $scope.selectedCityId == data.result[j].route_start_id) {
                            $scope.endCityList[i].dis = data.result[j].distance;
                            $scope.endCityList[i].protect_fee = data.result[j].protect_fee;
                            $scope.endCityList[i].routeId = data.result[j].id;
                            $scope.endCityList[i].flag = true;
                            break;
                        }
                        else if (($scope.endCityList[i].id == data.result[j].route_start_id || $scope.endCityList[i].id == data.result[j].route_end_id) && ($scope.selectedCityId != $scope.endCityList[i].id)) {
                            $scope.endCityList[i].dis = data.result[j].distance;
                            $scope.endCityList[i].protect_fee = data.result[j].protect_fee;
                            $scope.endCityList[i].routeId = data.result[j].id;
                            $scope.endCityList[i].flag = true;
                            break;
                        }
                        else {
                            $scope.endCityList[i].dis = "";
                            $scope.endCityList[i].protect_fee = '';
                            $scope.endCityList[i].routeId = 0;
                            $scope.endCityList[i].flag = false;
                        }
                    }
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击打开模态框
    $scope.modifyLineInfo = function (lineInfo) {
         //console.log("currentLineInfo", lineInfo);
        $scope.endCity = lineInfo.city_name;
        $scope.distance = lineInfo.dis;
        $scope.applyProtectCost = lineInfo.protect_fee;
        $scope.modifyFlag = lineInfo.flag;
        $scope.routeId = lineInfo.routeId;
        $scope.endCityId = lineInfo.id;
        if($scope.hasChosen){
            $('#modifyModel').modal('open');
        }
        else{
            swal("请先选择起始城市！", "", "warning");
        }
    };

    // 修改或设置里程数
    $scope.distanceModify = function () {
        // flag为true时执行修改操作，否则执行新增操作
        if($scope.modifyFlag){
            if($scope.distance !== null){
                _basic.put($host.api_url + "/user/" + userId + "/cityRoute/" + $scope.routeId,{
                    distance:parseFloat($scope.distance),
                    protectFee: parseFloat($scope.applyProtectCost)
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
                _basic.post($host.api_url + "/user/" + userId + "/cityRoute",{
                    routeStartId: $scope.selectedCityId,
                    routeStart: $scope.startCity,
                    routeEndId: $scope.endCityId,
                    routeEnd: $scope.endCity,
                    distance: $scope.distance,
                    protectFee:$scope.applyProtectCost
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

    $scope.queryData = function () {
        $scope.getCityList();
    };
    $scope.queryData();
}]);