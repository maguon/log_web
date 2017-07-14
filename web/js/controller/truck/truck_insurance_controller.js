/**
 * Created by ASUS on 2017/7/10.
 */
app.controller("truck_insurance_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.submitted = false;
    $scope.company_box_show = false;
    $scope.company_btn = true;

    // 新增保险公司按钮控制
    $scope.company_box = function () {
        $scope.company_btn = false;
        $scope.company_box_show = true;
    };

    // 关闭新增按钮
    $scope.closeCompany = function () {
        $scope.company_box_show = false;
        $scope.company_btn = true;
        $scope.companyText = "";
        $scope.submitted = false;
    };

    // 获取所有保险公司
    $scope.getInsuranceCompany = function () {
        _basic.get($host.api_url + "/truckInsure").then(function (data) {
            if (data.success === true) {
                $scope.insurance_company = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    $scope.getInsuranceCompany();

    // 新增保险公司
    $scope.add_insurance_company = function (iValid) {
        $scope.submitted = true;
        if (iValid) {
            _basic.post($host.api_url + "/user/" + userId + "/truckInsure", {
                insureName: $scope.companyText
            }).then(function (data) {
                if (data.success === true) {
                    // console.log("data", data);
                    $scope.getInsuranceCompany();
                    $scope.companyText = "";
                    $scope.submitted = false;
                    $scope.company_box_show = false;
                    $scope.company_btn = true;
                    swal("新增成功", "", "success");
                }
            });
        }
    }
}]);