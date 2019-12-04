/**
 * Created by zcy on 2017/6/21.
 */
app.controller("data_dictionary_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {
    $('ul.tabs').tabs();
    $scope.flag = false;
    $scope.city_details = false;

    // 获取所有数据
    $scope.queryData = function () {
        _basic.get($host.api_url + "/city").then(function (cityData) {
            if (cityData.success === true) {
                $scope.cityList = cityData.result;
                // console.log("city", cityData);
                // 默认显示城市信息
                $scope.getCity();
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });


        _basic.get($host.api_url + "/baseAddr").then(function (dispatchData) {
            if (dispatchData.success === true) {
                $scope.dispatchList = dispatchData.result;
            }
            else {
                swal(dispatchData.msg, "", "error");
            }
        });

        _basic.get($host.api_url + "/entrust").then(function (entrustData) {
            if (entrustData.success === true) {
                $scope.entrustList = entrustData.result;
            }
            else {
                swal(entrustData.msg, "", "error");
            }
        });

        _basic.get($host.api_url + "/receive").then(function (receiveData) {
            if (receiveData.success === true) {
                $scope.receiveList = receiveData.result;
            }
            else {
                swal(receiveData.msg, "", "error");
            }
        });

        _basic.get($host.api_url + "/carMake").then(function (carData) {
            if (carData.success === true) {
                $scope.carbrandList = carData.result;
            }
            else {
                swal(carData.msg, "", "error");
            }
        })
        _basic.get($host.api_url + "/company?operateType=2").then(function (carData) {
            if (carData.success === true) {
                $scope.outsourcingList = carData.result;
            }
            else {
                swal(carData.msg, "", "error");
            }
        })
    };

    $scope.queryData();

    // 点击后加上标识，并让循环的列表等于指定类下的信息
    $scope.getCity = function () {
        $scope.clickStatus = "city";
        $scope.flag = false;
        $scope.city_details = false;
        $scope.listInfo = $scope.cityList;
    };

    $scope.getEntrust = function () {
        $scope.clickStatus = "entrust";
        $scope.flag = true;
        $scope.city_details = false;
        $scope.listInfo = $scope.entrustList;
    };

    $scope.getReceive = function () {
        $scope.clickStatus = "receive";
        $scope.flag = true;
        $scope.city_details = true;
        $scope.listInfo = $scope.receiveList;
    };

    $scope.getBrand = function () {
        $scope.clickStatus = "car";
        $scope.flag = false;
        $scope.city_details = false;
        $scope.listInfo = $scope.carbrandList;
    };

    $scope.getDispatchName = function () {
        $scope.clickStatus = "dispatch";
        $scope.city_details = false;
        $scope.flag = false;
        $scope.listInfo = $scope.dispatchList;
    };
    $scope.getOutsourcing = function () {
        $scope.clickStatus = "outsourcing";
        $scope.city_details = false;
        $scope.flag = false;
        $scope.listInfo = $scope.outsourcingList;
    };

    // $scope.listInfo = [];

    // 判断当前在哪个类下进行的操作，然后根据输入的关键字筛选指定分类下的信息
    $scope.updateList = function () {
        $scope.listInfo = [];
        // console.log("clickStatus:",$scope.clickStatus);
        // console.log("keyword",$scope.keyWord);
        if ($scope.clickStatus === "city") {
            if ($scope.keyWord != "") {
                for (var i = 0; i < $scope.cityList.length; i++) {
                    if (($scope.cityList[i].city_name).indexOf($scope.keyWord) !== -1) {
                        $scope.listInfo.push($scope.cityList[i]);
                    }
                }
            }
            else {
                $scope.listInfo = $scope.cityList;
            }
            // console.log("listInfo", $scope.listInfo);
        }

        if ($scope.clickStatus === "dispatch") {
            if ($scope.keyWord != "") {
                for (var d = 0; d < $scope.dispatchList.length; d++) {
                    if (($scope.dispatchList[d].addr_name).indexOf($scope.keyWord) !== -1) {
                        $scope.listInfo.push($scope.dispatchList[d]);
                    }
                }
            }
            else {
                $scope.listInfo = $scope.dispatchList;
            }
            // console.log("listInfo", $scope.listInfo);
        }

        if ($scope.clickStatus === "entrust") {
            if ($scope.keyWord != "") {
                for (var a = 0; a < $scope.entrustList.length; a++) {
                    if (($scope.entrustList[a].entrust_name).indexOf($scope.keyWord) !== -1 || ($scope.entrustList[a].short_name).indexOf($scope.keyWord) !== -1) {
                        $scope.listInfo.push($scope.entrustList[a]);
                    }
                }
            }
            else {
                $scope.listInfo = $scope.entrustList;
            }
        }

        if ($scope.clickStatus === "receive") {
            if ($scope.keyWord != "") {
                for (var c = 0; c < $scope.receiveList.length; c++) {
                    if (($scope.receiveList[c].receive_name).indexOf($scope.keyWord) !== -1 || ($scope.receiveList[c].short_name).indexOf($scope.keyWord) !== -1) {
                        $scope.listInfo.push($scope.receiveList[c]);
                    }
                }
            }
            else {
                $scope.listInfo = $scope.receiveList;
            }
        }

        if ($scope.clickStatus === "car") {
            if ($scope.keyWord != "") {
                for (var b = 0; b < $scope.carbrandList.length; b++) {
                    if (($scope.carbrandList[b].make_name).indexOf($scope.keyWord) !== -1) {
                        $scope.listInfo.push($scope.carbrandList[b]);
                    }
                }
            }
            else {
                $scope.listInfo = $scope.carbrandList;
            }
        }
        if ($scope.clickStatus === "outsourcing") {
            if ($scope.keyWord != "") {
                for (var b = 0; b < $scope.outsourcingList.length; b++) {
                    if (($scope.outsourcingList[b].company_name).indexOf($scope.keyWord) !== -1) {
                        $scope.listInfo.push($scope.outsourcingList[b]);
                    }
                }
            }
            else {
                $scope.listInfo = $scope.carbrandList;
            }
        }
    }
}]);