/**
 * Created by zcy on 2017/7/12.
 */
app.controller("truck_driver_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.start = 0;
    $scope.size = 20;

    // 点击搜索指定司机信息
    $scope.searchDriver = function () {
        _basic.get($host.api_url + "/drive?start=" + $scope.start + "&size=" + $scope.size + _basic.objToUrl({
                driveName: $scope.driveName,
                operateType: $scope.driverType,
                companyId: $scope.driverCompany,
                driveStatus: $scope.workStatus,
                tel:$scope.driveTel,
                truckNum: $scope.truckNumber,
                licenseType:$scope.drivingLicense,
                licenseDateStart:$scope.verificationStart,
                licenseDateEnd:$scope.verificationEnd
            })).then(function (driveData) {
            if (driveData.success === true) {
                if ($scope.start > 0) {
                    // $("#pre").removeClass("disabled");
                    $("#pre").show();
                } else {
                    // $("#pre").addClass("disabled");
                    $("#pre").hide();
                }
                if (driveData.result.length < $scope.size) {
                    // $("#next").addClass("disabled");
                    $("#next").hide();
                } else {
                    // $("#next").removeClass("disabled");
                    $("#next").show();
                }
                $scope.driveList = driveData.result;
                // console.log("driveData", driveData);
            }
            else {
                swal(driveData.msg, "", "error");
            }
        });
    };

    // 停用或启用司机
    $scope.disableDriver = function (driverStatus,driverId) {
        if(driverStatus == "1"){
            _basic.put($host.api_url + "/user/" + userId + "/drive/" + driverId + "/driveStatus/0",{}).then(function (disableData) {
                if (disableData.success === true) {
                    $scope.searchDriver();
                    swal("已停用该司机", "", "success");
                }
                else{
                    swal("司机已被关联，请先解绑", "", "error");
                    $scope.searchDriver();
                }
            });
        }
        else{
            _basic.put($host.api_url + "/user/" + userId + "/drive/" + driverId + "/driveStatus/1",{}).then(function (activeData) {
                if (activeData.success === true) {
                    $scope.searchDriver();
                    swal("已启用该司机", "", "success");
                }
                else{
                    swal("司机已被关联，请先解绑", "", "error");
                    $scope.searchDriver();
                }
            });
        }
    };

    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - $scope.size;
        $scope.searchDriver();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + $scope.size;
        $scope.searchDriver();
    };

    // 获取司机及公司信息
    $scope.queryData = function () {
        _basic.get($host.api_url + "/company").then(function (companyData) {
            if (companyData.success === true) {
                $scope.companyList = companyData.result;
                // console.log("companyList",$scope.companyList);
            }
            else {
                swal(companyData.msg, "", "error");
            }
        });

        _basic.get($host.api_url + "/truckFirst?truckType=1").then(function (truckData) {
            if (truckData.success === true) {
                $scope.truckList = truckData.result;
                // console.log("truckData",$scope.truckList);
            }
            else {
                swal(truckData.msg, "", "error");
            }
        });
        // 默认显示所有
        $scope.searchDriver();
    };
    $scope.queryData();
}]);