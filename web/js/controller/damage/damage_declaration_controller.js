app.controller("damage_declaration_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    $scope.start = 0;
    $scope.size = 20;
    $scope.processingStatus = "";
    $scope.vinCode = "";

    // 获取质损列表
    $scope.getDamageInfoList = function () {
        _basic.get($host.api_url + "/damage?" + _basic.objToUrl({
            createdOnStart: $scope.reportTimeStart,
            createdOnEnd: $scope.reportTimeEnd,
            damageStatus: $scope.processingStatus,
            vin:$scope.vinCode,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (damageData) {
            if (damageData.success === true) {
                if ($scope.start > 0) {
                    $("#pre").show();
                }
                else {
                    $("#pre").hide();
                }
                if (damageData.result.length < $scope.size) {
                    $("#next").hide();
                }
                else {
                    $("#next").show();
                }
                // console.log("damageData",damageData);
                $scope.damageList = damageData.result;
            }
            else {
                swal(damageData.msg, "", "error");
            }
        });
    };

    // 点击按钮进行查询
    $scope.searchDamageInfoList = function () {
        $scope.start = 0;
        $scope.getDamageInfoList();
    };

    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - $scope.size;
        $scope.getDamageInfoList();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + $scope.size;
        $scope.getDamageInfoList();
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.searchDamageInfoList()
    };
    $scope.queryData();
}]);