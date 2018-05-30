app.controller("truck_compensate_loan_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

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

    // 获取货车理赔借款管理列表
    $scope.getCompensateLoanList = function () {
        _basic.get($host.api_url + "/truckAccidentInsureLoan?" + _basic.objToUrl({
            accidentInsureId: $scope.paymentNum,
            insureType: $scope.insureStatus,
            insureId: $scope.insureCompany,
            loanDateStart: $scope.loanStartTime,
            loanDateEnd: $scope.loanEndTime,
            loanStatus: $scope.handleStatus,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.compensateLoanList = $scope.boxArray.slice(0, 10);
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
    
    // 点击搜索按钮
    $scope.searchCompensateLoanList = function () {
        $scope.start = 0;
        $scope.getCompensateLoanList();
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
        $scope.getCompensateLoanList();
    };
    $scope.queryData();
}]);