/**
 * Created by zcy on 2017/7/12.
 */
app.controller("truck_driver_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {

    // 点击搜索指定司机信息
    $scope.searchDriver = function () {
        _basic.get($host.api_url + "/drive?" + _basic.objToUrl({
                driveName: $scope.driveName,
                operateType: $scope.driverType,
                companyId: $scope.driverCompany,
                driveStatus: $scope.workStatus,
                tel:$scope.driveTel,
                truckId: $scope.truckNumber,
                licenseType:$scope.drivingLicense,
                licenseDateStart:$scope.verificationStart,
                licenseDateEnd:$scope.verificationEnd
            })).then(function (driveData) {
            if (driveData.success === true) {
                $scope.driveList = driveData.result;
                // console.log("driveData", driveData);
            }
            else {
                swal(driveData.msg, "", "error");
            }
        });
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