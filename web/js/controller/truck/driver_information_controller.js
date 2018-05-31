app.controller("driver_information_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    $scope.start = 0;
    $scope.size = 11;

    // 获取所有公司列表
    $scope.getCompanyList = function () {
        _basic.get($host.api_url + "/company").then(function (data) {
            if (data.success === true) {
                $scope.companyList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取司机信息
    $scope.getDriverInfoList = function () {
        _basic.get($host.api_url + "/drive?" + _basic.objToUrl({
            operateType: $scope.carType,
            companyId: $scope.insureCompany,
            driveName: $scope.driverName,
            truckNum: $scope.mainDrive,
            trailNum: $scope.associatedTrailer,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.damageClaimList = $scope.boxArray.slice(0, 10);
                if ($scope.start > 0) {
                    $("#pre").show();
                }
                else {
                    $("#pre").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#next").hide();
                }
                else {
                    $("#next").show();
                }
                $scope.driverInfoList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击查询
    $scope.searchDriverInfoList = function () {
        $scope.start = 0;
        $scope.getDriverInfoList();
    };

    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.getDriverInfoList();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.getDriverInfoList();
    };


    // 获取数据
    $scope.queryData = function () {
        $scope.getCompanyList();
        $scope.getDriverInfoList();
    };
    $scope.queryData();
}]);