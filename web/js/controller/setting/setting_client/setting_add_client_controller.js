/**
 * Created by ASUS on 2017/6/8.
 */
app.controller("setting_add_client_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {

    $scope.userId = _basic.getSession(_basic.USER_ID);
    $scope.short_name = "";
    $scope.full_name = "";
    $scope.remark = "";

    $scope.create_entrust = function () {
        if ($scope.short_name != "" && $scope.full_name != "") {
            _basic.post($host.api_url + "/user/" + $scope.userId + "/entrust", {
                shortName: $scope.short_name,
                entrustName: $scope.full_name,
                remark: $scope.remark
            }).then(function (data) {
                if (data.success == true) {
                    swal("新增成功", "", "success");
                    $scope.short_name = "";
                    $scope.full_name = "";
                    $scope.remark = "";
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else{
            swal("请填写完整信息", "", "error");
        }

    }
}]);