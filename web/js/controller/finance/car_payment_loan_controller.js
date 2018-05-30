app.controller("car_payment_loan_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope, $state, $stateParams, _basic, _config, $host) {
    $scope.start = 0;
    $scope.size = 11;
    // 获取所有经销商car
     function getreceiveName () {
        _basic.get($host.api_url + "/receive").then(function (receiveData) {
            if (receiveData.success === true) {
                $scope.receiveNameList = receiveData.result;
            }
            else {
                swal(receiveData.msg, "", "error");
            }
        })
    };
    // 获取商品车理赔打款管理列表
    $scope.getPaymentLoanList = function () {
        _basic.get($host.api_url + "/damageCheckIndemnity?" + _basic.objToUrl({
            damageId: $scope.damageId,
            indemnityStatus: $scope.indemnityStatus,
            applyUserName: $scope.applyUserName,
            planMoneyStart: $scope.planMoneyStart,
            planMoneyEnd: $scope.planMoneyEnd,
            receiveName: $scope.receiveName,
            applyDateStart: $scope.applyDateStart,
            applyDateEnd: $scope.applyDateEnd,
            indemnityDateStart: $scope.indemnityDateStart,
            indemnityDateEnd: $scope.indemnityDateEnd,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.paymentLoanList = $scope.boxArray.slice(0, 10);
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
    $scope.searchPaymentLoanList = function () {
        $scope.start = 0;
        $scope.getPaymentLoanList();
    };

    // 分页
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.getPaymentLoanList();
    };

    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.getPaymentLoanList();
    };

    // 获取数据
    $scope.queryData = function () {
        getreceiveName();
        $scope.searchPaymentLoanList();
    };
    $scope.queryData();

}])