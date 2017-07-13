/**
 * Created by zcy on 2017/7/13.
 */
app.controller("add_truck_driver_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);

    // 提交司机信息
    $scope.submitForm = function (inValid) {
        console.log("isValid", inValid);
        $scope.submitted = true;
        if (inValid) {
            var driverInfo = {
                driveName: $scope.driveName,
                gender: $scope.driverType,
                idNumber: $scope.identityNum,
                tel: $scope.driverPhone,
                companyId: $scope.driverCompany,
                licenseType: $scope.drivingLicense,
                entryDate: $scope.verificationStartTime,
                address: $scope.driverAddress,
                sibTel: $scope.driverParent,
                licenseDate: $scope.licenseEndTime,
                // driveImage: "666",
                // licenseImage: "888",
                remark: $scope.remark
            };
            _basic.post($host.api_url + "/user/" + userId + "/drive", driverInfo).then(function (data) {
                if (data.success === true) {
                    console.log("successData", data);
                    console.log("info", driverInfo);
                    swal("新增成功", "", "success");
                }
                else {
                    console.log("noData", data);
                    swal(data.msg, "", "error");
                }
            });
        }
    };

    // 获取公司及货车数据
    $scope.queryData = function () {
        _basic.get($host.api_url + "/company").then(function (companyData) {
            if (companyData.success === true) {
                $scope.companyList = companyData.result;
            }
            else {
                swal(companyData.msg, "", "error");
            }
        });

        _basic.get($host.api_url + "/truckFirst?truckType=1").then(function (truckData) {
            if (truckData.success === true) {
                $scope.truckList = truckData.result;
            }
            else {
                swal(truckData.msg, "", "error");
            }
        });
    };
    $scope.queryData();
}]);