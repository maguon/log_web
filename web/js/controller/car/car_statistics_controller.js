/**
 * Created by zcy on 2017/6/23.
 */
app.controller("car_statistics_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {
    $('ul.tabs').tabs();
    $scope.flag = true;
    $scope.otherFlag = false;
    $scope.listInfo = [];

    // 获取所有数据
    $scope.queryData = function () {
        // 获取城市数据
        _basic.get($host.api_url + "/carRouteEndCount").then(function (cityData) {
            if (cityData.success === true) {

                // 检测出发城市为null时改为未知
                for (var c = 0; c < cityData.result.length; c++) {
                    if (cityData.result[c].route_start == null) {
                        cityData.result[c].route_start = "未知";
                    }
                    if (cityData.result[c].route_end == null) {
                        cityData.result[c].route_end = "未知";
                    }
                }

                // 城市数据转换
                $scope.cityList = {};
                for (var i = 0; i < cityData.result.length; i++) {
                    if ($scope.cityList[cityData.result[i].route_start] == null) {
                        $scope.cityList[cityData.result[i].route_start] = [cityData.result[i]];
                    }
                    else {
                        $scope.cityList[cityData.result[i].route_start].push(cityData.result[i]);
                    }
                }

                // 计算始发站车辆总数
                for (var dateTime in $scope.cityList) {
                    var num = 0;
                    for (var f = 0; f < $scope.cityList[dateTime].length; f++) {
                        num = num + $scope.cityList[dateTime][f].route_end_count;
                    }
                    $scope.cityList[dateTime].total = num;
                }
                // 初始显示城市信息
                $scope.getCity();
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });

        // 获取指令时间数据
        _basic.get($host.api_url + "/carOrderDateCount").then(function (dateData) {
            if (dateData.success === true) {
                // console.log("dateData",dateData.result);
                // 转换日期格式,并且为日期为null时改为未知
                for (var c = 0; c < dateData.result.length; c++) {
                    // var date = new Date(dateData.result[c].order_date);
                    if (dateData.result[c].order_date == null) {
                        dateData.result[c].order_date = "未知";
                    }

                    if (dateData.result[c].route_start == null) {
                        dateData.result[c].route_start = "未知";
                    }

                    if (dateData.result[c].route_end == null) {
                        dateData.result[c].route_end = "未知";
                    }

                }

                // 指令时间数据转换
                $scope.dateList = {};
                for (var a = 0; a < dateData.result.length; a++) {
                    if ($scope.dateList[dateData.result[a].order_date] == null) {
                        $scope.dateList[dateData.result[a].order_date] = [dateData.result[a]];
                    }
                    else {
                        $scope.dateList[dateData.result[a].order_date].push(dateData.result[a]);
                    }
                }
                // console.log("dateList",$scope.dateList);

                // 计算指令时间车辆总数
                for (var dateTime in $scope.dateList) {
                    var num = 0;
                    for (var f = 0; f < $scope.dateList[dateTime].length; f++) {
                        num = num + $scope.dateList[dateTime][f].route_end_count;
                    }
                    $scope.dateList[dateTime].total = num;
                }

            }
            else {
                swal(dateData.msg, "", "error");
            }
        });

        // 获取经销商数据
        _basic.get($host.api_url + "/carReceiveCount").then(function (carData) {
            if (carData.success === true) {
                // console.log("carData:", carData);
                for (var b = 0; b < carData.result.length; b++) {
                    if (carData.result[b].short_name == null) {
                        carData.result[b].short_name = "未知";
                    }
                    if (carData.result[b].route_start == null) {
                        carData.result[b].route_start = "未知";
                    }
                }
                $scope.carreceiveList = carData.result;
            }
            else {
                swal(carData.msg, "", "error");
            }
        });
    };
    $scope.queryData();

    // 判断点击的标识然后做相应的操作
    $scope.getCity = function () {
        $scope.clickStatus = "city";
        $scope.flag = true;
        $scope.otherFlag = false;
        $scope.listInfo = $scope.cityList;
        // console.log("cityList",$scope.cityList);
    };

    $scope.getDestination = function () {
        $scope.clickStatus = "destination";
        $scope.flag = true;
        $scope.otherFlag = false;
        $scope.listInfo = $scope.dateList;
        // console.log("dateList",$scope.dateList);
    };

    $scope.getReceive = function () {
        $scope.clickStatus = "receive";
        $scope.flag = false;
        $scope.otherFlag = true;
        $scope.listInfo = $scope.carreceiveList;
    };


}]);