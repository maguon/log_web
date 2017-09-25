/**
 * Created by ASUS on 2017/9/25.
 */
Login_model.controller("retrieve_password_controller", ["$state",'$rootScope', '$scope', '$location', '$q', "_basic", "$host", "_config",

    function ($state,$rootScope, $scope, $location, $q, _basic, $host, _config) {
    $scope.mobileRegx = "^1(3[0-9]|4[57]|5[0-35-9]|7[01678]|8[0-9])\\d{8}$";
            $scope.return=function () {
                $state.go("common_login")
                $scope.submitted=false;
                $scope.phoneNum="";
                $scope.newPsw="";
                $scope.ConfirmNewPsw="";
                $scope.verificationCode="";
            };
        $scope.retrieve_password=function (valid) {
            $scope.submitted=true;
            if(valid&&$scope.newPsw==$scope.confirmNewPsw){
                var obj={
                    "mobile":$scope.phoneNum,
                    "newPassword":$scope.newPsw,
                    "confirmNewPassword":$scope.confirmNewPsw
                };
                _basic.put($host.api_url +"/backPassword", obj).then(function (data) {
                    if (data.success == true) {
                        swal("密码重置成功", "", "success");
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            }
        };
    }]);