/**
 * Created by ASUS on 2017/6/8.
 */
app.controller("setting_client_details_controller", ["$scope", "_basic", "$stateParams", "_config", "$host", function ($scope, _basic, $stateParams, _config, $host) {
    $scope.userId = _basic.getSession(_basic.USER_ID);
    var entrustId = $stateParams.id;

    // 修改委托方信息
    $scope.updateEntrust = function () {
        if ($scope.shortName != "" && $scope.fullName != "") {
            _basic.put($host.api_url + "/user/" + $scope.userId + "/entrust/" + entrustId, {
                shortName: $scope.shortName,
                entrustName: $scope.fullName,
                remark: $scope.remark
            }).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    $scope.shortName = "";
                    $scope.fullName = "";
                    $scope.remark = "";
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else {
            swal("请填写完整信息", "", "error");
        }

    };

    // 获取指定委托方信息
    $scope.getEntrustInfo = function () {
        _basic.get($host.api_url + "/entrust?entrustId=" + entrustId).then(function (data) {
            if (data.success === true) {
                console.log("data:", data);
                $scope.shortName = data.result[0].short_name;
                $scope.fullName = data.result[0].entrust_name;
                $scope.remark = data.result[0].remark;
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    };
    $scope.getEntrustInfo();

}]);