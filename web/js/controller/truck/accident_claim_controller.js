app.controller("accident_claim_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    $scope.start = 0;
    $scope.size = 20;

    // 获取所有保险公司
    $scope.getInsureCompanyList = function () {
        _basic.get($host.api_url + "/truckInsure").then(function (data) {
            if (data.success === true) {
                // console.log("data",data);
                $scope.insureCompanyList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取事故理赔列表
    $scope.getDamageClaimList = function () {
        _basic.get($host.api_url + "/truckAccidentInsure?" + _basic.objToUrl({
            accidentInsureId: $scope.compensateNum,
            insureType: $scope.insuranceType,
            insureId: $scope.insuranceCompany,
            createdOnStart: $scope.claimStartTimeStart,
            createdOnEnd: $scope.claimStartTimeEnd,
            financialLoanStatus: $scope.financialLoan,
            insurePlanStart: $scope.paymentMoneyStart,
            insurePlanEnd: $scope.paymentMoneyEnd,
            insureStatus: $scope.handleStatus,
            completedDateStart: $scope.paymentSettlementTimeStart,
            completedDateEnd: $scope.paymentSettlementTimeEnd,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
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
                $scope.damageClaimList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击按钮进行查询
    $scope.searchDamageClaimList = function () {
        $scope.start = 0;
        $scope.getDamageClaimList();
    };

    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - $scope.size;
        $scope.getDamageClaimList();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + $scope.size;
        $scope.getDamageClaimList();
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getInsureCompanyList();
        $scope.searchDamageClaimList();
    };
    $scope.queryData();
}]);