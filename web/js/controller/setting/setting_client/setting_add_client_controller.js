/**
 * Created by zcy on 2017/6/8.
 */
app.controller("setting_add_client_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {

    $scope.userId = _basic.getSession(_basic.USER_ID);
    $scope.shortName = "";
    $scope.entrustName = "";
    $scope.remark = "";

    $scope.createEntrust = function () {
        if ($scope.shortName != "" && $scope.entrustName != "") {
            _basic.post($host.api_url + "/user/" + $scope.userId + "/entrust", {
                shortName: $scope.shortName,
                entrustName: $scope.entrustName,
                remark: $scope.remark
            }).then(function (data) {
                if (data.success == true) {
                    swal("新增成功", "", "success");
                    $scope.shortName = "";
                    $scope.entrustName = "";
                    $scope.remark = "";
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
                // .catch(function (e) {
                //     swal("服务器内部错误", "", "error");
                //     console.log(e);
                // });
        }
        else {
            swal("请填写完整信息", "", "error");
        }

    }
}]);