/**
 * Created by ASUS on 2017/7/10.
 * Restructure by zcy on 2018/5/4.
 */
app.controller("truck_position_controller", ["$scope", "_basic", "_config", "baseService", "$host", function ($scope, _basic, _config, baseService, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    var truckGps = [];
    var truckPositionList = [];
    $scope.show_truck_msg = false;

    // 获取车辆位置信息
    $scope.getAllTruckPositionInfo = function () {
        _basic.get($host.record_url + "/user/" + userId + "/truckGps").then(function (data) {
            if (data.success === true) {
                if (data.result.length > 0) {
                    truckGps = data.result;
                    $scope.truckGps = data.result;
                    for (var i = 0; i < data.result.length; i++) {
                        truckPositionList.push([data.result[i].lon,data.result[i].lat,data.result[i].angle])
                    }
                    $scope.showAllTruckPosition();
                }
            }
            else{
                swal(data.msg, "", "error")
            }
        });
    };

    // 显示所有车辆位置
    $scope.showAllTruckPosition = function () {
        var mapObj = new AMap.Map('amap_truck_position', {zoom: 5});
        for(var i = 0; i < truckPositionList.length; i ++){
            marker = new AMap.Marker({
                position: truckPositionList[i],
                map: mapObj,
                icon: "/assets/images/truck_image.png",
                angle: truckPositionList[i][2]  // 方位角
            });
        }
    };

    // 模糊查询匹配车牌号
    $scope.truck_search_map = function () {
        $scope.truckGps = [];
        if ($scope.truck_search_text != "") {
            for (var i = 0; i < truckGps.length; i++) {
                if (truckGps[i].vhe_no.indexOf($scope.truck_search_text) != -1) {
                    $scope.truckGps.push(truckGps[i])
                }
            }
        }
        else{
            $scope.truckGps = truckGps;
            $scope.showAllTruckPosition();
        }
    };

    // 点击搜索结果
    $scope.search_map = function (lon, lat, angle, No, phone, time) {
        $scope.showCurrentTruckPosition(lon, lat, angle);
        _basic.get($host.api_url + "/truckFirst?truckNum=" + No).then(function (data) {
            if (data.success == true) {
                $scope.dirve_msg = data.result[0];
                $scope.No = No;
                $scope.truck_search_text = No;
                $scope.phone = phone;
                $scope.time = time;
            }
        });
        $scope.show_truck_msg = true;
    };

    // 显示具体某个车辆位置
    $scope.showCurrentTruckPosition = function (lon, lat ,angle) {
        var marker, map = new AMap.Map("amap_truck_position", {
            resizeEnable: true,
            center: baseService.transformMarkerPosition(lon, lat),
            zoom: 14
        });
        if (marker) {
            return;
        }
        marker = new AMap.Marker({
            icon: "/assets/images/truck_image.png",
            position: baseService.transformMarkerPosition(lon, lat),
            angle: angle  // 方位角
        });
        marker.setMap(map);
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getAllTruckPositionInfo();
    };
    $scope.queryData();

}]);