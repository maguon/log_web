/**
 * Created by ASUS on 2017/6/8.
 */
app.controller("setting_client_details_controller", ["$scope", "_basic", "$stateParams", "_config", "$host", function ($scope, _basic, $stateParams, _config, $host) {
    $scope.userId = _basic.getSession(_basic.USER_ID);
    // 设置文本框默认值
    $scope.short_name = $stateParams.short_name;
    $scope.full_name = $stateParams.entrust_name;
    $scope.remark = "";
    var val = $stateParams.id;

    // 修改委托方信息
    $scope.entrust_modify = function () {
        if ($scope.short_name != "" && $scope.full_name != "") {
            _basic.put($host.api_url + "/user/" + $scope.userId + "/entrust/" + val, {
                shortName: $scope.short_name,
                entrustName: $scope.full_name,
                remark: $scope.remark
            }).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    $scope.short_name = "";
                    $scope.full_name = "";
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

    }

}]);