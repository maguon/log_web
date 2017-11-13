app.controller("damage_declaration_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    // monthPicker日历控件
    $('#report_time_start,#report_time_end').MonthPicker({
        Button: false,
        MonthFormat: 'yy-mm'
    });
    // moment(pastMissionData.result[i].date_id.toString()).format("YYYY-MM-DD");
    $scope.reportTimeStart = "";
    $scope.reportTimeEnd = "";
    $scope.processingStatus = "";
    $scope.vinCode = "";

    // 获取质损列表
    $scope.getDamageInfoList = function () {
        var reportTimeStart = $("#report_time_start").val();
        var reportTimeEnd = $("#report_time_end").val();
        _basic.get($host.api_url + "/damage?" + _basic.objToUrl({
            createdOnStart: reportTimeStart,
            createdOnEnd: reportTimeEnd,
            qualityStatus: $scope.processingStatus,
            vin:$scope.vinCode
        })).then(function (damageData) {
            if (damageData.success === true) {
                // console.log("damageData",damageData);
                $scope.damageList = damageData.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getDamageInfoList()
    };
    $scope.queryData();
}]);