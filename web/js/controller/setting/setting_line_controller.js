/**
 * Created by zcy on 2017/8/14.
 */
app.controller("setting_line_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.startCityId = "";
    $scope.endCityId = "";

    // 获取起始城市列表
    $scope.getCityList = function () {
        _basic.get($host.api_url + "/city").then(function (cityData) {
            if (cityData.success === true) {
                $scope.cityList = cityData.result;
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
    };

    // 根据选择城市查询路线信息
    $scope.searchLineInfo = function () {
        // console.log("$scope.startCityId",$scope.startCityId);
        // console.log("$scope.endCityId",$scope.endCityId);
        _basic.get($host.api_url + "/cityRoute?routeStartId=" + $scope.startCityId + "&routeEndId=" + $scope.endCityId).then(function (lineData) {
            if (lineData.success === true) {
                $scope.lineList = lineData.result;
            }
            else {
                swal(lineData.msg, "", "error");
            }
        });
    };

    // 开启新增线路模态框并初始化输入
    $scope.showCreateModel = function () {
        $('#createModel').modal('open');
        $scope.createStartCityInfo = "";
        $scope.createEndCityId = undefined;
        $scope.createDistance = "";
    };

    // 新增路线
    $scope.createNewLine = function () {
        // 因为用ng-option取文本值的时候会影响到disable状态，所以用原生方法获取所选option的文本内容
        var routeEnd = document.getElementById("routeEndCity").options[document.getElementById("routeEndCity").selectedIndex].text;
        if($scope.createStartCityInfo.id != undefined && $scope.createEndCityId != undefined && $scope.createDistance != ""){
            _basic.post($host.api_url + "/user/" + userId + "/cityRoute",{
                routeStartId:$scope.createStartCityInfo.id,
                routeStart:$scope.createStartCityInfo.city_name,
                routeEndId:$scope.createEndCityId,
                routeEnd:routeEnd,
                distance:parseFloat($scope.createDistance)
            }).then(function (data) {
                if(data.success === true){
                    swal("新增成功", "", "success");
                    $('#createModel').modal('close');
                    $scope.searchLineInfo();
                }
                else{
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请填写完整信息", "", "error");
        }
    };

    // 根据选择的起始城市获取结束城市列表
    $scope.getEndCity = function () {
        // $scope.createStartCityInfo为当前选择的数组元素
        _basic.get($host.api_url + "/cityRouteBase?routeStartId=" + $scope.createStartCityInfo.id).then(function (lineData) {
            if (lineData.success === true) {
                $scope.createEndCityList = lineData.result;
            }
            else {
                swal(lineData.msg, "", "error");
            }
        });
    };

    // 点击卡片查看详情
    $scope.showCardDetails = function (roteId,startCity,endCity,distance) {
        $scope.roteId = roteId;
        $scope.startCity = startCity;
        $scope.endCity = endCity;
        $scope.distance = distance;
        $('#modifyModel').modal('open');
    };

    // 修改里程数
    $scope.distanceModify = function () {
        // console.log("$scope.distance",$scope.distance);
        if($scope.distance != ""){
            _basic.put($host.api_url + "/user/" + userId + "/cityRoute/" + $scope.roteId,{
                distance:parseFloat($scope.distance)
            }).then(function (modifyData) {
                if (modifyData.success === true) {
                    swal("修改成功", "", "success");
                    $('#modifyModel').modal('close');
                    $scope.searchLineInfo();
                }
                else {
                    swal(modifyData.msg, "", "error");
                }
            });
        }
        else{
            swal("里程数不能为空", "", "error");
        }
    };

    // 获取所有数据
    $scope.queryData = function () {
        $scope.getCityList();
        $scope.searchLineInfo();
    };
    $scope.queryData()

}]);