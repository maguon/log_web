/**
 * Created by ASUS on 2017/9/25.
 */
Login_model.controller("retrieve_password_controller", ["$state", "$scope", "$q", "$interval", "_basic", "$host", function ($state, $scope, $q, $interval, _basic, $host) {
    $scope.mobileRegx = "^1(3[0-9]|4[57]|5[0-35-9]|7[01678]|8[0-9])\\d{8}$";

    // 返回上一级
    $scope.return = function () {
        $state.go("common_login");
        $scope.submitted = false;
        $scope.phoneNum = "";
        $scope.newPsw = "";
        $scope.ConfirmNewPsw = "";
        $scope.verificationCode = "";
    };

    // 发送手机验证码
    $scope.sendVerificationCode = function () {
        if (/^1(3[0-9]|4[57]|5[0-35-9]|7[01678]|8[0-9])\d{8}$/.test($scope.phoneNum)) {
            var timeCount = 60;
            _basic.post($host.api_url + "/phone/" + $scope.phoneNum + "/passwordSms", {}).then(function (data) {
                if (data.success === true) {
                    swal("验证码已发送", "", "success");
                    $("#sendVerification").attr("disabled", true);
                    var countDown = $interval(function () {
                        if (timeCount > 0) {
                            timeCount--;
                            $scope.btnTip = "(" + timeCount + ")";
                        }
                        else{
                            $scope.btnTip = "";
                            $interval.cancel(countDown);
                            $("#sendVerification").attr("disabled", false);
                        }
                    }, 1000);

                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else {
            swal("请填写有效手机号！", "", "error");
        }
    };


    // 点击提交按钮
    $scope.retrieve_password = function (valid) {
        $scope.submitted = true;
        if ($scope.newPsw === $scope.confirmNewPsw) {
            if (valid) {
                var obj = {
                    captcha:$scope.verificationCode,
                    password:$scope.confirmNewPsw
                };
                _basic.put($host.api_url + "/phone/" + $scope.phoneNum + "/password", obj).then(function (data) {
                    if (data.success == true) {
                        swal("密码重置成功", "", "success");
                        $scope.phoneNum = "";
                        $scope.verificationCode = "";
                        $scope.newPsw = "";
                        $scope.confirmNewPsw = "";
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                })
            }
            else {
                swal("信息有误，请重新填写", "", "error");
            }
        }
        else {
            swal("两次密码输入不一致！", "", "error");
        }

    };
}]);