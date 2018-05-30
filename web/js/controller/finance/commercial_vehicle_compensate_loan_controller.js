app.controller("commercial_vehicle_compensate_loan_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    $scope.start = 0;
    $scope.size = 11;

    // 获取所有保险公司
    $scope.getInsuranceCompany = function () {
        _basic.get($host.api_url + "/truckInsure").then(function (data) {
            if (data.success === true) {
                $scope.insuranceCompanyList = data.result;
                // console.log("insuranceCompanyList",$scope.insuranceCompanyList)
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取商品车理赔借款管理列表
    $scope.getCommercialLoanList = function () {
        _basic.get($host.api_url + "/damageInsureLoan?" + _basic.objToUrl({
            damageInsureId: $scope.paymentNum,
            insureId: $scope.insureCompany,
            insureUserName: $scope.agentPerson,
            loanStatus: $scope.handleStatus,
            loanMoneyStart: $scope.loanMoneyStart,
            loanMoneyEnd: $scope.loanMoneyEnd,
            loanDateStart: $scope.loanStartTime,
            loanDateEnd: $scope.loanEndTime,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.commercialLoanList = $scope.boxArray.slice(0, 10);
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
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击查询按钮
    $scope.searchCommercialLoanList = function () {
        $scope.start = 0;
        $scope.getCommercialLoanList();
    };

    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.getCompensateLoanList();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.getCompensateLoanList();
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getInsuranceCompany();
        $scope.getCommercialLoanList();
    };
    $scope.queryData();
}]);