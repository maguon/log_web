/**
 * Created by zcy on 2017/6/23.
 */
app.controller("car_statistics_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {
    $('ul.tabs').tabs();
    $scope.flag = true;
    $scope.listInfo = [];
    $scope.allCity = [];

    $scope.queryData = function () {
        _basic.get($host.api_url + "/carRouteEndCount").then(function (cityData) {
            if (cityData.success === true) {
                console.log("cityData:", cityData);
                // $scope.arr1 = cityData.result;

                // 城市数组转换
                $scope.cityList = {};
                for(var i = 0; i < cityData.result.length; i++){
                    if($scope.cityList[cityData.result[i].route_start] == null){
                        $scope.cityList[cityData.result[i].route_start] = [cityData.result[i]];
                    }
                    else{
                        $scope.cityList[cityData.result[i].route_start].push(cityData.result[i]);
                    }
                }
                console.log("newcityList:",$scope.cityList)
            }
            else {
                swal(cityData.msg, "", "error");
            }

        });

        _basic.get($host.api_url + "/carReceiveCount").then(function (carData) {
            if (carData.success === true) {
                $scope.carreceiveList = carData.result;
                console.log("carData:", carData)
            }
            else {
                swal(carData.msg, "", "error");
            }
        });
    };
    $scope.queryData();

    // 判断点击的标识然后做相应的操作
    $scope.getCity = function () {
        $scope.flag = true;
        $scope.listInfo = [];
        // $scope.listInfo = $scope.cityList;
    };

    $scope.getDestination = function () {
        $scope.flag = true;
        $scope.listInfo = [];
    };

    $scope.getReceive = function () {
        $scope.flag = false;
        $scope.listInfo = $scope.carreceiveList;
    };


}]);